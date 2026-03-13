<script setup lang="ts">
import type { DeviceCommandRecord } from "@/api/interface";

import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceCommandRecordDetailApi } from "@/api/modules";
import { DEVICE_COMMAND_STATUS_I18N, DEVICE_COMMAND_TYPE_I18N, getDeviceCommandStatusTagType } from "@/config/modules";
import { formatCommandLogTimeToChina } from "../utils/time";

/** 弹窗显示状态 */
const visible = ref(false);
/** 详情加载状态 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 详情数据 */
const detail = ref<DeviceCommandRecord.IDeviceCommandRecordDetail | null>(null);
/** 请求数据折叠面板激活项 */
const requestDataCollapseNames = ref<string[]>([]);

/** 请求数据 JSON 格式化展示 */
const requestDataJson = computed(() => {
  const requestData = detail.value?.requestData;
  if (!requestData) return "--";
  try {
    return JSON.stringify(JSON.parse(requestData), null, 2);
  } catch {
    return requestData;
  }
});

/** 格式化详情时间 */
function formatDetailTime(value?: string) {
  const formattedTime = formatCommandLogTimeToChina(value, "YYYY-MM-DD HH:mm:ss");
  return formattedTime || value || "--";
}

/** 获取设备命令详情 */
async function axiosGetDeviceCommandRecordDetailApi(id: number) {
  loading.value = true;
  try {
    return await getDeviceCommandRecordDetailApi(id);
  } catch (error) {
    console.error("axiosGetDeviceCommandRecordDetailApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  } finally {
    loading.value = false;
  }
}
/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
  requestDataCollapseNames.value = [];
}
/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceCommandRecord.IDeviceCommandRecordItem) {
  parameter.value = { ...parameter.value, ...params };
  requestDataCollapseNames.value = [];
  if (!row?.id) return;
  const result = await axiosGetDeviceCommandRecordDetailApi(row.id);
  if (result.code === 0 && result.data) {
    detail.value = result.data;
    visible.value = true;
  } else {
    ElMessage.error("获取详情失败");
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="1120px"
    destroy-on-close
    draggable
    align-center
  >
    <div v-loading="loading">
      <template v-if="detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="命令ID">{{ detail.id }}</el-descriptions-item>
          <el-descriptions-item label="命令UUID">{{ detail.cmdUuid || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备ID">{{ detail.deviceId }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ detail.deviceName || "--" }}</el-descriptions-item>
          <el-descriptions-item label="终端KEY">{{ detail.terminalKey || "--" }}</el-descriptions-item>
          <el-descriptions-item label="终端SN">{{ detail.terminalSn || "--" }}</el-descriptions-item>
          <el-descriptions-item label="命令类型">
            {{ DEVICE_COMMAND_TYPE_I18N[detail.commandType] || detail.commandType || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="命令项">{{ detail.commandItem || "--" }}</el-descriptions-item>
          <el-descriptions-item label="命令名称">{{ detail.commandName || "--" }}</el-descriptions-item>
          <el-descriptions-item label="命令描述">{{ detail.describe || "--" }}</el-descriptions-item>
          <el-descriptions-item label="执行状态">
            <el-tag :type="getDeviceCommandStatusTagType(detail.status)">
              {{ DEVICE_COMMAND_STATUS_I18N[detail.status] || detail.statusText || "--" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态文案">{{ detail.statusText || "--" }}</el-descriptions-item>
          <el-descriptions-item label="执行结果" :span="2">{{ detail.message || "--" }}</el-descriptions-item>
          <el-descriptions-item label="命令参数" :span="2">{{ detail.arg || "--" }}</el-descriptions-item>
          <el-descriptions-item label="请求数据" :span="2">
            <el-collapse v-model="requestDataCollapseNames" class="w-full">
              <el-collapse-item name="request-data">
                <template #title>点击展开/收起请求数据</template>
                <pre class="request-data">{{ requestDataJson }}</pre>
              </el-collapse-item>
            </el-collapse>
          </el-descriptions-item>
          <el-descriptions-item label="执行时间">{{ formatDetailTime(detail.executedAt) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDetailTime(detail.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDetailTime(detail.updatedAt) }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-collapse) {
  border-top: none;
  border-bottom: none;
}
:deep(.el-collapse-item__header) {
  border-bottom: none;
}
:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}
.request-data {
  max-height: 220px;
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
