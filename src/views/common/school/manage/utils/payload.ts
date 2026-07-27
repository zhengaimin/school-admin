import type { School } from "@/api/interface";

/** 处理文本字段 */
function normalizeText(value?: string) {
  return value?.trim();
}

/** 构建新增学校参数 */
export function buildPostSchoolPayload(form: Partial<School.ISchoolItem>, tenantId: number): School.ReqPostSchoolApi {
  return {
    name: (form.name ?? "").trim(),
    tenantId,
    address: normalizeText(form.address),
    phone: normalizeText(form.phone),
    principal: normalizeText(form.principal),
    description: normalizeText(form.description),
    motto: normalizeText(form.motto),
    principalIntro: normalizeText(form.principalIntro),
    badge: normalizeText(form.badge),
    background: normalizeText(form.background),
    photos: form.photos,
    scoreUrl: normalizeText(form.scoreUrl)
  };
}

/** 构建更新学校参数 */
export function buildPutSchoolPayload(form: Partial<School.ISchoolItem>): School.ReqPutSchoolApi {
  return {
    name: normalizeText(form.name),
    address: normalizeText(form.address),
    phone: normalizeText(form.phone),
    principal: normalizeText(form.principal),
    description: normalizeText(form.description),
    motto: normalizeText(form.motto),
    principalIntro: normalizeText(form.principalIntro),
    badge: normalizeText(form.badge),
    background: normalizeText(form.background),
    photos: form.photos,
    scoreUrl: normalizeText(form.scoreUrl),
    status: -1,
    sort: -1
  };
}
