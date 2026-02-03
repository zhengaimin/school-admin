import type { GradeCascadeOption } from "@/hooks/useGradeDepartmentClassOptions";

/** 级联下拉选项 */
export type OptionItem = GradeCascadeOption;

/** 学生弹窗类型（用于弹窗模式切换；取值：Add-新增，Edit-编辑，View-查看） */
export type StudentModalType = "Add" | "Edit" | "View";

/** 学生弹窗参数 */
export interface StudentModalParams {
  /** 标题 */
  title: string;
  /** 类型 */
  type: StudentModalType;
  /** 是否显示确认按钮 */
  showConfirm: boolean;
}

/** 导入类型（用于区分导入场景；取值：1-导入学生信息，2-批量导入更新学生信息） */
export type StudentImportType = 1 | 2;

/** 导入失败条目 */
export interface ImportErrorItem {
  /** 行号 */
  index: number;
  /** 姓名 */
  name: string;
  /** 失败原因 */
  reason: string;
}

/** 导入失败信息 */
export interface ImportErrorData {
  /** 失败数量 */
  failCount?: number;
  /** 失败列表 */
  failList?: ImportErrorItem[];
}

/** 导入弹窗接收参数 */
export interface StudentImportAcceptParams {
  /** 导入类型 */
  importType: StudentImportType;
}
