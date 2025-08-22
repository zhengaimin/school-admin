// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 组织架构
 */
//新增
export const organizationAdd = params => {
  return http.post(`/admin/organization/add`, params);
};
// 获取组织架构树详情
export const organizationList = () => {
  return http.get(`/admin/organization/list`);
};
// 获取组织架构树
export const organizationTree = params => {
  return http.get(`/admin/organization/tree?${params}`);
};
// 更新
export const organizationUpdate = params => {
  return http.post(`/admin/organization/update`, params);
};
// 删除
export const organizationDelete = params => {
  return http.post(`/admin/organization/delete`, params);
};
// 组织架构列表
export const organizationData = params => {
  return http.get(`/admin/organization?${params}`);
};
// 获取组织结构详情
export const organizationInfo = params => {
  return http.get(`/admin/organization/info?id=${params.id}`);
};
