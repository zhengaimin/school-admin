import type { TApkHomepageLayoutHeightModeValue, TApkHomepageLayoutSyncStatusValue, TYesNoFlagValue } from "@/config/modules";

// APK 首页布局配置模块
export namespace ApkHomepageLayout {
  /** 首页布局模块编码 */
  export type THomepageLayoutModuleCode = "schoolMien" | "noticeList" | "messageList" | "statistics";

  /** 首页布局模块显示标记 */
  export type THomepageLayoutVisible = TYesNoFlagValue;

  /** 首页布局模块高度模式 */
  export type THomepageLayoutHeightMode = TApkHomepageLayoutHeightModeValue;

  /** 首页布局设备同步状态 */
  export type TApkHomepageLayoutSyncStatus = TApkHomepageLayoutSyncStatusValue;

  /** 首页布局模块项 */
  export interface IHomepageLayoutModule {
    /** 模块编码 */
    code: THomepageLayoutModuleCode;
    /** 显示标记 */
    visible: THomepageLayoutVisible;
    /** 模块高度 */
    height: number;
    /** 模块高度模式 */
    heightMode: THomepageLayoutHeightMode;
    /** 模块排序 */
    sort: number;
  }

  /** 首页布局结构 */
  export interface IHomepageLayout {
    /** 模块列表 */
    modules: IHomepageLayoutModule[];
  }

  /** 获取学校首页布局配置 - 响应 data */
  export interface ResGetApkHomepageLayoutConfigApi {
    /** 学校ID */
    schoolId: number;
    /** 当前布局版本 */
    layoutVersion: string;
    /** 首页布局 */
    layout: IHomepageLayout;
    /** 更新时间 */
    updatedAt?: string;
    /** 更新人ID */
    updatedBy?: number;
  }

  /** 保存学校首页布局配置 - 请求参数 */
  export interface ReqPutApkHomepageLayoutConfigApi {
    /** 首页布局 */
    layout: IHomepageLayout;
  }

  /** 保存学校首页布局配置 - 响应 data */
  export interface ResPutApkHomepageLayoutConfigApi {
    /** 学校ID */
    schoolId: number;
    /** 当前布局版本 */
    layoutVersion: string;
    /** 触发模式 */
    triggerMode?: string;
  }

  /** 重置默认布局 - 响应 data */
  export interface ResPostResetApkHomepageLayoutConfigApi {
    /** 学校ID */
    schoolId: number;
    /** 当前布局版本 */
    layoutVersion: string;
  }

  /** 查看设备同步状态 - 请求参数 */
  export interface ReqGetApkHomepageLayoutDeviceStatesApi {
    /** 同步状态筛选 */
    status?: TApkHomepageLayoutSyncStatus;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 设备同步状态项 */
  export interface IApkHomepageLayoutDeviceStateItem {
    /** 设备ID */
    deviceId: number;
    /** 目标布局版本 */
    targetLayoutVersion?: string;
    /** 已应用布局版本 */
    appliedLayoutVersion?: string;
    /** 同步状态 */
    syncStatus: TApkHomepageLayoutSyncStatus;
    /** 最后回告时间 */
    lastReportAt?: string;
    /** 最近错误信息 */
    lastError?: string;
  }

  /** 查看设备同步状态 - 响应 data */
  export interface ResGetApkHomepageLayoutDeviceStatesApi {
    /** 总数 */
    total: number;
    /** 列表 */
    list: IApkHomepageLayoutDeviceStateItem[];
    /** 当前页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 重试下发布局命令 - 请求参数 */
  export interface ReqPostRetryApkHomepageLayoutApi {
    /** 重试设备ID列表（为空时由后端按失败/离线设备处理） */
    deviceIds?: number[];
  }

  /** 重试下发布局命令 - 响应 data */
  export interface ResPostRetryApkHomepageLayoutApi {
    /** 已受理数量 */
    accepted?: number;
  }
}
