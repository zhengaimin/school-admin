import type { PackageRecord } from "@/api/interface";
import type {
  PackagePurchaseExportAcceptPayloadOptions,
  PackagePurchaseExportAcceptPayloadResult,
  PackagePurchaseExportRequestParamsOptions
} from "../types";

import { isNullOrUnDef } from "@/utils/is";

/** 处理联动字段值 */
function normalizeCascadeId(value?: number | null) {
  return !isNullOrUnDef(value) && value !== -1 ? Number(value) : null;
}

/** 构建导出弹窗接收参数 */
export function buildPackagePurchaseExportAcceptPayload(
  options: PackagePurchaseExportAcceptPayloadOptions
): PackagePurchaseExportAcceptPayloadResult {
  const payload: PackagePurchaseExportAcceptPayloadResult = {
    formData: {
      schoolId: options.schoolId,
      studentKeyword: options.studentKeyword || "",
      orderNo: options.orderNo || "",
      startDate: options.startDate || "",
      endDate: options.endDate || "",
      gradeId: normalizeCascadeId(options.gradeId),
      departmentId: normalizeCascadeId(options.departmentId),
      classId: normalizeCascadeId(options.classId),
      status: options.status ?? null,
      packageType: options.packageType ?? null,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice
    },
    gradeOptions: options.gradeOptions || [],
    departmentOptions: options.departmentOptions || [],
    classOptions: options.classOptions || []
  };

  if (isNullOrUnDef(payload.formData.gradeId)) {
    payload.formData.departmentId = null;
    payload.formData.classId = null;
  } else if (isNullOrUnDef(payload.formData.departmentId)) {
    payload.formData.classId = null;
  }

  return payload;
}

/** 构建导出请求参数 */
export function buildPackagePurchaseExportRequestParams(
  options: PackagePurchaseExportRequestParamsOptions
): PackageRecord.ReqGetPackageRecordsApi {
  const { formData } = options;
  return {
    schoolId: formData.schoolId,
    deviceType: options.deviceType,
    studentKeyword: formData.studentKeyword || undefined,
    orderNo: formData.orderNo || undefined,
    startDate: formData.startDate || undefined,
    endDate: formData.endDate || undefined,
    gradeId: formData.gradeId ?? -1,
    departmentId: formData.departmentId ?? -1,
    classId: formData.classId ?? -1,
    status: formData.status ?? undefined,
    packageType: formData.packageType ?? undefined,
    minPrice: formData.minPrice,
    maxPrice: formData.maxPrice,
    page: options.page,
    pageSize: options.pageSize
  };
}
