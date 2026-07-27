/** 学生信息下发动作 */
export enum STUDENT_DEVICE_CONTROL_ACTION {
  /** 新增单个学生 */
  ADD_USER_INFO = "add_user_info",
  /** 更新单个学生 */
  UPDATE_USER_INFO = "update_user_info",
  /** 删除单个学生 */
  DELETE_USER_INFO = "delete_user_info"
}

export type TStudentDeviceControlActionValue = (typeof STUDENT_DEVICE_CONTROL_ACTION)[keyof typeof STUDENT_DEVICE_CONTROL_ACTION];

export const STUDENT_DEVICE_CONTROL_ACTION_I18N: Record<TStudentDeviceControlActionValue, string> = {
  [STUDENT_DEVICE_CONTROL_ACTION.ADD_USER_INFO]: "新增人脸信息到设备",
  [STUDENT_DEVICE_CONTROL_ACTION.UPDATE_USER_INFO]: "更新人脸到设备",
  [STUDENT_DEVICE_CONTROL_ACTION.DELETE_USER_INFO]: "删除人脸"
};

export const STUDENT_DEVICE_CONTROL_ACTION_OPTIONS: Array<{
  label: string;
  value: TStudentDeviceControlActionValue;
}> = [
  {
    label: STUDENT_DEVICE_CONTROL_ACTION_I18N[STUDENT_DEVICE_CONTROL_ACTION.ADD_USER_INFO],
    value: STUDENT_DEVICE_CONTROL_ACTION.ADD_USER_INFO
  },
  {
    label: STUDENT_DEVICE_CONTROL_ACTION_I18N[STUDENT_DEVICE_CONTROL_ACTION.UPDATE_USER_INFO],
    value: STUDENT_DEVICE_CONTROL_ACTION.UPDATE_USER_INFO
  },
  {
    label: STUDENT_DEVICE_CONTROL_ACTION_I18N[STUDENT_DEVICE_CONTROL_ACTION.DELETE_USER_INFO],
    value: STUDENT_DEVICE_CONTROL_ACTION.DELETE_USER_INFO
  }
];
