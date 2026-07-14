/** 退款类型 */
export enum REFUND_TYPE {
  /** 全额退款 */
  FULL = "FULL",
  /** 单笔退款 */
  SINGLE = "SINGLE",
  /** 套餐退款 */
  PACKAGE = "PACKAGE"
}

export type TRefundTypeValue = (typeof REFUND_TYPE)[keyof typeof REFUND_TYPE];

export const REFUND_TYPE_I18N: Record<TRefundTypeValue, string> = {
  [REFUND_TYPE.FULL]: "全额退款",
  [REFUND_TYPE.SINGLE]: "单笔退款",
  [REFUND_TYPE.PACKAGE]: "套餐退款"
};

export const REFUND_TYPE_OPTIONS: Array<{ label: string; value: TRefundTypeValue }> = [
  { label: REFUND_TYPE_I18N[REFUND_TYPE.FULL], value: REFUND_TYPE.FULL },
  { label: REFUND_TYPE_I18N[REFUND_TYPE.SINGLE], value: REFUND_TYPE.SINGLE },
  { label: REFUND_TYPE_I18N[REFUND_TYPE.PACKAGE], value: REFUND_TYPE.PACKAGE }
];
