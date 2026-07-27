/**
 * @description 数据范围类型:ALL-全部数据,TENANT-指定租户,SCHOOL-指定学校
 */
export enum DATA_SCOPE_TYPE {
  /** 全部数据 */
  ALL = "ALL",
  /** 指定租户 */
  TENANT = "TENANT",
  /** 指定学校 */
  SCHOOL = "SCHOOL"
}

// 数据范围类型值类型
export type TDataScopeTypeValue = (typeof DATA_SCOPE_TYPE)[keyof typeof DATA_SCOPE_TYPE];

// 数据范围类型国际化翻译
export const DATA_SCOPE_TYPE_I18N: Record<TDataScopeTypeValue, string> = {
  [DATA_SCOPE_TYPE.ALL]: "全部数据",
  [DATA_SCOPE_TYPE.TENANT]: "指定租户",
  [DATA_SCOPE_TYPE.SCHOOL]: "指定学校"
};

// 数据范围类型选项列表
export const DATA_SCOPE_TYPE_OPTIONS: Array<{ label: string; value: TDataScopeTypeValue }> = [
  { label: DATA_SCOPE_TYPE_I18N[DATA_SCOPE_TYPE.ALL], value: DATA_SCOPE_TYPE.ALL },
  { label: DATA_SCOPE_TYPE_I18N[DATA_SCOPE_TYPE.TENANT], value: DATA_SCOPE_TYPE.TENANT },
  { label: DATA_SCOPE_TYPE_I18N[DATA_SCOPE_TYPE.SCHOOL], value: DATA_SCOPE_TYPE.SCHOOL }
];
