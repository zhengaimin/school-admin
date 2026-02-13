# APK 错误话术配置设计文档

> 编写日期：2026-02-06  
> 最近更新：2026-02-12  
> 当前版本：v1.1（按《话机 APK 升级与版本管理设计文档》结构重构）

## 1. 背景与目标

当前 APK 端错误提示文案主要依赖本地硬编码，后端返回信息也存在口径不稳定的问题，导致：

- 文案无法快速统一修正
- 租户/学校个性化需求无法配置化支持
- 问题排查时“展示文案”与“原始错误”边界不清

### 1.1 目标

- 支持后台配置 `shrgKey -> message` 的错误话术模板。
- 支持按 **全局 / 租户 / 学校** 三层作用域覆盖。
- APK 启动或收到刷新指令后拉取模板，运行时按 `shrgKey` 命中展示文案。
- `shrgMsg` 保留为原始错误信息，用于日志上报和排障，不直接作为最终用户展示口径。

### 1.2 非目标（本期不做）

- 不改造业务错误码体系，仅在现有错误码基础上增加稳定语义键映射。
- 不引入多终端差异化模板（如 iOS、Web），本期仅支持 `GH_DEVICE_APK`。
- 不实现自动翻译/多语言，当前仅支持中文话术。

## 2. 现状分析

### 2.1 现有能力

| 模块         | 现状                                    |
| ------------ | --------------------------------------- |
| 错误返回     | 已有错误码与错误信息返回能力            |
| 设备控制数据 | Open 侧已有 `getGhControlData` 扩展入口 |
| 命令下发     | 设备已具备拉取命令并执行能力            |

### 2.2 需要新增

| 模块      | 说明                                     |
| --------- | ---------------------------------------- |
| 模板管理  | 新增话术模板表，支持作用域覆盖           |
| 版本管理  | 新增模板版本表，支持按作用域增量更新     |
| 审计能力  | 新增模板变更审计表                       |
| Open 下发 | 新增 `controlType=messageTemplates` 分支 |

## 3. 需求说明

### 3.1 作用域与优先级

同一 `shrgKey` 的生效优先级如下：

1. 学校级：`tenant_id = X AND school_id = Y`
2. 租户级：`tenant_id = X AND school_id IS NULL`
3. 全局级：`tenant_id IS NULL AND school_id IS NULL`

### 3.2 三层语义模型

1. **错误码（code）**：后端细粒度错误标识。
2. **语义键（shrgKey）**：APK 端稳定语义键，用于配置治理和统计归类。
3. **展示文案（templateMsg）**：由 APK 通过 `shrgKey` 命中模板得到。

展示回退策略：

- 优先按 `shrgKey` 命中模板。
- 若未命中，按本地兜底映射处理。
- 最终兜底使用 `shrgMsg`。

### 3.3 管理端能力

- 列表查询（支持按作用域、分类、关键字筛选）
- 编辑模板（乐观锁并发控制）
- 恢复继承（删除当前作用域覆盖，回退上级作用域）
- 批量导出（便于运营校对）
- 审计查询（记录谁在何时改了什么）

### 3.4 设备端能力

- APK 拉取模板配置及版本号。
- 收到 `GH_COMMAND_REFRESH_MESSAGE_TEMPLATE` 后强制刷新本地模板缓存。
- 本地保存 `messageTemplateVersion`，仅做字符串相等比较。

## 4. 总体方案

### 4.1 核心设计

| 模块     | 方案                                    |
| -------- | --------------------------------------- |
| 话术存储 | 新增 `apk_message_templates` 表         |
| 字典版本 | 新增 `apk_message_template_versions` 表 |
| 变更审计 | 新增 `apk_message_template_audits` 表   |
| 生效计算 | 服务端按作用域一次查询+分组择优         |
| 缓存策略 | Redis + APK 本地缓存双层                |

### 4.2 流程概览

```text
后台编辑模板
  -> 事务更新模板记录（或恢复继承）
  -> 更新当前作用域 messageTemplateVersion
  -> 写入审计日志
  -> 删除 Redis 缓存
  -> （可选）下发 GH_COMMAND_REFRESH_MESSAGE_TEMPLATE

APK 启动/心跳
  -> 拉取 messageTemplates + messageTemplateVersion
  -> 对比本地版本
  -> 版本变化则更新本地缓存
  -> 运行时按 shrgKey 命中展示文案
```

### 4.3 关键约束

- `channel` 本期固定 `GH_DEVICE_APK`，但字段保留以兼容未来扩展。
- 同一作用域下 `channel + shrg_key` 仅允许一条有效记录。
- 版本号生成使用毫秒时间戳字符串，便于 APK 低成本比较。

## 5. 数据模型设计

### 5.1 新增 `apk_message_templates` 表

