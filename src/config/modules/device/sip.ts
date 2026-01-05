/** SIP类型：UDP，TCP，TLS，DTLS */
export enum SIP_TYPE {
  /** UDP */
  UDP = "UDP",
  /** TCP */
  TCP = "TCP",
  /** TLS */
  TLS = "TLS",
  /** DTLS */
  DTLS = "DTLS"
}

export type TSipTypeValue = (typeof SIP_TYPE)[keyof typeof SIP_TYPE];

export const SIP_TYPE_I18N: Record<TSipTypeValue, string> = {
  [SIP_TYPE.UDP]: "UDP",
  [SIP_TYPE.TCP]: "TCP",
  [SIP_TYPE.TLS]: "TLS",
  [SIP_TYPE.DTLS]: "DTLS"
};

export const SIP_TYPE_OPTIONS: Array<{ label: string; value: TSipTypeValue }> = [
  { label: SIP_TYPE_I18N[SIP_TYPE.UDP], value: SIP_TYPE.UDP },
  { label: SIP_TYPE_I18N[SIP_TYPE.TCP], value: SIP_TYPE.TCP },
  { label: SIP_TYPE_I18N[SIP_TYPE.TLS], value: SIP_TYPE.TLS },
  { label: SIP_TYPE_I18N[SIP_TYPE.DTLS], value: SIP_TYPE.DTLS }
];
