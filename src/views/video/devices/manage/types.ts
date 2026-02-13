import type { Device as DeviceVideo } from "@/api/interface";
import type { TDialModeValue, TDeviceTagControlActionValue, TPhoneEntryValue, TPhoneTypeValue } from "@/config/modules";

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

/** 批量更新字段 */
export interface BatchUpdateField {
  /** 配置key */
  key: string;
  /** 显示名称 */
  name: string;
  /** 字段类型 */
  type: string;
  /** 分类 */
  category: string;
  /** 是否必填 */
  required: boolean;
  /** 枚举选项 */
  enumOptions?: string[];
}

/** 批量更新字段分类 */
export interface BatchUpdateCategory {
  /** 分类key */
  key: string;
  /** 分类名称 */
  name: string;
}

/** 批量更新字段分组 */
export interface BatchUpdateCategoryGroup {
  /** 分类key */
  key: string;
  /** 分类名称 */
  name: string;
  /** 字段列表 */
  fields: BatchUpdateField[];
}

/** 批量更新失败项 */
export interface BatchUpdateFailure {
  /** 行号 */
  row: number;
  /** 设备SN */
  terminalSn: string;
  /** 字段key */
  field: string;
  /** 字段名称 */
  fieldName: string;
  /** 字段值 */
  value: string;
  /** 错误原因 */
  error: string;
  /** 修正建议 */
  suggestion: string;
}

/** 批量更新结果 */
export interface BatchUpdateResult {
  /** 成功数量 */
  successCount: number;
  /** 失败数量 */
  failedCount: number;
  /** 失败详情 */
  failures: BatchUpdateFailure[];
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
  /** 是否为更新 APK */
  isUpdateApk?: boolean;
  /** 是否绑定标签 */
  isBindTag?: boolean;
  /** 是否需要选择设备 */
  needSelection?: boolean;
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
  /** 拨号类型（已废弃，仅用于兼容旧数据） */
  phoneType?: TPhoneTypeValue;
  /** 拨号模式 */
  dialMode?: TDialModeValue;
  /** 拨号入口集合 */
  phoneTypes?: TPhoneEntryValue[];
  /** SIP 用户名 */
  sipUserName?: string | null;
  /** SIP 密码 */
  sipPassword?: string | null;
  /** SIP 域 */
  sipDomain?: string | null;
  /** SIP 传输类型 */
  sipTransportType?: DeviceVideo.ReqPostDeviceApi["sipTransportType"] | null;
  /** 扩展配置（JSON对象） */
  extraConfig?: Record<string, any>;
  /** 设备密码 */
  password?: string;
};
