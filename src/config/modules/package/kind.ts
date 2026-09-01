/** 套餐归属 */
export enum PACKAGE_KIND {
  /** 独立设备套餐 */
  DEVICE = "DEVICE",
  /** 平台套餐 */
  PLATFORM = "PLATFORM"
}

export type TPackageKindValue = (typeof PACKAGE_KIND)[keyof typeof PACKAGE_KIND];

export const PACKAGE_KIND_I18N: Record<TPackageKindValue, string> = {
  [PACKAGE_KIND.DEVICE]: "独立设备套餐",
  [PACKAGE_KIND.PLATFORM]: "平台套餐"
};

export const PACKAGE_KIND_OPTIONS: Array<{ label: string; value: TPackageKindValue }> = [
  { label: PACKAGE_KIND_I18N[PACKAGE_KIND.DEVICE], value: PACKAGE_KIND.DEVICE },
  { label: PACKAGE_KIND_I18N[PACKAGE_KIND.PLATFORM], value: PACKAGE_KIND.PLATFORM }
];
