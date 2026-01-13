import type { DeviceUsage } from "@/api/interface";
import http from "@/api";

/** 获取设备使用记录列表 */
export function getDeviceUsageListApi(params: DeviceUsage.ReqGetDeviceUsageListApi) {
  return http.get<DeviceUsage.ResGetDeviceUsageListApi>("/admin/device-usages", params);
}

/** 获取设备使用记录详情 */
export function getDeviceUsageDetailApi(id: number) {
  return http.get<DeviceUsage.ResGetDeviceUsageDetailApi>(`/admin/device-usages/${id}`);
}

/** 获取导出信息 */
export function getDeviceUsageExportInfoApi(params: DeviceUsage.ReqGetDeviceUsageExportInfoApi) {
  return http.get<DeviceUsage.ResGetDeviceUsageExportInfoApi>("/admin/device-usages/export-info", params);
}

/** 导出设备使用记录 */
export function exportDeviceUsagesApi(params: DeviceUsage.ReqGetDeviceUsageListApi) {
  return http.get("/admin/device-usages/export", params, { responseType: "blob" });
}
