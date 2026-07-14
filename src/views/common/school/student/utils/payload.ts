import type { FamilyContact, Student } from "@/api/interface";
import type { TStudentSexValue } from "@/config/modules";
import { STUDENT_SEX, STUDENT_STATUS, STUDENT_TYPE } from "@/config/modules";

/** 处理文本字段 */
function trimText(value?: string) {
  const result = value?.trim();
  return result ? result : undefined;
}

/** 处理必填文本字段 */
function trimRequiredText(value?: string) {
  return (value ?? "").trim();
}

/** 处理学生性别字段 */
function normalizeStudentSex(value?: string) {
  const normalizedValue = trimText(value);
  if (!normalizedValue) {
    return undefined;
  }
  const studentSexList: TStudentSexValue[] = [STUDENT_SEX.MALE, STUDENT_SEX.FEMALE];
  return studentSexList.includes(normalizedValue as TStudentSexValue) ? (normalizedValue as TStudentSexValue) : undefined;
}

/** 构建新增学生参数 */
export function buildPostStudentPayload(form: Partial<Student.ReqPostStudentApi>) {
  const payload: Student.ReqPostStudentApi = {
    schoolId: Number(form.schoolId),
    gradeId: Number(form.gradeId),
    departmentId: form.departmentId != null && String(form.departmentId) !== "" ? Number(form.departmentId) : -1,
    classId: Number(form.classId),
    name: (form.name ?? "").trim(),
    uuid: (form.uuid ?? "").trim(),
    studentCode: trimText(form.studentCode),
    idCard: trimText(form.idCard),
    sex: normalizeStudentSex(form.sex),
    cardNumber: trimText(form.cardNumber),
    phone: trimText(form.phone),
    guardianName: trimText(form.guardianName),
    guardianPhone: trimText(form.guardianPhone),
    studentType: form.studentType ?? STUDENT_TYPE.BOARDING,
    faceImageUrl: trimText(form.faceImageUrl),
    address: trimText(form.address),
    status: form.status ?? STUDENT_STATUS.ACTIVE
  };
  return payload;
}

/** 构建更新学生参数 */
export function buildPutStudentPayload(form: Partial<Student.ReqPutStudentApi>) {
  const payload: Student.ReqPutStudentApi = {
    name: trimRequiredText(form.name),
    studentCode: trimText(form.studentCode),
    sex: normalizeStudentSex(form.sex),
    idCard: trimText(form.idCard),
    cardNumber: trimText(form.cardNumber),
    phone: trimText(form.phone),
    address: trimText(form.address),
    guardianName: trimText(form.guardianName),
    guardianPhone: trimText(form.guardianPhone),
    studentType: form.studentType ?? STUDENT_TYPE.BOARDING,
    status: form.status ?? STUDENT_STATUS.ACTIVE,
    faceImageUrl: trimText(form.faceImageUrl)
  };
  return payload;
}

/** 构建新增亲情号参数 */
export function buildPostFamilyContactPayload(form: Partial<FamilyContact.ReqPostFamilyContactApi>) {
  const payload: FamilyContact.ReqPostFamilyContactApi = {
    studentId: Number(form.studentId),
    relationship: form.relationship as FamilyContact.ReqPostFamilyContactApi["relationship"],
    nickname: (form.nickname ?? "").trim(),
    phone: (form.phone ?? "").trim(),
    isPrimary: Boolean(form.isPrimary),
    sortOrder: Number(form.sortOrder ?? 0)
  };
  return payload;
}

/** 构建更新亲情号参数 */
export function buildPutFamilyContactPayload(form: Partial<FamilyContact.ReqPutFamilyContactApi>) {
  const payload: FamilyContact.ReqPutFamilyContactApi = {
    relationship: form.relationship as FamilyContact.ReqPutFamilyContactApi["relationship"],
    nickname: (form.nickname ?? "").trim(),
    phone: (form.phone ?? "").trim(),
    isPrimary: Boolean(form.isPrimary),
    sortOrder: Number(form.sortOrder ?? 0)
  };
  return payload;
}
