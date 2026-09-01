import type { System } from "@/api/interface";
import http from "@/api";

/** 全局配置 API */

/** 获取全局配置 */
export function getGlobalConfigApi() {
  return http.get<System.ResGetGlobalConfigApi>("/admin/system-config/global");
}

/** 更新全局配置 */
export function putUpdateGlobalConfigApi(params: System.ReqPutUpdateGlobalConfigApi) {
  return http.put<System.ResPutUpdateGlobalConfigApi>("/admin/system-config/global", params);
}

/** 获取学校配置 */
export function getSchoolConfigApi(schoolId: number) {
  return http.get<System.ResGetSchoolConfigApi>(`/admin/system-config/school/${schoolId}`);
}

/** 更新学校配置 */
export function putUpdateSchoolConfigApi(schoolId: number, params: System.ReqPutUpdateSchoolConfigApi) {
  return http.put<System.ResPutUpdateSchoolConfigApi>(`/admin/system-config/school/${schoolId}`, params);
}
