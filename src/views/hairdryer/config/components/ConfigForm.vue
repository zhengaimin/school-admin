<script setup lang="ts">
import type { DeviceConfig } from "@/api/interface";
import type { ConfigFormProps } from "../types";

import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceFeatureConfigListApi, updateSchoolDeviceFeatureConfigApi } from "@/api/modules";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import UploadImg from "@/components/Upload/Img.vue";

const props = withDefaults(defineProps<ConfigFormProps>(), {
  schoolId: ""
});

const { getUploadPath } = useAssetsPath();

const loading = ref(false);
const saving = ref(false);
const configData = ref<DeviceConfig.IDeviceFeatureConfigListItem>();

/** 获取配置数据 */
const axiosGetDeviceFeatureConfigListApi = async () => {
  if (!props.schoolId || props.schoolId === "-1") return;

  loading.value = true;
  try {
    const result = await getDeviceFeatureConfigListApi({ schoolId: Number(props.schoolId) });
    if (result.code === 0) {
      configData.value = result.data?.list?.[0];
    }
  } catch (error) {
    console.error("axiosGetDeviceFeatureConfigListApi:", error);
  } finally {
    loading.value = false;
  }
};

/** 处理保存 */
const handleSave = async () => {
  if (!configData.value) return;

  saving.value = true;
  try {
    await updateSchoolDeviceFeatureConfigApi(configData.value.id, {
      config: {
        qrCode: { fileUrl: getUploadPath(configData.value.config.qrCode.fileUrl) },
        screen: {
          brightness: configData.value.config.screen.brightness,
          welcomeMessage: configData.value.config.screen.welcomeMessage,
          guideText: configData.value.config.screen.guideText
        },
        timeout: { refundTimeout: configData.value.config.timeout.refundTimeout },
        order: { maxUsageTime: configData.value.config.order.maxUsageTime }
      }
    });
    ElMessage.success("保存成功");
  } catch (error) {
    console.error("handleSave:", error);
    ElMessage.error("保存失败");
  } finally {
    saving.value = false;
  }
};

// 监听 schoolId 变化
watch(
  () => props.schoolId,
  () => {
    axiosGetDeviceFeatureConfigListApi();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden">
    <el-card shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>学校配置</span>
        </div>
      </template>

      <template v-if="configData">
        <div class="flex-1 overflow-y-auto p-4">
          <el-form label-position="top">
            <!-- 基本信息 -->
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="学校名称">
                  <el-input :model-value="configData.schoolName" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider />

            <!-- 二维码配置 -->
            <el-form-item label="二维码">
              <UploadImg
                v-model:image-url="configData.config.qrCode.fileUrl"
                :file-type="['image/jpeg', 'image/png', 'image/gif']"
              />
            </el-form-item>

            <!-- 屏幕参数配置 -->
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="亮度（%）">
                  <el-input-number
                    v-model="configData.config.screen.brightness"
                    :min="0"
                    :max="100"
                    :precision="0"
                    :controls="false"
                    class="w-full"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="配置版本号">
                  <el-input :model-value="configData.configVersion" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="欢迎消息">
                  <el-input v-model="configData.config.screen.welcomeMessage" type="textarea" :rows="3" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="引导文字">
                  <el-input v-model="configData.config.screen.guideText" type="textarea" :rows="3" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 超时时长配置 -->
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="超时退款时间（秒）">
                  <el-input-number
                    v-model="configData.config.timeout.refundTimeout"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    class="w-full"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单使用最大时间（分钟）">
                  <el-input-number
                    v-model="configData.config.order.maxUsageTime"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    class="w-full"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="px-4 pb-4">
          <!-- 保存按钮 -->
          <div class="flex justify-end pt-4 border-t border-gray-200">
            <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>

      <template v-else>
        <el-empty class="h-full" description="暂无配置数据" />
      </template>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-card__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
