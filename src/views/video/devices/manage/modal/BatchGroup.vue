<script setup lang="ts">
import type { Device as DeviceVideo, DeviceGroup } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceRow } from "../types";

import { nextTick, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { getDeviceGroupListApi, postDeviceBatchAssignGroupApi } from "@/api/modules";

/** 单批最大设备数 */
const maxBatchSize = 20;
/** 设备组列表页大小 */
const deviceGroupPageSize = 200;

const emit = defineEmits<{
  submit: [];
}>();

/** 弹窗可见 */
const visible = ref(false);
/** 提交加载 */
const submitLoading = ref(false);
/** 设备组选项加载 */
const deviceGroupLoading = ref(false);
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 弹窗参数 */
const parameter = ref<TModalParams>({ title: "批量绑定设备组", type: "Edit", showConfirm: true });
/** 当前设备 */
const devices = ref<DeviceRow[]>([]);
/** 设备组选项 */
const deviceGroupOptions = ref<DeviceGroup.IDeviceGroupItemVo[]>([]);
/** 表单数据 */
const ruleForm = ref({ deviceGroupId: null as number | null });
/** 表单规则 */
const rules: FormRules = {
  deviceGroupId: [{ required: true, message: "请选择目标设备组", trigger: "change" }]
};

/** 获取设备组选项 */
async function axiosGetDeviceGroupListApi(schoolId: number): Promise<void> {
  deviceGroupLoading.value = true;
  try {
    const result = await getDeviceGroupListApi(
      { page: 1, pageSize: deviceGroupPageSize, schoolId, status: -1 },
      { loading: false }
    );
    deviceGroupOptions.value = result.code === 0 ? result.data?.list || [] : [];
  } catch (error) {
    console.error("axiosGetDeviceGroupListApi:", error);
    deviceGroupOptions.value = [];
  } finally {
    deviceGroupLoading.value = false;
  }
}
/** 批量绑定设备组 */
async function axiosPostDeviceBatchAssignGroupApi(): Promise<DeviceVideo.ResPostDeviceBatchAssignGroupApi | null> {
  try {
    const result = await postDeviceBatchAssignGroupApi({
      deviceIds: devices.value.map(item => item.id),
      deviceGroupId: Number(ruleForm.value.deviceGroupId)
    });
    return result.code === 0 ? result.data : null;
  } catch (error) {
    console.error("axiosPostDeviceBatchAssignGroupApi:", error);
    return null;
  }
}

/** 提交批量绑定 */
async function handleSubmitForm(): Promise<void> {
  if (!ruleFormRef.value || submitLoading.value) return;
  const valid = await ruleFormRef.value.validate().catch(() => false);
  if (!valid) return;
  const targetGroup = deviceGroupOptions.value.find(item => item.id === ruleForm.value.deviceGroupId);

  if (targetGroup?.isVoipGroup) {
    try {
      await ElMessageBox.confirm(
        `将 ${devices.value.length} 台设备绑定到 VOIP 设备组会同步修改微信设备组，确定继续吗？`,
        "同步确认",
        { type: "warning", confirmButtonText: "确认绑定", cancelButtonText: "取消" }
      );
    } catch {
      return;
    }
  }
  submitLoading.value = true;

  try {
    const result = await axiosPostDeviceBatchAssignGroupApi();
    if (!result) return;
    visible.value = false;
    emit("submit");

    await ElMessageBox.alert(
      result.message || `批量绑定设备组完成，成功${result.successCount}个，失败${result.failedCount}个`,
      "批量绑定结果",
      {
        type: result.failedCount > 0 ? "warning" : "success",
        confirmButtonText: "确定"
      }
    );
  } finally {
    submitLoading.value = false;
  }
}

/** 接收弹窗参数 */
async function acceptParams(params: TModalParams, rows: DeviceRow[]): Promise<void> {
  if (!rows.length) return;
  if (rows.length > maxBatchSize) {
    ElMessage.warning(`单次最多选择 ${maxBatchSize} 台设备`);
    return;
  }
  const schoolIds = new Set(rows.map(item => Number(item.schoolId)).filter(Boolean));
  if (schoolIds.size !== 1) {
    ElMessage.warning("请选择同一学校的设备进行批量绑组");
    return;
  }
  parameter.value = { ...parameter.value, ...params };
  devices.value = [...rows];
  ruleForm.value.deviceGroupId = null;
  visible.value = true;
  await axiosGetDeviceGroupListApi(Array.from(schoolIds)[0]);
  nextTick(() => ruleFormRef.value?.clearValidate());
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="parameter.title"
    width="760px"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <el-alert
      class="mb-4"
      type="warning"
      :closable="false"
      :title="`已选择 ${devices.length} 台设备，单次最多 ${maxBatchSize} 台`"
    />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="目标设备组" prop="deviceGroupId">
            <el-select
              v-model="ruleForm.deviceGroupId"
              class="w-full"
              filterable
              :loading="deviceGroupLoading"
              placeholder="请选择目标设备组"
            >
              <el-option v-for="item in deviceGroupOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="mb-2 text-sm text-gray-500">已选设备（{{ devices.length }} 台）</div>
    <el-table :data="devices" max-height="320" border>
      <el-table-column type="index" label="#" width="56" align="center" />
      <el-table-column prop="name" label="设备名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="terminalSn" label="设备SN" min-width="180" show-overflow-tooltip />
      <el-table-column prop="deviceGroupName" label="当前设备组" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ row.deviceGroupName || "--" }}</template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        v-if="parameter.showConfirm"
        type="primary"
        :loading="submitLoading"
        :disabled="!devices.length"
        @click="handleSubmitForm"
      >
        确定绑定（{{ devices.length }} 台）
      </el-button>
    </template>
  </el-dialog>
</template>
