# 文档导航

## 目录约定

- `.aimin-skill/doc/design/`：全局能力、跨模块流程、特殊规则
- `.aimin-skill/doc/pages/`：页面当前有效逻辑与注意点（不写变更流水）
- `.aimin-skill/doc/changes/pages/`：页面变更记录（按页面聚合）
- `.aimin-skill/doc/changes/design/`：设计变更记录（按主题聚合）
- `.aimin-skill/doc/changes/sessions/`：会话时间线日志（按天聚合）
- `.aimin-skill/doc/changes/`：月度变更索引与编号规则

## 执行流程（可执行事项）

1. 先分配 `ITEM-ID`（格式：`ITEM-YYYYMMDD-序号`）。
2. 更新主档：`pages/*` 或 `design/*`。
3. 双轨记录：`changes/sessions/*` + `changes/pages|design/*`。
4. 更新月度索引：`changes/YYYY-MM.md`。
5. 本地运行 `npm run aimin:gate`，通过后再提交代码。

## 月度变更

- [2026-03](./changes/2026-03.md)

## 规则文档

- [事项编号规则（ITEM-ID）](./changes/item-id-rule.md)

## 模板文件

- `.aimin-skill/doc/pages/_template.md`
- `.aimin-skill/doc/design/_template.md`
- `.aimin-skill/doc/changes/pages/_template.md`
- `.aimin-skill/doc/changes/design/_template.md`
- `.aimin-skill/doc/changes/sessions/_template.md`

## 页面主档

- [system/module-select 页面规格](./pages/system/module-select.md)
- [video/devices/manage 页面规格](./pages/video/device-manage.md)

## 流程设计文档

- [aimin-skill 工作流（当前生效）](./design/aimin-skill-workflow-v2.md)
- [双远端 Git 协作工作流](./design/dual-git-workflow.md)
- [文档驱动开发（结合 SuperPowers）设计方案](./design/doc-driven-superpowers-workflow-design.md)
- [Doc-Driven SuperPowers Workflow Implementation Plan](./design/doc-driven-superpowers-workflow-implementation-plan.md)
- [角色级别权限判断规范](./design/role-level-permission-guard.md)
