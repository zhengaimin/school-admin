/** 设备组接口 */
import http from "@/api";
import type { DeviceGroup } from "@/api/interface";

/** 获取设备组列表 */
export function getDeviceGroupListApi(params?: DeviceGroup.ReqGetDeviceGroupListApi, options?: any) {
  return http.get<DeviceGroup.ResGetDeviceGroupListApi>("/admin/device-groups", params, options);
}

/** 获取设备组详情 */
export function getDeviceGroupDetailApi(id: number) {
  return http.get<DeviceGroup.IDeviceGroupItemVo>(`/admin/device-groups/${id}`);
}

/** 新增设备组 */
export function postDeviceGroupApi(params: DeviceGroup.ReqPostDeviceGroupApi) {
  return http.post<null>("/admin/device-groups", params);
}

/** 更新设备组 */
export function putUpdateDeviceGroupApi(id: number, params: DeviceGroup.ReqPutDeviceGroupApi) {
  return http.put<null>(`/admin/device-groups/${id}`, params);
}

/** 删除设备组 */
export function deleteDeviceGroupApi(id: number) {
  return http.delete<null>(`/admin/device-groups/${id}`);
}

/** 下载设备组导入模板 */
export function getDeviceGroupTemplateApi(): Promise<Blob> {
  return http.get("/admin/device-groups/template", undefined, { responseType: "blob" });
}

/** 导入设备组 */
export function postDeviceGroupImportApi(schoolId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("schoolId", String(schoolId));
  return http.post<DeviceGroup.ResPostDeviceGroupImportApi>("/admin/device-groups/import-excel", formData);
}
