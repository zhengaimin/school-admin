# Doc-Driven SuperPowers Workflow Implementation Plan

> Note: This plan is historical. Current active process and path conventions are in `./aimin-skill-workflow-v2.md`.

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在当前仓库落地“文档驱动 + 硬门禁”流程，确保任何代码改动都关联文档更新，并支持多 agent 并发。

**Architecture:** 采用“主档聚合 + 月度索引”结构：`doc/pages|design` 承载结论，`doc/bugs` 承载问题流转，`doc/changes/YYYY-MM.md` 承载摘要索引。通过 `scripts/check-doc-gate.mjs` 实现本地（husky）与 CI 双重门禁。

**Tech Stack:** Node.js, Husky, Git, GitLab CI, Markdown

---

### Task 1: 建立文档目录与索引骨架

**Files:**

- Create: `doc/index.md`
- Create: `doc/design/README.md`
- Create: `doc/pages/README.md`
- Create: `doc/bugs/design/README.md`
- Create: `doc/bugs/pages/README.md`
- Create: `doc/changes/2026-03.md`

**Step 1: 写入最小模板内容**

```md
# 文档导航

## 1) 设计方案

- 目录：`doc/design/`

## 2) 页面规格

- 目录：`doc/pages/`

## 3) Bug 聚合

- 设计：`doc/bugs/design/`
- 页面：`doc/bugs/pages/`

## 4) 月度变更索引

- `doc/changes/2026-03.md`
```

**Step 2: 运行目录检查**

Run: `find doc -maxdepth 3 -type f | sort`  
Expected: 能看到以上 6 个新文件。

**Step 3: Commit**

```bash
git add doc/index.md doc/design/README.md doc/pages/README.md doc/bugs/design/README.md doc/bugs/pages/README.md doc/changes/2026-03.md
git commit -m "docs: scaffold doc-driven structure and monthly index"
```

### Task 2: 初始化聚合文档模板（页面/设计）

**Files:**

- Create: `doc/pages/system/user-list.md`
- Create: `doc/design/permission-role.md`
- Create: `doc/bugs/pages/system/user-list.md`
- Create: `doc/bugs/design/permission-role.md`

**Step 1: 写入页面主档模板**

```md
# system/user-list 页面规格

## 页面目标

## 字段与交互

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |

## 特殊逻辑

## 变更记录

| id  | 类型 | 摘要 | 状态 | 日期 | 链接 |
| --- | ---- | ---- | ---- | ---- | ---- |
```

**Step 2: 写入 Bug 聚合模板**

```md
# pages/system/user-list Bug 聚合

## 活跃问题

| bug_id | 标题 | 来源 | 状态 | owner | 提出日期 | 关联需求 | 代码PR/提交 |
| ------ | ---- | ---- | ---- | ----- | -------- | -------- | ----------- |

## 已归档（最近30条）

| bug_id | 标题 | 结论 | 归档日期 | 沉淀到文档 |
| ------ | ---- | ---- | -------- | ---------- |
```

**Step 3: 更新当月索引**

向 `doc/changes/2026-03.md` 追加：

```md
| 2026-03-03 | req | page | system/user-list 模板初始化 | done | doc/pages/system/user-list.md |
| 2026-03-03 | req | design | permission-role 模板初始化 | done | doc/design/permission-role.md |
```

**Step 4: 运行格式检查**

Run: `npx prettier --check "doc/**/*.md"`  
Expected: `All matched files use Prettier code style!` 或仅提示未接入格式化脚本。

**Step 5: Commit**

```bash
git add doc/pages/system/user-list.md doc/design/permission-role.md doc/bugs/pages/system/user-list.md doc/bugs/design/permission-role.md doc/changes/2026-03.md
git commit -m "docs: add aggregate templates for page and design scopes"
```

### Task 3: 实现文档门禁脚本

**Files:**

- Create: `scripts/check-doc-gate.mjs`
- Test: `scripts/check-doc-gate.mjs`

**Step 1: 编写失败用例（先验证缺文档时会失败）**

Run:

```bash
git add src
node scripts/check-doc-gate.mjs
```

Expected: 退出码非 0，输出提示缺少 `doc/pages|design` 与 `doc/changes` 更新。

**Step 2: 写最小实现**

