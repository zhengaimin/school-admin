import type {
  TDeviceTypeValue,
  TDeviceStatusValue,
  TDeviceBillModeValue,
  TDeviceCommandCodeValue,
  TDeviceCommandStatusValue,
  TDeviceCommandTypeValue,
  TDeviceCommandCreatedTypeValue,
  TDeviceEventTypeValue,
  TDeviceUsageStatusValue,
  TDeviceFaceSyncStatusValue,
  TDeviceFaceDesiredActionValue,
  TDeviceFaceErrorCodeValue,
  TDeviceTagControlActionValue,
  TDialModeValue,
  TPhoneEntryValue,
  TPhoneTypeValue,
  TSipTypeValue
} from "@/config/modules/device";

import type { TEnableStatusValue, TYesNoFlagValue } from "@/config/modules/common";

// 设备标签模块
export namespace DeviceTag {
  /** 设备标签详情 */
  export interface IDeviceTagItemVo {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName: string;
    /** 状态 */
    status: TEnableStatusValue;
    /** 标签描述 */
    description: string;
    /** 排序 */
    sort: number;
    /** 关联设备数量 */
    deviceCount: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 设备标签列表 - 查询参数 */
  export interface ReqGetDeviceTagsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 标签名称（模糊查询） */
    name?: string;
    /** 学校ID */
    schoolId?: number;
    /** 租户ID */
    tenantId?: number;
    /** 状态筛选：-1不筛选，0禁用，1启用 */
    status?: TEnableStatusValue | -1;
  }

