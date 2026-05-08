import type { DryerCardRecharge } from "@/api/interface";

import type { AcceptParamsOptions, FormData } from "../types";

function normalizeText(value: string) {
  return value || undefined;
}

function normalizeAmount(value: string) {
  if (value === "" || value == null) return undefined;
  const amount = Number(value);
  if (Number.isNaN(amount) || amount < 0) return undefined;
  return String(Math.round(amount * 100));
}

/** 构建导出弹窗接收参数。 */
export function buildCardRechargeExportAcceptPayload(
  params: Record<string, any>,
  schoolId: number
): Omit<AcceptParamsOptions, "title" | "type" | "showConfirm"> {
  return {
    schoolId,
    studentKeyword: String(params.studentKeyword ?? ""),
    rechargeNo: String(params.rechargeNo ?? ""),
    cardNumber: String(params.cardNumber ?? ""),
    status: params.status || null,
    terminalSn: String(params.terminalSn ?? ""),
    startTime: String(params.startDate ?? ""),
    endTime: String(params.endDate ?? ""),
    minAmount: String(params.minAmount ?? ""),
    maxAmount: String(params.maxAmount ?? "")
  };
}

/** 构建导出信息请求参数。 */
export function buildCardRechargeExportInfoParams(formData: FormData): DryerCardRecharge.ReqGetDryerCardRechargeExportInfoApi {
  return {
    schoolId: formData.schoolId,
    studentKeyword: normalizeText(formData.studentKeyword),
    rechargeNo: normalizeText(formData.rechargeNo),
    cardNumber: normalizeText(formData.cardNumber),
    status: formData.status ?? undefined,
    terminalSn: normalizeText(formData.terminalSn),
    startTime: normalizeText(formData.startTime),
    endTime: normalizeText(formData.endTime),
    minAmount: normalizeAmount(formData.minAmount),
    maxAmount: normalizeAmount(formData.maxAmount)
  };
}

/** 构建导出请求参数。 */
export function buildCardRechargeExportParams(
  formData: FormData,
  page: number
): DryerCardRecharge.ReqGetDryerCardRechargeExportApi {
  return {
    ...buildCardRechargeExportInfoParams(formData),
    page
  };
}
