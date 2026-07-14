import type { Grade } from "@/api/interface";
import type { TGradeForm } from "../types";

/** 构建新增年级参数 */
export function buildPostGradePayload(form: TGradeForm, schoolId: number): Grade.ReqPostGradeApi {
  return {
    name: String(form.name || "").trim(),
    enrollYear: Number(form.enrollYear),
    schoolId,
    description: String(form.description || "").trim(),
    isGraduated: form.isGraduated!
  };
}

/** 构建更新年级参数 */
export function buildPutGradePayload(form: TGradeForm): Grade.ReqPutUpdateGradeApi {
  return {
    name: String(form.name || "").trim(),
    enrollYear: Number(form.enrollYear),
    schoolId: form.schoolId,
    description: String(form.description || "").trim(),
    isGraduated: form.isGraduated!
  };
}
