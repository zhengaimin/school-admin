import type { TDeviceTypeValue } from "@/config/modules/device";
import type { TPaymentStatusValue, TPaymentMethodValue, TPaymentTypeValue } from "@/config/modules/payment";

/** 支付管理模块 */
export namespace Payment {
  /** 充值记录列表项 */
  export interface IPaymentItem {
    /** 记录ID */
    id: number;
    /** 订单号 */
    orderNo: string;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode?: string;
    /** 学校名称 */
    schoolName: string;
    /** 充值金额 */
    amount: number;
    /** 支付方式 */
    paymentMethod: TPaymentMethodValue;
    /** 支付状态 */
    status: TPaymentStatusValue;
    /** 状态文本 */
    statusText: string;
    /** 第三方交易流水号 */
    transactionId?: string;
    /** 支付时间 */
    payTime?: string;
    /** 创建时间 */
    createdAt: string;
    /** 充值人姓名 */
    payerName?: string;
    /** 充值人ID */
    payerId?: number;
  }

  /** 获取充值记录列表 - 请求参数 */
  export interface ReqGetPaymentsApi {
    /** 学生关键词（支持姓名或学号搜索） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 订单号 */
    orderNo?: string;
    /** 支付状态 */
    status?: TPaymentStatusValue;
    /** 支付方式 */
    paymentMethod?: TPaymentMethodValue;
    /** 支付类型 */
    paymentType?: TPaymentTypeValue;
    /** 开始日期 YYYY-MM-DD */
    startDate?: string;
    /** 结束日期 YYYY-MM-DD */
    endDate?: string;
    /** 最小金额 */
    minAmount?: number;
    /** 最大金额 */
    maxAmount?: number;
    /** 学校ID */
    schoolId?: number;
    /** 级部ID，-1表示全部 */
    departmentId?: number;
    /** 年级ID，-1表示全部 */
    gradeId?: number;
    /** 班级ID，-1表示全部 */
    classId?: number;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取充值记录列表 - 响应 data */
  export interface ResGetPaymentsApi {
    /** 充值记录列表 */
    list: IPaymentItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 退款信息 */
  export interface IRefundInfo {
    /** 已退款金额 */
    refundedAmount: number;
    /** 可退款金额 */
    refundableAmount: number;
    /** 退款次数 */
    refundCount: number;
    /** 最后退款时间 */
    lastRefundTime?: string;
  }

  /** 充值记录详情 */
  export interface IPaymentDetail extends IPaymentItem {
    /** 过期时间 */
    expireAt?: string;
    /** 更新时间 */
    updatedAt: string;
    /** 订单描述 */
    description: string;
    /** 退款信息 */
    refundInfo?: IRefundInfo;
  }

  /** 获取导出信息 - 请求参数 */
  export type ReqGetPaymentExportInfoApi = Omit<ReqGetPaymentsApi, "page" | "pageSize">;

  /** 获取导出信息 - 响应 data */
  export interface ResGetPaymentExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 租户支付配置 */
  export interface IPaymentConfigInfo {
    /** 配置ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName?: string;
    /** 固定金额列表（JSON字符串） */
    fixedAmounts?: string;
    /** 单笔支付最小金额 */
    minAmount?: number | null;
    /** 单笔支付最大金额 */
    maxAmount?: number | null;
    /** 备注 */
    remark?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
  }

  /** 获取租户支付配置 - 响应 data */
  export type ResGetTenantPaymentConfigApi = IPaymentConfigInfo;

  /** 创建或更新租户支付配置 - 请求参数 */
  export interface ReqPutTenantPaymentConfigApi {
    /** 固定金额列表，JSON字符串，如：[10,20,50,100] */
    fixedAmounts?: string;
    /** 单笔支付最小金额 */
    minAmount?: number;
    /** 单笔支付最大金额 */
    maxAmount?: number;
    /** 备注 */
    remark?: string;
  }

  /** 创建或更新租户支付配置 - 响应 data */
  export type ResPutTenantPaymentConfigApi = IPaymentConfigInfo;
}
