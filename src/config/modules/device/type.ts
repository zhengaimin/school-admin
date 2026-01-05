/** 设备类型：DRYER-吹风机，WASHER-洗衣机，VIDEO-视频话机，VOICE-语音话机 */
export enum DEVICE_TYPE {
  /** 吹风机 */
  DRYER = "DRYER",
  /** 视频话机 */
  VIDEO = "VIDEO"
}

export type TDeviceTypeValue = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

export const DEVICE_TYPE_I18N: Record<TDeviceTypeValue, string> = {
  [DEVICE_TYPE.DRYER]: "吹风机",
  [DEVICE_TYPE.VIDEO]: "视频话机"
};

export const DEVICE_TYPE_OPTIONS: Array<{ label: string; value: TDeviceTypeValue }> = [
  { label: DEVICE_TYPE_I18N[DEVICE_TYPE.DRYER], value: DEVICE_TYPE.DRYER },
  { label: DEVICE_TYPE_I18N[DEVICE_TYPE.VIDEO], value: DEVICE_TYPE.VIDEO }
];
