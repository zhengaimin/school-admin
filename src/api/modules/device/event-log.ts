import type { DeviceEventLog } from "@/api/interface";
import http from "@/api";

/** 获取设备事件日志列表 */
export function getDeviceEventLogListApi(params: DeviceEventLog.ReqGetDeviceEventLogListApi) {
  return http.get<DeviceEventLog.ResGetDeviceEventLogListApi>("/admin/device-event-logs", params);
}

/** 获取设备事件日志统计 */
export function getDeviceEventLogStatisticsApi(params: DeviceEventLog.ReqGetDeviceEventLogStatisticsApi) {
  return http.get<DeviceEventLog.ResGetDeviceEventLogStatisticsApi>("/admin/device-event-logs/statistics", params);
}
