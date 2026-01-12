<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { postDeviceBaseTagBatchCommandsApi } from "@/api/modules";
import { DEVICE_COMMAND_CODE, DEVICE_COMMAND_CODE_I18N, DEVICE_COMMAND_CODE_OPTIONS } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const tagId = ref<number | null>(null);
const tagName = ref("");

const ruleFormRef = ref();
const ruleForm = ref({
  commandCode: DEVICE_COMMAND_CODE.SYNC_QR_CODE
});

const rules = {
  commandCode: [{ required: true, message: "请选择命令类型", trigger: "change" }]
};

const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;
    if (!tagId.value) return;

    loading.value = true;
    try {
      const res = await postDeviceBaseTagBatchCommandsApi(tagId.value, {
        commandCode: ruleForm.value.commandCode,
        commandName: DEVICE_COMMAND_CODE_I18N[ruleForm.value.commandCode]
      });

      visible.value = false;
      ElNotification({
        type: "success",
        title: "命令下发成功",
        message: `成功: ${res.data.successCount}, 失败: ${res.data.failedCount}`
      });
    } catch (error: any) {
      ElMessage.error(error?.msg || error?.message || "命令下发失败");
    } finally {
      loading.value = false;
    }
  });
};

const acceptParams = (id: number, name: string) => {
  tagId.value = id;
  tagName.value = name;
  ruleForm.value.commandCode = DEVICE_COMMAND_CODE.SYNC_QR_CODE;
  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="`下发命令 - ${tagName}`" width="480px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-form-item label="命令类型" prop="commandCode">
        <el-select v-model="ruleForm.commandCode" class="w-full" placeholder="请选择命令类型">
          <el-option v-for="item in DEVICE_COMMAND_CODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmitForm(ruleFormRef)">下发</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
