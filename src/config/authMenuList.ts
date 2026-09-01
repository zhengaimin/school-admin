import {
  ROUTE_MODULE_SELECT,
  ROUTE_COMMON,
  ROUTE_INTERNAL_PAGE,
  ROUTE_VIDEO,
  ROUTE_HAIRDRYER,
  ROUTE_PACKAGE,
  ROUTE_SYSTEM
} from "./router";
import { PERMISSION_CODE } from "@/config/modules";

const permissionOf = (...codes: PERMISSION_CODE[]) => codes;

const MENU_PERMISSION_EXCLUDE_PATHS = new Set<string>([ROUTE_MODULE_SELECT, ROUTE_SYSTEM.PROFILE, ROUTE_SYSTEM.CHANGE_PASSWORD]);

const MODULE_DEFAULT_PERMISSION_MAP: Record<string, PERMISSION_CODE[]> = {
  common: permissionOf(PERMISSION_CODE.SCHOOL_LIST),
  video: permissionOf(PERMISSION_CODE.DEVICE_LIST),
  hairdryer: permissionOf(PERMISSION_CODE.DEVICE_LIST),
  system: permissionOf(PERMISSION_CODE.USER_LIST)
};

const PATH_PERMISSION_RULES: Array<{ prefix: string; permission: PERMISSION_CODE[] }> = [
  // common
  { prefix: ROUTE_COMMON.APK_MESSAGE_TEMPLATE, permission: permissionOf(PERMISSION_CODE.APK_MESSAGE_TEMPLATE_LIST) },
  { prefix: ROUTE_COMMON.APK, permission: permissionOf(PERMISSION_CODE.APK_LIST) },
  { prefix: ROUTE_COMMON.SCHOOL_DEVICE_CONFIG, permission: permissionOf(PERMISSION_CODE.DEVICE_LIST) },
  { prefix: ROUTE_COMMON.SCHOOL, permission: permissionOf(PERMISSION_CODE.SCHOOL_LIST) },
  { prefix: "/common/school/student", permission: permissionOf(PERMISSION_CODE.STUDENT_LIST) },
  { prefix: ROUTE_COMMON.SCHOOL_FAMILY_CONTACT, permission: permissionOf(PERMISSION_CODE.FAMILY_CONTACT_LIST) },
  { prefix: "/common/school/parent", permission: permissionOf(PERMISSION_CODE.FAMILY_BIND_STATUS_LIST) },
  { prefix: "/systemAuthority/teacherAdmin", permission: permissionOf(PERMISSION_CODE.TEACHER_STUDENT_READ) },
  { prefix: ROUTE_COMMON.SCHOOL_GRADE, permission: permissionOf(PERMISSION_CODE.GRADE_LIST) },
  { prefix: ROUTE_INTERNAL_PAGE.DEPARTMENT, permission: permissionOf(PERMISSION_CODE.DEPARTMENT_LIST) },
  { prefix: ROUTE_INTERNAL_PAGE.CLASS, permission: permissionOf(PERMISSION_CODE.CLASS_LIST) },
  { prefix: "/moduleControl", permission: permissionOf(PERMISSION_CODE.MINIAPP_LIST) },
  { prefix: "/notificationConfig", permission: permissionOf(PERMISSION_CODE.CONFIG_LIST) },
  { prefix: "/operationLog", permission: permissionOf(PERMISSION_CODE.CONFIG_LIST) },

  // video
  { prefix: "/device/grouping", permission: permissionOf(PERMISSION_CODE.DEVICE_GROUP_LIST) },
  { prefix: "/video/devices/tags", permission: permissionOf(PERMISSION_CODE.DEVICE_TAG_LIST) },
  { prefix: "/video/devices/manage", permission: permissionOf(PERMISSION_CODE.DEVICE_LIST) },
  { prefix: "/video/devices/control", permission: permissionOf(PERMISSION_CODE.DEVICE_CONTROL) },
  { prefix: "/device/SOSControl", permission: permissionOf(PERMISSION_CODE.DEVICE_CONTROL) },
  { prefix: "/device/TimeControl", permission: permissionOf(PERMISSION_CODE.DEVICE_CONTROL) },
  { prefix: "/video/devices/schoolMien", permission: permissionOf(PERMISSION_CODE.SCHOOL_MIEN_LIST) },
  { prefix: "/video/devices/announcement", permission: permissionOf(PERMISSION_CODE.ANNOUNCEMENT_LIST) },
  { prefix: ROUTE_VIDEO.HOME_LAYOUT, permission: permissionOf(PERMISSION_CODE.CONFIG_LIST) },
  { prefix: "/fund/refund", permission: permissionOf(PERMISSION_CODE.REFUND_LIST) },
  { prefix: "/fund/packagerefund", permission: permissionOf(PERMISSION_CODE.REFUND_LIST) },
  { prefix: "/fund/packagePurchase", permission: permissionOf(PERMISSION_CODE.PACKAGE_RECORD_LIST) },
  { prefix: ROUTE_VIDEO.FUND_BALANCE_RECORD, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: "/fund/consumption", permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: "/fund/recordAll", permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: "/fund/record", permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_VIDEO.LOG_CALL_RECORD, permission: permissionOf(PERMISSION_CODE.FAMILY_CONTACT_LIST) },
  { prefix: "/fund", permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_VIDEO.PACKAGE, permission: permissionOf(PERMISSION_CODE.PACKAGE_RECORD_LIST) },
  { prefix: ROUTE_VIDEO.RATE, permission: permissionOf(PERMISSION_CODE.CONFIG_LIST) },
  { prefix: "/messagesall", permission: permissionOf(PERMISSION_CODE.MESSAGE_LIST) },
  { prefix: "/device/messages", permission: permissionOf(PERMISSION_CODE.MESSAGE_LIST) },
  { prefix: "/device/log/command", permission: permissionOf(PERMISSION_CODE.DEVICE_EVENT_LOG_LIST) },
  { prefix: "/device/log/event", permission: permissionOf(PERMISSION_CODE.DEVICE_EVENT_LOG_LIST) },
  { prefix: ROUTE_VIDEO.MERCHANT, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_VIDEO.PAYMENT_CONFIG, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: "/device", permission: permissionOf(PERMISSION_CODE.DEVICE_LIST) },

  // hairdryer
  { prefix: ROUTE_HAIRDRYER.DEVICE_TAGS, permission: permissionOf(PERMISSION_CODE.DEVICE_TAG_LIST) },
  { prefix: ROUTE_HAIRDRYER.DEVICE_DEVICE, permission: permissionOf(PERMISSION_CODE.DEVICE_LIST) },
  { prefix: ROUTE_HAIRDRYER.DEVICE_CONFIG, permission: permissionOf(PERMISSION_CODE.DEVICE_CONTROL) },
  { prefix: ROUTE_HAIRDRYER.DEVICE, permission: permissionOf(PERMISSION_CODE.DEVICE_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_REFUND, permission: permissionOf(PERMISSION_CODE.REFUND_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_PACKAGE_REFUND, permission: permissionOf(PERMISSION_CODE.REFUND_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_PACKAGE_PURCHASE, permission: permissionOf(PERMISSION_CODE.PACKAGE_RECORD_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_RECHARGE, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_CARD_RECHARGE, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND_BALANCE_RECORD, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_HAIRDRYER.FUND, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_HAIRDRYER.PACKAGE, permission: permissionOf(PERMISSION_CODE.PACKAGE_RECORD_LIST) },
  { prefix: ROUTE_HAIRDRYER.RATE, permission: permissionOf(PERMISSION_CODE.CONFIG_LIST) },
  { prefix: ROUTE_HAIRDRYER.LOG_USAGE, permission: permissionOf(PERMISSION_CODE.DEVICE_USAGE_LIST) },
  { prefix: ROUTE_HAIRDRYER.LOG_COMMAND, permission: permissionOf(PERMISSION_CODE.DEVICE_EVENT_LOG_LIST) },
  { prefix: ROUTE_HAIRDRYER.LOG, permission: permissionOf(PERMISSION_CODE.DEVICE_USAGE_LIST) },
  { prefix: ROUTE_HAIRDRYER.MERCHANT, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },
  { prefix: ROUTE_HAIRDRYER.PAYMENT_CONFIG, permission: permissionOf(PERMISSION_CODE.PAYMENT_LIST) },

  // package
  { prefix: ROUTE_PACKAGE.REFUND, permission: permissionOf(PERMISSION_CODE.REFUND_LIST) },
  { prefix: ROUTE_PACKAGE.PURCHASE, permission: permissionOf(PERMISSION_CODE.PACKAGE_RECORD_LIST) },

  // system
  { prefix: ROUTE_SYSTEM.TENANT, permission: permissionOf(PERMISSION_CODE.TENANT_LIST) },
  { prefix: ROUTE_SYSTEM.ORGANIZATION, permission: permissionOf(PERMISSION_CODE.ORG_LIST) },
  { prefix: ROUTE_SYSTEM.ROLE, permission: permissionOf(PERMISSION_CODE.ROLE_LIST) },
  { prefix: ROUTE_SYSTEM.USER, permission: permissionOf(PERMISSION_CODE.USER_LIST) }
];

const resolvePermissionByPath = (path: string): PERMISSION_CODE[] | undefined => {
  const matched = PATH_PERMISSION_RULES.find(rule => path.startsWith(rule.prefix));
  return matched?.permission;
};

const resolveMenuPermission = (
  menu: Menu.MenuOptions,
  moduleKey: string,
  parentPermission?: PERMISSION_CODE[]
): PERMISSION_CODE[] | undefined => {
  const explicitPermission = menu.meta?.permission as PERMISSION_CODE[] | undefined;
  if (explicitPermission?.length) return explicitPermission;
  const pathPermission = resolvePermissionByPath(menu.path);
  if (pathPermission?.length) return pathPermission;
  if (parentPermission?.length) return parentPermission;
  return MODULE_DEFAULT_PERMISSION_MAP[moduleKey];
};

const applyMenuPermissions = (menus: Menu.MenuOptions[], moduleKey: string, parentPermission?: PERMISSION_CODE[]) => {
  menus.forEach(menu => {
    const currentPermission = resolveMenuPermission(menu, moduleKey, parentPermission);
    if (!MENU_PERMISSION_EXCLUDE_PATHS.has(menu.path) && currentPermission?.length) {
      menu.meta.permission = permissionOf(...currentPermission);
    }
    if (menu.children?.length) {
      applyMenuPermissions(menu.children, moduleKey, currentPermission);
    }
  });
};

const authMenuList = {
  code: 200,
  data: [
    {
      path: ROUTE_MODULE_SELECT,
      name: "moduleSelect",
      component: "/moduleSelect/index",
      meta: {
        icon: "",
        title: "模块选择",
        isLink: "",
        isHide: true,
        isFull: true,
        isAffix: false,
        isKeepAlive: false
      }
    },
    // 个人信息/修改密码属于全员可用页面，放在全局路由，避免随模块开关（如平台运营方进入租户排除权限模块）被摘掉
    {
      path: ROUTE_SYSTEM.PROFILE,
      name: "systemProfile",
      component: "/system/profile/index",
      meta: {
        icon: "User",
        title: "个人信息",
        isLink: "",
        isHide: true,
        isFull: false,
        isAffix: false,
        isKeepAlive: false
      }
    },
    {
      path: ROUTE_SYSTEM.CHANGE_PASSWORD,
      name: "systemChangePassword",
      component: "/system/password/index",
      meta: {
        icon: "Lock",
        title: "修改密码",
        isLink: "",
        isHide: true,
        isFull: false,
        isAffix: false,
        isKeepAlive: false
      }
    }
  ],
  modules: [
    {
      key: "common",
      label: "公共模块",
      icon: "HomeFilled"
    },
    {
      key: "video",
      label: "公话模块",
      icon: "Phone"
    },
    {
      key: "hairdryer",
      label: "吹风机模块",
      icon: "Odometer"
    },
    {
      key: "package",
      label: "平台套餐",
      icon: "Goods"
    },
    {
      key: "system",
      label: "权限模块",
      icon: "Lock"
    }
  ],
  systemData: {
    common: [
      {
        path: "/systemAuthority/index",
        name: "systemAuthority",
        component: "/systemAuthority/index",
        meta: {
          icon: "HomeFilled",
          title: "校园管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: ROUTE_COMMON.SCHOOL,
            name: "school",
            component: "/common/school/manage/index",
            meta: {
              icon: "",
              title: "学校管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_COMMON.SCHOOL_DEVICE_CONFIG,
            name: "deviceConfig",
            component: "/common/school/deviceConfig/index",
            meta: {
              icon: "",
              title: "设备配置",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_COMMON.SCHOOL_GRADE,
            name: "grade",
            component: "/common/school/grade/index",
            meta: {
              icon: "",
              title: "年级管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_INTERNAL_PAGE.DEPARTMENT,
            name: "department",
            component: "/InternalPage/department/index",
            meta: {
              icon: "",
              title: "级部管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_INTERNAL_PAGE.CLASS,
            name: "class",
            component: "/InternalPage/class/index",
            meta: {
              icon: "",
              title: "班级管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/systemAuthority/teacherAdmin",
            name: "teacherAdmin",
            component: "/systemAuthority/teacherAdmin/index",
            meta: {
              icon: "",
              title: "教师管理",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/common/school/student",
            name: "studentAdmin",
            component: "/common/school/student/index",
            meta: {
              icon: "",
              title: "学生管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_COMMON.SCHOOL_FAMILY_CONTACT,
            name: "familyContactManage",
            component: "/common/school/family-contact/index",
            meta: {
              icon: "",
              title: "亲情号管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/common/school/parent",
            name: "parentManage",
            component: "/common/school/parent/index",
            meta: {
              icon: "",
              title: "家长管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/systemAuthority/parentAdmin",
            name: "parentAdmin",
            component: "/systemAuthority/parentAdmin/index",
            meta: {
              icon: "",
              title: "家长信息",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/systemAuthority/billList",
            name: "billList",
            component: "/systemAuthority/billList/index",
            meta: {
              icon: "",
              title: "账单管理",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/systemAuthority/refund",
            name: "refund",
            component: "/systemAuthority/refund/index",
            meta: {
              icon: "",
              title: "退费管理",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/dataScreening",
            name: "dataScreening",
            component: "/dataScreening/index",
            meta: {
              icon: "",
              title: "数据总览",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_COMMON.APK,
        name: "apkManage",
        component: "/common/apk/index",
        meta: {
          icon: "Download",
          title: "APK 管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: ROUTE_COMMON.APK_MESSAGE_TEMPLATE,
        name: "apkMessageTemplate",
        component: "/common/apkMessageTemplate/index",
        meta: {
          icon: "ChatLineSquare",
          title: "APK 错误话术配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          permission: permissionOf(PERMISSION_CODE.APK_MESSAGE_TEMPLATE_LIST)
        }
      },
      {
        path: "/moduleControl",
        name: "moduleControl",
        component: "/moduleControl/index",
        meta: {
          icon: "Grid",
          title: "小程序模块配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: "/notificationConfig",
        name: "notificationConfig",
        component: "/notificationConfig/index",
        meta: {
          icon: "SwitchFilled",
          title: "通知配置管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: "/operationLog",
        name: "operationLog",
        component: "/operationLog/index",
        meta: {
          icon: "Notebook",
          title: "操作日志",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      }
    ],
    video: [
      {
        path: "/device",
        name: "device",
        component: "/device/index",
        meta: {
          icon: "UploadFilled",
          title: "公话管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: "/device/grouping",
            name: "grouping",
            component: "/device/grouping/index",
            meta: {
              icon: "",
              title: "公话分组",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/video/devices/tags",
            name: "devicetags",
            component: "/video/devices/tags/index",
            meta: {
              icon: "",
              title: "公话标签",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/video/devices/manage",
            name: "deviceControl",
            component: "/video/devices/manage/index",
            meta: {
              icon: "",
              title: "公话管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/rate",
            name: "rate",
            component: "/device/rate/index",
            meta: {
              icon: "",
              title: "套餐配置",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/video/devices/control",
            name: "control",
            component: "/video/devices/control/index",
            meta: {
              icon: "",
              title: "公话配置",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/SOSControl",
            name: "SOSControl",
            component: "/device/SOSControl/index",
            meta: {
              icon: "",
              title: "SOS电话配置",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/TimeControl",
            name: "TimeControl",
            component: "/device/TimeControl/index",
            meta: {
              icon: "",
              title: "时间段配置",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/video/devices/schoolMien",
            name: "schoolMien",
            component: "/video/devices/schoolMien/index",
            meta: {
              icon: "",
              title: "校园风采",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/video/devices/announcement",
            name: "videoAnnouncement",
            component: "/video/devices/announcement/index",
            meta: {
              icon: "",
              title: "校园公告",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.HOME_LAYOUT,
            name: "videoHomeLayout",
            component: "/video/devices/homeLayout/index",
            meta: {
              icon: "",
              title: "首页布局配置",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: "/fund",
        name: "fund",
        component: "/fund/index",
        meta: {
          icon: "List",
          title: "资金管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: "/fund/recordAll",
            name: "recordAll",
            component: "/fund/recordAll/index",
            meta: {
              icon: "",
              title: "充值统计",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/fund/record",
            name: "record",
            component: "/fund/record/index",
            meta: {
              icon: "",
              title: "充值记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/fund/packagePurchase",
            name: "packagePurchase",
            component: "/fund/packagePurchase/index",
            meta: {
              icon: "",
              title: "套餐购买",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.FUND_BALANCE_RECORD,
            name: "videoFundBalanceRecord",
            component: "/video/fund/balanceRecord/index",
            meta: {
              icon: "",
              title: "学生余额",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/fund/consumption",
            name: "consumption",
            component: "/fund/consumption/index",
            meta: {
              icon: "",
              title: "消费记录",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/fund/refund",
            name: "fundRefund",
            component: "/fund/refund/index",
            meta: {
              icon: "",
              title: "余额退款",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/fund/packagerefund",
            name: "packagerefund",
            component: "/fund/packagerefund/index",
            meta: {
              icon: "",
              title: "套餐退款",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_VIDEO.RATE,
        name: "videoRate",
        redirect: ROUTE_VIDEO.RATE_SCHOOL_CALL,
        meta: {
          icon: "PriceTag",
          title: "费率配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_VIDEO.RATE_SCHOOL_CALL,
            name: "videoRateSchoolCall",
            component: "/video/rate/schoolCall/index",
            meta: {
              icon: "",
              title: "学校通话费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.RATE_SCHOOL_MESSAGE,
            name: "videoRateSchoolMessage",
            component: "/video/rate/schoolMessage/index",
            meta: {
              icon: "",
              title: "学校留言费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.RATE_GRADE_CALL,
            name: "videoRateGradeCall",
            component: "/video/rate/gradeCall/index",
            meta: {
              icon: "",
              title: "年级通话费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.RATE_GRADE_MESSAGE,
            name: "videoRateGradeMessage",
            component: "/video/rate/gradeMessage/index",
            meta: {
              icon: "",
              title: "年级留言费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_VIDEO.PACKAGE,
        name: "videoPackage",
        redirect: ROUTE_VIDEO.PACKAGE_GRADE_GENERAL,
        meta: {
          icon: "Present",
          title: "套餐配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_VIDEO.PACKAGE_GRADE_GENERAL,
            name: "videoPackageGradeGeneral",
            component: "/video/package/gradeGeneral/index",
            meta: {
              icon: "",
              title: "年级通用套餐",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.PACKAGE_GRADE_FIXED,
            name: "videoPackageGradeFixed",
            component: "/video/package/gradeFixed/index",
            meta: {
              icon: "",
              title: "年级固定套餐",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_VIDEO.PACKAGE_GIFT_TIME,
            name: "videoPackageGiftTime",
            component: "/video/package/giftTime/index",
            meta: {
              icon: "",
              title: "赠送时长",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: "/messagesall",
        name: "messagesall",
        component: "/messagesall/index",
        meta: {
          icon: "Comment",
          title: "日志管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_VIDEO.LOG_CALL_RECORD,
            name: "videoPhoneList",
            component: "/video/fund/phoneList/index",
            meta: {
              icon: "",
              title: "通话记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/messages",
            name: "messages",
            component: "/device/messages/index",
            meta: {
              icon: "",
              title: "留言记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/log/command",
            name: "command",
            component: "/device/log/command/index",
            meta: {
              icon: "",
              title: "命令记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: "/device/log/event",
            name: "deviceEventLog",
            component: "/device/log/event/index",
            meta: {
              icon: "",
              title: "公话日志",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_VIDEO.MERCHANT,
        name: "videoMerchant",
        component: "/video/merchant/index",
        meta: {
          icon: "Tools",
          title: "商户号配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: ROUTE_VIDEO.PAYMENT_CONFIG,
        name: "videoPaymentConfig",
        component: "/video/paymentConfig/index",
        meta: {
          icon: "WalletFilled",
          title: "支付金额配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      }
    ],
    hairdryer: [
      {
        path: ROUTE_HAIRDRYER.DEVICE,
        name: "hairdryer",
        component: "/hairdryer/index",
        meta: {
          icon: "UploadFilled",
          title: "吹风机管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_HAIRDRYER.DEVICE_TAGS,
            name: "hairdryerTags",
            component: "/hairdryer/devices/tags/index",
            meta: {
              icon: "",
              title: "标签管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.DEVICE_DEVICE,
            name: "hairdryerDevice",
            component: "/hairdryer/devices/manage/index",
            meta: {
              icon: "",
              title: "设备管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.DEVICE_CONFIG,
            name: "hairdryerConfig",
            component: "/hairdryer/config/index",
            meta: {
              icon: "",
              title: "配置管理",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_HAIRDRYER.FUND,
        name: "hairdryerFund",
        redirect: ROUTE_HAIRDRYER.FUND_RECHARGE,
        meta: {
          icon: "List",
          title: "资金管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_HAIRDRYER.FUND_RECHARGE,
            name: "hairdryerFundRecharge",
            component: "/hairdryer/fund/recharge/index",
            meta: {
              icon: "",
              title: "充值记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.FUND_CARD_RECHARGE,
            name: "hairdryerFundCardRecharge",
            component: "/hairdryer/fund/cardRecharge/index",
            meta: {
              icon: "",
              title: "圈存记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.FUND_PACKAGE_PURCHASE,
            name: "hairdryerFundPackagePurchase",
            component: "/hairdryer/fund/packagePurchase/index",
            meta: {
              icon: "",
              title: "套餐购买",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.FUND_BALANCE_RECORD,
            name: "hairdryerFundBalanceRecord",
            component: "/hairdryer/fund/balanceRecord/index",
            meta: {
              icon: "",
              title: "学生余额",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.FUND_REFUND,
            name: "hairdryerFundRefund",
            component: "/hairdryer/fund/refund/index",
            meta: {
              icon: "",
              title: "余额退款",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.FUND_PACKAGE_REFUND,
            name: "hairdryerFundPackageRefund",
            component: "/hairdryer/fund/packageRefund/index",
            meta: {
              icon: "",
              title: "套餐退款",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },

      {
        path: ROUTE_HAIRDRYER.RATE,
        name: "hairdryerRate",
        redirect: ROUTE_HAIRDRYER.RATE_SCHOOL,
        meta: {
          icon: "PriceTag",
          title: "费率配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_HAIRDRYER.RATE_SCHOOL,
            name: "hairdryerRateSchool",
            component: "/hairdryer/rate/school/index",
            meta: {
              icon: "",
              title: "学校费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.RATE_GRADE,
            name: "hairdryerRateGrade",
            component: "/hairdryer/rate/grade/index",
            meta: {
              icon: "",
              title: "年级费率",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_HAIRDRYER.PACKAGE,
        name: "hairdryerPackage",
        redirect: ROUTE_HAIRDRYER.PACKAGE_GRADE_FIXED,
        meta: {
          icon: "Present",
          title: "套餐配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_HAIRDRYER.PACKAGE_GRADE_GENERAL,
            name: "hairdryerGradeGeneral",
            component: "/hairdryer/package/gradeGeneral/index",
            meta: {
              icon: "",
              title: "年级通用套餐",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.PACKAGE_GRADE_FIXED,
            name: "hairdryerGradeFixed",
            component: "/hairdryer/package/gradeFixed/index",
            meta: {
              icon: "",
              title: "年级固定套餐",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.PACKAGE_GIFT_DURATION,
            name: "hairdryerGiftDuration",
            component: "/hairdryer/package/giftDuration/index",
            meta: {
              icon: "",
              title: "赠送时长",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_HAIRDRYER.LOG,
        name: "hairdryerLog",
        component: "/hairdryer/log/index",
        meta: {
          icon: "Comment",
          title: "日志管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_HAIRDRYER.LOG_USAGE,
            name: "hairdryerLogUsage",
            component: "/hairdryer/log/usage/index",
            meta: {
              icon: "",
              title: "使用记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_HAIRDRYER.LOG_COMMAND,
            name: "hairdryerLogCommand",
            component: "/hairdryer/log/command/index",
            meta: {
              icon: "",
              title: "命令记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_HAIRDRYER.MERCHANT,
        name: "hairdryerMerchant",
        component: "/hairdryer/merchant/index",
        meta: {
          icon: "Tools",
          title: "商户号配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: ROUTE_HAIRDRYER.PAYMENT_CONFIG,
        name: "hairdryerPaymentConfig",
        component: "/hairdryer/paymentConfig/index",
        meta: {
          icon: "WalletFilled",
          title: "支付金额配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      }
    ],
    package: [
      {
        path: ROUTE_PACKAGE.PLATFORM,
        name: "platformPackage",
        redirect: ROUTE_PACKAGE.MANAGE,
        meta: {
          icon: "Goods",
          title: "平台套餐",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        },
        children: [
          {
            path: ROUTE_PACKAGE.MANAGE,
            name: "platformPackageManage",
            component: "/package/manage/index",
            meta: {
              icon: "List",
              title: "套餐列表",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_PACKAGE.REFUND,
            name: "platformPackageRefund",
            component: "/package/refund/index",
            meta: {
              icon: "Tickets",
              title: "套餐退款",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          },
          {
            path: ROUTE_PACKAGE.PURCHASE,
            name: "platformPackagePurchase",
            component: "/fund/packagePurchase/index",
            meta: {
              icon: "Document",
              title: "购买记录",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false
            }
          }
        ]
      },
      {
        path: ROUTE_PACKAGE.GLOBAL_CONFIG,
        name: "platformGlobalConfig",
        component: "/package/globalConfig/index",
        meta: {
          icon: "Setting",
          title: "配置",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      }
    ],
    system: [
      {
        path: ROUTE_SYSTEM.TENANT,
        name: "systemTenant",
        component: "/permission/tenant/index",
        meta: {
          icon: "Key",
          title: "租户管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          permission: permissionOf(PERMISSION_CODE.TENANT_LIST)
        }
      },
      {
        path: ROUTE_SYSTEM.ORGANIZATION,
        name: "systemOrganization",
        component: "/permission/organization/index",
        meta: {
          icon: "OfficeBuilding",
          title: "组织架构",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          permission: permissionOf(PERMISSION_CODE.ORG_LIST)
        }
      },
      {
        path: ROUTE_SYSTEM.ROLE,
        name: "systemRole",
        component: "/permission/role/index",
        meta: {
          icon: "Tickets",
          title: "角色管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          permission: permissionOf(PERMISSION_CODE.ROLE_LIST)
        }
      },
      {
        path: ROUTE_SYSTEM.USER,
        name: "systemUser",
        component: "/permission/user/index",
        meta: {
          icon: "User",
          title: "用户管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false,
          permission: permissionOf(PERMISSION_CODE.USER_LIST)
        },
        redirect: ROUTE_SYSTEM.USER_PLATFORM,
        children: [
          {
            path: ROUTE_SYSTEM.USER_PLATFORM,
            name: "systemUserPlatform",
            component: "/permission/user/platform/index",
            meta: {
              icon: "",
              title: "平台用户",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false,
              permission: permissionOf(PERMISSION_CODE.USER_LIST)
            }
          },
          {
            path: ROUTE_SYSTEM.USER_SUPPLIER,
            name: "systemUserSupplier",
            component: "/permission/user/supplier/index",
            meta: {
              icon: "",
              title: "代理商用户",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false,
              permission: permissionOf(PERMISSION_CODE.USER_LIST)
            }
          },
          {
            path: ROUTE_SYSTEM.USER_SALESMAN,
            name: "systemUserSalesman",
            component: "/permission/user/salesman/index",
            meta: {
              icon: "",
              title: "业务员用户",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false,
              permission: permissionOf(PERMISSION_CODE.USER_LIST)
            }
          }
        ]
      }
    ]
  },
  isOperator: [],
  msg: "成功"
};

applyMenuPermissions(authMenuList.data || [], "global");
Object.entries(authMenuList.systemData || {}).forEach(([moduleKey, menus]) => {
  applyMenuPermissions(menus, moduleKey);
});

export default authMenuList;
