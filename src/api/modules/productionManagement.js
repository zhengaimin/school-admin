// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

//产品产量列表
export const product_output_list = params => {
  return http.get(`/admin/production/product_output/list?${params}`);
};
//产品产量保存
export const product_output_save = params => {
  return http.post(`/admin/production/product_output/save`, params);
};
