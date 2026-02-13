/**
 * @description 设备标签控制命令：重启/关机/更新配置/人员数据操作/查询人员数量
 */
export enum DEVICE_TAG_CONTROL_ACTION {
  /** 重启设备 */
  RESTART = "restart",
  /** 关机 */
  SHUTDOWN = "shutdown",
  /** 更新配置 */
  UPDATE_CONFIG = "update_config",
  /** 更新 APK 版本 */
  UPDATE_APK = "update_apk",
  /** 更新人员数据 */
  SYNC_USER = "sync_user",
  /** 清除人员数据 */
  CLEAR_USER = "clear_user",
  /** 查询人员数量 */
  COUNT_USER = "count_user"
}

// 设备标签控制命令值类型
export type TDeviceTagControlActionValue = (typeof DEVICE_TAG_CONTROL_ACTION)[keyof typeof DEVICE_TAG_CONTROL_ACTION];

// 设备标签控制命令国际化文案
export const DEVICE_TAG_CONTROL_ACTION_I18N: Record<TDeviceTagControlActionValue, string> = {
  [DEVICE_TAG_CONTROL_ACTION.RESTART]: "重启设备",
  [DEVICE_TAG_CONTROL_ACTION.SHUTDOWN]: "关机",
  [DEVICE_TAG_CONTROL_ACTION.UPDATE_CONFIG]: "更新配置",
  [DEVICE_TAG_CONTROL_ACTION.UPDATE_APK]: "更新APK版本",
  [DEVICE_TAG_CONTROL_ACTION.SYNC_USER]: "更新人员数据",
  [DEVICE_TAG_CONTROL_ACTION.CLEAR_USER]: "清除人员数据",
  [DEVICE_TAG_CONTROL_ACTION.COUNT_USER]: "查询人员数量"
};

// 设备标签控制命令选项
export const DEVICE_TAG_CONTROL_ACTION_OPTIONS: Array<{ label: string; value: TDeviceTagControlActionValue }> = [
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.RESTART],
    value: DEVICE_TAG_CONTROL_ACTION.RESTART
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.SHUTDOWN],
    value: DEVICE_TAG_CONTROL_ACTION.SHUTDOWN
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.UPDATE_CONFIG],
    value: DEVICE_TAG_CONTROL_ACTION.UPDATE_CONFIG
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.UPDATE_APK],
    value: DEVICE_TAG_CONTROL_ACTION.UPDATE_APK
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.SYNC_USER],
    value: DEVICE_TAG_CONTROL_ACTION.SYNC_USER
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.CLEAR_USER],
    value: DEVICE_TAG_CONTROL_ACTION.CLEAR_USER
  },
  {
    label: DEVICE_TAG_CONTROL_ACTION_I18N[DEVICE_TAG_CONTROL_ACTION.COUNT_USER],
    value: DEVICE_TAG_CONTROL_ACTION.COUNT_USER
  }
];
