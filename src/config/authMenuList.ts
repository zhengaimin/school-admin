import { ROUTE_MODULE_SELECT, ROUTE_COMMON, ROUTE_INTERNAL_PAGE, ROUTE_VIDEO, ROUTE_HAIRDRYER, ROUTE_SYSTEM } from "./router";
import { PERMISSION_CODE } from "@/config/modules";

export default {
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
      label: "话机模块",
      icon: "Phone"
    },
    {
      key: "hairdryer",
      label: "吹风机模块",
      icon: "Odometer"
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
            path: ROUTE_INTERNAL_PAGE.GRADE,
            name: "grade",
            component: "/InternalPage/grade/index",
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
          permission: [PERMISSION_CODE.APK_MESSAGE_TEMPLATE_LIST]
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
        path: "/paymentConfig",
        name: "paymentConfig",
        component: "/paymentConfig/index",
        meta: {
          icon: "WalletFilled",
          title: "支付金额配置",
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
          title: "设备管理",
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
              title: "设备标签",
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
            path: "/fund/phoneList",
            name: "phoneList",
            component: "/fund/phoneList/index",
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
          }
        ]
      },
      {
        path: "/video/merchant",
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
      }
    ],
    system: [
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
      },
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
          permission: [PERMISSION_CODE.TENANT_LIST]
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
          permission: [PERMISSION_CODE.ORG_LIST]
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
          permission: [PERMISSION_CODE.ROLE_LIST]
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
          permission: [PERMISSION_CODE.USER_LIST]
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
              permission: [PERMISSION_CODE.USER_LIST]
            }
          },
          {
            path: ROUTE_SYSTEM.USER_SUPPLIER,
            name: "systemUserSupplier",
            component: "/permission/user/supplier/index",
            meta: {
              icon: "",
              title: "供应商用户",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: false,
              permission: [PERMISSION_CODE.USER_LIST]
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
              permission: [PERMISSION_CODE.USER_LIST]
            }
          }
        ]
      }
    ]
  },
  isOperator: [],
  msg: "成功"
};
