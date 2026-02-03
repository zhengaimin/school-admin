import http from "@/api";
import type { PackageRecord } from "@/api/interface";

/** 获取套餐购买记录列表 */
export function getPackageRecordsApi(params: PackageRecord.ReqGetPackageRecordsApi) {
  return http.get<PackageRecord.ResGetPackageRecordsApi>("/admin/package-records", params);
}

/** 获取套餐购买记录详情 */
export function getPackageRecordDetailApi(id: number | string) {
  return http.get<PackageRecord.IPackageRecordDetail>(`/admin/package-records/${id}`);
}

/** 获取导出套餐购买记录信息 */
export function getPackageRecordExportInfoApi(params: PackageRecord.ReqGetPackageRecordExportInfoApi) {
  return http.get<PackageRecord.ResGetPackageRecordExportInfoApi>("/admin/package-records/export-info", params);
}

/** 导出套餐购买记录 */
export function getPackageRecordsExportApi(params: PackageRecord.ReqGetPackageRecordsApi): Promise<Blob> {
  return http.get("/admin/package-records/export", params, { responseType: "blob" });
}
