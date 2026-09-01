import type {
  TDataScopeTypeValue,
  TEnableStatusValue,
  TOrgDepartmentStatusValue,
  TRoleLevelValue,
  TRoleTypeValue,
  TTenantTypeValue
} from "@/config/modules";

export namespace System {
  /** 全局配置 */
  export interface GlobalConfig {
    /** 退款当月扣除比例，百分比字符串，范围 0 到 100 */
    refundCurrentMonthPercent: string;
  }

  /** 获取全局配置响应 */
  export type ResGetGlobalConfigApi = GlobalConfig;

  /** 更新全局配置请求参数 */
  export interface ReqPutUpdateGlobalConfigApi {
    /** 退款当月扣除比例，百分比字符串，范围 0 到 100 */
    refundCurrentMonthPercent: string;
  }

  /** 更新全局配置响应 */
  export type ResPutUpdateGlobalConfigApi = string;

  /** 学校配置 */
  export interface SchoolConfig {
    /** 学校 ID */
    schoolId: number;
    /** 套餐是否按年级区分 */
    packageByGrade: boolean;
    /** 小程序是否展示剩余分钟 */
    showRemainingMinutes: boolean;
    /** 学校是否开启退款功能 */
    refundEnabled: boolean;
  }

  /** 获取学校配置响应 */
  export type ResGetSchoolConfigApi = SchoolConfig;

  /** 更新学校配置请求参数 */
  export interface ReqPutUpdateSchoolConfigApi {
    /** 套餐是否按年级区分 */
    packageByGrade?: boolean;
    /** 小程序是否展示剩余分钟 */
    showRemainingMinutes?: boolean;
    /** 学校是否开启退款功能 */
    refundEnabled?: boolean;
  }

  /** 更新学校配置响应 */
  export type ResPutUpdateSchoolConfigApi = string;

  /** 角色信息 */
  export interface Role {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: TEnableStatusValue;
    tenantName?: string;
    createdAt?: string;
    updatedAt?: string;
    roleType?: TRoleTypeValue;
    roleLevel?: TRoleLevelValue;
    tenantId?: number;
    isSystem?: boolean;
  }

  /** 角色详情响应 */
  export interface ResGetRoleDetailApi extends Role {
    permissionIds?: number[];
    permissions?: PermissionInfo[];
  }

  /** 角色列表请求参数 */
  export interface ReqRoleList {
    page?: number;
    pageSize?: number;
    name?: string;
    code?: string;
    roleType?: TRoleTypeValue;
    tenantId?: number;
    status?: TEnableStatusValue;
    includeSystem?: boolean;
    roleLevel?: TRoleLevelValue;
  }

  /** 角色保存参数 */
  export interface ReqRoleSave {
    id?: number;
    name: string;
    description?: string;
    status?: TEnableStatusValue;
    tenantId?: number;
    permissionIds?: number[];
  }

  /** 角色创建参数 */
  export interface ReqRoleCreate {
    name: string;
    description?: string;
    roleType: TRoleTypeValue;
    tenantId?: number;
    roleLevel?: TRoleLevelValue;
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

  /** 权限详情 */
  export interface PermissionInfo extends Permission {
    module: string;
  }

  /** 权限模块 */
  export interface PermissionModule {
    moduleKey: string;
    moduleName: string;
    description?: string;
    permissions: Permission[];
  }

  /** 权限模块列表请求参数 */
  export interface ReqPermissionModules {
    roleLevel?: TRoleLevelValue;
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
    roleLevel?: TRoleLevelValue;
    tenantId?: number;
    tenantName?: string;
    orgDepartmentId?: number | null;
    orgDepartmentName?: string;
    status: TEnableStatusValue;
    createdAt?: string;
    updatedAt?: string;
  }

  /** 微信信息 */
  export interface WechatInfo {
    nickName?: string;
    avatarUrl?: string;
  }

  /** 余额信息 */
  export interface BalanceInfo {
    totalBalance?: string;
    availableBalance?: string;
    frozenBalance?: string;
    totalRecharge?: string;
    totalConsumption?: string;
    totalRefund?: string;
    status?: number;
    updatedAt?: string;
  }

  /** 当前孩子信息 */
  export interface CurrentChildInfo {
    studentId?: number;
    studentName?: string;
    studentCode?: string;
    grade?: string;
    className?: string;
    balance?: string;
    balanceInfo?: BalanceInfo;
    cardNumber?: string;
    relationship?: string;
  }

  /** 家长角色信息 */
  export interface ParentRoleInfo {
    currentChild?: CurrentChildInfo;
    childrenCount?: number;
  }

