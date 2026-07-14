/** 套餐购买记录状态：1-待激活，2-已激活，3-已暂停，4-已过期，5-已取消 */
export enum PACKAGE_RECORD_STATUS {
  /** 待激活 */
  PENDING = 1,
  /** 已激活 */
  ACTIVATED = 2,
  /** 已暂停 */
  PAUSED = 3,
  /** 已过期 */
  EXPIRED = 4,
  /** 已取消 */
  CANCELLED = 5
}

export type TPackageRecordStatusValue = (typeof PACKAGE_RECORD_STATUS)[keyof typeof PACKAGE_RECORD_STATUS];

export const PACKAGE_RECORD_STATUS_I18N: Record<TPackageRecordStatusValue, string> = {
  [PACKAGE_RECORD_STATUS.PENDING]: "待激活",
  [PACKAGE_RECORD_STATUS.ACTIVATED]: "已激活",
  [PACKAGE_RECORD_STATUS.PAUSED]: "已暂停",
  [PACKAGE_RECORD_STATUS.EXPIRED]: "已过期",
  [PACKAGE_RECORD_STATUS.CANCELLED]: "已取消"
};

export const PACKAGE_RECORD_STATUS_OPTIONS: Array<{ label: string; value: TPackageRecordStatusValue }> = [
  { label: PACKAGE_RECORD_STATUS_I18N[PACKAGE_RECORD_STATUS.PENDING], value: PACKAGE_RECORD_STATUS.PENDING },
  { label: PACKAGE_RECORD_STATUS_I18N[PACKAGE_RECORD_STATUS.ACTIVATED], value: PACKAGE_RECORD_STATUS.ACTIVATED },
  { label: PACKAGE_RECORD_STATUS_I18N[PACKAGE_RECORD_STATUS.PAUSED], value: PACKAGE_RECORD_STATUS.PAUSED },
  { label: PACKAGE_RECORD_STATUS_I18N[PACKAGE_RECORD_STATUS.EXPIRED], value: PACKAGE_RECORD_STATUS.EXPIRED },
  { label: PACKAGE_RECORD_STATUS_I18N[PACKAGE_RECORD_STATUS.CANCELLED], value: PACKAGE_RECORD_STATUS.CANCELLED }
];

/** 获取套餐购买记录状态的 Tag 类型 */
export const getPackageRecordStatusTagType = (status: TPackageRecordStatusValue) => {
  switch (status) {
    case PACKAGE_RECORD_STATUS.PENDING:
      return "warning";
    case PACKAGE_RECORD_STATUS.ACTIVATED:
      return "success";
    case PACKAGE_RECORD_STATUS.PAUSED:
      return "info";
    case PACKAGE_RECORD_STATUS.EXPIRED:
      return "danger";
    case PACKAGE_RECORD_STATUS.CANCELLED:
      return "info";
    default:
      return "info";
  }
};
