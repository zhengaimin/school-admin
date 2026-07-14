import type { Gift } from "@/api/interface";

import type { TGiftTimeForm, TGiftTimeMode } from "../types";

/** 规范化可选文本 */
function normalizeText(value?: string) {
  const text = value?.trim();
  return text ? text : undefined;
}

/** 规范化可选数字 */
function normalizeNumber(value?: number | "" | null) {
  if (value === "" || value == null || Number.isNaN(Number(value))) {
    return undefined;
  }
  return Number(value);
}

/** 构建新增赠费参数 */
export function buildPostGiftTimePayload(form: Partial<TGiftTimeForm>, mode: TGiftTimeMode, schoolId: number) {
  const payload: Gift.ReqPostGiftsBatchApi = {
    minutes: Number(form.minutes ?? 0),
    expireDate: normalizeText(form.expireDate) ?? "",
    description: normalizeText(form.description)
  };

  if (mode === 1) {
    payload.schoolId = schoolId;
    payload.gradeId = normalizeNumber(form.gradeId);
    payload.departmentId = normalizeNumber(form.departmentId);
    payload.classId = normalizeNumber(form.classId);
    return payload;
  }

  payload.studentIds = (form.studentIds ?? []).map(item => item.id);
  return payload;
}
