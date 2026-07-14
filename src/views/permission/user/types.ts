import type { System } from "@/api/interface";
import type { TRoleLevelValue } from "@/config/modules";

/** 用户弹窗参数 */
export type TUserModalParams = TModalParams;

/** 用户表单模型 */
export type TUserFormModel = System.ReqUserSave & {
  /** 用户ID */
  id?: number;
  /** 账号层级 */
  roleLevel?: TRoleLevelValue;
};

/** 数据权限类型 */
export type DataScopeType = System.ReqUserDataScopeSave["scopeType"];

/** 数据权限弹窗参数 */
export type DataScopeParams = TModalParams & {
  /** 用户ID */
  userId: number;
  /** 用户姓名 */
  userName: string;
  /** 租户ID */
  tenantId?: number;
  /** 权限范围类型 */
  scopeType?: DataScopeType;
};

/** 数据权限弹窗接收结果 */
export type DataScopeAcceptPayload = {
  /** 弹窗参数 */
  parameter: TModalParams;
  /** 权限范围类型 */
  scopeType: DataScopeType;
  /** 用户ID */
  userId: number;
  /** 用户姓名 */
  userName: string;
  /** 租户ID */
  tenantId?: number;
};

/** 穿梭框源数据 */
export type TransferSourceItem = {
  /** ID */
  id: number;
  /** 名称 */
  name?: string | null;
  /** 租户ID */
  tenantId?: number;
};
