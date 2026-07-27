// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 碳中和
 */

//列表
export const carbon_article_list = params => {
  return http.get(`/admin/carbon_article/list?${params}`);
};
//新增
export const carbon_article_add = params => {
  return http.post(`/admin/carbon_article/add`, params);
};
//详情
export const carbon_article_info = params => {
  return http.get(`/admin/carbon_article/info?id=${params.id}`);
};
//删除
export const carbon_article_delete = params => {
  return http.post(`/admin/carbon_article/delete`, params);
};
