import dayjs from "dayjs";

export * from "./base";
export * from "./config";
export * from "./tags";
export * from "./command";
export * from "./usage";

/** 设备状态枚举 */
export const DeviceStatus = {
  ONLINE: 1,
  OFFLINE: 0
} as const;

/** 设备状态选项 */
export const deviceStatusOptions = [
  { label: "在线", value: DeviceStatus.ONLINE },
  { label: "离线", value: DeviceStatus.OFFLINE }
];

/** 格式化时间戳 */
export const formatDeviceTimestamp = (timestamp: number) => {
  return dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
};
