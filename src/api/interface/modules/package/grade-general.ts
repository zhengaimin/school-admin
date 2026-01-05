import type { TDeviceTypeValue } from "@/config/modules/device";
import type { TPackageStatusValue } from "@/config/modules/package";
import type { GradePackage } from "./grade-fixed";

/** 年级通用套餐配置模块 */
export namespace GradeGeneralPackage {
  /** 获取年级通用套餐配置列表 - 请求参数 */
  export interface ReqGetGradeGeneralPackagesApi {
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

  /** 获取年级通用套餐配置列表 - 响应 data */
  export interface ResGetGradeGeneralPackagesApi {
    /** 套餐配置列表 */
    list: GradePackage.IGradePackageConfigVo[];
    /** 总数 */
    total: number;
  }

  /** 创建年级通用套餐配置 - 请求参数 */
  export interface ReqPostGradeGeneralPackageApi {
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
    packageContent?: GradePackage.IPackageContent;
    /** 模板说明 */
    templateDescription?: string;
    /** 使用规则 */
    usageRules?: string;
    /** 是否支持首月比例扣款 */
    firstMonthRatio?: boolean;
  }

  /** 更新年级通用套餐配置 - 请求参数 */
  export interface ReqPutGradeGeneralPackageApi {
    /** 基础价格 */
    basePrice: number;
    /** 套餐总月数 */
    totalMonths: number;
    /** 状态：0-禁用，1-启用 */
    status: TPackageStatusValue;
    /** 绑定的年级ID列表 */
    gradeIds?: number[];
    /** 套餐内容 */
    packageContent?: GradePackage.IPackageContent;
    /** 模板说明 */
    templateDescription?: string;
    /** 使用规则 */
    usageRules?: string;
    /** 是否支持首月比例扣款 */
    firstMonthRatio?: boolean;
  }
}
