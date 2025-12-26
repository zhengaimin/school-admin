import http from "@/api";
import type { Department } from "@/api/interface";

/** 获取级部列表 */
export function getDepartmentsListApi(params: Department.ReqGetDepartmentsApi, options?: any) {
  return http.get<Department.ResGetDepartmentsApi>("/admin/departments", params, options);
}
