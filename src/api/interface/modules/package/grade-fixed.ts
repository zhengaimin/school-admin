import type { TDeviceTypeValue } from "@/config/modules/device";
import type { TPackageTypeValue, TPackageStatusValue } from "@/config/modules/package";

/** 年级套餐配置模块 */
export namespace GradePackage {
  /** 套餐配置列表项 */
  export interface IGradePackageConfigVo {
    /** 配置ID */
    id: number;
    /** 学校ID */
    schoolId: number;
    /** 年级ID */
    gradeId: number;
    /** 套餐模板ID */
    packageTemplateId: number;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 套餐类型 */
    packageType: TPackageTypeValue;
    /** 状态：0-禁用，1-启用 */
    status: TPackageStatusValue;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 学校名称 */
    schoolName: string;
    /** 年级名称 */
    gradeName: string;
    /** 模板编码 */
    templateCode: string;
    /** 基础价格 */
    basePrice: number;
    /** 套餐总月数 */
    totalMonths: number;
    /** 模板说明 */
    templateDescription: string;
    /** 使用规则 */
    usageRules: string;
    /** 套餐内容 */
    packageContent: Record<string, unknown>;
    /** 是否支持首月比例扣款（仅通用套餐） */
    firstMonthRatio: boolean;
    /** 是否按月递减计费（仅固定套餐） */
    monthlyDecrease: boolean;
    /** 固定套餐开始时间（仅固定套餐） */
    startTime: string;
    /** 固定套餐结束时间（仅固定套餐） */
    endTime: string;
  }

  /** 获取年级固定套餐配置列表 - 请求参数 */
  export interface ReqGetGradeFixedPackagesApi {
    /** 学校ID */
    schoolId: number;
    /** 年级ID（可选） */
    gradeId?: number;
    /** 设备类型（可选） */
    deviceType?: TDeviceTypeValue;
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 套餐内容 */
  export interface IPackageContent {
    /** 视频通话分钟数（VIDEO设备类型） */
    videoCallMinutes?: number;
    /** 留言条数（VIDEO设备类型） */
    messageCount?: number;
    /** 吹风机使用分钟数（DRYER设备类型） */
    dryerMinutes?: number;
  }

  /** 创建年级固定套餐配置 - 请求参数 */
  export interface ReqPostGradeFixedPackageApi {
    /** 学校ID */
    schoolId: number;
    /** 年级ID列表 */
    gradeIds: number[];
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 基础价格 */
    basePrice: number;
    /** 套餐总月数 */
    totalMonths: number;
    /** 套餐内容 */
    packageContent?: IPackageContent;
    /** 模板说明 */
    templateDescription?: string;
    /** 使用规则 */
    usageRules?: string;
    /** 是否按月递减计费 */
    monthlyDecrease?: boolean;
    /** 固定套餐开始时间（格式：YYYY-MM-DD） */
    startTime?: string;
    /** 固定套餐结束时间（格式：YYYY-MM-DD） */
    endTime?: string;
  }

  /** 获取年级固定套餐配置列表 - 响应 data */
  export interface ResGetGradeFixedPackagesApi {
    /** 套餐配置列表 */
    list: IGradePackageConfigVo[];
    /** 总数 */
    total: number;
  }

  /** 更新年级固定套餐配置 - 请求参数 */
  export interface ReqPutGradeFixedPackageApi {
    /** 基础价格 */
    basePrice: number;
    /** 套餐总月数 */
    totalMonths: number;
    /** 状态：0-禁用，1-启用 */
    status: TPackageStatusValue;
    /** 绑定的年级ID列表 */
    gradeIds?: number[];
    /** 套餐内容 */
    packageContent?: IPackageContent;
    /** 模板说明 */
    templateDescription?: string;
    /** 使用规则 */
    usageRules?: string;
    /** 是否按月递减计费 */
    monthlyDecrease?: boolean;
    /** 固定套餐开始时间（格式：YYYY-MM-DD） */
    startTime?: string;
    /** 固定套餐结束时间（格式：YYYY-MM-DD） */
    endTime?: string;
  }
}
