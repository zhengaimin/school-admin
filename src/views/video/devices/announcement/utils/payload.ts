import type { Announcement } from "@/api/interface";
import type { TAnnouncementStatusValue } from "@/config/modules";

import { ANNOUNCEMENT_STATUS } from "@/config/modules";
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
/** 处理每页数量 */
function normalizePageSize(value?: number | string | null) {
  const parsed = normalizePage(value);
  if (!parsed) return undefined;
  return parsed > 100 ? 100 : parsed;
}

/** 处理学校ID */
function normalizeSchoolId(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (!parsed || parsed <= 0 || parsed === -1) return undefined;
  return parsed;
}

/** 处理公告状态 */
function normalizeStatus(value?: number | string | null): TAnnouncementStatusValue | undefined {
  const parsed = normalizeNumber(value);
  if (!parsed) return undefined;
  const validStatus: TAnnouncementStatusValue[] = [ANNOUNCEMENT_STATUS.PUBLISHED, ANNOUNCEMENT_STATUS.REVOKED];
  return validStatus.includes(parsed as TAnnouncementStatusValue) ? (parsed as TAnnouncementStatusValue) : undefined;
}

/** 构建公告列表请求参数 */
export function buildAnnouncementListParams(params: Record<string, any>): Announcement.ReqGetAnnouncementsApi {
  const page = normalizePage(params.page) ?? 1;
  const pageSize = normalizePageSize(params.pageSize) ?? 20;
  return {
    page,
    pageSize,
    schoolId: normalizeSchoolId(params.schoolId),
    status: normalizeStatus(params.status),
    keyword: normalizeText(params.keyword),
    sort: normalizeText(params.sort)
  };
}
