import type { TDeviceTypeValue } from "@/config/modules";

// 赠费模块
export namespace Gift {
  /** 赠费状态：1-有效 2-已用完 3-已过期 4-已取消 */
  export type GiftStatus = 1 | 2 | 3 | 4;

  /** 赠费来源 */
  export type GiftSource = "ADMIN_GIFT" | "RECHARGE_BONUS";

  /** 赠费列表项 */
  export interface IGiftItemVo {
    /** 赠费记录ID */
    id: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学校名称 */
    schoolName: string;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 设备类型文本 */
    deviceTypeText: string;
    /** 总赠送分钟数 */
    totalMinutes: number;
    /** 剩余分钟数 */
    remainingMinutes: number;
    /** 已使用分钟数 */
    usedMinutes: number;
    /** 生效时间 */
    startDate: string;
    /** 过期时间 */
    expireDate: string;
    /** 赠费来源 */
    source: GiftSource;
    /** 赠费来源文本 */
    sourceText: string;
    /** 描述信息 */
    description: string;
    /** 状态 */
    status: GiftStatus;
    /** 状态文本 */
    statusText: string;
    /** 剩余有效天数 */
    remainingDays: number;
    /** 创建时间 */
    createdAt: string;
  }

  /** 获取赠费列表 - 查询参数 */
  export interface ReqGetGiftsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 状态筛选：1-有效 2-已用完 3-已过期 4-已取消 */
    status?: GiftStatus;
    /** 来源筛选 */
    source?: GiftSource;
    /** 设备类型筛选 */
    deviceType?: TDeviceTypeValue;
    /** 学生关键词（姓名或学号） */
    studentKeyword?: string;
    /** 学生UUID精准查询 */
    studentUuid?: string;
    /** 学校ID筛选 */
    schoolId?: number;
    /** 级部ID筛选 */
    departmentId?: number;
    /** 年级ID筛选 */
    gradeId?: number;
    /** 班级ID筛选 */
    classId?: number;
  }

  /** 获取赠费列表 - 响应 data */
  export interface ResGetGiftsApi {
    /** 赠费列表 */
    items: IGiftItemVo[];
    /** 总数量 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 总页数 */
    totalPages: number;
  }

  /** 批量添加赠费 - 请求参数 */
  export interface ReqPostGiftsBatchApi {
    /** 学生ID列表（方式1：直接指定学生） */
    studentIds?: number[];
    /** 学校ID（方式2：按学校批量赠送） */
    schoolId?: number;
    /** 年级ID */
    gradeId?: number;
    /** 级部ID */
    departmentId?: number;
    /** 班级ID */
    classId?: number;
    /** 设备类型，不传默认为VIDEO（视频话机） */
    deviceType?: TDeviceTypeValue;
    /** 赠送分钟数（必填，最小值1） */
    minutes: number;
    /** 过期日期，格式：YYYY-MM-DD（必填） */
    expireDate: string;
    /** 描述信息（最大255字符） */
    description?: string;
  }

  /** 批量添加赠费 - 响应 data */
  export interface ResPostGiftsBatchApi {
    /** 总数量 */
    totalCount: number;
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failedCount: number;
    /** 赠送分钟数 */
    minutes: number;
    /** 过期日期 */
    expireDate: string;
    /** 赠费来源 */
    source: GiftSource;
    /** 赠费来源文本 */
    sourceText: string;
    /** 描述信息 */
    description?: string;
  }

  /** 取消赠费 - 请求参数 */
  export interface ReqCancelGiftApi {
    /** 赠费记录ID */
    id: number;
  }

  /** 取消赠费 - 响应 data */
  export interface ResCancelGiftApi {
    message: string;
  }

  /** 批量取消赠费 - 请求参数 */
  export interface ReqPostGiftsBatchCancelApi {
    /** 赠费记录ID列表 */
    giftIds: number[];
  }

  /** 批量取消赠费 - 响应 data */
  export interface ResPostGiftsBatchCancelApi {
    /** 总数量 */
    totalCount: number;
    /** 成功数量 */
    successCount: number;
    /** 失败数量 */
    failedCount: number;
  }
}