  /** 设备标签列表 - 响应 data */
  export interface ResGetDeviceTagsApi {
    /** 列表 */
    list: IDeviceTagItemVo[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 设备标签选择项 */
  export interface IDeviceTagSelectOptionVo {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
    /** 学校ID */
    schoolId: number;
    /** 租户ID */
    tenantId: number;
    /** 关联设备数量 */
    deviceCount: number;
  }

  /** 获取设备标签选择项 - 查询参数 */
  export interface ReqGetDeviceTagSelectOptionsApi {
    /** 学校ID */
    schoolId?: number | -1;
    /** 状态 */
    status?: TEnableStatusValue | -1;
  }

  /** 获取设备标签选择项 - 响应 data */
  export interface ResGetDeviceTagSelectOptionsApi {
    /** 选择项列表 */
    list: IDeviceTagSelectOptionVo[];
  }

  /** 新增设备标签 - 请求参数 */
  export interface ReqPostDeviceTagApi {
    /** 标签名称 */
    name: string;
    /** 所属学校ID */
    schoolId: number;
    /** 标签描述 */
    description?: string;
    /** 排序 */
    sort?: number;
  }

  /** 新增设备标签 - 响应 data */
  export interface ResPostDeviceTagApi {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
  }

  /** 更新设备标签 - 请求参数 */
  export interface ReqPutDeviceTagApi {
    /** 标签名称 */
    name: string;
    /** 标签描述 */
    description?: string;
    /** 排序 */
    sort?: number;
    /** 状态：-1不更新，0禁用，1启用 */
    status?: TEnableStatusValue | -1;
  }

  /** 批量绑定设备到标签 - 请求参数 */
  export interface ReqPostDeviceTagBatchAssignApi {
    /** 设备ID列表 */
    deviceIds: number[];
    /** 设备标签ID列表 */
    deviceTagIds: number[];
  }

  /** 批量绑定设备到标签 - 响应 data */
  export interface ResPostDeviceTagBatchAssignApi {
    /** 成功数 */
    successCount: number;
    /** 失败数 */
    failCount: number;
    /** 失败列表 */
    failList: Array<Record<string, any>> | null;
  }

  /** 批量控制设备 - 请求参数 */
  export interface ReqPostDeviceTagBatchControlApi {
    /** 设备标签ID */
    deviceTagId: number;
    /** 操作 */
    action: TDeviceTagControlActionValue;
  }

  /** 批量控制设备 - 成功命令项 */
  export interface IDeviceTagControlCommandItemVo {
    /** 设备ID */
    deviceId: number;
    /** 设备名称 */
    deviceName: string;
    /** 命令ID */
    commandId: number;
    /** 命令UUID */
    cmdUuid: string;
    /** 命令项 */
    commandItem: string;
    /** 描述 */
    describe: string;
    /** 状态 */
    status: string;
  }

  /** 批量控制设备 - 失败项 */
  export interface IDeviceTagControlFailItemVo {
    /** 设备ID */
    deviceId?: number;
    /** 设备名称 */
    deviceName?: string;
    /** 命令项 */
    commandItem?: string;
    /** 描述 */
    describe?: string;
    /** 状态 */
    status?: string;
    /** 结果消息 */
    message?: string;
  }

  /** 批量控制设备 - 响应 data */
  export interface ResPostDeviceTagBatchControlApi {
    /** 成功数 */
    successCount: number;
    /** 失败数 */
    failCount: number;
    /** 成功命令列表 */
    successCommands: IDeviceTagControlCommandItemVo[];
    /** 失败列表 */
    failList: IDeviceTagControlFailItemVo[] | null;
  }

  /** 批量设置定时开关机 - 请求参数 */
  export interface ReqPostDeviceTagBatchScheduleApi {
    /** 设备标签ID */
    deviceTagId: number;
    /** 开机时间 */
    powerOnTime: string;
    /** 关机时间 */
    powerOffTime: string;
  }

  /** 批量设置定时开关机 - 响应 data */
  export interface ResPostDeviceTagBatchScheduleApi {
    /** 成功数 */
    successCount: number;
    /** 失败数 */
    failCount: number;
    /** 失败列表 */
    failList: Array<Record<string, any>> | null;
  }

  /** 设备标签详情 - 响应 data */
  export type ResGetDeviceTagDetailApi = IDeviceTagItemVo;
}

// 设备基础标签模块
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

export namespace DeviceCommandRecord {
  /** 设备命令记录列表项 */
  export interface IDeviceCommandRecordItem {
    /** 命令ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 命令UUID */
    cmdUuid: string;
    /** 设备ID */
    deviceId: number;
    /** 设备名称 */
    deviceName: string;
    /** 终端KEY */
    terminalKey: string;
    /** 终端SN */
    terminalSn: string;
    /** 命令类型 */
    commandType: TDeviceCommandTypeValue;
    /** 命令项 */
    commandItem: string;
    /** 命令名称 */
    commandName: string;
    /** 命令描述 */
    describe: string;
    /** 执行状态 */
    status: TDeviceCommandStatusValue;
    /** 执行状态文案 */
    statusText: string;
    /** 执行结果消息 */
    message: string;
    /** 执行时间 */
    executedAt: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 设备命令记录详情 */
  export interface IDeviceCommandRecordDetail {
    /** 命令ID */
    id: number;
    /** 命令UUID */
    cmdUuid: string;
    /** 设备ID */
    deviceId: number;
    /** 设备名称 */
    deviceName: string;
    /** 终端KEY */
    terminalKey: string;
    /** 终端SN */
    terminalSn: string;
    /** 命令类型 */
    commandType: TDeviceCommandTypeValue;
    /** 命令项 */
    commandItem: string;
    /** 命令名称 */
    commandName: string;
    /** 命令描述 */
    describe: string;
    /** 命令参数 */
    arg: string;
    /** 执行状态 */
    status: TDeviceCommandStatusValue;
    /** 执行状态文案 */
    statusText: string;
    /** 执行结果消息 */
    message: string;
    /** 请求数据 */
    requestData: string;
    /** 执行时间 */
    executedAt: string;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取设备命令记录列表请求参数 */
  export interface ReqGetDeviceCommandRecordListApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 设备ID */
    deviceId?: number;
    /** 命令类型 */
    commandType?: TDeviceCommandTypeValue[];
    /** 执行状态 */
    status?: TDeviceCommandStatusValue;
    /** 设备名称 */
    deviceName?: string;
    /** 终端KEY */
    terminalKey?: string;
    /** 终端SN */
    terminalSn?: string;
    /** 学校ID */
    schoolId?: number | string;
    /** 租户ID */
    tenantId?: number | string;
  }

