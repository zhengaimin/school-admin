import http from "@/api";
import type { DeviceUsage } from "@/api/interface";

/** 获取设备使用记录列表 */
export function getDeviceUsageListApi(params: DeviceUsage.ReqGetDeviceUsageListApi) {
  return http.get<DeviceUsage.ResGetDeviceUsageListApi>("/admin/device-usages", params);
}
