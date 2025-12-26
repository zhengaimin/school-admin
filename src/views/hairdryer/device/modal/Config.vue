<script setup lang="ts">
import type { DeviceBase } from "@/api/interface";

import { ref, computed, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceFeatureConfigApi, updateDeviceFeatureConfigApi } from "@/api/modules";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import UploadImg from "@/components/Upload/Img.vue";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

const { getUploadPath } = useAssetsPath();

const emit = defineEmits<{
  submit: [];
}>();

const visible = ref(false);
const loading = ref(false);
const deviceId = ref<number>();
const schoolName = ref("");
const parameter = ref({
  title: "设备配置",
  type: "Edit"
});

// 表单数据
const formData = reactive({
  qrCode: { fileUrl: "" },
  screen: { brightness: 0, welcomeMessage: "", guideText: "" },
  timeout: { refundTimeout: 0 },
  order: { maxUsageTime: 0 }
});

const qrCodeUrl = computed({
  get: () => formData.qrCode.fileUrl,
  set: (val: string) => {
    formData.qrCode.fileUrl = val;
  }
});

/** 获取设备功能配置 */
const axiosGetDeviceFeatureConfigApi = async (id: number): Promise<void> => {
  try {
    const result = await getDeviceFeatureConfigApi(id);

    if (result.code === 0 && result.data.config) {
      const { config } = result.data;

      formData.qrCode.fileUrl = config.qrCode?.fileUrl ?? "";
      formData.screen.brightness = config.screen?.brightness ?? 0;
      formData.screen.welcomeMessage = config.screen?.welcomeMessage ?? "";
      formData.screen.guideText = config.screen?.guideText ?? "";
      formData.timeout.refundTimeout = config.timeout?.refundTimeout ?? 0;
      formData.order.maxUsageTime = config.order?.maxUsageTime ?? 0;
    }
  } catch (error) {
    console.error("axiosGetDeviceFeatureConfigApi:", error);
  }
};

// 保存配置
const handleSave = async () => {
  if (!deviceId.value) return;

  loading.value = true;
  try {
    await updateDeviceFeatureConfigApi(deviceId.value, {
      config: {
        qrCode: { fileUrl: getUploadPath(formData.qrCode.fileUrl) },
        screen: {
          brightness: formData.screen.brightness,
          welcomeMessage: formData.screen.welcomeMessage,
          guideText: formData.screen.guideText
        },
        timeout: { refundTimeout: formData.timeout.refundTimeout },
        order: { maxUsageTime: formData.order.maxUsageTime }
      }
    });
    ElMessage.success("配置保存成功");
    visible.value = false;
    emit("submit");
  } finally {
    loading.value = false;
  }
};

/**
 * 接收参数
 */
const acceptParams = async (params: { title?: string; type?: string }, row?: DeviceBase.IDeviceBaseItem) => {
  parameter.value = { ...parameter.value, ...params };

  if (row?.id) {
    deviceId.value = row.id;
    schoolName.value = row.schoolName ?? "";
    visible.value = true;
    loading.value = true;
    try {
      await axiosGetDeviceFeatureConfigApi(row.id);
    } finally {
      loading.value = false;
    }
  }
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <SchoolInfo :name="schoolName" />

    <el-form v-loading="loading" label-position="top">
      <!-- 二维码配置 -->
      <el-form-item label="二维码">
        <UploadImg v-model:image-url="qrCodeUrl" :file-type="['image/jpeg', 'image/png', 'image/gif']" />
      </el-form-item>

      <!-- 屏幕参数配置 -->
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="亮度">
            <el-input-number class="w-full" v-model="formData.screen.brightness" :min="0" :max="100" :controls="false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="欢迎消息">
            <el-input v-model="formData.screen.welcomeMessage" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="超时退款时间（秒）">
            <el-input-number class="w-full" v-model="formData.timeout.refundTimeout" :min="0" :controls="false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单使用最大时间（分钟）">
            <el-input-number class="w-full" v-model="formData.order.maxUsageTime" :min="0" :controls="false" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="引导文字">
            <el-input v-model="formData.screen.guideText" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-divider) {
  margin: 16px 0;
}
</style>
