import type { ApkHomepageLayout } from "@/api/interface";
import http from "@/api";

/** 获取学校首页布局配置 */
export function getApkHomepageLayoutConfigApi(schoolId: number) {
  return http.get<ApkHomepageLayout.ResGetApkHomepageLayoutConfigApi>(`/admin/apk-homepage-layout-configs/${schoolId}`);
}

/** 保存学校首页布局配置 */
export function putApkHomepageLayoutConfigApi(
  schoolId: number,
  params: ApkHomepageLayout.ReqPutApkHomepageLayoutConfigApi
) {
  return http.put<ApkHomepageLayout.ResPutApkHomepageLayoutConfigApi>(`/admin/apk-homepage-layout-configs/${schoolId}`, params);
}

/** 重置默认布局 */
export function postResetApkHomepageLayoutConfigApi(schoolId: number) {
  return http.post<ApkHomepageLayout.ResPostResetApkHomepageLayoutConfigApi>(`/admin/apk-homepage-layout-configs/${schoolId}/reset`);
}

/** 查看设备同步状态 */
export function getApkHomepageLayoutDeviceStatesApi(
  schoolId: number,
  params?: ApkHomepageLayout.ReqGetApkHomepageLayoutDeviceStatesApi
) {
  return http.get<ApkHomepageLayout.ResGetApkHomepageLayoutDeviceStatesApi>(`/admin/apk-homepage-layout-configs/${schoolId}/devices`, params);
}

/** 重试下发布局命令 */
export function postRetryApkHomepageLayoutApi(
  schoolId: number,
  params?: ApkHomepageLayout.ReqPostRetryApkHomepageLayoutApi
) {
  return http.post<ApkHomepageLayout.ResPostRetryApkHomepageLayoutApi>(`/admin/apk-homepage-layout-configs/${schoolId}/retry`, params);
}
