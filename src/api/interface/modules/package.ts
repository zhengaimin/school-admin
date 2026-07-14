import type { TDeviceTypeValue } from "@/config/modules/device";
import type { TPackageTypeValue, TPackageStatusValue, TPackageRecordStatusValue } from "@/config/modules/package";

/** 年级信息 */
export interface IGradeInfo {
  id: number;
  name: string;
}

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

  /** 获取固定套餐模板详情 - 响应 data */
  export interface ResGetGradeFixedPackageDetailApi {
    id: number;
    templateCode: string;
    deviceType: TDeviceTypeValue;
    packageType: TPackageTypeValue;
    packageContent: Record<string, unknown>;
    basePrice: number;
    totalMonths: number;
    templateDescription: string;
    usageRules: string;
    status: TPackageStatusValue;
    createdAt: string;
    updatedAt: string;
    boundGrades: IGradeInfo[];
    firstMonthRatio: boolean;
    monthlyDecrease: boolean;
    startTime: string;
    endTime: string;
  }
}

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

/** 套餐购买记录模块 */
export namespace PackageRecord {
  /** 套餐购买记录列表项 */
  export interface IPackageRecordItem {
    /** 记录ID */
    id: number;
    /** 学校名称 */
    schoolName: string;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 购买人姓名 */
    purchaserName: string;
    /** 套餐类型 */
    packageType: TPackageTypeValue;
    /** 购买价格 */
    purchasePrice: number;
    /** 订单号 */
    orderNo: string;
    /** 套餐状态 */
    status: TPackageRecordStatusValue;
    /** 状态文本 */
    statusText: string;
    /** 支付时间 */
    paymentTime: string | null;
    /** 创建时间 */
    createdAt: string;
  }

  /** 套餐购买记录完整项（详情用） */
  export interface IPackageRecordFullItem {
    /** 记录ID */
    id: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 学校名称 */
    schoolName: string;
    /** 年级名称 */
    gradeName: string;
    /** 班级名称 */
    className: string;
    /** 套餐模板ID */
    packageTemplateId: number;
    /** 套餐名称 */
    packageName: string;
    /** 套餐编码 */
    packageCode: string;
    /** 套餐类型 */
    packageType: TPackageTypeValue;
    /** 购买价格 */
    purchasePrice: number;
    /** 购买时间 */
    purchaseDate: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string;
    /** 套餐状态 */
    status: TPackageRecordStatusValue;
    /** 状态文本 */
    statusText: string;
    /** 关联订单号 */
    orderNo: string;
    /** 支付方式 */
    paymentMethod: string;
    /** 支付时间 */
    paymentTime: string | null;
    /** 创建时间 */
    createdAt: string;
    /** 购买人姓名 */
    purchaserName: string;
    /** 购买人ID */
    purchaserId: number;
  }

  /** 套餐使用统计 */
  export interface IPackageUsageStats {
    /** 总分钟数 */
    totalMinutes: number;
    /** 已使用分钟数 */
    usedMinutes: number;
    /** 剩余分钟数 */
    remainingMinutes: number;
    /** 使用百分比 */
    usagePercentage: number;
  }

  /** 套餐购买记录详情 */
  export interface IPackageRecordDetail extends IPackageRecordFullItem {
    /** 套餐内容 */
    packageContent: Record<string, any>;
    /** 套餐描述 */
    templateDescription: string;
    /** 使用规则 */
    usageRules: string;
    /** 使用统计 */
    usageStats: IPackageUsageStats;
  }

  /** 获取套餐购买记录列表 - 请求参数 */
  export interface ReqGetPackageRecordsApi {
    /** 设备类型 */
    deviceType?: TDeviceTypeValue;
    /** 学生关键词（支持姓名或学号搜索） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 订单号 */
    orderNo?: string;
    /** 套餐状态 */
    status?: TPackageRecordStatusValue;
    /** 套餐类型 */
    packageType?: TPackageTypeValue;
    /** 开始日期 YYYY-MM-DD */
    startDate?: string;
    /** 结束日期 YYYY-MM-DD */
    endDate?: string;
    /** 最小购买价格 */
    minPrice?: number;
    /** 最大购买价格 */
    maxPrice?: number;
    /** 学校ID */
    schoolId?: number;
    /** 级部ID，-1表示全部 */
    departmentId?: number;
    /** 年级ID，-1表示全部 */
    gradeId?: number;
    /** 班级ID，-1表示全部 */
    classId?: number;
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取套餐购买记录列表 - 响应 data */
  export interface ResGetPackageRecordsApi {
    /** 套餐购买记录列表 */
    list: IPackageRecordItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 获取导出套餐购买记录信息 - 请求参数 */
  export type ReqGetPackageRecordExportInfoApi = Omit<ReqGetPackageRecordsApi, "page" | "pageSize">;

  /** 获取导出套餐购买记录信息 - 响应 data */
  export interface ResGetPackageRecordExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页数量 */
    pageSize: number;
  }
}
