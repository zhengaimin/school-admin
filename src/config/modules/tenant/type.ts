/**
 * @description 租户类型：PLATFORM-平台，AGENT-代理商
 */
export enum TENANT_TYPE {
  /** 平台 */
  PLATFORM = "PLATFORM",
  /** 代理商 */
  AGENT = "AGENT"
}

// 租户类型值类型
export type TTenantTypeValue = (typeof TENANT_TYPE)[keyof typeof TENANT_TYPE];

// 租户类型国际化翻译
export const TENANT_TYPE_I18N: Record<TTenantTypeValue, string> = {
  [TENANT_TYPE.PLATFORM]: "平台",
  [TENANT_TYPE.AGENT]: "代理商"
};

// 租户类型选项列表
export const TENANT_TYPE_OPTIONS: { label: string; value: TTenantTypeValue }[] = [
  { label: TENANT_TYPE_I18N[TENANT_TYPE.PLATFORM], value: TENANT_TYPE.PLATFORM },
  { label: TENANT_TYPE_I18N[TENANT_TYPE.AGENT], value: TENANT_TYPE.AGENT }
];
