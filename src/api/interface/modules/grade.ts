import type { TGradeConfigTypeValue, TGradePackageTypeValue, TGradeServiceTypeValue } from "@/config/modules/grade";
import type { TGradeGraduationStatusValue } from "@/config/modules/grade";
import type { TDeviceTypeValue } from "@/config/modules/device/type";

// 年级模块
export namespace Grade {
  /** 年级列表项 */
  export interface IGradeItemVo {
    /** 年级ID */
    id: number;
    /** 年级编码 */
    code: string;
    /** 年级名称 */
    name: string;
    /** 入学年份 */
    enrollYear: number;
    /** 所属学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId: number;
    /** 年级描述 */
    description: string;
    /** 学生数量 */
    studentCount: number;
    /** 班级数量 */
    classCount: number;
    /** 状态：0-禁用，1-启用 */
    status: number;
    /** 是否毕业 */
    isGraduated: TGradeGraduationStatusValue;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取年级列表 - 查询参数 */
  export interface ReqGetGradesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 年级名称（模糊搜索） */
    name?: string;
    /** 学校ID，-1表示全部 */
    schoolId?: number;
    /** 入学年份，-1表示全部 */
    enrollYear?: number;
    /** 状态：0-禁用，1-启用，-1表示全部 */
    status?: number;
    /** 是否毕业 */
    isGraduated?: TGradeGraduationStatusValue;
  }

  /** 获取年级列表 - 响应 data */
  export interface ResGetGradesApi {
    /** 年级列表 */
    list: IGradeItemVo[];
    /** 总数量 */
    total: number;
  }

  /** 获取年级详情 - 响应 data */
  export type ResGetGradeDetailApi = IGradeItemVo;

  /** 新增年级 - 请求参数 */
  export interface ReqPostGradeApi {
    /** 年级名称 */
    name: string;
    /** 入学年份 */
    enrollYear: number;
    /** 所属学校ID */
    schoolId: number;
    /** 年级描述 */
    description?: string;
    /** 是否毕业 */
    isGraduated: TGradeGraduationStatusValue;
  }

  /** 更新年级 - 请求参数 */
  export interface ReqPutUpdateGradeApi {
    /** 年级名称 */
    name: string;
    /** 入学年份 */
    enrollYear: number;
    /** 所属学校ID */
    schoolId?: number;
    /** 年级描述 */
    description?: string;
    /** 是否毕业 */
    isGraduated: TGradeGraduationStatusValue;
  }

  /** 导出年级 - 请求参数 */
  export interface ReqPostGradeExportApi {
    /** 学校ID */
    schoolId: number;
    /** 年级名称（模糊搜索） */
    name?: string;
    /** 入学年份，-1表示全部 */
    enrollYear?: number;
  }

  /** 年级简要信息 */
  export interface IGradeInfoVo {
    /** 年级ID */
    id: number;
    /** 年级名称 */
    name: string;
  }

  /** 获取未配置的年级列表 - 查询参数 */
  export interface ReqGetUnconfiguredGradesApi {
    /** 学校ID */
    schoolId: number;
    /** 配置类型 */
    configType: TGradeConfigTypeValue;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 套餐类型（查询套餐配置时必填） */
    packageType?: TGradePackageTypeValue;
    /** 服务类型（查询费率配置时必填） */
    serviceType?: TGradeServiceTypeValue;
    /** 页码 */
    page?: number;
    /** 每页大小 */
    pageSize?: number;
  }

  /** 获取未配置的年级列表 - 响应 data */
  export interface ResGetUnconfiguredGradesApi {
    /** 学校ID */
    schoolId: number;
    /** 配置类型 */
    configType: TGradeConfigTypeValue;
    /** 未配置的年级列表 */
    grades: IGradeInfoVo[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页大小 */
    pageSize: number;
  }
}
