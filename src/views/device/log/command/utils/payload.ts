import type { DeviceCommandRecord } from "@/api/interface";
import type { TDeviceCommandStatusValue, TDeviceCommandTypeValue } from "@/config/modules";

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
  if (Number.isNaN(parsedValue)) return undefined;
  return parsedValue;
}

/** 处理分页字段 */
function normalizePage(value?: number | string | null, defaultValue = 1) {
  const parsedValue = normalizeNumber(value);
  if (!parsedValue || parsedValue < 1) return defaultValue;
  return parsedValue;
}

/** 处理学校ID */
function normalizeSchoolId(value?: number | string | null) {
  const parsedValue = normalizeNumber(value);
  if (!parsedValue || parsedValue <= 0 || parsedValue === -1) return undefined;
  return parsedValue;
}

/** 处理命令类型 */
function normalizeCommandType(value?: unknown): TDeviceCommandTypeValue[] | undefined {
  if (isNullOrUnDef(value)) return undefined;
  if (Array.isArray(value)) {
    const commandTypeList = value.filter(item => typeof item === "string" && !!item.trim()) as TDeviceCommandTypeValue[];
    return commandTypeList.length ? commandTypeList : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return [value as TDeviceCommandTypeValue];
  }
  return undefined;
}

/** 处理命令状态 */
function normalizeStatus(value?: unknown): TDeviceCommandStatusValue | undefined {
  if (typeof value === "string" && value.trim()) {
    return value as TDeviceCommandStatusValue;
  }
  return undefined;
}

/** 构建设备命令列表查询参数 */
export function buildDeviceCommandRecordListParams(
  params: Record<string, any>
): DeviceCommandRecord.ReqGetDeviceCommandRecordListApi {
  return {
    page: normalizePage(params.page, 1),
    pageSize: normalizePage(params.pageSize, 10),
    schoolId: normalizeSchoolId(params.schoolId),
    deviceId: normalizeNumber(params.deviceId),
    commandType: normalizeCommandType(params.commandType),
    status: normalizeStatus(params.status),
    deviceName: normalizeText(params.deviceName),
    terminalKey: normalizeText(params.terminalKey),
    terminalSn: normalizeText(params.terminalSn),
    tenantId: normalizeNumber(params.tenantId)
  };
}
