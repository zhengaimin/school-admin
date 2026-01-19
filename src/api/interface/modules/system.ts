import type { TEnableStatusValue, TOrgDepartmentStatusValue, TTenantTypeValue } from "@/config/modules";

export namespace System {
  export type TRoleType = "admin" | "api";
  export type TRoleLevel = "super" | "platform" | "agent" | "custom";

  /** 角色信息 */
  export interface Role {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: number;
    createdAt?: string;
    roleType?: TRoleType;
    roleLevel?: TRoleLevel;
    tenantId?: number;
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

  /** 角色创建参数 */
  export interface ReqRoleCreate {
    name: string;
    description?: string;
    roleType: TRoleType;
    tenantId: number;
    roleLevel?: TRoleLevel;
    permissionIds?: number[];
  }

  /** 角色创建响应 */
  export interface ResRoleCreate {
    id: number;
    code: string;
    name: string;
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
    email?: string;
    roleId: number;
    roleName?: string;
    tenantId?: number;
    orgDepartmentId?: number | null;
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
    email?: string;
    roleId: number;
    tenantId: number;
    orgDepartmentId?: number | null;
    status?: number;
  }

  /** 创建用户响应 */
  export interface ResUserCreate {
    id: number;
    username: string;
    realName: string;
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
    status: TOrgDepartmentStatusValue;
    createdAt: string;
    updatedAt: string;
  }

  /** 部门列表请求参数 */
  export interface ReqOrgDepartmentList {
    page?: number;
    pageSize?: number;
    tenantId?: number;
    parentId?: number;
    status?: TOrgDepartmentStatusValue;
    name?: string;
  }

  /** 部门创建参数 */
  export interface ReqOrgDepartmentCreate {
    tenantId?: number;
    parentId?: number | null;
    name: string;
    code: string;
    leaderId?: number | null;
    sort?: number;
    status?: TOrgDepartmentStatusValue;
  }

  /** 租户信息 */
  export interface Tenant {
    id: number;
    code: string;
    name: string;
    type: TTenantTypeValue;
    parentId: number;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    status: TEnableStatusValue;
    createdAt: string;
    updatedAt: string;
  }

  /** 租户列表请求参数 */
  export interface ReqTenantList {
    page?: number;
    pageSize?: number;
    name?: string;
    code?: string;
    type?: TTenantTypeValue;
    status?: TEnableStatusValue;
    parentId?: number;
  }

  /** 新增租户请求参数 */
  export interface ReqTenantCreate {
    name: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    address?: string;
    status: TEnableStatusValue;
  }

  /** 新增租户响应 */
  export interface ResTenantCreate {
    id: number;
    code: string;
    name: string;
  }

  /** 修改租户请求参数 */
  export interface ReqTenantUpdate {
    name: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    address?: string;
    status: TEnableStatusValue;
  }

  /** 修改租户响应 */
  export interface ResTenantUpdate {
    message: string;
  }
}
