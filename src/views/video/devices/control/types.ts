import type { DeviceDialConfig } from "@/api/interface";
import type { TDialModeValue, TPhoneEntryValue, TPhoneTypeValue, TSipTypeValue, TYesNoFlagValue } from "@/config/modules";

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
  /** 客服电话 */
  customerServicePhone: string;
  /** 心跳时间 */
  heartbeatFrequency: number | "";
  /** 单次通话时长 */
  callTime: number | null;
  /** 定时开机 */
  powerOnTime: string;
  /** 定时关机 */
  powerOffTime: string;
  /** 禁拨号码 */
  forbidPhone: string;
  /** 拨号类型（已废弃，仅用于兼容旧数据） */
  phoneType?: TPhoneTypeValue;
  /** 拨号模式 */
  dialMode: TDialModeValue;
  /** 拨号入口集合 */
  phoneTypes: TPhoneEntryValue[];
  /** 是否显示留言按钮 */
  messageFlag: TYesNoFlagValue;
  /** 是否全量同步人脸 */
  downloadUserFlag: TYesNoFlagValue;
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
  /** 禁止呼入 */
  callIncomingDisabled: TYesNoFlagValue;
  /** 开启人脸 */
  faceEnabled: TYesNoFlagValue;
  /** SOS 标题 */
  sosTitle: string;
  /** 第三方地址 */
  thirdPartyUrl: string;
  /** 吹风机圈存开关 */
  dryerCardRechargeEnabled: TYesNoFlagValue;
  /** 吹风机圈存金额（单位元，逗号分隔） */
  dryerCardRechargeAmountOptions: string;
};
