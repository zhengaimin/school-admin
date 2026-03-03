# 事项编号规则（ITEM-ID）

## 适用范围

1. 仅用于会进入开发或排查的事项（需求、bug、改动请求）。
2. 纯咨询、讨论、临时想法不生成 `ITEM-ID`。

## 编号格式

1. 格式：`ITEM-YYYYMMDD-序号`
2. 示例：`ITEM-20260303-001`
3. 序号从 `001` 递增，按当天创建顺序分配。

## 使用规则

1. 创建事项时，先分配 `ITEM-ID`，再进入开发。
2. 同一个事项在所有文档中必须使用同一个 `ITEM-ID`。
3. 每个事项必须双轨落档：
   - `doc/changes/sessions/YYYY-MM-DD.md`
   - `doc/changes/pages/*.md` 或 `doc/changes/design/*.md`
4. 月度索引 `doc/changes/YYYY-MM.md` 只记录摘要+链接，不重复写明细。

## 状态流转

1. 通用状态：`open -> in_progress -> done -> verified -> archived`
2. 业务确认后，事项才允许进入 `archived`。
