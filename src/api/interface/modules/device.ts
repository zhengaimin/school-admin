import type {
  TDeviceTypeValue,
  TDeviceCommandCodeValue,
  TDeviceCommandStatusValue,
  TDeviceCommandTypeValue,
  TDeviceCommandCreatedTypeValue,
  TDeviceUsageStatusValue
} from "@/config/modules/device";

// 设备标签模块
export namespace DeviceBaseTag {
  /** 设备标签详情 */
  export interface IDeviceBaseTagItemVo {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
    /** 标签描述 */
    description: string;
    /** 排序值 */
    sort: number;
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 所属学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId: number;
    /** 关联设备数量 */
    deviceCount: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取设备标签列表 - 查询参数 */
  export interface ReqGetDeviceBaseTagsApi {
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 标签名称（模糊查询） */
    name?: string;
    /** 厂商代码 */
    vendorCode?: string;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 学校ID */
    schoolId?: number;
    /** 租户ID */
    tenantId?: number;
  }

  /** 获取设备标签列表 - 响应 data */
  export interface ResGetDeviceBaseTagsApi {
    /** 标签列表 */
    list: IDeviceBaseTagItemVo[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 创建设备标签 - 请求参数 */
  export interface ReqPostDeviceBaseTagApi {
    /** 标签名称 */
    name: string;
    /** 标签描述 */
    description?: string;
    /** 排序值（升序） */
    sort?: number;
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 所属学校ID */
    schoolId: number;
  }

  /** 创建设备标签 - 响应 data */
  export interface ResPostDeviceBaseTagApi {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
  }

  /** 更新设备标签 - 请求参数 */
  export interface ReqPutDeviceBaseTagApi {
    /** 标签名称 */
    name?: string;
    /** 标签描述 */
    description?: string;
    /** 排序值 */
    sort?: number;
  }

  /** 标签下拉选项 */
  export interface IDeviceBaseTagOptionVo {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
  }

  /** 获取标签下拉选项 - 查询参数 */
  export interface ReqGetDeviceBaseTagOptionsApi {
    /** 学校ID */
    schoolId?: number;
    /** 厂商代码 */
    vendorCode?: string;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
  }

  /** 批量绑定设备到标签 - 请求参数 */
  export interface ReqPostDeviceBaseTagDevicesApi {
    /** 设备ID列表 */
    deviceIds: number[];
  }

  /** 批量绑定设备到标签 - 绑定详情 */
  export interface IDeviceBaseTagAssignDetailVo {
    /** 设备ID */
    deviceId: number;
    /** 设备SN */
    deviceSn: string;
    /** 设备名称 */
    deviceName: string;
    /** 是否成功 */
    success: boolean;
    /** 结果消息 */
    message: string;
  }

  /** 批量绑定设备到标签 - 响应 data */
  export interface ResPostDeviceBaseTagDevicesApi {
    /** 标签ID */
    tagId: number;
    /** 标签名称 */
    tagName: string;
    /** 总设备数 */
    totalDevices: number;
    /** 成功数 */
    successCount: number;
    /** 失败数 */
    failedCount: number;
    /** 绑定详情列表 */
    details: IDeviceBaseTagAssignDetailVo[];
  }

  /** 标签下的设备详情 */
  export interface IDeviceBaseTagDeviceVo {
    id: number;
    deviceSn: string;
    name: string;
    location: string;
    deviceType: TDeviceTypeValue;
    vendorCode: string;
    vendorName: string;
    tenantId: number;
    schoolId: number;
    schoolName: string;
    status: number;
    lastOnline: number;
    version: string;
    vendorSpecific: Record<string, any> | null;
    createdAt: string;
  }

  /** 查询标签下的设备列表 - 请求参数 */
  export interface ReqGetDeviceBaseTagDevicesApi {
    [key: string]: any;
  }

  /** 查询标签下的设备列表 - 响应 data */
  export interface ResGetDeviceBaseTagDevicesApi {
    tagId: number;
    tagName: string;
    devices: IDeviceBaseTagDeviceVo[];
  }

  /** 批量下发命令 - 请求参数 */
  export interface ReqPostDeviceBaseTagBatchCommandsApi {
    /** 命令代码 */
    commandCode: TDeviceCommandCodeValue;
    /** 命令名称 */
    commandName: string;
    /** 命令参数 */
    params?: Record<string, any>;
  }

  /** 批量下发命令 - 命令详情 */
  export interface IDeviceBaseTagCommandDetailVo {
    /** 设备ID */
    deviceId: number;
    /** 设备序列号 */
    deviceSn: string;
    /** 设备名称 */
    deviceName: string;
    /** 命令UUID */
    cmdUuid: string;
    /** 命令状态 */
    status: TDeviceCommandStatusValue;
    /** 是否成功 */
    success: boolean;
    /** 结果消息 */
    message: string;
  }

  /** 批量下发命令 - 响应 data */
  export interface ResPostDeviceBaseTagBatchCommandsApi {
    /** 标签ID */
    tagId: number;
    /** 标签名称 */
    tagName: string;
    /** 命令代码 */
    commandCode: TDeviceCommandCodeValue;
    /** 命令名称 */
    commandName: string;
    /** 总设备数 */
    totalDevices: number;
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failedCount: number;
    /** 命令列表 */
    commands: IDeviceBaseTagCommandDetailVo[];
  }
}

export namespace DeviceCommand {
  /** 设备命令项 */
  export interface IDeviceCommandItem {
    /** 命令ID */
    id: number;
    /** 命令唯一ID */
    cmdUuid: string;
    /** 设备ID */
    deviceId: number;
    /** 设备序列号 */
    deviceSn: string;
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number | null;
    /** 命令码 */
    commandCode: string;
    /** 命令名称 */
    commandName: string;
    /** 命令类型 */
    commandType: TDeviceCommandTypeValue;
    /** 命令参数 */
    params: Record<string, any>;
    /** 命令描述 */
    description: string;
    /** 优先级 */
    priority: number;
    /** 超时时间（秒） */
    timeout: number;
    /** 已重试次数 */
    retryCount: number;
    /** 最大重试次数 */
    maxRetries: number;
    /** 执行状态 */
    status: TDeviceCommandStatusValue;
    /** 执行结果码 */
    resultCode: string;
    /** 执行结果消息 */
    resultMsg: string;
    /** 执行结果数据 */
    resultData: Record<string, any>;
    /** 执行时间戳 */
    executedAt: number | null;
    /** 完成时间戳 */
    completedAt: number | null;
    /** 过期时间戳 */
    expiredAt: number | null;
    /** 创建者ID */
    createdBy: number | null;
    /** 创建类型 */
    createdType: TDeviceCommandCreatedTypeValue;
    /** 创建时间 */
    createdAt: number;
    /** 更新时间 */
    updatedAt: number;
  }

