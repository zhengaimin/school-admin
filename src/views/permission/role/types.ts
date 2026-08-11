/** 角色弹窗参数 */
export type RoleModalParams = TModalParams;

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
  /** 所属模块名称 */
  moduleName?: string;
};
