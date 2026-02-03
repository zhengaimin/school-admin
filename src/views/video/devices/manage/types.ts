import type { Device as DeviceVideo } from "@/api/interface";
import type { TDeviceTagControlActionValue } from "@/config/modules";

/** 导入失败项 */
export interface DeviceImportFailure {
  /** 行号 */
  rowIndex: number;
  /** 终端序列号 */
  terminalSn?: string;
  /** 设备序列号 */
  deviceSn?: string;
  /** 名称 */
  name?: string;
  /** 失败原因 */
  reason: string;
}

/** 导入结果 */
export interface DeviceImportResult {
  /** 成功数量 */
  successCount: number;
  /** 失败数量 */
  failCount: number;
  /** 失败详情 */
  failures: DeviceImportFailure[];
}

/** 设备行数据 */
export type DeviceRow = DeviceVideo.IDeviceItemVo;

/** 表头操作配置 */
export type HeaderAction = {
  /** 操作标识 */
  key: string;
  /** 文案 */
  label: string;
  /** 按钮类型 */
  type: "primary" | "success" | "warning" | "danger";
  /** 控制动作 */
  action?: TDeviceTagControlActionValue;
  /** 是否绑定标签 */
  isBindTag?: boolean;
};

/** 批量标签表单 */
export interface BatchTagForm {
  /** 标签ID */
  tagId: number | null;
}

/** 导出筛选表单 */
export interface FormData {
  /** 学校ID */
  schoolId?: number;
  /** 设备名称 */
  name: string;
  /** 终端序列号 */
  terminalSn: string;
  /** 状态 */
  status: 0 | 1 | null;
}

/** 导出弹窗接收参数 */
export interface AcceptParamsOptions {
  /** 学校ID */
  schoolId?: number;
  /** 设备名称 */
  name?: string;
  /** 终端序列号 */
  terminalSn?: string;
  /** 状态 */
  status?: 0 | 1 | null;
}

/** 设备表单 */
export type DeviceVideoForm = Partial<Omit<DeviceVideo.IDeviceItemVo, "deviceGroupId">> & {
  /** 设备组ID */
  deviceGroupId?: number;
  /** SIP 用户名 */
  sipUserName?: string;
  /** SIP 密码 */
  sipPassword?: string;
  /** SIP 域 */
  sipDomain?: string;
  /** SIP 传输类型 */
  sipTransportType?: DeviceVideo.ReqPostDeviceApi["sipTransportType"];
  /** 设备密码 */
  password?: string;
};
