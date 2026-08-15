import type { TRoleLevelValue } from "@/config/modules";

/** 用户分配弹窗参数 */
export type UserAssignParams = TModalParams & {
  /** 部门ID */
  departmentId: number;
  /** 部门名称 */
  departmentName: string;
  /** 租户ID */
  tenantId: number;
  /** 已分配用户ID */
  userIds?: number[];
};

/** 穿梭框选项 */
export type TransferOption = {
  /** 主键 */
  key: number;
  /** 文案 */
  label: string;
  /** 角色名称 */
  roleName?: string;
  /** 角色层级 */
  roleLevel?: TRoleLevelValue;
  /** 是否禁用 */
  disabled: boolean;
};
