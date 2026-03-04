# aimin-skill 工作流（当前生效）

**日期：** 2026-03-04  
**状态：** Approved  
**适用范围：** `school-admin` 全仓库

---

## 1. 目标

1. 统一使用 `.aimin-skill` 承载协作上下文与文档。
2. 所有可执行事项（需求、bug、改动请求）先编号、后开发。
3. 对代码改动实施文档硬门禁，避免“只改代码不回写文档”。

## 2. 目录规范

1. 主档：
   - `.aimin-skill/doc/pages/*`
   - `.aimin-skill/doc/design/*`
2. 变更明细：
   - `.aimin-skill/doc/changes/pages/*`
   - `.aimin-skill/doc/changes/design/*`
3. 会话日志：
   - `.aimin-skill/doc/changes/sessions/YYYY-MM-DD.md`
4. 月度索引：
   - `.aimin-skill/doc/changes/YYYY-MM.md`

## 3. 编号规则

1. `ITEM-ID` 格式：`ITEM-YYYYMMDD-序号`。
2. 每个可执行事项必须先分配 `ITEM-ID`，再进入开发。
3. 同一事项在会话日志与变更明细中必须使用同一个 `ITEM-ID`。

## 4. 强制流程

1. 先更新主档，再开始实现。
2. 改代码时，必须同步更新：
   - 主档（`pages|design` 至少一个）
   - 变更明细（`changes/pages|design` 至少一个）
   - 会话日志（`changes/sessions/YYYY-MM-DD.md`）
   - 月度索引（`changes/YYYY-MM.md`）
3. 未满足以上任一项，禁止提交/合并。

## 5. 门禁实现

1. 脚本：`scripts/check-aimin-skill-gate.mjs`
2. 本地命令：`npm run aimin:gate`
3. pre-commit：先执行 `aimin:gate`，再执行 `lint:lint-staged`
4. CI：`.gitlab-ci.yml` 中 `doc_gate` job 执行同一脚本

## 6. 读取顺序（降低上下文成本）

1. `.aimin-skill/doc/index.md`
2. `.aimin-skill/doc/changes/YYYY-MM.md`
3. 目标页面/设计主档
4. 对应 `changes/pages|design` 与当天 `changes/sessions` 局部片段
