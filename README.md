# school-admin

## 接口文档

1. https://s.apifox.cn/2cce972c-6727-45f2-b044-5ccafb7ab61a?pwd=cceco2024

## aimin-skill 协作流程

1. 可执行事项（需求、bug、改动请求）先分配 `ITEM-ID`，格式 `ITEM-YYYYMMDD-序号`。
2. 开发前先更新主档：`.aimin-skill/doc/pages/*` 或 `.aimin-skill/doc/design/*`。
3. 同步写入双轨变更：
   - `.aimin-skill/doc/changes/sessions/YYYY-MM-DD.md`
   - `.aimin-skill/doc/changes/pages/*.md` 或 `.aimin-skill/doc/changes/design/*.md`
4. 更新月度索引：`.aimin-skill/doc/changes/YYYY-MM.md`。
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
