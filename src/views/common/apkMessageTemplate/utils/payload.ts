import type { Common } from "@/api/interface";
import type {
  TApkMessageTemplateCategoryValue,
  TApkMessageTemplateScopeValue
} from "@/config/modules/common/apk-message-template";

import { APK_MESSAGE_TEMPLATE_CATEGORY, APK_MESSAGE_TEMPLATE_SCOPE } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

/** 处理文本字段 */
function normalizeText(value?: string) {
  const text = value?.trim();
  return text ? text : undefined;
}

/** 处理数字字段 */
function normalizeNumber(value?: number | string | null) {
  if (isNullOrUnDef(value)) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

/** 处理分页字段 */
function normalizePage(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (!parsed || parsed < 1) return undefined;
  return parsed;
}

/** 处理学校ID */
function normalizeSchoolId(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (!parsed || parsed <= 0 || parsed === -1) return undefined;
  return parsed;
}

/** 处理作用域字段 */
function normalizeScope(value?: string): TApkMessageTemplateScopeValue | undefined {
  if (!value) return undefined;
  const scopeList: TApkMessageTemplateScopeValue[] = [
    APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL,
    APK_MESSAGE_TEMPLATE_SCOPE.TENANT,
    APK_MESSAGE_TEMPLATE_SCOPE.SCHOOL
  ];
  return scopeList.includes(value as TApkMessageTemplateScopeValue) ? (value as TApkMessageTemplateScopeValue) : undefined;
}

/** 处理分类字段 */
function normalizeCategory(value?: string): TApkMessageTemplateCategoryValue | undefined {
  if (!value) return undefined;
  const categoryList: TApkMessageTemplateCategoryValue[] = [
    APK_MESSAGE_TEMPLATE_CATEGORY.DEVICE,
    APK_MESSAGE_TEMPLATE_CATEGORY.STUDENT,
    APK_MESSAGE_TEMPLATE_CATEGORY.MESSAGE,
    APK_MESSAGE_TEMPLATE_CATEGORY.SYSTEM
  ];
  return categoryList.includes(value as TApkMessageTemplateCategoryValue)
    ? (value as TApkMessageTemplateCategoryValue)
    : undefined;
}

/** 构建错误话术列表请求参数 */
export function buildApkMessageTemplatesListParams(params: Record<string, any>): Common.ReqGetApkMessageTemplatesApi {
  return {
    page: normalizePage(params.page),
    pageSize: normalizePage(params.pageSize),
    scope: normalizeScope(params.scope),
    category: normalizeCategory(params.category),
    keyword: normalizeText(params.keyword),
    schoolId: normalizeSchoolId(params.schoolId),
    sort: normalizeText(params.sort)
  };
}

/** 构建错误话术更新请求参数 */
export function buildPutUpdateApkMessageTemplatePayload(params: {
  message: string;
  description?: string;
  version: number;
  isEnabled?: boolean;
}): Common.ReqPutUpdateApkMessageTemplateApi {
  return {
    message: params.message.trim(),
    description: normalizeText(params.description),
    version: params.version,
    isEnabled: params.isEnabled
  };
}

/** 构建恢复继承请求参数 */
export function buildPostResetInheritApkMessageTemplatePayload(version: number): Common.ReqPostResetInheritApkMessageTemplateApi {
  return { version };
}

/** 构建导出请求参数 */
export function buildExportApkMessageTemplatesParams(params: Record<string, any>): Common.ReqExportApkMessageTemplatesApi {
  return {
    scope: normalizeScope(params.scope),
    category: normalizeCategory(params.category),
    keyword: normalizeText(params.keyword),
    schoolId: normalizeSchoolId(params.schoolId)
  };
}
