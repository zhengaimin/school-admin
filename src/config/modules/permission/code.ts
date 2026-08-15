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
  FAMILY_BIND_STATUS_LIST = "familyBindStatus:list",
  FAMILY_BIND_STATUS_EXPORT = "familyBindStatus:export",

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
  SCHOOL_MIEN_DELETE = "schoolMien:delete",

  // APK 管理
  APK_LIST = "apk:list",
  APK_CREATE = "apk:create",
  APK_UPDATE = "apk:update",
  APK_DELETE = "apk:delete",
  APK_UPGRADE = "apk:upgrade",

  // 设备事件日志
  DEVICE_EVENT_LOG_LIST = "deviceEventLog:list",

  // APK 错误话术配置
  APK_MESSAGE_TEMPLATE_LIST = "apk_message_template:list",
  APK_MESSAGE_TEMPLATE_UPDATE = "apk_message_template:update",
  APK_MESSAGE_TEMPLATE_RESET_INHERIT = "apk_message_template:reset_inherit",
  APK_MESSAGE_TEMPLATE_EXPORT = "apk_message_template:export",
  APK_MESSAGE_TEMPLATE_AUDIT = "apk_message_template:audit"
}

export type TPermissionCodeValue = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];

/** 权限码列表（从 PERMISSION_CODE 提取） */
export const PERMISSION_CODE_LIST: TPermissionCodeValue[] = Object.values(PERMISSION_CODE);

