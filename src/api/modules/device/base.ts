import http from "@/api";
import type { DeviceBase } from "@/api/interface";

/** 获取设备列表 */
export function getDeviceBaseListApi(params: DeviceBase.ReqDeviceBaseListParams) {
  return http.get<DeviceBase.ResDeviceBaseListData>("/admin/device-bases/list", params);
}

/** 创建设备 */
export function postDeviceBaseApi(params: DeviceBase.ReqCreateDeviceBaseParams) {
  return http.post("/admin/device-bases", params);
}

/** 获取设备详情 */
export function getDeviceBaseDetailApi(id: number) {
  return http.get<DeviceBase.IDeviceBaseItem>(`/admin/device-bases/detail/${id}`);
}

/** 更新设备 */
export function putDeviceBaseApi(id: number, params: DeviceBase.ReqUpdateDeviceBaseParams) {
  return http.put(`/admin/device-bases/detail/${id}`, params);
}

/** 删除设备 */
export function deleteDeviceBaseApi(params: { id: number }) {
  return http.delete(`/admin/device-bases/detail/${params.id}`);
}

/** 下载导入模板 */
export function getDeviceBaseTemplateApi(params: DeviceBase.ReqGetDeviceBaseTemplateApi) {
  return http.get("/admin/device-bases/template", params, { responseType: "blob" });
}

/** 导入设备 */
export function postDeviceBaseImportApi(params: DeviceBase.ReqPostDeviceBaseImportApi, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const searchParams = new URLSearchParams({
    vendorCode: params.vendorCode,
    deviceType: params.deviceType,
    schoolId: String(params.schoolId)
  });
  return http.post<DeviceBase.ResPostDeviceBaseImportApi>(`/admin/device-bases/import?${searchParams}`, formData);
}
