// 家长绑定状态模块
export namespace FamilyBindStatus {
  /** 家长绑定状态列表项 */
  export interface IFamilyBindStatusItemVo {
    /** 用户ID（用于查询订阅设备组） */
    userId: number;
    /** 学生ID */
    studentId: number;
    /** 学生唯一号 */
    uuid: string;
    /** 学生姓名 */
    studentName: string;
    /** 班级名称 */
    className: string;
    /** 年级名称 */
    gradeName: string;
    /** 学校名称 */
    schoolName: string;
    /** 家长名称 */
    parentName: string;
    /** 称谓 */
    relation: string;
    /** 联系人号码 */
    phone: string;
    /** 是否主联系人 */
    isPrimary: boolean;
    /** 微信是否绑定 */
    wechatBound: boolean;
    /** 微信绑定时间（可为空） */
    wechatBindTime?: string | null;
    /** 订阅设备组数量 */
    subscribedGroupCount: number;
  }

  /** 获取家长绑定状态列表 - 请求参数 */
  export interface ReqGetFamilyBindStatusListApi {
    /** 学校ID */
    schoolId: number;
    /** 年级ID */
    gradeId?: number;
    /** 班级ID */
    classId?: number;
    /** 学生唯一号（模糊查询） */
    studentNo?: string;
    /** 学生姓名（模糊查询） */
    studentName?: string;
    /** 手机号（模糊查询） */
    phone?: string;
    /** 微信绑定状态 */
    wechatBound?: boolean;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
  }

  /** 获取家长绑定状态列表 - 响应 data */
  export interface ResGetFamilyBindStatusListApi {
    /** 总数 */
    total: number;
    /** 列表 */
    list: IFamilyBindStatusItemVo[];
  }

  /** 订阅设备组信息 */
  export interface IFamilySubscriptionItemVo {
    /** 设备组ID */
    groupId: number;
    /** 设备组名称 */
    groupName: string;
  }

  /** 获取订阅设备组列表 - 响应 data */
  export interface ResGetFamilyBindStatusSubscriptionsApi {
    /** 订阅设备组列表 */
    list: IFamilySubscriptionItemVo[];
  }

  /** 获取导出信息 - 请求参数 */
  export interface ReqGetFamilyBindStatusExportInfoApi {
    /** 学校ID */
    schoolId: number;
    /** 年级ID */
    gradeId?: number;
    /** 班级ID */
    classId?: number;
    /** 学生唯一号（模糊查询） */
    studentNo?: string;
    /** 学生姓名（模糊查询） */
    studentName?: string;
    /** 手机号（模糊查询） */
    phone?: string;
    /** 微信绑定状态 */
    wechatBound?: boolean;
  }

  /** 获取导出信息 - 响应 data */
  export interface ResGetFamilyBindStatusExportInfoApi {
    /** 总记录数 */
    totalRecords: number;
    /** 总页数 */
    totalPages: number;
    /** 每页大小 */
    pageSize: number;
  }

  /** 导出家长绑定状态 - 请求参数 */
  export interface ReqGetFamilyBindStatusExportApi extends ReqGetFamilyBindStatusExportInfoApi {
    /** 页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }
}
