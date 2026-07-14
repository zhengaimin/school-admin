import type { TEnableStatusValue } from "@/config/modules";

export namespace DeviceGroup {
  /** 设备组列表项 */
  export interface IDeviceGroupItemVo {
    /** 设备组ID */
    id: number;
    /** 设备组编码 */
    code: string;
    /** 设备组名称 */
    name: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName: string;
    /** 当前设备数量 */
    currentDeviceCount: number;
    /** 设备最大数量 */
    maxDeviceCount: number;
    /** 是否语音组 */
    isVoipGroup: boolean;
    /** 省份ID */
    provinceId?: number | null;
    /** 省份名称 */
    provinceName: string;
    /** 城市ID */
    cityId?: number | null;
    /** 城市名称 */
    cityName: string;
    /** 位置展示 */
    locationDisplay: string;
    /** 状态 */
    status: TEnableStatusValue;
    /** 状态名称 */
    statusName: string;
    /** 描述 */
    description: string;
    /** 排序 */
    sort: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 设备组列表 - 请求参数 */
  export interface ReqGetDeviceGroupListApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 学校ID（-1表示全部） */
    schoolId?: number | -1;
    /** 设备组名称 */
    name?: string;
    /** 状态（-1表示全部） */
    status?: TEnableStatusValue | -1;
    /** 省份ID（-1表示全部） */
    provinceId?: number | -1;
    /** 城市ID（-1表示全部） */
    cityId?: number | -1;
  }

  /** 设备组列表 - 响应 data */
  export interface ResGetDeviceGroupListApi {
    /** 列表 */
    list: IDeviceGroupItemVo[];
    /** 总数 */
    total: number;
  }
}
