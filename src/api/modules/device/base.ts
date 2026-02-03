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
export function deleteDeviceBaseApi(id) {
  return http.delete(`/admin/device-bases/detail/${id}`);
}

/** 下载导入模板 */
export function getDeviceBaseTemplateApi(params: DeviceBase.ReqGetDeviceBaseTemplateApi): Promise<Blob> {
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

/** 获取导出信息 */
export function getDeviceBaseExportInfoApi(params: DeviceBase.ReqGetDeviceBaseExportInfoApi) {
  return http.get<DeviceBase.ResGetDeviceBaseExportInfoApi>("/admin/device-bases/export-info", params);
}

/** 导出设备 */
export function postDeviceBaseExportApi(params: DeviceBase.ReqPostDeviceBaseExportApi): Promise<Blob> {
  return http.post("/admin/device-bases/export", params, { responseType: "blob" });
}
