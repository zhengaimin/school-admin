import type {
  TDeviceFaceSyncStatusValue,
  TDeviceFaceDesiredActionValue,
  TDeviceFaceErrorCodeValue,
  TFaceSyncActionValue
} from "@/config/modules/device";

export namespace FaceSync {
  /** 设备维度人脸同步状态项 */
  export interface IDeviceFaceStateItem {
    /** 状态ID */
    id: number;
    /** 设备ID */
    deviceId: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 学号 */
    studentNo: string;
    /** 同步状态 */
    status: TDeviceFaceSyncStatusValue | null;
    /** 期望动作 */
    desiredAction: TDeviceFaceDesiredActionValue;
    /** 期望版本 */
    desiredVersion: number;
    /** 已同步版本 */
    syncedVersion: number;
    /** 失败原因码 */
    lastErrorCode?: TDeviceFaceErrorCodeValue | string;
    /** 失败原因描述 */
    lastErrorMsg?: string;
    /** 最后同步时间 */
    lastSyncedAt?: string;
  }

  /** 设备维度人脸同步统计 */
  export interface IDeviceFaceStateStats {
    /** 总学生数 */
    total: number;
    /** 已同步数量 */
    synced: number;
    /** 待处理数量 */
    pending: number;
    /** 失败数量 */
    failed: number;
    /** 未建档数量 */
    unrecorded: number;
  }

  /** 获取设备人脸同步状态列表 - 请求参数 */
  export interface ReqGetDeviceFaceStatesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 同步状态 */
    status?: TDeviceFaceSyncStatusValue;
    /** 学生姓名（模糊查询） */
    studentName?: string;
    /** 学号（模糊查询） */
    studentNo?: string;
  }

  /** 获取设备人脸同步状态列表 - 响应 data */
  export interface ResGetDeviceFaceStatesApi {
    /** 列表 */
    list: IDeviceFaceStateItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 统计信息 */
    stats?: IDeviceFaceStateStats;
  }

  /** 按设备查询人脸同步状态 - 列表项 */
  export interface IDeviceFaceSyncStateByDeviceItem {
    /** 设备ID */
    deviceId: number;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 期望动作 */
    desiredAction: TDeviceFaceDesiredActionValue;
    /** 期望版本 */
    desiredVersion: number;
    /** 已同步版本 */
    syncedVersion: number;
    /** 同步状态 */
    status: TDeviceFaceSyncStatusValue;
    /** 最近失败码 */
    lastErrorCode: TDeviceFaceErrorCodeValue | string | null;
    /** 最近失败描述 */
    lastErrorMsg: string | null;
  }

  /** 按设备查询人脸同步状态 - 请求参数 */
  export interface ReqGetDeviceFaceSyncStatesByDeviceApi {
    /** 同步状态 */
    status?: TDeviceFaceSyncStatusValue;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
  }

  /** 按设备查询人脸同步状态 - 响应 data */
  export interface ResGetDeviceFaceSyncStatesByDeviceApi {
    /** 总数 */
    total: number;
    /** 列表 */
    list: IDeviceFaceSyncStateByDeviceItem[];
  }

  /** 学生维度人脸同步状态项 */
  export interface IStudentFaceStateItem {
    /** 状态ID */
    id: number;
    /** 设备ID */
    deviceId: number;
    /** 设备名称 */
    deviceName: string;
    /** 设备SN */
    deviceSn: string;
    /** 同步状态 */
    status: TDeviceFaceSyncStatusValue | null;
    /** 失败原因码 */
    lastErrorCode?: TDeviceFaceErrorCodeValue | string;
    /** 失败原因描述 */
    lastErrorMsg?: string;
    /** 最后同步时间 */
    lastSyncedAt?: string;
  }

  /** 学生维度人脸同步统计 */
  export interface IStudentFaceStateStats {
    /** 总设备数 */
    total: number;
    /** 已同步数量 */
    synced: number;
    /** 待处理数量 */
    pending: number;
    /** 失败数量 */
    failed: number;
  }

  /** 获取学生人脸同步状态列表 - 请求参数 */
  export interface ReqGetStudentFaceStatesApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 同步状态 */
    status?: TDeviceFaceSyncStatusValue;
  }

  /** 获取学生人脸同步状态列表 - 响应 data */
  export interface ResGetStudentFaceStatesApi {
    /** 列表 */
    list: IStudentFaceStateItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
    /** 统计信息 */
    stats?: IStudentFaceStateStats;
  }

  /** 人脸同步任务项 */
  export interface IFaceSyncTaskItem {
    /** 任务ID */
    id: number;
    /** 设备ID */
    deviceId: number;
    /** 设备名称 */
    deviceName: string;
    /** 学生ID */
    studentId: number;
    /** 学生姓名 */
    studentName: string;
    /** 命令类型 */
    commandType: string;
    /** 同步状态 */
    status: TDeviceFaceSyncStatusValue | string;
    /** 失败原因 */
    lastErrorMsg?: string;
    /** 创建时间 */
    createdAt?: string;
  }

  /** 获取人脸同步任务 - 请求参数 */
  export interface ReqGetFaceSyncTasksApi {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 状态 */
    status?: TDeviceFaceSyncStatusValue | string;
    /** 设备ID */
    deviceId?: number;
    /** 学生ID */
    studentId?: number;
    /** 命令ID */
    cmdUuid?: string;
  }

  /** 获取人脸同步任务 - 响应 data */
  export interface ResGetFaceSyncTasksApi {
    /** 列表 */
    list: IFaceSyncTaskItem[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  }

  /** 批量触发同步 - 请求参数 */
  export interface ReqPostFaceSyncBatchApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 标签ID */
    tagId?: number;
  }

  /** 批量触发同步（按标签） - 请求参数 */
  export interface ReqPostFaceSyncBatchByTagApi {
    /** 标签ID */
    tagId: number;
    /** 设备ID列表 */
    deviceIds?: number[];
  }

  /** 批量触发同步（按标签） - 命令项 */
  export interface IFaceSyncBatchCommandItem {
    /** 设备ID */
    deviceId: number;
    /** 命令UUID */
    cmdUuid: string;
  }

  /** 批量触发同步（按标签） - 响应 data */
  export interface ResPostFaceSyncBatchByTagApi {
    /** 命令列表 */
    items: IFaceSyncBatchCommandItem[];
  }

  /** 批量触发对账 - 请求参数 */
  export interface ReqPostFaceSyncReconcileApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 标签ID */
    tagId?: number;
  }

  /** 批量重试 - 请求参数 */
  export interface ReqPostFaceSyncRetryApi {
    /** 设备ID列表 */
    deviceIds?: number[];
    /** 学生ID列表 */
    studentIds?: number[];
  }

  /** 同步到全校设备 - 请求参数 */
  export interface ReqPostFaceSyncSchoolStudentApi {
    /** 操作类型 */
    action: TFaceSyncActionValue;
  }

  /** 同步到全校设备 - 响应 data */
  export interface ResPostFaceSyncSchoolStudentApi {
    /** 命令列表 */
    items: IFaceSyncBatchCommandItem[];
  }

  /** 同步相关操作 - 响应 data */
  export interface ResPostFaceSyncActionApi {
    /** 响应消息 */
    message: string;
  }
}
