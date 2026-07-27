import type { System, ResPage } from "@/api/interface";
import http from "@/api";

/** 组织架构部门 API */

/** 创建部门 */
export const postCreateOrgDepartmentApi = (params: System.ReqOrgDepartmentCreate) => {
  return http.post<System.OrgDepartment>("/admin/org-departments", params);
};

/** 更新部门 */
export const putUpdateOrgDepartmentApi = (id: number, params: System.ReqOrgDepartmentUpdate) => {
  return http.put<System.ResOrgDepartmentUpdate>(`/admin/org-departments/${id}`, params);
};

/** 删除部门 */
export const deleteOrgDepartmentApi = (id: number) => {
  return http.delete(`/admin/org-departments/${id}`);
};

/** 获取部门列表 */
export const getOrgDepartmentListApi = (params: System.ReqOrgDepartmentList, options = {}) => {
  return http.get<ResPage<System.OrgDepartment>>("/admin/org-departments", params, options);
};
