import type { Common } from "@/api/interface";
import type { TApkUpgradeScopeValue } from "@/config/modules";
import type { DeviceBaseTag, Device as DeviceVideo, School } from "@/api/interface";

import { APK_UPGRADE_SCOPE } from "@/config/modules";
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

/** 处理 APK 列表状态筛选值（-1 全部，1 已发布，2 已下线） */
function normalizeApkListStatusQuery(value?: number | string | null): Common.TApkPackageListStatusQuery | undefined {
  const parsed = normalizeNumber(value);
  if (isNullOrUnDef(parsed)) return undefined;
  const statusList: Common.TApkPackageListStatusQuery[] = [-1, 1, 2];
  return statusList.includes(parsed as Common.TApkPackageListStatusQuery)
    ? (parsed as Common.TApkPackageListStatusQuery)
    : undefined;
}

/** 处理学校ID */
function normalizeSchoolId(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (!parsed || parsed <= 0 || parsed === -1) return undefined;
  return parsed;
}

/** 处理 ID 数组 */
function normalizeIdList(value?: Array<number | string | null>) {
  if (!Array.isArray(value)) return undefined;
  const result = value.map(item => normalizeNumber(item)).filter((item): item is number => !isNullOrUnDef(item) && item > 0);
  return result.length ? result : undefined;
}

/** 构建 APK 列表请求参数 */
export function buildApkPackagesListParams(params: Record<string, any>): Common.ReqGetApkPackagesApi {
  return {
    page: normalizePage(params.page),
    pageSize: normalizePage(params.pageSize),
    status: normalizeApkListStatusQuery(params.status)
  };
}

/** 构建 APK 更新请求参数 */
export function buildPutUpdateApkPackagePayload(changelog?: string): Common.ReqPutUpdateApkPackageApi {
  return {
    changelog: normalizeText(changelog)
  };
}

/** 构建批量升级请求参数 */
export function buildPostApkPackagesBatchUpgradePayload(params: {
  apkPackageId: number;
  scope: TApkUpgradeScopeValue;
  schoolIds?: Array<number | string | null>;
  tagIds?: Array<number | string | null>;
  deviceIds?: Array<number | string | null>;
}): Common.ReqPostApkPackagesBatchUpgradeApi {
  const payload: Common.ReqPostApkPackagesBatchUpgradeApi = {
    apkPackageId: params.apkPackageId,
    scope: params.scope
  };
  const schoolIds = normalizeIdList(params.schoolIds);
  const tagIds = normalizeIdList(params.tagIds);
  const deviceIds = normalizeIdList(params.deviceIds);

  if (params.scope === APK_UPGRADE_SCOPE.SCHOOL) {
    payload.schoolIds = schoolIds;
  }
  if (params.scope === APK_UPGRADE_SCOPE.TAG) {
    payload.tagIds = tagIds;
  }
  if (params.scope === APK_UPGRADE_SCOPE.DEVICE) {
    payload.deviceIds = deviceIds;
  }

  return payload;
}

/** 构建设备查询参数 */
export function buildVideoDevicesListParams(keyword: string, schoolId?: number): DeviceVideo.ReqGetDevicesApi {
  return {
    page: 1,
    pageSize: 200,
    schoolId: normalizeSchoolId(schoolId) || -1,
    terminalSn: normalizeText(keyword)
  };
}

/** 构建学校查询参数 */
export function buildSchoolsListParams(keyword: string, tenantId?: number): School.ReqSchoolsListParams {
  return {
    page: 1,
    pageSize: 200,
    name: normalizeText(keyword),
    // 按当前租户过滤
    tenantId: tenantId || undefined
  };
}

/** 构建设备标签查询参数 */
export function buildDeviceBaseTagsOptionsParams(schoolId?: number): DeviceBaseTag.ReqGetDeviceBaseTagOptionsApi {
  return {
    schoolId: normalizeSchoolId(schoolId)
  };
}
