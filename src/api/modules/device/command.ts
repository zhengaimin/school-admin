import type { DeviceCommand } from "@/api/interface";
import http from "@/api";

/** 获取设备命令列表 */
export function getDeviceCommandListApi(params: DeviceCommand.ReqGetDeviceCommandListApi) {
  return http.get<DeviceCommand.ResGetDeviceCommandListApi>("/admin/device-base-commands", params);
}

/** 获取设备命令详情 */
export function getDeviceCommandDetailApi(id: number) {
  return http.get<DeviceCommand.IDeviceCommandItem>(`/admin/device-base-commands/${id}`);
}

/** 删除设备命令 */
export function deleteDeviceCommandApi(id: number) {
  return http.delete(`/admin/device-base-commands/${id}`);
}
