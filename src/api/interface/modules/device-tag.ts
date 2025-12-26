import type { TDeviceTypeValue, TDeviceCommandCodeValue, TDeviceCommandStatusValue } from "@/config/modules/device";

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
