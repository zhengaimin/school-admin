import http from "@/api";
import type { Grade } from "@/api/interface";

/** 获取年级列表 */
export function getGradesApi(params: Grade.ReqGetGradesApi, options?: any) {
  return http.get<Grade.ResGetGradesApi>("/admin/grades", params, options);
}

/** 获取年级详情 */
export function getGradeDetailApi(id: number | string) {
  return http.get<Grade.ResGetGradeDetailApi>(`/admin/grades/${id}`);
}

/** 新增年级 */
export function postGradeApi(data: Grade.ReqPostGradeApi) {
  return http.post("/admin/grades", data);
}

/** 更新年级 */
export function putUpdateGradeApi(id: number | string, data: Grade.ReqPutUpdateGradeApi) {
  return http.put(`/admin/grades/${id}`, data);
}

/** 删除年级 */
export function deleteGradeApi(id: number | string) {
  return http.delete(`/admin/grades/${id}`);
}

/** 导出年级 */
export function postGradeExportApi(data: Grade.ReqPostGradeExportApi) {
  return http.post("/admin/grades/export", data, { responseType: "blob" });
}

/** 获取未配置的年级列表 */
export function getUnconfiguredGradesApi(params: Grade.ReqGetUnconfiguredGradesApi) {
  return http.get<Grade.ResGetUnconfiguredGradesApi>("/admin/grade-config/unconfigured", params);
}
