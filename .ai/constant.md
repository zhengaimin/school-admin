# 常量与枚举规范（模板 / 可复制）

本文件是可复制的初始版本：避免写死业务域名、具体枚举列表、外部链接或敏感信息。复制到其他项目时，只需要按“0. 项目自定义”替换路径即可。

## 0. 项目自定义（复制后先改这里）

- 常量根目录（推荐）：`src/config/modules/`
- 聚合导出文件（推荐）：`src/config/modules/index.ts`
- 别名导入（示例）：`@/config/modules`

如果你的项目目录结构不同，把本文件里出现的路径统一替换成项目实际路径即可。

## 1. 模块化组织

- **位置**：常量按模块放在“常量根目录”下，每个模块一个子目录。
- **文件拆分**：按常量类型拆文件，例如 `status.ts`、`type.ts`、`permission.ts`。
- **统一导出**：每个模块目录放一个 `index.ts` 做聚合导出；根目录也提供 `index.ts` 统一导出全部模块。

推荐目录结构：

```
src/config/modules/
├── index.ts
└── order/
    ├── index.ts
    └── status.ts
```

## 2. 命名规范

- **文件名**：小写 + 单词分隔（例如 `status.ts`、`call-rate.ts`）。
- **枚举/常量名**：大写 + 下划线（例如 `ORDER_STATUS`、`FILE_SOURCE`）。
- **类型名**：`T` 前缀（例如 `TOrderStatusValue`），用于表达枚举值的联合类型。

## 3. 枚举常量的标准结构

对“状态/类型/来源”等枚举性质常量，推荐同时提供：

- **枚举（Enum）**：常量核心。
- **值类型（Type）**：从枚举提取联合类型，便于接口和表单收敛类型。
- **文案映射（I18N/LabelMap）**：枚举值到展示文案的映射。
- **下拉选项（Options）**：表单使用的 `{ label, value }[]`。

## 4. 示例（通用）

`src/config/modules/order/status.ts`：

```ts
/** 订单状态：1-待支付，2-已支付，3-已取消 */
export enum ORDER_STATUS {
  /** 待支付 */
  PENDING = 1,
  /** 已支付 */
  PAID = 2,
  /** 已取消 */
  CANCELLED = 3
}

export type TOrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_I18N: Record<TOrderStatusValue, string> = {
  [ORDER_STATUS.PENDING]: "待支付",
  [ORDER_STATUS.PAID]: "已支付",
  [ORDER_STATUS.CANCELLED]: "已取消"
};

export const ORDER_STATUS_OPTIONS: Array<{ label: string; value: TOrderStatusValue }> = [
  { label: ORDER_STATUS_I18N[ORDER_STATUS.PENDING], value: ORDER_STATUS.PENDING },
  { label: ORDER_STATUS_I18N[ORDER_STATUS.PAID], value: ORDER_STATUS.PAID },
  { label: ORDER_STATUS_I18N[ORDER_STATUS.CANCELLED], value: ORDER_STATUS.CANCELLED }
];
```

`src/config/modules/order/index.ts`：

```ts
export * from "./status";
```

## 5. 可选：枚举索引（避免写死到模板里）

如果你希望“可检索、可审计”，可以在项目内维护一个索引表（建议放在项目文档里，而不是模板里），例如：

| 枚举名称      | 描述     | 值类型   | 文件位置                             |
| ------------- | -------- | -------- | ------------------------------------ |
| `DEVICE_TYPE` | 设备类型 | `string` | `src/config/modules/device/index.ts` |
| `PHONE_TYPE`  | 拨号类型 | `string` | `src/config/modules/device/index.ts` |
| `SIP_TYPE`    | SIP类型  | `string` | `src/config/modules/device/index.ts` |

模板中不要沉淀具体业务枚举列表，避免复制到其他项目后产生误导或泄漏。

## 6. 使用指南（通用）

```ts
import { ORDER_STATUS, ORDER_STATUS_I18N, ORDER_STATUS_OPTIONS } from "@/config/modules";

const status = ORDER_STATUS.PAID;
const text = ORDER_STATUS_I18N[status];
const options = ORDER_STATUS_OPTIONS;
```

## 7. 新增枚举的流程

1. 在对应模块目录下新增/修改枚举文件
2. 按第 3 节提供 Enum/Type/I18N/Options（按项目需要可裁剪）
3. 在模块 `index.ts` 与根 `index.ts` 中导出
4. （可选）更新项目文档中的枚举索引表
