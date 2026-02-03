import type { TAnnouncementAudienceValue, TAnnouncementScopeValue, TAnnouncementStatusValue } from "@/config/modules/announcement";

// 公告管理模块
export namespace Announcement {
  /** 公告投放规则 */
  export interface IAnnouncementTarget {
    /** 受众类型 */
    audienceType: TAnnouncementAudienceValue;
    /** 范围类型 */
    scopeType: TAnnouncementScopeValue;
    /** 范围ID（全校为0） */
    scopeId: number;
  }

  /** 公告列表项 */
  export interface IAnnouncementItem {
    /** 公告ID */
    id: number;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName?: string;
    /** 标题 */
    title: string;
    /** 正文 */
    content: string;
    /** 图片URL列表 */
    images?: string[];
    /** 发布状态 */
    status: TAnnouncementStatusValue;
    /** 发布时间 */
    publishAt?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
    /** 投放规则 */
    targets?: IAnnouncementTarget[];
  }

  /** 获取公告列表 - 查询参数 */
  export interface ReqGetAnnouncementsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 标题关键词 */
    title?: string;
    /** 状态 */
    status?: TAnnouncementStatusValue;
    /** 开始时间 */
    startTime?: string;
    /** 结束时间 */
    endTime?: string;
    /** 学校ID */
    schoolId?: number;
  }

  /** 获取公告列表 - 响应 data */
  export interface ResGetAnnouncementsApi {
    /** 公告列表 */
    list: IAnnouncementItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 创建公告 - 请求参数 */
  export interface ReqPostAnnouncementApi {
    /** 学校ID */
    schoolId: number;
    /** 标题 */
    title: string;
    /** 正文 */
    content: string;
    /** 图片URL列表 */
    images?: string[];
    /** 投放规则 */
    targets: IAnnouncementTarget[];
  }

  /** 创建公告 - 响应 data */
  export interface ResPostAnnouncementApi {
    /** 公告ID */
    id: number;
  }

  /** 更新公告 - 请求参数 */
  export interface ReqPutAnnouncementApi {
    /** 标题 */
    title?: string;
    /** 正文 */
    content?: string;
    /** 图片URL列表 */
    images?: string[];
    /** 投放规则 */
    targets?: IAnnouncementTarget[];
  }

  /** 公告详情 - 响应 data */
  export type ResGetAnnouncementDetailApi = IAnnouncementItem;

  /** 批量发布 - 请求参数 */
  export interface ReqPostAnnouncementPublishApi {
    /** 公告ID列表 */
    ids: number[];
  }

  /** 批量撤回 - 请求参数 */
  export interface ReqPostAnnouncementRevokeApi {
    /** 公告ID列表 */
    ids: number[];
  }

  /** 批量删除 - 请求参数 */
  export interface ReqDeleteAnnouncementApi {
    /** 公告ID列表 */
    ids: number[];
  }
}
