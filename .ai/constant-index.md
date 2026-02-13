# 常量与枚举索引

本文件记录项目中所有常量和枚举的索引，便于检索和审计。

> 命名规范：通用规范统一参考 `.ai/naming.md`，本文仅补充索引文件相关规则。

## 常量根目录

- 位置：`src/config/modules/`
- 聚合导出：`src/config/modules/index.ts`
- 别名导入：`@/config/modules`

## 枚举索引表

### 通用模块 (common)

| 枚举名称        | 描述                          | 值类型   | 类型名称             | 文件位置                              |
| --------------- | ----------------------------- | -------- | -------------------- | ------------------------------------- |
| `ENABLE_STATUS` | 启用/禁用状态：1-启用，0-禁用 | `number` | `TEnableStatusValue` | `src/config/modules/common/status.ts` |
| `ORDER_DIRECTION` | 排序方向：asc-升序，desc-倒序 | `string` | `TOrderDirectionValue` | `src/config/modules/common/order.ts` |
| `YES_NO_FLAG` | 是否标识：Y-是，N-否 | `string` | `TYesNoFlagValue` | `src/config/modules/common/yes-no.ts` |
| `WECHAT_BOUND_STATUS` | 微信绑定状态：已绑定/未绑定 | `boolean` | `TWechatBoundStatusValue` | `src/config/modules/common/wechat-bound.ts` |
| `DATA_SCOPE_TYPE` | 数据范围类型：ALL-全部数据，TENANT-指定租户，SCHOOL-指定学校 | `string` | `TDataScopeTypeValue` | `src/config/modules/common/data-scope.ts` |
| `ROLE_TYPE` | 角色类型：admin-后台管理员，api-前台用户 | `string` | `TRoleTypeValue` | `src/config/modules/common/role.ts` |
| `ROLE_LEVEL` | 角色级别：super-超级，platform-平台运营方，agent-代理商，custom-自定义 | `string` | `TRoleLevelValue` | `src/config/modules/common/role.ts` |
| `SUPER_ADMIN_ROLE` | 超级管理员角色码：super_admin | `string` | `-` | `src/config/modules/common/role.ts` |
| `APK_PACKAGE_STATUS` | APK 包状态：DRAFT-草稿，PUBLISHED-已发布，DISABLED-已下线 | `string` | `TApkPackageStatusValue` | `src/config/modules/common/apk.ts` |
| `APK_UPGRADE_SCOPE` | APK 升级范围：DEVICE-设备，SCHOOL-学校，TAG-标签 | `string` | `TApkUpgradeScopeValue` | `src/config/modules/common/apk.ts` |
| `APK_TERMINAL_TYPE` | APK 终端类型：TERMINAL_TYPE_GH_02-话机终端 | `string` | `TApkTerminalTypeValue` | `src/config/modules/common/apk.ts` |
| `APK_MESSAGE_TEMPLATE_SCOPE` | APK 错误话术作用域：global-全局，tenant-租户，school-学校 | `string` | `TApkMessageTemplateScopeValue` | `src/config/modules/common/apk-message-template.ts` |
| `APK_MESSAGE_TEMPLATE_CATEGORY` | APK 错误话术分类：DEVICE-设备，STUDENT-学生，MESSAGE-留言，SYSTEM-系统 | `string` | `TApkMessageTemplateCategoryValue` | `src/config/modules/common/apk-message-template.ts` |
| `APK_MESSAGE_TEMPLATE_CHANNEL` | APK 错误话术固定渠道：GH_DEVICE_APK | `string` | `-` | `src/config/modules/common/apk-message-template.ts` |

**相关导出：**

