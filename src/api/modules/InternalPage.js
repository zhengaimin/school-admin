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
  return http.get(`/admin/schools`, params);
};
export const schoolsDelete = params => {
  return http.delete(`/admin/schools/${params.id}`, {}, { errorTip: false });
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
// 级部
export const departmentsAdd = params => {
  return http.post(`/admin/departments`, params);
};
export const departmentsUpdate = params => {
  return http.put(`/admin/departments/${params.id}`, params);
};
export const departmentsList = params => {
  return http.get(`/admin/departments?${params}`);
};
export const departmentsDelete = params => {
  return http.delete(`/admin/departments/${params.id}`);
};
export const departmentsDetail = params => {
  return http.get(`/admin/departments/${params.id}`);
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
export const studentsDetail = params => {
  return http.get(`/admin/students/${params.id}`);
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
// 标签
export const devicetagsAdd = params => {
  return http.post(`/admin/device-tags`, params);
};
export const devicetagsUpdate = params => {
  return http.put(`/admin/device-tags/${params.id}`, params);
};
export const devicetagsList = params => {
  return http.get(`/admin/device-tags?${params}`);
};
export const devicetagsListSelect = params => {
  return http.get(`/admin/device-tags/select-options?${params}`);
};
export const devicetagsDelete = params => {
  return http.delete(`/admin/device-tags/${params.id}`);
};
export const devicetagsDetail = params => {
  return http.get(`/admin/device-tags/${params.id}`);
};
export const devicetagsbatchassign = params => {
  return http.post(`/admin/device-tags/batch-assign`, params);
};
export const devicetagsbatchcontrol = params => {
  return http.post(`/admin/device-tags/batch-control`, params);
};
export const devicetagsbatchschedule = params => {
  return http.post(`/admin/device-tags/batch-schedule`, params);
};
// 设备
export const devicesAdd = params => {
  return http.post(`/admin/devices`, params);
};
export const devicesUpdate = params => {
  return http.put(`/admin/devices/${params.id}`, params);
};
export const devicesList = params => {
  return http.get(`/admin/devices`, params);
};
export const devicesDelete = params => {
  return http.delete(`/admin/devices/${params.id}`);
};
export const devicesDetail = params => {
  return http.get(`/admin/devices/${params.id}`);
};
export const devicesbatchcontrol = params => {
  return http.post(`/admin/devices/batch-control`, params);
};
// 充值记录
export const paymentsList = params => {
  return http.get(`/admin/payments?${params}`);
};
export const paymentsDetail = params => {
  return http.get(`/admin/payments/${params.id}`);
};
// 套餐购买记录
export const packagerecordsList = params => {
  return http.get(`/admin/package-records?${params}`);
};
export const packagerecordsDetail = params => {
  return http.get(`/admin/package-records/${params.id}`);
};

export const paymentsStatisticsList = params => {
  return http.get(`/admin/payments/statistics?${params}`);
};
// 学校公话配置 127.0.0.1:8686/admin/device-config
export const deviceconfigAdd = params => {
  return http.post(`/admin/device-config`, params);
};
export const deviceconfigUpdate = params => {
  return http.put(`/admin/device-config/${params.id}`, params);
};
export const deviceconfigList = params => {
  return http.get(`/admin/device-config?${params}`);
};
export const deviceconfigDelete = params => {
  return http.delete(`/admin/device-config/${params.id}`);
};
export const deviceconfigDetail = params => {
  return http.get(`/admin/device-config/${params.id}`);
};
// SOS 电话配置
export const schoolsosAdd = params => {
  return http.post(`/admin/school-sos`, params);
};
export const schoolsosUpdate = params => {
  return http.put(`/admin/school-sos/${params.id}`, params);
};
export const schoolsosList = params => {
  return http.get(`/admin/school-sos?${params}`);
};
export const schoolsosDelete = params => {
  return http.delete(`/admin/school-sos/${params.id}`);
};
export const schoolsosDetail = params => {
  return http.get(`/admin/school-sos/${params.id}`);
};
// 通话时间段配置
export const callTimeAdd = params => {
  return http.post(`/admin/school-call-time`, params);
};
export const callTimeUpdate = params => {
  return http.put(`/admin/school-call-time/${params.id}`, params);
};
export const callTimeList = params => {
  return http.get(`/admin/school-call-time?${params}`);
};
export const callTimeDelete = params => {
  return http.delete(`/admin/school-call-time/${params.id}`);
};
export const callTimeDetail = params => {
  return http.get(`/admin/school-call-time/${params.id}`);
};
// 退款管理
export const refundsList = params => {
  return http.get(`/admin/refunds?${params}`);
};
export const refundsDetail = params => {
  return http.get(`/admin/refunds/${params.id}`);
};
export const refundscheck = params => {
  return http.post(`/admin/refunds/${params.refundApplicationId}/audit`, params);
};
// 亲情号
export const familycontactsAdd = params => {
  return http.post(`/admin/family-contacts`, params);
};
export const studentsdevicecontrol = params => {
  return http.post(`/admin/students/device-control`, params);
};
export const familycontactsUpdate = params => {
  return http.put(`/admin/family-contacts/${params.id}`, params);
};
export const familycontactsList = params => {
  return http.get(`/admin/family-contacts?${params}`);
};
export const familycontactsDelete = params => {
  return http.delete(`/admin/family-contacts/${params.id}`);
};
export const familycontactsDetail = params => {
  return http.get(`/admin/family-contacts/${params.id}`);
};
// 商户号
export const wechatputConfig = params => {
  return http.put(`/admin/wechat-merchant-configs/tenant/${params.tenantId}`, params);
};
export const wechatConfig = params => {
  return http.get(`/admin/wechat-merchant-configs/tenant/${params.tenantId}`);
};
// 套餐配置
export const packagesAdd = params => {
  return http.post(`/admin/packages`, params);
};
export const packagesUpdate = params => {
  return http.put(`/admin/packages/${params.id}`, params);
};
export const packagesList = params => {
  return http.get(`/admin/packages?${params}`);
};
export const packagesDelete = params => {
  return http.delete(`/admin/packages/${params.id}`);
};
export const packagesDetail = params => {
  return http.get(`/admin/packages/${params.id}`);
};
// 学校费率配置
export const schoolcallratedata = params => {
  return http.get(`/admin/school-rates/${params.schoolId}/call-rate`);
};
export const schoolcallrate = params => {
  return http.put(`/admin/school-rates/${params.schoolId}/call-rate`, params);
};
export const schoolmessageratedata = params => {
  return http.get(`/admin/school-rates/${params.schoolId}/message-rate`);
};
export const schoolmessagerate = params => {
  return http.put(`/admin/school-rates/${params.schoolId}/message-rate`, params);
};
export const schoolgeneraldata = params => {
  return http.get(`/admin/school-packages/${params.schoolId}/general`);
};
export const schoolgeneral = params => {
  return http.put(`/admin/school-packages/${params.schoolId}/general`, params);
};
export const schoolfixeddata = params => {
  return http.get(`/admin/school-packages/${params.schoolId}/fixed`);
};
export const schoolfixed = params => {
  return http.put(`/admin/school-packages/${params.schoolId}/fixed`, params);
};

// 年级通话费率配置
export const gradecallratesAdd = params => {
  return http.post(`/admin/grade-call-rates`, params);
};
export const gradecallratesUpdate = params => {
  return http.put(`/admin/grade-call-rates/${params.rateTemplateID}`, params);
};
export const gradecallratesList = params => {
  return http.get(`/admin/grade-call-rates?${params}`);
};
export const gradecallratesDelete = params => {
  return http.delete(`/admin/grade-call-rates/${params.id}`);
};
export const gradecallratesDetail = params => {
  return http.get(`/admin/grade-call-rates/${params.rateTemplateID}`);
};

// 年级留言费率配置
export const grademessageratesAdd = params => {
  return http.post(`/admin/grade-message-rates`, params);
};
export const grademessageratesUpdate = params => {
  return http.put(`/admin/grade-message-rates/${params.rateTemplateID}`, params);
};
export const grademessageratesList = params => {
  return http.get(`/admin/grade-message-rates?${params}`);
};
export const grademessageratesDelete = params => {
  return http.delete(`/admin/grade-message-rates/${params.id}`);
};
export const grademessageratesDetail = params => {
  return http.get(`/admin/grade-message-rates/${params.rateTemplateID}`);
};

// 年级通用套餐配置
export const gradegeneralpackagesAdd = params => {
  return http.post(`/admin/grade-general-packages`, params);
};
export const gradegeneralpackagesUpdate = params => {
  return http.put(`/admin/grade-general-packages/${params.packageTemplateId}`, params);
};
export const gradegeneralpackagesList = params => {
  return http.get(`/admin/grade-general-packages?${params}`);
};
export const gradegeneralpackagesDelete = params => {
  return http.delete(`/admin/grade-general-packages/${params.id}`);
};
export const gradegeneralpackagesDetail = params => {
  return http.get(`/admin/grade-general-packages/${params.packageTemplateId}`);
};
// 年级固定套餐配置
export const gradefixedpackagesAdd = params => {
  return http.post(`/admin/grade-fixed-packages`, params);
};
export const gradefixedpackagesUpdate = params => {
  return http.put(`/admin/grade-fixed-packages/${params.packageTemplateId}`, params);
};
export const gradefixedpackagesList = params => {
  return http.get(`/admin/grade-fixed-packages?${params}`);
};
export const gradefixedpackagesDelete = params => {
  return http.delete(`/admin/grade-fixed-packages/${params.id}`);
};
export const gradefixedpackagesDetail = params => {
  return http.get(`/admin/grade-fixed-packages/${params.packageTemplateId}`);
};
// 查询未配置费率年级
export const gradeunconfiguredList = params => {
  return http.get(`/admin/grade-config/unconfigured?${params}`);
};
// 赠送时间
export const giftsbatch = params => {
  return http.post(`/admin/gifts/batch`, params);
};
export const giftsOne = params => {
  return http.post(`/admin/gifts`, params);
};
/**
 * 礼品批量取消功能
 * @param {Object} params - 请求参数对象
 * @returns {Promise} 返回HTTP POST请求的Promise对象
 */
export const batchcancel = params => {
  return http.post(`/admin/gifts/batch/cancel`, params);
};

export const giftsList = params => {
  return http.get(`/admin/gifts?${params}`);
};

export const giftsDelete = params => {
  return http.delete(`/admin/gifts/${params.id}`);
};
// 通话记录
export const callrecordsList = params => {
  return http.get(`/admin/call-records?${params}`);
};
export const callrecordsDetail = params => {
  return http.get(`/admin/call-records/${params.id}`);
};
export const callrecordsListExportInfo = params => {
  return http.get(`/admin/call-records/export-info?${params}`);
};
// 留言记录
export const messagesList = params => {
  return http.get(`/admin/messages?${params}`);
};
export const messagesDetail = params => {
  return http.get(`/admin/messages/${params.id}`);
};
export const messagesListExportInfo = params => {
  return http.get(`/admin/messages/export-info?${params}`);
};
// 模板
export const modulesassign = params => {
  return http.post(`/admin/miniapp-modules/assign`, params);
};
export const availableList = params => {
  return http.get(`/admin/miniapp-modules/available?${params}`);
};
export const modulesList = params => {
  return http.get(`/admin/miniapp-modules?${params}`);
};
// 金额配置
export const paymentconfigstenant = params => {
  return http.get(`/admin/payment-configs/tenant/${params.tenantId}`);
};
export const paymentconfigsadd = params => {
  return http.put(`/admin/payment-configs/tenant/${params.tenantId}`, params);
};
// 通知配置
export const notificationList = params => {
  return http.get(`/admin/notification-configs`, params);
};
export const notificationDetail = params => {
  return http.get(`/admin/notification-configs/${params.id}`);
};
export const notificationupdate = params => {
  return http.put(`/admin/notification-configs/${params.id}`, params);
};
export const notificationbatchstatus = params => {
  return http.put(`/admin/notification-configs/batch-status`, params);
};
// 充值记录导出
export const paymentsexportinfo = params => {
  return http.get(`/admin/payments/export-info?${params}`);
};
// 套餐购买记录
export const packagerecordsexportinfo = params => {
  return http.get(`/admin/package-records/export-info?${params}`);
};
export const refundsexportinfo = params => {
  return http.get(`/admin/refunds/export-info?${params}`);
};
