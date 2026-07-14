import http from "@/api";
import type { Student } from "@/api/interface";

/** 获取学生列表 */
export function getStudentsListApi(params: Student.ReqGetStudentsApi, options?: any) {
  return http.get<Student.ResGetStudentsApi>("/admin/students", params, options);
}

/** 获取学生详情 */
export function getStudentDetailApi(id: number) {
  return http.get<Student.ResGetStudentDetailApi>(`/admin/students/${id}`);
}

/** 新增学生 */
export function postCreateStudentApi(params: Student.ReqPostStudentApi) {
  return http.post<Student.ResPostStudentApi>("/admin/students", params);
}

/** 更新学生 */
export function putUpdateStudentApi(id: number, params: Student.ReqPutStudentApi) {
  return http.put<Student.ResPutStudentApi>(`/admin/students/${id}`, params);
}

/** 删除学生 */
export function deleteStudentApi(id: number) {
  return http.delete<Student.ResDeleteStudentApi>(`/admin/students/${id}`);
}

/** 下发学生信息到设备 */
export function postStudentDeviceControlApi(params: Student.ReqPostStudentDeviceControlApi) {
  return http.post<null>("/admin/students/device-control", params);
}

/** 下载学生导入模板 */
export function getStudentTemplateApi(params: Student.ReqGetStudentTemplateApi): Promise<Blob> {
  return http.get("/admin/students/template", params, { responseType: "blob" });
}

/** 导入学生信息 */
export function postStudentImportApi(params: Student.ReqPostStudentImportApi, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  if (params.tenantId !== undefined) {
    formData.append("tenantId", String(params.tenantId));
  }
  formData.append("schoolId", String(params.schoolId));
  return http.post<Student.ResPostStudentImportApi>("/admin/students/import-excel", formData);
}

/** 导入更新学生信息 */
export function postStudentUpdateImportApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return http.post<Student.ResPostStudentUpdateImportApi>("/admin/students/update-excel", formData);
}

/** 批量导出学生信息 */
export function postStudentExportApi(params: Student.ReqPostStudentExportApi): Promise<Blob> {
  return http.post("/admin/students/export", params, { responseType: "blob" });
}
