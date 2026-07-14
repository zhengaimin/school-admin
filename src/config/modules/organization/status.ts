/**
 * @description 部门状态:0-禁用,1-启用
 */
export enum ORG_DEPARTMENT_STATUS {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}

// 部门状态值类型
export type TOrgDepartmentStatusValue = (typeof ORG_DEPARTMENT_STATUS)[keyof typeof ORG_DEPARTMENT_STATUS];

// 部门状态国际化翻译
export const ORG_DEPARTMENT_STATUS_I18N = {
  [ORG_DEPARTMENT_STATUS.DISABLED]: "禁用",
  [ORG_DEPARTMENT_STATUS.ENABLED]: "启用"
};

// 部门状态选项列表
export const ORG_DEPARTMENT_STATUS_OPTIONS: { label: string; value: TOrgDepartmentStatusValue }[] = [
  {
    label: ORG_DEPARTMENT_STATUS_I18N[ORG_DEPARTMENT_STATUS.ENABLED],
    value: ORG_DEPARTMENT_STATUS.ENABLED
  },
  {
    label: ORG_DEPARTMENT_STATUS_I18N[ORG_DEPARTMENT_STATUS.DISABLED],
    value: ORG_DEPARTMENT_STATUS.DISABLED
  }
];
