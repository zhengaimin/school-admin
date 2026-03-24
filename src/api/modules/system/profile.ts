import type { System } from "@/api/interface";
import http from "@/api";

/** 个人信息 API */

/** 获取个人信息 */
export const getUserProfileApi = options => {
  return http.get<System.UserProfile>("/admin/profile", {}, options);
};

/** 更新个人信息 */
export const putUpdateUserProfileApi = (params: System.ReqUserProfileUpdate, options) => {
  return http.put<System.ResUserProfileUpdate>("/admin/profile", params, options);
};

/** 修改密码 */
export const postChangeUserPasswordApi = (params: System.ReqUserChangePassword) => {
  return http.post<System.ResUserChangePassword>("/admin/profile/change-password", params);
};
