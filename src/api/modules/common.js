// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 公用接口
 */
//查询省市区
export const locations = params => {
  return http.get(`/common/locations?${params}`);
};
//文件下载
export const file_download = params => {
  return http.get(`/common/file/file_download?file_id=${params.file_id}`);
};
//图片上传
export const img_upload = params => {
  return http.post(`/common/file/img_upload`, params);
};
export const industry_list = params => {
  return http.get(`/common/industry_list?${params}`);
};

//获取RSA公钥
export const getRsaPublicKeyApi = () => {
  return http.get(`/admin/public_key`, {}, { loading: false });
};
