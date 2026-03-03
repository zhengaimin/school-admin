import type { Payment } from "@/api/interface";
import { isNullOrUnDef } from "@/utils/is";

/** 视频端支付配置表单 */
export interface IVideoPaymentConfigForm {
  /** 固定充值金额配置（输入态） */
  fixedAmounts: string;
  /** 最小金额 */
  minAmount: number | string | null;
  /** 最大金额 */
  maxAmount: number | string | null;
  /** 备注 */
  remark: string;
}

/** 归一化固定金额配置 */
function normalizeFixedAmounts(value: string) {
  const text = value.trim();
  if (!text) return undefined;

  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const amountList = JSON.parse(text);
      if (!Array.isArray(amountList)) return text;
      const normalizedAmountList = amountList.map(item => Number(item)).filter(item => !Number.isNaN(item) && item > 0);
      return normalizedAmountList.length ? JSON.stringify(normalizedAmountList) : text;
    } catch (error) {
      console.error("normalizeFixedAmounts:", error);
      return text;
    }
  }

  const amountTextList = text
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
  if (!amountTextList.length) return undefined;

  const normalizedAmountList = amountTextList.map(item => Number(item));
  const isAllValidAmount = normalizedAmountList.every(item => !Number.isNaN(item) && item > 0);
  return isAllValidAmount ? JSON.stringify(normalizedAmountList) : text;
}

/** 归一化金额字段 */
function normalizeAmount(value: number | string | null) {
  if (isNullOrUnDef(value) || value === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return undefined;
  return parsed;
}

/** 归一化备注 */
function normalizeRemark(value: string) {
  const text = value.trim();
  return text ? text : undefined;
}

/** 构建创建或更新租户支付配置请求参数 */
export function buildPutTenantPaymentConfigPayload(form: IVideoPaymentConfigForm): Payment.ReqPutTenantPaymentConfigApi {
  return {
    fixedAmounts: normalizeFixedAmounts(form.fixedAmounts),
    minAmount: normalizeAmount(form.minAmount),
    maxAmount: normalizeAmount(form.maxAmount),
    remark: normalizeRemark(form.remark)
  };
}
