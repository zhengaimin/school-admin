import type { DeviceCommand, DeviceCommandRecord } from "@/api/interface";
import http from "@/api";

/** 获取设备命令列表 */
export function getDeviceCommandListApi(params: DeviceCommand.ReqGetDeviceCommandListApi) {
  return http.get<DeviceCommand.ResGetDeviceCommandListApi>("/admin/device-base-commands", params);
}

/** 获取设备命令记录列表 */
export function getDeviceCommandRecordListApi(params: DeviceCommandRecord.ReqGetDeviceCommandRecordListApi) {
  return http.get<DeviceCommandRecord.ResGetDeviceCommandRecordListApi>("/admin/device-commands", params);
}

/** 获取设备命令详情 */
export function getDeviceCommandDetailApi(id: number) {
  return http.get<DeviceCommand.IDeviceCommandItem>(`/admin/device-base-commands/${id}`);
}

/** 获取设备命令记录详情 */
export function getDeviceCommandRecordDetailApi(id: number) {
  return http.get<DeviceCommandRecord.IDeviceCommandRecordDetail>(`/admin/device-commands/${id}`);
}

/** 删除设备命令 */
export function deleteDeviceCommandApi(id: number) {
  return http.delete(`/admin/device-base-commands/${id}`);
}

/** 删除设备命令记录 */
export function deleteDeviceCommandRecordApi(id: number) {
  return http.delete<DeviceCommandRecord.IDeviceCommandRecordDetail>(`/admin/device-commands/${id}`);
}
