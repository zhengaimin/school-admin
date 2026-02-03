import http from "@/api";
import type { SchoolMien } from "@/api/interface";

/** 获取校园风采列表 */
export function getSchoolMienListApi(params: SchoolMien.ReqGetSchoolMienListApi) {
  return http.get<SchoolMien.ResGetSchoolMienListApi>("/admin/school-miens", params);
}

/** 获取校园风采详情 */
export function getSchoolMienDetailApi(id: number) {
  return http.get<SchoolMien.ResGetSchoolMienDetailApi>(`/admin/school-miens/${id}`);
}

/** 创建校园风采 */
export function postCreateSchoolMienApi(params: SchoolMien.ReqPostSchoolMienApi) {
  return http.post<SchoolMien.ResPostSchoolMienApi>("/admin/school-miens", params);
}

/** 更新校园风采 */
export function putUpdateSchoolMienApi(id: number, params: SchoolMien.ReqPutSchoolMienApi) {
  return http.put<SchoolMien.ResPutSchoolMienApi>(`/admin/school-miens/${id}`, params);
}

/** 删除校园风采 */
export function deleteSchoolMienApi(id: number) {
  return http.delete(`/admin/school-miens/${id}`);
}

/** 批量更新校园风采状态 */
export function putUpdateSchoolMienStatusApi(params: SchoolMien.ReqPutSchoolMienStatusApi) {
  return http.put("/admin/school-miens/status", params);
}

/** 更新校园风采排序 */
export function putUpdateSchoolMienSortApi(params: SchoolMien.ReqPutSchoolMienSortApi) {
  return http.put("/admin/school-miens/sort", params);
}