- `ENABLE_STATUS_I18N` - 状态文案映射
- `ENABLE_STATUS_OPTIONS` - 下拉选项
- `ORDER_DIRECTION_I18N` / `ORDER_DIRECTION_OPTIONS` - 排序方向文案和选项
- `YES_NO_FLAG_I18N` - 是否标识文案映射
- `YES_NO_FLAG_OPTIONS` - 是否标识下拉选项
- `WECHAT_BOUND_STATUS_I18N` - 微信绑定状态文案映射
- `WECHAT_BOUND_STATUS_OPTIONS` - 微信绑定状态下拉选项
- `DATA_SCOPE_TYPE_I18N` - 数据范围类型文案映射
- `DATA_SCOPE_TYPE_OPTIONS` - 数据范围类型下拉选项
- `ROLE_TYPE_I18N` / `ROLE_TYPE_OPTIONS` - 角色类型文案和选项
- `ROLE_LEVEL_I18N` / `ROLE_LEVEL_OPTIONS` - 角色级别文案和选项
- `SUPER_ADMIN_ROLE` - 超级管理员角色码
- `APK_PACKAGE_STATUS_I18N` / `APK_PACKAGE_STATUS_OPTIONS` - APK 包状态文案和选项
- `APK_UPGRADE_SCOPE_I18N` / `APK_UPGRADE_SCOPE_OPTIONS` - APK 升级范围文案和选项
- `APK_TERMINAL_TYPE_I18N` / `APK_TERMINAL_TYPE_OPTIONS` - APK 终端类型文案和选项
- `getApkPackageStatusTagType` - 获取 APK 包状态标签类型的辅助函数
- `APK_MESSAGE_TEMPLATE_SCOPE_I18N` / `APK_MESSAGE_TEMPLATE_SCOPE_OPTIONS` - APK 错误话术作用域文案和选项
- `APK_MESSAGE_TEMPLATE_CATEGORY_I18N` / `APK_MESSAGE_TEMPLATE_CATEGORY_OPTIONS` - APK 错误话术分类文案和选项
- `APK_MESSAGE_TEMPLATE_CHANNEL` - APK 错误话术固定渠道
- `getApkMessageTemplateScopeTagType` - 获取 APK 错误话术作用域标签类型的辅助函数

---

### 公告模块 (announcement)

| 枚举名称 | 描述 | 值类型 | 类型名称 | 文件位置 |
| --- | --- | --- | --- | --- |
| `ANNOUNCEMENT_STATUS` | 公告状态：1-已发布，2-已下架 | `number` | `TAnnouncementStatusValue` | `src/config/modules/announcement/status.ts` |
| `ANNOUNCEMENT_AUDIENCE` | 公告受众类型：PARENT-家长，PUBLIC_SCREEN-公共屏 | `string` | `TAnnouncementAudienceValue` | `src/config/modules/announcement/audience.ts` |
| `ANNOUNCEMENT_SCOPE` | 公告范围类型：SCHOOL_ALL-全校，GRADE-年级，CLASS-班级 | `string` | `TAnnouncementScopeValue` | `src/config/modules/announcement/scope.ts` |

**相关导出：**

- `ANNOUNCEMENT_STATUS_I18N` / `ANNOUNCEMENT_STATUS_OPTIONS` - 公告状态文案和选项
- `ANNOUNCEMENT_AUDIENCE_I18N` / `ANNOUNCEMENT_AUDIENCE_OPTIONS` - 受众类型文案和选项
- `ANNOUNCEMENT_SCOPE_I18N` / `ANNOUNCEMENT_SCOPE_OPTIONS` - 范围类型文案和选项
- `getAnnouncementStatusTagType` - 获取公告状态标签类型的辅助函数

---

### 设备模块 (device)