```js
#!/usr/bin/env node
import { execSync } from "node:child_process";

function stagedFiles() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMR", { encoding: "utf8" }).trim();
  return output ? output.split("\n") : [];
}

const files = stagedFiles();
const hasCodeChange = files.some(f => f.startsWith("src/") || f.startsWith("build/") || f.startsWith("scripts/"));
if (!hasCodeChange) process.exit(0);

const hasMainDoc = files.some(f => f.startsWith("doc/pages/") || f.startsWith("doc/design/"));
const hasMonthlyChange = files.some(f => /^doc\/changes\/\d{4}-\d{2}\.md$/.test(f));

if (!hasMainDoc || !hasMonthlyChange) {
  console.error("[doc-gate] Blocked: code changes require doc/pages|design + doc/changes/YYYY-MM.md updates.");
  process.exit(1);
}

console.log("[doc-gate] OK");
```

**Step 3: 运行通过场景**

Run:

```bash
git add src doc/pages doc/design doc/changes
node scripts/check-doc-gate.mjs
```

Expected: 输出 `[doc-gate] OK`，退出码为 0。

**Step 4: Commit**

```bash
git add scripts/check-doc-gate.mjs
git commit -m "chore: add document gate script for staged changes"
```

### Task 4: 接入 npm script 与 husky pre-commit

**Files:**

- Modify: `package.json`
- Modify: `.husky/pre-commit`
- Test: `.husky/pre-commit`

**Step 1: 在 package.json 添加脚本**

```json
{
  "scripts": {
    "docs:gate": "node scripts/check-doc-gate.mjs"
  }
}
```

**Step 2: 在 pre-commit 串联门禁**

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run docs:gate && npm run lint:lint-staged
```

**Step 3: 验证阻断行为**

Run: `git commit -m "test: missing docs"`  
Expected: 当仅改 `src/` 未改文档时，pre-commit 失败并阻止提交。

**Step 4: Commit**

```bash
git add package.json .husky/pre-commit
git commit -m "chore: enforce doc gate in pre-commit"
```

### Task 5: 接入 GitLab CI 文档门禁

**Files:**

- Modify: `.gitlab-ci.yml`
- Test: `.gitlab-ci.yml`

**Step 1: 新增 doc_gate stage 与 job**

```yaml
stages:
  - doc_gate
  - deploy
  - sonarqube_check

doc_gate:
  stage: doc_gate
  image: node:20
  script:
    - npm ci
    - node scripts/check-doc-gate.mjs
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

**Step 2: 本地模拟执行**

Run: `npm ci && node scripts/check-doc-gate.mjs`  
Expected: 当前变更符合规则时退出 0。

**Step 3: Commit**

```bash
git add .gitlab-ci.yml
git commit -m "ci: add document gate job for merge requests"
```

### Task 6: 补充协作说明（提需求/提 bug/归档）

**Files:**

- Modify: `README.md`
- Modify: `doc/index.md`
- Test: `README.md`

**Step 1: 在 README 增加“文档驱动协作入口”**

示例内容：

```md
## 文档驱动协作

1. 提需求：先更新 `doc/pages` 或 `doc/design` 主档，再开发。
2. 提 bug：记录到 `doc/bugs/pages/*` 或 `doc/bugs/design/*` 聚合文件。
3. 归档：业务确认后，将状态置为 `archived`，并同步到 `doc/changes/YYYY-MM.md`。
```

**Step 2: 增加常用命令**

```bash
npm run docs:gate
```

**Step 3: 运行最终检查**

Run:

```bash
npm run docs:gate
npm run lint:lint-staged
```

Expected: 两个命令均成功。

**Step 4: Commit**

```bash
git add README.md doc/index.md
git commit -m "docs: add collaboration playbook for doc-driven workflow"
```

### Task 7: 收尾验证与发布准备

**Files:**

- Test: `git status`
- Test: `git log --oneline -n 10`

**Step 1: 验证工作区干净**

Run: `git status --short`  
Expected: 无未提交文件。

**Step 2: 验证提交序列**

Run: `git log --oneline -n 10`  
Expected: 包含前述任务提交，语义清晰可回溯。

**Step 3: 生成交付说明**

输出清单：

1. 新增/修改文件列表
2. 门禁规则说明
3. 文档使用示例（需求、bug、归档）
