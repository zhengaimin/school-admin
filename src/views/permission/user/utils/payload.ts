import type { DataScopeAcceptPayload, DataScopeParams } from "../types";

import { DATA_SCOPE_TYPE } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

/** 构建数据权限弹窗接收参数 */
export function buildDataScopeAcceptPayload(params: DataScopeParams): DataScopeAcceptPayload {
  return {
    parameter: {
      title: params.title,
      type: params.type,
      showConfirm: params.showConfirm
    },
    scopeType: params.scopeType ?? DATA_SCOPE_TYPE.SCHOOL,
    userId: params.userId,
    userName: params.userName,
    tenantId: isNullOrUnDef(params.tenantId) ? undefined : params.tenantId
  };
}
