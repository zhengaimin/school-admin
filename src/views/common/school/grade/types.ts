import type { Grade } from "@/api/interface";

export type TGradeForm = Partial<Omit<Grade.ReqPostGradeApi, "enrollYear">> & {
  /** 年级ID */
  id?: number;
  /** 入学年份 */
  enrollYear?: number | string;
};