  /** 获取设备命令记录列表响应 */
  export interface ResGetDeviceCommandRecordListApi {
    list: IDeviceCommandRecordItem[];
    total: number;
    page: number;
    pageSize: number;
  }
}

// 设备事件日志模块
export namespace DeviceEventLog {
  /** 设备事件日志列表项 */
  export interface IDeviceEventLogItem {
    /** 日志ID */
    id: number;
    /** 终端SN */
    terminalSn: string;
    /** 学生ID */
    studentId?: number | null;
    /** 设备名称 */
    deviceName?: string;
    /** 学校名称 */
    schoolName?: string;
    /** 事件类型 */
    eventType: TDeviceEventTypeValue | string;
    /** 事件类型名称 */
    eventTypeName?: string;
    /** 事件数据 */
    eventData?: Record<string, any> | string | null;
    /** 事件时间 */
    eventTime: string;
  }

  /** 获取设备事件日志列表请求参数 */
  export interface ReqGetDeviceEventLogListApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 终端SN */
    terminalSn?: string;
    /** 学生ID */
    studentId?: number;
    /** 学校ID */
    schoolId?: number;
    /** 事件类型 */
    eventType?: TDeviceEventTypeValue | string;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
  }

  /** 获取设备事件日志列表响应 */
  export interface ResGetDeviceEventLogListApi {
    list: IDeviceEventLogItem[];
    total: number;
    page: number;
    pageSize: number;
  }

  /** 设备事件日志统计请求参数 */
  export interface ReqGetDeviceEventLogStatisticsApi {
    /** 学校ID */
    schoolId?: number;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 分组方式 */
    groupBy?: "type" | "terminal" | "day";
  }

  /** 按类型统计项 */
  export interface IDeviceEventLogTypeCountItem {
    eventType: TDeviceEventTypeValue | string;
    eventTypeName?: string;
    count: number;
  }

  /** 按设备统计项 */
  export interface IDeviceEventLogDeviceCountItem {
    terminalSn: string;
    count: number;
  }

  /** 按日期统计项 */
  export interface IDeviceEventLogDayCountItem {
    date: string;
    count: number;
  }

  /** 设备事件日志统计响应 */
  export interface ResGetDeviceEventLogStatisticsApi {
    byType: IDeviceEventLogTypeCountItem[];
    byDevice: IDeviceEventLogDeviceCountItem[];
    byDay: IDeviceEventLogDayCountItem[];
  }
}

// 公话配置模块
export namespace DeviceDialConfig {
  /** 公话扩展配置。 */
  export interface IDeviceDialExtraConfig {
    /** 扩展配置原始键值（兼容存量字段）。 */
    [key: string]: any;
    /** 禁止呼入。 */
    "call.incoming.disabled"?: boolean | number | string;
    /** 开启人脸。 */
    "face.enabled"?: boolean | number | string;
    /** SOS 标题。 */
    "sos.title"?: string;
    /** 第三方地址。 */
    "thirdParty.url"?: string;
    /** 吹风机圈存开关：Y/N。 */
    "dryer.card.recharge.enabled"?: TYesNoFlagValue | string;
    /** 吹风机圈存金额（单位元，逗号分隔）。 */
    "dryer.card.recharge.amount.options"?: number[] | string;
    /** 是否显示圈存菜单按钮。 */
    "dryer.card.recharge.menu.button.visible"?: boolean | number | string;
  }

