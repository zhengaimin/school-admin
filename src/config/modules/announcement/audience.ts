/** 公告受众类型：PARENT-家长，PUBLIC_SCREEN-话机 */
export enum ANNOUNCEMENT_AUDIENCE {
  /** 家长 */
  PARENT = "PARENT",
  /** 话机 */
  PUBLIC_SCREEN = "PUBLIC_SCREEN"
}

export type TAnnouncementAudienceValue = (typeof ANNOUNCEMENT_AUDIENCE)[keyof typeof ANNOUNCEMENT_AUDIENCE];

export const ANNOUNCEMENT_AUDIENCE_I18N: Record<TAnnouncementAudienceValue, string> = {
  [ANNOUNCEMENT_AUDIENCE.PARENT]: "家长",
  [ANNOUNCEMENT_AUDIENCE.PUBLIC_SCREEN]: "话机"
};

export const ANNOUNCEMENT_AUDIENCE_OPTIONS: Array<{ label: string; value: TAnnouncementAudienceValue }> = [
  { label: ANNOUNCEMENT_AUDIENCE_I18N[ANNOUNCEMENT_AUDIENCE.PARENT], value: ANNOUNCEMENT_AUDIENCE.PARENT },
  { label: ANNOUNCEMENT_AUDIENCE_I18N[ANNOUNCEMENT_AUDIENCE.PUBLIC_SCREEN], value: ANNOUNCEMENT_AUDIENCE.PUBLIC_SCREEN }
];
