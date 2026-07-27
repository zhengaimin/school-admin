/** 人脸状态：0-未采集，1-已采集，2-审核中，3-审核通过，4-审核失败 */
export enum FACE_STATUS {
  /** 未采集 */
  NOT_COLLECTED = 0,
  /** 已采集 */
  COLLECTED = 1,
  /** 审核中 - 没有这个状态了，改成【下发中】即可 */
  REVIEWING = 2,
  /** 审核通过 */
  APPROVED = 3,
  /** 审核失败 */
  REJECTED = 4
}

export type TFaceStatusValue = (typeof FACE_STATUS)[keyof typeof FACE_STATUS];

export const FACE_STATUS_I18N: Record<TFaceStatusValue, string> = {
  [FACE_STATUS.NOT_COLLECTED]: "未采集",
  [FACE_STATUS.COLLECTED]: "已采集",
  [FACE_STATUS.REVIEWING]: "下发中",
  [FACE_STATUS.APPROVED]: "审核通过",
  [FACE_STATUS.REJECTED]: "审核失败"
};

export const FACE_STATUS_TAG_TYPE: Record<TFaceStatusValue, "success" | "warning" | "info" | "danger" | ""> = {
  [FACE_STATUS.NOT_COLLECTED]: "info",
  [FACE_STATUS.COLLECTED]: "",
  [FACE_STATUS.REVIEWING]: "warning",
  [FACE_STATUS.APPROVED]: "success",
  [FACE_STATUS.REJECTED]: "danger"
};

export const FACE_STATUS_OPTIONS: Array<{ label: string; value: TFaceStatusValue }> = [
  { label: FACE_STATUS_I18N[FACE_STATUS.NOT_COLLECTED], value: FACE_STATUS.NOT_COLLECTED },
  { label: FACE_STATUS_I18N[FACE_STATUS.COLLECTED], value: FACE_STATUS.COLLECTED },
  { label: FACE_STATUS_I18N[FACE_STATUS.REVIEWING], value: FACE_STATUS.REVIEWING },
  { label: FACE_STATUS_I18N[FACE_STATUS.APPROVED], value: FACE_STATUS.APPROVED },
  { label: FACE_STATUS_I18N[FACE_STATUS.REJECTED], value: FACE_STATUS.REJECTED }
];
