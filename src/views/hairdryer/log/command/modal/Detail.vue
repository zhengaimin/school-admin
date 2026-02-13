<script setup lang="ts">
import type { DeviceCommand } from "@/api/interface";

import { ref, computed } from "vue";
import { getDeviceCommandDetailApi } from "@/api/modules";
import {
  DEVICE_COMMAND_STATUS_I18N,
  getDeviceCommandStatusTagType,
  DEVICE_COMMAND_TYPE_I18N,
  DEVICE_COMMAND_CREATED_TYPE_I18N,
  DEVICE_TYPE_I18N
} from "@/config/modules";
import { formatTimestamp } from "@/hooks/useManage";

const visible = ref(false);
const loading = ref(false);
const detail = ref<DeviceCommand.IDeviceCommandItem | null>(null);
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/** 获取命令详情 */
const axiosGetDeviceCommandDetailApi = async (id: number) => {
  loading.value = true;
  try {
    const result = await getDeviceCommandDetailApi(id);
    if (result.code === 0) {
      detail.value = result.data;
    }
  } catch (error) {
    console.error("axiosGetDeviceCommandDetailApi:", error);
  } finally {
    loading.value = false;
  }
};

const resultDataJson = computed(() => {
  if (!detail.value?.resultData) return "--";
  try {
    return JSON.stringify(detail.value.resultData, null, 2);
  } catch {
    return "--";
  }
});

/** 接收参数 */
const acceptParams = async (params: TModalParams, row?: DeviceCommand.IDeviceCommandItem) => {
  parameter.value = { ...parameter.value, ...params };
  if (!row?.id) return;
  await axiosGetDeviceCommandDetailApi(row.id);
  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="800px" destroy-on-close draggable align-center>
    <template v-if="detail">
      <!-- 基本信息 -->
      <el-descriptions :column="2" border>
        <el-descriptions-item label="命令ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="命令UUID">{{ detail.cmdUuid }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getDeviceCommandStatusTagType(detail.status)">
            {{ DEVICE_COMMAND_STATUS_I18N[detail.status] || "--" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建类型">
          {{ DEVICE_COMMAND_CREATED_TYPE_I18N[detail.createdType] || detail.createdType || "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="创建者ID">{{ detail.createdBy ?? "--" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 设备信息 -->
      <el-divider content-position="left">设备信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="设备序列号">{{ detail.deviceSn }}</el-descriptions-item>
        <el-descriptions-item label="设备ID">{{ detail.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">
          {{ DEVICE_TYPE_I18N[detail.deviceType] || detail.deviceType || "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="厂商代码">{{ detail.vendorCode || "--" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 命令信息 -->
      <el-divider content-position="left">命令信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="命令名称">{{ detail.commandName }}</el-descriptions-item>
        <el-descriptions-item label="命令码">{{ detail.commandCode }}</el-descriptions-item>
        <el-descriptions-item label="命令类型">
          {{ DEVICE_COMMAND_TYPE_I18N[detail.commandType] || detail.commandType || "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="优先级">{{ detail.priority }}</el-descriptions-item>
        <el-descriptions-item label="超时时间(秒)">{{ detail.timeout }}</el-descriptions-item>
        <el-descriptions-item label="已重试次数">{{ detail.retryCount }} / {{ detail.maxRetries }}</el-descriptions-item>
        <el-descriptions-item label="命令描述" :span="2">{{ detail.description || "--" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 执行结果 -->
      <el-divider content-position="left">执行结果</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="结果码">{{ detail.resultCode || "--" }}</el-descriptions-item>
        <el-descriptions-item label="结果消息">{{ detail.resultMsg || "--" }}</el-descriptions-item>
        <el-descriptions-item label="结果数据" :span="2">
          <pre v-if="resultDataJson !== '--'" class="json-data">{{ resultDataJson }}</pre>
          <span v-else>--</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 时间信息 -->
      <el-divider content-position="left">时间信息</el-divider>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="创建时间">{{ formatTimestamp(detail.createdAt) || "--" }}</el-descriptions-item>
        <el-descriptions-item label="执行时间">{{ formatTimestamp(detail.executedAt) || "--" }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ formatTimestamp(detail.completedAt) || "--" }}</el-descriptions-item>
        <el-descriptions-item label="过期时间">{{ formatTimestamp(detail.expiredAt) || "--" }}</el-descriptions-item>
      </el-descriptions>
    </template>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-descriptions__label) {
  width: 120px;
}
.json-data {
  max-height: 200px;
  padding: 8px;
  margin: 0;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  white-space: pre-wrap;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}
</style>
