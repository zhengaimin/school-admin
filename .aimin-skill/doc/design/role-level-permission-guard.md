# role-level-permission-guard 设计文档

## 背景

- 现有“超级管理员”权限放行存在 `roleCode === SUPER_ADMIN_ROLE` 的旧判断。
- 项目当前权限语义以 `roleLevel` 为准，旧判断会造成规则来源不一致。

## 目标

1. 统一使用 `roleLevel` 判断超级管理员权限。
2. 在配置层提供可复用的角色级别判断函数（`super/platform/agent/custom`）。
3. 保持现有业务分支兼容（如 `maintainer` 特殊逻辑不受影响）。

## 方案

1. 在 `src/config/modules/common/role.ts` 新增角色级别判断工具：
   - `isSuperRoleLevel`
   - `isPlatformRoleLevel`
   - `isAgentRoleLevel`
   - `isCustomRoleLevel`
2. 将核心权限放行入口由 `roleCode` 切换为 `roleLevel`：
   - `src/stores/modules/auth.ts`
   - `src/directives/modules/permission.ts`
   - `src/directives/modules/auth.ts`
   - `src/hooks/usePermission.ts`
   - `src/hooks/useAuthButtons.ts`
   - `src/views/moduleSelect/index.vue`
3. 补齐登录用户类型字段 `roleLevel`，降低后续使用 `roleLevel` 的类型成本。

## 风险与约束

1. 若后端返回缺失 `roleLevel`，超级管理员不再自动放行；需保证登录态包含该字段。
2. `SUPER_ADMIN_ROLE` 常量先保留为历史兼容，避免影响其它潜在依赖。

## 对应变更记录

- `.aimin-skill/doc/changes/design/role-level-permission-guard.md`
