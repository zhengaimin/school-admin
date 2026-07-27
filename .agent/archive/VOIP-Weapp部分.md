# VOIP Weapp 部分

## 一期目标

家长在微信小程序中按业务设备组完成授权。授权粒度是设备组，不是单台设备。

## 一期流程

1. 调用 `GET /api/devices/subscriptions` 查询学生可订阅的设备组及状态。
2. 用户选择业务设备组后调用 `POST /api/devices/subscribe/prepare`。
3. 使用 prepare 返回的 `wechatAuth.groupId` 调用：

   ```ts
   wx.requestDeviceVoIP({
     isGroup: true,
     groupId
   });
   ```

4. 微信授权成功后调用 `POST /api/devices/subscribe/confirm`，将业务订阅写为 ACTIVE。
5. 微信授权失败或用户取消时不调用 confirm，并向用户展示可重试状态。
6. 取消业务订阅时调用 `POST /api/devices/unsubscribe`。

## 页面要求

- 页面只展示业务设备组名称和订阅状态。
- 高亮未订阅设备组，引导家长为孩子可能使用的所有设备组分别授权。
- 绑定学生后默认勾选所有待订阅组，引导用户逐组完成授权。
- 授权过程中提供明确的加载、取消、失败和重试状态，防止重复点击。
- 取消订阅后提示：业务订阅已取消；如需撤销微信平台授权，还需前往微信授权管理手动操作。

## 技术边界

- `wechatAuth.groupId` 只能来自 prepare 响应，仅用于调用微信接口。
- 不展示、不允许用户输入、不自行构造 `deviceGroupId`、`groupId`、`wechat_group_id`、`model_id`、`snTicket`。
- 不使用单设备授权参数，不请求 `snTicket`。
- `wx.getDeviceVoIPList` 只能用于辅助展示微信授权状态，不能替代后端业务订阅状态。
- confirm 必须在微信授权成功后调用；prepare 不写库。

## 异常处理

- prepare 失败：展示后端原因，不调用微信授权。
- 微信授权失败：不调用 confirm，保留重新授权入口。
- confirm 失败：提示业务订阅未完成，允许再次确认或重新走完整流程。
- unsubscribe 成功：更新页面业务状态，并提示微信侧授权不会自动撤销。
- 某个设备组订阅成功不代表其他设备组已订阅，页面需持续提示未订阅组。

## 验收

- 严格按照 `prepare -> wx.requestDeviceVoIP -> confirm` 执行。
- 微信授权取消后数据库不产生 ACTIVE 脏数据。
- 已订阅、未订阅、加载、空列表和错误状态均可正确展示。
- 取消业务订阅后，被叫名单不再包含该家长。
- 页面中不存在微信内部技术字段或单设备授权入口。
