/** 权限编码 */
export enum PERMISSION_CODE {
  // 用户管理
  USER_LIST = "user:list",
  USER_CREATE = "user:create",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",
  USER_RESET_PWD = "user:resetPwd",

  // 角色管理
  ROLE_LIST = "role:list",
  ROLE_CREATE = "role:create",
  ROLE_UPDATE = "role:update",
  ROLE_DELETE = "role:delete",

  // 权限管理
  PERMISSION_LIST = "permission:list",
  PERMISSION_ASSIGN = "permission:assign",

  // 组织架构
  ORG_LIST = "org:list",
  ORG_CREATE = "org:create",
  ORG_UPDATE = "org:update",
  ORG_DELETE = "org:delete",

  // 租户管理
  TENANT_LIST = "tenant:list",
  TENANT_CREATE = "tenant:create",
  TENANT_UPDATE = "tenant:update",
  TENANT_DELETE = "tenant:delete",

  // 学校管理
  SCHOOL_LIST = "school:list",
  SCHOOL_CREATE = "school:create",
  SCHOOL_UPDATE = "school:update",
  SCHOOL_DELETE = "school:delete",

  // 设备管理
  DEVICE_LIST = "device:list",
  DEVICE_CREATE = "device:create",
  DEVICE_UPDATE = "device:update",
  DEVICE_DELETE = "device:delete",
  DEVICE_EXPORT = "device:export",
  DEVICE_IMPORT = "device:import",
  DEVICE_CONTROL = "device:control",

  // 设备组
  DEVICE_GROUP_LIST = "deviceGroup:list",
  DEVICE_GROUP_CREATE = "deviceGroup:create",
  DEVICE_GROUP_UPDATE = "deviceGroup:update",
  DEVICE_GROUP_DELETE = "deviceGroup:delete",
  DEVICE_GROUP_IMPORT = "deviceGroup:import",

  // 设备标签
  DEVICE_TAG_LIST = "deviceTag:list",
  DEVICE_TAG_CREATE = "deviceTag:create",
  DEVICE_TAG_UPDATE = "deviceTag:update",
  DEVICE_TAG_DELETE = "deviceTag:delete",

  // 年级管理
  GRADE_LIST = "grade:list",
  GRADE_CREATE = "grade:create",
  GRADE_UPDATE = "grade:update",
  GRADE_DELETE = "grade:delete",
  GRADE_EXPORT = "grade:export",

  // 级部管理
  DEPARTMENT_LIST = "department:list",
  DEPARTMENT_CREATE = "department:create",
  DEPARTMENT_UPDATE = "department:update",
  DEPARTMENT_DELETE = "department:delete",
  DEPARTMENT_EXPORT = "department:export",

  // 班级管理
  CLASS_LIST = "class:list",
  CLASS_CREATE = "class:create",
  CLASS_UPDATE = "class:update",
  CLASS_DELETE = "class:delete",
  CLASS_EXPORT = "class:export",

  // 学生管理
  STUDENT_LIST = "student:list",
  STUDENT_CREATE = "student:create",
  STUDENT_UPDATE = "student:update",
  STUDENT_DELETE = "student:delete",
  STUDENT_EXPORT = "student:export",
  STUDENT_IMPORT = "student:import",
  STUDENT_CONTROL = "student:control",

  // 亲情号管理
  FAMILY_CONTACT_LIST = "familyContact:list",
  FAMILY_CONTACT_CREATE = "familyContact:create",
  FAMILY_CONTACT_UPDATE = "familyContact:update",
  FAMILY_CONTACT_DELETE = "familyContact:delete",

  // 通话记录
  CALL_RECORD_LIST = "callRecord:list",
  CALL_RECORD_DETAIL = "callRecord:detail",
  CALL_RECORD_DELETE = "callRecord:delete",
  CALL_RECORD_EXPORT = "callRecord:export",

