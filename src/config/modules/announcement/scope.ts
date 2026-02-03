/** 公告范围类型：SCHOOL_ALL-全校，GRADE-年级，CLASS-班级 */
export enum ANNOUNCEMENT_SCOPE {
  /** 全校 */
  SCHOOL_ALL = "SCHOOL_ALL",
  /** 年级 */
  GRADE = "GRADE",
  /** 班级 */
  CLASS = "CLASS"
}

export type TAnnouncementScopeValue = (typeof ANNOUNCEMENT_SCOPE)[keyof typeof ANNOUNCEMENT_SCOPE];

export const ANNOUNCEMENT_SCOPE_I18N: Record<TAnnouncementScopeValue, string> = {
  [ANNOUNCEMENT_SCOPE.SCHOOL_ALL]: "全校",
  [ANNOUNCEMENT_SCOPE.GRADE]: "年级",
  [ANNOUNCEMENT_SCOPE.CLASS]: "班级"
};

export const ANNOUNCEMENT_SCOPE_OPTIONS: Array<{ label: string; value: TAnnouncementScopeValue }> = [
  { label: ANNOUNCEMENT_SCOPE_I18N[ANNOUNCEMENT_SCOPE.SCHOOL_ALL], value: ANNOUNCEMENT_SCOPE.SCHOOL_ALL },
  { label: ANNOUNCEMENT_SCOPE_I18N[ANNOUNCEMENT_SCOPE.GRADE], value: ANNOUNCEMENT_SCOPE.GRADE },
  { label: ANNOUNCEMENT_SCOPE_I18N[ANNOUNCEMENT_SCOPE.CLASS], value: ANNOUNCEMENT_SCOPE.CLASS }
];
