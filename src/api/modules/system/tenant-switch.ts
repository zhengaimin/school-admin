import type { TenantSwitch } from "@/api/interface";
import http from "@/api";

/** 平台管理员租户切换 API */

/** 获取可进入的租户列表 */
export function getAvailableTenantsApi() {
  return http.get<TenantSwitch.IAvailableTenantVo[]>("/admin/data-scopes/available-tenants");
}

/** 进入某租户 */
export function enterTenantApi(data: TenantSwitch.ReqEnterTenantApi) {
  return http.post<TenantSwitch.ICurrentTenantVo>("/admin/tenant/enter", data);
}

/** 退出当前租户 */
export function exitTenantApi() {
  return http.post("/admin/tenant/exit");
}

/** 获取当前租户（未进入返回 null） */
export function getCurrentTenantApi() {
  return http.get<TenantSwitch.ICurrentTenantVo | null>("/admin/tenant/current");
}
