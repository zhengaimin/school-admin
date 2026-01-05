import http from "@/api";
import type { School } from "@/api/interface";

/** 获取学校列表 */
export function getSchoolsListApi(params: School.ReqSchoolsListParams, options?: any) {
  return http.get<School.ResSchoolsListData>("/admin/schools", params, options);
}

/** 新增学校 */
export function postSchoolApi(params: School.ReqPostSchoolApi) {
  return http.post<School.ResPostSchoolApi>("/admin/schools", params);
}

/** 更新学校 */
export function putSchoolApi(id: number, params: School.ReqPutSchoolApi) {
  return http.put(`/admin/schools/${id}`, params);
}

export * from "./class";
export * from "./department";
export * from "./student";