| 枚举名称                 | 描述                                                                   | 值类型   | 类型名称                    | 文件位置                                 |
| ------------------------ | ---------------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| `DEVICE_TYPE`            | 设备类型：DRYER-吹风机，WASHER-洗衣机，VIDEO-视频话机，VOICE-语音话机 | `string` | `TDeviceTypeValue`          | `src/config/modules/device/type.ts`      |
| `DEVICE_STATUS`          | 设备状态：ONLINE-在线，OFFLINE-离线                                  | `number` | `TDeviceStatusValue`        | `src/config/modules/device/status.ts`    |
| `DEVICE_BILL_MODE`       | 计费模式：0-免费，Y-音视频分开计费，N-音视频合并计费                 | `string` | `TDeviceBillModeValue`      | `src/config/modules/device/bill-mode.ts` |
| `PHONE_TYPE`             | 拨号类型：all-全部，video-视频，sim-SIM卡                             | `string` | `TPhoneTypeValue`           | `src/config/modules/device/phone.ts`     |
| `DIAL_MODE`              | 拨号模式：family-亲情号模式，free-自由拨号模式                         | `string` | `TDialModeValue`            | `src/config/modules/device/dial-mode.ts` |
| `PHONE_ENTRY`            | 拨号入口：video-视频，sim-SIM卡，sip-SIP                               | `string` | `TPhoneEntryValue`          | `src/config/modules/device/phone-entry.ts` |
| `SIP_TYPE`               | SIP类型：UDP，TCP，TLS，DTLS                                           | `string` | `TSipTypeValue`             | `src/config/modules/device/sip.ts`       |
| `DEVICE_COMMAND_CODE`    | 设备命令代码：同步二维码/屏幕参数/超时时间，重启设备                  | `string` | `TDeviceCommandCodeValue`   | `src/config/modules/device/command.ts`   |
| `DEVICE_TAG_CONTROL_ACTION` | 设备标签控制命令：重启/关机/更新配置/人员数据操作/查询人员数量 | `string` | `TDeviceTagControlActionValue` | `src/config/modules/device/tag-control.ts` |
| `VENDOR_CODE`            | 厂商代码：xingri-兴日科技，xstc-新胜同创                                | `string` | `TVendorCodeValue`          | `src/config/modules/device/vendor.ts`    |
| `DEVICE_COMMAND_STATUS`  | 设备命令状态：PENDING-待执行，SUCCESS-执行成功，FAILED-执行失败        | `string` | `TDeviceCommandStatusValue` | `src/config/modules/device/status.ts`    |
| `DEVICE_FACE_SYNC_STATUS` | 设备人脸同步状态：PENDING-待处理，SYNCED-已同步，FAILED-同步失败 | `string` | `TDeviceFaceSyncStatusValue` | `src/config/modules/device/face-sync.ts` |
| `DEVICE_FACE_DESIRED_ACTION` | 设备人脸期望动作：UPSERT-同步/更新，DELETE-删除 | `string` | `TDeviceFaceDesiredActionValue` | `src/config/modules/device/face-sync.ts` |
| `FACE_SYNC_ACTION` | 人脸同步动作：update-同步/更新，delete-删除 | `string` | `TFaceSyncActionValue` | `src/config/modules/device/face-sync.ts` |
| `DEVICE_FACE_ERROR_CODE` | 人脸同步失败原因码：NO_PHOTO-学生无照片，INVALID_FACE-人脸不合格，DEVICE_ERROR-设备异常 | `string` | `TDeviceFaceErrorCodeValue` | `src/config/modules/device/face-sync.ts` |

**相关导出：**

- `DEVICE_TYPE_I18N` / `DEVICE_TYPE_OPTIONS` - 设备类型文案和选项
- `DEVICE_STATUS_I18N` / `DEVICE_STATUS_OPTIONS` - 设备状态文案和选项
- `DEVICE_BILL_MODE_I18N` / `DEVICE_BILL_MODE_OPTIONS` - 计费模式文案和选项
- `PHONE_TYPE_I18N` / `PHONE_TYPE_OPTIONS` - 拨号类型文案和选项
- `DIAL_MODE_I18N` / `DIAL_MODE_OPTIONS` - 拨号模式文案和选项
- `PHONE_ENTRY_I18N` / `PHONE_ENTRY_OPTIONS` - 拨号入口文案和选项
- `SIP_TYPE_I18N` / `SIP_TYPE_OPTIONS` - SIP类型文案和选项
- `DEVICE_COMMAND_CODE_I18N` / `DEVICE_COMMAND_CODE_OPTIONS` - 设备命令代码文案和选项
- `DEVICE_TAG_CONTROL_ACTION_I18N` / `DEVICE_TAG_CONTROL_ACTION_OPTIONS` - 设备标签控制命令文案和选项
- `VENDOR_CODE_I18N` / `VENDOR_CODE_OPTIONS` - 厂商代码文案和选项
- `DEVICE_COMMAND_STATUS_I18N` / `DEVICE_COMMAND_STATUS_OPTIONS` - 设备命令状态文案和选项
- `getDeviceCommandStatusTagType` - 获取设备命令状态标签类型的辅助函数
- `DEVICE_FACE_SYNC_STATUS_I18N` / `DEVICE_FACE_SYNC_STATUS_OPTIONS` - 设备人脸同步状态文案和选项
- `DEVICE_FACE_DESIRED_ACTION_I18N` / `DEVICE_FACE_DESIRED_ACTION_OPTIONS` - 设备人脸期望动作文案和选项
- `FACE_SYNC_ACTION_I18N` / `FACE_SYNC_ACTION_OPTIONS` - 人脸同步动作文案和选项
- `DEVICE_FACE_ERROR_CODE_I18N` / `DEVICE_FACE_ERROR_CODE_OPTIONS` - 人脸同步失败原因码文案和选项
- `getDeviceFaceSyncStatusTagType` - 获取设备人脸同步状态标签类型的辅助函数

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
| `STUDENT_TYPE`   | 学生类型：BOARDING-寄宿生，DAY-走读生    | `string` | `TStudentTypeValue`   | `src/config/modules/student/type.ts`  |
| `STUDENT_SEX`    | 学生性别：男/女 | `string` | `TStudentSexValue` | `src/config/modules/student/sex.ts` |
| `FACE_STATUS`    | 人脸状态：0-未采集，1-已采集，2-审核中，3-审核通过，4-审核失败 | `number` | `TFaceStatusValue` | `src/config/modules/student/face-status.ts`|
| `STUDENT_DEVICE_CONTROL_ACTION` | 学生信息下发动作：add_user_info-新增，update_user_info-更新，delete_user_info-删除 | `string` | `TStudentDeviceControlActionValue` | `src/config/modules/student/device-control.ts` |

