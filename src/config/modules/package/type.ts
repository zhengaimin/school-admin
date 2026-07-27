/** 套餐类型 */
export enum PACKAGE_TYPE {
  /** 通用套餐 */
  GENERAL = "GENERAL",
  /** 固定套餐 */
  FIXED = "FIXED"
}

export type TPackageTypeValue = (typeof PACKAGE_TYPE)[keyof typeof PACKAGE_TYPE];

export const PACKAGE_TYPE_I18N: Record<TPackageTypeValue, string> = {
  [PACKAGE_TYPE.GENERAL]: "通用套餐",
  [PACKAGE_TYPE.FIXED]: "固定套餐"
};

export const PACKAGE_TYPE_OPTIONS: Array<{ label: string; value: TPackageTypeValue }> = [
  { label: PACKAGE_TYPE_I18N[PACKAGE_TYPE.GENERAL], value: PACKAGE_TYPE.GENERAL },
  { label: PACKAGE_TYPE_I18N[PACKAGE_TYPE.FIXED], value: PACKAGE_TYPE.FIXED }
];
