import type { DeviceEventLog } from "@/api/interface";

import { isNullOrUnDef } from "@/utils/is";

/** 处理文本字段 */
function normalizeText(value?: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

/** 处理数字字段 */
function normalizeNumber(value?: number | string | null) {
  if (isNullOrUnDef(value) || value === "") return undefined;
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) return undefined;
  return parsedValue;
}

/** 处理分页字段 */
function normalizePage(value?: number | string | null, defaultValue = 1) {
  const parsedValue = normalizeNumber(value);
  if (!parsedValue || parsedValue < 1) return defaultValue;
  return Math.floor(parsedValue);
}

/** 处理学校ID */
function normalizeSchoolId(value?: number | string | null) {
  const parsedValue = normalizeNumber(value);
  if (!parsedValue || parsedValue <= 0 || parsedValue === -1) return undefined;
  return parsedValue;
}

/** 构建设备事件日志列表查询参数 */
export function buildDeviceEventLogListParams(params: Record<string, any>): DeviceEventLog.ReqGetDeviceEventLogListApi {
  return {
    page: normalizePage(params.page, 1),
    pageSize: normalizePage(params.pageSize, 10),
    schoolId: normalizeSchoolId(params.schoolId),
    terminalSn: normalizeText(params.terminalSn),
    studentId: normalizeNumber(params.studentId),
    eventType: normalizeText(params.eventType),
    startTime: normalizeText(params.startTime),
    endTime: normalizeText(params.endTime)
  };
}
