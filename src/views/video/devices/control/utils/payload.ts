import type { DeviceDialConfig } from "@/api/interface";
import type { DialConfigForm } from "../types";

/** 规范化可选字符串 */
function normalizeOptionalString(value?: string | null) {
  const trimmedValue = value?.trim?.();
  return trimmedValue ? trimmedValue : undefined;
}

/** 规范化数值输入 */
function normalizeNumberValue(value?: number | "") {
  return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}
/** 规范化扩展配置 */
function normalizeExtraConfig(form: DialConfigForm) {
  return {
    "call.incoming.disabled": form.callIncomingDisabled === "Y",
    "face.enabled": form.faceEnabled === "Y",
    "sos.title": normalizeOptionalString(form.sosTitle) || "",
    "thirdParty.url": normalizeOptionalString(form.thirdPartyUrl) || ""
  };
}

/** 构建禁拨时间段字符串 */
function buildForbidCallTimesValue(form: DialConfigForm) {
  const forbidCallTimesValue = form.forbidCallTimesAry
    .filter(forbidCallTimeItem => forbidCallTimeItem.fstTime && forbidCallTimeItem.fendTime)
    .map(forbidCallTimeItem => `${forbidCallTimeItem.fstTime}-${forbidCallTimeItem.fendTime}`)
    .join(",");
  return forbidCallTimesValue || undefined;
}

/** 生成更新公话配置请求参数 */
export function buildPutDeviceDialConfigPayload(form: DialConfigForm): DeviceDialConfig.ReqPutDeviceDialConfigApi {
  return {
    heartbeatFrequency: normalizeNumberValue(form.heartbeatFrequency),
    callTime: normalizeNumberValue(form.callTime),
    powerOnTime: normalizeOptionalString(form.powerOnTime),
    powerOffTime: normalizeOptionalString(form.powerOffTime),
    forbidPhone: normalizeOptionalString(form.forbidPhone),
    phoneType: form.phoneType,
    dialMode: form.dialMode,
    phoneTypes: form.phoneTypes,
    messageFlag: form.messageFlag,
    messageSoundFlag: form.messageSoundFlag,
    addPunchFace: form.addPunchFace,
    forbidCallTimes: buildForbidCallTimesValue(form),
    sipUserName: normalizeOptionalString(form.sipUserName),
    sipPassword: normalizeOptionalString(form.sipPassword),
    sipDomain: normalizeOptionalString(form.sipDomain),
    sipTransportType: form.sipTransportType || undefined,
    extraConfig: normalizeExtraConfig(form)
  };
}

/** 生成新增公话配置请求参数 */
export function buildPostDeviceDialConfigPayload(
  form: DialConfigForm,
  schoolId: number
): DeviceDialConfig.ReqPostDeviceDialConfigApi {
  return {
    ...buildPutDeviceDialConfigPayload(form),
    schoolId
  };
}
