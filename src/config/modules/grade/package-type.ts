/** 套餐类型 */
export enum GRADE_PACKAGE_TYPE {
  /** 通用套餐 */
  GENERAL = "GENERAL",
  /** 固定套餐 */
  FIXED = "FIXED"
}

export type TGradePackageTypeValue = (typeof GRADE_PACKAGE_TYPE)[keyof typeof GRADE_PACKAGE_TYPE];

export const GRADE_PACKAGE_TYPE_I18N: Record<TGradePackageTypeValue, string> = {
  [GRADE_PACKAGE_TYPE.GENERAL]: "通用套餐",
  [GRADE_PACKAGE_TYPE.FIXED]: "固定套餐"
};

export const GRADE_PACKAGE_TYPE_OPTIONS: Array<{ label: string; value: TGradePackageTypeValue }> = [
  { label: GRADE_PACKAGE_TYPE_I18N[GRADE_PACKAGE_TYPE.GENERAL], value: GRADE_PACKAGE_TYPE.GENERAL },
  { label: GRADE_PACKAGE_TYPE_I18N[GRADE_PACKAGE_TYPE.FIXED], value: GRADE_PACKAGE_TYPE.FIXED }
];
