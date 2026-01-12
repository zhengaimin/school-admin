<script setup lang="ts">
import type { DeviceBase, DeviceBaseTag } from "@/api/interface";

import { ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceBaseTagOptionsApi, postDeviceBaseTagDevicesApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE, VENDOR_CODE } from "@/config/modules";

type DeviceRow = DeviceBase.IDeviceBaseItem;

const { schoolId } = useSchool();

const emits = defineEmits(["submit"]);

const visible = ref(false);
const loading = ref(false);
const selectedDevices = ref<DeviceRow[]>([]);
const tagOptions = ref<DeviceBaseTag.IDeviceBaseTagOptionVo[]>([]);

const ruleFormRef = ref();
const ruleForm = ref({
  tagId: null as number | null
});

const rules = {
  tagId: [{ required: true, message: "请选择标签", trigger: "change" }]
};

const fetchTagOptions = async () => {
  try {
    const { data } = await getDeviceBaseTagOptionsApi({
      schoolId: Number(schoolId.value),
      vendorCode: VENDOR_CODE.XINGRI,
      deviceType: DEVICE_TYPE.DRYER
    });
    tagOptions.value = data || [];
  } catch {
    tagOptions.value = [];
  }
};

const handleRemoveDevice = (deviceId: number) => {
  selectedDevices.value = selectedDevices.value.filter(d => d.id !== deviceId);
};

const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      const deviceIds = selectedDevices.value.map(d => d.id);
      const { data } = await postDeviceBaseTagDevicesApi(ruleForm.value.tagId!, { deviceIds });

      if (data.failedCount > 0) {
        ElMessage.warning(`成功 ${data.successCount} 台，失败 ${data.failedCount} 台`);
      } else {
        ElMessage.success(`成功绑定 ${data.successCount} 台设备`);
      }
      visible.value = false;
      emits("submit");
    } catch (error: any) {
      ElMessage.error(error?.msg || error?.message || "操作失败");
    } finally {
      loading.value = false;
    }
  });
};

const acceptParams = (devices: DeviceRow[]) => {
  selectedDevices.value = devices;
  ruleForm.value.tagId = null;
  visible.value = true;
  fetchTagOptions();
  nextTick(() => ruleFormRef.value?.clearValidate());
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    title="批量添加标签"
    :width="520"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <!-- 标签选择 -->
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-form-item label="选择标签" prop="tagId">
        <el-select v-model="ruleForm.tagId" class="w-full" placeholder="请选择标签" clearable>
          <el-option v-for="tag in tagOptions" :key="tag.id" :label="tag.name" :value="tag.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 已选设备列表 -->
    <div class="mb-2 text-sm text-gray-500">已选设备（{{ selectedDevices.length }} 台）</div>
    <div class="flex flex-row flex-wrap gap-2">
      <el-tag v-for="device in selectedDevices" :key="device.id" closable @close="handleRemoveDevice(device.id)">
        {{ device.name || device.deviceSn }}
      </el-tag>
    </div>

    <template #footer>
      <div class="flex flex-row items-center justify-end gap-3">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" :disabled="!selectedDevices.length" @click="onSubmitForm(ruleFormRef)">
          确定（{{ selectedDevices.length }} 台）
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
