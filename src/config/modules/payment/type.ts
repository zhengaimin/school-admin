/** 支付类型：RECHARGE-充值，DIRECT_PURCHASE-直接购买 */
export enum PAYMENT_TYPE {
  /** 充值 */
  RECHARGE = "RECHARGE",
  /** 直接购买 */
  DIRECT_PURCHASE = "DIRECT_PURCHASE"
}

export type TPaymentTypeValue = (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];

export const PAYMENT_TYPE_I18N: Record<TPaymentTypeValue, string> = {
  [PAYMENT_TYPE.RECHARGE]: "充值",
  [PAYMENT_TYPE.DIRECT_PURCHASE]: "直接购买"
};

export const PAYMENT_TYPE_OPTIONS: Array<{ label: string; value: TPaymentTypeValue }> = [
  { label: PAYMENT_TYPE_I18N[PAYMENT_TYPE.RECHARGE], value: PAYMENT_TYPE.RECHARGE },
  { label: PAYMENT_TYPE_I18N[PAYMENT_TYPE.DIRECT_PURCHASE], value: PAYMENT_TYPE.DIRECT_PURCHASE }
];
