/** 用户分配弹窗参数 */
export type UserAssignParams = TModalParams & {
  /** 部门ID */
  departmentId: number;
  /** 部门名称 */
  departmentName: string;
  /** 已分配用户ID */
  userIds?: number[];
};

/** 穿梭框选项 */
export type TransferOption = {
  /** 主键 */
  key: number;
  /** 文案 */
  label: string;
};
