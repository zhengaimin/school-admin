import type { TDeviceTypeValue } from "@/config/modules/device";
import type { TPackageRecordStatusValue, TPackageTypeValue } from "@/config/modules/package";

/** 弹窗类型（用于弹窗模式切换；取值：Add-新增，Edit-编辑，View-查看） */
export type PackagePurchaseModalType = "Add" | "Edit" | "View";

/** 弹窗参数 */
export interface PackagePurchaseModalParams {
  /** 标题 */
  title: string;
  /** 类型 */
  type: PackagePurchaseModalType;
  /** 是否显示确认按钮 */
  showConfirm: boolean;
}

/** 导出选项 */
export interface ExportOptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** 导出表单数据 */
export interface PackagePurchaseExportFormData {
  /** 学校ID */
  schoolId: number;
  /** 学生关键词 */
  studentKeyword: string;
  /** 订单号 */
  orderNo: string;
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
  /** 年级ID */
  gradeId: number | null;
  /** 级部ID */
  departmentId: number | null;
  /** 班级ID */
  classId: number | null;
  /** 套餐状态 */
  status: TPackageRecordStatusValue | null;
  /** 套餐类型 */
  packageType: TPackageTypeValue | null;
  /** 最低价格 */
  minPrice: number | undefined;
  /** 最高价格 */
  maxPrice: number | undefined;
}

/** 导出弹窗接收参数 */
export interface PackagePurchaseExportAcceptPayloadOptions {
  /** 学校ID */
  schoolId: number;
  /** 学生关键词 */
  studentKeyword?: string;
  /** 订单号 */
  orderNo?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 年级ID */
  gradeId?: number | null;
  /** 级部ID */
  departmentId?: number | null;
  /** 班级ID */
  classId?: number | null;
  /** 套餐状态 */
  status?: TPackageRecordStatusValue | null;
  /** 套餐类型 */
  packageType?: TPackageTypeValue | null;
  /** 最低价格 */
  minPrice?: number;
  /** 最高价格 */
  maxPrice?: number;
  /** 年级选项 */
  gradeOptions?: ExportOptionItem[];
  /** 级部选项 */
  departmentOptions?: ExportOptionItem[];
  /** 班级选项 */
  classOptions?: ExportOptionItem[];
}

/** 导出弹窗接收参数（包含弹窗信息） */
export interface PackagePurchaseExportAcceptParams
  extends PackagePurchaseExportAcceptPayloadOptions,
    PackagePurchaseModalParams {}

/** 导出弹窗接收结果 */
export interface PackagePurchaseExportAcceptPayloadResult {
  /** 表单数据 */
  formData: PackagePurchaseExportFormData;
  /** 年级选项 */
  gradeOptions: ExportOptionItem[];
  /** 级部选项 */
  departmentOptions: ExportOptionItem[];
  /** 班级选项 */
  classOptions: ExportOptionItem[];
}

/** 导出请求参数 */
export interface PackagePurchaseExportRequestParamsOptions {
  /** 表单数据 */
  formData: PackagePurchaseExportFormData;
  /** 页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 设备类型 */
  deviceType: TDeviceTypeValue;
}
