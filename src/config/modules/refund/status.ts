/** 退款状态 */
export enum REFUND_STATUS {
  /** 待审核 */
  PENDING = 0,
  /** 审核通过 */
  APPROVED = 1,
  /** 退款处理中 */
  PROCESSING = 2,
  /** 全部退款完成 */
  COMPLETED = 3,
  /** 部分退款完成 */
  PARTIAL = 4,
  /** 审核拒绝 */
  REJECTED = 5,
  /** 用户取消 */
  CANCELLED = 6,
  /** 全部失败 */
  FAILED = 7
}

export type TRefundStatusValue = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

export const REFUND_STATUS_I18N: Record<TRefundStatusValue, string> = {
  [REFUND_STATUS.PENDING]: "待审核",
  [REFUND_STATUS.APPROVED]: "审核通过",
  [REFUND_STATUS.PROCESSING]: "退款处理中",
  [REFUND_STATUS.COMPLETED]: "全部退款完成",
  [REFUND_STATUS.PARTIAL]: "部分退款完成",
  [REFUND_STATUS.REJECTED]: "审核拒绝",
  [REFUND_STATUS.CANCELLED]: "用户取消",
  [REFUND_STATUS.FAILED]: "全部失败"
};

export const REFUND_STATUS_OPTIONS: Array<{ label: string; value: TRefundStatusValue }> = [
  { label: REFUND_STATUS_I18N[REFUND_STATUS.PENDING], value: REFUND_STATUS.PENDING },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.APPROVED], value: REFUND_STATUS.APPROVED },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.PROCESSING], value: REFUND_STATUS.PROCESSING },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.COMPLETED], value: REFUND_STATUS.COMPLETED },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.PARTIAL], value: REFUND_STATUS.PARTIAL },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.REJECTED], value: REFUND_STATUS.REJECTED },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.CANCELLED], value: REFUND_STATUS.CANCELLED },
  { label: REFUND_STATUS_I18N[REFUND_STATUS.FAILED], value: REFUND_STATUS.FAILED }
];

/** 获取退款状态的 Tag 类型 */
export const getRefundStatusTagType = (status: TRefundStatusValue) => {
  switch (status) {
    case REFUND_STATUS.PENDING:
      return "warning";
    case REFUND_STATUS.APPROVED:
      return "primary";
    case REFUND_STATUS.PROCESSING:
      return "primary";
    case REFUND_STATUS.COMPLETED:
      return "success";
    case REFUND_STATUS.PARTIAL:
      return "warning";
    case REFUND_STATUS.REJECTED:
      return "danger";
    case REFUND_STATUS.CANCELLED:
      return "info";
    case REFUND_STATUS.FAILED:
      return "danger";
    default:
      return "info";
  }
};
