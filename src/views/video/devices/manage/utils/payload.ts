import type { Device as DeviceVideo } from "@/api/interface";
import type { DeviceVideoForm } from "../types";

/** 规范化设备组ID */
export function normalizeDeviceGroupId(value?: number | null, defaultId = -1) {
  return typeof value === "number" && !Number.isNaN(value) ? value : defaultId;
}

/** 规范化必填字符串 */
function normalizeRequiredString(value?: string | null) {
  return value?.trim?.() || "";
}

/** 规范化可选字符串 */
function normalizeOptionalString(value?: string | null) {
  const trimmed = value?.trim?.();
  return trimmed ? trimmed : undefined;
}

/** 规范化数值输入 */
function normalizeNumberValue(value?: number | null) {
  return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}

/** 生成新增设备请求参数 */
export function buildPostDevicePayload(
  form: DeviceVideoForm,
  schoolId: number,
  defaultDeviceGroupId = -1
): DeviceVideo.ReqPostDeviceApi {
  return {
    terminalSn: normalizeRequiredString(form.terminalSn),
    terminalKey: normalizeRequiredString(form.terminalKey),
    terminalMac: normalizeRequiredString(form.terminalMac),
    name: normalizeRequiredString(form.name),
    location: normalizeOptionalString(form.location),
    deviceGroupId: normalizeDeviceGroupId(form.deviceGroupId, defaultDeviceGroupId),
    powerOnTime: normalizeOptionalString(form.powerOnTime),
    powerOffTime: normalizeOptionalString(form.powerOffTime),
    heartbeatFrequency: normalizeNumberValue(form.heartbeatFrequency),
    callTime: normalizeNumberValue(form.callTime),
    forbidPhone: normalizeOptionalString(form.forbidPhone),
    phoneType: form.phoneType ?? undefined,
    forbidCallTimes: normalizeOptionalString(form.forbidCallTimes),
    messageFlag: form.messageFlag ?? undefined,
    downloadUserFlag: form.downloadUserFlag ?? undefined,
    messageSoundFlag: form.messageSoundFlag ?? undefined,
    mhcFlag: form.mhcFlag ?? undefined,
    addPunchFace: form.addPunchFace ?? undefined,
    warnCallTime: normalizeNumberValue(form.warnCallTime),
    billMode: form.billMode ?? undefined,
    sipUserName: normalizeOptionalString(form.sipUserName),
    sipPassword: normalizeOptionalString(form.sipPassword),
    sipDomain: normalizeOptionalString(form.sipDomain),
    sipTransportType: form.sipTransportType ?? undefined,
    schoolId
  };
}

/** 生成更新设备请求参数 */
export function buildPutDevicePayload(form: DeviceVideoForm): DeviceVideo.ReqPutDeviceApi {
  return {
    name: normalizeOptionalString(form.name),
    terminalKey: normalizeOptionalString(form.terminalKey),
    terminalMac: normalizeOptionalString(form.terminalMac),
    location: normalizeOptionalString(form.location),
    deviceGroupId: typeof form.deviceGroupId === "number" ? form.deviceGroupId : undefined,
    powerOnTime: normalizeOptionalString(form.powerOnTime),
    powerOffTime: normalizeOptionalString(form.powerOffTime),
    heartbeatFrequency: normalizeNumberValue(form.heartbeatFrequency),
    callTime: normalizeNumberValue(form.callTime),
    forbidPhone: normalizeOptionalString(form.forbidPhone),
    phoneType: form.phoneType ?? undefined,
    forbidCallTimes: normalizeOptionalString(form.forbidCallTimes),
    messageFlag: form.messageFlag ?? undefined,
    downloadUserFlag: form.downloadUserFlag ?? undefined,
    messageSoundFlag: form.messageSoundFlag ?? undefined,
    mhcFlag: form.mhcFlag ?? undefined,
    addPunchFace: form.addPunchFace ?? undefined,
    warnCallTime: normalizeNumberValue(form.warnCallTime),
    billMode: form.billMode ?? undefined,
    sipUserName: normalizeOptionalString(form.sipUserName),
    sipPassword: normalizeOptionalString(form.sipPassword),
    sipDomain: normalizeOptionalString(form.sipDomain),
    sipTransportType: form.sipTransportType ?? undefined,
    password: normalizeOptionalString(form.password)
  };
}
