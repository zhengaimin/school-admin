/** 赠费状态：1-有效 2-已用完 3-已过期 4-已取消 */
export enum GIFT_STATUS {
  /** 有效 */
  VALID = 1,
  /** 已用完 */
  USED_UP = 2,
  /** 已过期 */
  EXPIRED = 3,
  /** 已取消 */
  CANCELLED = 4
}

export type TGiftStatusValue = (typeof GIFT_STATUS)[keyof typeof GIFT_STATUS];

export const GIFT_STATUS_I18N: Record<TGiftStatusValue, string> = {
  [GIFT_STATUS.VALID]: "有效",
  [GIFT_STATUS.USED_UP]: "已用完",
  [GIFT_STATUS.EXPIRED]: "已过期",
  [GIFT_STATUS.CANCELLED]: "已取消"
};

export const GIFT_STATUS_TAG_TYPE: Record<TGiftStatusValue, "success" | "warning" | "info" | "danger"> = {
  [GIFT_STATUS.VALID]: "success",
  [GIFT_STATUS.USED_UP]: "warning",
  [GIFT_STATUS.EXPIRED]: "info",
  [GIFT_STATUS.CANCELLED]: "danger"
};

export const GIFT_STATUS_OPTIONS: Array<{ label: string; value: TGiftStatusValue }> = [
  { label: GIFT_STATUS_I18N[GIFT_STATUS.VALID], value: GIFT_STATUS.VALID },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.USED_UP], value: GIFT_STATUS.USED_UP },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.EXPIRED], value: GIFT_STATUS.EXPIRED },
  { label: GIFT_STATUS_I18N[GIFT_STATUS.CANCELLED], value: GIFT_STATUS.CANCELLED }
];
