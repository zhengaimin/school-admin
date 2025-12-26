// 班级模块
export namespace Class {
  /** 班级列表项 */
  export interface IClassItemVo {
    /** 班级ID */
    id: number;
    /** 班级编码 */
    code: string;
    /** 班级名称 */
    name: string;
    /** 年级ID */
    gradeId: number;
    /** 年级名称 */
    gradeName: string;
    /** 级部ID */
    departmentId?: number;
    /** 级部名称 */
    departmentName?: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName: string;
    /** 描述 */
    description: string;
    /** 状态 */
    status: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取班级列表 - 查询参数 */
  export interface ReqGetClassesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 班级名称（模糊搜索） */
    name?: string;
    /** 年级ID筛选 */
    gradeId?: number;
    /** 学校ID筛选 */
    schoolId?: number;
    /** 状态筛选 */
    status?: number;
    /** 级部ID筛选 */
    departmentId?: number;
  }

  /** 获取班级列表 - 响应 data */
  export interface ResGetClassesApi {
    /** 班级列表 */
    list: IClassItemVo[];
    /** 总数量 */
    total: number;
  }
}
