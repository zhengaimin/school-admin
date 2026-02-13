import type { Common } from "@/api/interface";

import http from "@/api";
export * from "./common/apk";
export * from "./common/apk-message-template";

/** 获取省市区 */
export function locations(params: string) {
  return http.get(`/common/locations?${params}`);
}

/** 文件下载 */
export function file_download(params: { file_id: string | number }) {
  return http.get(`/common/file/file_download?file_id=${params.file_id}`);
}

/** 图片上传 */
export function img_upload(params: FormData | Record<string, unknown>) {
  return http.post(`/common/file/img_upload`, params);
}

/** 获取行业列表 */
export function industry_list(params: string) {
  return http.get(`/common/industry_list?${params}`);
}

/** 获取RSA公钥 */
export function getRsaPublicKeyApi() {
  return http.get<Common.ResGetRsaPublicKeyApi>("/admin/public_key", {}, { loading: false });
}
