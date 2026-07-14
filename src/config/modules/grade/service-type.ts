/** 服务类型 */
export enum GRADE_SERVICE_TYPE {
  /** 通话服务 */
  CALL = "CALL",
  /** 留言服务 */
  MESSAGE = "MESSAGE",
  /** 吹风机服务 */
  DRYER = "DRYER"
}

export type TGradeServiceTypeValue = (typeof GRADE_SERVICE_TYPE)[keyof typeof GRADE_SERVICE_TYPE];

export const GRADE_SERVICE_TYPE_I18N: Record<TGradeServiceTypeValue, string> = {
  [GRADE_SERVICE_TYPE.CALL]: "通话服务",
  [GRADE_SERVICE_TYPE.MESSAGE]: "留言服务",
  [GRADE_SERVICE_TYPE.DRYER]: "吹风机服务"
};

export const GRADE_SERVICE_TYPE_OPTIONS: Array<{ label: string; value: TGradeServiceTypeValue }> = [
  { label: GRADE_SERVICE_TYPE_I18N[GRADE_SERVICE_TYPE.CALL], value: GRADE_SERVICE_TYPE.CALL },
  { label: GRADE_SERVICE_TYPE_I18N[GRADE_SERVICE_TYPE.MESSAGE], value: GRADE_SERVICE_TYPE.MESSAGE },
  { label: GRADE_SERVICE_TYPE_I18N[GRADE_SERVICE_TYPE.DRYER], value: GRADE_SERVICE_TYPE.DRYER }
];
