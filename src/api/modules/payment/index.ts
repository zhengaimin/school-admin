import http from "@/api";
import type { Payment } from "@/api/interface";

/** 获取充值记录列表 */
export function getPaymentsApi(params: Payment.ReqGetPaymentsApi) {
  return http.get<Payment.ResGetPaymentsApi>("/admin/payments", params);
}

/** 获取充值记录详情 */
export function getPaymentDetailApi(id: number | string) {
  return http.get<Payment.IPaymentDetail>(`/admin/payments/${id}`);
}

/** 获取充值记录导出信息 */
export function getPaymentExportInfoApi(params: Payment.ReqGetPaymentExportInfoApi) {
  return http.get<Payment.ResGetPaymentExportInfoApi>("/admin/payments/export-info", params, { loading: false });
}
