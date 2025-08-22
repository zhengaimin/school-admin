// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户
 */
//新增
export const userAdd = params => {
  return http.post(`/admin/user/add`, params);
};
// 列表
export const userList = params => {
  return http.get(`/admin/user/list?${params}`);
};
// 更新
export const userUpdate = params => {
  return http.post(`/admin/user/update`, params);
};
// 删除
export const userDelete = params => {
  return http.post(`/admin/user/delete`, params);
};
// 重置密码
export const userreset_password = params => {
  return http.post(`/admin/user/reset_password`, params);
};
