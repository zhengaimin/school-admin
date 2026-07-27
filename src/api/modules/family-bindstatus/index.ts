import http from "@/api";
import type { FamilyBindStatus } from "@/api/interface";

/** 获取家长绑定状态列表 */
export function getFamilyBindStatusListApi(params: FamilyBindStatus.ReqGetFamilyBindStatusListApi) {
  return http.get<FamilyBindStatus.ResGetFamilyBindStatusListApi>("/admin/family-bindstatus", params);
}

/** 获取订阅设备组列表 */
export function getFamilyBindStatusSubscriptionsApi(id: number) {
  return http.get<FamilyBindStatus.ResGetFamilyBindStatusSubscriptionsApi>(`/admin/family-bindstatus/${id}/subscriptions`);
}

/** 获取导出信息 */
export function getFamilyBindStatusExportInfoApi(params: FamilyBindStatus.ReqGetFamilyBindStatusExportInfoApi) {
  return http.get<FamilyBindStatus.ResGetFamilyBindStatusExportInfoApi>("/admin/family-bindstatus/export-info", params);
}

/** 导出家长绑定状态 */
export function getFamilyBindStatusExportApi(params: FamilyBindStatus.ReqGetFamilyBindStatusExportApi): Promise<Blob> {
  return http.get("/admin/family-bindstatus/export", params, { responseType: "blob" });
}