  /** 公话配置项 */
  export interface IDeviceDialConfigVo {
    /** 配置ID */
    id: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId?: number;
    /** 租户名称 */
    tenantName?: string;
    /** 心跳时间（ms） */
    heartbeatFrequency?: number;
    /** 单次通话限定时长（分钟） */
    callTime?: number;
    /** 定时开机时间 */
    powerOnTime?: string;
    /** 定时关机时间 */
    powerOffTime?: string;
    /** 定时开关机时间 */
    timeOnOff?: string;
    /** 拨号类型（已废弃） */
    phoneType?: TPhoneTypeValue;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[];
    /** 是否显示留言按钮 */
    messageFlag?: TYesNoFlagValue;
    /** 是否全量同步人脸 */
    downloadUserFlag?: TYesNoFlagValue;
    /** 是否启用语音留言 */
    messageSoundFlag?: TYesNoFlagValue;
    /** 心理咨询身份认证 */
    mhcFlag?: TYesNoFlagValue;
    /** 刷脸记录人员信息 */
    addPunchFace?: TYesNoFlagValue;
    /** 禁拨号码 */
    forbidPhone?: string;
    /** 禁拨时间段 */
    forbidCallTimes?: string;
    /** sip用户名 */
    sipUserName?: string;
    /** sip密码 */
    sipPassword?: string;
    /** sip服务地址 */
    sipDomain?: string;
    /** Sip协议类型 */
    sipTransportType?: TSipTypeValue;
    /** 设备密码 */
    password?: string;
    /** 扩展配置 */
    extraConfig?: IDeviceDialExtraConfig;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
  }

  /** 公话配置列表 - 请求参数 */
  export interface ReqGetDeviceDialConfigListApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 学校ID */
    schoolId?: number;
    /** 学校名称 */
    schoolName?: string;
  }

  /** 公话配置列表 - 响应 data */
  export interface ResGetDeviceDialConfigListApi {
    /** 列表 */
    list: IDeviceDialConfigVo[];
    /** 总数 */
    total: number;
  }

  /** 公话配置详情 - 响应 data */
  export type ResGetDeviceDialConfigDetailApi = IDeviceDialConfigVo;

  /** 添加公话配置 - 请求参数 */
  export interface ReqPostDeviceDialConfigApi {
    /** 学校ID */
    schoolId: number;
    /** 心跳时间（ms） */
    heartbeatFrequency?: number;
    /** 单次通话限定时长（分钟） */
    callTime?: number;
    /** 定时开机时间 */
    powerOnTime?: string;
    /** 定时关机时间 */
    powerOffTime?: string;
    /** 禁拨号码 */
    forbidPhone?: string;
    /** 拨号类型（已废弃） */
    phoneType?: TPhoneTypeValue;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[];
    /** 是否显示留言按钮 */
    messageFlag?: TYesNoFlagValue;
    /** 是否全量同步人脸 */
    downloadUserFlag?: TYesNoFlagValue;
    /** 是否启用语音留言 */
    messageSoundFlag?: TYesNoFlagValue;
    /** 心理咨询身份认证 */
    mhcFlag?: TYesNoFlagValue;
    /** 刷脸记录人员信息 */
    addPunchFace?: TYesNoFlagValue;
    /** 禁拨时间段 */
    forbidCallTimes?: string;
    /** sip用户名 */
    sipUserName?: string;
    /** sip密码 */
    sipPassword?: string;
    /** sip服务地址 */
    sipDomain?: string;
    /** Sip协议类型 */
    sipTransportType?: TSipTypeValue;
    /** 设备密码 */
    password?: string;
    /** 扩展配置 */
    extraConfig?: IDeviceDialExtraConfig;
  }

  /** 添加公话配置 - 响应 data */
  export interface ResPostDeviceDialConfigApi {
    /** 配置ID */
    id: number;
    /** 学校ID */
    schoolId: number;
  }

