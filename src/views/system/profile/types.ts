/** 个人信息表单 */
export type TProfileForm = {
  /** 真实姓名 */
  realName: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 头像 */
  avatar: string;
};

/** 用户信息 */
export type TUserInfo = {
  /** 用户ID */
  id?: number;
  /** 用户名 */
  username?: string;
  /** 用户名别名 */
  userName?: string;
  /** 显示名称 */
  name?: string;
  /** 真实姓名 */
  realName?: string;
  /** 手机号 */
  phone?: string;
  /** 邮箱 */
  email?: string;
  /** 头像 */
  avatar?: string;
  /** 角色名称 */
  roleName?: string;
  /** 角色ID */
  roleId?: number;
  /** 租户ID */
  tenantId?: number;
  /** 租户名称 */
  tenantName?: string;
};
