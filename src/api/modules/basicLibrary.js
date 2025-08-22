import http from "@/api";

/**
 * @name 因子库
 */

//新增
export const factor_varieties_add = params => {
  return http.post(`/admin/factor_varieties/add`, params);
};
//更新
export const factor_varieties_update = params => {
  return http.post(`/admin/factor_varieties/update`, params);
};
//详情
export const factor_varieties_info = params => {
  return http.get(`/admin/factor_varieties/info?id=${params.id}`);
};
//列表
export const factor_varieties_list = params => {
  return http.get(`/admin/factor_varieties/list?${params}`);
};
//历史数据
export const factor_history_list = params => {
  return http.get(`/admin/factor_history/list?${params}`);
};
//删除
export const factor_varieties_delete = params => {
  return http.post(`/admin/factor_varieties/delete`, params);
};
//行业品种
//绑定
export const industry_varieties_add = params => {
  return http.post(`/admin/industry_varieties/add`, params);
};
//列表
export const com_industry_varieties_list = params => {
  return http.get(`/admin/com_industry_varieties/list?${params}`);
};
export const factor_history_add = params => {
  return http.post(`/admin/factor_history/add`, params);
};
export const industry_varieties_list = params => {
  return http.get(`/admin/industry_varieties/list?${params}`);
};
//删除
export const industry_varieties_delete = params => {
  return http.post(`/admin/industry_varieties/delete`, params);
};

//因子库获取行业-工业过程列表
export const industry_relation = params => {
  return http.get(`/admin/emission_factors/industry_relation?mode=${params.mode}`);
};
//化石燃料燃烧新增
export const fossil_fuels_add = params => {
  return http.post(`/admin/emission_factors/fossil_fuels/add`, params);
};
//化石燃料燃烧更新
export const fossil_fuels_update = params => {
  return http.post(`/admin/emission_factors/fossil_fuels/update`, params);
};
//化石燃料燃烧详情
export const fossil_fuels_info = params => {
  return http.get(`/admin/emission_factors/fossil_fuels/info?id=${params.id}`);
};
//化石燃料燃烧列表
export const fossil_fuels_list = params => {
  return http.get(`/admin/emission_factors/fossil_fuels/list?${params}`);
};
//化石燃料燃烧删除
export const fossil_fuels_delete = params => {
  return http.post(`/admin/emission_factors/fossil_fuels/delete`, params);
};
//从基础因子库选择
export const fossil_fuels_choice = params => {
  return http.post(`/admin/emission_factors/fossil_fuels/choice`, params);
};

// 电力
//新增
export const electricity_add = params => {
  return http.post(`/admin/emission_factors/net_purchased_electricity/add`, params);
};
//更新
export const electricity_update = params => {
  return http.post(`/admin/emission_factors/net_purchased_electricity/update`, params);
};
//详情
export const electricity_info = params => {
  return http.get(`/admin/emission_factors/net_purchased_electricity/info?id=${params.id}`);
};
//列表
export const electricity_list = params => {
  return http.get(`/admin/emission_factors/net_purchased_electricity/list?${params}`);
};
//删除
export const electricity_delete = params => {
  return http.post(`/admin/emission_factors/net_purchased_electricity/delete`, params);
};
//从基础因子库选择
export const electricity_choice = params => {
  return http.post(`/admin/emission_factors/net_purchased_electricity/choice`, params);
};

//热水
//新增
export const water_add = params => {
  return http.post(`/admin/emission_factors/net_purchased_hot_water/add`, params);
};
//更新
export const water_update = params => {
  return http.post(`/admin/emission_factors/net_purchased_hot_water/update`, params);
};
//详情
export const water_info = params => {
  return http.get(`/admin/emission_factors/net_purchased_hot_water/info?id=${params.id}`);
};
//列表
export const water_list = params => {
  return http.get(`/admin/emission_factors/net_purchased_hot_water/list?${params}`);
};
//删除
export const water_delete = params => {
  return http.post(`/admin/emission_factors/net_purchased_hot_water/delete`, params);
};
//从基础因子库选择
export const water_choice = params => {
  return http.post(`/admin/emission_factors/net_purchased_hot_water/choice`, params);
};

