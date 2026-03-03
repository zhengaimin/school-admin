# video/devices/manage 页面规格

## 页面目标

- 管理公话设备列表、设备操作与批量能力。

## 页面主要逻辑

1. 表格列表由 `getDeviceListApi` 拉取，支持学校、设备组、状态等筛选。
2. 操作列提供单设备动作：查看、查看人脸、编辑、更换、删除。
3. 表头提供批量动作：重启、关机、更新配置、同步人员信息、清除人员数据、绑定标签、更新 APK、批量更新等。

## 查看人脸功能

1. 入口：操作列 `查看人脸` 按钮。
2. 请求接口：`GET /admin/face-sync/devices/{id}/states`。
3. 查询参数：`status`、`page`、`pageSize`。
4. 展示字段：学生ID、学生姓名、期望动作、期望版本、已同步版本、同步状态、失败原因。

## 注意点

1. 查询人脸状态必须使用设备行的 `id` 作为路径参数。
2. 同步状态仅允许：`PENDING`、`SYNCED`、`FAILED`。
3. 页面文档仅维护当前生效逻辑；变更历史统一记录在 `doc/changes/pages/video-device-manage.md`。
