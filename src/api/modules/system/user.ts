import type { System, ResPage } from "@/api/interface";
import http from "@/api";

/** 用户管理 API */

/** 获取用户列表 */
export const getAdminUserListApi = (params: System.ReqUserList) => {
  return http.get<ResPage<System.AdminUser>>("/admin/users", params);
};

/** 获取用户详情 */
export const getAdminUserDetailApi = (id: number) => {
  return http.get<System.AdminUser>(`/admin/users/${id}`);
};

/** 创建用户 */
export const postCreateAdminUserApi = (params: System.ReqUserSave) => {
  return http.post<System.ResUserCreate>("/admin/users", params);
};

/** 更新用户 */
export const putUpdateAdminUserApi = (id: number, params: System.ReqPutAdminUserUpdateApi) => {
  return http.put(`/admin/users/${id}`, params);
};

/** 批量更新用户所属部门 */
export const putBatchUpdateAdminUsersOrgDepartmentApi = (params: System.ReqBatchUpdateAdminUsersOrgDepartmentApi) => {
  return http.put<System.ResBatchUpdateAdminUsersOrgDepartmentApi>("/admin/users/batch-org-department", params);
};

/** 删除用户 */
export const deleteAdminUserApi = (id: number) => {
  return http.delete(`/admin/users/${id}`);
};

/** 重置用户密码 */
export const postResetUserPasswordApi = (id: number, params: System.ReqPostResetUserPasswordApi = {}) => {
  return http.post<System.ResPostResetUserPasswordApi>(`/admin/users/${id}/reset-password`, params);
};