//蒸汽
//新增
export const steam_add = params => {
  return http.post(`/admin/emission_factors/net_purchased_steam/add`, params);
};
//更新
export const steam_update = params => {
  return http.post(`/admin/emission_factors/net_purchased_steam/update`, params);
};
//详情
export const steam_info = params => {
  return http.get(`/admin/emission_factors/net_purchased_steam/info?id=${params.id}`);
};
//列表
export const steam_list = params => {
  return http.get(`/admin/emission_factors/net_purchased_steam/list?${params}`);
};
//删除
export const steam_delete = params => {
  return http.post(`/admin/emission_factors/net_purchased_steam/delete`, params);
};
//从基础因子库选择
export const steam_choice = params => {
  return http.post(`/admin/emission_factors/net_purchased_steam/choice`, params);
};

//排放过程字段
//新增
export const emission_process_field_add = params => {
  return http.post(`/admin/emission_process_field/add`, params);
};
//更新
export const emission_process_field_update = params => {
  return http.post(`/admin/emission_process_field/update`, params);
};
//详情
export const emission_process_field_info = params => {
  return http.get(`/admin/emission_process_field/info?id=${params.id}`);
};
//列表
export const emission_process_field_list = params => {
  return http.get(`/admin/emission_process_field/list?${params}`);
};
//删除
export const emission_process_field_delete = params => {
  return http.post(`/admin/emission_process_field/delete`, params);
};

export const industry_emission_process_list = () => {
  return http.get(`/admin/industry_emission_process/list`);
};

//因子库列表
export const factor_list = params => {
  return http.get(`/admin/factor/list?${params}`);
};
//新增
export const factor_add = params => {
  return http.post(`/admin/factor/add`, params);
};
//更新
export const factor_update = params => {
  return http.post(`/admin/factor/update`, params);
};
//删除
export const factor_delete = params => {
  return http.post(`/admin/factor/delete`, params);
};

//指南管理
export const factor_source_list = params => {
  return http.get(`/admin/factor_source/list?${params}`);
};
//新增
export const factor_source_add = params => {
  return http.post(`/admin/factor_source/add`, params);
};
//更新
export const factor_source_update = params => {
  return http.post(`/admin/factor_source/update`, params);
};
//删除
export const factor_source_delete = params => {
  return http.post(`/admin/factor_source/delete`, params);
};
//转移
export const pick_to_com = params => {
  return http.post(`/admin/factor/pick_to_com`, params);
};

export const elec_price_add = params => {
  return http.post(`/admin/elec_price/add`, params);
};
export const elec_price_list = params => {
  return http.get(`/admin/elec_price/region_list?${params}`);
};
export const elec_price_detail = params => {
  return http.get(`/admin/elec_price/detail?${params}`);
};
// 单位管理
export const unit_add = params => {
  return http.post(`/admin/unit/add`, params);
};
export const unit_update = params => {
  return http.post(`/admin/unit/update`, params);
};
export const unit_list = params => {
  return http.get(`/admin/unit/list?${params}`);
};
export const unit_delete = params => {
  return http.delete(`/admin/unit/delete/${params.id}`);
};
// 单位转换
export const unit_change_add = params => {
  return http.post(`/admin/unit_change/add`, params);
};
export const unit_change_update = params => {
  return http.post(`/admin/unit_change/update`, params);
};
export const unit_change_list = params => {
  return http.get(`/admin/unit_change/list?${params}`);
};
export const unit_change_delete = params => {
  return http.delete(`/admin/unit_change/delete/${params.id}`);
};
// 行业相关标准
export const industry_standard_add = params => {
  return http.post(`/admin/industry_standard/add`, params);
};
export const industry_standard_update = params => {
  return http.put(`/admin/industry_standard/update`, params);
};
export const industry_standard_list = params => {
  return http.get(`/admin/industry_standard/list?${params}`);
};
export const industry_standard_delete = params => {
  return http.delete(`/admin/industry_standard/delete/${params.id}`);
};
// 行业领跑者
export const industry_leader_add = params => {
  return http.post(`/admin/industry_leader/add`, params);
};
export const industry_leader_update = params => {
  return http.put(`/admin/industry_leader/update`, params);
};
export const industry_leader_list = params => {
  return http.get(`/admin/industry_leader/list?${params}`);
};
export const industry_leader_delete = params => {
  return http.delete(`/admin/industry_leader/delete/${params.id}`);
};
// 行业重点领域
export const industry_domain_add = params => {
  return http.post(`/admin/industry_domain/add`, params);
};
export const industry_domain_update = params => {
  return http.put(`/admin/industry_domain/update`, params);
};
export const industry_domain_list = params => {
  return http.get(`/admin/industry_domain/list?${params}`);
};
export const industry_domain_delete = params => {
  return http.delete(`/admin/industry_domain/delete/${params.id}`);
};
