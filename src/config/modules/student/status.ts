/** 学生状态：0-停用，1-在读，2-毕业，3-转学 */
export enum STUDENT_STATUS {
  /** 停用 */
  DISABLED = 0,
  /** 在读 */
  ACTIVE = 1,
  /** 毕业 */
  GRADUATED = 2,
  /** 转学 */
  TRANSFERRED = 3
}

export type TStudentStatusValue = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export const STUDENT_STATUS_I18N: Record<TStudentStatusValue, string> = {
  [STUDENT_STATUS.DISABLED]: "停用",
  [STUDENT_STATUS.ACTIVE]: "在读",
  [STUDENT_STATUS.GRADUATED]: "毕业",
  [STUDENT_STATUS.TRANSFERRED]: "转学"
};

export const STUDENT_STATUS_TAG_TYPE: Record<TStudentStatusValue, "success" | "warning" | "info" | "danger"> = {
  [STUDENT_STATUS.DISABLED]: "danger",
  [STUDENT_STATUS.ACTIVE]: "success",
  [STUDENT_STATUS.GRADUATED]: "info",
  [STUDENT_STATUS.TRANSFERRED]: "warning"
};

export const STUDENT_STATUS_OPTIONS: Array<{ label: string; value: TStudentStatusValue }> = [
  { label: STUDENT_STATUS_I18N[STUDENT_STATUS.DISABLED], value: STUDENT_STATUS.DISABLED },
  { label: STUDENT_STATUS_I18N[STUDENT_STATUS.ACTIVE], value: STUDENT_STATUS.ACTIVE },
  { label: STUDENT_STATUS_I18N[STUDENT_STATUS.GRADUATED], value: STUDENT_STATUS.GRADUATED },
  { label: STUDENT_STATUS_I18N[STUDENT_STATUS.TRANSFERRED], value: STUDENT_STATUS.TRANSFERRED }
];
