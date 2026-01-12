/** 学生类型 */
export enum STUDENT_TYPE {
  /** 寄宿生 */
  BOARDING = "BOARDING",
  /** 走读生 */
  DAY = "DAY"
}

export type TStudentTypeValue = (typeof STUDENT_TYPE)[keyof typeof STUDENT_TYPE];

export const STUDENT_TYPE_I18N: Record<TStudentTypeValue, string> = {
  [STUDENT_TYPE.BOARDING]: "寄宿生",
  [STUDENT_TYPE.DAY]: "走读生"
};

export const STUDENT_TYPE_OPTIONS: Array<{ label: string; value: TStudentTypeValue }> = [
  { label: STUDENT_TYPE_I18N[STUDENT_TYPE.BOARDING], value: STUDENT_TYPE.BOARDING },
  { label: STUDENT_TYPE_I18N[STUDENT_TYPE.DAY], value: STUDENT_TYPE.DAY }
];