  /** 修改公话配置 - 请求参数 */
  export interface ReqPutDeviceDialConfigApi {
    /** 心跳时间（ms） */
    heartbeatFrequency?: number;
    /** 单次通话限定时长（分钟） */
    callTime?: number;
    /** 定时开机时间 */
    powerOnTime?: string;
    /** 定时关机时间 */
    powerOffTime?: string;
    /** 禁拨号码 */
    forbidPhone?: string;
    /** 拨号类型（已废弃） */
    phoneType?: TPhoneTypeValue;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[];
    /** 是否显示留言按钮 */
    messageFlag?: TYesNoFlagValue;
    /** 是否全量同步人脸 */
    downloadUserFlag?: TYesNoFlagValue;
    /** 是否启用语音留言 */
    messageSoundFlag?: TYesNoFlagValue;
    /** 心理咨询身份认证 */
    mhcFlag?: TYesNoFlagValue;
    /** 刷脸记录人员信息 */
    addPunchFace?: TYesNoFlagValue;
    /** 禁拨时间段 */
    forbidCallTimes?: string;
    /** sip用户名 */
    sipUserName?: string;
    /** sip密码 */
    sipPassword?: string;
    /** sip服务地址 */
    sipDomain?: string;
    /** Sip协议类型 */
    sipTransportType?: TSipTypeValue;
    /** 设备密码 */
    password?: string;
    /** 扩展配置 */
    extraConfig?: IDeviceDialExtraConfig;
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
    status: TEnableStatusValue;
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
    status?: TEnableStatusValue;
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
    status?: TEnableStatusValue;
  }
}

// 设备管理模块
export namespace Device {
  /** 设备标签信息 */
  export interface IDeviceTagItemVo {
    /** 标签ID */
    id: number;
    /** 标签名称 */
    name: string;
    /** 标签描述 */
    description: string;
    /** 排序值 */
    sort: number;
  }

