import type { CallRecord } from "@/api/interface";
import http from "@/api";

/**
 * 获取通话记录列表
 * @param params 查询参数
 * @returns 通话记录列表
 */
export function getCallRecordsApi(params: CallRecord.ReqGetCallRecordsApi) {
  return http.get<CallRecord.ResGetCallRecordsApi>("/admin/call-records", params);
}

/**
 * 获取通话记录详情
 * @param id 记录 ID
 * @returns 详情数据
 */
export function getCallRecordDetailApi(id: number | string) {
  return http.get<CallRecord.ResGetCallRecordDetailApi>(`/admin/call-records/${id}`);
}

/**
 * 获取通话记录导出信息
 * @param params 查询参数
 * @returns 导出信息
 */
export function getCallRecordExportInfoApi(params: CallRecord.ReqGetCallRecordExportInfoApi) {
  return http.get<CallRecord.ResGetCallRecordExportInfoApi>("/admin/call-records/export-info", params, { loading: false });
}

/**
 * 导出通话记录
 * @param params 导出参数
 * @returns 导出文件
 */
export function getCallRecordsExportApi(params: CallRecord.ReqExportCallRecordsApi): Promise<Blob> {
  return http.get("/admin/call-records/export", params, { responseType: "blob" });
}
