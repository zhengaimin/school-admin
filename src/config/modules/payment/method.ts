/** 支付方式：WECHAT-微信支付，MOCK-模拟支付 */
export enum PAYMENT_METHOD {
  /** 微信支付 */
  WECHAT = "WECHAT",
  /** 模拟支付 */
  MOCK = "MOCK"
}

export type TPaymentMethodValue = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_I18N: Record<TPaymentMethodValue, string> = {
  [PAYMENT_METHOD.WECHAT]: "微信支付",
  [PAYMENT_METHOD.MOCK]: "模拟支付"
};

export const PAYMENT_METHOD_OPTIONS: Array<{ label: string; value: TPaymentMethodValue }> = [
  { label: PAYMENT_METHOD_I18N[PAYMENT_METHOD.WECHAT], value: PAYMENT_METHOD.WECHAT },
  { label: PAYMENT_METHOD_I18N[PAYMENT_METHOD.MOCK], value: PAYMENT_METHOD.MOCK }
];
