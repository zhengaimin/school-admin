// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 表单管理
 */
//新增
export const formAdd = params => {
  return http.post(`/admin/form/add`, params);
};
// 列表
export const formList = params => {
  return http.get(`/admin/form/list?${params}`);
};
// 更新
export const formUpdate = params => {
  return http.post(`/admin/form/update`, params);
};
// 详情
export const formInfo = params => {
  // return http.get(`/formapi/admin/form/info?id=${params.id}`);
  return http.get(`/form/get_form?key=${params.key}`);
};
// 删除
export const formDelete = params => {
  return http.post(`/admin/form/delete`, params);
};
