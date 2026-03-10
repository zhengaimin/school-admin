# school-admin

## 接口文档

1. https://s.apifox.cn/2cce972c-6727-45f2-b044-5ccafb7ab61a?pwd=cceco2024

## aimin-skill 协作流程

1. 纯咨询（不改仓库）直接回答，不走文档门禁。
2. 可执行事项（需求、bug、改动请求）分配 `ITEM-ID`（`ITEM-YYYYMMDD-序号`）。
3. 代码改动时仅强制两类文档：
   - 归档主档：`.aimin-skill/doc/pages/*` 或 `.aimin-skill/doc/design/*`
   - 快速索引：`.aimin-skill/doc/indexes/pages.md` 或 `.aimin-skill/doc/indexes/design.md`
4. 全局/设计规则变更后，受影响页面主档补充“关联设计（软链接）”。
5. 提交前必须通过门禁：`npm run aimin:gate`。

## 常用命令

1. `npm run aimin:gate`
2. `npm run lint:lint-staged`
3. `npm run git:dual:setup -- --github-url <github-url> --gitlab-url <gitlab-url> --gitlab-remote origin`
4. `npm run git:push:all -- --branch <branch> --gitlab-remote origin`
5. `npm run git:ignore:github`
6. `npm run git:ignore:gitlab`

## 双远端 Git（GitHub + GitLab）

1. 初始化双远端（示例复用当前 `origin` 作为 GitLab 远端）：
   - `npm run git:dual:setup -- --github-url https://github.com/<org>/<repo>.git --gitlab-url https://gitlab.com/<org>/<repo>.git --gitlab-remote origin`
2. 一次推送到两端：
   - `npm run git:push:all -- --branch main --gitlab-remote origin`
3. 两端独立 ignore 模板：
   - GitHub：`.gitignore.github`
   - GitLab：`.gitignore.gitlab`
4. 需要切换当前根 `.gitignore` 时执行：
   - `npm run git:ignore:github` 或 `npm run git:ignore:gitlab`
