/**
 * @description 启用/禁用状态:1-启用,0-禁用
 */
export enum ENABLE_STATUS {
  /** 启用 */
  ENABLED = 1,
  /** 禁用 */
  DISABLED = 0
}

// 启用/禁用状态值类型
export type TEnableStatusValue = (typeof ENABLE_STATUS)[keyof typeof ENABLE_STATUS];

// 启用/禁用状态国际化翻译
export const ENABLE_STATUS_I18N = {
  [ENABLE_STATUS.ENABLED]: "启用",
  [ENABLE_STATUS.DISABLED]: "禁用"
};

// 启用/禁用状态选项列表
export const ENABLE_STATUS_OPTIONS: { label: string; value: TEnableStatusValue }[] = [
  {
    label: ENABLE_STATUS_I18N[ENABLE_STATUS.ENABLED],
    value: ENABLE_STATUS.ENABLED
  },
  {
    label: ENABLE_STATUS_I18N[ENABLE_STATUS.DISABLED],
    value: ENABLE_STATUS.DISABLED
  }
];
