/** 年级毕业状态：0-未毕业，1-已毕业 */
export enum GRADE_GRADUATION_STATUS {
  /** 未毕业 */
  NOT_GRADUATED = 0,
  /** 已毕业 */
  GRADUATED = 1
}

export type TGradeGraduationStatusValue = (typeof GRADE_GRADUATION_STATUS)[keyof typeof GRADE_GRADUATION_STATUS];

export const GRADE_GRADUATION_STATUS_I18N: Record<TGradeGraduationStatusValue, string> = {
  [GRADE_GRADUATION_STATUS.NOT_GRADUATED]: "未毕业",
  [GRADE_GRADUATION_STATUS.GRADUATED]: "已毕业"
};

export const GRADE_GRADUATION_STATUS_TAG_TYPE: Record<TGradeGraduationStatusValue, "success" | "info"> = {
  [GRADE_GRADUATION_STATUS.NOT_GRADUATED]: "success",
  [GRADE_GRADUATION_STATUS.GRADUATED]: "info"
};

export const GRADE_GRADUATION_STATUS_OPTIONS: Array<{ label: string; value: TGradeGraduationStatusValue }> = [
  { label: GRADE_GRADUATION_STATUS_I18N[GRADE_GRADUATION_STATUS.NOT_GRADUATED], value: GRADE_GRADUATION_STATUS.NOT_GRADUATED },
  { label: GRADE_GRADUATION_STATUS_I18N[GRADE_GRADUATION_STATUS.GRADUATED], value: GRADE_GRADUATION_STATUS.GRADUATED }
];
