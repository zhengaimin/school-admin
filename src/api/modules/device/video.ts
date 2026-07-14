import http from "@/api";
import type { Device as DeviceVideo } from "@/api/interface";

/** 获取设备列表 */
export function getDeviceListApi(params?: DeviceVideo.ReqGetDevicesApi) {
  return http.get<DeviceVideo.ResGetDevicesApi>("/admin/devices", params);
}

/** 获取设备详情 */
export function getDeviceDetailApi(id: number) {
  return http.get<DeviceVideo.ResGetDeviceDetailApi>(`/admin/devices/${id}`);
}

/** 新增设备 */
export function postDeviceApi(data: DeviceVideo.ReqPostDeviceApi) {
  return http.post<DeviceVideo.ResPostDeviceApi>("/admin/devices", data);
}

/** 更新设备 */
export function putDeviceApi(id: number, data: DeviceVideo.ReqPutDeviceApi) {
  return http.put<DeviceVideo.ResPutDeviceApi>(`/admin/devices/${id}`, data);
}

/** 更换设备学校 */
export function postDeviceChangeSchoolApi(id: number, data: DeviceVideo.ReqPostDeviceChangeSchoolApi) {
  return http.post<DeviceVideo.ResPostDeviceChangeSchoolApi>(`/admin/devices/${id}/change-school`, data);
}

/** 删除设备 */
export function deleteDeviceApi(id: number) {
  return http.delete(`/admin/devices/${id}`);
}

/** 批量控制设备 */
export function postDeviceBatchControlApi(data: DeviceVideo.ReqPostDeviceBatchControlApi) {
  return http.post<DeviceVideo.ResPostDeviceBatchControlApi>("/admin/devices/batch-control", data);
}

/** 设备列表导出 */
export function postDeviceExportApi(data: DeviceVideo.ReqPostDeviceExportApi): Promise<Blob> {
  return http.post("/admin/devices/export", data, { responseType: "blob" });
}

/** 下载设备导入模板 */
export function getDeviceTemplateApi(params?: DeviceVideo.ReqGetDeviceTemplateApi): Promise<Blob> {
  return http.get("/admin/devices/template", params, { responseType: "blob" });
}

/** 设备导入 */
export function postDeviceImportApi(params: DeviceVideo.ReqPostDeviceImportApi) {
  const formData = new FormData();
  formData.append("schoolId", params.schoolId);
  formData.append("file", params.file);
  return http.post<DeviceVideo.ResPostDeviceImportApi>("/admin/devices/import", formData);
}

/** 获取批量更新字段列表 */
export function getDeviceBatchUpdateFieldsApi() {
  return http.get<DeviceVideo.ResGetDeviceBatchUpdateFieldsApi>("/admin/devices/batch-update/fields");
}

/** 下载批量更新模板 */
export function postDeviceBatchUpdateTemplateApi(data: DeviceVideo.ReqPostDeviceBatchUpdateTemplateApi): Promise<Blob> {
  return http.post("/admin/devices/batch-update/template", data, { responseType: "blob" });
}

/** 批量更新设备配置 */
export function postDeviceBatchUpdateApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return http.post<DeviceVideo.ResPostDeviceBatchUpdateApi>("/admin/devices/batch-update", formData);
}
