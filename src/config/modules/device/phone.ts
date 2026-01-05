/** 拨号类型：all-全部，video-视频，sim-SIM卡 */
export enum PHONE_TYPE {
  /** 全部 */
  ALL = "all",
  /** 视频 */
  VIDEO = "video",
  /** SIM卡 */
  SIM = "sim"
}

export type TPhoneTypeValue = (typeof PHONE_TYPE)[keyof typeof PHONE_TYPE];

export const PHONE_TYPE_I18N: Record<TPhoneTypeValue, string> = {
  [PHONE_TYPE.ALL]: "全部",
  [PHONE_TYPE.VIDEO]: "视频",
  [PHONE_TYPE.SIM]: "SIM卡"
};

export const PHONE_TYPE_OPTIONS: Array<{ label: string; value: TPhoneTypeValue }> = [
  { label: PHONE_TYPE_I18N[PHONE_TYPE.ALL], value: PHONE_TYPE.ALL },
  { label: PHONE_TYPE_I18N[PHONE_TYPE.VIDEO], value: PHONE_TYPE.VIDEO },
  { label: PHONE_TYPE_I18N[PHONE_TYPE.SIM], value: PHONE_TYPE.SIM }
];
