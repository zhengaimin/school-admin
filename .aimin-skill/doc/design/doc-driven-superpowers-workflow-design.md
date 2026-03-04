# 文档驱动开发（结合 SuperPowers）设计方案

> 说明：本文为历史设计稿。当前执行流程以 `./aimin-skill-workflow-v2.md` 与 `../changes/item-id-rule.md` 为准。

**日期：** 2026-03-03  
**状态：** Approved  
**目标：** 建立“先文档、后开发、变更必回写、硬门禁”的团队工作流，并支持多 agent 并发。

---

## 1. 背景与目标

当前项目已有较多设计文档，但缺少统一的变更流转与并发协作规范，导致以下问题：

1. 需求、bug、代码三者关联关系不稳定。
2. 多 agent 并发时容易写入同一文件产生冲突。
3. 历史文档不断变长，单次会话 token 成本偏高。

本方案目标：

1. 文档成为需求与变更的唯一协作入口。
2. 任何代码改动都必须关联文档更新（硬门禁）。
3. bug 修复经过业务确认后必须归档并沉淀为提醒。
4. 在满足“页面/设计聚合文件”前提下控制 token 消耗。

---

## 2. 约束与原则

已确认约束：

1. 使用 SuperPowers skills 组织流程。
2. 不把测试设为主流程硬要求，但保留可选测试流程。
3. bug 需按“页面/设计”区分。
4. bug 文件采用“每个页面/设计一个聚合文件”而非单 bug 文件。
5. 采用“聚合主档 + 月度变更索引”（方案 2）。

流程原则：

1. 先更新文档，再开始实现。
2. 变更记录最小化：主档存结论，索引存摘要。
3. 单次会话优先读取索引和目标文档，避免全量加载历史。

---

## 3. 信息架构（目录）

```text
doc/
  index.md
  design/
    <topic>.md
  pages/
    <module>/<page>.md
  bugs/
    design/<topic>.md
    pages/<module>/<page>.md
  changes/
    YYYY-MM.md
```

说明：

1. `design/` 与 `pages/` 是需求与规则主档。
2. `bugs/` 是聚合问题台账，按作用域拆分。
3. `changes/YYYY-MM.md` 仅保存摘要、状态、链接，用于低 token 导航。
4. `index.md` 仅导航与简述，不放长正文。

---

## 4. 命名与状态规范

命名规范：

1. `<topic>/<module>/<page>` 使用稳定英文标识（示例：`permission-role`、`system/user-list`）。
2. bug 唯一编号：`BUG-YYYYMM-序号`（示例：`BUG-202603-017`）。
3. 需求编号建议：`REQ-YYYYMM-序号`。

状态机：

1. bug：`open -> fixed -> verified -> archived`
2. req：`draft -> approved -> in_progress -> done -> archived`

归档规则：

1. 仅在业务确认（用户确认）后，bug 才允许进入 `archived`。
2. 归档时必须把“经验提醒”回写到对应 `design/` 或 `pages/` 主档。

---

## 5. SuperPowers Skill 绑定流程

1. 会话入口：`using-superpowers`
2. 需求变更：`brainstorming -> writing-plans -> (subagent-driven-development | executing-plans)`
3. bug 处理：`systematic-debugging`
4. 完成前验证：`verification-before-completion`
5. 评审闭环：`requesting-code-review / receiving-code-review`
6. 分支收尾：`finishing-a-development-branch`

约束：

1. 未完成文档更新时，不进入代码实现。
2. 未通过验证时，不声明完成。

---

## 6. 硬门禁（强制执行）

每次需求/bug 改动必须满足：

1. 更新 `doc/pages/*` 或 `doc/design/*` 中至少一个主档。
2. 更新对应 `doc/bugs/*` 聚合文件（若为 bug）。
3. 更新当月 `doc/changes/YYYY-MM.md` 摘要记录。

不满足以上任一项时：

1. 提交或 PR 判定为不合规。
2. 不允许进入合并阶段。

---

## 7. 模板规范

### 7.1 Bug 聚合模板（`doc/bugs/.../*.md`）

```md
# <scope> Bug 聚合

## 活跃问题

| bug_id | 标题 | 来源 | 状态 | owner | 提出日期 | 关联需求 | 代码PR/提交 |
| ------ | ---- | ---- | ---- | ----- | -------- | -------- | ----------- |

## 已归档（最近30条）

| bug_id | 标题 | 结论 | 归档日期 | 沉淀到文档 |
| ------ | ---- | ---- | -------- | ---------- |
```

### 7.2 月度变更索引模板（`doc/changes/YYYY-MM.md`）

```md
# YYYY-MM 变更索引

| 日期 | 类型(req/bug) | 作用域(design/page) | 主题 | 状态 | 链接 |
| ---- | ------------- | ------------------- | ---- | ---- | ---- |
```

---

## 8. Token 控制策略

1. 会话默认读取顺序：`doc/index.md -> doc/changes/YYYY-MM.md -> 目标文档局部片段`。
2. 历史 bug 只在需要追溯时打开，不默认加载。
3. 主档保留“最终结论”，过程细节放在月度索引或提交记录。
4. 每个聚合文档维持固定表头，新增内容只追加一行，避免大段叙述。

---

## 9. 日常执行口令（面向终端协作）

需求示例：

1. “新增需求：`system/user-list` 页面增加 xxx 字段，先同步文档再开始开发。”

bug 示例：

1. “提交 bug：`pages/system/user-list`，现象 xxx，先登记到聚合文档并进入 open。”
2. “该 bug 验证通过，请归档并把提醒同步到页面主档。”

---

## 10. 非目标

本方案不覆盖：

1. 具体测试框架改造（仅定义可选测试流，不强制接入）。
2. 自动化文档生成（当前为人工维护 + 门禁约束）。
3. 历史老文档一次性重构（采用渐进迁移）。

---

## 11. 可选测试流程（非硬门禁）

1. 轻量：页面自测 + 关键路径回归。
2. 标准：轻量 + 受影响模块自动化测试。
3. 严格：标准 + 跨模块回归清单（核心权限或全局能力）。
