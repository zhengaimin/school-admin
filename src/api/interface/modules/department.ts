// 级部模块
export namespace Department {
  /** 级部列表项 */
  export interface IDepartmentItemVo {
    /** 级部ID */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 年级ID */
    gradeId: number;
    /** 年级名称 */
    gradeName: string;
    /** 级部名称 */
    name: string;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 获取级部列表 - 查询参数 */
  export interface ReqGetDepartmentsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 学校ID */
    schoolId?: number;
    /** 年级ID */
    gradeId?: number;
    /** 级部名称 */
    name?: string;
  }

  /** 获取级部列表 - 响应 data */
  export interface ResGetDepartmentsApi {
    /** 级部列表 */
    list: IDepartmentItemVo[];
    /** 总数量 */
    total: number;
  }
}
