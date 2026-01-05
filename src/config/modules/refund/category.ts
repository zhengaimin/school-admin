/** 退款分类 */
export enum REFUND_CATEGORY {
  /** 余额退款 */
  BALANCE = "balance",
  /** 套餐退款 */
  PACKAGE = "package"
}

export type TRefundCategoryValue = (typeof REFUND_CATEGORY)[keyof typeof REFUND_CATEGORY];

export const REFUND_CATEGORY_I18N: Record<TRefundCategoryValue, string> = {
  [REFUND_CATEGORY.BALANCE]: "余额退款",
  [REFUND_CATEGORY.PACKAGE]: "套餐退款"
};

export const REFUND_CATEGORY_OPTIONS: Array<{ label: string; value: TRefundCategoryValue }> = [
  { label: REFUND_CATEGORY_I18N[REFUND_CATEGORY.BALANCE], value: REFUND_CATEGORY.BALANCE },
  { label: REFUND_CATEGORY_I18N[REFUND_CATEGORY.PACKAGE], value: REFUND_CATEGORY.PACKAGE }
];
