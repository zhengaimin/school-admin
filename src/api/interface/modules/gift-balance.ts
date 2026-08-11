/** 赠费余额模板下载与导入接口类型。 */
import { DEVICE_TYPE } from "@/config/modules";

/** 赠费余额管理模块。 */
export namespace GiftBalance {
  /** 赠费余额支持的设备类型。 */
  export type TGiftBalanceDeviceTypeValue = DEVICE_TYPE.VIDEO | DEVICE_TYPE.DRYER;

  /** 下载赠费余额更新模板的请求参数。 */
  export interface ReqGetGiftBalanceTemplateApi {
    /** 设备类型。 */
    deviceType: TGiftBalanceDeviceTypeValue;
    /** 学生姓名、学号或UUID模糊查询。 */
    studentKeyword?: string;
    /** 学生UUID精准查询。 */
    studentUuid?: string;
    /** 学校ID，-1表示全部。 */
    schoolId?: number;
    /** 级部ID，-1表示全部。 */
    departmentId?: number;
    /** 年级ID，-1表示全部。 */
    gradeId?: number;
    /** 班级ID，-1表示全部。 */
    classId?: number;
  }

  /** 导入赠费余额更新文件的请求参数。 */
  export interface ReqPostGiftBalanceImportApi {
    /** 设备类型，必须与模板一致。 */
    deviceType: TGiftBalanceDeviceTypeValue;
  }

  /** 赠费余额导入失败项。 */
  export interface IGiftBalanceImportFailureVo {
    /** Excel行号。 */
    row: number;
    /** 学生UUID。 */
    studentUuid: string;
    /** 学生姓名。 */
    studentName: string;
    /** 学号。 */
    studentCode: string;
    /** 设备类型。 */
    deviceType: string;
    /** 当前赠费余额。 */
    currentGiftBalance: string;
    /** 目标赠费余额。 */
    targetGiftBalance: string;
    /** 失败原因。 */
    reason: string;
  }

  /** 赠费余额导入响应数据。 */
  export interface ResPostGiftBalanceImportApi {
    /** Excel总行数。 */
    totalCount: number;
    /** 成功更新数量。 */
    successCount: number;
    /** 跳过数量。 */
    skipCount: number;
    /** 失败数量。 */
    failCount: number;
    /** 失败列表。 */
    failList: IGiftBalanceImportFailureVo[];
    /** 失败标注Excel下载地址。 */
    failureFileUrl?: string;
    /** 失败标注Excel文件名。 */
    failureFileName?: string;
  }
}
