import http from "@/api";
import type { RateVideo } from "@/api/interface/modules/rate";

/** 获取学校通话费率设置 */
export function getSchoolCallRateApi(schoolId: number, options?: any) {
  return http.get<RateVideo.ResGetSchoolCallRateApi>(`/admin/school-rates/${schoolId}/call-rate`, {}, options);
}

/** 设置学校通话费率 */
export function putSchoolCallRateApi(schoolId: number, data: RateVideo.ReqSetSchoolCallRateApi) {
  return http.put(`/admin/school-rates/${schoolId}/call-rate`, data);
}

/** 获取学校留言费率设置 */
export function getSchoolMessageRateApi(schoolId: number, options?: any) {
  return http.get<RateVideo.ResGetSchoolCallRateApi>(`/admin/school-rates/${schoolId}/message-rate`, {}, options);
}

/** 设置学校留言费率 */
export function putSchoolMessageRateApi(schoolId: number, data: RateVideo.ReqSetSchoolCallRateApi) {
  return http.put(`/admin/school-rates/${schoolId}/message-rate`, data);
}
