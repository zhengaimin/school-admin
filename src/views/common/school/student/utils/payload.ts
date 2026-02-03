import type { FamilyContact, Student } from "@/api/interface";
import { STUDENT_TYPE } from "@/config/modules";

/** 处理文本字段 */
function trimText(value?: string) {
  const result = value?.trim();
  return result ? result : undefined;
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
    sex: trimText(form.sex),
    cardNumber: trimText(form.cardNumber),
    phone: trimText(form.phone),
    guardianName: trimText(form.guardianName),
    guardianPhone: trimText(form.guardianPhone),
    studentType: form.studentType ?? STUDENT_TYPE.BOARDING,
    faceImageUrl: trimText(form.faceImageUrl),
    address: trimText(form.address)
  };
  return payload;
}

/** 构建更新学生参数 */
export function buildPutStudentPayload(form: Partial<Student.ReqPutStudentApi>) {
  const payload: Student.ReqPutStudentApi = {
    schoolId: form.schoolId != null ? Number(form.schoolId) : undefined,
    gradeId: form.gradeId != null ? Number(form.gradeId) : undefined,
    departmentId: form.departmentId != null && String(form.departmentId) !== "" ? Number(form.departmentId) : -1,
    classId: form.classId != null ? Number(form.classId) : undefined,
    name: form.name != null ? form.name.trim() : undefined,
    uuid: form.uuid != null ? form.uuid.trim() : undefined,
    studentCode: trimText(form.studentCode),
    idCard: trimText(form.idCard),
    sex: trimText(form.sex),
    cardNumber: trimText(form.cardNumber),
    phone: trimText(form.phone),
    guardianName: trimText(form.guardianName),
    guardianPhone: trimText(form.guardianPhone),
    studentType: form.studentType,
    faceImageUrl: trimText(form.faceImageUrl),
    address: trimText(form.address)
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
