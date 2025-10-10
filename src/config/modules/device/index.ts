/** 拨号类型 */
export enum PHONE_TYPE {
  ALL = "all",
  VIDEO = "video",
  SIM = "sim"
}
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
