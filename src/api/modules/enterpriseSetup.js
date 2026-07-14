// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 企业设置
 */
//新增工序
export const production_process_add = params => {
  return http.post(`/admin/production_process/add`, params);
};
//添加核算边界
export const process_boundary_add = params => {
  return http.post(`/admin/production_process/process_boundary/add`, params);
};
//删除核算边界
export const process_boundary_delete = params => {
  return http.post(`/admin/production_process/process_boundary/delete`, params);
};
//核算边界列表
export const process_boundary_list = params => {
  return http.get(`/admin/production_process/process_boundary/list?${params}`);
};
//获取生产工序图
export const production_process_diagram = params => {
  return http.get(`/admin/production_process/diagram?${params}`);
};
//根据产品获取生产工序图
export const product_carbon_footprint_diagram = params => {
  return http.get(`/admin/product_carbon_footprint/product_diagram?${params}`);
};
//设置生产工序图
export const set_process_relation = params => {
  return http.post(`/admin/production_process/process_relation`, params);
};
//更新工序
export const production_process_update = params => {
  return http.post(`/admin/production_process/update`, params);
};
//工序详情
export const production_process_info = params => {
  return http.get(`/admin/production_process/info?id=${params.id}`);
};
//工序列表
export const production_process_list = () => {
  return http.get(`/admin/production_process/list?page=1&page_size=100`);
};
//删除工序
export const production_process_delete = params => {
  return http.post(`/admin/production_process/delete`, params);
};
//获取工序的下游
export const production_process_downstream = params => {
  return http.get(`/admin/production_process/downstream?id=${params.id}`);
};
//工序节点布局位置-新增
export const production_process_layout_add = params => {
  return http.post(`/admin/production_process/layout/add`, params);
};
//工序节点布局位置-更新
export const production_process_layout_update = params => {
  return http.post(`/admin/production_process/layout/update`, params);
};
//工序节点布局位置-详情
export const production_process_layout_info = params => {
  return http.get(`/admin/production_process/layout/info?layout_model=${params.layout_model}`);
};
//工序节点布局位置-删除
export const production_process_layout_delete = params => {
  return http.post(`/admin/production_process/layout/delete`, params);
};

//新增物料
export const product_output_add = params => {
  return http.post(`/admin/production_process/product_output/add`, params);
};
//物料列表
export const output_list = params => {
  return http.get(`/admin/production_process/product_output/list?process_id=${params.process_id}&page=1&page_size=100`);
};
//删除物料
export const output_delete = params => {
  return http.post(`/admin/production_process/product_output/delete`, params);
};
export const bind_product = params => {
  return http.post(`/admin/production_process/bind_product`, params);
};
export const del_product = params => {
  return http.post(`/admin/production_process/del_product`, params);
};

//新增产品
export const product_add = params => {
  return http.post(`/admin/product/add`, params);
};
//新增产品-新
export const product_save = params => {
  return http.post(`/admin/product/save`, params);
};
//产品列表
export const product_list = params => {
  let url = params && params.process_id ? `page=1&page_size=100&process_id=${params.process_id}` : `page=1&page_size=100`;
  return http.get(`/admin/product/list?${url}`);
};
//产品列表
export const product_list_page = params => {
  return http.get(`/admin/product/list?${params}`);
};
//更新产品
export const product_update = params => {
  return http.post(`/admin/product/update`, params);
};
//产品详情
export const product_info = params => {
  return http.get(`/admin/product/info?id=${params.id}`);
};
//删除产品
export const product_delete = params => {
  return http.post(`/admin/product/delete`, params);
};

//新增计量器具/计量器具手动填报绑定
export const instruments_add = params => {
  return http.post(`/admin/instruments/add`, params);
};
//计量器具列表
export const instruments_list = params => {
  return http.get(`/admin/instruments/list?${params}`);
};
//修改计量器具
export const instruments_update = params => {
  return http.post(`/admin/instruments/update`, params);
};
//删除计量器具
export const instruments_delete = params => {
  return http.post(`/admin/instruments/delete`, params);
};
//计量器具详情
export const instruments_info = params => {
  return http.get(`/admin/instruments/info?id=${params.id}`);
};
//计量器具协议绑定
export const bind_config = params => {
  return http.post(`/admin/instruments/bind_config`, params);
};
//手册信息
export const instruments_model = params => {
  return http.get(`/admin/instruments/model?model_specification=${params.model_specification}`);
};

//新增用能单元
export const equipment_add = params => {
  return http.post(`/admin/equipment/add`, params);
};
//用能单元列表
export const equipment_list = params => {
  return http.get(`/admin/equipment/list?${params}`);
};
//修改用能单元
export const equipment_update = params => {
  return http.post(`/admin/equipment/update`, params);
};
//删除用能单元
export const equipment_delete = params => {
  return http.post(`/admin/equipment/delete`, params);
};
//用能单元详情
export const equipment_info = params => {
  return http.get(`/admin/equipment/info?id=${params.id}`);
};
//手册详情
export const equipment_model = params => {
  return http.get(`/admin/equipment/model?model_specification=${params.model_specification}`);
};

// 能源品种
//新增
export const varieties_add = params => {
  return http.post(`/admin/com_varieties/add`, params);
};
//列表
export const varieties_list = params => {
  return http.get(`/admin/com_varieties/list?${params}`);
};
//列表
export const factor_varieties_list = params => {
  return http.get(`/admin/factor_varieties/list?${params}`);
};
//删除
export const varieties_delete = params => {
  return http.post(`/admin/com_varieties/delete`, params);
};
