import type { TDryerCardRechargeStatusValue } from "@/config/modules/dryer-card-recharge";

/** 导出表单数据。 */
export interface FormData {
  /** 学校ID。 */
  schoolId: number;
  /** 学生关键词。 */
  studentKeyword: string;
  /** 圈存单号。 */
  rechargeNo: string;
  /** 卡号。 */
  cardNumber: string;
  /** 圈存状态。 */
  status: TDryerCardRechargeStatusValue | null;
  /** 终端SN。 */
  terminalSn: string;
  /** 开始时间。 */
  startTime: string;
  /** 结束时间。 */
  endTime: string;
  /** 最小金额。 */
  minAmount: string;
  /** 最大金额。 */
  maxAmount: string;
}

/** 导出弹窗接收参数。 */
export type AcceptParamsOptions = TModalParams & {
  /** 学校ID。 */
  schoolId: number;
  /** 学生关键词。 */
  studentKeyword?: string;
  /** 圈存单号。 */
  rechargeNo?: string;
  /** 卡号。 */
  cardNumber?: string;
  /** 圈存状态。 */
  status?: TDryerCardRechargeStatusValue | null;
  /** 终端SN。 */
  terminalSn?: string;
  /** 开始时间。 */
  startTime?: string;
  /** 结束时间。 */
  endTime?: string;
  /** 最小金额。 */
  minAmount?: string;
  /** 最大金额。 */
  maxAmount?: string;
};
