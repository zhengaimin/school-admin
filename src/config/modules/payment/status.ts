/** 支付状态：0-待支付，1-支付成功，2-支付失败，3-已退款，4-已取消，5-已过期 */
export enum PAYMENT_STATUS {
  /** 待支付 */
  PENDING = 0,
  /** 支付成功 */
  SUCCESS = 1,
  /** 支付失败 */
  FAILED = 2,
  /** 已退款 */
  REFUNDED = 3,
  /** 已取消 */
  CANCELLED = 4,
  /** 已过期 */
  EXPIRED = 5
}

export type TPaymentStatusValue = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_I18N: Record<TPaymentStatusValue, string> = {
  [PAYMENT_STATUS.PENDING]: "待支付",
  [PAYMENT_STATUS.SUCCESS]: "支付成功",
  [PAYMENT_STATUS.FAILED]: "支付失败",
  [PAYMENT_STATUS.REFUNDED]: "已退款",
  [PAYMENT_STATUS.CANCELLED]: "已取消",
  [PAYMENT_STATUS.EXPIRED]: "已过期"
};

export const PAYMENT_STATUS_OPTIONS: Array<{ label: string; value: TPaymentStatusValue }> = [
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.PENDING], value: PAYMENT_STATUS.PENDING },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.SUCCESS], value: PAYMENT_STATUS.SUCCESS },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.FAILED], value: PAYMENT_STATUS.FAILED },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.REFUNDED], value: PAYMENT_STATUS.REFUNDED },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.CANCELLED], value: PAYMENT_STATUS.CANCELLED },
  { label: PAYMENT_STATUS_I18N[PAYMENT_STATUS.EXPIRED], value: PAYMENT_STATUS.EXPIRED }
];

/** 获取支付状态对应的 Tag 类型 */
export const getPaymentStatusTagType = (status: TPaymentStatusValue) => {
  if (status === PAYMENT_STATUS.SUCCESS) return "success";
  if (status === PAYMENT_STATUS.PENDING) return "warning";
  if (status === PAYMENT_STATUS.FAILED) return "danger";
  return "info";
};
