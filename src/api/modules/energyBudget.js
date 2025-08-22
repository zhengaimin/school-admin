// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 能碳预算
 */
//保存能碳配置
export const com_budget_save = params => {
  return http.post(`/admin/budget/com_budget/save`, params);
};
//列表
export const com_budget_list = params => {
  return http.get(`/admin/budget/com_budget/list?${params}`);
};
//详情
export const com_budget_info = params => {
  return http.get(`/admin/budget/com_budget/info?${params}`);
};

//月份预算
export const com_budget_monthly_save = params => {
  return http.post(`/admin/budget/com_budget_monthly/save`, params);
};
export const com_budget_monthly_update = params => {
  return http.post(`/admin/budget/com_budget_monthly/update`, params);
};
export const com_budget_monthly_list = params => {
  return http.get(`/admin/budget/com_budget_monthly/list?${params}`);
};
//能源品种预算
export const variety_energy_year_save = params => {
  return http.post(`/admin/budget/variety_energy/year_save`, params);
};
export const variety_energy_month_save = params => {
  return http.post(`/admin/budget/variety_energy/month_save`, params);
};
export const variety_energy_list = params => {
  return http.get(`/admin/budget/variety_energy/list?${params}`);
};
export const variety_energy_update = params => {
  return http.post(`/admin/budget/variety_energy/update`, params);
};
//产品预算
export const product_energy_year_save = params => {
  return http.post(`/admin/budget/product_energy/year_save`, params);
};
export const product_energy_month_save = params => {
  return http.post(`/admin/budget/product_energy/month_save`, params);
};
export const product_energy_list = params => {
  return http.get(`/admin/budget/product_energy/list?${params}`);
};
//工序
export const process_energy_year_save = params => {
  return http.post(`/admin/budget/process_energy/year_save`, params);
};
export const process_energy_month_save = params => {
  return http.post(`/admin/budget/process_energy/month_save`, params);
};
export const process_energy_list = params => {
  return http.get(`/admin/budget/process_energy/list?${params}`);
};
//部门
export const dept_energy_year_save = params => {
  return http.post(`/admin/budget/dept_energy/year_save`, params);
};
export const dept_energy_month_save = params => {
  return http.post(`/admin/budget/dept_energy/month_save`, params);
};
export const dept_energy_list = params => {
  return http.get(`/admin/budget/dept_energy/list?${params}`);
};
