import type { DeviceDialConfig } from "@/api/interface";
import type { DialConfigForm } from "../types";

/** 规范化可选字符串 */
function normalizeOptionalString(value?: string | null) {
  const trimmedValue = value?.trim?.();
  return trimmedValue ? trimmedValue : undefined;
}

/** 规范化数值输入 */
function normalizeNumberValue(value?: number | "" | null) {
  return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}

/**
 * 规范化吹风机圈存金额文本。
 * @param value 圈存金额配置
 * @returns 圈存金额文本（单位元，英文逗号分隔）
 */
export function normalizeDryerCardRechargeAmountOptions(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map(item => String(item).trim())
      .filter(Boolean)
      .join(",");
  }
  if (typeof value !== "string") return "";

  const text = value.trim();
  if (!text) return "";
  if (text.indexOf("[") !== 0 || text.lastIndexOf("]") !== text.length - 1) return text;

  try {
    const amountList = JSON.parse(text);
    if (!Array.isArray(amountList)) return text;
    return amountList
      .map(item => String(item).trim())
      .filter(Boolean)
      .join(",");
  } catch (error) {
    console.error("normalizeDryerCardRechargeAmountOptions:", error);
    return text;
  }
}

/**
 * 解析吹风机圈存金额为数值数组。
 * @param value 圈存金额配置
 * @returns 金额数组（单位元）
 */
export function parseDryerCardRechargeAmountOptionsToList(value: unknown): number[] {
  const amountText = normalizeDryerCardRechargeAmountOptions(value);
  if (!amountText) return [];

  return amountText
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => Number(item))
    .filter(item => Number.isFinite(item) && item >= 0.01);
}

/** 规范化扩展配置 */
function normalizeExtraConfig(form: DialConfigForm) {
  /** 吹风机圈存金额数组（单位元）。 */
  const amountOptions = parseDryerCardRechargeAmountOptionsToList(form.dryerCardRechargeAmountOptions);

  return {
    "call.incoming.disabled": form.callIncomingDisabled === "Y",
    "face.enabled": form.faceEnabled === "Y",
    "sos.title": normalizeOptionalString(form.sosTitle) || "",
    "thirdParty.url": normalizeOptionalString(form.thirdPartyUrl) || "",
    "recharge.button.visible": form.dryerCardRechargeEnabled,
    "dryer.card.recharge.amount.options": amountOptions
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
    customerServicePhone: normalizeOptionalString(form.customerServicePhone),
    heartbeatFrequency: normalizeNumberValue(form.heartbeatFrequency),
    callTime: normalizeNumberValue(form.callTime),
    powerOnTime: normalizeOptionalString(form.powerOnTime),
    powerOffTime: normalizeOptionalString(form.powerOffTime),
    forbidPhone: normalizeOptionalString(form.forbidPhone),
    phoneType: form.phoneType,
    dialMode: form.dialMode,
    phoneTypes: form.phoneTypes,
    messageFlag: form.messageFlag,
    downloadUserFlag: form.downloadUserFlag,
    messageSoundFlag: form.messageSoundFlag,
    mhcFlag: form.mhcFlag,
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
