import http from "@/api";
import type { Student } from "@/api/interface";

/** 获取学生列表 */
export function getStudentsListApi(params: Student.ReqGetStudentsApi, options?: any) {
  return http.get<Student.ResGetStudentsApi>("/admin/students", params, options);
}
