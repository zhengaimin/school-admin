/** 套餐退款来源 */
export enum REFUND_PACKAGE_SOURCE {
  /** 普通学校设备套餐 */
  NORMAL = "NORMAL",
  /** 平台套餐 */
  PLATFORM = "PLATFORM"
}

export type TRefundPackageSourceValue = (typeof REFUND_PACKAGE_SOURCE)[keyof typeof REFUND_PACKAGE_SOURCE];

export const REFUND_PACKAGE_SOURCE_I18N: Record<TRefundPackageSourceValue, string> = {
  [REFUND_PACKAGE_SOURCE.NORMAL]: "普通学校设备套餐",
  [REFUND_PACKAGE_SOURCE.PLATFORM]: "平台套餐"
};

export const REFUND_PACKAGE_SOURCE_OPTIONS: Array<{ label: string; value: TRefundPackageSourceValue }> = [
  { label: REFUND_PACKAGE_SOURCE_I18N[REFUND_PACKAGE_SOURCE.NORMAL], value: REFUND_PACKAGE_SOURCE.NORMAL },
  { label: REFUND_PACKAGE_SOURCE_I18N[REFUND_PACKAGE_SOURCE.PLATFORM], value: REFUND_PACKAGE_SOURCE.PLATFORM }
];