```sql
CREATE TABLE apk_message_templates (
    id BIGSERIAL PRIMARY KEY,
    channel VARCHAR(32) NOT NULL,
    shrg_key VARCHAR(64) NOT NULL,
    tenant_id BIGINT NULL,
    school_id BIGINT NULL,
    category VARCHAR(32) NOT NULL,
    message VARCHAR(512) NOT NULL,
    description VARCHAR(256),
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    version BIGINT NOT NULL DEFAULT 0,
    created_by BIGINT,
    updated_by BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX uk_apk_msg_tpl_global
ON apk_message_templates(channel, shrg_key)
WHERE deleted_at IS NULL AND tenant_id IS NULL AND school_id IS NULL;

CREATE UNIQUE INDEX uk_apk_msg_tpl_tenant
ON apk_message_templates(channel, shrg_key, tenant_id)
WHERE deleted_at IS NULL AND tenant_id IS NOT NULL AND school_id IS NULL;

CREATE UNIQUE INDEX uk_apk_msg_tpl_school
ON apk_message_templates(channel, shrg_key, tenant_id, school_id)
WHERE deleted_at IS NULL AND tenant_id IS NOT NULL AND school_id IS NOT NULL;
```

### 5.2 新增 `apk_message_template_versions` 表

```sql
CREATE TABLE apk_message_template_versions (
    id BIGSERIAL PRIMARY KEY,
    channel VARCHAR(32) NOT NULL,
    tenant_id BIGINT NULL,
    school_id BIGINT NULL,
    version VARCHAR(32) NOT NULL DEFAULT '0',
    updated_by BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_apk_msg_tpl_ver_scope
ON apk_message_template_versions(channel, COALESCE(tenant_id, 0), COALESCE(school_id, 0));
```

### 5.3 新增 `apk_message_template_audits` 表

```sql
CREATE TABLE apk_message_template_audits (
    id BIGSERIAL PRIMARY KEY,
    channel VARCHAR(32) NOT NULL,
    shrg_key VARCHAR(64) NOT NULL,
    scope VARCHAR(20) NOT NULL,
    tenant_id BIGINT NULL,
    school_id BIGINT NULL,
    action VARCHAR(32) NOT NULL,
    before_message VARCHAR(512),
    after_message VARCHAR(512),
    before_effective_scope VARCHAR(20),
    after_effective_scope VARCHAR(20),
    before_version VARCHAR(32),
    after_version VARCHAR(32),
    operator_id BIGINT NOT NULL,
    operator_name VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5.4 版本联动规则

1. 学校级变更：仅更新学校级版本。
2. 租户级变更：仅更新租户级版本，不级联学校级。
3. 全局级变更：仅更新全局级版本，不做全量级联。
4. Open 返回版本时：学校级优先，未命中则租户级，再回退全局级。

## 6. 接口设计

### 6.1 后台管理接口概览

| 方法 | 路径                                              | 说明         |
| ---- | ------------------------------------------------- | ------------ |
| GET  | `/admin/apk-message-templates`                    | 话术列表查询 |
| PUT  | `/admin/apk-message-templates/{id}`               | 更新话术     |
| POST | `/admin/apk-message-templates/{id}/reset-inherit` | 恢复继承     |
| GET  | `/admin/apk-message-templates/export`             | 导出话术     |
| GET  | `/admin/apk-message-template-audits`              | 审计日志查询 |

### 6.2 获取话术列表

```http
GET /admin/apk-message-templates?scope=school&category=DEVICE&keyword=UNREGISTERED&page=1&pageSize=20
```

响应示例：

```json
{
  "total": 1,
  "list": [
    {
      "id": 101,
      "channel": "GH_DEVICE_APK",
      "shrgKey": "DEVICE_UNREGISTERED",
      "category": "DEVICE",
      "message": "设备未注册，请联系管理员完成绑定",
      "effectiveScope": "school",
      "isEnabled": true,
      "version": 3,
      "updatedAt": "2026-02-12T10:00:00Z"
    }
  ]
}
```

### 6.3 更新话术

```http
PUT /admin/apk-message-templates/{id}
```

请求示例：

```json
{
  "message": "设备未注册，请联系学校管理员",
  "description": "开机注册场景提示",
  "version": 3
}
```

### 6.4 恢复继承

```http
POST /admin/apk-message-templates/{id}/reset-inherit
```

语义：删除当前作用域覆盖记录，生效文案回退到上级作用域。

### 6.5 Open 拉取接口（控制数据）

```http
GET /open/device/control-data?controlType=messageTemplates
```

响应示例：

```json
{
  "controlType": "messageTemplates",
  "messageTemplateVersion": "1739349650123",
  "messageTemplates": [
    {
      "shrgKey": "DEVICE_UNREGISTERED",
      "message": "设备未注册，请联系管理员完成绑定"
    },
    {
      "shrgKey": "DEVICE_OFFLINE",
      "message": "设备当前离线，请稍后重试"
    }
  ]
}
```

## 7. 核心逻辑

### 7.1 生效模板查询（一次查询）

```sql
WITH ranked AS (
    SELECT
        t.shrg_key,
        t.message,
        t.tenant_id,
        t.school_id,
        CASE
            WHEN t.tenant_id = :tenant_id AND t.school_id = :school_id THEN 1
            WHEN t.tenant_id = :tenant_id AND t.school_id IS NULL THEN 2
            WHEN t.tenant_id IS NULL AND t.school_id IS NULL THEN 3
            ELSE 9
        END AS scope_rank
    FROM apk_message_templates t
    WHERE t.channel = :channel
      AND t.deleted_at IS NULL
      AND (
        (t.tenant_id = :tenant_id AND t.school_id = :school_id)
        OR (t.tenant_id = :tenant_id AND t.school_id IS NULL)
        OR (t.tenant_id IS NULL AND t.school_id IS NULL)
      )
), picked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY shrg_key ORDER BY scope_rank) AS rn
    FROM ranked
)
SELECT
    shrg_key,
    message AS effective_message,
    CASE scope_rank WHEN 1 THEN 'school' WHEN 2 THEN 'tenant' ELSE 'global' END AS effective_scope
