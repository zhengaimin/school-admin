/** 余额账户状态：0-冻结，1-正常 */
export enum BALANCE_ACCOUNT_STATUS {
  /** 冻结 */
  FROZEN = 0,
  /** 正常 */
  NORMAL = 1
}

export type TBalanceAccountStatusValue = (typeof BALANCE_ACCOUNT_STATUS)[keyof typeof BALANCE_ACCOUNT_STATUS];

export const BALANCE_ACCOUNT_STATUS_I18N: Record<TBalanceAccountStatusValue, string> = {
  [BALANCE_ACCOUNT_STATUS.FROZEN]: "冻结",
  [BALANCE_ACCOUNT_STATUS.NORMAL]: "正常"
};

export const BALANCE_ACCOUNT_STATUS_OPTIONS: Array<{ label: string; value: TBalanceAccountStatusValue }> = [
  { label: BALANCE_ACCOUNT_STATUS_I18N[BALANCE_ACCOUNT_STATUS.FROZEN], value: BALANCE_ACCOUNT_STATUS.FROZEN },
  { label: BALANCE_ACCOUNT_STATUS_I18N[BALANCE_ACCOUNT_STATUS.NORMAL], value: BALANCE_ACCOUNT_STATUS.NORMAL }
];
