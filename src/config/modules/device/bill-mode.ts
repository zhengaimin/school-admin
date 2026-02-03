/** 计费模式：0-免费，Y-音视频分开计费，N-音视频合并计费 */
export enum DEVICE_BILL_MODE {
  /** 免费 */
  FREE = "0",
  /** 音视频分开计费 */
  SEPARATE = "Y",
  /** 音视频合并计费 */
  MERGED = "N"
}

export type TDeviceBillModeValue = (typeof DEVICE_BILL_MODE)[keyof typeof DEVICE_BILL_MODE];

export const DEVICE_BILL_MODE_I18N: Record<TDeviceBillModeValue, string> = {
  [DEVICE_BILL_MODE.FREE]: "免费",
  [DEVICE_BILL_MODE.SEPARATE]: "音视频分开计费",
  [DEVICE_BILL_MODE.MERGED]: "音视频合并计费"
};

export const DEVICE_BILL_MODE_OPTIONS: Array<{ label: string; value: TDeviceBillModeValue }> = [
  { label: DEVICE_BILL_MODE_I18N[DEVICE_BILL_MODE.FREE], value: DEVICE_BILL_MODE.FREE },
  { label: DEVICE_BILL_MODE_I18N[DEVICE_BILL_MODE.SEPARATE], value: DEVICE_BILL_MODE.SEPARATE },
  { label: DEVICE_BILL_MODE_I18N[DEVICE_BILL_MODE.MERGED], value: DEVICE_BILL_MODE.MERGED }
];