FROM picked
WHERE rn = 1;
```

### 7.2 并发与幂等

- 模板编辑使用 `version` 字段进行乐观锁校验。
- 重复提交可基于 `requestId` + 短时缓存做幂等保护。
- 变更事务要求：模板更新、版本更新、审计写入同事务提交。

### 7.3 缓存策略

- Redis Key：`apk:msg:tpl:{channel}:{tenantId}:{schoolId}`。
- Redis Value：模板列表 + `messageTemplateVersion`。
- 缓存失效：管理端变更后主动删除对应作用域缓存。
- APK 本地缓存：按版本号判断是否刷新。

## 8. 权限与审计

### 8.1 权限码定义

| 权限码                            | 说明         |
| --------------------------------- | ------------ |
| `apk:message-template:view`       | 查看列表     |
| `apk:message-template:edit`       | 编辑话术     |
| `apk:message-template:reset`      | 恢复继承     |
| `apk:message-template:export`     | 导出         |
| `apk:message-template:audit:view` | 查看审计日志 |

### 8.2 二次鉴权规则

- 平台管理员可管理全局/租户/学校。
- 租户管理员不可越权操作其他租户。
- 学校管理员仅可管理本学校作用域。

### 8.3 审计要求

- 必须记录：变更前后文案、变更前后生效作用域、版本号变化、操作人。
- `reset_inherit` 作为独立动作写入审计。

## 9. 异常处理与兼容

### 9.1 错误返回契约

- 后端业务错误返回保持 `code + shrgKey + shrgMsg`。
- APK 展示文案使用本地命中后的 `templateMsg`。
- `shrgMsg` 不参与面向用户展示口径，仅用于日志与排障。

### 9.2 兼容策略

- 对未升级模板能力的 APK，维持 `shrgMsg` 可读性。
- 对缺失 `shrgKey` 的历史链路，允许按 `code` 回退映射。

### 9.3 常见异常

| 场景         | 处理策略                                 |
| ------------ | ---------------------------------------- |
| 版本获取失败 | 回退到上级作用域版本；仍失败则返回 `'0'` |
| 模板拉取超时 | 使用本地缓存，打点告警                   |
| 命中模板为空 | 回退 `shrgMsg`，并记录缺失监控           |

## 10. 开发任务清单

| 阶段 | 任务                                       | 工期     |
| ---- | ------------------------------------------ | -------- |
| A    | DB Migration（模板表/版本表/审计表）       | 0.5~1 天 |
| B    | 后台管理接口（列表、编辑、恢复继承、导出） | 1~1.5 天 |
| C    | Open 接口扩展（`messageTemplates` 分支）   | 0.5 天   |
| D    | 缓存与版本联动（Redis + 命令刷新）         | 0.5 天   |
| E    | 权限、审计、回归测试                       | 1 天     |

## 11. 测试与验收

### 11.1 功能验收项

- 学校级、租户级、全局级覆盖优先级正确。
- 恢复继承后生效文案正确回退。
- 模板变更后版本号更新且 Open 接口返回最新版本。
- 审计日志完整记录关键字段。

### 11.2 关键测试场景

1. 学校级编辑后，学校设备命中新文案，其他学校不受影响。
2. 租户级恢复继承后，回退全局文案。
3. 并发编辑触发乐观锁冲突，返回明确提示。
4. APK 缓存命中旧版本时可正确触发刷新。

## 12. 发布与回滚

### 12.1 发布步骤

1. 执行数据库迁移与索引创建。
2. 发布后台接口与 Open 接口改造。
3. 灰度启用模板拉取能力并观测错误率。
4. 全量启用后下发一次刷新命令确保设备同步。

### 12.2 回滚策略

- 应用回滚：回退服务版本，保留数据库结构不删表。
- 配置回滚：通过恢复继承或批量导入历史模板恢复口径。
- 紧急兜底：APK 侧继续使用本地缓存或 `shrgMsg` 展示。

### 12.3 上线检查清单

- [ ] 迁移脚本已在测试环境验证。
- [ ] 权限点与路由绑定完成。
- [ ] Open 接口已返回 `messageTemplates` 与 `messageTemplateVersion`。
- [ ] 审计日志可查询且字段完整。
- [ ] APK 侧已完成版本比对与本地缓存更新逻辑。
