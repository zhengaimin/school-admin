<script setup lang="ts">
import type { DeviceBaseTag } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { BatchTagForm, BatchTagParams, DeviceRow } from "../types";

import { computed, nextTick, ref, unref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceBaseTagOptionsApi, postDeviceBaseTagDevicesApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE, VENDOR_CODE } from "@/config/modules";

const { schoolId } = useSchool();

const emit = defineEmits(["submit"]);

const visible = ref(false);
const loading = ref(false);
const parameter = ref<BatchTagParams>({
  title: "批量添加标签",
  type: "Edit",
  showConfirm: true
});
const selectedDevices = ref<DeviceRow[]>([]);
const tagOptions = ref<DeviceBaseTag.IDeviceBaseTagOptionVo[]>([]);

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<BatchTagForm>({
  tagId: null
});

const rules: FormRules<BatchTagForm> = {
  tagId: [{ required: true, message: "请选择标签", trigger: "change" }]
};

const isView = computed(() => parameter.value.type === "View");

/** 获取标签下拉选项 */
async function axiosGetDeviceBaseTagOptionsApi() {
  try {
    const result = await getDeviceBaseTagOptionsApi({
      schoolId: Number(schoolId.value),
      vendorCode: VENDOR_CODE.XINGRI,
      deviceType: DEVICE_TYPE.DRYER
    });
    return result;
  } catch (error) {
    console.error("axiosGetDeviceBaseTagOptionsApi:", error);
    return { code: -1, data: null };
  }
}

/** 批量绑定设备到标签 */
async function axiosPostDeviceBaseTagDevicesApi(tagId: number, deviceIds: number[]) {
  try {
    const payload: DeviceBaseTag.ReqPostDeviceBaseTagDevicesApi = {
      deviceIds
    };
    const result = await postDeviceBaseTagDevicesApi(tagId, payload);
    return result;
  } catch (error) {
    console.error("axiosPostDeviceBaseTagDevicesApi:", error);
    return { code: -1, data: null };
  }
}

/** 获取标签列表数据 */
async function handleFetchTagOptions() {
  const result = await axiosGetDeviceBaseTagOptionsApi();
  if (result.code === 0) {
    tagOptions.value = result.data ?? [];
    return;
  }
  tagOptions.value = [];
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

    loading.value = true;
    try {
      const form = unref(ruleForm);
      const tagId = form.tagId;
      if (!tagId) {
        ElMessage.warning("请选择标签");
        return;
      }

      const deviceIds = selectedDevices.value.map(device => device.id);
      const result = await axiosPostDeviceBaseTagDevicesApi(tagId, deviceIds);

      if (result.code !== 0 || !result.data) {
        ElMessage.error("操作失败");
        return;
      }

      if (result.data.failedCount > 0) {
        ElMessage.warning(`成功 ${result.data.successCount} 台，失败 ${result.data.failedCount} 台`);
      } else {
        ElMessage.success(`成功绑定 ${result.data.successCount} 台设备`);
      }
      handleCloseDialog();
      emit("submit");
    } catch (error: any) {
      ElMessage.error(error?.msg || error?.message || "操作失败");
    } finally {
      loading.value = false;
    }
  });
}

/** 接收弹窗参数 */
function acceptParams(params: BatchTagParams, row?: DeviceRow[]) {
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
    <!-- 标签选择 -->
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

    <!-- 已选设备列表 -->
    <div class="mb-2 text-sm text-gray-500">已选设备（{{ selectedDevices.length }} 台）</div>
    <div class="flex flex-wrap gap-2">
      <el-tag v-for="device in selectedDevices" :key="device.id" closable @close="handleRemoveDevice(device.id)">
        {{ device.name || device.deviceSn }}
      </el-tag>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          v-if="parameter.showConfirm"
          type="primary"
          :loading="loading"
          :disabled="!selectedDevices.length"
          @click="handleSubmitForm(ruleFormRef)"
        >
          确定（{{ selectedDevices.length }} 台）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
