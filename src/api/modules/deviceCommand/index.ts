import type { DeviceCommand } from "@/api/interface";
import http from "@/api";

/** 获取设备命令列表 */
export function getDeviceCommandListApi(params: DeviceCommand.ReqGetDeviceCommandListApi) {
  return http.get<DeviceCommand.ResGetDeviceCommandListApi>("/admin/device-base-commands", params);
}
