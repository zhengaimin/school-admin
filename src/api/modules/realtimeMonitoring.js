// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 实时监控
 */

export const real_time_data = () => {
  return http.get(`/admin/monitor/real_time_data?instrument_id=1`);
};
//保存布局
export const layout_add = params => {
  return http.post(`/admin/user/layout/add`, params);
};
//更新布局
export const layout_update = params => {
  return http.post(`/admin/user/layout/update`, params);
};
//布局
export const layout_info = params => {
  return http.get(`/admin/user/layout/info?layout_model=${params.layout_model}`);
};
