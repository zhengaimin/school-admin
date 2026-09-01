/** 平台套餐定价模式 */
export enum PACKAGE_PRICING_MODE {
  /** 按剩余有效月份计价 */
  DECREASING = "DECREASING",
  /** 按完整有效月份固定总价计价 */
  FIXED_TOTAL = "FIXED_TOTAL"
}

export type TPackagePricingModeValue = (typeof PACKAGE_PRICING_MODE)[keyof typeof PACKAGE_PRICING_MODE];

export const PACKAGE_PRICING_MODE_I18N: Record<TPackagePricingModeValue, string> = {
  [PACKAGE_PRICING_MODE.DECREASING]: "按剩余有效月份计价",
  [PACKAGE_PRICING_MODE.FIXED_TOTAL]: "按完整有效月份固定总价计价"
};

export const PACKAGE_PRICING_MODE_OPTIONS: Array<{ label: string; value: TPackagePricingModeValue }> = [
  { label: PACKAGE_PRICING_MODE.DECREASING, value: PACKAGE_PRICING_MODE.DECREASING },
  { label: PACKAGE_PRICING_MODE.FIXED_TOTAL, value: PACKAGE_PRICING_MODE.FIXED_TOTAL }
];
