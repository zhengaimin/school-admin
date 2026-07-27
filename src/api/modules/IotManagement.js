// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 物联管理
 */
// 厂商管理
//新增
export const manufacturerAdd = params => {
  return http.post(`/admin/manufacturer/add`, params);
};
// 列表
export const manufacturerList = params => {
  return http.get(`/admin/manufacturer/list?${params}`);
};
// 更新
export const manufacturerUpdate = params => {
  return http.put(`/admin/manufacturer/update`, params);
};
// 详情
export const manufacturerInfo = params => {
  return http.get(`/admin/manufacturer/info/${params.id}`);
};
// 删除
export const manufacturerDelete = params => {
  return http.delete(`/admin/manufacturer/delete/${params.id}`);
};
// 型号
//新增
export const meter_modelAdd = params => {
  return http.post(`/admin/meter_model/add`, params);
};
// 列表
export const meter_modelList = params => {
  return http.get(`/admin/meter_model/list?${params}`);
};
// 更新
export const meter_modelUpdate = params => {
  return http.put(`/admin/meter_model/update`, params);
};
// 详情
export const meter_modelInfo = params => {
  return http.get(`/admin/meter_model/info/${params.id}`);
};
// 删除
export const meter_modelDelete = params => {
  return http.delete(`/admin/meter_model/delete/${params.id}`);
};
// 寄存器
//新增
export const registerAdd = params => {
  return http.post(`/admin/register/add`, params);
};
// 列表
export const registerList = params => {
  return http.get(`/admin/register/list?${params}`);
};
// 更新
export const registerUpdate = params => {
  return http.put(`/admin/register/update`, params);
};
// 详情
export const registerInfo = params => {
  return http.get(`/admin/register/info/${params.id}`);
};
// 删除
export const registerDelete = params => {
  return http.delete(`/admin/register/delete/${params.id}`);
};
// 导入寄存器
export const registerImport = params => {
  return http.post(`/admin/register/import`, params);
};

//寄存器模板
//新增
export const register_templateAdd = params => {
  return http.post(`/admin/register_template/add`, params);
};
// 列表
export const register_templateList = params => {
  return http.get(`/admin/register_template/list?${params}`);
};
// 更新
export const register_templateUpdate = params => {
  return http.put(`/admin/register_template/update`, params);
};
// 详情
export const register_templateInfo = params => {
  return http.get(`/admin/register_template/info/${params.id}`);
};
// 删除
export const register_templateDelete = params => {
  return http.delete(`/admin/register_template/delete/${params.id}`);
};

// 协议管理
//新增
export const protocol_templateAdd = params => {
  return http.post(`/admin/protocol_template/add`, params);
};
// 列表
export const protocol_templateList = params => {
  return http.get(`/admin/protocol_template/list?${params}`);
};
// 更新
export const protocol_templateUpdate = params => {
  return http.put(`/admin/protocol_template/update`, params);
};
// 详情
export const protocol_templateInfo = params => {
  return http.get(`/admin/protocol_template/info/${params.id}`);
};
// 删除
export const protocol_templateDelete = params => {
  return http.delete(`/admin/protocol_template/delete/${params.id}`);
};

// 计量器具
//新增
export const instrumentAdd = params => {
  return http.post(`/admin/instrument/add`, params);
};
// 列表
export const instrumentList = params => {
  return http.get(`/admin/instrument/list?${params}`);
};
// 更新
export const instrumentConfig = params => {
  return http.put(`/admin/instrument/config`, params);
};
// 详情
export const instrumentInfo = params => {
  return http.get(`/admin/instrument/info/${params.id}`);
};
// 删除
export const instrumentDelete = params => {
  return http.delete(`/admin/instrument/delete/${params.id}`);
};
export const instrumentOffline = params => {
  return http.put(`/admin/instrument/offline/${params.id}`);
};
// 计量器具寄存器测试
export const test_register = params => {
  return http.post(`/admin/instrument/test_register`, params);
};
