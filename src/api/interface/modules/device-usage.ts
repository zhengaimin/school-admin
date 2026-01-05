import type { TDeviceTypeValue, TDeviceUsageStatusValue } from "@/config/modules/device";

export namespace DeviceUsage {
  /** 设备使用记录项 */
  export interface IDeviceUsageItem {
    /** 记录ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 订单号 */
    orderNo: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 厂商代码 */
    vendorCode: string;
    /** 状态 */
    status: TDeviceUsageStatusValue;
    /** 状态文本 */
    statusText: string;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学生UUID */
    studentUuid: string;
    /** 卡号 */
    cardNumber: string;
    /** 年级ID */
    gradeId: number;
    /** 年级名称 */
    gradeName: string;
    /** 班级ID */
    classId: number;
    /** 班级名称 */
    className: string;
    /** 设备ID */
    deviceId: number;
    /** 设备序列号 */
    deviceSn: string;
    /** 设备名称 */
    deviceName: string;
    /** 最大可用时长（分钟） */
    maxUsageMinutes: number;
    /** 实际使用时长（秒） */
    usageDuration: number;
    /** 计费分钟数 */
    usageMinutes: number;
    /** 费率（元/分钟） */
    unitPrice: string;
    /** 冻结金额（元） */
    frozenAmount: string;
    /** 冻结赠送时长（分钟） */
    frozenGiftMinutes: number;
    /** 冻结套餐时长（分钟） */
    frozenPackageMinutes: number;
    /** 实际扣费金额（元） */
    actualAmount: string;
    /** 退款金额（元） */
    refundAmount: string;
    /** 使用赠送时长（分钟） */
    giftMinutesUsed: number;
    /** 使用套餐时长（分钟） */
    packageMinutesUsed: number;
    /** 使用余额时长（分钟） */
    balanceMinutesUsed: number;
    /** 刷卡时间 */
    createdAt: string;
    /** 确认使用时间 */
    confirmedAt: string;
    /** 完成时间 */
    completedAt: string;
    /** 消费记录ID */
    consumptionRecordId: number;
    /** 消费流水号 */
    consumeSerialNo: string;
    /** 消费时间 */
    consumeTime: string;
  }

  /** 获取设备使用记录列表 - 请求参数 */
  export interface ReqGetDeviceUsageListApi {
    /** 页码（默认1） */
    page?: number;
    /** 每页数量（默认20） */
    pageSize?: number;
    /** 学校ID */
    schoolId?: number;
    /** 年级ID */
    gradeId?: number;
    /** 级部ID */
    departmentId?: number;
    /** 班级ID */
    classId?: number;
    /** 学生姓名（模糊搜索） */
    studentName?: string;
    /** 设备序列号（精确查询） */
    deviceSn?: string;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 订单号（精确查询） */
    orderNo?: string;
    /** 订单状态 */
    status?: TDeviceUsageStatusValue;
    /** 厂商代码 */
    vendorCode?: string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
  }

  /** 获取设备使用记录列表 - 响应 data */
  export interface ResGetDeviceUsageListApi {
    /** 记录列表 */
    list: IDeviceUsageItem[];
    /** 总记录数 */
    total: number;
  }
}