  /** 获取设备命令列表请求参数 */
  export interface ReqGetDeviceCommandListApi {
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 学校ID */
    schoolId?: number;
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 设备序列号 */
    deviceSn?: string;
    /** 厂商代码 */
    vendorCode?: string;
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 命令码 */
    commandCode?: string;
    /** 命令类型 */
    commandType?: TDeviceCommandTypeValue;
    /** 执行状态 */
    status?: TDeviceCommandStatusValue;
    /** 创建类型 */
    createdType?: TDeviceCommandCreatedTypeValue;
  }

  /** 获取设备命令列表响应 */
  export interface ResGetDeviceCommandListApi {
    list: IDeviceCommandItem[];
    total: number;
    page: number;
    pageSize: number;
  }
}

export namespace SchoolDeviceConfig {
  /** 学校设备类型配置项 */
  export interface ISchoolDeviceConfigItem {
    /** 配置ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 厂商代码 */
    vendorCode: string;
    /** 自定义名称 */
    customName: string;
    /** 显示排序 */
    sortOrder: number;
    /** 设备类型描述 */
    description: string;
    /** 状态 1-启用 0-禁用 */
    status: number;
    /** 是否启用 */
    isEnabled: boolean;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取设备配置列表 - 请求参数 */
  export interface ReqGetSchoolDeviceConfigListApi {
    /** 学校ID（可选） */
    schoolId?: number;
    /** 设备类型（可选） */
    deviceType?: TDeviceTypeValue;
    /** 厂商代码（可选） */
    vendorCode?: string;
    /** 状态（可选）：1-启用，0-禁用 */
    status?: number;
    /** 页码（默认1） */
    page?: number;
    /** 每页数量（默认20，最大100） */
    pageSize?: number;
  }

