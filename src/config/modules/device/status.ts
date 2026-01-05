/** 设备命令状态：PENDING-待执行 SUCCESS-执行成功 FAILED-执行失败 EXPIRED-已过期 TIMEOUT-已超时 */
export enum DEVICE_COMMAND_STATUS {
  /** 待执行 */
  PENDING = "PENDING",
  /** 执行成功 */
  SUCCESS = "SUCCESS",
  /** 执行失败 */
  FAILED = "FAILED",
  /** 已过期 */
  EXPIRED = "EXPIRED",
  /** 已超时 */
  TIMEOUT = "TIMEOUT"
}

export type TDeviceCommandStatusValue = (typeof DEVICE_COMMAND_STATUS)[keyof typeof DEVICE_COMMAND_STATUS];

export const DEVICE_COMMAND_STATUS_I18N: Record<TDeviceCommandStatusValue, string> = {
  [DEVICE_COMMAND_STATUS.PENDING]: "待执行",
  [DEVICE_COMMAND_STATUS.SUCCESS]: "执行成功",
  [DEVICE_COMMAND_STATUS.FAILED]: "执行失败",
  [DEVICE_COMMAND_STATUS.EXPIRED]: "已过期",
  [DEVICE_COMMAND_STATUS.TIMEOUT]: "已超时"
};

export const DEVICE_COMMAND_STATUS_OPTIONS: Array<{ label: string; value: TDeviceCommandStatusValue }> = [
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.PENDING], value: DEVICE_COMMAND_STATUS.PENDING },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.SUCCESS], value: DEVICE_COMMAND_STATUS.SUCCESS },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.FAILED], value: DEVICE_COMMAND_STATUS.FAILED },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.EXPIRED], value: DEVICE_COMMAND_STATUS.EXPIRED },
  { label: DEVICE_COMMAND_STATUS_I18N[DEVICE_COMMAND_STATUS.TIMEOUT], value: DEVICE_COMMAND_STATUS.TIMEOUT }
];

/** 获取设备命令状态标签类型 */
export const getDeviceCommandStatusTagType = (status: TDeviceCommandStatusValue): "info" | "success" | "danger" | "warning" => {
  const tagTypeMap: Record<TDeviceCommandStatusValue, "info" | "success" | "danger" | "warning"> = {
    [DEVICE_COMMAND_STATUS.PENDING]: "info",
    [DEVICE_COMMAND_STATUS.SUCCESS]: "success",
    [DEVICE_COMMAND_STATUS.FAILED]: "danger",
    [DEVICE_COMMAND_STATUS.EXPIRED]: "warning",
    [DEVICE_COMMAND_STATUS.TIMEOUT]: "warning"
  };
  return tagTypeMap[status] || "info";
};

/** 设备命令类型：control-控制命令 config-配置命令 query-查询命令 */
export enum DEVICE_COMMAND_TYPE {
  /** 控制命令 */
  CONTROL = "control",
  /** 配置命令 */
  CONFIG = "config",
  /** 查询命令 */
  QUERY = "query"
}

export type TDeviceCommandTypeValue = (typeof DEVICE_COMMAND_TYPE)[keyof typeof DEVICE_COMMAND_TYPE];

export const DEVICE_COMMAND_TYPE_I18N: Record<TDeviceCommandTypeValue, string> = {
  [DEVICE_COMMAND_TYPE.CONTROL]: "控制命令",
  [DEVICE_COMMAND_TYPE.CONFIG]: "配置命令",
  [DEVICE_COMMAND_TYPE.QUERY]: "查询命令"
};

export const DEVICE_COMMAND_TYPE_OPTIONS: Array<{ label: string; value: TDeviceCommandTypeValue }> = [
  { label: DEVICE_COMMAND_TYPE_I18N[DEVICE_COMMAND_TYPE.CONTROL], value: DEVICE_COMMAND_TYPE.CONTROL },
  { label: DEVICE_COMMAND_TYPE_I18N[DEVICE_COMMAND_TYPE.CONFIG], value: DEVICE_COMMAND_TYPE.CONFIG },
  { label: DEVICE_COMMAND_TYPE_I18N[DEVICE_COMMAND_TYPE.QUERY], value: DEVICE_COMMAND_TYPE.QUERY }
];

/** 设备命令创建类型：user-用户创建 system-系统创建 scheduler-定时任务 */
export enum DEVICE_COMMAND_CREATED_TYPE {
  /** 用户创建 */
  USER = "user",
  /** 系统创建 */
  SYSTEM = "system",
  /** 定时任务 */
  SCHEDULER = "scheduler"
}

export type TDeviceCommandCreatedTypeValue = (typeof DEVICE_COMMAND_CREATED_TYPE)[keyof typeof DEVICE_COMMAND_CREATED_TYPE];

export const DEVICE_COMMAND_CREATED_TYPE_I18N: Record<TDeviceCommandCreatedTypeValue, string> = {
  [DEVICE_COMMAND_CREATED_TYPE.USER]: "用户创建",
  [DEVICE_COMMAND_CREATED_TYPE.SYSTEM]: "系统创建",
  [DEVICE_COMMAND_CREATED_TYPE.SCHEDULER]: "定时任务"
};

export const DEVICE_COMMAND_CREATED_TYPE_OPTIONS: Array<{ label: string; value: TDeviceCommandCreatedTypeValue }> = [
  { label: DEVICE_COMMAND_CREATED_TYPE_I18N[DEVICE_COMMAND_CREATED_TYPE.USER], value: DEVICE_COMMAND_CREATED_TYPE.USER },
  { label: DEVICE_COMMAND_CREATED_TYPE_I18N[DEVICE_COMMAND_CREATED_TYPE.SYSTEM], value: DEVICE_COMMAND_CREATED_TYPE.SYSTEM },
  { label: DEVICE_COMMAND_CREATED_TYPE_I18N[DEVICE_COMMAND_CREATED_TYPE.SCHEDULER], value: DEVICE_COMMAND_CREATED_TYPE.SCHEDULER }
];
