/** 吹风机端口：0-一路，1-二路 */
export enum DRYER_PORT {
  /** 一路 */
  FIRST = 0,
  /** 二路 */
  SECOND = 1
}

export type TDryerPortValue = (typeof DRYER_PORT)[keyof typeof DRYER_PORT];

export const DRYER_PORT_I18N: Record<TDryerPortValue, string> = {
  [DRYER_PORT.FIRST]: "一路",
  [DRYER_PORT.SECOND]: "二路"
};

export const DRYER_PORT_OPTIONS: Array<{ label: string; value: TDryerPortValue }> = [
  { label: DRYER_PORT_I18N[DRYER_PORT.FIRST], value: DRYER_PORT.FIRST },
  { label: DRYER_PORT_I18N[DRYER_PORT.SECOND], value: DRYER_PORT.SECOND }
];