  /** 获取设备配置列表 - 响应 data */
  export interface ResGetSchoolDeviceConfigListApi {
    /** 设备类型配置列表 */
    list: ISchoolDeviceConfigItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 更新设备配置 - 请求参数 */
  export interface ReqPutSchoolDeviceConfigApi {
    /** 自定义名称 */
    customName?: string;
    /** 显示排序 */
    sortOrder?: number;
    /** 设备类型描述 */
    description?: string;
    /** 状态：1-启用，0-禁用 */
    status?: number;
  }

  /** 更新设备配置 - 响应 data */
  export interface ResPutSchoolDeviceConfigApi {
    message: string;
  }
}

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

  /** 学生账户信息 */
  export interface IStudentBalanceInfo {
    /** 总余额（元） */
    totalBalance: string;
    /** 可用余额（元） */
    availableBalance: string;
    /** 冻结余额（元） */
    frozenBalance: string;
    /** 赠送时长（分钟） */
    giftMinutes: number;
    /** 套餐时长（分钟） */
    packageMinutes: number;
    /** 套餐短信条数 */
    packageMessageCount: number;
    /** 账户状态（1-正常，0-禁用） */
    status: number;
  }

  /** 设备使用记录详情 */
  export interface IDeviceUsageDetail extends IDeviceUsageItem {
    /** 租户名称 */
    tenantName: string;
    /** 学校名称 */
    schoolName: string;
    /** 级部ID */
    departmentId: number;
    /** 级部名称 */
    departmentName: string;
    /** 是否使用套餐 */
    isPackageUsage: boolean;
    /** 使用类型文本 */
    usageTypeText: string;
    /** 是否免费使用 */
    isFreeUsage: boolean;
    /** 时长分布描述文本 */
    distributionText: string;
    /** 套餐记录ID */
    packageRecordId: number;
    /** 套餐编码 */
    packageCode: string;
    /** 套餐类型 */
    packageType: string;
    /** 套餐购买价格（元） */
    purchasePrice: string;
    /** 套餐开始日期 */
    packageStartDate: string;
    /** 套餐结束日期 */
    packageEndDate: string;
    /** 最后上报时间 */
    lastReportAt: string;
    /** 过期时间 */
    expireAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 备注 */
    remark: string;
    /** 学生账户信息 */
    studentBalance: IStudentBalanceInfo;
  }

  /** 获取设备使用记录详情 - 响应 data */
  export type ResGetDeviceUsageDetailApi = IDeviceUsageDetail;

  /** 获取导出信息 - 请求参数 */
  export interface ReqGetDeviceUsageExportInfoApi {
    /** 每页导出数量（默认10000） */
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

  /** 获取导出信息 - 响应 data */
  export interface ResGetDeviceUsageExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页记录数 */
    pageSize: number;
  }

  /** 导出设备使用记录 - 请求参数 */
  export interface ReqExportDeviceUsageApi {
    /** 导出页码（从1开始） */
    page?: number;
    /** 每页导出数量（默认10000） */
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
}
