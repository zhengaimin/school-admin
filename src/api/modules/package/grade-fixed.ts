import http from "@/api";
import type { GradePackage } from "@/api/interface";

/** 获取年级固定套餐配置列表 */
export function getGradeFixedPackagesApi(params: GradePackage.ReqGetGradeFixedPackagesApi) {
  return http.get<GradePackage.ResGetGradeFixedPackagesApi>("/admin/grade-fixed-packages", params);
}

/** 创建年级固定套餐配置 */
export function postGradeFixedPackageApi(data: GradePackage.ReqPostGradeFixedPackageApi) {
  return http.post("/admin/grade-fixed-packages", data);
}

/** 删除年级固定套餐配置 */
export function deleteGradeFixedPackageApi(id: number | string) {
  return http.delete(`/admin/grade-fixed-packages/${id}`);
}

/** 更新年级固定套餐配置 */
export function putGradeFixedPackageApi(packageTemplateId: number | string, data: GradePackage.ReqPutGradeFixedPackageApi) {
  return http.put(`/admin/grade-fixed-packages/${packageTemplateId}`, data);
}
