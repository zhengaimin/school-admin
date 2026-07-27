/** 设备命令代码：同步二维码/屏幕参数/超时时间，重启设备 */
export enum DEVICE_COMMAND_CODE {
  /** 同步二维码 */
  SYNC_QR_CODE = "SYNC_QR_CODE",
  /** 同步屏幕参数 */
  SYNC_SCREEN = "SYNC_SCREEN",
  /** 同步超时时间 */
  SYNC_TIMEOUT = "SYNC_TIMEOUT",
  /** 重启设备 */
  REBOOT = "REBOOT"
}

export type TDeviceCommandCodeValue = (typeof DEVICE_COMMAND_CODE)[keyof typeof DEVICE_COMMAND_CODE];

export const DEVICE_COMMAND_CODE_I18N: Record<TDeviceCommandCodeValue, string> = {
  [DEVICE_COMMAND_CODE.SYNC_QR_CODE]: "同步二维码",
  [DEVICE_COMMAND_CODE.SYNC_SCREEN]: "同步屏幕参数",
  [DEVICE_COMMAND_CODE.SYNC_TIMEOUT]: "同步超时时间",
  [DEVICE_COMMAND_CODE.REBOOT]: "重启设备"
};

export const DEVICE_COMMAND_CODE_OPTIONS: Array<{ label: string; value: TDeviceCommandCodeValue }> = [
  { label: DEVICE_COMMAND_CODE_I18N[DEVICE_COMMAND_CODE.SYNC_QR_CODE], value: DEVICE_COMMAND_CODE.SYNC_QR_CODE },
  { label: DEVICE_COMMAND_CODE_I18N[DEVICE_COMMAND_CODE.SYNC_SCREEN], value: DEVICE_COMMAND_CODE.SYNC_SCREEN },
  { label: DEVICE_COMMAND_CODE_I18N[DEVICE_COMMAND_CODE.SYNC_TIMEOUT], value: DEVICE_COMMAND_CODE.SYNC_TIMEOUT },
  { label: DEVICE_COMMAND_CODE_I18N[DEVICE_COMMAND_CODE.REBOOT], value: DEVICE_COMMAND_CODE.REBOOT }
];
