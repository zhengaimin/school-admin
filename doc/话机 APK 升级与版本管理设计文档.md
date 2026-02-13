# 话机 APK 升级与版本管理设计文档

## 1. 背景与目标

当前系统已具备"设备拉取待执行命令 + 回传执行结果"的能力（话机使用 `device_commands`），但缺少对"APK 包版本管理、升级过程追踪、设备端版本上报、后台版本展示"的统一设计。

### 1.1 目标

- 支持后台上传与管理话机 APK（版本、变更说明、校验信息）
- 支持按**设备、学校、标签**三种维度进行批量升级下发
- 支持设备端拉取升级指令、下载校验、安装、回传结果
- 支持后台展示：设备当前版本、目标版本、升级状态、失败原因

### 1.2 非目标（本期不做）

- 设备固件/底层系统升级（仅话机 APK）
- 多包联动升级（主 APK + 插件包）
- 灰度发布、定时升级、可选升级
- 版本回滚（Android 默认不支持降级安装）

## 2. 现状分析

### 2.1 现有能力

| 模块 | 现状 |
|------|------|
| 设备版本字段 | `devices` 表已有 `app_version`、`app_version_code` 字段 |
| 命令下发 | 设备通过 `GetCommandList` 拉取命令，`ProcessCommandResult` 回传结果 |
| 文件上传 | `FileService` 支持文件上传，需扩展支持 `.apk` 类型和更大文件 |

### 2.2 需要新增

| 模块 | 说明 |
|------|------|
| APK 包管理 | 新增 `apk_packages` 表存储版本信息 |
| 目标版本配置 | `devices` 表新增 `target_apk_package_id` 字段 |
| 升级命令 | 新增 `GH_COMMAND_UPDATE_APK` 命令类型 |

## 3. 需求说明

### 3.1 APK 包管理

- 上传 APK，记录 `packageName / versionName / versionCode`
- 记录文件大小、SHA256 校验值、变更说明
- 状态管理：草稿(DRAFT) → 已发布(PUBLISHED) → 已下线(DISABLED)
- 只有 `PUBLISHED` 状态的版本才能被选为目标版本

#### 3.1.1 上传约束

| 约束项 | 限制 | 说明 |
|--------|------|------|
| 文件类型 | `.apk` | 仅允许 APK 文件 |
| 文件大小 | ≤ 200MB | 超过则拒绝上传 |
| 校验失败 | 拒绝保存 | SHA256 计算失败时不入库 |

上传流程：
1. 校验文件扩展名为 `.apk`
2. 校验文件大小 ≤ 200MB
3. 计算 SHA256 校验值
4. 解析 APK 获取 `packageName`、`versionName`、`versionCode`
5. 调用 `FileService` 存储文件
6. 写入 `apk_packages` 表

### 3.2 升级范围（一期支持）

| 范围 | 说明 |
|------|------|
| 设备 | 指定设备 ID 列表，支持批量选择 |
| 学校 | 指定学校下的所有设备 |
| 标签 | 带指定标签的所有设备 |

### 3.3 升级策略

- **强制升级**：不提供"允许跳过"选项
- **拉模型**：设备拉取命令时按需生成升级命令，避免一次性写入大量记录

### 3.4 版本号规则

- `versionCode`：整数，用于程序比较（如 `10001 → 10002`）
- `versionName`：字符串，用于展示（如 `1.0.1`）
- 设置目标版本时从已发布的 APK 列表中选择，不允许手填

## 4. 总体方案

### 4.1 核心设计

| 模块 | 方案 |
|------|------|
| 版本管理 | 新增 `apk_packages` 表存储 APK 元信息 |
| 升级配置 | `devices.target_apk_package_id` 存储目标版本 |
| 命令下发 | 设备心跳时按需生成 `GH_COMMAND_UPDATE_APK` 命令 |
| 结果记录 | 复用 `device_commands` 表 |

### 4.2 升级流程

```
管理员设置目标版本 → devices.target_apk_package_id = 123
                            ↓
设备心跳拉取命令 → 服务端检查是否需要升级
                            ↓
              需要升级且无 PENDING 命令 → 创建 UPDATE_APK 命令
                            ↓
设备下载 → 校验 → 安装 → 回传结果
                            ↓
服务端更新命令状态 + 清空目标版本
```

