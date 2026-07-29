import type { TRoleLevelValue } from "@/config/modules";

import { ROLE_LEVEL } from "@/config/modules";

/** 当前角色层级可创建的下级角色层级 */
export const CREATABLE_ROLE_LEVELS: Record<TRoleLevelValue, TRoleLevelValue[]> = {
  [ROLE_LEVEL.SUPER]: [ROLE_LEVEL.PLATFORM, ROLE_LEVEL.AGENT, ROLE_LEVEL.CUSTOM],
  [ROLE_LEVEL.PLATFORM]: [ROLE_LEVEL.AGENT, ROLE_LEVEL.CUSTOM],
  [ROLE_LEVEL.AGENT]: [ROLE_LEVEL.CUSTOM],
  [ROLE_LEVEL.CUSTOM]: []
};

/** 权限模块中文名称 */
export const PERMISSION_MODULE_I18N: Record<string, string> = {
  user: "用户管理",
  role: "角色管理",
  permission: "权限管理",
  org: "组织架构",
  tenant: "租户管理",
  school: "学校管理",
  device: "设备管理",
  deviceGroup: "设备组管理",
  deviceTag: "设备标签管理",
  apk: "APK 包管理",
  apk_message_template: "APK 错误话术",
  apkHomepageLayout: "APK 首页布局",
  deviceEventLog: "设备事件日志",
  grade: "年级管理",
  department: "级部管理",
  class: "班级管理",
  student: "学生管理",
  familyContact: "亲情号管理",
  familyBindStatus: "家长绑定状态",
  callRecord: "通话记录",
  deviceUsage: "设备使用记录",
  usage_analytics: "设备运营统计分析",
  dryerCardRecharge: "吹风机圈存记录",
  message: "留言管理",
  payment: "支付管理",
  refund: "退款管理",
  packageRecord: "套餐记录",
  balance: "学生余额",
  gift: "赠费管理",
  config: "配置管理",
  apikey: "API 密钥",
  miniapp: "小程序模块",
  announcement: "公告管理",
  schoolMien: "校园风采"
};
