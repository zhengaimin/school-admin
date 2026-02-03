import type { TFamilyContactRelationshipValue } from "@/config/modules";

// 亲情号模块
export namespace FamilyContact {
  /** 亲情号基础信息 */
  export interface IFamilyContactBaseVo {
    /** 亲情号ID */
    id: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentCode: string;
    /** 学校名称 */
    schoolName: string;
    /** 称谓类型 */
    relationship: TFamilyContactRelationshipValue;
    /** 称谓名称 */
    relationshipName: string;
    /** 别称 */
    nickname: string;
    /** 手机号码 */
    phone: string;
    /** 是否主联系人 */
    isPrimary: boolean;
    /** 排序值 */
    sortOrder: number;
    /** 创建时间 */
    createdAt: string;
  }

  /** 亲情号列表项 */
  export interface IFamilyContactItemVo extends IFamilyContactBaseVo {
    /** 班级名称 */
    className: string;
  }

  /** 亲情号详情 */
  export interface IFamilyContactDetailVo extends IFamilyContactBaseVo {
    /** 更新时间 */
    updatedAt: string;
  }

  /** 亲情号列表 - 请求参数 */
  export interface ReqGetFamilyContactsApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 学生ID筛选 */
    studentId?: number;
    /** 手机号筛选（模糊搜索） */
    phone?: string;
    /** 称谓类型筛选 */
    relationship?: TFamilyContactRelationshipValue;
    /** 学校ID */
    schoolId?: number;
    /** 筛选(-1表示不筛选 1表示要查主联系人 其他值表示查非主联系人) */
    isPrimary?: number;
  }

  /** 亲情号列表 - 响应 data */
  export interface ResGetFamilyContactsApi {
    /** 列表 */
    list: IFamilyContactItemVo[];
    /** 总数 */
    total: number;
  }

  /** 新增亲情号 - 请求参数 */
  export interface ReqPostFamilyContactApi {
    /** 学生ID */
    studentId: number;
    /** 称谓类型 */
    relationship: TFamilyContactRelationshipValue;
    /** 别称 */
    nickname: string;
    /** 手机号码 */
    phone: string;
    /** 是否主联系人 */
    isPrimary: boolean;
    /** 显示排序值 */
    sortOrder: number;
  }

  /** 新增亲情号 - 响应 data */
  export interface ResPostFamilyContactApi {
    /** 亲情号ID */
    id: number;
    /** 姓名 */
    name: string;
  }

  /** 更新亲情号 - 请求参数 */
  export interface ReqPutFamilyContactApi {
    /** 称谓类型 */
    relationship: TFamilyContactRelationshipValue;
    /** 别称 */
    nickname: string;
    /** 手机号码 */
    phone: string;
    /** 是否主联系人 */
    isPrimary: boolean;
    /** 显示排序值 */
    sortOrder: number;
  }

  /** 更新亲情号 - 响应 data */
  export interface ResPutFamilyContactApi {
    /** 响应消息 */
    message: string;
  }

  /** 删除亲情号 - 响应 data */
  export interface ResDeleteFamilyContactApi {
    /** 响应消息 */
    message: string;
  }

  /** 获取亲情号详情 - 响应 data */
  export type ResGetFamilyContactDetailApi = IFamilyContactDetailVo;

  /** 亲情号称谓选项 */
  export interface IFamilyContactRelationshipOptionVo {
    /** 值 */
    value: TFamilyContactRelationshipValue;
    /** 文案 */
    label: string;
  }

  /** 获取称谓选项 - 响应 data */
  export interface ResGetFamilyContactRelationshipOptionsApi {
    /** 称谓选项 */
    relationships: IFamilyContactRelationshipOptionVo[];
  }
}