  /** 设备列表项 */
  export interface IDeviceItemVo {
    /** 设备ID */
    id: number;
    /** 设备名称 */
    name: string;
    /** 设备SN号 */
    terminalSn: string;
    /** 设备Mac地址 */
    terminalMac: string;
    /** 设备类型 */
    terminalType: string;
    /** 设备终端Key */
    terminalKey: string;
    /** 设备位置 */
    location: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 设备组ID */
    deviceGroupId: number | null;
    /** 设备组名称 */
    deviceGroupName: string;
    /** 设备状态：0-离线，1-在线 */
    status: TDeviceStatusValue;
    /** 定时开机时间 */
    powerOnTime: string | null;
    /** 定时关机时间 */
    powerOffTime: string | null;
    /** 心跳频率（毫秒） */
    heartbeatFrequency: number | null;
    /** 单次通话限定时长（分钟） */
    callTime: number | null;
    /** 禁拨号码 */
    forbidPhone: string | null;
    /** 拨号类型（已废弃） */
    phoneType: TPhoneTypeValue | null;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue | null;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[] | null;
    /** 禁拨时间段 */
    forbidCallTimes: string | null;
    /** 是否显示留言按钮 */
    messageFlag: TYesNoFlagValue | null;
    /** 是否全量同步人脸 */
    downloadUserFlag: TYesNoFlagValue | null;
    /** 是否开启语音留言 */
    messageSoundFlag: TYesNoFlagValue | null;
    /** 心理咨询是否开启身份认证 */
    mhcFlag: TYesNoFlagValue | null;
    /** 刷脸时是否记录人员信息 */
    addPunchFace: TYesNoFlagValue | null;
    /** 预警通话时长（分钟） */
    warnCallTime: number | null;
    /** 计费模式 */
    billMode: TDeviceBillModeValue | null;
    /** SIP 用户名 */
    sipUserName?: string | null;
    /** SIP 密码 */
    sipPassword?: string | null;
    /** SIP 服务地址 */
    sipDomain?: string | null;
    /** SIP 协议类型 */
    sipTransportType?: TSipTypeValue | null;
    /** 扩展配置 */
    extraConfig?: Record<string, any> | null;
    /** 标签列表 */
    tags: IDeviceTagItemVo[];
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取设备列表 - 查询参数 */
  export interface ReqGetDevicesApi {
    /** 设备名称（模糊查询） */
    name?: string;
    /** 设备SN号 */
    terminalSn?: string;
    /** 学校ID（全部传-1） */
    schoolId?: number | -1;
    /** 设备组ID（全部传-1） */
    deviceGroupId?: number | -1;
    /** 状态 0:离线 1:在线 -1:全部 */
    status?: TDeviceStatusValue | -1;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 获取设备列表 - 响应 data */
  export interface ResGetDevicesApi {
    /** 设备列表 */
    list: IDeviceItemVo[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取设备详情 - 响应 data */
  export type ResGetDeviceDetailApi = IDeviceItemVo;

  /** 新增设备 - 请求参数 */
  export interface ReqPostDeviceApi {
    /** 设备名称 */
    name: string;
    /** 终端KEY */
    terminalKey: string;
    /** 设备SN号 */
    terminalSn: string;
    /** 设备MAC地址 */
    terminalMac: string;
    /** 设备位置 */
    location?: string;
    /** 设备组ID，不填传-1 */
    deviceGroupId?: number | -1;
    /** 定时开机时间，格式：HH:MM */
    powerOnTime?: string;
    /** 定时关机时间，格式：HH:MM */
    powerOffTime?: string;
    /** 心跳频率(毫秒) */
    heartbeatFrequency?: number;
    /** 单次通话限定时长(分钟) */
    callTime?: number;
    /** 禁拨号码 */
    forbidPhone?: string;
    /** 拨号类型（已废弃） */
    phoneType?: TPhoneTypeValue;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[];
    /** 禁拨时间段 */
    forbidCallTimes?: string;
    /** 是否显示留言按钮：Y/N */
    messageFlag?: TYesNoFlagValue;
    /** 是否全量同步人脸：Y/N */
    downloadUserFlag?: TYesNoFlagValue;
    /** 是否开启语音留言：Y/N */
    messageSoundFlag?: TYesNoFlagValue;
    /** 心理咨询是否开启身份认证：Y/N */
    mhcFlag?: TYesNoFlagValue;
    /** 刷脸时是否记录人员信息：Y/N */
    addPunchFace?: TYesNoFlagValue;
    /** 预警通话时长 */
    warnCallTime?: number;
    /** 计费模式 */
    billMode?: TDeviceBillModeValue;
    /** 学校ID */
    schoolId: number;
    /** Sip用户名 */
    sipUserName?: string;
    /** Sip密码 */
    sipPassword?: string;
    /** Sip服务地址 */
    sipDomain?: string;
    /** Sip协议类型 */
    sipTransportType?: TSipTypeValue;
    /** 扩展配置 */
    extraConfig?: Record<string, any>;
  }

  /** 新增设备失败项 */
  export interface IDeviceCreateFailureVo {
    /** 行号 */
    rowIndex: number;
    /** 设备名称 */
    deviceName: string;
    /** 设备SN号 */
    terminalSn: string;
    /** 失败原因 */
    reason: string;
  }

  /** 新增设备 - 响应 data */
  export interface ResPostDeviceApi {
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failCount: number;
    /** 失败列表 */
    failures: IDeviceCreateFailureVo[];
    /** 失败文件下载地址 */
    failureFileUrl?: string;
    /** 失败文件名称 */
    failureFileName?: string;
  }

  /** 更新设备 - 请求参数 */
  export interface ReqPutDeviceApi {
    /** 学校ID */
    schoolId?: number;
    /** 设备名称 */
    name?: string;
    /** 终端KEY */
    terminalKey?: string;
    /** 设备Mac地址 */
    terminalMac?: string;
    /** 设备位置 */
    location?: string;
    /** 设备组ID */
    deviceGroupId?: number | -1;
    /** 定时开机时间 */
    powerOnTime?: string;
    /** 定时关机时间 */
    powerOffTime?: string;
    /** 心跳频率(毫秒) */
    heartbeatFrequency?: number;
    /** 单次通话限定时长(分钟) */
    callTime?: number;
    /** 禁拨号码 */
    forbidPhone?: string;
    /** 拨号类型（已废弃） */
    phoneType?: TPhoneTypeValue;
    /** 拨号模式：family-亲情号模式，free-自由拨号模式 */
    dialMode?: TDialModeValue;
    /** 拨号入口集合：video/sim/sip */
    phoneTypes?: TPhoneEntryValue[];
    /** 禁拨时间段 */
    forbidCallTimes?: string;
    /** 是否显示留言按钮：Y/N */
    messageFlag?: TYesNoFlagValue;
    /** 是否全量同步人脸：Y/N */
    downloadUserFlag?: TYesNoFlagValue;
    /** 是否开启语音留言：Y/N */
    messageSoundFlag?: TYesNoFlagValue;
    /** 心理咨询是否开启身份认证：Y/N */
    mhcFlag?: TYesNoFlagValue;
    /** 刷脸时是否记录人员信息：Y/N */
    addPunchFace?: TYesNoFlagValue;
    /** 预警通话时长 */
    warnCallTime?: number;
    /** 计费模式 */
    billMode?: TDeviceBillModeValue;
    /** Sip用户名 */
    sipUserName?: string;
    /** Sip密码 */
    sipPassword?: string;
    /** Sip服务地址 */
    sipDomain?: string;
    /** Sip协议类型 */
    sipTransportType?: TSipTypeValue;
    /** 设备密码 */
    password?: string;
    /** 扩展配置 */
    extraConfig?: Record<string, any>;
  }

  /** 更新设备 - 响应 data */
  export interface ResPutDeviceApi {
    /** 响应消息 */
    message: string;
  }

  /** 更换设备学校 - 请求参数 */
  export interface ReqPostDeviceChangeSchoolApi {
    /** 学校ID，null 表示解绑学校 */
    schoolId?: number | null;
    /** 设备组ID，schoolId 有值时必填 */
    deviceGroupId?: number | null;
  }

  /** 更换设备学校 - 响应 data */
  export interface ResPostDeviceChangeSchoolApi {
    /** 响应消息 */
    message: string;
  }

  /** 批量控制设备 - 请求参数 */
  export interface ReqPostDeviceBatchControlApi {
    /** 设备ID列表 */
    deviceIds: number[];
    /** 操作 */
    action: TDeviceTagControlActionValue;
  }

  /** 批量控制设备 - 响应 data */
  export interface ResPostDeviceBatchControlApi {
    /** 响应消息 */
    message: string;
  }

  /** 设备列表导出 - 请求参数 */
  export interface ReqPostDeviceExportApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 设备名称 */
    name?: string;
    /** 设备SN号 */
    terminalSn?: string;
    /** 学校ID */
    schoolId?: number;
    /** 设备组ID */
    deviceGroupId?: number;
    /** 状态 0-离线 1-在线 */
    status?: TDeviceStatusValue;
  }

