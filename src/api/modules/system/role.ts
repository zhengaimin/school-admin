import type { System, ResPage } from "@/api/interface";
import http from "@/api";

/** 角色管理 API */

/** 获取角色列表 */
export const getRoleListApi = (params: System.ReqRoleList, options = {}) => {
  return http.get<ResPage<System.Role>>("/admin/roles", params, options);
};

/** 获取角色详情 */
export const getRoleDetailApi = (id: number) => {
  return http.get<System.ResGetRoleDetailApi>(`/admin/roles/${id}`);
};

/** 创建角色 */
export const postCreateRoleApi = (params: System.ReqRoleCreate) => {
  return http.post<System.ResRoleCreate>("/admin/roles", params);
};

/** 更新角色 */
export const putUpdateRoleApi = (id: number, params: Partial<System.ReqRoleSave>) => {
  return http.put(`/admin/roles/${id}`, params);
};

/** 删除角色 */
export const deleteRoleApi = (id: number) => {
  return http.delete(`/admin/roles/${id}`);
};
