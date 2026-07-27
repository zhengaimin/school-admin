/** 设备人脸同步状态：PENDING-待处理，SYNCED-已同步，FAILED-同步失败 */
export enum DEVICE_FACE_SYNC_STATUS {
  /** 待处理 */
  PENDING = "PENDING",
  /** 已同步 */
  SYNCED = "SYNCED",
  /** 同步失败 */
  FAILED = "FAILED"
}

export type TDeviceFaceSyncStatusValue = (typeof DEVICE_FACE_SYNC_STATUS)[keyof typeof DEVICE_FACE_SYNC_STATUS];

export const DEVICE_FACE_SYNC_STATUS_I18N: Record<TDeviceFaceSyncStatusValue, string> = {
  [DEVICE_FACE_SYNC_STATUS.PENDING]: "待处理",
  [DEVICE_FACE_SYNC_STATUS.SYNCED]: "已同步",
  [DEVICE_FACE_SYNC_STATUS.FAILED]: "同步失败"
};

export const DEVICE_FACE_SYNC_STATUS_OPTIONS: Array<{ label: string; value: TDeviceFaceSyncStatusValue }> = [
  { label: DEVICE_FACE_SYNC_STATUS_I18N[DEVICE_FACE_SYNC_STATUS.PENDING], value: DEVICE_FACE_SYNC_STATUS.PENDING },
  { label: DEVICE_FACE_SYNC_STATUS_I18N[DEVICE_FACE_SYNC_STATUS.SYNCED], value: DEVICE_FACE_SYNC_STATUS.SYNCED },
  { label: DEVICE_FACE_SYNC_STATUS_I18N[DEVICE_FACE_SYNC_STATUS.FAILED], value: DEVICE_FACE_SYNC_STATUS.FAILED }
];

/** 获取设备人脸同步状态标签类型 */
export const getDeviceFaceSyncStatusTagType = (status: TDeviceFaceSyncStatusValue): "info" | "success" | "danger" | "warning" => {
  const tagTypeMap: Record<TDeviceFaceSyncStatusValue, "info" | "success" | "danger" | "warning"> = {
    [DEVICE_FACE_SYNC_STATUS.PENDING]: "info",
    [DEVICE_FACE_SYNC_STATUS.SYNCED]: "success",
    [DEVICE_FACE_SYNC_STATUS.FAILED]: "danger"
  };
  return tagTypeMap[status] || "info";
};

/** 设备人脸期望动作：UPSERT-同步/更新，DELETE-删除 */
export enum DEVICE_FACE_DESIRED_ACTION {
  /** 同步/更新 */
  UPSERT = "UPSERT",
  /** 删除 */
  DELETE = "DELETE"
}

export type TDeviceFaceDesiredActionValue = (typeof DEVICE_FACE_DESIRED_ACTION)[keyof typeof DEVICE_FACE_DESIRED_ACTION];

export const DEVICE_FACE_DESIRED_ACTION_I18N: Record<TDeviceFaceDesiredActionValue, string> = {
  [DEVICE_FACE_DESIRED_ACTION.UPSERT]: "同步",
  [DEVICE_FACE_DESIRED_ACTION.DELETE]: "删除"
};

export const DEVICE_FACE_DESIRED_ACTION_OPTIONS: Array<{ label: string; value: TDeviceFaceDesiredActionValue }> = [
  { label: DEVICE_FACE_DESIRED_ACTION_I18N[DEVICE_FACE_DESIRED_ACTION.UPSERT], value: DEVICE_FACE_DESIRED_ACTION.UPSERT },
  { label: DEVICE_FACE_DESIRED_ACTION_I18N[DEVICE_FACE_DESIRED_ACTION.DELETE], value: DEVICE_FACE_DESIRED_ACTION.DELETE }
];

/** 人脸同步动作：update-同步/更新，delete-删除 */
export enum FACE_SYNC_ACTION {
  /** 同步/更新 */
  UPDATE = "update",
  /** 删除 */
  DELETE = "delete"
}

export type TFaceSyncActionValue = (typeof FACE_SYNC_ACTION)[keyof typeof FACE_SYNC_ACTION];

export const FACE_SYNC_ACTION_I18N: Record<TFaceSyncActionValue, string> = {
  [FACE_SYNC_ACTION.UPDATE]: "同步/更新",
  [FACE_SYNC_ACTION.DELETE]: "删除"
};

export const FACE_SYNC_ACTION_OPTIONS: Array<{ label: string; value: TFaceSyncActionValue }> = [
  { label: FACE_SYNC_ACTION_I18N[FACE_SYNC_ACTION.UPDATE], value: FACE_SYNC_ACTION.UPDATE },
  { label: FACE_SYNC_ACTION_I18N[FACE_SYNC_ACTION.DELETE], value: FACE_SYNC_ACTION.DELETE }
];

/** 人脸同步失败原因码：NO_PHOTO-学生无照片，INVALID_FACE-人脸不合格，DEVICE_ERROR-设备异常 */
export enum DEVICE_FACE_ERROR_CODE {
  /** 学生无照片 */
  NO_PHOTO = "NO_PHOTO",
  /** 人脸不合格 */
  INVALID_FACE = "INVALID_FACE",
  /** 设备异常 */
  DEVICE_ERROR = "DEVICE_ERROR"
}

export type TDeviceFaceErrorCodeValue = (typeof DEVICE_FACE_ERROR_CODE)[keyof typeof DEVICE_FACE_ERROR_CODE];

export const DEVICE_FACE_ERROR_CODE_I18N: Record<TDeviceFaceErrorCodeValue, string> = {
  [DEVICE_FACE_ERROR_CODE.NO_PHOTO]: "学生无照片",
  [DEVICE_FACE_ERROR_CODE.INVALID_FACE]: "人脸不合格",
  [DEVICE_FACE_ERROR_CODE.DEVICE_ERROR]: "设备异常"
};

export const DEVICE_FACE_ERROR_CODE_OPTIONS: Array<{ label: string; value: TDeviceFaceErrorCodeValue }> = [
  { label: DEVICE_FACE_ERROR_CODE_I18N[DEVICE_FACE_ERROR_CODE.NO_PHOTO], value: DEVICE_FACE_ERROR_CODE.NO_PHOTO },
  { label: DEVICE_FACE_ERROR_CODE_I18N[DEVICE_FACE_ERROR_CODE.INVALID_FACE], value: DEVICE_FACE_ERROR_CODE.INVALID_FACE },
  { label: DEVICE_FACE_ERROR_CODE_I18N[DEVICE_FACE_ERROR_CODE.DEVICE_ERROR], value: DEVICE_FACE_ERROR_CODE.DEVICE_ERROR }
];
