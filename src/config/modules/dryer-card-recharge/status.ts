/** 吹风机圈存状态。 */
export enum DRYER_CARD_RECHARGE_STATUS {
  /** 等待终端写卡。 */
  WAIT_WRITE = "WAIT_WRITE",
  /** 圈存成功。 */
  SUCCESS = "SUCCESS",
  /** 圈存失败。 */
  FAILED = "FAILED",
  /** 写卡超时。 */
  WRITE_TIMEOUT = "WRITE_TIMEOUT",
  /** 已关闭。 */
  CLOSED = "CLOSED"
}

/** 吹风机圈存状态值。 */
export type TDryerCardRechargeStatusValue = (typeof DRYER_CARD_RECHARGE_STATUS)[keyof typeof DRYER_CARD_RECHARGE_STATUS];

/** 吹风机圈存状态文案。 */
export const DRYER_CARD_RECHARGE_STATUS_I18N: Record<TDryerCardRechargeStatusValue, string> = {
  [DRYER_CARD_RECHARGE_STATUS.WAIT_WRITE]: "待写卡",
  [DRYER_CARD_RECHARGE_STATUS.SUCCESS]: "成功",
  [DRYER_CARD_RECHARGE_STATUS.FAILED]: "失败",
  [DRYER_CARD_RECHARGE_STATUS.WRITE_TIMEOUT]: "写卡超时",
  [DRYER_CARD_RECHARGE_STATUS.CLOSED]: "已关闭"
};

/** 吹风机圈存状态选项。 */
export const DRYER_CARD_RECHARGE_STATUS_OPTIONS: Array<{
  label: string;
  value: TDryerCardRechargeStatusValue;
}> = [
  {
    label: DRYER_CARD_RECHARGE_STATUS_I18N[DRYER_CARD_RECHARGE_STATUS.WAIT_WRITE],
    value: DRYER_CARD_RECHARGE_STATUS.WAIT_WRITE
  },
  {
    label: DRYER_CARD_RECHARGE_STATUS_I18N[DRYER_CARD_RECHARGE_STATUS.SUCCESS],
    value: DRYER_CARD_RECHARGE_STATUS.SUCCESS
  },
  {
    label: DRYER_CARD_RECHARGE_STATUS_I18N[DRYER_CARD_RECHARGE_STATUS.FAILED],
    value: DRYER_CARD_RECHARGE_STATUS.FAILED
  },
  {
    label: DRYER_CARD_RECHARGE_STATUS_I18N[DRYER_CARD_RECHARGE_STATUS.WRITE_TIMEOUT],
    value: DRYER_CARD_RECHARGE_STATUS.WRITE_TIMEOUT
  },
  {
    label: DRYER_CARD_RECHARGE_STATUS_I18N[DRYER_CARD_RECHARGE_STATUS.CLOSED],
    value: DRYER_CARD_RECHARGE_STATUS.CLOSED
  }
];

/** 获取吹风机圈存状态 Tag 类型。 */
export function getDryerCardRechargeStatusTagType(status: TDryerCardRechargeStatusValue) {
  switch (status) {
    case DRYER_CARD_RECHARGE_STATUS.WAIT_WRITE:
      return "warning";
    case DRYER_CARD_RECHARGE_STATUS.SUCCESS:
      return "success";
    case DRYER_CARD_RECHARGE_STATUS.FAILED:
      return "danger";
    case DRYER_CARD_RECHARGE_STATUS.WRITE_TIMEOUT:
      return "warning";
    case DRYER_CARD_RECHARGE_STATUS.CLOSED:
      return "info";
    default:
      return "info";
  }
}
