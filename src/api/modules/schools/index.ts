import http from "@/api";
import type { School } from "@/api/interface";

/** 获取学校列表 */
export function getSchoolsListApi(params: School.ReqSchoolsListParams, options?: any) {
  return http.get<School.ResSchoolsListData>("/admin/schools", params, options);
}

export * from "./class";
export * from "./department";
export * from "./student";
