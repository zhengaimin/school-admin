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

| 枚举名称                 | 描述                                                                   | 值类型   | 类型名称                    | 文件位置                                 |
| ------------------------ | ---------------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| `DEVICE_TYPE`            | 设备类型：DRYER-吹风机，WASHER-洗衣机，VIDEO-视频话机，VOICE-语音话机 | `string` | `TDeviceTypeValue`          | `src/config/modules/device/type.ts`      |
| `PHONE_TYPE`             | 拨号类型：all-全部，video-视频，sim-SIM卡                             | `string` | `TPhoneTypeValue`           | `src/config/modules/device/phone.ts`     |
| `SIP_TYPE`               | SIP类型：UDP，TCP，TLS，DTLS                                           | `string` | `TSipTypeValue`             | `src/config/modules/device/sip.ts`       |
| `DEVICE_COMMAND_CODE`    | 设备命令代码：同步二维码/屏幕参数/超时时间，重启设备                  | `string` | `TDeviceCommandCodeValue`   | `src/config/modules/device/command.ts`   |
| `VENDOR_CODE`            | 厂商代码：xingri-兴日科技，xstc-新胜同创                                | `string` | `TVendorCodeValue`          | `src/config/modules/device/vendor.ts`    |
| `DEVICE_COMMAND_STATUS`  | 设备命令状态：PENDING-待执行，SUCCESS-执行成功，FAILED-执行失败        | `string` | `TDeviceCommandStatusValue` | `src/config/modules/device/status.ts`    |

**相关导出：**

- `DEVICE_TYPE_I18N` / `DEVICE_TYPE_OPTIONS` - 设备类型文案和选项
- `PHONE_TYPE_I18N` / `PHONE_TYPE_OPTIONS` - 拨号类型文案和选项
- `SIP_TYPE_I18N` / `SIP_TYPE_OPTIONS` - SIP类型文案和选项
- `DEVICE_COMMAND_CODE_I18N` / `DEVICE_COMMAND_CODE_OPTIONS` - 设备命令代码文案和选项
- `VENDOR_CODE_I18N` / `VENDOR_CODE_OPTIONS` - 厂商代码文案和选项
- `DEVICE_COMMAND_STATUS_I18N` / `DEVICE_COMMAND_STATUS_OPTIONS` - 设备命令状态文案和选项
- `getDeviceCommandStatusTagType` - 获取设备命令状态标签类型的辅助函数

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

### 学生模块 (student)

| 枚举名称         | 描述                                      | 值类型   | 类型名称              | 文件位置                              |
| ---------------- | ----------------------------------------- | -------- | --------------------- | ------------------------------------- |
| `STUDENT_STATUS` | 学生状态：0-停用，1-在读，2-毕业，3-转学 | `number` | `TStudentStatusValue` | `src/config/modules/student/status.ts`|

**相关导出：**

- `STUDENT_STATUS_I18N` - 学生状态文案映射
- `STUDENT_STATUS_TAG_TYPE` - 学生状态标签类型映射
- `STUDENT_STATUS_OPTIONS` - 学生状态下拉选项

---

### 套餐模块 (package)

| 枚举名称                 | 描述                                                       | 值类型   | 类型名称                    | 文件位置                                    |
| ------------------------ | ---------------------------------------------------------- | -------- | --------------------------- | ------------------------------------------- |
| `PACKAGE_TYPE`           | 套餐类型：GENERAL-通用套餐，FIXED-固定套餐                 | `string` | `TPackageTypeValue`         | `src/config/modules/package/type.ts`        |
| `PACKAGE_STATUS`         | 套餐配置状态：0-禁用，1-启用                               | `number` | `TPackageStatusValue`       | `src/config/modules/package/status.ts`      |
| `PACKAGE_RECORD_STATUS`  | 套餐购买记录状态：1-待激活，2-已激活，3-已暂停，4-已过期，5-已取消 | `number` | `TPackageRecordStatusValue` | `src/config/modules/package/record-status.ts`|

**相关导出：**

- `PACKAGE_TYPE_I18N` / `PACKAGE_TYPE_OPTIONS` - 套餐类型文案和选项
- `PACKAGE_STATUS_I18N` / `PACKAGE_STATUS_OPTIONS` - 套餐配置状态文案和选项
- `PACKAGE_RECORD_STATUS_I18N` / `PACKAGE_RECORD_STATUS_OPTIONS` - 套餐购买记录状态文案和选项
- `getPackageRecordStatusTagType` - 获取套餐购买记录状态标签类型的辅助函数

---

### 支付模块 (payment)

