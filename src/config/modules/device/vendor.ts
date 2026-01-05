/** 厂商代码：xingri-兴日科技，xstc-新胜同创 */
export enum VENDOR_CODE {
  /** 兴日科技 */
  XINGRI = "xingri",
  /** 新胜同创 */
  XSTC = "xstc"
}

export type TVendorCodeValue = (typeof VENDOR_CODE)[keyof typeof VENDOR_CODE];

export const VENDOR_CODE_I18N: Record<TVendorCodeValue, string> = {
  [VENDOR_CODE.XINGRI]: "兴日科技",
  [VENDOR_CODE.XSTC]: "新胜同创"
};

export const VENDOR_CODE_OPTIONS: Array<{ label: string; value: TVendorCodeValue }> = [
  { label: VENDOR_CODE_I18N[VENDOR_CODE.XINGRI], value: VENDOR_CODE.XINGRI },
  { label: VENDOR_CODE_I18N[VENDOR_CODE.XSTC], value: VENDOR_CODE.XSTC }
];
