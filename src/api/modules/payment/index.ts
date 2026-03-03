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

/** 导出充值记录 */
export function getPaymentsExportApi(params: Payment.ReqGetPaymentsApi): Promise<Blob> {
  return http.get("/admin/payments/export", params, { responseType: "blob" });
}

/** 获取租户支付配置 */
export function getTenantPaymentConfigApi(tenantId: number | string) {
  return http.get<Payment.ResGetTenantPaymentConfigApi>(`/admin/payment-configs/tenant/${tenantId}`);
}

/** 创建或更新租户支付配置 */
export function putTenantPaymentConfigApi(tenantId: number | string, params: Payment.ReqPutTenantPaymentConfigApi) {
  return http.put<Payment.ResPutTenantPaymentConfigApi>(`/admin/payment-configs/tenant/${tenantId}`, params);
}
