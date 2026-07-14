import http from "@/api";
import type { Announcement } from "@/api/interface";

/** 获取公告列表 */
export function getAnnouncementsApi(params: Announcement.ReqGetAnnouncementsApi) {
  return http.get<Announcement.ResGetAnnouncementsApi>("/admin/announcements", params);
}

/** 获取公告详情 */
export function getAnnouncementDetailApi(id: number, options?: any) {
  return http.get<Announcement.ResGetAnnouncementDetailApi>(`/admin/announcements/${id}`, undefined, options);
}

/** 创建公告 */
export function postCreateAnnouncementApi(params: Announcement.ReqPostAnnouncementApi) {
  return http.post<Announcement.ResPostAnnouncementApi>("/admin/announcements", params);
}

/** 更新公告 */
export function putUpdateAnnouncementApi(id: number, params: Announcement.ReqPutAnnouncementApi) {
  return http.put(`/admin/announcements/${id}`, params);
}

/** 批量发布公告 */
export function postPublishAnnouncementsApi(params: Announcement.ReqPostAnnouncementPublishApi) {
  return http.post("/admin/announcements/publish", params);
}

/** 批量撤回公告 */
export function postRevokeAnnouncementsApi(params: Announcement.ReqPostAnnouncementRevokeApi) {
  return http.post("/admin/announcements/revoke", params);
}

/** 批量删除公告 */
export function deleteAnnouncementsApi(params: Announcement.ReqDeleteAnnouncementApi) {
  return http.delete("/admin/announcements", params);
}
