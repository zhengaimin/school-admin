import http from "@/api";
import type { Class } from "@/api/interface";

/** 获取班级列表 */
export function getClassesListApi(params: Class.ReqGetClassesApi, options?: any) {
  return http.get<Class.ResGetClassesApi>("/admin/classes", params, options);
}
