import type { System, ResPage } from "@/api/interface";
import http from "@/api";

/** 租户管理 API */

/** 新增租户 */
export const postCreateTenantApi = (params: System.ReqTenantCreate) => {
  return http.post<System.ResTenantCreate>("/admin/tenants", params);
};

/** 获取租户列表 */
export const getTenantListApi = (params: System.ReqTenantList, options = {}) => {
  return http.get<ResPage<System.Tenant>>("/admin/tenants", params, options);
};

/** 删除租户 */
export const deleteTenantApi = (id: number) => {
  return http.delete<System.ResDeleteTenantApi>(`/admin/tenants/${id}`);
};

/** 获取租户详情 */
export const getTenantDetailApi = (id: number) => {
  return http.get<System.ResGetTenantDetailApi>(`/admin/tenants/${id}`);
};

/** 修改租户 */
export const putUpdateTenantApi = (id: number, params: System.ReqTenantUpdate) => {
  return http.put<System.ResTenantUpdate>(`/admin/tenants/${id}`, params);
};
