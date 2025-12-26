import type { TDeviceTypeValue } from "@/config/modules/device";

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
}
