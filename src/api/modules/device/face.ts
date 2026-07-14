import http from "@/api";
import type { FaceSync } from "@/api/interface";

/** 获取设备人脸库列表 */
export function getDeviceFaceStatesApi(deviceId: number, params: FaceSync.ReqGetDeviceFaceStatesApi) {
  return http.get<FaceSync.ResGetDeviceFaceStatesApi>(`/admin/face-sync/devices/${deviceId}/states`, params);
}

/** 批量触发全量同步 */
export function postDeviceFaceSyncBatchApi(params: FaceSync.ReqPostFaceSyncBatchApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/batch", params);
}

/** 批量触发对账 */
export function postDeviceFaceSyncReconcileApi(params: FaceSync.ReqPostFaceSyncReconcileApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/reconcile", params);
}

/** 批量重试 */
export function postDeviceFaceSyncRetryApi(params: FaceSync.ReqPostFaceSyncRetryApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/retry", params);
}
