import type {
  TRefundStatusValue,
  TRefundTypeValue,
  TRefundCategoryValue,
  TRefundDetailStatusValue
} from "@/config/modules/refund";
import type { TDeviceTypeValue } from "@/config/modules/device";

/** 退款模块 */
export namespace Refund {
  /** 退款列表项 */
  export interface IRefundItem {
    /** 退款申请ID */
    id: number;
    /** 退款申请单号 */
    refundNo: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 学校名称 */
    schoolName: string;
    /** 申请人姓名 */
    applicantName: string;
    /** 退款类型 */
    refundType: TRefundTypeValue;
    /** 退款分类 */
    refundCategory: TRefundCategoryValue;
    /** 申请退款金额 */
    applyAmount: number;
    /** 实际退款金额 */
    actualAmount: number | null;
    /** 退款状态 */
    status: TRefundStatusValue;
    /** 状态文本 */
    statusText: string;
    /** 申请原因 */
    applyReason: string;
    /** 申请时间 */
    applyTime: string;
    /** 支付 ID */
    paymentID: number;
    /** 审核时间 */
    auditTime: string | null;
    /** 完成时间 */
    completeTime: string | null;
    /** 创建时间 */
    createdAt: string;
  }

  /** 获取退款列表 - 请求参数 */
  export interface ReqGetRefundsApi {
    /** 学生关键词（支持姓名或学号搜索） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 退款申请单号 */
    refundNo?: string;
    /** 退款状态 */
    status?: TRefundStatusValue;
    /** 退款类型 */
    refundType?: TRefundTypeValue;
    /** 退款分类 */
    refundCategory?: TRefundCategoryValue;
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
    /** 开始日期 YYYY-MM-DD */
    startDate?: string;
    /** 结束日期 YYYY-MM-DD */
    endDate?: string;
    /** 最小退款金额 */
    minAmount?: number;
    /** 最大退款金额 */
    maxAmount?: number;
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取退款列表 - 响应 data */
  export interface ResGetRefundsApi {
    /** 退款列表 */
    list: IRefundItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 退款学生信息 */
  export interface IRefundStudentInfo {
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 班级名称 */
    className: string;
    /** 当前余额 */
    balance: number;
  }

  /** 退款详情项 */
  export interface IRefundDetailItem {
    /** 退款详情ID */
    id: number;
    /** 原充值记录ID */
    paymentId: number;
    /** 原充值订单号 */
    paymentOrderNo: string;
    /** 本笔退款金额 */
    refundAmount: number;
    /** 原充值金额 */
    originalAmount: number;
    /** 原支付方式 */
    originalPaymentMethod: string;
    /** 原第三方交易流水号 */
    originalTransactionId: string | null;
    /** 原支付时间 */
    originalPayTime: string | null;
    /** 第三方退款流水号 */
    thirdPartyRefundId: string | null;
    /** 退款状态 */
    refundStatus: TRefundDetailStatusValue;
    /** 退款失败原因 */
    refundFailReason: string | null;
  }

  /** 退款详情 */
  export interface IRefundDetail extends IRefundItem {
    /** 审核管理员ID */
    adminId: number | null;
    /** 审核管理员姓名 */
    adminName: string;
    /** 审核备注 */
    adminRemark: string;
    /** 关联的充值订单ID */
    paymentId: number | null;
    /** 退款详情列表 */
    refundDetails: IRefundDetailItem[];
    /** 学生信息 */
    studentInfo: IRefundStudentInfo;
  }

  /** 审核退款申请 - 请求参数 */
  export interface ReqAuditRefundApi {
    /** 是否通过审核 */
    approved: boolean;
    /** 审核备注 */
    adminRemark?: string;
    /** 实际退款金额（仅套餐退款支持调整） */
    actualAmount?: number;
  }

  /** 审核退款申请 - 响应 data */
  export interface ResAuditRefundApi {
    /** 操作是否成功 */
    success: boolean;
    /** 操作结果消息 */
    message: string;
  }

  /** 获取导出退款记录信息 - 请求参数 */
  export interface ReqGetRefundExportInfoApi {
    /** 学生关键词（支持姓名或学号搜索） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 退款申请单号 */
    refundNo?: string;
    /** 退款状态 */
    status?: TRefundStatusValue;
    /** 退款类型 */
    refundType?: TRefundTypeValue;
    /** 退款分类 */
    refundCategory?: TRefundCategoryValue;
    /** 学校ID，-1表示全部 */
    schoolId?: number;
    /** 级部ID，-1表示全部 */
    departmentId?: number;
    /** 年级ID，-1表示全部 */
    gradeId?: number;
    /** 班级ID，-1表示全部 */
    classId?: number;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 开始日期 YYYY-MM-DD */
    startDate?: string;
    /** 结束日期 YYYY-MM-DD */
    endDate?: string;
    /** 最小金额 */
    minAmount?: number;
    /** 最大金额 */
    maxAmount?: number;
  }

  /** 获取导出退款记录信息 - 响应 data */
  export interface ResGetRefundExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页数量 */
    pageSize: number;
  }
}