/** 权限码中文名称（由 code + 中文口径维护） */
export const PERMISSION_CODE_LABEL_MAP: Record<TPermissionCodeValue, string> = {
  [PERMISSION_CODE.USER_LIST]: "用户列表",
  [PERMISSION_CODE.USER_CREATE]: "创建用户",
  [PERMISSION_CODE.USER_UPDATE]: "更新用户",
  [PERMISSION_CODE.USER_DELETE]: "删除用户",
  [PERMISSION_CODE.USER_RESET_PWD]: "重置密码",
  [PERMISSION_CODE.ROLE_LIST]: "角色列表",
  [PERMISSION_CODE.ROLE_CREATE]: "创建角色",
  [PERMISSION_CODE.ROLE_UPDATE]: "更新角色",
  [PERMISSION_CODE.ROLE_DELETE]: "删除角色",
  [PERMISSION_CODE.PERMISSION_LIST]: "权限列表",
  [PERMISSION_CODE.PERMISSION_ASSIGN]: "分配权限",
  [PERMISSION_CODE.ORG_LIST]: "组织列表",
  [PERMISSION_CODE.ORG_CREATE]: "创建组织",
  [PERMISSION_CODE.ORG_UPDATE]: "更新组织/分配用户",
  [PERMISSION_CODE.ORG_DELETE]: "删除组织",
  [PERMISSION_CODE.TENANT_LIST]: "租户列表",
  [PERMISSION_CODE.TENANT_CREATE]: "创建租户",
  [PERMISSION_CODE.TENANT_UPDATE]: "更新租户",
  [PERMISSION_CODE.TENANT_DELETE]: "删除租户",
  [PERMISSION_CODE.SCHOOL_LIST]: "学校列表",
  [PERMISSION_CODE.SCHOOL_CREATE]: "创建学校",
  [PERMISSION_CODE.SCHOOL_UPDATE]: "更新学校",
  [PERMISSION_CODE.SCHOOL_DELETE]: "删除学校",
  [PERMISSION_CODE.DEVICE_LIST]: "设备列表",
  [PERMISSION_CODE.DEVICE_CREATE]: "创建设备",
  [PERMISSION_CODE.DEVICE_UPDATE]: "更新设备",
  [PERMISSION_CODE.DEVICE_DELETE]: "删除设备",
  [PERMISSION_CODE.DEVICE_EXPORT]: "导出设备",
  [PERMISSION_CODE.DEVICE_IMPORT]: "导入设备",
  [PERMISSION_CODE.DEVICE_CONTROL]: "设备控制",
  [PERMISSION_CODE.DEVICE_GROUP_LIST]: "设备组列表",
  [PERMISSION_CODE.DEVICE_GROUP_CREATE]: "创建设备组",
  [PERMISSION_CODE.DEVICE_GROUP_UPDATE]: "更新设备组",
  [PERMISSION_CODE.DEVICE_GROUP_DELETE]: "删除设备组",
  [PERMISSION_CODE.DEVICE_GROUP_IMPORT]: "导入设备组",
  [PERMISSION_CODE.DEVICE_TAG_LIST]: "设备标签列表",
  [PERMISSION_CODE.DEVICE_TAG_CREATE]: "创建设备标签",
  [PERMISSION_CODE.DEVICE_TAG_UPDATE]: "更新设备标签",
  [PERMISSION_CODE.DEVICE_TAG_DELETE]: "删除设备标签",
  [PERMISSION_CODE.GRADE_LIST]: "年级列表",
  [PERMISSION_CODE.GRADE_CREATE]: "创建年级",
  [PERMISSION_CODE.GRADE_UPDATE]: "更新年级",
  [PERMISSION_CODE.GRADE_DELETE]: "删除年级",
  [PERMISSION_CODE.GRADE_EXPORT]: "导出年级",
  [PERMISSION_CODE.DEPARTMENT_LIST]: "级部列表",
  [PERMISSION_CODE.DEPARTMENT_CREATE]: "创建级部",
  [PERMISSION_CODE.DEPARTMENT_UPDATE]: "更新级部",
  [PERMISSION_CODE.DEPARTMENT_DELETE]: "删除级部",
  [PERMISSION_CODE.DEPARTMENT_EXPORT]: "导出级部",
  [PERMISSION_CODE.CLASS_LIST]: "班级列表",
  [PERMISSION_CODE.CLASS_CREATE]: "创建班级",
  [PERMISSION_CODE.CLASS_UPDATE]: "更新班级",
  [PERMISSION_CODE.CLASS_DELETE]: "删除班级",
  [PERMISSION_CODE.CLASS_EXPORT]: "导出班级",
  [PERMISSION_CODE.STUDENT_LIST]: "学生列表",
  [PERMISSION_CODE.STUDENT_CREATE]: "创建学生",
  [PERMISSION_CODE.STUDENT_UPDATE]: "更新学生",
  [PERMISSION_CODE.STUDENT_DELETE]: "删除学生",
  [PERMISSION_CODE.STUDENT_EXPORT]: "导出学生",
  [PERMISSION_CODE.STUDENT_IMPORT]: "导入学生",
  [PERMISSION_CODE.STUDENT_CONTROL]: "学生设备控制",
  [PERMISSION_CODE.FAMILY_CONTACT_LIST]: "亲情号列表",
  [PERMISSION_CODE.FAMILY_CONTACT_CREATE]: "创建亲情号",
  [PERMISSION_CODE.FAMILY_CONTACT_UPDATE]: "更新亲情号",
  [PERMISSION_CODE.FAMILY_CONTACT_DELETE]: "删除亲情号",
  [PERMISSION_CODE.CALL_RECORD_LIST]: "通话记录列表",
  [PERMISSION_CODE.CALL_RECORD_DETAIL]: "通话记录详情",
  [PERMISSION_CODE.CALL_RECORD_DELETE]: "删除通话记录",
  [PERMISSION_CODE.CALL_RECORD_EXPORT]: "导出通话记录",
  [PERMISSION_CODE.DEVICE_USAGE_LIST]: "设备使用记录列表",
  [PERMISSION_CODE.DEVICE_USAGE_DETAIL]: "设备使用记录详情",
  [PERMISSION_CODE.DEVICE_USAGE_DELETE]: "删除设备使用记录",
  [PERMISSION_CODE.DEVICE_USAGE_EXPORT]: "导出设备使用记录",
  [PERMISSION_CODE.MESSAGE_LIST]: "留言列表",
  [PERMISSION_CODE.MESSAGE_DETAIL]: "留言详情",
  [PERMISSION_CODE.MESSAGE_UPDATE]: "更新留言",
  [PERMISSION_CODE.MESSAGE_DELETE]: "删除留言",
  [PERMISSION_CODE.MESSAGE_EXPORT]: "导出留言",
  [PERMISSION_CODE.PAYMENT_LIST]: "支付列表",
  [PERMISSION_CODE.PAYMENT_DETAIL]: "支付详情",
  [PERMISSION_CODE.PAYMENT_EXPORT]: "导出支付",
  [PERMISSION_CODE.REFUND_LIST]: "退款列表",
  [PERMISSION_CODE.REFUND_DETAIL]: "退款详情",
  [PERMISSION_CODE.REFUND_AUDIT]: "退款审核",
  [PERMISSION_CODE.REFUND_EXPORT]: "导出退款",
  [PERMISSION_CODE.PACKAGE_RECORD_LIST]: "套餐记录列表",
  [PERMISSION_CODE.PACKAGE_RECORD_DETAIL]: "套餐记录详情",
  [PERMISSION_CODE.PACKAGE_RECORD_EXPORT]: "导出套餐记录",
  [PERMISSION_CODE.GIFT_LIST]: "赠费列表",
  [PERMISSION_CODE.GIFT_CREATE]: "创建赠费",
  [PERMISSION_CODE.GIFT_DELETE]: "删除赠费",
  [PERMISSION_CODE.CONFIG_LIST]: "配置列表",
  [PERMISSION_CODE.CONFIG_CREATE]: "创建配置",
  [PERMISSION_CODE.CONFIG_UPDATE]: "更新配置",
  [PERMISSION_CODE.CONFIG_DELETE]: "删除配置",
  [PERMISSION_CODE.API_KEY_LIST]: "API密钥列表",
  [PERMISSION_CODE.API_KEY_CREATE]: "创建API密钥",
  [PERMISSION_CODE.API_KEY_UPDATE]: "更新API密钥",
  [PERMISSION_CODE.API_KEY_DELETE]: "删除API密钥",
  [PERMISSION_CODE.MINIAPP_LIST]: "小程序模块列表",
  [PERMISSION_CODE.MINIAPP_UPDATE]: "更新小程序模块",
  [PERMISSION_CODE.MINIAPP_DELETE]: "删除小程序模块",
  [PERMISSION_CODE.SYSTEM_USER_CREATE]: "创建用户",
  [PERMISSION_CODE.SYSTEM_USER_READ]: "查看用户",
  [PERMISSION_CODE.SYSTEM_USER_UPDATE]: "编辑用户",
  [PERMISSION_CODE.SYSTEM_USER_DELETE]: "删除用户",
  [PERMISSION_CODE.SYSTEM_ROLE_CREATE]: "创建角色",
  [PERMISSION_CODE.SYSTEM_ROLE_READ]: "查看角色",
  [PERMISSION_CODE.SYSTEM_ROLE_UPDATE]: "编辑角色",
  [PERMISSION_CODE.SYSTEM_ROLE_DELETE]: "删除角色",
  [PERMISSION_CODE.PARENT_RECHARGE_CREATE]: "充值操作",
  [PERMISSION_CODE.PARENT_BALANCE_READ]: "查看余额",
  [PERMISSION_CODE.PARENT_FAMILY_UPDATE]: "编辑亲情号",
  [PERMISSION_CODE.FAMILY_BIND_STATUS_LIST]: "家长绑定状态列表",
  [PERMISSION_CODE.FAMILY_BIND_STATUS_EXPORT]: "导出家长绑定状态",
  [PERMISSION_CODE.TEACHER_STUDENT_READ]: "查看学生",
  [PERMISSION_CODE.TEACHER_FAMILY_CREATE]: "添加亲情号",
  [PERMISSION_CODE.TEACHER_FAMILY_READ]: "查看亲情号",
  [PERMISSION_CODE.TEACHER_FAMILY_UPDATE]: "编辑亲情号",
  [PERMISSION_CODE.TEACHER_FAMILY_DELETE]: "删除亲情号",
  [PERMISSION_CODE.TEACHER_FACE_CREATE]: "人脸采集",
  [PERMISSION_CODE.COMMUNICATION_MESSAGE_READ]: "查看留言",
  [PERMISSION_CODE.COMMUNICATION_CALL_CREATE]: "发起通话",
  [PERMISSION_CODE.ANNOUNCEMENT_LIST]: "公告列表",
  [PERMISSION_CODE.ANNOUNCEMENT_CREATE]: "创建公告",
  [PERMISSION_CODE.ANNOUNCEMENT_UPDATE]: "更新公告",
  [PERMISSION_CODE.ANNOUNCEMENT_DELETE]: "删除公告",
  [PERMISSION_CODE.SCHOOL_MIEN_LIST]: "校园风采列表",
  [PERMISSION_CODE.SCHOOL_MIEN_CREATE]: "创建校园风采",
  [PERMISSION_CODE.SCHOOL_MIEN_UPDATE]: "更新校园风采",
  [PERMISSION_CODE.SCHOOL_MIEN_DELETE]: "删除校园风采",
  [PERMISSION_CODE.APK_LIST]: "APK包列表",
  [PERMISSION_CODE.APK_CREATE]: "上传APK包",
  [PERMISSION_CODE.APK_UPDATE]: "更新APK包",
  [PERMISSION_CODE.APK_DELETE]: "删除APK包",
  [PERMISSION_CODE.APK_UPGRADE]: "批量升级APK",
  [PERMISSION_CODE.DEVICE_EVENT_LOG_LIST]: "公话日志列表",
  [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_LIST]: "错误话术列表",
  [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_UPDATE]: "更新错误话术",
  [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_RESET_INHERIT]: "恢复继承",
  [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_EXPORT]: "导出错误话术",
  [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_AUDIT]: "查看审计日志"
};

/** 根据权限码获取中文名称 */
export const getPermissionCodeLabel = (code?: string): string => {
  if (!code) return "";
  return (PERMISSION_CODE_LABEL_MAP as Record<string, string>)[code] ?? code;
};
