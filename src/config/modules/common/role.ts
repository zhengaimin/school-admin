/** 超级管理员角色码（历史兼容，新的权限判断请使用 roleLevel） */
export const SUPER_ADMIN_ROLE = "super_admin";

/** 角色类型：admin-后台管理员，api-前台用户 */
export enum ROLE_TYPE {
  /** 后台管理员 */
  ADMIN = "admin",
  /** 前台用户 */
  API = "api"
}

export type TRoleTypeValue = (typeof ROLE_TYPE)[keyof typeof ROLE_TYPE];

export const ROLE_TYPE_I18N: Record<TRoleTypeValue, string> = {
  [ROLE_TYPE.ADMIN]: "后台管理员",
  [ROLE_TYPE.API]: "前台用户"
};

export const ROLE_TYPE_OPTIONS: Array<{ label: string; value: TRoleTypeValue }> = [
  { label: ROLE_TYPE_I18N[ROLE_TYPE.ADMIN], value: ROLE_TYPE.ADMIN },
  { label: ROLE_TYPE_I18N[ROLE_TYPE.API], value: ROLE_TYPE.API }
];

/** 角色级别：super-超级，platform-平台，agent-代理商，custom-自定义 */
export enum ROLE_LEVEL {
  /** 超级 */
  SUPER = "super",
  /** 平台 */
  PLATFORM = "platform",
  /** 代理商 */
  AGENT = "agent",
  /** 自定义 */
  CUSTOM = "custom"
}

export type TRoleLevelValue = (typeof ROLE_LEVEL)[keyof typeof ROLE_LEVEL];

export const ROLE_LEVEL_I18N: Record<TRoleLevelValue, string> = {
  [ROLE_LEVEL.SUPER]: "超级",
  [ROLE_LEVEL.PLATFORM]: "平台运营方",
  [ROLE_LEVEL.AGENT]: "代理商",
  [ROLE_LEVEL.CUSTOM]: "业务员"
};

export const ROLE_LEVEL_OPTIONS: Array<{ label: string; value: TRoleLevelValue }> = [
  { label: ROLE_LEVEL_I18N[ROLE_LEVEL.SUPER], value: ROLE_LEVEL.SUPER },
  { label: ROLE_LEVEL_I18N[ROLE_LEVEL.PLATFORM], value: ROLE_LEVEL.PLATFORM },
  { label: ROLE_LEVEL_I18N[ROLE_LEVEL.AGENT], value: ROLE_LEVEL.AGENT },
  { label: ROLE_LEVEL_I18N[ROLE_LEVEL.CUSTOM], value: ROLE_LEVEL.CUSTOM }
];

/** 角色级别判断工具 */
export const isSuperRoleLevel = (roleLevel?: TRoleLevelValue): boolean => roleLevel === ROLE_LEVEL.SUPER;
export const isPlatformRoleLevel = (roleLevel?: TRoleLevelValue): boolean => roleLevel === ROLE_LEVEL.PLATFORM;
export const isAgentRoleLevel = (roleLevel?: TRoleLevelValue): boolean => roleLevel === ROLE_LEVEL.AGENT;
export const isCustomRoleLevel = (roleLevel?: TRoleLevelValue): boolean => roleLevel === ROLE_LEVEL.CUSTOM;