| 枚举名称         | 描述                                                           | 值类型   | 类型名称              | 文件位置                              |
| ---------------- | -------------------------------------------------------------- | -------- | --------------------- | ------------------------------------- |
| `PAYMENT_METHOD` | 支付方式：WECHAT-微信支付，MOCK-模拟支付                       | `string` | `TPaymentMethodValue` | `src/config/modules/payment/method.ts`|
| `PAYMENT_TYPE`   | 支付类型：RECHARGE-充值，DIRECT_PURCHASE-直接购买              | `string` | `TPaymentTypeValue`   | `src/config/modules/payment/type.ts`  |
| `PAYMENT_STATUS` | 支付状态：0-待支付，1-支付成功，2-支付失败，3-已退款，4-已取消，5-已过期 | `number` | `TPaymentStatusValue` | `src/config/modules/payment/status.ts`|

**相关导出：**

- `PAYMENT_METHOD_I18N` / `PAYMENT_METHOD_OPTIONS` - 支付方式文案和选项
- `PAYMENT_TYPE_I18N` / `PAYMENT_TYPE_OPTIONS` - 支付类型文案和选项
- `PAYMENT_STATUS_I18N` / `PAYMENT_STATUS_OPTIONS` - 支付状态文案和选项
- `getPaymentStatusTagType` - 获取支付状态标签类型的辅助函数

---

### 退款模块 (refund)

| 枚举名称                | 描述                                                                                                                                                  | 值类型   | 类型名称                    | 文件位置                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------- | --------------------------------------------- |
| `REFUND_STATUS`         | 退款状态：0-待审核，1-审核通过，2-退款处理中，3-全部退款完成，4-部分退款完成，5-审核拒绝，6-用户取消，7-全部失败                                    | `number` | `TRefundStatusValue`        | `src/config/modules/refund/status.ts`         |
| `REFUND_CATEGORY`       | 退款分类：balance-余额退款，package-套餐退款                                                                                                          | `string` | `TRefundCategoryValue`      | `src/config/modules/refund/category.ts`       |
| `REFUND_TYPE`           | 退款类型：FULL-全额退款，SINGLE-单笔退款，PACKAGE-套餐退款                                                                                            | `string` | `TRefundTypeValue`          | `src/config/modules/refund/type.ts`           |
| `REFUND_DETAIL_STATUS`  | 退款详情状态：0-待退款，1-退款处理中，2-退款成功，3-退款失败，4-已取消                                                                               | `number` | `TRefundDetailStatusValue`  | `src/config/modules/refund/detail-status.ts`  |

**相关导出：**

- `REFUND_STATUS_I18N` / `REFUND_STATUS_OPTIONS` - 退款状态文案和选项
- `REFUND_CATEGORY_I18N` / `REFUND_CATEGORY_OPTIONS` - 退款分类文案和选项
- `REFUND_TYPE_I18N` / `REFUND_TYPE_OPTIONS` - 退款类型文案和选项
- `REFUND_DETAIL_STATUS_I18N` / `REFUND_DETAIL_STATUS_OPTIONS` - 退款详情状态文案和选项
- `getRefundStatusTagType` - 获取退款状态标签类型的辅助函数
- `getRefundDetailStatusTagType` - 获取退款详情状态标签类型的辅助函数

---

### 年级模块 (grade)

| 枚举名称                | 描述                                                      | 值类型   | 类型名称                    | 文件位置                                      |
| ----------------------- | --------------------------------------------------------- | -------- | --------------------------- | --------------------------------------------- |
| `GRADE_CONFIG_TYPE`     | 配置类型：package-套餐配置，rate-费率配置                 | `string` | `TGradeConfigTypeValue`     | `src/config/modules/grade/config-type.ts`     |
| `GRADE_PACKAGE_TYPE`    | 套餐类型：GENERAL-通用套餐，FIXED-固定套餐                | `string` | `TGradePackageTypeValue`    | `src/config/modules/grade/package-type.ts`    |
| `GRADE_SERVICE_TYPE`    | 服务类型：CALL-通话服务，MESSAGE-留言服务，DRYER-吹风机服务 | `string` | `TGradeServiceTypeValue`    | `src/config/modules/grade/service-type.ts`    |

**相关导出：**

- `GRADE_CONFIG_TYPE_I18N` / `GRADE_CONFIG_TYPE_OPTIONS` - 配置类型文案和选项
- `GRADE_PACKAGE_TYPE_I18N` / `GRADE_PACKAGE_TYPE_OPTIONS` - 套餐类型文案和选项
- `GRADE_SERVICE_TYPE_I18N` / `GRADE_SERVICE_TYPE_OPTIONS` - 服务类型文案和选项

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
4. **更新本索引文档**

## 命名规范

- **枚举名称**：大写 + 下划线（如 `DEVICE_TYPE`）
- **类型名称**：`T` 前缀 + PascalCase（如 `TDeviceTypeValue`）
- **文案映射**：枚举名 + `_I18N`（如 `DEVICE_TYPE_I18N`）
- **选项列表**：枚举名 + `_OPTIONS`（如 `DEVICE_TYPE_OPTIONS`）

## 维护说明

- 本文件应在每次新增或修改枚举时同步更新
- 删除枚举时，需同时从本索引中移除
- 定期审查，确保索引与实际代码保持一致
