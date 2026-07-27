import type { TEnableStatusValue } from "@/config/modules";

/** 设备组表单 */
export interface DeviceGroupForm {
  /** 设备组ID */
  id?: number;
  /** 设备组名称 */
  name: string;
  /** 设备组编码 */
  code: string;
  /** 是否VOIP组 */
  isVoipGroup: boolean;
  /** 学校ID */
  schoolId?: number;
  /** 状态 */
  status?: TEnableStatusValue;
  /** 描述 */
  description: string;
}
