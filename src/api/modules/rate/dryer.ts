import http from "@/api";
import type { RateDryer } from "@/api/interface";

/** 获取学校吹风机费率设置 */
export function getSchoolDryerRateApi(schoolId?: number, options?: any) {
  const id = schoolId ?? -1;
  return http.get<RateDryer.ResGetSchoolDryerRateApi>(`/admin/school-rates/${id}/dryer-rate`, {}, options);
}
/** 设置学校吹风机费率 */
export function putSchoolDryerRateApi(schoolId: number, data: RateDryer.ReqSetSchoolDryerRateApi) {
  return http.put(`/admin/school-rates/${schoolId}/dryer-rate`, data);
}

/** 获取年级吹风机费率配置列表 */
export function getGradeDryerRatesApi(params: RateDryer.ReqGetGradeDryerRatesApi, options?: any) {
  return http.get<RateDryer.ResGetGradeDryerRatesApi>("/admin/grade-dryer-rates", params, options);
}
/** 获取年级吹风机费率配置详情 */
export function getGradeDryerRateDetailApi(rateTemplateId: number) {
  return http.get<RateDryer.ResGetGradeDryerRateDetailApi>(`/admin/grade-dryer-rates/${rateTemplateId}`);
}
/** 创建年级吹风机费率配置 */
export function postGradeDryerRatesApi(data: RateDryer.ReqCreateGradeDryerRatesApi) {
  return http.post("/admin/grade-dryer-rates", data);
}
/** 更新年级吹风机费率配置 */
export function putGradeDryerRateApi(rateTemplateId: number, data: RateDryer.ReqUpdateGradeDryerRateApi) {
  return http.put(`/admin/grade-dryer-rates/${rateTemplateId}`, data);
}
/** 删除年级吹风机费率配置 */
export function deleteGradeDryerRatesApi(rateTemplateId: number) {
  return http.delete(`/admin/grade-dryer-rates/${rateTemplateId}`);
}