  // 设备使用记录
  DEVICE_USAGE_LIST = "deviceUsage:list",
  DEVICE_USAGE_DETAIL = "deviceUsage:detail",
  DEVICE_USAGE_DELETE = "deviceUsage:delete",
  DEVICE_USAGE_EXPORT = "deviceUsage:export",

  // 留言管理
  MESSAGE_LIST = "message:list",
  MESSAGE_DETAIL = "message:detail",
  MESSAGE_UPDATE = "message:update",
  MESSAGE_DELETE = "message:delete",
  MESSAGE_EXPORT = "message:export",

  // 支付管理
  PAYMENT_LIST = "payment:list",
  PAYMENT_DETAIL = "payment:detail",
  PAYMENT_EXPORT = "payment:export",

  // 退款管理
  REFUND_LIST = "refund:list",
  REFUND_DETAIL = "refund:detail",
  REFUND_AUDIT = "refund:audit",
  REFUND_EXPORT = "refund:export",

  // 套餐记录
  PACKAGE_RECORD_LIST = "packageRecord:list",
  PACKAGE_RECORD_DETAIL = "packageRecord:detail",
  PACKAGE_RECORD_EXPORT = "packageRecord:export",

  // 赠费管理
  GIFT_LIST = "gift:list",
  GIFT_CREATE = "gift:create",
  GIFT_DELETE = "gift:delete",

  // 配置管理
  CONFIG_LIST = "config:list",
  CONFIG_CREATE = "config:create",
  CONFIG_UPDATE = "config:update",
  CONFIG_DELETE = "config:delete",

  // API密钥
  API_KEY_LIST = "apikey:list",
  API_KEY_CREATE = "apikey:create",
  API_KEY_UPDATE = "apikey:update",
  API_KEY_DELETE = "apikey:delete",

  // 小程序模块
  MINIAPP_LIST = "miniapp:list",
  MINIAPP_UPDATE = "miniapp:update",
  MINIAPP_DELETE = "miniapp:delete",

  // 系统模块
  SYSTEM_USER_CREATE = "system:user:create",
  SYSTEM_USER_READ = "system:user:read",
  SYSTEM_USER_UPDATE = "system:user:update",
  SYSTEM_USER_DELETE = "system:user:delete",
  SYSTEM_ROLE_CREATE = "system:role:create",
  SYSTEM_ROLE_READ = "system:role:read",
  SYSTEM_ROLE_UPDATE = "system:role:update",
  SYSTEM_ROLE_DELETE = "system:role:delete",

  // 家长端
  PARENT_RECHARGE_CREATE = "parent:recharge:create",
  PARENT_BALANCE_READ = "parent:balance:read",
  PARENT_FAMILY_UPDATE = "parent:family:update",

  // 教师端
  TEACHER_STUDENT_READ = "teacher:student:read",
  TEACHER_FAMILY_CREATE = "teacher:family:create",
  TEACHER_FAMILY_READ = "teacher:family:read",
  TEACHER_FAMILY_UPDATE = "teacher:family:update",
  TEACHER_FAMILY_DELETE = "teacher:family:delete",
  TEACHER_FACE_CREATE = "teacher:face:create",

  // 通信模块
  COMMUNICATION_MESSAGE_READ = "communication:message:read",
  COMMUNICATION_CALL_CREATE = "communication:call:create",

  // 公告管理
  ANNOUNCEMENT_LIST = "announcement:list",
  ANNOUNCEMENT_CREATE = "announcement:create",
  ANNOUNCEMENT_UPDATE = "announcement:update",
  ANNOUNCEMENT_DELETE = "announcement:delete",

  // 校园风采
  SCHOOL_MIEN_LIST = "schoolMien:list",
  SCHOOL_MIEN_CREATE = "schoolMien:create",
  SCHOOL_MIEN_UPDATE = "schoolMien:update",
  SCHOOL_MIEN_DELETE = "schoolMien:delete"
}

export type TPermissionCodeValue = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];
