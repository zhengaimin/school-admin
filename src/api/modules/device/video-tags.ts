import http from "@/api";
import type { DeviceTag as DeviceVideoTag } from "@/api/interface";

/** 获取设备标签列表 */
export function getDeviceTagListApi(params: DeviceVideoTag.ReqGetDeviceTagsApi) {
  return http.get<DeviceVideoTag.ResGetDeviceTagsApi>("/admin/device-tags", params);
}

/** 新增设备标签 */
export function postDeviceTagApi(data: DeviceVideoTag.ReqPostDeviceTagApi) {
  return http.post<DeviceVideoTag.ResPostDeviceTagApi>("/admin/device-tags", data);
}

/** 更新设备标签 */
export function putDeviceTagApi(id: number, data: DeviceVideoTag.ReqPutDeviceTagApi) {
  return http.put(`/admin/device-tags/${id}`, data);
}

/** 获取设备标签详情 */
export function getDeviceTagDetailApi(id: number) {
  return http.get<DeviceVideoTag.ResGetDeviceTagDetailApi>(`/admin/device-tags/${id}`);
}

/** 获取设备标签选择项 */
export function getDeviceTagSelectOptionsApi(params?: DeviceVideoTag.ReqGetDeviceTagSelectOptionsApi, options?: any) {
  return http.get<DeviceVideoTag.ResGetDeviceTagSelectOptionsApi>("/admin/device-tags/select-options", params, options);
}

/** 批量绑定设备到标签 */
export function postDeviceTagBatchAssignApi(data: DeviceVideoTag.ReqPostDeviceTagBatchAssignApi) {
  return http.post<DeviceVideoTag.ResPostDeviceTagBatchAssignApi>("/admin/device-tags/batch-assign", data);
}

/** 删除设备标签 */
export function deleteDeviceTagApi(id: number) {
  return http.delete(`/admin/device-tags/${id}`);
}

/** 通过设备标签批量控制设备 */
export function postDeviceTagBatchControlApi(data: DeviceVideoTag.ReqPostDeviceTagBatchControlApi) {
  return http.post<DeviceVideoTag.ResPostDeviceTagBatchControlApi>("/admin/device-tags/batch-control", data);
}

/** 通过设备标签批量设置定时开关机 */
export function postDeviceTagBatchScheduleApi(data: DeviceVideoTag.ReqPostDeviceTagBatchScheduleApi) {
  return http.post<DeviceVideoTag.ResPostDeviceTagBatchScheduleApi>("/admin/device-tags/batch-schedule", data);
}
