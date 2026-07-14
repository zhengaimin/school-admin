import http from "@/api";
import type { Refund } from "@/api/interface";

/** 获取退款申请列表 */
export function getRefundsApi(params: Refund.ReqGetRefundsApi) {
  return http.get<Refund.ResGetRefundsApi>("/admin/refunds", params);
}

/** 获取退款申请详情 */
export function getRefundDetailApi(id: number | string) {
  return http.get<Refund.IRefundDetail>(`/admin/refunds/${id}`);
}

/** 审核退款申请 */
export function postAuditRefundApi(id: number | string, data: Refund.ReqAuditRefundApi) {
  return http.post<Refund.ResAuditRefundApi>(`/admin/refunds/${id}/audit`, data);
}

/** 获取导出退款记录信息 */
export function getRefundExportInfoApi(params: Refund.ReqGetRefundExportInfoApi) {
  return http.get<Refund.ResGetRefundExportInfoApi>("/admin/refunds/export-info", params);
}

/** 导出退款记录 */
export function getRefundsExportApi(params: Refund.ReqGetRefundsApi): Promise<Blob> {
  return http.get("/admin/refunds/export", params, { responseType: "blob" });
}
