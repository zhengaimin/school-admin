import { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 文件上传模块
 */
/**
 * 图片上传
 * @param file 要上传的图片文件
 * @param businessType 业务类型（可选）
 */
export const postUploadImgApi = (file: File, businessType?: Upload.BusinessType) => {
  const formData = new FormData();
  formData.append("file", file);
  if (businessType) {
    formData.append("businessType", businessType);
  }
  return http.post<Upload.ResFileUpload>(`/common/files/upload`, formData, { cancel: false });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params, { cancel: false });
};

/**
 * 通用文件上传
 * @param file 要上传的文件
 * @param businessType 业务类型（可选）
 */
export const uploadFileApi = (file: File, businessType?: Upload.BusinessType) => {
  const formData = new FormData();
  formData.append("file", file);
  if (businessType) {
    formData.append("businessType", businessType);
  }
  return http.post<Upload.ResFileUpload>(`/common/files/upload`, formData, { cancel: false });
};

/**
 * 图片上传（接受 FormData）
 * @param formData 包含文件的 FormData
 */
export const uploadImg = (formData: FormData) => {
  return http.post<Upload.ResFileUpload>(`/common/files/upload`, formData, { cancel: false });
};
