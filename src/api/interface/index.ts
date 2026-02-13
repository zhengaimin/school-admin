import type { DEVICE_TYPE, TDeviceCommandCodeValue } from "@/config/modules";

// 请求响应参数（不包含data）
export interface Result {
  code: number;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  page: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }

  /** 业务类型 */
  export type BusinessType = "AVATAR" | "FACE" | "DOCUMENT" | "MESSAGE" | "TEMP";

  /** 文件类型 */
  export type FileType = "image" | "doc" | "video" | "other";

  /** 文件上传响应 */
  export interface ResFileUpload {
    /** 文件MD5哈希值 */
    fileHash: string;
    /** 原始文件名 */
    originalName: string;
    /** 存储文件名 */
    fileName: string;
    /** 文件访问URL */
    fileUrl: string;
    /** 文件大小（字节） */
    fileSize: number;
    /** 文件类型 */
    fileType: FileType;
    /** 缩略图URL（仅图片文件） */
    thumbnailUrl?: string;
    /** 上传时间 */
    uploadTime: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    captcha: string;
    captchaId: string;
  }

  export interface UserInfo {
    id: number;
    username: string;
    realName: string;
    roleCode: string;
    roleName: string;
    tenantId: number;
    tenantCode: string;
    tenantName: string;
    permissions: string[];
  }

  export interface ResLogin {
    token: string;
    userInfo: UserInfo;
  }

  export interface ResAuthButtons {
    [key: string]: string[];
  }

  export interface ResGetCaptcha {
    id: string;
    base64Blob: string;
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

// 设备管理模块
export namespace DeviceBase {
  /** 设备列表 - 查询参数 */
  export interface ReqDeviceBaseListParams {
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 厂商代码 */
    vendorCode?: string;
    /** 设备类型 */
    deviceType?: DEVICE_TYPE;
    /** 设备序列号（模糊查询） */
    deviceSn?: string;
    /** 学校ID */
    schoolId?: number;
    /** 设备状态：0-离线，1-在线 */
    status?: 0 | 1;
  }

  /** 设备详情 */
  export interface IDeviceBaseItem {
    /** 设备ID */
    id: number;
    /** 设备序列号 */
    deviceSn: string;
    /** 设备名称 */
    name: string;
    /** 设备位置 */
    location: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
    /** 厂商代码 */
    vendorCode: string;
    /** 厂商名称 */
    vendorName: string;
    /** 租户ID */
    tenantId: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 设备状态：0-离线，1-在线 */
    status: 0 | 1;
    /** 最后在线时间戳 */
    lastOnline: number;
    /** 固件版本 */
    version: string;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
  }

  /** 设备列表 - 响应 data */
  export interface ResDeviceBaseListData {
    /** 设备列表 */
    list: IDeviceBaseItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 创建设备 - 请求参数 */
  export interface ReqCreateDeviceBaseParams {
    /** 设备序列号 */
    deviceSn: string;
    /** 设备名称 */
    name: string;
    /** 设备位置 */
    location?: string;
    /** 厂商代码 */
    vendorCode: string;
    /** 厂商名称 */
    vendorName?: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
    /** 学校ID */
    schoolId?: number;
    /** 固件版本 */
    version?: string;
  }

  /** 更新设备 - 请求参数 */
  export interface ReqUpdateDeviceBaseParams {
    /** 设备名称 */
    name?: string;
    /** 设备位置 */
    location?: string;
    /** 学校ID */
    schoolId?: number;
    /** 设备状态：0-离线，1-在线 */
    status?: 0 | 1;
  }

  /** 下载导入模板 - 请求参数 */
  export interface ReqGetDeviceBaseTemplateApi {
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
  }

  /** 导入设备 - 请求参数（query 部分） */
  export interface ReqPostDeviceBaseImportApi {
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
    /** 学校ID */
    schoolId: number;
  }

  /** 导入设备 - 失败详情项 */
  export interface IDeviceBaseImportFailureVo {
    /** 行号 */
    rowIndex: number;
    /** 设备SN */
    deviceSn: string;
    /** 设备名称 */
    name: string;
    /** 失败原因 */
    reason: string;
  }

  /** 导入设备 - 响应 data */
  export interface ResPostDeviceBaseImportApi {
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failCount: number;
    /** 失败详情 */
    failures: IDeviceBaseImportFailureVo[];
  }

  /** 获取导出信息 - 请求参数 */
  export interface ReqGetDeviceBaseExportInfoApi {
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
    /** 设备序列号（模糊查询） */
    deviceSn?: string;
    /** 学校ID */
    schoolId?: number;
    /** 设备状态：0-离线，1-在线 */
    status?: 0 | 1;
  }

  /** 获取导出信息 - 响应 data */
  export interface ResGetDeviceBaseExportInfoApi {
    /** 符合条件的设备总数 */
    total: number;
  }

  /** 导出设备 - 请求参数 */
  export interface ReqPostDeviceBaseExportApi {
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: DEVICE_TYPE;
    /** 设备序列号（模糊查询） */
    deviceSn?: string;
    /** 学校ID */
    schoolId?: number;
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 设备状态：0-离线，1-在线 */
    status?: 0 | 1;
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }
}

// 设备配置模块
export namespace DeviceConfig {
  /** 二维码配置 */
  export interface IQRCodeConfig {
    /** 文件ID（上传后获得） */
    fileId: number;
    /** 文件URL */
    fileUrl: string;
  }

  /** 屏幕参数配置 */
  export interface IScreenConfig {
    /** 亮度 0-100 */
    brightness: number;
    /** 欢迎消息 */
    welcomeMessage: string;
    /** 引导文字（支持多行，用\n分隔） */
    guideText: string;
  }

  /** 超时时长配置 */
  export interface ITimeoutConfig {
    /** 超时退款时间（秒） */
    refundTimeout: number;
  }

  /** 订单配置 */
  export interface IOrderConfig {
    /** 订单使用最大时间（分钟） */
    maxUsageTime: number;
  }

  /** 功能点配置响应 */
  export interface IFeatureConfigResponse {
    /** 二维码配置 */
    qrCode: IQRCodeConfig;
    /** 屏幕参数配置 */
    screen: IScreenConfig;
    /** 超时时长配置 */
    timeout: ITimeoutConfig;
    /** 订单配置 */
    order: IOrderConfig;
    /** 配置版本号 */
    configVersion: number;
  }

  /** 获取设备级配置 - 响应 */
  export interface ResDeviceFeatureConfig {
    /** 设备ID */
    deviceId: number;
    /** 功能点配置 */
    config: IFeatureConfigResponse;
  }

  /** 功能点配置请求（所有字段可选） */
  export interface IFeatureConfigRequest {
    /** 二维码配置 */
    qrCode?: Partial<IQRCodeConfig>;
    /** 屏幕参数配置 */
    screen?: Partial<IScreenConfig>;
    /** 超时时长配置 */
    timeout?: Partial<ITimeoutConfig>;
    /** 订单配置 */
    order?: Partial<IOrderConfig>;
  }

  /** 更新设备级配置 - 请求参数 */
  export interface ReqUpdateDeviceFeatureConfig {
    /** 功能点配置 */
    config: IFeatureConfigRequest;
  }

  /** 更新设备级配置 - 响应 */
  export interface ResUpdateDeviceFeatureConfig {
    /** 响应消息 */
    message: string;
  }

  /** 获取配置列表 - 请求参数 */
  export interface ReqDeviceFeatureConfigListParams {
    /** 学校ID */
    schoolId?: number;
    /** 厂商代码 */
    vendorCode?: string;
    /** 设备类型 */
    deviceType?: string;
  }

  /** 配置列表项 */
  export interface IDeviceFeatureConfigListItem {
    /** 配置ID */
    id: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 厂商代码 */
    vendorCode: string;
    /** 设备类型 */
    deviceType: string;
    /** 功能点配置 */
    config: IFeatureConfigResponse;
    /** 配置版本号 */
    configVersion: number;
  }

  /** 获取配置列表 - 响应 data */
  export interface ResDeviceFeatureConfigListData {
    /** 配置列表 */
    list: IDeviceFeatureConfigListItem[];
  }

  /** 同步配置 - 请求参数 */
  export interface ReqDeviceFeatureConfigSync {
    /** 设备ID列表 */
    deviceIds: number[];
    /** 功能点类型 */
    feature: TDeviceCommandCodeValue;
  }

  /** 同步配置 - 响应 data */
  export interface ResDeviceFeatureConfigSync {
    /** 响应消息 */
    message: string;
    /** 创建的命令数量 */
    count: number;
  }
}

// 学校模块
export namespace School {
  /** 学校列表 - 查询参数 */
  export interface ReqSchoolsListParams {
    page?: string | number;
    pageSize?: string | number;
    /** 学校名称（模糊搜索） */
    name?: string;
    /** 租户 ID */
    tenantId?: string | number;
    /** 状态筛选（全部传 -1） */
    status?: string | number;
  }

  /** 学校列表项 */
  export interface ISchoolItem {
    id: number;
    code?: string;
    name?: string;
    address?: string;
    phone?: string;
    /** 校长姓名 */
    principal?: string;
    /** 学校校训 */
    motto?: string;
    /** 校徽 URL */
    badge?: string;
    /** 学校描述 */
    description?: string;
    /** 校长简介 */
    principalIntro?: string;
    /** 背景图片 URL */
    background?: string;
    /** 学校照片 URLs */
    photos?: string[];
    tenantId?: number;
    tenantName?: string;
    scoreUrl?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  }

  /** 学校列表 - 响应 data */
  export interface ResSchoolsListData {
    list: ISchoolItem[];
    total: number;
  }

  /** 新增学校 - 请求参数 */
  export interface ReqPostSchoolApi {
    /** 学校名称 */
    name: string;
    /** 所属租户ID */
    tenantId: number;
    /** 学校地址 */
    address?: string;
    /** 联系电话 */
    phone?: string;
    /** 校长姓名 */
    principal?: string;
    /** 学校描述 */
    description?: string;
    /** 学校校训 */
    motto?: string;
    /** 校长简介 */
    principalIntro?: string;
    /** 校徽URL */
    badge?: string;
    /** 背景图片URL */
    background?: string;
    /** 学校照片URLs */
    photos?: string[];
    /** 服务器地址（成绩） */
    scoreUrl?: string;
  }

  /** 新增学校 - 响应 data */
  export interface ResPostSchoolApi {
    /** 学校ID */
    id: number;
    /** 学校编码 */
    code: string;
    /** 学校名称 */
    name: string;
  }

  /** 更新学校 - 请求参数 */
  export interface ReqPutSchoolApi {
    /** 学校名称 */
    name?: string;
    /** 学校地址 */
    address?: string;
    /** 联系电话 */
    phone?: string;
    /** 校长姓名 */
    principal?: string;
    /** 学校描述 */
    description?: string;
    /** 学校校训 */
    motto?: string;
    /** 校长简介 */
    principalIntro?: string;
    /** 校徽URL */
    badge?: string;
    /** 背景图片URL */
    background?: string;
    /** 学校照片URLs */
    photos?: string[];
    /** 服务器地址（成绩） */
    scoreUrl?: string;
    /** 状态，不修改传-1 */
    status: number;
    /** 排序，不修改传-1 */
    sort: number;
  }
}

// 赠费模块
export type { Gift } from "./modules/gifts";
// 级部模块
export type { Department } from "./modules/department";
// 班级模块
export type { Class } from "./modules/class";
// 学生模块
export type { Student } from "./modules/student";
// 亲情号模块
export type { FamilyContact } from "./modules/family-contact";
// 家长绑定状态模块
export type { FamilyBindStatus } from "./modules/family-bindstatus";
// 吹风机费率模块, 视频话机通话费率模块
export type { RateDryer, RateVideo } from "./modules/rate";
// 年级模块
export type { Grade } from "./modules/grade";
// 设备管理模块, 设备标签模块, 设备命令模块, 公话配置模块, 设备使用记录模块, 设备人脸库模块
export type {
  Device,
  DeviceTag,
  DeviceBaseTag,
  DeviceCommand,
  DeviceCommandRecord,
  DeviceDialConfig,
  SchoolDeviceConfig,
  DeviceUsage,
  DeviceFace
} from "./modules/device";
// 设备组模块
export type { DeviceGroup } from "./modules/device-group";
// 年级套餐配置模块
export type { GradePackage, GradeGeneralPackage, PackageRecord } from "./modules/package";
// 支付管理模块
export type { Payment } from "./modules/payment";
// 退款模块
export type { Refund } from "./modules/refund";
// 商户号配置模块
export type { Merchant } from "./modules/merchant";
// 系统管理模块
export type { System } from "./modules/system";
// 公共模块
export type { Common } from "./modules/common";
// 公告管理模块
export type { Announcement } from "./modules/announcement";
// 校园风采模块
export type { SchoolMien } from "./modules/school-mien";
// 人脸同步模块
export type { FaceSync } from "./modules/face-sync";
