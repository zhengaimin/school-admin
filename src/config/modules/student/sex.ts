/** 学生性别 */
export enum STUDENT_SEX {
  /** 男 */
  MALE = "男",
  /** 女 */
  FEMALE = "女"
}

export type TStudentSexValue = (typeof STUDENT_SEX)[keyof typeof STUDENT_SEX];

export const STUDENT_SEX_I18N: Record<TStudentSexValue, string> = {
  [STUDENT_SEX.MALE]: "男",
  [STUDENT_SEX.FEMALE]: "女"
};

export const STUDENT_SEX_OPTIONS: Array<{ label: string; value: TStudentSexValue }> = [
  { label: STUDENT_SEX_I18N[STUDENT_SEX.MALE], value: STUDENT_SEX.MALE },
  { label: STUDENT_SEX_I18N[STUDENT_SEX.FEMALE], value: STUDENT_SEX.FEMALE }
];
