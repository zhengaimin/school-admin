import type { DeviceTag } from "@/api/interface";

/** 设备标签行数据 */
export type DeviceTagRow = DeviceTag.IDeviceTagItemVo;

/** 标签表单数据 */
export type DeviceTagForm = Partial<DeviceTag.IDeviceTagItemVo>;

/** 批量控制失败项 */
export type DeviceTagControlFailItem = DeviceTag.IDeviceTagControlFailItemVo;
