/** 下拉选项 */
export interface OptionItem {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
}

/** 家长绑定状态导出参数 */
export type AcceptParamsOptions = TModalParams & {
  /** 学校ID */
  schoolId: number;
  /** 年级ID */
  gradeId?: number;
  /** 班级ID */
  classId?: number;
  /** 学生唯一号 */
  studentNo?: string;
  /** 学生姓名 */
  studentName?: string;
  /** 手机号 */
  phone?: string;
  /** 微信绑定状态 */
  wechatBound?: boolean;
};
