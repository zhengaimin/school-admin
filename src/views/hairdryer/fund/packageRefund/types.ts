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
  /** 学生关键词 */
  studentKeyword: string;
  /** 退款单号 */
  refundNo: string;
  /** 退款状态 */
  status: number | null;
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
}

/** 导出弹窗接收参数 */
export type AcceptParamsOptions = TModalParams & {
  /** 学校ID */
  schoolId: number;
  /** 学生关键词 */
  studentKeyword?: string;
  /** 退款单号 */
  refundNo?: string;
  /** 退款状态 */
  status?: number | null;
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
  /** 年级选项 */
  gradeOptions?: OptionItem[];
  /** 级部选项 */
  departmentOptions?: OptionItem[];
  /** 班级选项 */
  classOptions?: OptionItem[];
};
