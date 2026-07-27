// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 菜单管理
 */
//新增
export const menuAdd = params => {
  return http.post(`/admin/menu/add`, params);
};
// 列表
export const adminMenu = params => {
  return http.get(`/admin/menu?${params}`);
};
// 更新
export const menuUpdate = params => {
  return http.post(`/admin/menu/update`, params);
};
// 详情
export const menuInfo = params => {
  return http.get(`/admin/menu/info?id=${params.id}`);
};
// 删除
export const menuDelete = params => {
  return http.post(`/admin/menu/delete`, params);
};

// 登录用户查看左侧菜单
export const role_menu_tree = () => {
  return http.get(`/admin/menu/role_menu_tree`);
};
// 角色绑定菜单时候显示的菜单
export const role_menu_tree_select = params => {
  return http.get(`/admin/menu/role_menu_tree_select?role_id=${params.role_id}`);
};
export const api_list = params => {
  return http.get(`/admin/menu/api_list?${params}`);
};

// 新增logo
export const system_add = params => {
  return http.post(`/admin/system/add`, params);
};
// 修改logo
export const system_update = params => {
  return http.post(`/admin/system/update`, params);
};
//详情
export const system_info = () => {
  return http.get(`/admin/system/info`);
};
