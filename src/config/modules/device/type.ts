/** 设备类型 */
export enum DEVICE_TYPE {
  DRYER = "DRYER",
  PHONE = "PHONE",
  WASHER = "WASHER"
}
/** 设备类型值 */
export type TDeviceTypeValue = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];
export const DEVICE_TYPE_I18N = {
  [DEVICE_TYPE.DRYER]: "吹风机",
  [DEVICE_TYPE.PHONE]: "电话",
  [DEVICE_TYPE.WASHER]: "洗衣机"
};
export const DEVICE_TYPE_OPTIONS = [
  { label: DEVICE_TYPE_I18N[DEVICE_TYPE.DRYER], value: DEVICE_TYPE.DRYER },
  { label: DEVICE_TYPE_I18N[DEVICE_TYPE.PHONE], value: DEVICE_TYPE.PHONE },
  { label: DEVICE_TYPE_I18N[DEVICE_TYPE.WASHER], value: DEVICE_TYPE.WASHER }
];

/** 拨号类型 */
export enum PHONE_TYPE {
  ALL = "all",
  VIDEO = "video",
  SIM = "sim"
}
/** 拨号类型值 */
export type TPhoneTypeValue = (typeof PHONE_TYPE)[keyof typeof PHONE_TYPE];
export const PHONE_TYPE_I18N = {
  all: "全部",
  video: "视频",
  sim: "SIM卡"
};
export const PHONE_TYPE_OPTIONS = [
  {
    label: PHONE_TYPE_I18N.all,
    value: PHONE_TYPE.ALL
  },
  {
    label: PHONE_TYPE_I18N.video,
    value: PHONE_TYPE.VIDEO
  },
  {
    label: PHONE_TYPE_I18N.sim,
    value: PHONE_TYPE.SIM
  }
];

/** SIP 类型 */
export enum SIP_TYPE {
  UDP = "UDP",
  TCP = "TCP",
  TLS = "TLS",
  DTLS = "DTLS"
}
/** SIP 类型值 */
export type TSipTypeValue = (typeof SIP_TYPE)[keyof typeof SIP_TYPE];
export const SIP_TYPE_I18N = {
  udp: "UDP",
  tcp: "TCP",
  tls: "TLS",
  dtls: "DTLS"
};
export const SIP_TYPE_OPTIONS = [
  {
    label: SIP_TYPE_I18N.udp,
    value: SIP_TYPE.UDP
  },
  {
    label: SIP_TYPE_I18N.tcp,
    value: SIP_TYPE.TCP
  },
  {
    label: SIP_TYPE_I18N.tls,
    value: SIP_TYPE.TLS
  },
  {
    label: SIP_TYPE_I18N.dtls,
    value: SIP_TYPE.DTLS
  }
];

/** 设备命令代码 */
export enum DEVICE_COMMAND_CODE {
  SYNC_QR_CODE = "SYNC_QR_CODE",
  SYNC_SCREEN = "SYNC_SCREEN",
  SYNC_TIMEOUT = "SYNC_TIMEOUT",
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

/** 设备命令状态 */
export enum DEVICE_COMMAND_STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}
export type TDeviceCommandStatusValue = (typeof DEVICE_COMMAND_STATUS)[keyof typeof DEVICE_COMMAND_STATUS];
export const DEVICE_COMMAND_STATUS_I18N: Record<TDeviceCommandStatusValue, string> = {
  [DEVICE_COMMAND_STATUS.PENDING]: "待执行",
  [DEVICE_COMMAND_STATUS.SUCCESS]: "成功",
  [DEVICE_COMMAND_STATUS.FAILED]: "失败"
};
export const DEVICE_COMMAND_STATUS_OPTIONS: Array<{ label: string; value: TDeviceCommandStatusValue }> = [
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.PENDING], value: DEVICE_COMMAND_STATUS.PENDING },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.SUCCESS], value: DEVICE_COMMAND_STATUS.SUCCESS },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.FAILED], value: DEVICE_COMMAND_STATUS.FAILED }
];

/** 厂商代码 */
export enum VENDOR_CODE {
  XINGRI = "xingri"
}
export type TVendorCodeValue = (typeof VENDOR_CODE)[keyof typeof VENDOR_CODE];
export const VENDOR_CODE_I18N: Record<TVendorCodeValue, string> = {
  [VENDOR_CODE.XINGRI]: "兴日科技"
};
export const VENDOR_CODE_OPTIONS: Array<{ label: string; value: TVendorCodeValue }> = [
  { label: VENDOR_CODE_I18N[VENDOR_CODE.XINGRI], value: VENDOR_CODE.XINGRI }
];
