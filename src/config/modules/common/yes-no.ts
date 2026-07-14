/** 是否标识：Y-是，N-否 */
export enum YES_NO_FLAG {
  /** 是 */
  YES = "Y",
  /** 否 */
  NO = "N"
}

export type TYesNoFlagValue = (typeof YES_NO_FLAG)[keyof typeof YES_NO_FLAG];

export const YES_NO_FLAG_I18N: Record<TYesNoFlagValue, string> = {
  [YES_NO_FLAG.YES]: "是",
  [YES_NO_FLAG.NO]: "否"
};

export const YES_NO_FLAG_OPTIONS: Array<{ label: string; value: TYesNoFlagValue }> = [
  { label: YES_NO_FLAG_I18N[YES_NO_FLAG.YES], value: YES_NO_FLAG.YES },
  { label: YES_NO_FLAG_I18N[YES_NO_FLAG.NO], value: YES_NO_FLAG.NO }
];
