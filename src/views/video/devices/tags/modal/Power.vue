<script setup lang="ts">
import type { DeviceTag } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceTagRow } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { postDeviceTagBatchScheduleApi } from "@/api/modules";

const visible = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref({
  deviceTagId: 0,
  powerOnTime: "",
  powerOffTime: ""
});

const rules: FormRules = {
  powerOnTime: [{ required: true, message: "请选择开机时间", trigger: "change" }],
  powerOffTime: [{ required: true, message: "请选择关机时间", trigger: "change" }]
};

const isView = computed(() => parameter.value.type === "View");

// 提交表单
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const payload: DeviceTag.ReqPostDeviceTagBatchScheduleApi = {
        deviceTagId: ruleForm.value.deviceTagId,
        powerOnTime: ruleForm.value.powerOnTime,
        powerOffTime: ruleForm.value.powerOffTime
      };
      const result = await postDeviceTagBatchScheduleApi(payload);
      if (result.code !== 0) return;

      const successCount = result.data?.successCount;
      const failCount = result.data?.failCount;
      if (successCount !== undefined || failCount !== undefined) {
        ElMessage.success(`成功操作${successCount ?? 0}台，失败${failCount ?? 0}台`);
      } else {
        ElMessage.success("操作成功");
      }
      visible.value = false;
    } catch (error) {
      console.error("handleSubmitForm:", error);
    }
  });
}

// 接收参数
function acceptParams(params: TModalParams, row?: DeviceTagRow) {
  parameter.value = { ...parameter.value, ...params };
  if (!row) return;
  ruleForm.value = {
    deviceTagId: row.id,
    powerOnTime: "",
    powerOffTime: ""
  };
  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="480px"
    destroy-on-close
    draggable
    align-center
  >
    <div class="space-y-4">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="开机时间" prop="powerOnTime">
              <el-time-select v-model="ruleForm.powerOnTime" class="w-full" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关机时间" prop="powerOffTime">
              <el-time-select v-model="ruleForm.powerOffTime" class="w-full" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)"> 确定 </el-button>
    </template>
  </el-dialog>
</template>
