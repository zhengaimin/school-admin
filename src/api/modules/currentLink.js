// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 网关设备
 */

export const device_list = params => {
  return http.get(`/admin/device/list?${params}`);
};
export const device_update = params => {
  return http.put(`/admin/device/update`, params);
};
export const send_register_config = params => {
  return http.put(`/admin/device/send_register_config/${params.id}`);
};
