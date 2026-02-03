/** 角色弹窗参数 */
export type RoleModalParams = {
  /** 标题 */
  title: string;
  /** 弹窗类型 */
  type: "Add" | "Edit" | "View";
  /** 是否显示确认按钮 */
  showConfirm: boolean;
};

/** 权限树节点 */
export type TPermissionTreeNode = {
  /** 节点ID */
  id: string | number;
  /** 节点名称 */
  name: string;
  /** 子节点 */
  children?: TPermissionTreeNode[];
  /** 是否权限节点 */
  isPermission?: boolean;
  /** 权限ID */
  permissionId?: number;
  /** 权限编码 */
  permissionCode?: string;
  /** 权限动作 */
  permissionAction?: string;
};
