import http from "@/api";
import type { Common } from "@/api/interface";

/** 获取 APK 列表 */
export function getApkPackagesApi(params: Common.ReqGetApkPackagesApi, options?: any) {
  return http.get<Common.ResGetApkPackagesApi>("/admin/apk-packages", params, options);
}

/** 上传 APK */
export function postApkPackageApi(file: File, changelog?: string, status?: Common.ReqPostApkPackageApi["status"]) {
  const formData = new FormData();
  formData.append("file", file);
  if (changelog?.trim()) {
    formData.append("changelog", changelog.trim());
  }
  if (status) {
    formData.append("status", status);
  }
  return http.post<Common.ResPostApkPackageApi>("/admin/apk-packages", formData);
}

/** 获取 APK 详情 */
export function getApkPackageDetailApi(id: number) {
  return http.get<Common.ResGetApkPackageDetailApi>(`/admin/apk-packages/${id}`);
}

/** 更新 APK */
export function putUpdateApkPackageApi(id: number, data: Common.ReqPutUpdateApkPackageApi) {
  return http.put(`/admin/apk-packages/${id}`, data);
}

/** 删除 APK */
export function deleteApkPackageApi(id: number) {
  return http.delete(`/admin/apk-packages/${id}`);
}

/** 发布 APK */
export function postPublishApkPackageApi(id: number) {
  return http.post(`/admin/apk-packages/${id}/publish`);
}

/** 下线 APK */
export function postDisableApkPackageApi(id: number) {
  return http.post(`/admin/apk-packages/${id}/disable`);
}

/** 后台下载 APK */
export function getDownloadApkPackageApi(id: number): Promise<Blob> {
  return http.get(`/admin/apk-packages/${id}/download`, {}, { responseType: "blob" });
}

/** 批量设置升级目标 */
export function postApkPackagesBatchUpgradeApi(data: Common.ReqPostApkPackagesBatchUpgradeApi) {
  return http.post<Common.ResPostApkPackagesBatchUpgradeApi>("/admin/apk-packages/batch-upgrade", data);
}
