import type { System, ResPage } from "@/api/interface";
import http from "@/api";

/** ==================== 角色管理 API ==================== */

/** 获取角色列表 */
export const getRoleListApi = (params: System.ReqRoleList) => {
  return http.get<ResPage<System.Role>>("/admin/roles", params);
};

/** 获取所有角色（不分页，用于下拉选择） */
export const getAllRolesApi = () => {
  return http.get<System.Role[]>("/admin/roles/all");
};

/** 获取角色详情 */
export const getRoleDetailApi = (id: number) => {
  return http.get<System.Role>(`/admin/roles/${id}`);
};

/** 创建角色 */
export const createRoleApi = (params: System.ReqRoleSave) => {
  return http.post<{ id: number; code: string }>("/admin/roles", params);
};

/** 更新角色 */
export const updateRoleApi = (id: number, params: Partial<System.ReqRoleSave>) => {
  return http.put(`/admin/roles/${id}`, params);
};

/** 删除角色 */
export const deleteRoleApi = (id: number) => {
  return http.delete(`/admin/roles/${id}`);
};

/** ==================== 权限配置 API ==================== */

/** 获取权限模块列表 */
export const getPermissionModulesApi = () => {
  return http.get<System.PermissionModulesResp>("/admin/permissions/modules");
};

/** 获取角色已有权限 */
export const getRolePermissionsApi = (roleId: number) => {
  return http.get<number[]>(`/admin/permissions/role-permissions/${roleId}`);
};

/** 设置角色权限 */
export const setRolePermissionsApi = (roleId: number, params: System.ReqRolePermissionSave) => {
  return http.post(`/admin/permissions/role-permissions/${roleId}`, params);
};

/** ==================== 用户管理 API ==================== */

/** 获取用户列表 */
export const getAdminUserListApi = (params: System.ReqUserList) => {
  return http.get<ResPage<System.AdminUser>>("/admin/users", params);
};

/** 获取用户详情 */
export const getAdminUserDetailApi = (id: number) => {
  return http.get<System.AdminUser>(`/admin/users/${id}`);
};

/** 创建用户 */
export const createAdminUserApi = (params: System.ReqUserSave) => {
  return http.post<{ id: number }>("/admin/users", params);
};

/** 更新用户 */
export const updateAdminUserApi = (id: number, params: Partial<System.ReqUserSave>) => {
  return http.put(`/admin/users/${id}`, params);
};

/** 删除用户 */
export const deleteAdminUserApi = (id: number) => {
  return http.delete(`/admin/users/${id}`);
};

/** 重置用户密码 */
export const resetUserPasswordApi = (id: number) => {
  return http.post(`/admin/users/${id}/reset-password`);
};

/** ==================== 数据权限 API ==================== */

/** 获取可分配的学校列表 */
export const getAvailableSchoolsApi = () => {
  return http.get<System.AvailableSchool[]>("/admin/data-scopes/available-schools");
};

/** 获取用户的数据权限 */
export const getUserDataScopeApi = (userId: number) => {
  return http.get<System.UserDataScope>(`/admin/data-scopes/users/${userId}`);
};

/** 设置用户的数据权限 */
export const setUserDataScopeApi = (userId: number, params: System.ReqUserDataScopeSave) => {
  return http.put(`/admin/data-scopes/users/${userId}`, params);
};

/** ==================== 组织架构部门 API ==================== */

/** 获取部门列表 */
export const getOrgDepartmentListApi = (params: System.ReqOrgDepartmentList) => {
  return http.get<ResPage<System.OrgDepartment>>("/admin/org-departments", params);
};
