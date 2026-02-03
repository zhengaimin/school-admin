/** 用户分配弹窗参数 */
export type UserAssignParams = {
  /** 标题 */
  title: string;
  /** 弹窗类型 */
  type: "Add" | "Edit" | "View";
  /** 是否显示确认按钮 */
  showConfirm: boolean;
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
