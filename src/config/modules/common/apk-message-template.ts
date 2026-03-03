/** APK 错误话术作用域：global-全局，tenant-租户，school-学校 */
export enum APK_MESSAGE_TEMPLATE_SCOPE {
  /** 全局 */
  GLOBAL = "global",
  /** 租户 */
  TENANT = "tenant",
  /** 学校 */
  SCHOOL = "school"
}

export type TApkMessageTemplateScopeValue = (typeof APK_MESSAGE_TEMPLATE_SCOPE)[keyof typeof APK_MESSAGE_TEMPLATE_SCOPE];

export const APK_MESSAGE_TEMPLATE_SCOPE_I18N: Record<TApkMessageTemplateScopeValue, string> = {
  [APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL]: "全局",
  [APK_MESSAGE_TEMPLATE_SCOPE.TENANT]: "租户",
  [APK_MESSAGE_TEMPLATE_SCOPE.SCHOOL]: "学校"
};

export const APK_MESSAGE_TEMPLATE_SCOPE_OPTIONS: Array<{ label: string; value: TApkMessageTemplateScopeValue }> = [
  { label: APK_MESSAGE_TEMPLATE_SCOPE_I18N[APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL], value: APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL },
  { label: APK_MESSAGE_TEMPLATE_SCOPE_I18N[APK_MESSAGE_TEMPLATE_SCOPE.TENANT], value: APK_MESSAGE_TEMPLATE_SCOPE.TENANT },
  { label: APK_MESSAGE_TEMPLATE_SCOPE_I18N[APK_MESSAGE_TEMPLATE_SCOPE.SCHOOL], value: APK_MESSAGE_TEMPLATE_SCOPE.SCHOOL }
];

/** APK 错误话术分类：DEVICE-设备，STUDENT-学生，MESSAGE-留言，SYSTEM-系统 */
export enum APK_MESSAGE_TEMPLATE_CATEGORY {
  /** 设备 */
  DEVICE = "DEVICE",
  /** 学生 */
  STUDENT = "STUDENT",
  /** 留言 */
  MESSAGE = "MESSAGE",
  /** 系统 */
  SYSTEM = "SYSTEM"
}

export type TApkMessageTemplateCategoryValue = (typeof APK_MESSAGE_TEMPLATE_CATEGORY)[keyof typeof APK_MESSAGE_TEMPLATE_CATEGORY];

export const APK_MESSAGE_TEMPLATE_CATEGORY_I18N: Record<TApkMessageTemplateCategoryValue, string> = {
  [APK_MESSAGE_TEMPLATE_CATEGORY.DEVICE]: "设备",
  [APK_MESSAGE_TEMPLATE_CATEGORY.STUDENT]: "学生",
  [APK_MESSAGE_TEMPLATE_CATEGORY.MESSAGE]: "留言",
  [APK_MESSAGE_TEMPLATE_CATEGORY.SYSTEM]: "系统"
};

export const APK_MESSAGE_TEMPLATE_CATEGORY_OPTIONS: Array<{ label: string; value: TApkMessageTemplateCategoryValue }> = [
  {
    label: APK_MESSAGE_TEMPLATE_CATEGORY_I18N[APK_MESSAGE_TEMPLATE_CATEGORY.DEVICE],
    value: APK_MESSAGE_TEMPLATE_CATEGORY.DEVICE
  },
  {
    label: APK_MESSAGE_TEMPLATE_CATEGORY_I18N[APK_MESSAGE_TEMPLATE_CATEGORY.STUDENT],
    value: APK_MESSAGE_TEMPLATE_CATEGORY.STUDENT
  },
  {
    label: APK_MESSAGE_TEMPLATE_CATEGORY_I18N[APK_MESSAGE_TEMPLATE_CATEGORY.MESSAGE],
    value: APK_MESSAGE_TEMPLATE_CATEGORY.MESSAGE
  },
  {
    label: APK_MESSAGE_TEMPLATE_CATEGORY_I18N[APK_MESSAGE_TEMPLATE_CATEGORY.SYSTEM],
    value: APK_MESSAGE_TEMPLATE_CATEGORY.SYSTEM
  }
];

/** APK 错误话术审计动作：update-更新，reset_inherit-恢复继承 */
export enum APK_MESSAGE_TEMPLATE_AUDIT_ACTION {
  /** 更新 */
  UPDATE = "update",
  /** 恢复继承 */
  RESET_INHERIT = "reset_inherit"
}

export type TApkMessageTemplateAuditActionValue =
  (typeof APK_MESSAGE_TEMPLATE_AUDIT_ACTION)[keyof typeof APK_MESSAGE_TEMPLATE_AUDIT_ACTION];

export const APK_MESSAGE_TEMPLATE_AUDIT_ACTION_I18N: Record<TApkMessageTemplateAuditActionValue, string> = {
  [APK_MESSAGE_TEMPLATE_AUDIT_ACTION.UPDATE]: "更新",
  [APK_MESSAGE_TEMPLATE_AUDIT_ACTION.RESET_INHERIT]: "恢复继承"
};

export const APK_MESSAGE_TEMPLATE_AUDIT_ACTION_OPTIONS: Array<{
  label: string;
  value: TApkMessageTemplateAuditActionValue;
}> = [
  {
    label: APK_MESSAGE_TEMPLATE_AUDIT_ACTION_I18N[APK_MESSAGE_TEMPLATE_AUDIT_ACTION.UPDATE],
    value: APK_MESSAGE_TEMPLATE_AUDIT_ACTION.UPDATE
  },
  {
    label: APK_MESSAGE_TEMPLATE_AUDIT_ACTION_I18N[APK_MESSAGE_TEMPLATE_AUDIT_ACTION.RESET_INHERIT],
    value: APK_MESSAGE_TEMPLATE_AUDIT_ACTION.RESET_INHERIT
  }
];

/** APK 错误话术固定渠道 */
export const APK_MESSAGE_TEMPLATE_CHANNEL = "GH_DEVICE_APK";

export const getApkMessageTemplateScopeTagType = (scope: TApkMessageTemplateScopeValue): "success" | "warning" | "info" => {
  const tagTypeMap: Record<TApkMessageTemplateScopeValue, "success" | "warning" | "info"> = {
    [APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL]: "info",
    [APK_MESSAGE_TEMPLATE_SCOPE.TENANT]: "warning",
    [APK_MESSAGE_TEMPLATE_SCOPE.SCHOOL]: "success"
  };
  return tagTypeMap[scope] || "info";
};
