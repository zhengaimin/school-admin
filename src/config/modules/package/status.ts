/** 套餐配置状态：0-禁用，1-启用 */
export enum PACKAGE_STATUS {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}

export type TPackageStatusValue = PACKAGE_STATUS;

export const PACKAGE_STATUS_I18N: Record<TPackageStatusValue, string> = {
  [PACKAGE_STATUS.DISABLED]: "禁用",
  [PACKAGE_STATUS.ENABLED]: "启用"
};

export const PACKAGE_STATUS_OPTIONS: Array<{ label: string; value: TPackageStatusValue }> = [
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.ENABLED], value: PACKAGE_STATUS.ENABLED },
  { label: PACKAGE_STATUS_I18N[PACKAGE_STATUS.DISABLED], value: PACKAGE_STATUS.DISABLED }
];
