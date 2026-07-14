import type { TDryerCardRechargeStatusValue } from "@/config/modules/dryer-card-recharge";
import type { TDeviceTypeValue } from "@/config/modules/device";

/** 吹风机圈存记录模块。 */
export namespace DryerCardRecharge {
  /** 圈存记录列表项。 */
  export interface IDryerCardRechargeItem {
    /** 记录ID。 */
    id: number;
    /** 圈存单号。 */
    rechargeNo: string;
    /** 设备类型。 */
    deviceType?: TDeviceTypeValue;
    /** 学校ID。 */
    schoolId: number;
    /** 学校名称。 */
    schoolName: string;
    /** 学生ID。 */
    studentId: number;
    /** 学生姓名。 */
    studentName: string;
    /** 学号。 */
    studentCode?: string;
    /** 终端SN。 */
    terminalSn: string;
    /** 卡号。 */
    cardNumber: string;
    /** 圈存金额（分）。 */
    amount: number;
    /** 圈存状态。 */
    status: TDryerCardRechargeStatusValue;
    /** 圈存状态文案。 */
    statusText: string;
    /** 卡侧交易号。 */
    cardTxnNo?: string;
    /** 失败码。 */
    failCode?: string;
    /** 失败信息。 */
    failMsg?: string;
    /** 申请时间。 */
    requestedAt?: string;
    /** 结果回传时间。 */
    resultReportedAt?: string;
    /** 创建时间。 */
    createdAt: string;
    /** 更新时间。 */
    updatedAt?: string;
  }

  /** 获取圈存记录列表请求参数。 */
  export interface ReqGetDryerCardRechargesApi {
    /** 学校ID。 */
    schoolId?: number;
    /** 学生关键词（姓名/学号）。 */
    studentKeyword?: string;
    /** 圈存单号。 */
    rechargeNo?: string;
    /** 卡号。 */
    cardNumber?: string;
    /** 圈存状态。 */
    status?: TDryerCardRechargeStatusValue;
    /** 终端SN。 */
    terminalSn?: string;
    /** 最小金额（分）。 */
    minAmount?: number;
    /** 最大金额（分）。 */
    maxAmount?: number;
    /** 开始日期（YYYY-MM-DD）。 */
    startDate?: string;
    /** 结束日期（YYYY-MM-DD）。 */
    endDate?: string;
    /** 页码。 */
    page: number;
    /** 每页数量。 */
    pageSize: number;
  }

  /** 获取圈存记录列表响应。 */
  export interface ResGetDryerCardRechargesApi {
    /** 列表。 */
    list: IDryerCardRechargeItem[];
    /** 总数。 */
    total: number;
    /** 当前页码。 */
    page: number;
    /** 每页数量。 */
    pageSize: number;
    /** 总页数。 */
    totalPages: number;
  }

  /** 圈存记录详情。 */
  export interface IDryerCardRechargeDetail extends IDryerCardRechargeItem {
    /** 租户ID。 */
    tenantId?: number;
    /** 租户名称。 */
    tenantName?: string;
    /** 终端MAC。 */
    terminalMac?: string;
    /** 终端幂等键。 */
    idempotencyKey?: string;
    /** 余额账户ID。 */
    balanceId?: number;
    /** 冻结流水ID。 */
    freezeDetailId?: number;
    /** 扣减流水ID。 */
    deductDetailId?: number;
    /** 解冻流水ID。 */
    unfreezeDetailId?: number;
    /** 请求时间。 */
    requestedAt?: string;
    /** 结果回传时间。 */
    resultReportedAt?: string;
    /** 备注。 */
    remark?: string;
  }

  /** 获取导出信息 - 请求参数。 */
  export interface ReqGetDryerCardRechargeExportInfoApi {
    /** 学校ID（-1 表示全部）。 */
    schoolId?: number;
    /** 学生关键词（姓名/学号/UUID）。 */
    studentKeyword?: string;
    /** 圈存单号。 */
    rechargeNo?: string;
    /** 卡号。 */
    cardNumber?: string;
    /** 圈存状态。 */
    status?: TDryerCardRechargeStatusValue;
    /** 终端SN。 */
    terminalSn?: string;
    /** 开始时间（支持 YYYY-MM-DD、YYYY-MM-DD HH:mm:ss 或 RFC3339）。 */
    startTime?: string;
    /** 结束时间（支持 YYYY-MM-DD、YYYY-MM-DD HH:mm:ss 或 RFC3339）。 */
    endTime?: string;
    /** 最小金额（单位：元）。 */
    minAmount?: string;
    /** 最大金额（单位：元）。 */
    maxAmount?: string;
  }

  /** 获取导出信息 - 响应 data。 */
  export interface ResGetDryerCardRechargeExportInfoApi {
    /** 总记录数。 */
    totalRecords: number;
    /** 总页数。 */
    totalPages: number;
    /** 每页导出数量。 */
    pageSize: number;
  }

  /** 导出吹风机圈存记录 - 请求参数。 */
  export interface ReqGetDryerCardRechargeExportApi extends ReqGetDryerCardRechargeExportInfoApi {
    /** 页码，默认 1。 */
    page?: number;
  }

  /** 人工确认圈存 - 请求参数。 */
  export interface ReqPostConfirmDryerCardRechargeApi {
    /** 卡侧交易号。 */
    cardTxnNo?: string;
    /** 失败码。 */
    failCode?: string;
    /** 失败原因。 */
    failMsg?: string;
    /** 人工处理原因。 */
    reason: string;
  }

  /** 人工确认圈存 - 响应 data。 */
  export interface ResPostConfirmDryerCardRechargeApi {
    /** 确认结果消息。 */
    message: string;
  }
}
