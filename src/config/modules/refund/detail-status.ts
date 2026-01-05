/** 退款详情状态：0-待退款，1-退款处理中，2-退款成功，3-退款失败，4-已取消 */
export enum REFUND_DETAIL_STATUS {
  /** 待退款 */
  PENDING = 0,
  /** 退款处理中 */
  PROCESSING = 1,
  /** 退款成功 */
  SUCCESS = 2,
  /** 退款失败 */
  FAILED = 3,
  /** 已取消 */
  CANCELLED = 4
}

export type TRefundDetailStatusValue = (typeof REFUND_DETAIL_STATUS)[keyof typeof REFUND_DETAIL_STATUS];

export const REFUND_DETAIL_STATUS_I18N: Record<TRefundDetailStatusValue, string> = {
  [REFUND_DETAIL_STATUS.PENDING]: "待退款",
  [REFUND_DETAIL_STATUS.PROCESSING]: "退款处理中",
  [REFUND_DETAIL_STATUS.SUCCESS]: "退款成功",
  [REFUND_DETAIL_STATUS.FAILED]: "退款失败",
  [REFUND_DETAIL_STATUS.CANCELLED]: "已取消"
};

export const REFUND_DETAIL_STATUS_OPTIONS: Array<{ label: string; value: TRefundDetailStatusValue }> = [
  { label: REFUND_DETAIL_STATUS_I18N[REFUND_DETAIL_STATUS.PENDING], value: REFUND_DETAIL_STATUS.PENDING },
  { label: REFUND_DETAIL_STATUS_I18N[REFUND_DETAIL_STATUS.PROCESSING], value: REFUND_DETAIL_STATUS.PROCESSING },
  { label: REFUND_DETAIL_STATUS_I18N[REFUND_DETAIL_STATUS.SUCCESS], value: REFUND_DETAIL_STATUS.SUCCESS },
  { label: REFUND_DETAIL_STATUS_I18N[REFUND_DETAIL_STATUS.FAILED], value: REFUND_DETAIL_STATUS.FAILED },
  { label: REFUND_DETAIL_STATUS_I18N[REFUND_DETAIL_STATUS.CANCELLED], value: REFUND_DETAIL_STATUS.CANCELLED }
];

/** 获取退款详情状态的 Tag 类型 */
export const getRefundDetailStatusTagType = (status: TRefundDetailStatusValue) => {
  switch (status) {
    case REFUND_DETAIL_STATUS.PENDING:
      return "warning";
    case REFUND_DETAIL_STATUS.PROCESSING:
      return "primary";
    case REFUND_DETAIL_STATUS.SUCCESS:
      return "success";
    case REFUND_DETAIL_STATUS.FAILED:
      return "danger";
    case REFUND_DETAIL_STATUS.CANCELLED:
      return "info";
    default:
      return "info";
  }
};
