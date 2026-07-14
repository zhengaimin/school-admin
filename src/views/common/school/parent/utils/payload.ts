import type { FamilyBindStatus } from "@/api/interface";

import { isNullOrUnDef } from "@/utils/is";

/** 处理文本字段 */
function normalizeText(value?: string) {
  const text = value?.trim();
  return text ? text : undefined;
}

/** 处理ID字段 */
function normalizeId(value?: number | string | null) {
  if (isNullOrUnDef(value)) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed === -1) return undefined;
  return parsed;
}

/** 处理微信绑定状态 */
function normalizeWechatBound(value?: boolean | string | number | null) {
  if (isNullOrUnDef(value)) return undefined;
  if (value === true || value === false) return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return undefined;
}

/** 构建公共筛选参数 */
function buildFamilyBindStatusBaseParams(params: Record<string, any>): FamilyBindStatus.ReqGetFamilyBindStatusExportInfoApi {
  const schoolId = normalizeId(params.schoolId) ?? -1;
  return {
    schoolId,
    gradeId: normalizeId(params.gradeId),
    classId: normalizeId(params.classId),
    studentNo: normalizeText(params.studentNo),
    studentName: normalizeText(params.studentName),
    phone: normalizeText(params.phone),
    wechatBound: normalizeWechatBound(params.wechatBound)
  };
}

/** 构建家长绑定状态列表请求参数 */
export function buildFamilyBindStatusListParams(params: Record<string, any>): FamilyBindStatus.ReqGetFamilyBindStatusListApi {
  return {
    ...buildFamilyBindStatusBaseParams(params),
    page: normalizeId(params.page),
    pageSize: normalizeId(params.pageSize)
  };
}

/** 构建家长绑定状态导出信息请求参数 */
export function buildFamilyBindStatusExportInfoParams(
  params: Record<string, any>
): FamilyBindStatus.ReqGetFamilyBindStatusExportInfoApi {
  return {
    ...buildFamilyBindStatusBaseParams(params)
  };
}

/** 构建家长绑定状态导出请求参数 */
export function buildFamilyBindStatusExportParams(params: Record<string, any>): FamilyBindStatus.ReqGetFamilyBindStatusExportApi {
  return {
    ...buildFamilyBindStatusBaseParams(params),
    page: normalizeId(params.page) ?? 1,
    pageSize: normalizeId(params.pageSize) ?? 1000
  };
}
