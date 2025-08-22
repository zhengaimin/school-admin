// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 表单管理
 */
// 合作企业管理
//新增
export const tenantAdd = params => {
  return http.post(`/admin/tenant/add`, params);
};
// 列表
export const tenantList = params => {
  return http.get(`/admin/tenant/list?${params}`);
};
// 更新
export const tenantUpdate = params => {
  return http.post(`/admin/tenant/update`, params);
};
// 详情
export const tenantInfo = params => {
  return http.get(`/admin/tenant/info?id=${params.id}`);
};
// 删除
export const tenantDelete = params => {
  return http.post(`/admin/tenant/delete`, params);
};

// 列表
export const comList = params => {
  return http.get(`/admin/tenant/com_list?${params}`);
};
// 接口管理
//新增
export const sys_apiAdd = params => {
  return http.post(`/admin/sys_api/add`, params);
};
// 列表
export const sys_apiList = params => {
  return http.get(`/admin/sys_api/list?${params}`);
};
// 更新
export const sys_apiUpdate = params => {
  return http.post(`/admin/sys_api/update`, params);
};
// 详情
export const sys_apiInfo = params => {
  return http.get(`/admin/sys_api/info?id=${params.id}`);
};
// 删除
export const sys_apiDelete = params => {
  return http.post(`/admin/sys_api/delete`, params);
};
// 数据字典
//新增
export const dict_typeAdd = params => {
  return http.post(`/admin/dict_type/add`, params);
};
// 列表
export const dict_typeList = params => {
  return http.get(`/admin/dict_type/list?${params}`);
};
// 更新
export const dict_typeUpdate = params => {
  return http.post(`/admin/dict_type/update`, params);
};
// 详情
export const dict_typeInfo = params => {
  return http.get(`/admin/dict_type/info?id=${params.id}`);
};
// 删除
export const dict_typeDelete = params => {
  return http.post(`/admin/dict_type/delete`, params);
};
// 字典数据
//新增
export const dict_dataAdd = params => {
  return http.post(`/admin/dict_data/add`, params);
};
// 列表
export const dict_dataList = params => {
  return http.get(`/admin/dict_data/list?${params}`);
};
// 更新
export const dict_dataUpdate = params => {
  return http.post(`/admin/dict_data/update`, params);
};
// 详情
export const dict_dataInfo = params => {
  return http.get(`/admin/dict_data/info?id=${params.id}`);
};
// 删除
export const dict_dataDelete = params => {
  return http.post(`/admin/dict_data/delete`, params);
};
//合作方账号管理
//新增
export const user_tenantAdd = params => {
  return http.post(`/admin/user_tenant/add`, params);
};
// 列表
export const user_tenantList = params => {
  return http.get(`/admin/user_tenant/list?${params}`);
};
// 更新
export const user_tenantUpdate = params => {
  return http.post(`/admin/user_tenant/update`, params);
};
// 详情
export const user_tenantInfo = params => {
  return http.get(`/admin/user_tenant/info?id=${params.id}`);
};
// 删除
export const user_tenantDelete = params => {
  return http.post(`/admin/user_tenant/delete`, params);
};
// 重置密码
export const reset_password = params => {
  return http.post(`/admin/user_tenant/reset_password`, params);
};

//单位管理
//新增
export const unit_add = params => {
  return http.post(`/admin/emission_factors/unit/add`, params);
};
// 列表
export const unit_list = params => {
  return http.get(`/admin/emission_factors/unit/list?${params}`);
};
// 更新
export const unit_update = params => {
  return http.post(`/admin/emission_factors/unit/update`, params);
};
// 详情
export const unit_info = params => {
  return http.get(`/admin/emission_factors/unit/info?id=${params.id}`);
};
// 删除
export const unit_delete = params => {
  return http.post(`/admin/emission_factors/unit/delete`, params);
};

//运维账号管理
//新增
export const user_maintainerAdd = params => {
  return http.post(`/admin/user_maintainer/add`, params);
};
// 列表
export const user_maintainerList = params => {
  return http.get(`/admin/user_maintainer/list?${params}`);
};
// 更新
export const user_maintainerUpdate = params => {
  return http.post(`/admin/user_maintainer/update`, params);
};
// 详情
export const user_maintainerInfo = params => {
  return http.get(`/admin/user_maintainer/info?id=${params.id}`);
};
// 删除
export const user_maintainerDelete = params => {
  return http.post(`/admin/user_maintainer/delete`, params);
};
// 重置密码
export const user_maintainer_reset_password = params => {
  return http.post(`/admin/user_maintainer/reset_password`, params);
};

// 学校
export const schoolsAdd = params => {
  return http.post(`/admin/schools`, params);
};
export const schoolsUpdate = params => {
  return http.put(`/admin/schools/${params.id}`, params);
};
export const schoolsList = params => {
  return http.get(`/admin/schools?${params}`);
};
export const schoolsDelete = params => {
  return http.delete(`/admin/schools/${params.id}`);
};
export const schoolsDetail = params => {
  return http.get(`/admin/schools/${params.id}`);
};
// 年级
export const gradesAdd = params => {
  return http.post(`/admin/grades`, params);
};
export const gradesUpdate = params => {
  return http.put(`/admin/grades/${params.id}`, params);
};
export const gradesList = params => {
  return http.get(`/admin/grades?${params}`);
};
export const gradesDelete = params => {
  return http.delete(`/admin/grades/${params.id}`);
};
export const gradesDetail = params => {
  return http.get(`/admin/grades/${params.id}`);
};
// 班级
export const classesAdd = params => {
  return http.post(`/admin/classes`, params);
};
export const classesUpdate = params => {
  return http.put(`/admin/classes/${params.id}`, params);
};
export const classesList = params => {
  return http.get(`/admin/classes?${params}`);
};
export const classesDelete = params => {
  return http.delete(`/admin/classes/${params.id}`);
};
export const classesDetail = params => {
  return http.get(`/admin/classes/${params.id}`);
};
// 学生
export const studentsAdd = params => {
  return http.post(`/admin/students`, params);
};
export const studentsList = params => {
  return http.get(`/admin/students?${params}`);
};
export const studentsUpdate = params => {
  return http.put(`/admin/students/${params.id}`, params);
};
export const studentsDelete = params => {
  return http.delete(`/admin/students/${params.id}`);
};
// export const classesDetail = params => {
//   return http.get(`/admin/students/${params.id}`);
// };
// 设备组
export const devicegroupsAdd = params => {
  return http.post(`/admin/device-groups`, params);
};
export const devicegroupsUpdate = params => {
  return http.put(`/admin/device-groups/${params.id}`, params);
};
export const devicegroupsList = params => {
  return http.get(`/admin/device-groups?${params}`);
};
export const devicegroupsDelete = params => {
  return http.delete(`/admin/device-groups/${params.id}`);
};
export const devicegroupsDetail = params => {
  return http.get(`/admin/device-groups/${params.id}`);
};

// 设备 127.0.0.1:8686/admin/devices
export const devicesAdd = params => {
  return http.post(`/admin/devices`, params);
};
export const devicesUpdate = params => {
  return http.put(`/admin/devices/${params.id}`, params);
};
export const devicesList = params => {
  return http.get(`/admin/devices?${params}`);
};
export const devicesDelete = params => {
  return http.delete(`/admin/devices/${params.id}`);
};
export const devicesDetail = params => {
  return http.get(`/admin/devices/${params.id}`);
};
