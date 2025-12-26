# 常量与枚举索引

本文件记录项目中所有常量和枚举的索引，便于检索和审计。

## 常量根目录

- 位置：`src/config/modules/`
- 聚合导出：`src/config/modules/index.ts`
- 别名导入：`@/config/modules`

## 枚举索引表

### 通用模块 (common)

| 枚举名称        | 描述                          | 值类型   | 类型名称             | 文件位置                              |
| --------------- | ----------------------------- | -------- | -------------------- | ------------------------------------- |
| `ENABLE_STATUS` | 启用/禁用状态：1-启用，2-禁用 | `number` | `TEnableStatusValue` | `src/config/modules/common/status.ts` |

**相关导出：**

- `ENABLE_STATUS_I18N` - 状态文案映射
- `ENABLE_STATUS_OPTIONS` - 下拉选项

---

### 设备模块 (device)

| 枚举名称      | 描述                                              | 值类型   | 类型名称           | 文件位置                            |
| ------------- | ------------------------------------------------- | -------- | ------------------ | ----------------------------------- |
| `DEVICE_TYPE` | 设备类型：DRYER-吹风机，PHONE-电话，WASHER-洗衣机 | `string` | `TDeviceTypeValue` | `src/config/modules/device/type.ts` |
| `PHONE_TYPE`  | 拨号类型：all-全部，video-视频，sim-SIM卡         | `string` | `TPhoneTypeValue`  | `src/config/modules/device/type.ts` |
| `SIP_TYPE`    | SIP类型：UDP，TCP，TLS，DTLS                      | `string` | `TSipTypeValue`    | `src/config/modules/device/type.ts` |

**相关导出：**

- `DEVICE_TYPE_I18N` / `DEVICE_TYPE_OPTIONS` - 设备类型文案和选项
- `PHONE_TYPE_I18N` / `PHONE_TYPE_OPTIONS` - 拨号类型文案和选项
- `SIP_TYPE_I18N` / `SIP_TYPE_OPTIONS` - SIP类型文案和选项

---

### 赠费模块 (gifts)

| 枚举名称      | 描述                                                     | 值类型   | 类型名称           | 文件位置                             |
| ------------- | -------------------------------------------------------- | -------- | ------------------ | ------------------------------------ |
| `GIFT_STATUS` | 赠费状态：1-有效，2-已用完，3-已过期，4-已取消           | `number` | `TGiftStatusValue` | `src/config/modules/gifts/status.ts` |
| `GIFT_SOURCE` | 赠费来源：ADMIN_GIFT-管理员赠送，RECHARGE_BONUS-充值赠送 | `string` | `TGiftSourceValue` | `src/config/modules/gifts/source.ts` |

**相关导出：**

- `GIFT_STATUS_I18N` / `GIFT_STATUS_OPTIONS` / `GIFT_STATUS_TAG_TYPE` - 赠费状态文案、选项和标签类型
- `GIFT_SOURCE_I18N` / `GIFT_SOURCE_OPTIONS` - 赠费来源文案和选项

---

## 使用示例

```typescript
// 导入枚举和类型
import { DEVICE_TYPE, type TDeviceTypeValue, DEVICE_TYPE_I18N, DEVICE_TYPE_OPTIONS } from "@/config/modules";

// 使用枚举值
const deviceType: TDeviceTypeValue = DEVICE_TYPE.DRYER;

// 获取文案
const label = DEVICE_TYPE_I18N[deviceType]; // "吹风机"

// 在表单中使用选项
const options = DEVICE_TYPE_OPTIONS;
```

## 新增枚举流程

1. 在对应模块目录下新增/修改枚举文件
2. 按照 `.ai/constant.md` 规范提供：
   - Enum（枚举定义）
   - Type（值类型，使用 `T` 前缀）
   - I18N（文案映射）
   - Options（下拉选项）
3. 在模块 `index.ts` 与根 `index.ts` 中导出
4. 更新本索引文档

## 命名规范

- **枚举名称**：大写 + 下划线（如 `DEVICE_TYPE`）
- **类型名称**：`T` 前缀 + PascalCase（如 `TDeviceTypeValue`）
- **文案映射**：枚举名 + `_I18N`（如 `DEVICE_TYPE_I18N`）
- **选项列表**：枚举名 + `_OPTIONS`（如 `DEVICE_TYPE_OPTIONS`）

## 维护说明

- 本文件应在每次新增或修改枚举时同步更新
- 删除枚举时，需同时从本索引中移除
- 定期审查，确保索引与实际代码保持一致
