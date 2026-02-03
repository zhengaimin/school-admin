/** 微信绑定状态 */
export const WECHAT_BOUND_STATUS = {
  /** 已绑定 */
  BOUND: true,
  /** 未绑定 */
  UNBOUND: false
} as const;

/** 微信绑定状态值类型 */
export type TWechatBoundStatusValue = (typeof WECHAT_BOUND_STATUS)[keyof typeof WECHAT_BOUND_STATUS];

/** 微信绑定状态文案映射 */
export const WECHAT_BOUND_STATUS_I18N: Record<TWechatBoundStatusValue, string> = {
  [WECHAT_BOUND_STATUS.BOUND]: "已绑定",
  [WECHAT_BOUND_STATUS.UNBOUND]: "未绑定"
};

/** 微信绑定状态选项 */
export const WECHAT_BOUND_STATUS_OPTIONS: Array<{ label: string; value: TWechatBoundStatusValue }> = [
  {
    label: WECHAT_BOUND_STATUS_I18N[WECHAT_BOUND_STATUS.BOUND],
    value: WECHAT_BOUND_STATUS.BOUND
  },
  {
    label: WECHAT_BOUND_STATUS_I18N[WECHAT_BOUND_STATUS.UNBOUND],
    value: WECHAT_BOUND_STATUS.UNBOUND
  }
];
