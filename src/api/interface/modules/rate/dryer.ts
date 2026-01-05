import type { TDeviceTypeValue } from "@/config/modules/device";

// 吹风机费率配置模块
export namespace RateDryer {
  /** 服务类型 */
  export type ServiceType = "CALL" | "MESSAGE" | "DRYER";

  /** 费率单位 */
  export type RateUnit = "MINUTE" | "ITEM";

  /** 费率模板 */
  export interface IRateTemplateVo {
    /** 模板ID */
    id: number;
    /** 模板编码 */
    templateCode: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 服务类型 */
    serviceType: ServiceType;
    /** 费率值 */
    rate: number;
    /** 费率单位 */
    rateUnit: RateUnit;
    /** 是否为默认模板 */
    isDefault: boolean;
    /** 模板说明 */
    templateDescription: string;
    /** 状态（0-禁用，1-启用） */
    status: 0 | 1;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取学校吹风机费率 - 响应 data */
  export type ResGetSchoolDryerRateApi = IRateTemplateVo;

  /** 设置学校吹风机费率 - 请求参数 */
  export interface ReqSetSchoolDryerRateApi {
    /** 费率值（元/分钟） */
    rate: number;
    /** 模板说明 */
    templateDescription?: string;
    /** 状态（0-禁用，1-启用） */
    status: 0 | 1;
  }

  /** 绑定的年级信息 */
  export interface IBoundGradeVo {
    gradeId: number;
    gradeName: string;
  }

  /** 年级费率配置项 */
  export interface IGradeDryerRateItemVo {
    /** 配置ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 模板名称 */
    templateName: string;
    /** 模板编码 */
    templateCode: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 服务类型 */
    serviceType: ServiceType;
    /** 费率值 */
    rate: number;
    /** 费率模板ID */
    rateTemplateID: number;
    /** 费率单位 */
    rateUnit: RateUnit;
    /** 费率描述 */
    description: string;
    /** 是否为默认模板 */
    isDefault: boolean;
    /** 状态（0-禁用，1-启用） */
    status: 0 | 1;
    /** 绑定的年级列表 */
    boundGrades: IBoundGradeVo[];
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取年级费率配置列表 - 查询参数 */
  export interface ReqGetGradeDryerRatesApi {
    /** 学校ID，-1表示查询所有学校 */
    schoolId: number;
    /** 年级ID，-1表示查询所有年级 */
    gradeId?: number;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 获取年级费率配置详情 - 响应 data */
  export type ResGetGradeDryerRateDetailApi = IGradeDryerRateItemVo;

  /** 获取年级费率配置列表 - 响应 data */
  export interface ResGetGradeDryerRatesApi {
    /** 配置列表 */
    list: IGradeDryerRateItemVo[];
    /** 总数量 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页大小 */
    pageSize: number;
  }

  /** 创建年级吹风机费率配置 - 请求参数 */
  export interface ReqCreateGradeDryerRatesApi {
    /** 学校ID */
    schoolId: number;
    /** 年级ID列表 */
    gradeIds: number[];
    /** 费率值（0 ~ 999999.9999） */
    rate: number;
    /** 费率描述 */
    description: string;
  }

  /** 更新年级吹风机费率配置 - 请求参数 */
  export interface ReqUpdateGradeDryerRateApi {
    /** 费率值（0 ~ 999999.9999） */
    rate?: number;
    /** 费率描述 */
    description?: string;
    /** 绑定的年级ID列表 */
    gradeIds?: number[];
  }
}
