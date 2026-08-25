/** 平台管理员租户切换模块 */
export namespace TenantSwitch {
  /** 当前租户信息 */
  export interface ICurrentTenantVo {
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName: string;
  }

  /** 进入租户请求 */
  export interface ReqEnterTenantApi {
    /** 目标租户ID */
    tenantId: number;
  }

  /** 可进入租户项 */
  export interface IAvailableTenantVo {
    /** 租户ID */
    id: number;
    /** 租户名称 */
    name: string;
  }
}