  /** 设备列表导出 - 响应 data */
  export interface ResPostDeviceExportApi {
    /** 设备列表 */
    list: IDeviceItemVo[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 下载设备导入模板 - 请求参数 */
  export interface ReqGetDeviceTemplateApi {
    /** 学校ID */
    schoolId?: number;
  }

  /** 设备导入 - 请求参数 */
  export interface ReqPostDeviceImportApi {
    /** 学校ID */
    schoolId: string;
    /** 导入文件 */
    file: File;
  }

  /** 设备导入失败项 */
  export interface IDeviceImportFailureVo {
    /** 行号 */
    rowIndex: number;
    /** 终端序列号 */
    terminalSn?: string;
    /** 设备序列号 */
    deviceSn?: string;
    /** 名称 */
    name?: string;
    /** 失败原因 */
    reason: string;
  }

  /** 设备导入 - 响应 data */
  export interface ResPostDeviceImportApi {
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failCount: number;
    /** 失败详情 */
    failures: IDeviceImportFailureVo[];
    /** 失败文件下载地址 */
    failureFileUrl?: string;
    /** 失败文件名称 */
    failureFileName?: string;
  }

  /** 批量更新字段项 */
  export interface IDeviceBatchUpdateFieldVo {
    /** 配置key */
    key: string;
    /** 显示名称 */
    name: string;
    /** 字段类型 */
    type: string;
    /** 分类 */
    category: string;
    /** 是否必填 */
    required: boolean;
    /** 枚举选项 */
    enumOptions?: string[];
  }

  /** 批量更新字段分类 */
  export interface IDeviceBatchUpdateCategoryVo {
    /** 分类key */
    key: string;
    /** 分类名称 */
    name: string;
  }

  /** 批量更新字段列表 - 响应 data */
  export interface ResGetDeviceBatchUpdateFieldsApi {
    /** 字段列表 */
    fields: IDeviceBatchUpdateFieldVo[];
    /** 分类列表 */
    categories: IDeviceBatchUpdateCategoryVo[];
  }

  /** 下载批量更新模板 - 请求参数 */
  export interface ReqPostDeviceBatchUpdateTemplateApi {
    /** 选择的字段key列表 */
    fields: string[];
    /** 学校ID */
    schoolId?: number;
    /** 是否包含现有数据 */
    includeExistingData?: boolean;
  }

  /** 批量更新失败项 */
  export interface IDeviceBatchUpdateFailureVo {
    /** 行号 */
    row: number;
    /** 设备SN */
    terminalSn: string;
    /** 字段key */
    field: string;
    /** 字段名称 */
    fieldName: string;
    /** 字段值 */
    value: string;
    /** 错误原因 */
    error: string;
    /** 修正建议 */
    suggestion: string;
  }

  /** 批量更新设备配置 - 响应 data */
  export interface ResPostDeviceBatchUpdateApi {
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failedCount: number;
    /** 失败列表 */
    failures: IDeviceBatchUpdateFailureVo[];
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

// 设备人脸库模块
export namespace DeviceFace {
  /** 设备人脸同步状态项 */
  export interface IDeviceFaceStateItem {
    /** 状态ID */
    id: number;
    /** 设备ID */
    deviceId: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentNo: string;
    /** 同步状态 */
    status: TDeviceFaceSyncStatusValue | null;
    /** 期望动作 */
    desiredAction: TDeviceFaceDesiredActionValue;
    /** 期望版本 */
    desiredVersion: number;
    /** 已同步版本 */
    syncedVersion: number;
    /** 失败原因码 */
    lastErrorCode?: TDeviceFaceErrorCodeValue | string;
    /** 失败原因描述 */
    lastErrorMsg?: string;
    /** 最后同步时间 */
    lastSyncedAt?: string;
  }

  /** 设备人脸库统计 */
  export interface IDeviceFaceStateStats {
    /** 总学生数 */
    total: number;
    /** 已同步数量 */
    synced: number;
    /** 待处理数量 */
    pending: number;
    /** 失败数量 */
    failed: number;
    /** 未建档数量 */
    unrecorded: number;
  }

  /** 获取设备人脸库 - 请求参数 */
  export interface ReqGetDeviceFaceStatesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 同步状态 */
    status?: TDeviceFaceSyncStatusValue;
    /** 学生姓名（模糊查询） */
    studentName?: string;
    /** 学号（模糊查询） */
    studentNo?: string;
  }

  /** 获取设备人脸库 - 响应 data */
  export interface ResGetDeviceFaceStatesApi {
    /** 列表 */
    list: IDeviceFaceStateItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 统计信息 */
    stats?: IDeviceFaceStateStats;
  }

  /** 批量触发全量同步 - 请求参数 */
  export interface ReqPostFaceSyncBatchApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 标签ID */
    tagId?: number;
  }

  /** 批量触发对账 - 请求参数 */
  export interface ReqPostFaceSyncReconcileApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 标签ID */
    tagId?: number;
  }

  /** 批量重试 - 请求参数 */
  export interface ReqPostFaceSyncRetryApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 学生ID列表 */
    studentIds?: number[];
  }

  /** 同步相关操作 - 响应 data */
  export interface ResPostFaceSyncActionApi {
    /** 响应消息 */
    message: string;
  }
}