### 4.3 权限设计

#### 4.3.1 权限码定义

| 权限码 | 说明 |
|--------|------|
| `apk:list` | 查看 APK 列表/详情/下载 |
| `apk:create` | 上传 APK |
| `apk:update` | 更新 APK 信息、发布、下线 |
| `apk:delete` | 删除 APK |
| `apk:upgrade` | 设置设备升级目标版本 |

#### 4.3.2 接口权限映射

| 接口 | 方法 | 权限码 |
|------|------|--------|
| `/admin/apk-packages` | GET | `apk:list` |
| `/admin/apk-packages` | POST | `apk:create` |
| `/admin/apk-packages/:id` | GET | `apk:list` |
| `/admin/apk-packages/:id` | PUT | `apk:update` |
| `/admin/apk-packages/:id` | DELETE | `apk:delete` |
| `/admin/apk-packages/:id/publish` | POST | `apk:update` |
| `/admin/apk-packages/:id/disable` | POST | `apk:update` |
| `/admin/apk-packages/:id/download` | GET | `apk:list` |
| `/admin/apk-packages/batch-upgrade` | POST | `apk:upgrade` |

#### 4.3.3 设备端下载

设备端通过 `/open/apk-packages/:id/download` 下载 APK，走 API Key 认证，不需要后台权限码。

### 4.4 关键约束

- 只能选择 `status=PUBLISHED` 的版本作为目标版本
- 设备下载仅限 `PUBLISHED` 状态的 APK
- 强制升级，不提供跳过选项

### 4.5 删除约束

| APK 状态 | 是否允许删除 | 说明 |
|----------|-------------|------|
| DRAFT | ✅ | 未发布，可直接删除 |
| PUBLISHED | ❌ | 必须先下线 |
| DISABLED | ⚠️ | 需检查无引用 |

**DISABLED 状态删除前检查：**
1. 无设备的 `target_apk_package_id` 指向该 APK
2. 无 PENDING 状态的升级命令引用该 APK

若存在引用，返回错误提示，不允许删除。

## 5. 数据模型设计

### 5.1 新增 `apk_packages` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| tenant_id | bigint | 租户ID，0表示平台级 |
| terminal_type | varchar(50) | 设备类型，默认 `TERMINAL_TYPE_GH_02` |
| package_name | varchar(200) | APK包名 |
| version_name | varchar(50) | 版本名，如 `1.0.1` |
| version_code | int | 版本号，用于比较 |
| file_id | bigint | 关联 files 表 |
| file_size | bigint | 文件大小(字节) |
| download_url | varchar(500) | 下载地址，完整URL |
| checksum | varchar(128) | SHA256 校验值 |
| changelog | text | 更新日志 |
| status | varchar(20) | DRAFT/PUBLISHED/DISABLED |
| published_at | timestamp | 发布时间 |
| created_by | bigint | 创建人 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**唯一约束**：`(tenant_id, terminal_type, version_code)`

**状态说明**：
- `DRAFT`：草稿，不可被选为目标版本
- `PUBLISHED`：已发布，可被选为目标版本
- `DISABLED`：已下线，不可被选为目标版本

### 5.2 修改 `devices` 表

新增字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| target_apk_package_id | bigint | 目标APK包ID |

### 5.3 修改 `device_commands` 表

新增字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| apk_package_id | bigint | 目标APK包ID（仅升级命令使用） |

**幂等约束**：同一设备对同一 APK 版本只能有一条 PENDING 状态的命令。

创建命令时使用以下逻辑保证幂等：
```sql
-- 先查询是否存在
SELECT id FROM device_commands
WHERE device_id = ? AND apk_package_id = ? AND status = 'PENDING';

-- 不存在则插入
INSERT INTO device_commands (...) VALUES (...);
```

## 6. 接口设计

### 6.1 APK 包管理接口概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/admin/apk-packages` | 上传APK |
| GET | `/admin/apk-packages` | 列表查询 |
| GET | `/admin/apk-packages/{id}` | 详情 |
| PUT | `/admin/apk-packages/{id}` | 更新APK信息 |
| DELETE | `/admin/apk-packages/{id}` | 删除APK |
| POST | `/admin/apk-packages/{id}/publish` | 发布 |
| POST | `/admin/apk-packages/{id}/disable` | 下线 |
| GET | `/admin/apk-packages/{id}/download` | 后台下载 |
| POST | `/admin/apk-packages/batch-upgrade` | 批量设置升级目标 |

