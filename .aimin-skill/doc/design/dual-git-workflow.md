# dual-git-workflow 设计文档

## 背景

- 当前仓库仅配置了单远端（`origin` -> GitLab），无法一条命令同步推送到 GitHub + GitLab。
- 根目录仅有一份 `.gitignore`，无法表达“按平台维护独立忽略规则”的协作约束。

## 目标

1. 支持同时维护 GitHub 与 GitLab 两个远端。
2. 提供一条命令将当前分支推送到两个远端。
3. 为两端提供独立 ignore 模板，避免手工维护混乱。

## 方案

1. 新增 `scripts/git-dual-tools.mjs`，提供三个子命令：
   - `setup`：初始化/更新 `github`、`gitlab` 远端 URL。
   - `push-all`：将当前分支依次推送到两个远端。
   - `use-ignore`：根据目标平台切换根 `.gitignore`。
2. 新增 `scripts/git-dual-tools-lib.mjs` 承载纯函数（参数解析、远端动作规划、ignore 模板映射），并以 Node 原生测试覆盖关键逻辑。
3. 新增 `.gitignore.github` 与 `.gitignore.gitlab` 作为独立模板，通过 `use-ignore` 同步到根 `.gitignore`。
4. 在 `package.json` 增加标准命令入口，便于本地与 CI 复用。

## 风险与约束

1. Git 同一条提交无法在两个远端同时持有不同内容的根 `.gitignore`。
2. 本方案以“双模板 + 按目标切换”实现独立维护；若确需两端根 `.gitignore` 永久分叉，需引入分支分流策略。
3. `push-all` 依赖已完成 `setup`，否则会因远端不存在而失败。

## 对应变更记录

- `.aimin-skill/doc/changes/design/dual-git-workflow.md`
