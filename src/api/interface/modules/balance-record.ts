import type { TBalanceAccountStatusValue } from "@/config/modules/balance-record";
import type { DEVICE_TYPE, TDeviceTypeValue } from "@/config/modules/device";

/** 学生余额账户管理模块 */
export namespace BalanceRecord {
  /** 列表筛选设备类型 */
  export type TBalanceRecordQueryDeviceTypeValue = DEVICE_TYPE.VIDEO | DEVICE_TYPE.DRYER;

  /** 学生余额账户列表项 */
  export interface IBalanceRecordItem {
    /** 账户ID */
    id: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 学生UUID */
    studentUuid: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 级部名称 */
    departmentName: string;
    /** 年级名称 */
    gradeName: string;
    /** 班级名称 */
    className: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 设备类型中文 */
    deviceTypeText: string;
    /** 总余额 */
    totalBalance: string;
    /** 可用余额 */
    availableBalance: string;
    /** 冻结余额 */
    frozenBalance: string;
    /** 累计充值总额 */
    totalRecharge: string;
    /** 累计消费总额 */
    totalConsumption: string;
    /** 累计退款总额 */
    totalRefund: string;
    /** 赠送剩余分钟数 */
    giftMinutes: number;
    /** 套餐剩余分钟数 */
    packageMinutes: number;
    /** 套餐留言剩余条数 */
    packageMessageCount: number;
    /** 账户状态 */
    status: TBalanceAccountStatusValue;
    /** 账户状态中文 */
    statusText: string;
    /** 最后清空日期 */
    lastClearDate: string | null;
    /** 更新时间 */
    updatedAt: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 学生余额账户列表 - 请求参数 */
  export interface ReqGetBalanceRecordsApi {
    /** 学生关键词（姓名/学号/UUID） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 设备类型 */
    deviceType?: TBalanceRecordQueryDeviceTypeValue;
    /** 账户状态 */
    status?: TBalanceAccountStatusValue;
    /** 学校ID，-1表示全部 */
    schoolId?: number;
    /** 级部ID，-1表示全部 */
    departmentId?: number;
    /** 年级ID，-1表示全部 */
    gradeId?: number;
    /** 班级ID，-1表示全部 */
    classId?: number;
    /** 可用余额下限 */
    minBalance?: string;
    /** 可用余额上限 */
    maxBalance?: string;
    /** 开始日期 YYYY-MM-DD */
    startDate?: string;
    /** 结束日期 YYYY-MM-DD */
    endDate?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 学生余额账户列表 - 响应 data */
  export interface ResGetBalanceRecordsApi {
    /** 列表 */
    list: IBalanceRecordItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 学生余额账户详情 */
  export interface IBalanceRecordDetail extends IBalanceRecordItem {
    /** 赠送已使用分钟数 */
    giftMinutesUsed: number;
    /** 套餐已使用分钟数 */
    packageMinutesUsed: number;
    /** 套餐留言已使用条数 */
    packageMessageCountUsed: number;
    /** 冻结的赠送时长分钟数 */
    frozenGiftMinutes: number;
    /** 冻结的套餐时长分钟数 */
    frozenPackageMinutes: number;
    /** 冻结的套餐留言条数 */
    frozenPackageMessageCount: number;
    /** 租户ID */
    tenantId: number;
  }

  /** 获取学生余额账户导出信息 - 请求参数 */
  export type ReqGetBalanceRecordExportInfoApi = Omit<ReqGetBalanceRecordsApi, "page" | "pageSize">;

  /** 获取学生余额账户导出信息 - 响应 data */
  export interface ResGetBalanceRecordExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 单次导出最大条数 */
    pageSize: number;
  }

  /** 导出学生余额账户列表 - 请求参数 */
  export interface ReqGetBalanceRecordExportApi extends ReqGetBalanceRecordExportInfoApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }
}
