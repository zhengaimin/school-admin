import http from "@/api";
import type { GradeGeneralPackage } from "@/api/interface";

/** 获取年级通用套餐配置列表 */
export function getGradeGeneralPackagesApi(params: GradeGeneralPackage.ReqGetGradeGeneralPackagesApi) {
  return http.get<GradeGeneralPackage.ResGetGradeGeneralPackagesApi>("/admin/grade-general-packages", params);
}

/** 创建年级通用套餐配置 */
export function postGradeGeneralPackageApi(data: GradeGeneralPackage.ReqPostGradeGeneralPackageApi) {
  return http.post("/admin/grade-general-packages", data);
}

/** 更新年级通用套餐配置 */
export function putGradeGeneralPackageApi(
  packageTemplateId: number | string,
  data: GradeGeneralPackage.ReqPutGradeGeneralPackageApi
) {
  return http.put(`/admin/grade-general-packages/${packageTemplateId}`, data);
}

/** 删除年级通用套餐配置 */
export function deleteGradeGeneralPackageApi(id: number | string) {
  return http.delete(`/admin/grade-general-packages/${id}`);
}
