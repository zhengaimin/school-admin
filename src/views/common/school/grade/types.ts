import type { Grade } from "@/api/interface";
import type { TEnableStatusValue } from "@/config/modules";

export type TGradeForm = Partial<Omit<Grade.ReqPostGradeApi, "enrollYear">> & {
  /** 年级ID */
  id?: number;
  /** 入学年份 */
  enrollYear?: number | string;
  /** 状态：0-禁用，1-启用 */
  status?: TEnableStatusValue;
};
