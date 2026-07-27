import type { System } from "@/api/interface";
import http from "@/api";

/** 权限配置 API */

/** 获取权限模块列表 */
export const getPermissionModulesApi = (params?: System.ReqPermissionModules, options = {}) => {
  return http.get<System.PermissionModulesResp>("/admin/permissions/modules", params, options);
};
