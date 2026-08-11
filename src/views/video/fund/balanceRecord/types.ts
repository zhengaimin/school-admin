import type { BalanceRecord, GiftBalance } from "@/api/interface";

/** 级联选项 */
export interface BalanceRecordOptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** 导出表单数据 */
export interface BalanceRecordExportFormData {
  /** 学校ID */
  schoolId: number;
  /** 设备类型 */
  deviceType: BalanceRecord.ReqGetBalanceRecordExportInfoApi["deviceType"];
  /** 导出文件名 */
  exportFileName: string;
  /** 学生关键词 */
  studentKeyword: string;
  /** 学生UUID */
  studentUuid: string;
  /** 可用余额下限 */
  minBalance: string;
  /** 可用余额上限 */
  maxBalance: string;
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
  /** 账户状态 */
  status: BalanceRecord.ReqGetBalanceRecordExportInfoApi["status"] | null;
}

/** 导出弹窗接收参数 */
export interface BalanceRecordExportAcceptParams extends TModalParams {
  /** 学校ID */
  schoolId: number;
  /** 设备类型 */
  deviceType: BalanceRecord.ReqGetBalanceRecordExportInfoApi["deviceType"];
  /** 导出文件名 */
  exportFileName: string;
  /** 学生关键词 */
  studentKeyword?: string;
  /** 学生UUID */
  studentUuid?: string;
  /** 可用余额下限 */
  minBalance?: string;
  /** 可用余额上限 */
  maxBalance?: string;
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
  /** 账户状态 */
  status?: BalanceRecord.ReqGetBalanceRecordExportInfoApi["status"] | null;
  /** 年级选项 */
  gradeOptions?: BalanceRecordOptionItem[];
  /** 级部选项 */
  departmentOptions?: BalanceRecordOptionItem[];
  /** 班级选项 */
  classOptions?: BalanceRecordOptionItem[];
}

/** 赠费余额导入弹窗接收参数。 */
export interface GiftBalanceImportAcceptParams extends TModalParams {
  /** 默认设备类型。 */
  deviceType: GiftBalance.TGiftBalanceDeviceTypeValue;
}
