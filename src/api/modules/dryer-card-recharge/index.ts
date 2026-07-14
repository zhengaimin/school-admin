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

/** 获取吹风机圈存记录导出信息。 */
export function getDryerCardRechargesExportInfoApi(params: DryerCardRecharge.ReqGetDryerCardRechargeExportInfoApi) {
  return http.get<DryerCardRecharge.ResGetDryerCardRechargeExportInfoApi>("/admin/dryer-card-recharges/export-info", params, {
    loading: false
  });
}

/** 导出吹风机圈存记录。 */
export function getDryerCardRechargesExportApi(params: DryerCardRecharge.ReqGetDryerCardRechargeExportApi): Promise<Blob> {
  return http.get("/admin/dryer-card-recharges/export", params, { responseType: "blob" });
}

/** 人工确认圈存成功。 */
export function postConfirmDryerCardRechargeSuccessApi(
  id: number | string,
  data: DryerCardRecharge.ReqPostConfirmDryerCardRechargeApi
) {
  return http.post<DryerCardRecharge.ResPostConfirmDryerCardRechargeApi>(
    `/admin/dryer-card-recharges/${id}/confirm-success`,
    data
  );
}

/** 人工确认圈存失败。 */
export function postConfirmDryerCardRechargeFailedApi(
  id: number | string,
  data: DryerCardRecharge.ReqPostConfirmDryerCardRechargeApi
) {
  return http.post<DryerCardRecharge.ResPostConfirmDryerCardRechargeApi>(
    `/admin/dryer-card-recharges/${id}/confirm-failed`,
    data
  );
}
