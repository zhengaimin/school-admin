import type { TAnnouncementStatusValue } from "@/config/modules/announcement";

// 校园风采模块
export namespace SchoolMien {
  /** 校园风采列表项 */
  export interface ISchoolMienItem {
    /** 记录ID */
    id: number;
    /** 租户ID */
    tenantId?: number;
    /** 学校名称 */
    schoolName?: string;
    /** 学校ID */
    schoolId?: number;
    /** 创建人ID */
    createdBy?: number;
    /** 内容 */
    content?: string;
    /** 图片列表 */
    images?: string[];
    /** 视频地址 */
    videoUrl?: string;
    /** 视频时长 */
    videoDuration?: number;
    /** 点赞数 */
    likeCount?: number;
    /** 排序值 */
    sort?: number;
    /** 状态 */
    status?: TAnnouncementStatusValue;
    /** 状态文案 */
    statusText?: string;
    /** 发布时间 */
    publishedAt?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
  }

  /** 获取校园风采列表 - 请求参数 */
  export interface ReqGetSchoolMienListApi {
    /** 学校ID */
    schoolId?: number;
    /** 状态 */
    status?: TAnnouncementStatusValue;
    /** 关键词 */
    keyword?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 排序字段 */
    sort?: string;
  }

  /** 获取校园风采列表 - 响应 data */
  export interface ResGetSchoolMienListApi {
    /** 列表 */
    list: ISchoolMienItem[];
    /** 总数 */
    total: number;
  }

  /** 获取校园风采详情 - 响应 data */
  export type ResGetSchoolMienDetailApi = ISchoolMienItem;

  /** 创建校园风采 - 请求参数 */
  export interface ReqPostSchoolMienApi {
    /** 学校ID */
    schoolId: number;
    /** 内容 */
    content: string;
    /** 图片URL数组 */
    images?: string[];
    /** 视频URL */
    videoUrl?: string;
    /** 视频时长（秒） */
    videoDuration?: number;
    /** 排序权重 */
    sort?: number;
    /** 状态 */
    status?: TAnnouncementStatusValue;
  }

  /** 创建校园风采 - 响应 data */
  export type ResPostSchoolMienApi = ISchoolMienItem;

  /** 更新校园风采 - 请求参数 */
  export interface ReqPutSchoolMienApi {
    /** 内容 */
    content: string;
    /** 图片URL数组 */
    images?: string[];
    /** 视频URL */
    videoUrl?: string;
    /** 视频时长（秒） */
    videoDuration?: number;
    /** 排序权重 */
    sort?: number;
  }

  /** 更新校园风采 - 响应 data */
  export type ResPutSchoolMienApi = ISchoolMienItem;

  /** 批量更新校园风采状态 - 请求参数 */
  export interface ReqPutSchoolMienStatusApi {
    /** 校园风采ID数组 */
    ids: number[];
    /** 状态 */
    status: TAnnouncementStatusValue;
  }

  /** 更新校园风采排序 - 请求参数 */
  export interface ReqPutSchoolMienSortApi {
    /** 校园风采ID */
    id: number;
    /** 排序权重 */
    sort?: number;
  }
}
