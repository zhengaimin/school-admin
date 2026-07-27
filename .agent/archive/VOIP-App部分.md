# VOIP App 部分

## 一期目标

自研话机 APK 通过设备侧 SDK 接入微信 VOIP，识别当前学生后取得可信被叫名单，并向已订阅家长发起呼叫。

## 一期任务

- 完成设备侧微信认证、设备激活和 VOIP license 校验。
- 保证 APK 使用的设备 SN 与后台入库、微信设备组成员同步使用的 SN 完全一致。
- 发起呼叫前识别学生，取得 `studentId`。
- 使用 SCHOOL-HMAC-SHA256 调用被叫名单接口：`GET /open/devices/{sn}/voip-contacts?studentId={studentId}`。
- 使用接口返回的 `contacts[].openid` 调用设备侧 SDK 发起微信 VOIP 呼叫。
- 正确处理空名单、鉴权失败、设备未分组、学生不匹配、license 无效和 SDK 呼叫失败。
- 保留既有联系人展示、通话权限、剩余时长、通话上报和计费链路。

## 被叫名单接口约束

- 调用方必须持有包含 `device:voip-contacts` 权限的 APIKey。
- 签名必须包含接口要求的时间戳和 nonce，避免重放。
- APK 不缓存长期名单；每次呼叫前按业务约定拉取，短期缓存由后端负责。
- `openid` 仅用于本次呼叫，不展示、不记录到无关日志、不向其他端透传。

## 不做范围

- 不负责家长授权和订阅状态写入。
- 不调用小程序的 prepare、confirm、unsubscribe 接口。
- 不要求后端签发 `snTicket`。
- 一期不采用 WMPF Client 链路；如后续切换需单独设计。

## 联调与验收

- 测试 SN 已认证、已激活且 license 有效。
- SN 已加入正确的微信 VOIP group。
- 有权限 APIKey 能取得名单，无权限 APIKey 被拒绝。
- 学生存在 ACTIVE 订阅时能够成功发起呼叫。
- 无订阅或联系人无 `mini_open_id` 时不发起错误呼叫。
- 呼叫结果继续进入既有通话记录和计费链路。

## 外部依赖

- 运营提供可用 license 和测试 SN。
- 后端提供被叫名单接口及 APIKey 权限。
- Weapp 完成设备组授权并写入 ACTIVE 订阅。
