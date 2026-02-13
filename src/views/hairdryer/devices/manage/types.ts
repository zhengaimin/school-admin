import type { DeviceBase } from "@/api/interface";

/** 设备行数据 */
export type DeviceRow = DeviceBase.IDeviceBaseItem;

/** 批量标签表单 */
export interface BatchTagForm {
  /** 标签ID */
  tagId: number | null;
}

/** 批量标签弹窗参数 */
export type BatchTagParams = TModalParams;

/** 导出筛选表单 */
export interface FormData {
  /** 学校ID */
  schoolId?: number;
  /** 设备序列号 */
  deviceSn: string;
  /** 状态 */
  status: 0 | 1 | null;
}

/** 导出弹窗接收参数 */
export interface AcceptParamsOptions {
  /** 学校ID */
  schoolId?: number;
  /** 设备序列号 */
  deviceSn?: string;
  /** 状态 */
  status?: 0 | 1 | null;
}
