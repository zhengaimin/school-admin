import http from "@/api";
import type { Common } from "@/api/interface";

/** 获取 APK 错误话术列表 */
export function getApkMessageTemplatesApi(params: Common.ReqGetApkMessageTemplatesApi, options?: any) {
  return http.get<Common.ResGetApkMessageTemplatesApi>("/admin/apk-message-templates", params, options);
}

/** 获取 APK 错误话术详情 */
export function getApkMessageTemplateDetailApi(id: number) {
  return http.get<Common.ResGetApkMessageTemplateDetailApi>(`/admin/apk-message-templates/${id}`);
}

/** 更新 APK 错误话术 */
export function putUpdateApkMessageTemplateApi(id: number, data: Common.ReqPutUpdateApkMessageTemplateApi) {
  return http.put(`/admin/apk-message-templates/${id}`, data);
}

/** 恢复继承 */
export function postResetInheritApkMessageTemplateApi(id: number, data: Common.ReqPostResetInheritApkMessageTemplateApi) {
  return http.post(`/admin/apk-message-templates/${id}/reset-inherit`, data);
}

/** 导出 APK 错误话术 */
export function getExportApkMessageTemplatesApi(params: Common.ReqExportApkMessageTemplatesApi): Promise<Blob> {
  return http.get("/admin/apk-message-templates/export", params, { responseType: "blob" });
}

/** 获取 APK 错误话术审计日志 */
export function getApkMessageTemplateAuditsApi(params: Common.ReqGetApkMessageTemplateAuditsApi, options?: any) {
  return http.get<Common.ResGetApkMessageTemplateAuditsApi>("/admin/apk-message-template-audits", params, options);
}
