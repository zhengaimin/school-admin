import http from "@/api";
import type { Grade } from "@/api/interface";

/** 获取年级列表 */
export function getGradesApi(params: Grade.ReqGetGradesApi, options?: any) {
  return http.get<Grade.ResGetGradesApi>("/admin/grades", params, options);
}

/** 获取未配置的年级列表 */
export function getUnconfiguredGradesApi(params: Grade.ReqGetUnconfiguredGradesApi) {
  return http.get<Grade.ResGetUnconfiguredGradesApi>("/admin/grade-config/unconfigured", params);
}
