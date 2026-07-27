// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 碳足迹模块
 */
//新增碳足迹
export const product_carbon_footprint_add = params => {
  return http.post(`/admin/product_carbon_footprint/add`, params);
};
//列表
export const product_carbon_footprint_list = params => {
  return http.get(`/admin/product_carbon_footprint/list?${params}`);
};
//删除
export const product_carbon_footprint_delete = params => {
  return http.post(`/admin/product_carbon_footprint/delete`, params);
};
//获取工序能源比例
export const get_process_energy_proportion = params => {
  return http.get(`/admin/product_carbon_footprint/get_process_energy_proportion?${params}`);
};
//获取产品碳足迹某工序某能源已填报比例
export const energy_used_proportion = params => {
  return http.get(`/admin/product_carbon_footprint/energy_used_proportion?${params}`);
};
//配置工序能源比例
export const set_process_energy_proportion = params => {
  return http.post(`/admin/product_carbon_footprint/set_process_energy_proportion`, params);
};
//获取产品碳足迹状态
export const product_carbon_footprint_status = params => {
  return http.get(`/admin/product_carbon_footprint/status?${params}`);
};
//产品碳足迹计算能源分配比例
export const product_carbon_footprint_calculate = params => {
  return http.get(`/admin/product_carbon_footprint/calculate?${params}`);
};
//获取产品碳足迹计算数据列表
export const product_carbon_footprint_data_list = params => {
  return http.get(`/admin/product_carbon_footprint/data_list?${params}`);
};
//保存产品碳足迹计算数据
export const product_carbon_footprint_data_fill = params => {
  return http.post(`/admin/product_carbon_footprint/data_fill`, params);
};
//获取产品生产过程排放占比列表
export const emission_type_percent_list = params => {
  return http.get(`/admin/product_carbon_footprint/emission_type_percent_list?${params}`);
};
//获取LCA排放占比列表
export const lca_percent_list = params => {
  return http.get(`/admin/product_carbon_footprint/lca_percent_list?${params}`);
};
//获取不同能源品种占比列表
export const variety_percent_list = params => {
  return http.get(`/admin/product_carbon_footprint/variety_percent_list?${params}`);
};
//获取产品碳足迹年度趋势
export const carbon_footprint_year_trend = params => {
  return http.get(`/admin/product_carbon_footprint/year_trend?${params}`);
};
//获取产品碳足迹概览信息
export const carbon_footprint_overview = params => {
  return http.get(`/admin/product_carbon_footprint/overview?${params}`);
};
