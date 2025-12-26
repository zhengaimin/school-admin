import type { TStudentStatusValue } from "@/config/modules";

// 学生模块
export namespace Student {
  /** 学生类型 */
  export type StudentType = "BOARDING" | "DAY";

  /** 人脸状态：0-未采集，1-已采集，2-审核中，3-审核通过，4-审核失败 */
  export type FaceStatus = 0 | 1 | 2 | 3 | 4;

  /** 学生列表项 */
  export interface IStudentItemVo {
    id: number;
    /** 学生UUID（系统唯一标识） */
    uuid: string;
    /** 学生姓名 */
    name: string;
    /** 学号（学校分配） */
    studentCode: string;
    /** 身份证号 */
    idCard: string;
    /** 性别 */
    sex: string;
    /** IC卡号 */
    cardNumber: string;
    /** 联系电话 */
    phone: string;
    /** 监护人姓名 */
    guardianName: string;
    /** 监护人电话 */
    guardianPhone: string;
    /** 学生类型：BOARDING-寄宿生，DAY-走读生 */
    studentType: StudentType;
    /** 班级ID */
    classId: number;
    /** 班级名称 */
    className: string;
    /** 年级ID */
    gradeId: number;
    /** 年级名称 */
    gradeName: string;
    /** 学校ID */
    schoolId: number;
    /** 学校名称 */
    schoolName: string;
    /** 级部ID */
    departmentId: number;
    /** 级部名称 */
    departmentName: string;
    /** 人脸URL */
    faceImageUrl: string;
    /** 人脸状态 */
    faceStatus: FaceStatus;
    /** 租户ID */
    tenantId: number;
    /** 租户名称 */
    tenantName: string;
    /** 状态 */
    status: TStudentStatusValue;
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 可用余额 */
    availableBalance: string;
    /** 当前总余额 */
    totalBalance: string;
    /** 冻结余额（退款申请中） */
    frozenBalance: string;
    /** 赠送通话剩余分钟数 */
    giftMinutes: number;
    /** 赠送通话已使用分钟数 */
    giftMinutesUsed: number;
    /** 套餐通话剩余分钟数 */
    packageMinutes: number;
    /** 套餐通话已使用分钟数 */
    packageMinutesUsed: number;
    /** 套餐留言剩余条数 */
    packageMessageCount: number;
    /** 套餐留言已使用条数 */
    packageMessageCountUsed: number;
    /** 冻结的赠送时长分钟数 */
    frozenGiftMinutes: number;
    /** 冻结的套餐时长分钟数 */
    frozenPackageMinutes: number;
    /** 冻结的套餐留言条数 */
    frozenPackageMessageCount: number;
  }

  /** 获取学生列表 - 查询参数 */
  export interface ReqGetStudentsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 学生姓名（模糊搜索） */
    name?: string;
    /** 学号（模糊搜索） */
    studentCode?: string;
    /** 班级ID */
    classId?: number;
    /** 年级ID */
    gradeId?: number;
    /** 学校ID */
    schoolId?: number;
    /** 学生类型筛选 */
    studentType?: number;
    /** 状态筛选：-1不筛选 */
    status?: TStudentStatusValue | -1;
    /** 级部ID */
    departmentId?: number;
    /** 唯一号 */
    uuid?: string;
    /** 排序字段 */
    order?: string;
  }

  /** 获取学生列表 - 响应 data */
  export interface ResGetStudentsApi {
    /** 学生列表 */
    list: IStudentItemVo[];
    /** 总数量 */
    total: number;
  }
}
