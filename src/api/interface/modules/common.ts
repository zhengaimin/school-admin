import type {
  TApkMessageTemplateCategoryValue,
  TApkMessageTemplateScopeValue
} from "@/config/modules/common/apk-message-template";
import type { TApkPackageStatusValue, TApkTerminalTypeValue, TApkUpgradeScopeValue } from "@/config/modules/common/apk";

export namespace Common {
  /** APK 错误话术模板列表项 */
  export interface IApkMessageTemplateItemVo {
    /** 主键ID */
    id: number;
    /** 渠道 */
    channel: string;
    /** 语义键 */
    shrgKey: string;
    /** 分类 */
    category: TApkMessageTemplateCategoryValue;
    /** 话术内容 */
    message: string;
    /** 说明 */
    description?: string;
    /** 作用域 */
    scope: TApkMessageTemplateScopeValue;
    /** 生效作用域 */
    effectiveScope?: TApkMessageTemplateScopeValue;
    /** 是否启用 */
    isEnabled: boolean;
    /** 乐观锁版本号 */
    version: number;
    /** 租户ID */
    tenantId?: number;
    /** 学校ID */
    schoolId?: number;
    /** 更新时间 */
    updatedAt?: string;
    /** 更新人 */
    updatedBy?: number;
  }

  /** APK 错误话术模板详情 */
  export type IApkMessageTemplateDetailVo = IApkMessageTemplateItemVo;

  /** APK 错误话术审计日志项 */
  export interface IApkMessageTemplateAuditItemVo {
    /** 主键ID */
    id: number;
    /** 语义键 */
    shrgKey: string;
    /** 作用域 */
    scope: TApkMessageTemplateScopeValue;
    /** 操作动作 */
    action: "create" | "update" | "reset_inherit";
    /** 变更前话术 */
    beforeMessage?: string;
    /** 变更后话术 */
    afterMessage?: string;
    /** 变更前版本 */
    beforeVersion?: string;
    /** 变更后版本 */
    afterVersion?: string;
    /** 操作人ID */
    operatorId: number;
    /** 操作人名称 */
    operatorName?: string;
    /** 操作时间 */
    createdAt: string;
  }

  /** 获取 APK 错误话术列表 - 请求参数 */
  export interface ReqGetApkMessageTemplatesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 作用域筛选 */
    scope?: TApkMessageTemplateScopeValue;
    /** 分类筛选 */
    category?: TApkMessageTemplateCategoryValue;
    /** 语义键/文案关键字 */
    keyword?: string;
    /** 排序 */
    sort?: string;
    /** 学校ID（可选） */
    schoolId?: number;
  }

  /** 获取 APK 错误话术列表 - 响应 data */
  export interface ResGetApkMessageTemplatesApi {
    /** 列表 */
    list: IApkMessageTemplateItemVo[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取 APK 错误话术详情 - 响应 data */
  export type ResGetApkMessageTemplateDetailApi = IApkMessageTemplateDetailVo;

  /** 更新 APK 错误话术 - 请求参数 */
  export interface ReqPutUpdateApkMessageTemplateApi {
    /** 话术内容 */
    message: string;
    /** 说明 */
    description?: string;
    /** 乐观锁版本号 */
    version: number;
    /** 是否启用 */
    isEnabled?: boolean;
  }

  /** 恢复继承 - 请求参数 */
  export interface ReqPostResetInheritApkMessageTemplateApi {
    /** 乐观锁版本号 */
    version: number;
  }

  /** 导出 APK 错误话术 - 请求参数 */
  export interface ReqExportApkMessageTemplatesApi {
    /** 作用域筛选 */
    scope?: TApkMessageTemplateScopeValue;
    /** 分类筛选 */
    category?: TApkMessageTemplateCategoryValue;
    /** 语义键/文案关键字 */
    keyword?: string;
    /** 学校ID（可选） */
    schoolId?: number;
  }

  /** 获取 APK 错误话术审计日志 - 请求参数 */
  export interface ReqGetApkMessageTemplateAuditsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 语义键 */
    shrgKey?: string;
    /** 作用域 */
    scope?: TApkMessageTemplateScopeValue;
    /** 学校ID（可选） */
    schoolId?: number;
  }

  /** 获取 APK 错误话术审计日志 - 响应 data */
  export interface ResGetApkMessageTemplateAuditsApi {
    /** 列表 */
    list: IApkMessageTemplateAuditItemVo[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 获取RSA公钥 */
  export interface ResGetRsaPublicKeyApi {
    publicKey: string;
  }

  /** APK 包列表状态筛选：-1 全部，1 已发布，2 已下线 */
  export type TApkPackageListStatusQuery = -1 | 1 | 2;

  /** APK 包列表项 */
  export interface IApkPackageItemVo {
    /** 主键ID */
    id: number;
    /** 终端类型 */
    terminalType?: TApkTerminalTypeValue;
    /** 包名 */
    packageName: string;
    /** 版本名称 */
    versionName: string;
    /** 版本号 */
    versionCode: number;
    /** 文件大小（字节） */
    fileSize: number;
    /** 下载地址 */
    downloadUrl?: string;
    /** 校验值 */
    checksum?: string;
    /** 更新日志 */
    changelog?: string;
    /** 状态 */
    status: TApkPackageStatusValue;
    /** 发布时间 */
    publishedAt?: string;
    /** 创建人 */
    createdBy?: number;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt?: string;
  }

  /** APK 包详情 */
  export type IApkPackageDetailVo = IApkPackageItemVo;

  /** 获取 APK 列表 - 请求参数 */
  export interface ReqGetApkPackagesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 状态筛选（-1 全部，1 已发布，2 已下线） */
    status?: TApkPackageListStatusQuery;
  }

  /** 获取 APK 列表 - 响应 data */
  export interface ResGetApkPackagesApi {
    /** 列表 */
    list: IApkPackageItemVo[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 上传 APK - 请求参数 */
  export interface ReqPostApkPackageApi {
    /** APK 文件 */
    file: File;
    /** 更新日志 */
    changelog?: string;
    /** 状态 */
    status?: TApkPackageStatusValue;
  }

  /** 上传 APK - 响应 data */
  export interface ResPostApkPackageApi {
    /** 主键ID */
    id: number;
    /** 包名 */
    packageName: string;
    /** 版本名称 */
    versionName: string;
    /** 版本号 */
    versionCode: number;
    /** 文件大小（字节） */
    fileSize: number;
    /** 校验值 */
    checksum: string;
    /** 状态 */
    status: TApkPackageStatusValue;
  }

  /** 更新 APK - 请求参数 */
  export interface ReqPutUpdateApkPackageApi {
    /** 更新日志 */
    changelog?: string;
  }

  /** 获取 APK 详情 - 响应 data */
  export type ResGetApkPackageDetailApi = IApkPackageDetailVo;

  /** 批量升级 - 请求参数 */
  export interface ReqPostApkPackagesBatchUpgradeApi {
    /** 目标 APK 包ID */
    apkPackageId: number;
    /** 升级范围 */
    scope: TApkUpgradeScopeValue;
    /** 学校ID列表 */
    schoolIds?: number[];
    /** 标签ID列表 */
    tagIds?: number[];
    /** 设备ID列表 */
    deviceIds?: number[];
  }

  /** 批量升级 - 响应 data */
  export interface ResPostApkPackagesBatchUpgradeApi {
    /** 影响设备数量 */
    affectedCount: number;
  }
}
