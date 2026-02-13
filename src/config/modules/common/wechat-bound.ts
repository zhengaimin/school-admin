/** 微信绑定状态 */
export const WECHAT_BOUND_STATUS = {
  /** 已绑定 */
  BOUND: true,
  /** 未绑定 */
  UNBOUND: false
} as const;

/** 微信绑定状态值类型 */
export type TWechatBoundStatusValue = (typeof WECHAT_BOUND_STATUS)[keyof typeof WECHAT_BOUND_STATUS];
/** 微信绑定状态文案键 */
export type TWechatBoundStatusKey = `${TWechatBoundStatusValue}`;

/** 微信绑定状态文案映射 */
export const WECHAT_BOUND_STATUS_I18N: Record<TWechatBoundStatusKey, string> = {
  true: "已绑定",
  false: "未绑定"
};

/** 微信绑定状态选项 */
export const WECHAT_BOUND_STATUS_OPTIONS: Array<{ label: string; value: TWechatBoundStatusValue }> = [
  {
    label: WECHAT_BOUND_STATUS_I18N[String(WECHAT_BOUND_STATUS.BOUND) as TWechatBoundStatusKey],
    value: WECHAT_BOUND_STATUS.BOUND
  },
  {
    label: WECHAT_BOUND_STATUS_I18N[String(WECHAT_BOUND_STATUS.UNBOUND) as TWechatBoundStatusKey],
    value: WECHAT_BOUND_STATUS.UNBOUND
  }
];

/** 获取微信绑定状态文案 */
export function getWechatBoundStatusText(value?: TWechatBoundStatusValue) {
  if (value === undefined || value === null) return "--";
  return WECHAT_BOUND_STATUS_I18N[String(value) as TWechatBoundStatusKey] || "--";
}
