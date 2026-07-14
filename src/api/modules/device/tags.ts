import http from "@/api";
import type { DeviceBaseTag } from "@/api/interface";

/** 获取设备标签列表 */
export function getDeviceBaseTagsApi(params: DeviceBaseTag.ReqGetDeviceBaseTagsApi) {
  return http.get<DeviceBaseTag.ResGetDeviceBaseTagsApi>("/admin/device-base-tags", params);
}

/** 创建设备标签 */
export function postDeviceBaseTagApi(data: DeviceBaseTag.ReqPostDeviceBaseTagApi) {
  return http.post<DeviceBaseTag.ResPostDeviceBaseTagApi>("/admin/device-base-tags", data);
}

/** 更新设备标签 */
export function putDeviceBaseTagApi(id: number, data: DeviceBaseTag.ReqPutDeviceBaseTagApi) {
  return http.put(`/admin/device-base-tags/${id}`, data);
}

/** 删除设备标签 */
export function deleteDeviceBaseTagApi(id: number) {
  return http.delete(`/admin/device-base-tags/${id}`);
}

/** 获取标签下拉选项 */
export function getDeviceBaseTagOptionsApi(params?: DeviceBaseTag.ReqGetDeviceBaseTagOptionsApi) {
  return http.get<DeviceBaseTag.IDeviceBaseTagOptionVo[]>("/admin/device-base-tags/select-options", params);
}

/** 批量绑定设备到标签 */
export function postDeviceBaseTagDevicesApi(id: number, data: DeviceBaseTag.ReqPostDeviceBaseTagDevicesApi) {
  return http.post<DeviceBaseTag.ResPostDeviceBaseTagDevicesApi>(`/admin/device-base-tags/${id}/devices`, data);
}

/** 查询标签下的设备列表 */
export function getDeviceBaseTagDevicesApi(id: number, params?: DeviceBaseTag.ReqGetDeviceBaseTagDevicesApi) {
  return http.get<DeviceBaseTag.ResGetDeviceBaseTagDevicesApi>(`/admin/device-base-tags/${id}/devices`, params);
}

/** 批量下发命令 */
export function postDeviceBaseTagBatchCommandsApi(id: number, data: DeviceBaseTag.ReqPostDeviceBaseTagBatchCommandsApi) {
  return http.post<DeviceBaseTag.ResPostDeviceBaseTagBatchCommandsApi>(`/admin/device-base-tags/${id}/batch-commands`, data);
}

/** 从标签中移除设备 */
export function deleteDeviceBaseTagDeviceApi(id: number, deviceId: number) {
  return http.delete(`/admin/device-base-tags/${id}/devices/${deviceId}`);
}
