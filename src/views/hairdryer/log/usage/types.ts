import type { TDeviceUsageStatusValue } from "@/config/modules/device";

/** 选项结构 */
export interface OptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** 导出表单数据 */
export interface FormData {
  /** 学校ID */
  schoolId: number;
  /** 学生姓名 */
  studentName: string;
  /** 订单号 */
  orderNo: string;
  /** 设备序列号 */
  deviceSn: string;
  /** 使用状态 */
  status: TDeviceUsageStatusValue | null;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 年级ID */
  gradeId: number | null;
  /** 级部ID */
  departmentId: number | null;
  /** 班级ID */
  classId: number | null;
}

/** 导出弹窗接收参数 */
export interface AcceptParamsOptions {
  /** 标题 */
  title: string;
  /** 弹窗类型 */
  type: "Add" | "Edit" | "View";
  /** 是否显示确认按钮 */
  showConfirm: boolean;
  /** 学校ID */
  schoolId: number;
  /** 学生姓名 */
  studentName?: string;
  /** 订单号 */
  orderNo?: string;
  /** 设备序列号 */
  deviceSn?: string;
  /** 使用状态 */
  status?: TDeviceUsageStatusValue | null;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 年级ID */
  gradeId?: number | null;
  /** 级部ID */
  departmentId?: number | null;
  /** 班级ID */
  classId?: number | null;
  /** 年级选项 */
  gradeOptions?: OptionItem[];
  /** 级部选项 */
  departmentOptions?: OptionItem[];
  /** 班级选项 */
  classOptions?: OptionItem[];
}
