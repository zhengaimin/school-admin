import http from "@/api";
import type { FaceSync } from "@/api/interface";

/** 获取设备人脸同步状态列表 */
export function getFaceSyncDeviceStatesApi(deviceId: number, params: FaceSync.ReqGetDeviceFaceStatesApi) {
  return http.get<FaceSync.ResGetDeviceFaceStatesApi>(`/admin/face-sync/devices/${deviceId}/states`, params);
}

/** 按设备查询人脸同步状态 */
export function getFaceSyncDeviceStatesByDeviceApi(deviceId: number, params?: FaceSync.ReqGetDeviceFaceSyncStatesByDeviceApi) {
  return http.get<FaceSync.ResGetDeviceFaceSyncStatesByDeviceApi>(`/admin/face-sync/devices/${deviceId}/states`, params);
}

/** 获取学生人脸同步状态列表 */
export function getFaceSyncStudentStatesApi(studentId: number, params: FaceSync.ReqGetStudentFaceStatesApi) {
  return http.get<FaceSync.ResGetStudentFaceStatesApi>(`/admin/face-sync/students/${studentId}/states`, params);
}

/** 获取人脸同步任务列表 */
export function getFaceSyncTasksApi(params: FaceSync.ReqGetFaceSyncTasksApi) {
  return http.get<FaceSync.ResGetFaceSyncTasksApi>("/admin/face-sync/tasks", params);
}

/** 批量触发同步 */
export function postFaceSyncBatchApi(params: FaceSync.ReqPostFaceSyncBatchApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/batch", params);
}

/** 通过标签批量触发同步 */
export function postFaceSyncBatchByTagApi(params: FaceSync.ReqPostFaceSyncBatchByTagApi) {
  return http.post<FaceSync.ResPostFaceSyncBatchByTagApi>("/admin/face-sync/batch", params);
}

/** 批量触发对账 */
export function postFaceSyncReconcileApi(params: FaceSync.ReqPostFaceSyncReconcileApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/reconcile", params);
}

/** 批量重试失败项 */
export function postFaceSyncRetryApi(params: FaceSync.ReqPostFaceSyncRetryApi) {
  return http.post<FaceSync.ResPostFaceSyncActionApi>("/admin/face-sync/retry", params);
}

/** 同步到全校设备 */
export function postFaceSyncSchoolStudentApi(
  schoolId: number,
  studentId: number,
  params: FaceSync.ReqPostFaceSyncSchoolStudentApi
) {
  return http.post<FaceSync.ResPostFaceSyncSchoolStudentApi>(
    `/admin/face-sync/schools/${schoolId}/students/${studentId}`,
    params
  );
}
