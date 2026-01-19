/** 模块选择 */
export const ROUTE_MODULE_SELECT = "/moduleSelect";

/** 公共模块路由 */
export const ROUTE_COMMON = {
  /** 学校管理 */
  SCHOOL: "/common/school",
  /** 设备配置 */
  SCHOOL_DEVICE_CONFIG: "/common/schoolDeviceConfig"
} as const;

/** 校园管理模块路由 */
export const ROUTE_INTERNAL_PAGE = {
  /** 年级管理 */
  GRADE: "/InternalPage/grade",
  /** 级部管理 */
  DEPARTMENT: "/InternalPage/department",
  /** 班级管理 */
  CLASS: "/InternalPage/class"
} as const;

/** 话机模块路由 */
export const ROUTE_VIDEO = {
  /** 费率配置 */
  RATE: "/video/rate",
  RATE_SCHOOL_CALL: "/video/rate/schoolCall",
  RATE_SCHOOL_MESSAGE: "/video/rate/schoolMessage",
  RATE_GRADE_CALL: "/video/rate/gradeCall",
  RATE_GRADE_MESSAGE: "/video/rate/gradeMessage",

  /** 套餐配置 */
  PACKAGE: "/video/package",
  PACKAGE_GRADE_GENERAL: "/video/package/gradeGeneral",
  PACKAGE_GRADE_FIXED: "/video/package/gradeFixed",
  PACKAGE_GIFT_TIME: "/video/package/giftTime",

  /** 商户号配置 */
  MERCHANT: "/video/merchant"
} as const;

/** 系统管理模块路由 */
export const ROUTE_SYSTEM = {
  /** 系统管理 */
  INDEX: "/system",
  /** 角色管理 */
  ROLE: "/permission/role",
  /** 用户管理 */
  USER: "/permission/user",
  /** 组织架构 */
  ORGANIZATION: "/permission/organization",
  /** 租户管理 */
  TENANT: "/permission/tenant"
} as const;

/** 吹风机模块路由 */
export const ROUTE_HAIRDRYER = {
  /** 设备管理 */
  DEVICE: "/hairdryer",
  DEVICE_TAGS: "/hairdryer/tags",
  DEVICE_DEVICE: "/hairdryer/device",
  DEVICE_CONFIG: "/hairdryer/config",

  /** 资金管理 */
  FUND: "/hairdryer/fund",
  FUND_RECHARGE: "/hairdryer/fund/recharge",
  FUND_PACKAGE_PURCHASE: "/hairdryer/fund/packagePurchase",
  FUND_REFUND: "/hairdryer/fund/refund",
  FUND_PACKAGE_REFUND: "/hairdryer/fund/packageRefund",

  /** 日志管理 */
  LOG: "/hairdryer/log",
  LOG_USAGE: "/hairdryer/log/usage",
  LOG_COMMAND: "/hairdryer/log/command",

  /** 费率配置 */
  RATE: "/hairdryer/rate",
  RATE_SCHOOL: "/hairdryer/rate/school",
  RATE_GRADE: "/hairdryer/rate/grade",

  /** 套餐配置 */
  PACKAGE: "/hairdryer/package",
  PACKAGE_GRADE_FIXED: "/hairdryer/package/gradeFixed",
  PACKAGE_GRADE_GENERAL: "/hairdryer/package/gradeGeneral",
  PACKAGE_GIFT_DURATION: "/hairdryer/package/giftDuration",

  /** 商户号配置 */
  MERCHANT: "/hairdryer/merchant"
} as const;
