/** 赠送状态（用于列表展示与筛选；取值：1-有效，2-已用完，3-已过期，4-已取消） */
export type GiftStatus = 1 | 2 | 3 | 4;

/** 赠送模式（用于控制弹窗展示；取值：range-按范围，students-按学生） */
export type GiftGrantMode = "range" | "students";

/** 下拉选项 */
export interface OptionItem {
  /** ID */
  id: number;
  /** 名称 */
  name: string;
}

/** 学生信息 */
export interface StudentItem {
  /** 学生ID */
  id: number;
  /** 学生姓名 */
  name: string;
  /** 学号 */
  studentCode?: string;
  /** 年级名称 */
  gradeName?: string;
  /** 级部名称 */
  departmentName?: string;
  /** 班级名称 */
  className?: string;
  /** 学校名称 */
  schoolName?: string;
  /** 性别 */
  sex?: string;
  /** 身份证号 */
  idCard?: string;
}

/** 赠送记录行数据 */
export interface GiftRow {
  /** 记录ID */
  id: number;
  /** 学校名称 */
  schoolName: string;
  /** 学生姓名 */
  studentName: string;
  /** 赠送总分钟数 */
  totalMinutes: number;
  /** 已使用分钟数 */
  usedMinutes: number;
  /** 剩余分钟数 */
  remainingMinutes: number;
  /** 生效日期 */
  startDate: string;
  /** 过期日期 */
  expireDate: string;
  /** 状态 */
  status: GiftStatus;
  /** 备注 */
  description?: string;
}

/** 学生选择弹窗参数 */
export interface StudentSelectProps {
  /** 年级选项数据 */
  gradeOptions?: OptionItem[];
  /** 弹窗标题 */
  title?: string;
}

/** 赠费弹窗参数 */
export interface GrantGiftProps {
  /** 赠费模式 */
  mode: GiftGrantMode;
  /** 弹窗标题 */
  title: string;
}
