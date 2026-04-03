import http from "@/api";
import type { DryerCardRecharge } from "@/api/interface";

/** 获取吹风机圈存记录列表。 */
export function getDryerCardRechargesApi(params: DryerCardRecharge.ReqGetDryerCardRechargesApi) {
  return http.get<DryerCardRecharge.ResGetDryerCardRechargesApi>("/admin/dryer-card-recharges", params);
}

/** 获取吹风机圈存记录详情。 */
export function getDryerCardRechargeDetailApi(id: number | string) {
  return http.get<DryerCardRecharge.IDryerCardRechargeDetail>(`/admin/dryer-card-recharges/${id}`);
}

/** 导出吹风机圈存记录。 */
export function getDryerCardRechargesExportApi(params: DryerCardRecharge.ReqGetDryerCardRechargesApi): Promise<Blob> {
  return http.get("/admin/dryer-card-recharges/export", params, { responseType: "blob" });
}
