import type { DeviceGroup } from "@/api/interface";
import type { DeviceGroupForm } from "../types";

/**
 * 构建设备组新增参数
 * @param form 表单数据
 * @param schoolId 学校ID
 * @returns 新增参数
 */
export function buildPostDeviceGroupPayload(form: DeviceGroupForm, schoolId: number): DeviceGroup.ReqPostDeviceGroupApi {
  return {
    name: form.name.trim(),
    code: form.code.trim(),
    isVoipGroup: form.isVoipGroup,
    schoolId,
    description: form.description.trim()
  };
}

/**
 * 构建设备组更新参数
 * @param form 表单数据
 * @returns 更新参数
 */
export function buildPutDeviceGroupPayload(form: DeviceGroupForm): DeviceGroup.ReqPutDeviceGroupApi {
  return {
    schoolId: form.schoolId,
    status: form.status,
    description: form.description.trim()
  };
}
