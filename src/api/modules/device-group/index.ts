import http from "@/api";
import type { DeviceGroup } from "@/api/interface";

/** 获取设备组列表 */
export function getDeviceGroupListApi(params?: DeviceGroup.ReqGetDeviceGroupListApi, options?: any) {
  return http.get<DeviceGroup.ResGetDeviceGroupListApi>("/admin/device-groups", params, options);
}
