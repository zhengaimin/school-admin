/** 公告状态：1-已发布，2-已下架 */
export enum ANNOUNCEMENT_STATUS {
  /** 已发布 */
  PUBLISHED = 1,
  /** 已下架 */
  REVOKED = 2
}

export type TAnnouncementStatusValue = (typeof ANNOUNCEMENT_STATUS)[keyof typeof ANNOUNCEMENT_STATUS];

export const ANNOUNCEMENT_STATUS_I18N: Record<TAnnouncementStatusValue, string> = {
  [ANNOUNCEMENT_STATUS.PUBLISHED]: "已发布",
  [ANNOUNCEMENT_STATUS.REVOKED]: "已下架"
};

export const ANNOUNCEMENT_STATUS_OPTIONS: Array<{ label: string; value: TAnnouncementStatusValue }> = [
  { label: ANNOUNCEMENT_STATUS_I18N[ANNOUNCEMENT_STATUS.PUBLISHED], value: ANNOUNCEMENT_STATUS.PUBLISHED },
  { label: ANNOUNCEMENT_STATUS_I18N[ANNOUNCEMENT_STATUS.REVOKED], value: ANNOUNCEMENT_STATUS.REVOKED }
];

export const getAnnouncementStatusTagType = (status: TAnnouncementStatusValue): "success" | "info" => {
  const tagTypeMap: Record<TAnnouncementStatusValue, "success" | "info"> = {
    [ANNOUNCEMENT_STATUS.PUBLISHED]: "success",
    [ANNOUNCEMENT_STATUS.REVOKED]: "info"
  };
  return tagTypeMap[status] || "info";
};
