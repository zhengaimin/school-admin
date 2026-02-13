/** 拨号入口：video-视频，sim-SIM卡，sip-SIP */
export enum PHONE_ENTRY {
  /** 视频 */
  VIDEO = "video",
  /** SIM卡 */
  SIM = "sim",
  /** SIP */
  SIP = "sip"
}

export type TPhoneEntryValue = (typeof PHONE_ENTRY)[keyof typeof PHONE_ENTRY];

export const PHONE_ENTRY_I18N: Record<TPhoneEntryValue, string> = {
  [PHONE_ENTRY.VIDEO]: "微信",
  [PHONE_ENTRY.SIM]: "SIM卡",
  [PHONE_ENTRY.SIP]: "SIP"
};

export const PHONE_ENTRY_OPTIONS: Array<{ label: string; value: TPhoneEntryValue }> = [
  { label: PHONE_ENTRY_I18N[PHONE_ENTRY.VIDEO], value: PHONE_ENTRY.VIDEO },
  { label: PHONE_ENTRY_I18N[PHONE_ENTRY.SIM], value: PHONE_ENTRY.SIM },
  { label: PHONE_ENTRY_I18N[PHONE_ENTRY.SIP], value: PHONE_ENTRY.SIP }
];