### 6.2 上传 APK

```
POST /admin/apk-packages
```

上传 APK 文件，自动解析版本信息。

**请求参数**（multipart/form-data）：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | APK 文件，≤ 200MB |
| changelog | string | 否 | 更新日志 |

**响应**：

```json
{
  "id": 123,
  "packageName": "com.example.app",
  "versionName": "1.0.1",
  "versionCode": 10001,
  "fileSize": 52428800,
  "checksum": "sha256:abc123...",
  "status": "DRAFT"
}
```

### 6.3 APK 列表查询

```
GET /admin/apk-packages
```

分页查询 APK 列表。

**请求参数**（Query）：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20 |
| status | string | 否 | 状态筛选：DRAFT/PUBLISHED/DISABLED |
| terminalType | string | 否 | 设备类型筛选 |

**响应**：

```json
{
  "total": 100,
  "list": [
    {
      "id": 123,
      "packageName": "com.example.app",
      "versionName": "1.0.1",
      "versionCode": 10001,
      "fileSize": 52428800,
      "status": "PUBLISHED",
      "publishedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 6.4 APK 详情

```
GET /admin/apk-packages/{id}
```

获取 APK 详细信息。

**响应**：

```json
{
  "id": 123,
  "packageName": "com.example.app",
  "versionName": "1.0.1",
  "versionCode": 10001,
  "fileSize": 52428800,
  "downloadUrl": "https://...",
  "checksum": "sha256:abc123...",
  "changelog": "修复若干问题",
  "status": "PUBLISHED",
  "publishedAt": "2024-01-01T00:00:00Z",
  "createdBy": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 6.5 更新 APK 信息

```
PUT /admin/apk-packages/{id}
```

更新 APK 的更新日志等信息（不能修改文件）。

**请求参数**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| changelog | string | 否 | 更新日志 |

### 6.6 删除 APK

```
DELETE /admin/apk-packages/{id}
```

删除 APK，需满足删除约束（见 4.5 节）。

**错误响应**：

| 错误码 | 说明 |
|--------|------|
| 400 | PUBLISHED 状态不允许删除 |
| 400 | 存在设备引用，不允许删除 |

### 6.7 发布 APK

```
POST /admin/apk-packages/{id}/publish
```

将 DRAFT 状态的 APK 发布为 PUBLISHED，发布后可被选为升级目标。

### 6.8 下线 APK

```
POST /admin/apk-packages/{id}/disable
```

将 PUBLISHED 状态的 APK 下线为 DISABLED，下线后不可被选为升级目标。

### 6.9 后台下载 APK

```
GET /admin/apk-packages/{id}/download
```

管理员下载 APK 文件，用于验证。

### 6.10 批量设置升级目标

```
POST /admin/apk-packages/batch-upgrade
```

**请求参数**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| apkPackageId | int64 | 是 | 目标APK包ID |
| scope | string | 是 | 范围：DEVICE/SCHOOL/TAG |
| schoolIds | []int64 | 否 | scope=SCHOOL 时必填，支持多个学校 |
| tagIds | []int64 | 否 | scope=TAG 时必填，支持多个标签 |
| deviceIds | []int64 | 否 | scope=DEVICE 时必填，支持多个设备 |

**响应**：

```json
{
  "affectedCount": 100
}
```

### 6.11 设备端下载接口

```
GET /open/apk-packages/{id}/download
```

设备通过此接口下载 APK 文件。

**鉴权方式**：通过请求中的 SN 码验证设备是否存在，复用现有 open 接口认证机制。

**校验逻辑**：
1. 校验设备 SN 码有效
2. 校验 APK 状态为 PUBLISHED

## 7. 升级命令参数

设备拉取到的 `GH_COMMAND_UPDATE_APK` 命令，`request_data` 结构：

```json
{
  "apkPackageId": 123,
  "versionCode": 10001,
  "versionName": "1.0.1",
  "checksum": "sha256:abc123...",
  "downloadUrl": "https://api.example.com/open/apk-packages/123/download"
}
```

**说明**：
- `downloadUrl` 存储完整 URL，前端上传时提供
- 设备下载后需校验 SHA256

## 8. 核心逻辑：升级命令生成

设备心跳时（`GetCommandList`），服务端执行以下逻辑：

```
1. 检查 device.target_apk_package_id 是否存在
   └─ 不存在 → 跳过

2. 获取目标 APK 包信息
   └─ 状态非 PUBLISHED → 清空目标版本，跳过

3. 比较版本
   └─ device.app_version_code >= target.version_code → 清空目标版本，跳过

4. 幂等检查：是否存在同目标版本的 PENDING 命令
   └─ 存在 → 跳过

5. 创建 UPDATE_APK 命令
```

**并发幂等方案**：创建命令前检查 `(device_id, apk_package_id, status=PENDING)` 是否已存在。

## 9. 异常处理

| 场景 | 处理方式 |
|------|----------|
| 目标版本已下线 | 设备心跳时检测，置空目标版本 |
| 升级成功 | 置空目标版本 |
| 升级失败 | 命令标记 FAILED，置空目标版本 |
| 命令超时 | TTL 48小时，超时后标记 TIMEOUT |
| 设备离线 | 上线后自动检查并创建命令 |

### 9.1 目标版本置空说明

**`target_apk_package_id` 字段含义**：

| 值 | 含义 |
|-----|------|
| 有值（如 123） | 管理员设置了目标版本，设备需要升级到该版本 |
| NULL | 没有目标版本，设备不需要升级 |

**置空操作**：将 `devices.target_apk_package_id` 设置为 `NULL`，表示清除升级任务。

**完整流程示例**：

```
1. 初始状态
   device.target_apk_package_id = NULL
   → 设备心跳时不创建升级命令

2. 管理员设置目标版本
   device.target_apk_package_id = 123
   → 标记设备需要升级到 APK#123

3. 设备心跳
   服务端检查：target_apk_package_id = 123（有值）
   → 创建升级命令，返回给设备

4. 设备升级成功，回传结果
   服务端处理：置空 target_apk_package_id = NULL
   → 清除升级任务

5. 下次设备心跳
   服务端检查：target_apk_package_id = NULL（无值）
   → 不创建命令，因为没有升级任务了
```

**触发时机与位置**：

| 场景 | 触发时机 | 触发位置 | 说明 |
|------|----------|----------|------|
| 升级成功 | 设备回传成功结果时 | `ProcessCommandResult` | 设备安装完成，回传 SUCCESS |
| 升级失败 | 设备回传失败结果时 | `ProcessCommandResult` | 设备安装失败，回传 FAILED |
| 设备版本已达标 | 设备心跳拉取命令时 | `GetCommandList` | 检测到 `app_version_code >= target` |
| 目标包已下线 | 设备心跳拉取命令时 | `GetCommandList` | 检测到 APK `status != PUBLISHED` |

**各场景流程图**：

```
场景1：升级成功/失败
─────────────────────
设备执行升级 → 回传结果 → ProcessCommandResult
                              ↓
                    更新命令状态(SUCCESS/FAILED)
                              ↓
                    置空 device.target_apk_package_id

场景2：设备版本已达标
─────────────────────
设备心跳 → GetCommandList → 检查 target_apk_package_id
                              ↓
              比较 app_version_code >= target.version_code
                              ↓
                    是 → 置空 target_apk_package_id，跳过
                    否 → 继续创建升级命令

场景3：目标包已下线
─────────────────────
设备心跳 → GetCommandList → 检查 target_apk_package_id
                              ↓
                    查询 APK 包状态
                              ↓
              status != PUBLISHED → 置空，跳过
              status == PUBLISHED → 继续创建升级命令
```

## 10. 索引建议

```sql
-- apk_packages
CREATE UNIQUE INDEX uk_apk_packages ON apk_packages(tenant_id, terminal_type, version_code);
CREATE INDEX idx_apk_packages_status ON apk_packages(status);

-- devices
CREATE INDEX idx_devices_target_apk ON devices(target_apk_package_id);

-- device_commands
CREATE INDEX idx_device_commands_apk ON device_commands(device_id, apk_package_id, status);
```
