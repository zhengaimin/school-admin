<script setup lang="ts">
import type { DeviceTag } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { BatchTagForm, DeviceRow } from "../types";

import { computed, nextTick, ref, unref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceTagSelectOptionsApi, postDeviceTagBatchAssignApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";

/** 学校ID */
const { schoolId } = useSchool();
/** 提交事件 */
const emit = defineEmits(["submit"]);
/** 弹窗可见 */
const visible = ref(false);
/** 弹窗局部加载 */
const modalLoading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "批量添加标签",
  type: "Edit",
  showConfirm: true
});
/** 已选设备 */
const selectedDevices = ref<DeviceRow[]>([]);
/** 标签选项 */
const tagOptions = ref<DeviceTag.IDeviceTagSelectOptionVo[]>([]);
/** 表单引用 */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = ref<BatchTagForm>({
  tagId: null
});
/** 表单校验 */
const rules: FormRules<BatchTagForm> = {
  tagId: [{ required: true, message: "请选择标签", trigger: "change" }]
};
/** 是否查看 */
const isView = computed(() => parameter.value.type === "View");

/** 获取标签下拉选项 */
async function axiosGetDeviceTagSelectOptionsApi() {
  try {
    const result = await getDeviceTagSelectOptionsApi(
      {
        schoolId: Number(schoolId.value),
        status: -1
      },
      {
        loading: false
      }
    );
    return result;
  } catch (error) {
    console.error("axiosGetDeviceTagSelectOptionsApi:", error);
    return { code: -1, data: null };
  }
}

/** 获取标签列表数据 */
async function handleFetchTagOptions() {
  modalLoading.value = true;
  try {
    const result = await axiosGetDeviceTagSelectOptionsApi();
    if (result.code === 0) {
      tagOptions.value = result.data?.list ?? [];
      return;
    }
    tagOptions.value = [];
  } finally {
    modalLoading.value = false;
  }
}
/** 移除已选设备 */
function handleRemoveDevice(deviceId: number) {
  selectedDevices.value = selectedDevices.value.filter(device => device.id !== deviceId);
}
/** 关闭弹窗 */
function handleCloseDialog() {
  visible.value = false;
}
/** 提交表单 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid || selectedDevices.value.length === 0) return;

    try {
      const form = unref(ruleForm);
      const tagId = form.tagId;
      if (!tagId) {
        ElMessage.warning("请选择标签");
        return;
      }

      const deviceIds = selectedDevices.value.map(device => device.id);
      const payload: DeviceTag.ReqPostDeviceTagBatchAssignApi = {
        deviceIds,
        deviceTagIds: [tagId]
      };
      const result = await postDeviceTagBatchAssignApi(payload);

      if (result.code !== 0 || !result.data) {
        ElMessage.error("操作失败");
        return;
      }

      const successCount = result.data.successCount ?? 0;
      const failCount = result.data.failCount ?? 0;
      if (failCount > 0) {
        ElMessage.warning(`成功 ${successCount} 台，失败 ${failCount} 台`);
      } else {
        ElMessage.success(`成功绑定 ${successCount} 台设备`);
      }
      handleCloseDialog();
      emit("submit");
    } catch (error: any) {
      ElMessage.error(error?.msg || error?.message || "操作失败");
    }
  });
}

/** 接收弹窗参数 */
function acceptParams(params: TModalParams, row?: DeviceRow[]) {
  parameter.value = { ...parameter.value, ...params };
  selectedDevices.value = row || [];
  ruleForm.value.tagId = null;
  visible.value = true;
  handleFetchTagOptions();
  nextTick(() => ruleFormRef.value?.clearValidate());
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="parameter.title"
    width="640px"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <div v-loading="modalLoading">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择标签" prop="tagId">
              <el-select v-model="ruleForm.tagId" class="w-full" placeholder="请选择标签" clearable>
                <el-option v-for="tag in tagOptions" :key="tag.id" :label="tag.name" :value="tag.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="mb-2 text-sm text-gray-500">已选设备（{{ selectedDevices.length }} 台）</div>
      <div class="flex flex-wrap gap-2">
        <el-tag v-for="device in selectedDevices" :key="device.id" closable @close="handleRemoveDevice(device.id)">
          {{ device.name || device.terminalSn }}
        </el-tag>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          v-if="parameter.showConfirm"
          type="primary"
          :disabled="!selectedDevices.length"
          @click="handleSubmitForm(ruleFormRef)"
        >
          确定（{{ selectedDevices.length }} 台）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
