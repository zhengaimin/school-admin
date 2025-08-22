// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 系统通知
 */
//新增
export const notification_sender_add = params => {
  return http.post(`/admin/notification_sender/add`, params);
};
//列表
export const notification_sender_list = () => {
  return http.get(`/admin/notification_sender/list`);
};
//详情
export const notification_sender_info = params => {
  return http.get(`/admin/notification_sender/info?id=${params.id}`);
};
//删除
export const notification_sender_delete = params => {
  return http.post(`/admin/notification_sender/delete`, params);
};

//接收通知列表
export const notification_receiver_list = params => {
  return http.get(`/admin/notification_receiver/list?${params}`);
};
//接收通知详情
export const notification_receiver_info = params => {
  return http.get(`/admin/notification_receiver/info?id=${params.id}`);
};
