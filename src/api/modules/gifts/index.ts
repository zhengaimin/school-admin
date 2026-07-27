import http from "@/api";
import type { Gift } from "@/api/interface";

/** 获取赠费列表 */
export function getGiftsApi(params: Gift.ReqGetGiftsApi, options?: any) {
  return http.get<Gift.ResGetGiftsApi>("/admin/gifts", params, options);
}

/** 批量添加赠费 */
export function postGiftsBatchApi(data: Gift.ReqPostGiftsBatchApi) {
  return http.post<Gift.ResPostGiftsBatchApi>("/admin/gifts/batch", data);
}

/** 取消赠费 */
export function deleteGiftApi(params: Gift.ReqCancelGiftApi) {
  return http.delete<Gift.ResCancelGiftApi>(`/admin/gifts/${params.id}`);
}

/** 批量取消赠费 */
export function postGiftsBatchCancelApi(data: Gift.ReqPostGiftsBatchCancelApi) {
  return http.post<Gift.ResPostGiftsBatchCancelApi>("/admin/gifts/batch/cancel", data);
}
