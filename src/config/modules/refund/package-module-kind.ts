/** 平台套餐模块类别 */
export enum REFUND_PACKAGE_MODULE_KIND {
  /** 计费模块 */
  BILLING = "BILLING",
  /** 功能模块 */
  FEATURE = "FEATURE"
}

export type TRefundPackageModuleKindValue = (typeof REFUND_PACKAGE_MODULE_KIND)[keyof typeof REFUND_PACKAGE_MODULE_KIND];

export const REFUND_PACKAGE_MODULE_KIND_I18N: Record<TRefundPackageModuleKindValue, string> = {
  [REFUND_PACKAGE_MODULE_KIND.BILLING]: "计费模块",
  [REFUND_PACKAGE_MODULE_KIND.FEATURE]: "功能模块"
};

export const REFUND_PACKAGE_MODULE_KIND_OPTIONS: Array<{
  label: string;
  value: TRefundPackageModuleKindValue;
}> = [
  {
    label: REFUND_PACKAGE_MODULE_KIND_I18N[REFUND_PACKAGE_MODULE_KIND.BILLING],
    value: REFUND_PACKAGE_MODULE_KIND.BILLING
  },
  {
    label: REFUND_PACKAGE_MODULE_KIND_I18N[REFUND_PACKAGE_MODULE_KIND.FEATURE],
    value: REFUND_PACKAGE_MODULE_KIND.FEATURE
  }
];