**相关导出：**

- `STUDENT_STATUS_I18N` / `STUDENT_STATUS_TAG_TYPE` / `STUDENT_STATUS_OPTIONS` - 学生状态文案、标签类型和选项
- `STUDENT_TYPE_I18N` / `STUDENT_TYPE_OPTIONS` - 学生类型文案和选项
- `STUDENT_SEX_I18N` / `STUDENT_SEX_OPTIONS` - 学生性别文案和选项
- `FACE_STATUS_I18N` / `FACE_STATUS_TAG_TYPE` / `FACE_STATUS_OPTIONS` - 人脸状态文案、标签类型和选项
- `STUDENT_DEVICE_CONTROL_ACTION_I18N` / `STUDENT_DEVICE_CONTROL_ACTION_OPTIONS` - 下发动作文案和选项

---

### 亲情号模块 (family-contact)

| 枚举名称 | 描述 | 值类型 | 类型名称 | 文件位置 |
| --- | --- | --- | --- | --- |
| `FAMILY_CONTACT_RELATIONSHIP` | 亲情号称谓类型：1-爸爸，2-妈妈，3-爷爷，4-奶奶，5-外公，6-外婆，7-姐姐，8-哥哥，9-其他 | `number` | `TFamilyContactRelationshipValue` | `src/config/modules/family-contact/relationship.ts` |

**相关导出：**

- `FAMILY_CONTACT_RELATIONSHIP_I18N` / `FAMILY_CONTACT_RELATIONSHIP_OPTIONS` - 亲情号称谓文案和选项

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

### 租户模块 (tenant)

| 枚举名称      | 描述                              | 值类型   | 类型名称            | 文件位置                           |
| ------------- | --------------------------------- | -------- | ------------------- | ---------------------------------- |
| `TENANT_TYPE` | 租户类型：PLATFORM-平台，AGENT-代理商 | `string` | `TTenantTypeValue`  | `src/config/modules/tenant/type.ts` |

**相关导出：**

- `TENANT_TYPE_I18N` / `TENANT_TYPE_OPTIONS` - 租户类型文案和选项

---

### 权限模块 (permission)

| 枚举名称 | 描述 | 值类型 | 类型名称 | 文件位置 |
| --- | --- | --- | --- | --- |
| `PERMISSION_CODE` | 权限编码 | `string` | `TPermissionCodeValue` | `src/config/modules/permission/code.ts` |

**相关导出：**

- `PERMISSION_CODE` - 权限编码枚举

**新增权限码（APK 错误话术配置）：**

- `APK_MESSAGE_TEMPLATE_LIST` - APK 错误话术列表
- `APK_MESSAGE_TEMPLATE_EDIT` - APK 错误话术编辑
- `APK_MESSAGE_TEMPLATE_RESET` - APK 错误话术恢复继承
- `APK_MESSAGE_TEMPLATE_EXPORT` - APK 错误话术导出
- `APK_MESSAGE_TEMPLATE_AUDIT` - APK 错误话术审计日志

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
