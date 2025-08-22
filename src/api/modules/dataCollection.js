// import { PORTAPI } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 企业设置
 */

//数据采集列表接口
export const report_list = params => {
  return http.get(
    `/admin/report/list?year=${params.year}&commit_date=${params.commit_date}&emission_process_type=${params.emission_process_type}&process_id=${params.process_id}`
  );
};
//数据采集
export const report_upsert = params => {
  return http.post(`/admin/report/upsert`, params);
};
//计算消耗和碳排
export const cal_data = params => {
  return http.post(`/admin/report/cal_data`, params);
};
//计算
export const cal_enthalpy = params => {
  return http.post(`/admin/report/cal_enthalpy`, params);
};
//核算边界列表
export const process_boundary_list = params => {
  return http.get(
    `/admin/production_process/process_boundary/list?production_process_id=${params.id}&emission_process_type=${params.emission_process_type}`
  );
};
