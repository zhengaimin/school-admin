import type { DeviceDialConfig } from "@/api/interface";
import type { TPhoneTypeValue, TSipTypeValue, TYesNoFlagValue } from "@/config/modules";

/** 公话配置行数据 */
export type TDeviceDialConfigItem = DeviceDialConfig.IDeviceDialConfigVo;

/** 公话配置详情 */
export type TDeviceDialConfigDetail = DeviceDialConfig.IDeviceDialConfigVo;

/** 控制弹窗参数 */
export interface ControlModalProps {
  /** 学校名称 */
  schoolName?: string;
}

/** 禁拨时间段 */
export type ForbidCallTimeItem = {
  /** 开始时间 */
  fstTime: string;
  /** 结束时间 */
  fendTime: string;
};

/** 公话配置表单 */
export type DialConfigForm = {
  /** 配置ID */
  id?: number;
  /** 学校ID */
  schoolId: number | "";
  /** 心跳时间 */
  heartbeatFrequency: number | "";
  /** 单次通话时长 */
  callTime: number | "";
  /** 定时开机 */
  powerOnTime: string;
  /** 定时关机 */
  powerOffTime: string;
  /** 禁拨号码 */
  forbidPhone: string;
  /** 拨号类型 */
  phoneType: TPhoneTypeValue;
  /** 是否显示留言按钮 */
  messageFlag: TYesNoFlagValue;
  /** 是否启用语音留言 */
  messageSoundFlag: TYesNoFlagValue;
  /** 心理咨询身份认证 */
  mhcFlag: TYesNoFlagValue;
  /** 刷脸记录人员信息 */
  addPunchFace: TYesNoFlagValue;
  /** 禁拨时间列表 */
  forbidCallTimesAry: ForbidCallTimeItem[];
  /** 禁拨时间字符串 */
  forbidCallTimes: string;
  /** SIP 服务地址 */
  sipDomain: string;
  /** SIP 密码 */
  sipPassword: string;
  /** SIP 传输类型 */
  sipTransportType: TSipTypeValue | "";
  /** SIP 用户名 */
  sipUserName: string;
};
