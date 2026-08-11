/** 通话记录模块 */
export namespace CallRecord {
  /** 通话类型 */
  export type TCallTypeValue = "VIDEO" | "SPEECH";

  /** 通道类型 */
  export type TChannelTypeValue = "phone" | "voip";

  /** 学生余额信息 */
  export interface IStudentBalanceInfo {
    /** 总余额 */
    totalBalance: string;
    /** 可用余额 */
    availableBalance: string;
    /** 赠费余额 */
    giftBalance: string;
    /** 冻结余额 */
    frozenBalance: string;
    /** 剩余赠送分钟数 */
    giftMinutes: number;
    /** 剩余套餐分钟数 */
    packageMinutes: number;
    /** 剩余套餐留言条数 */
    packageMessageCount: number;
    /** 状态：1-正常，0-冻结 */
    status: number;
  }

  /** 通话记录列表项 */
  export interface ICallRecordItem {
    /** 记录 ID */
    id: number;
    /** 租户 ID */
    tenantId: number;
    /** 学校 ID */
    schoolId: number;
    /** 年级 ID */
    gradeId: number;
    /** 级部 ID */
    departmentId: number | null;
    /** 班级 ID */
    classId: number | null;
    /** 学生 ID */
    studentId: number;
    /** 设备 ID */
    deviceId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学生 UUID */
    studentUuid: string;
    /** 物理卡号 */
    cardNumber: string;
    /** 通话类型 */
    callType: TCallTypeValue;
    /** 通道类型 */
    channelType: TChannelTypeValue;
    /** 被叫号码 */
    phoneNumber: string;
    /** 亲情号联系人 ID */
    familyContactId: number;
    /** 联系人称呼 */
    contactName: string;
    /** 是否 SOS */
    isSos: boolean;
    /** 呼叫开始时间 */
    callStartTime: string;
    /** 呼叫结束时间 */
    callEndTime: string;
    /** 拨号和通话总时长（秒） */
    callDuration: number;
    /** 计费分钟数 */
    callLenMinute: number;
    /** 时长格式化文案 */
    callDurationFormatted: string;
    /** 消费记录 ID */
    consumptionRecordId: number | null;
    /** 消费流水号 */
    consumeSerialNo: string | null;
    /** 使用时长（秒） */
    usageDuration: number;
    /** 单价 */
    unitPrice: string;
    /** 实际扣费金额 */
    amount: string;
    /** 扣费时间 */
    consumeTime: string;
    /** 是否使用套餐 */
    isPackageUsage: boolean;
    /** 扣费类型文案 */
    usageTypeText: string;
    /** 是否免费使用 */
    isFreeUsage: boolean;
    /** 使用赠送分钟数 */
    giftMinutesUsed: number;
    /** 使用套餐分钟数 */
    packageMinutesUsed: number;
    /** 使用余额分钟数 */
    balanceMinutesUsed: number;
    /** 费用分布文案 */
    distributionText: string;
    /** 本次消费前总余额 */
    totalBalanceBefore: string | null;
    /** 本次消费后总余额 */
    totalBalanceAfter: string | null;
    /** 本次消费前可用余额 */
    availableBalanceBefore: string | null;
    /** 本次消费后可用余额 */
    availableBalanceAfter: string | null;
    /** 套餐购买记录 ID */
    packageRecordId: number | null;
    /** 套餐编码 */
    packageCode: string | null;
    /** 套餐类型 */
    packageType: string | null;
    /** 套餐购买价格 */
    purchasePrice: string | null;
    /** 套餐开始日期 */
    packageStartDate: string;
    /** 套餐结束日期 */
    packageEndDate: string;
    /** 租户名称 */
    tenantName: string;
    /** 学校名称 */
    schoolName: string;
    /** 年级名称 */
    gradeName: string;
    /** 级部名称 */
    departmentName: string;
    /** 班级名称 */
    className: string;
    /** 设备 SN */
    deviceSn: string;
    /** 学生账户余额信息 */
    studentBalance: IStudentBalanceInfo;
    /** 创建时间 */
    createdAt: string;
  }

  /** 查询通话记录列表 - 请求参数 */
  export interface ReqGetCallRecordsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 租户 ID */
    tenantId?: number;
    /** 学校 ID */
    schoolId?: number;
    /** 年级 ID */
    gradeId?: number;
    /** 级部 ID */
    departmentId?: number;
    /** 班级 ID */
    classId?: number;
    /** 学生姓名 */
    studentName?: string;
    /** 被叫号码 */
    phoneNumber?: string;
    /** 通话类型（VIDEO/SPEECH） */
    callType?: TCallTypeValue;
    /** 通道类型（phone/voip） */
    channelType?: TChannelTypeValue;
    /** 是否 SOS：-1 不筛选，1 SOS，2/其他 非 SOS */
    isSos?: number;
    /** 设备 SN */
    deviceSn?: string;
    /** 开始时间（YYYY-MM-DD HH:mm:ss） */
    startTime?: string;
    /** 结束时间（YYYY-MM-DD HH:mm:ss） */
    endTime?: string;
  }

  /** 查询通话记录列表 - 响应 data */
  export interface ResGetCallRecordsApi {
    /** 列表数据 */
    list: ICallRecordItem[];
    /** 总记录数 */
    total: number;
  }

  /** 查询通话记录详情 - 响应 data */
  export type ResGetCallRecordDetailApi = ICallRecordItem;

  /** 获取通话记录导出信息 - 请求参数 */
  export type ReqGetCallRecordExportInfoApi = Omit<ReqGetCallRecordsApi, "page" | "pageSize">;

  /** 获取通话记录导出信息 - 响应 data */
  export interface ResGetCallRecordExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 导出通话记录 - 请求参数 */
  export interface ReqExportCallRecordsApi extends ReqGetCallRecordExportInfoApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }
}
