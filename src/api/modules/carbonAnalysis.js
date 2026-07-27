// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 能碳分析
 */
//触发计算接口
export const calculate = () => {
  return http.post(`/admin/analysis/calculate`);
};
//查询能源/碳排总量
export const total_statistics = params => {
  return http.get(`/admin/analysis/total_statistics?${params}`);
};
//查询综合能源占比接口
export const energy_proportion = params => {
  return http.get(`/admin/analysis/energy_proportion?${params}`);
};
//查询二氧化碳排放-核算边界占比接口
export const carbon_boundary = params => {
  return http.get(`/admin/analysis/carbon_boundary?${params}`);
};
//查询能碳预算对比
export const budget_compare = params => {
  return http.get(`/admin/analysis/budget_compare?${params}`);
};
//综合能源趋势图
export const energy_trend = params => {
  return http.get(`/admin/analysis/energy_trend?${params}`);
};
//碳排放趋势图
export const carbon_trend = params => {
  return http.get(`/admin/analysis/carbon_trend?${params}`);
};
//能源碳排趋势图
export const cal_trend = params => {
  return http.get(`/admin/analysis/cal_trend?${params}`);
};

//能碳流向图
export const yearly_flow = params => {
  return http.get(`/admin/analysis/yearly_flow?${params}`);
};
export const monthly_flow = params => {
  return http.get(`/admin/analysis/monthly_flow?${params}`);
};
export const report_yoy = params => {
  return http.get(`/admin/analysis/report_yoy?${params}`);
};
export const report_calculate = params => {
  return http.get(`/admin/analysis/report_calculate?${params}`);
};
//碳资产-配额管理
export const daily_carbon_price_trend = params => {
  return http.get(`/admin/carbon_asset/daily_carbon_price_trend?${params}`);
};
//碳资产概览
export const carbon_overview = () => {
  return http.get(`/admin/carbon_asset/overview`);
};
//碳资产列表
export const asset_list = params => {
  return http.get(`/admin/carbon_asset/asset_list?${params}`);
};
//年度频率配置
export const com_year_config = params => {
  return http.get(`/admin/com_year_config/info?${params}`);
};
//年度频率配置
export const com_year_config_set = params => {
  return http.post(`/admin/com_year_config/set`, params);
};
