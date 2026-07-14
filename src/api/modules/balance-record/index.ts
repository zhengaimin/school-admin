import http from "@/api";
import type { BalanceRecord } from "@/api/interface";

/** 获取学生余额账户列表 */
export function getBalanceRecordsApi(params: BalanceRecord.ReqGetBalanceRecordsApi) {
  return http.get<BalanceRecord.ResGetBalanceRecordsApi>("/admin/balance-records", params);
}

/** 获取学生余额账户详情 */
export function getBalanceRecordDetailApi(id: number | string) {
  return http.get<BalanceRecord.IBalanceRecordDetail>(`/admin/balance-records/${id}`);
}

/** 获取学生余额账户导出预检信息 */
export function getBalanceRecordExportInfoApi(params: BalanceRecord.ReqGetBalanceRecordExportInfoApi) {
  return http.get<BalanceRecord.ResGetBalanceRecordExportInfoApi>("/admin/balance-records/export-info", params, {
    loading: false
  });
}

/** 导出学生余额账户列表 */
export function getBalanceRecordsExportApi(params: BalanceRecord.ReqGetBalanceRecordExportApi): Promise<Blob> {
  return http.get("/admin/balance-records/export", params, { responseType: "blob" });
}
