/** 级联选项 */
export interface OptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** 导出表单数据 */
export interface FormData {
  /** 学校 ID */
  schoolId: number;
  /** 学生姓名 */
  studentName: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 年级 ID */
  gradeId: number | null;
  /** 级部 ID */
  departmentId: number | null;
  /** 班级 ID */
  classId: number | null;
}

/** 导出弹窗接收参数 */
export type AcceptParamsOptions = TModalParams & {
  /** 学校 ID */
  schoolId: number;
  /** 学生姓名 */
  studentName?: string;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 年级 ID */
  gradeId?: number | null;
  /** 级部 ID */
  departmentId?: number | null;
  /** 班级 ID */
  classId?: number | null;
  /** 年级选项 */
  gradeOptions?: OptionItem[];
  /** 级部选项 */
  departmentOptions?: OptionItem[];
  /** 班级选项 */
  classOptions?: OptionItem[];
};
