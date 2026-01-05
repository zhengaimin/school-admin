/** 配置类型 */
export enum GRADE_CONFIG_TYPE {
  /** 套餐配置 */
  PACKAGE = "package",
  /** 费率配置 */
  RATE = "rate"
}

export type TGradeConfigTypeValue = (typeof GRADE_CONFIG_TYPE)[keyof typeof GRADE_CONFIG_TYPE];

export const GRADE_CONFIG_TYPE_I18N: Record<TGradeConfigTypeValue, string> = {
  [GRADE_CONFIG_TYPE.PACKAGE]: "套餐配置",
  [GRADE_CONFIG_TYPE.RATE]: "费率配置"
};

export const GRADE_CONFIG_TYPE_OPTIONS: Array<{ label: string; value: TGradeConfigTypeValue }> = [
  { label: GRADE_CONFIG_TYPE_I18N[GRADE_CONFIG_TYPE.PACKAGE], value: GRADE_CONFIG_TYPE.PACKAGE },
  { label: GRADE_CONFIG_TYPE_I18N[GRADE_CONFIG_TYPE.RATE], value: GRADE_CONFIG_TYPE.RATE }
];
