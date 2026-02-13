/** 拨号模式：family-亲情号模式，free-自由拨号模式 */
export enum DIAL_MODE {
  /** 亲情号模式 */
  FAMILY = "family",
  /** 自由拨号模式 */
  FREE = "free"
}

export type TDialModeValue = (typeof DIAL_MODE)[keyof typeof DIAL_MODE];

export const DIAL_MODE_I18N: Record<TDialModeValue, string> = {
  [DIAL_MODE.FAMILY]: "亲情号模式",
  [DIAL_MODE.FREE]: "自由拨号模式"
};

export const DIAL_MODE_OPTIONS: Array<{ label: string; value: TDialModeValue }> = [
  { label: DIAL_MODE_I18N[DIAL_MODE.FAMILY], value: DIAL_MODE.FAMILY },
  { label: DIAL_MODE_I18N[DIAL_MODE.FREE], value: DIAL_MODE.FREE }
];
