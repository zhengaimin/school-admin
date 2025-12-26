/** 赠费来源 */
export enum GIFT_SOURCE {
  /** 管理员赠送 */
  ADMIN_GIFT = "ADMIN_GIFT",
  /** 充值赠送 */
  RECHARGE_BONUS = "RECHARGE_BONUS"
}

export type TGiftSourceValue = (typeof GIFT_SOURCE)[keyof typeof GIFT_SOURCE];

export const GIFT_SOURCE_I18N: Record<TGiftSourceValue, string> = {
  [GIFT_SOURCE.ADMIN_GIFT]: "管理员赠送",
  [GIFT_SOURCE.RECHARGE_BONUS]: "充值赠送"
};

export const GIFT_SOURCE_OPTIONS: Array<{ label: string; value: TGiftSourceValue }> = [
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.ADMIN_GIFT], value: GIFT_SOURCE.ADMIN_GIFT },
  { label: GIFT_SOURCE_I18N[GIFT_SOURCE.RECHARGE_BONUS], value: GIFT_SOURCE.RECHARGE_BONUS }
];
