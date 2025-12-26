# 接口与类型规范（模板 / 可复制）

本文件是可复制的初始版本：避免写死某个项目的 API 网关、具体业务模块、或外部链接。复制到其他项目时，优先按“0. 项目自定义”统一调整目录与封装名。

## 0. 项目自定义（复制后先改这里）

- 类型目录（推荐其一）：
  - A：`src/api/interface/modules/`（按模块拆文件）
  - B：`src/api/interface/index.ts`（集中一个文件，用 `namespace` 分组）
- 请求函数目录（推荐）：`src/api/modules/`
- HTTP 封装（示例）：`http` / `request`（以项目实际封装为准）
- 常量/枚举导入（示例）：`@/config/modules`（见 `.ai/constant.md`）
- **代码风格参考**：如需参考现有代码风格，优先参考 `src/api/modules/` 目录下的 `.ts` 文件，而不是 `.js` 文件

## 1. 接口类型定义

目标：类型与请求分离，减少重复定义，避免“魔法数字/字符串”。

- **组织方式**：推荐用 `namespace` 按业务域分组，降低全局命名冲突。
- **命名约定（建议）**：
  - 核心对象：`IxxxVo` / `IxxxDto`（按团队习惯二选一即可，保持一致）
  - 请求参数：`ReqXxxApi`
  - 响应结构：`ResXxxApi`

示例（按模块拆文件）：`src/api/interface/modules/user.ts`

```ts
export namespace User {
  export interface IUserVo {
    id: number;
    username: string;
  }

  export interface ResGetUserListApi {
    list: IUserVo[];
    total: number;
  }
}
```

## 2. 接口请求函数

- **位置**：放在 `src/api/modules/` 下，可按业务模块拆子目录。
- **命名**：推荐 `getXxxApi` / `postXxxApi` / `putXxxApi` / `deleteXxxApi`（或团队约定的另一套风格，但要一致）。
- **类型关联**：请求函数应显式声明响应类型，类型来源于 `src/api/interface/**`。

示例：`src/api/modules/user/index.ts`

```ts
import type { User } from "@/api/interface/modules/user";
import { http } from "@/api"; // 以项目实际封装为准

export function getUserListApi(params: Record<string, any>) {
  return http.get<User.ResGetUserListApi>("/users", { params });
}
```

## 3. 枚举类型在接口中的使用

在接口类型定义里，优先使用项目内枚举值类型（而不是 `number/string` + 注释），以提高类型安全与一致性。

### 3.1 导入枚举值类型

```ts
import type { TOrderStatusValue } from "@/config/modules";
```

### 3.2 在接口中使用

```ts
import type { TOrderStatusValue } from "@/config/modules";

export namespace Order {
  export interface IOrderVo {
    id: number;
    status: TOrderStatusValue;
  }
}
```

### 3.3 新增枚举的处理流程

当后端接口返回新的枚举字段时：

1. 在常量模块中新增/补充枚举（推荐目录：`src/config/modules/**`）
2. 遵循 `.ai/constant.md` 的 Enum/Type/I18N/Options 结构（按项目需要可裁剪）
3. 在接口类型中引用对应的 `TxxxValue`，替换原始 `number/string`
