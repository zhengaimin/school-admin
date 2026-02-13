import http from "@/api";
import type { DeviceConfig, DeviceDialConfig, SchoolDeviceConfig } from "@/api/interface";

/** 获取设备级功能点配置 */
export function getDeviceFeatureConfigApi(deviceId: number) {
  return http.get<DeviceConfig.ResDeviceFeatureConfig>(`/admin/device-feature-configs/device/${deviceId}`);
}

/** 更新设备级功能点配置（只保存，不下发） */
export function updateDeviceFeatureConfigApi(deviceId: number, data: DeviceConfig.ReqUpdateDeviceFeatureConfig) {
  return http.put<DeviceConfig.ResUpdateDeviceFeatureConfig>(`/admin/device-feature-configs/device/${deviceId}`, data);
}

/** 更新学校级功能点配置（通过配置ID，只保存，不下发） */
export function updateSchoolDeviceFeatureConfigApi(configId: number, data: DeviceConfig.ReqUpdateDeviceFeatureConfig) {
  return http.put<DeviceConfig.ResUpdateDeviceFeatureConfig>(`/admin/device-feature-configs/${configId}`, data);
}

/** 获取配置列表（当前租户下所有学校的配置） */
export function getDeviceFeatureConfigListApi(params?: DeviceConfig.ReqDeviceFeatureConfigListParams) {
  return http.get<DeviceConfig.ResDeviceFeatureConfigListData>("/admin/device-feature-configs", params);
}

/** 同步配置（仅支持设备级同步） */
export function postDeviceFeatureConfigSyncApi(data: DeviceConfig.ReqDeviceFeatureConfigSync) {
  return http.post<DeviceConfig.ResDeviceFeatureConfigSync>("/admin/device-feature-configs/sync", data);
}

/** 获取设备配置列表（支持多维度筛选） */
export function getSchoolDeviceConfigListApi(params?: SchoolDeviceConfig.ReqGetSchoolDeviceConfigListApi) {
  return http.get<SchoolDeviceConfig.ResGetSchoolDeviceConfigListApi>("/admin/device-configs", params);
}

/** 获取公话配置列表 */
export function getDeviceDialConfigListApi(params?: DeviceDialConfig.ReqGetDeviceDialConfigListApi) {
  return http.get<DeviceDialConfig.ResGetDeviceDialConfigListApi>("/admin/device-config", params);
}

/** 获取公话配置详情 */
export function getDeviceDialConfigDetailApi(id: number) {
  return http.get<DeviceDialConfig.ResGetDeviceDialConfigDetailApi>(`/admin/device-config/${id}`);
}

/** 删除公话配置 */
export function deleteDeviceDialConfigApi(id: number) {
  return http.delete(`/admin/device-config/${id}`);
}

/** 添加公话配置 */
export function postDeviceDialConfigApi(data: DeviceDialConfig.ReqPostDeviceDialConfigApi) {
  return http.post<DeviceDialConfig.ResPostDeviceDialConfigApi>("/admin/device-config", data);
}

/** 修改公话配置 */
export function putDeviceDialConfigApi(id: number, data: DeviceDialConfig.ReqPutDeviceDialConfigApi) {
  return http.put<null>(`/admin/device-config/${id}`, data);
}

/** 更新单个设备配置 */
export function putSchoolDeviceConfigApi(id: number, data: SchoolDeviceConfig.ReqPutSchoolDeviceConfigApi) {
  return http.put(`/admin/device-configs/${id}`, data);
}
