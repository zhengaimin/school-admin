<script setup lang="ts">
import type { DeviceConfig } from "@/api/interface";

import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { DEVICE_COMMAND_CODE, DEVICE_COMMAND_CODE_OPTIONS } from "@/config/modules";
import { postDeviceFeatureConfigSyncApi } from "@/api/modules/device/config";

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
const deviceId = ref<number>(0);
const isOnline = ref(false);

const ruleFormRef = ref();
const ruleForm = ref<{ commandCode: DeviceConfig.ReqDeviceFeatureConfigSync["feature"] }>({
  commandCode: DEVICE_COMMAND_CODE.SYNC_QR_CODE
});

const rules = {
  commandCode: [{ required: true, message: "请选择命令类型", trigger: "change" }]
};

const canSubmit = computed(() => isOnline.value);

/** 下发设备命令 */
async function axiosPostDeviceFeatureConfigSyncApi(params: DeviceConfig.ReqDeviceFeatureConfigSync) {
  try {
    const result = await postDeviceFeatureConfigSyncApi(params);
    return result;
  } catch (error) {
    console.error("axiosPostDeviceFeatureConfigSyncApi:", error);
    return { code: -1, data: null };
  }
}
/** 接收参数 */
function acceptParams(params: TModalParams, row?: { id: number; status: number }) {
  parameter.value = { ...parameter.value, ...params };
  if (!row) return;
  deviceId.value = row.id;
  isOnline.value = row.status === 1;
  ruleForm.value.commandCode = DEVICE_COMMAND_CODE.SYNC_QR_CODE;
  visible.value = true;
}
/** 提交表单 */
async function handleSubmitForm() {
  await ruleFormRef.value?.validate();
  loading.value = true;
  try {
    const result = await axiosPostDeviceFeatureConfigSyncApi({
      deviceIds: [deviceId.value],
      feature: ruleForm.value.commandCode
    });
    if (result.code !== 0) return;
    ElMessage.success(result.data?.message || "命令下发成功");
    visible.value = false;
  } finally {
    loading.value = false;
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="480px" destroy-on-close draggable align-center>
    <el-alert v-if="!isOnline" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
      设备当前离线，无法下发命令
    </el-alert>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-form-item label="命令类型" prop="commandCode">
        <el-select v-model="ruleForm.commandCode" class="w-full" placeholder="请选择命令类型">
          <el-option v-for="item in DEVICE_COMMAND_CODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" :disabled="!canSubmit" @click="handleSubmitForm">
        下发
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
