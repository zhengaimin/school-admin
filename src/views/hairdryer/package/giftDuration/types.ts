/** 赠送状态：1-有效 2-已用完 3-已过期 4-已取消 */
export type GiftStatus = 1 | 2 | 3 | 4;

/** 赠送模式：range-按范围 students-按学生 */
export type GiftGrantMode = "range" | "students";

/** 下拉选项 */
export interface OptionItem {
  id: number;
  name: string;
}

/** 学生信息 */
export interface StudentItem {
  id: number;
  name: string;
  studentCode?: string;
  gradeName?: string;
  departmentName?: string;
  className?: string;
  schoolName?: string;
  sex?: string;
  idCard?: string;
}

/** 赠送记录行数据 */
export interface GiftRow {
  id: number;
  schoolName: string;
  studentName: string;
  totalMinutes: number;
  usedMinutes: number;
  remainingMinutes: number;
  startDate: string;
  expireDate: string;
  status: GiftStatus;
  description?: string;
}
