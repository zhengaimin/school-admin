import http from "@/api";
import type { Common } from "@/api/interface";

/** 获取 APK 错误话术列表 */
export function getApkMessageTemplatesApi(params: Common.ReqGetApkMessageTemplatesApi, options?: any) {
  return http.get<Common.ResGetApkMessageTemplatesApi>("/admin/apk-message-templates", params, options);
}

/** 更新 APK 错误话术 */
export function putUpdateApkMessageTemplateApi(id: number, data: Common.ReqPutUpdateApkMessageTemplateApi) {
  return http.put(`/admin/apk-message-templates/${id}`, data);
}

/** 通过记录 ID 恢复继承 */
export function postResetInheritApkMessageTemplateApi(id: number, data: Common.ReqPostResetInheritApkMessageTemplateApi) {
  return http.post(`/admin/apk-message-templates/${id}/reset`, data);
}

/** 按业务主键恢复继承（推荐） */
export function postResetByKeyApkMessageTemplateApi(data: Common.ReqPostResetByKeyApkMessageTemplateApi) {
  return http.post("/admin/apk-message-templates/reset-by-key", data);
}

/** 导出 APK 错误话术 */
export function getExportApkMessageTemplatesApi(params: Common.ReqExportApkMessageTemplatesApi): Promise<Blob> {
  return http.get("/admin/apk-message-templates/export", params, { responseType: "blob" });
}

/** 获取 APK 错误话术审计日志 */
export function getApkMessageTemplateAuditsApi(params: Common.ReqGetApkMessageTemplateAuditsApi, options?: any) {
  return http.get<Common.ResGetApkMessageTemplateAuditsApi>("/admin/apk-message-templates/audit-logs", params, options);
}
