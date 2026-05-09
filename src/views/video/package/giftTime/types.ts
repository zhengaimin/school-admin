import type { Student } from "@/api/interface";

export type TGiftTimeMode = 1 | 2;

export interface TGiftTimeModalParams extends TModalParams {
  mode: TGiftTimeMode;
}

export interface TGiftTimeForm {
  studentIds: Student.IStudentItemVo[];
  minutes: number | null;
  expireDate: string;
  description: string;
  gradeId: number | "";
  departmentId: number | "";
  classId: number | "";
}

export interface TGiftTimeStudentFilterForm {
  name: string;
  gradeId: number | "";
  departmentId: number | "";
  classId: number | "";
}
