/** 下拉选项 */
export interface SelectOptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** APK 升级弹窗参数 */
export type ApkUpgradeAcceptParams = TModalParams & {
  /** APK 包ID */
  apkPackageId: number;
  /** 版本名称 */
  versionName: string;
  /** 版本号 */
  versionCode: number;
};
