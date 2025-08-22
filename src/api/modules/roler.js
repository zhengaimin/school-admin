// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 角色管理
 */
//新增
export const roleAdd = params => {
  return http.post(`/admin/role/add`, params);
};
// 列表
export const roleList = params => {
  return http.get(`/admin/role/list?${params}`);
};
// 更新
export const roleUpdate = params => {
  return http.post(`/admin/role/update`, params);
};
// 详情
export const roleInfo = params => {
  return http.get(`/admin/role/info?id=${params.id}`);
};
// 删除
export const roleDelete = params => {
  return http.post(`/admin/role/delete`, params);
};