  /** 教师角色信息 */
  export interface TeacherRoleInfo {
    teacherNumber?: string;
    subject?: string;
    position?: string;
    managedClassCount?: number;
  }

  /** 角色特定信息 */
  export type UserRoleInfo = ParentRoleInfo | TeacherRoleInfo;

  /** 当前用户个人信息 */
  export interface UserProfile {
    id?: number;
    username?: string;
    realName?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    roleId?: number;
    roleName?: string;
    tenantId?: number;
    tenantName?: string;
  }

  /** 更新个人信息请求参数 */
  export interface ReqUserProfileUpdate {
    realName?: string;
    phone?: string;
    email?: string;
    avatar?: string;
  }

  /** 更新个人信息响应 */
  export interface ResUserProfileUpdate {
    message?: string;
  }

  /** 修改密码请求参数 */
  export interface ReqUserChangePassword {
    oldPassword: string;
    newPassword: string;
  }

  /** 修改密码响应 */
  export interface ResUserChangePassword {
    message?: string;
  }

  /** 用户列表请求参数 */
  export interface ReqUserList {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
    email?: string;
    phone?: string;
    tenantId?: number;
    roleId?: number;
    /** 部门ID（-1 表示未分配部门） */
    orgDepartmentId?: number;
    status?: TEnableStatusValue;
    roleLevel?: TRoleLevelValue;
  }

  /** 用户列表响应 */
  export interface ResGetAdminUserListApi {
    list: AdminUser[];
    total: number;
    page?: number;
    pageSize?: number;
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
    roleLevel?: TRoleLevelValue;
    tenantId: number;
    orgDepartmentId?: number | null;
    status?: TEnableStatusValue;
  }

  /** 更新用户请求参数 */
  export interface ReqPutAdminUserUpdateApi {
    realName?: string;
    phone?: string;
    email?: string;
    /** 角色ID（-1表示不更新） */
    roleId?: number | -1;
    /** 所属部门ID（null不更新，0清空部门） */
    orgDepartmentId?: number | null;
    /** 状态（-1不更新，0停用，1启用） */
    status?: TEnableStatusValue | -1;
  }

  /** 批量更新用户所属部门请求参数 */
  export interface ReqBatchUpdateAdminUsersOrgDepartmentApi {
    /** 用户ID列表 */
    userIds: number[];
    /** 组织部门ID（0清空部门） */
    orgDepartmentId: number;
  }

  /** 批量更新用户所属部门响应 */
  export type ResBatchUpdateAdminUsersOrgDepartmentApi = Record<string, never>;

  /** 创建用户响应 */
  export interface ResUserCreate {
    id: number;
    username: string;
    realName: string;
  }

  /** 重置用户密码请求参数 */
  export type ReqPostResetUserPasswordApi = Record<string, never>;

  /** 重置用户密码响应 */
  export interface ResPostResetUserPasswordApi {
    message?: string;
    password?: string;
  }

  /** 学校简要信息 */
  export interface SchoolBrief {
    id: number;
    name: string;
  }

  /** 租户简要信息 */
  export interface TenantBrief {
    id: number;
    name: string;
  }

  /** 可分配学校 */
  export type AvailableSchool = SchoolBrief;

  /** 用户数据权限 */
  export interface ResGetUserDataScopeApi {
    userId: number;
    scopeType: TDataScopeTypeValue;
    scopeTypeName?: string;
    tenantIds?: number[];
    tenants?: TenantBrief[];
    schoolIds?: number[];
    schools?: SchoolBrief[];
  }

  /** 用户数据权限保存参数 */
  export interface ReqPutUserDataScopeApi {
    scopeType: TDataScopeTypeValue;
    tenantIds?: number[];
    schoolIds?: number[];
  }

  /** 用户数据权限 */
  export type UserDataScope = ResGetUserDataScopeApi;

  /** 用户数据权限保存参数 */
  export type ReqUserDataScopeSave = ReqPutUserDataScopeApi;

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

  /** 部门更新参数 */
  export interface ReqOrgDepartmentUpdate {
    tenantId?: number;
    parentId?: number | null;
    name: string;
    code: string;
    leaderId?: number | null;
    sort?: number;
    status?: TOrgDepartmentStatusValue;
  }

  /** 部门更新响应 */
  export interface ResOrgDepartmentUpdate {
    message?: string;
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

  /** 获取租户详情响应 */
  export type ResGetTenantDetailApi = Tenant;

  /** 删除租户响应 */
  export type ResDeleteTenantApi = Tenant;

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
    contactEmail: string;
    address: string;
    status: TEnableStatusValue;
  }

  /** 修改租户响应 */
  export interface ResTenantUpdate {
    message: string;
  }
}
