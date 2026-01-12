/** 设备使用记录状态：PENDING-待使用，IN_USE-使用中，SETTLING-正在结算，COMPLETED-已完成，TIMEOUT-已超时 */
export enum DEVICE_USAGE_STATUS {
  /** 待使用 */
  PENDING = "PENDING",
  /** 使用中 */
  IN_USE = "IN_USE",
  /** 正在结算 */
  SETTLING = "SETTLING",
  /** 已完成 */
  COMPLETED = "COMPLETED",
  /** 已超时 */
  TIMEOUT = "TIMEOUT"
}

export type TDeviceUsageStatusValue = (typeof DEVICE_USAGE_STATUS)[keyof typeof DEVICE_USAGE_STATUS];

export const DEVICE_USAGE_STATUS_I18N: Record<TDeviceUsageStatusValue, string> = {
  [DEVICE_USAGE_STATUS.PENDING]: "待使用",
  [DEVICE_USAGE_STATUS.IN_USE]: "使用中",
  [DEVICE_USAGE_STATUS.SETTLING]: "正在结算",
  [DEVICE_USAGE_STATUS.COMPLETED]: "已完成",
  [DEVICE_USAGE_STATUS.TIMEOUT]: "已超时"
};

export const DEVICE_USAGE_STATUS_OPTIONS: Array<{ label: string; value: TDeviceUsageStatusValue }> = [
  { label: DEVICE_USAGE_STATUS_I18N[DEVICE_USAGE_STATUS.PENDING], value: DEVICE_USAGE_STATUS.PENDING },
  { label: DEVICE_USAGE_STATUS_I18N[DEVICE_USAGE_STATUS.IN_USE], value: DEVICE_USAGE_STATUS.IN_USE },
  { label: DEVICE_USAGE_STATUS_I18N[DEVICE_USAGE_STATUS.SETTLING], value: DEVICE_USAGE_STATUS.SETTLING },
  { label: DEVICE_USAGE_STATUS_I18N[DEVICE_USAGE_STATUS.COMPLETED], value: DEVICE_USAGE_STATUS.COMPLETED },
  { label: DEVICE_USAGE_STATUS_I18N[DEVICE_USAGE_STATUS.TIMEOUT], value: DEVICE_USAGE_STATUS.TIMEOUT }
];

/** 获取设备使用状态标签类型 */
export const getDeviceUsageStatusTagType = (status: TDeviceUsageStatusValue): "info" | "warning" | "success" | "danger" => {
  const tagTypeMap: Record<TDeviceUsageStatusValue, "info" | "warning" | "success" | "danger"> = {
    [DEVICE_USAGE_STATUS.PENDING]: "info",
    [DEVICE_USAGE_STATUS.IN_USE]: "warning",
    [DEVICE_USAGE_STATUS.SETTLING]: "warning",
    [DEVICE_USAGE_STATUS.COMPLETED]: "success",
    [DEVICE_USAGE_STATUS.TIMEOUT]: "danger"
  };
  return tagTypeMap[status] || "info";
};
