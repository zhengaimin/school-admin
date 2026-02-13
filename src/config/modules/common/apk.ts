/** APK 包状态：DRAFT-草稿，PUBLISHED-已发布，DISABLED-已下线 */
export enum APK_PACKAGE_STATUS {
  /** 草稿 */
  DRAFT = "DRAFT",
  /** 已发布 */
  PUBLISHED = "PUBLISHED",
  /** 已下线 */
  DISABLED = "DISABLED"
}

export type TApkPackageStatusValue = (typeof APK_PACKAGE_STATUS)[keyof typeof APK_PACKAGE_STATUS];

export const APK_PACKAGE_STATUS_I18N: Record<TApkPackageStatusValue, string> = {
  [APK_PACKAGE_STATUS.DRAFT]: "草稿",
  [APK_PACKAGE_STATUS.PUBLISHED]: "已发布",
  [APK_PACKAGE_STATUS.DISABLED]: "已下线"
};

export const APK_PACKAGE_STATUS_OPTIONS: Array<{ label: string; value: TApkPackageStatusValue }> = [
  { label: APK_PACKAGE_STATUS_I18N[APK_PACKAGE_STATUS.DRAFT], value: APK_PACKAGE_STATUS.DRAFT },
  { label: APK_PACKAGE_STATUS_I18N[APK_PACKAGE_STATUS.PUBLISHED], value: APK_PACKAGE_STATUS.PUBLISHED },
  { label: APK_PACKAGE_STATUS_I18N[APK_PACKAGE_STATUS.DISABLED], value: APK_PACKAGE_STATUS.DISABLED }
];

/** APK 升级范围：DEVICE-设备，SCHOOL-学校，TAG-标签 */
export enum APK_UPGRADE_SCOPE {
  /** 按设备升级 */
  DEVICE = "DEVICE",
  /** 按学校升级 */
  SCHOOL = "SCHOOL",
  /** 按标签升级 */
  TAG = "TAG"
}

export type TApkUpgradeScopeValue = (typeof APK_UPGRADE_SCOPE)[keyof typeof APK_UPGRADE_SCOPE];

export const APK_UPGRADE_SCOPE_I18N: Record<TApkUpgradeScopeValue, string> = {
  [APK_UPGRADE_SCOPE.DEVICE]: "按设备",
  [APK_UPGRADE_SCOPE.SCHOOL]: "按学校",
  [APK_UPGRADE_SCOPE.TAG]: "按标签"
};

export const APK_UPGRADE_SCOPE_OPTIONS: Array<{ label: string; value: TApkUpgradeScopeValue }> = [
  { label: APK_UPGRADE_SCOPE_I18N[APK_UPGRADE_SCOPE.DEVICE], value: APK_UPGRADE_SCOPE.DEVICE },
  { label: APK_UPGRADE_SCOPE_I18N[APK_UPGRADE_SCOPE.SCHOOL], value: APK_UPGRADE_SCOPE.SCHOOL },
  { label: APK_UPGRADE_SCOPE_I18N[APK_UPGRADE_SCOPE.TAG], value: APK_UPGRADE_SCOPE.TAG }
];

/** APK 终端类型：TERMINAL_TYPE_GH_02-话机终端 */
export enum APK_TERMINAL_TYPE {
  /** 话机终端 GH_02 */
  TERMINAL_TYPE_GH_02 = "TERMINAL_TYPE_GH_02"
}

export type TApkTerminalTypeValue = (typeof APK_TERMINAL_TYPE)[keyof typeof APK_TERMINAL_TYPE];

export const APK_TERMINAL_TYPE_I18N: Record<TApkTerminalTypeValue, string> = {
  [APK_TERMINAL_TYPE.TERMINAL_TYPE_GH_02]: "话机终端 GH_02"
};

export const APK_TERMINAL_TYPE_OPTIONS: Array<{ label: string; value: TApkTerminalTypeValue }> = [
  {
    label: APK_TERMINAL_TYPE_I18N[APK_TERMINAL_TYPE.TERMINAL_TYPE_GH_02],
    value: APK_TERMINAL_TYPE.TERMINAL_TYPE_GH_02
  }
];

export const getApkPackageStatusTagType = (status: TApkPackageStatusValue): "success" | "warning" | "info" => {
  const tagTypeMap: Record<TApkPackageStatusValue, "success" | "warning" | "info"> = {
    [APK_PACKAGE_STATUS.DRAFT]: "info",
    [APK_PACKAGE_STATUS.PUBLISHED]: "success",
    [APK_PACKAGE_STATUS.DISABLED]: "warning"
  };
  return tagTypeMap[status] || "info";
};
