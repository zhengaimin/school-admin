export namespace System {
  /** 角色信息 */
  export interface Role {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: number;
    createdAt?: string;
  }

  /** 角色列表请求参数 */
  export interface ReqRoleList {
    page?: number;
    pageSize?: number;
    name?: string;
  }

  /** 角色保存参数 */
  export interface ReqRoleSave {
    id?: number;
    name: string;
    description?: string;
  }

  /** 权限项 */
  export interface Permission {
    id: number;
    code: string;
    action: string;
    name: string;
  }

  /** 权限模块 */
  export interface PermissionModule {
    moduleKey: string;
    moduleName: string;
    description?: string;
    permissions: Permission[];
  }

  /** 权限模块列表响应 */
  export interface PermissionModulesResp {
    modules: PermissionModule[];
  }

  /** 角色权限保存参数 */
  export interface ReqRolePermissionSave {
    permissionIds: number[];
  }

  /** 后台用户信息 */
  export interface AdminUser {
    id: number;
    username: string;
    realName: string;
    phone?: string;
    roleId: number;
    roleName?: string;
    tenantId?: number;
    status: number;
    createdAt?: string;
  }

  /** 用户列表请求参数 */
  export interface ReqUserList {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
  }

  /** 用户保存参数 */
  export interface ReqUserSave {
    id?: number;
    username: string;
    password?: string;
    realName: string;
    phone?: string;
    roleId: number;
    status?: number;
  }

  /** 可分配学校 */
  export interface AvailableSchool {
    id: number;
    name: string;
  }

  /** 用户数据权限 */
  export interface UserDataScope {
    type: string;
    schoolIds: number[];
    schoolList?: AvailableSchool[];
  }

  /** 用户数据权限保存参数 */
  export interface ReqUserDataScopeSave {
    scopeType: string;
    schoolIds: number[];
  }

  /** 组织架构部门信息 */
  export interface OrgDepartment {
    id: number;
    tenantId: number;
    parentId: number | null;
    name: string;
    code: string;
    leaderId: number | null;
    sort: number;
    status: number;
    createdAt: string;
    updatedAt: string;
  }

  /** 部门列表请求参数 */
  export interface ReqOrgDepartmentList {
    page?: number;
    pageSize?: number;
    tenantId?: number;
    parentId?: number;
    status?: number;
    name?: string;
  }
}
