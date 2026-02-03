import type { System } from "@/api/interface";
import http from "@/api";

/** 数据权限 API */

/** 获取可分配的学校列表 */
export const getAvailableSchoolsApi = () => {
  return http.get<System.AvailableSchool[]>("/admin/data-scopes/available-schools");
};

/** 获取用户的数据权限 */
export const getUserDataScopeApi = (userId: number) => {
  return http.get<System.ResGetUserDataScopeApi>(`/admin/data-scopes/users/${userId}`);
};

/** 设置用户的数据权限 */
export const putSetUserDataScopeApi = (userId: number, params: System.ReqPutUserDataScopeApi, options = {}) => {
  return http.put(`/admin/data-scopes/users/${userId}`, params, options);
};
