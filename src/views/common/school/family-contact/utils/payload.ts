import type { FamilyContact } from "@/api/interface";
import { isNullOrUnDef } from "@/utils/is";

/** Trim text and convert empty string to undefined. */
function normalizeText(value?: string) {
  const text = value?.trim();
  return text ? text : undefined;
}

/** Parse number and ignore invalid values. */
function normalizeNumber(value?: number | string | null) {
  if (isNullOrUnDef(value) || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Convert -1 to undefined for id-like filters. */
function normalizeFilterId(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (isNullOrUnDef(parsed) || parsed === -1) return undefined;
  return parsed;
}

/** Normalize relationship filter. */
function normalizeRelationship(value?: number | string | null) {
  const parsed = normalizeNumber(value);
  if (isNullOrUnDef(parsed) || parsed === -1) return undefined;
  return parsed as FamilyContact.ReqGetFamilyContactsApi["relationship"];
}

/** Normalize isPrimary filter: -1->undefined, 1->primary, 0->non-primary. */
function normalizeIsPrimary(value?: number | string | boolean | null) {
  if (isNullOrUnDef(value) || value === "" || value === -1 || value === "-1") return undefined;
  if (value === true || value === 1 || value === "1") return 1;
  if (value === false || value === 0 || value === "0") return 0;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;
  return parsed === 1 ? 1 : 0;
}

/** Build family contact list query payload. */
export function buildFamilyContactListParams(params: Record<string, any>): FamilyContact.ReqGetFamilyContactsApi {
  return {
    page: normalizeNumber(params.page),
    pageSize: normalizeNumber(params.pageSize),
    studentId: normalizeFilterId(params.studentId),
    phone: normalizeText(params.phone),
    relationship: normalizeRelationship(params.relationship),
    schoolId: normalizeFilterId(params.schoolId),
    isPrimary: normalizeIsPrimary(params.isPrimary)
  };
}

/** Build create payload. */
export function buildPostFamilyContactPayload(
  form: Partial<FamilyContact.ReqPostFamilyContactApi>
): FamilyContact.ReqPostFamilyContactApi {
  return {
    studentId: Number(form.studentId),
    relationship: Number(form.relationship) as FamilyContact.ReqPostFamilyContactApi["relationship"],
    nickname: (form.nickname ?? "").trim(),
    phone: (form.phone ?? "").trim(),
    isPrimary: Boolean(form.isPrimary),
    sortOrder: Number(form.sortOrder ?? 0)
  };
}

/** Build update payload. */
export function buildPutFamilyContactPayload(
  form: Partial<FamilyContact.ReqPutFamilyContactApi>
): FamilyContact.ReqPutFamilyContactApi {
  return {
    relationship: Number(form.relationship) as FamilyContact.ReqPutFamilyContactApi["relationship"],
    nickname: (form.nickname ?? "").trim(),
    phone: (form.phone ?? "").trim(),
    isPrimary: Boolean(form.isPrimary),
    sortOrder: Number(form.sortOrder ?? 0)
  };
}

/** Build set-primary payload. */
export function buildFamilyContactPrimaryPayload(contactId: number): FamilyContact.ReqPutFamilyContactPrimaryApi {
  return { contactId: Number(contactId) };
}
