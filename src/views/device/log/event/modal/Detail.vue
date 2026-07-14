<script setup lang="ts">
import type { DeviceEventLog } from "@/api/interface";

import { computed, ref } from "vue";
import { DEVICE_EVENT_TYPE_I18N } from "@/config/modules";

/** 弹窗显示状态 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 详情数据 */
const detail = ref<DeviceEventLog.IDeviceEventLogItem | null>(null);
/** 事件数据折叠面板激活项 */
const eventDataCollapseNames = ref<string[]>([]);

/** 事件类型名称 */
const eventTypeName = computed(() => {
  const type = detail.value?.eventType;
  if (!type) return "--";
  return detail.value?.eventTypeName || DEVICE_EVENT_TYPE_I18N[type as keyof typeof DEVICE_EVENT_TYPE_I18N] || type;
});

/** 事件数据 JSON 格式化展示 */
const eventDataJson = computed(() => {
  const eventData = detail.value?.eventData;
  if (!eventData) return "--";
  if (typeof eventData === "string") {
    try {
      return JSON.stringify(JSON.parse(eventData), null, 2);
    } catch {
      return eventData;
    }
  }
  try {
    return JSON.stringify(eventData, null, 2);
  } catch {
    return String(eventData);
  }
});

/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
  eventDataCollapseNames.value = [];
}

/** 接收参数 */
function acceptParams(params: TModalParams, row?: DeviceEventLog.IDeviceEventLogItem) {
  parameter.value = { ...parameter.value, ...params };
  eventDataCollapseNames.value = [];
  if (!row) return;
  detail.value = row;
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="980px"
    destroy-on-close
    draggable
    align-center
  >
    <template v-if="detail">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="终端SN">{{ detail.terminalSn || "--" }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ detail.deviceName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ detail.schoolName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学生ID">{{ detail.studentId ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="事件类型">{{ eventTypeName }}</el-descriptions-item>
        <el-descriptions-item label="事件时间">{{ detail.eventTime || "--" }}</el-descriptions-item>
        <el-descriptions-item label="事件数据" :span="2">
          <el-collapse v-model="eventDataCollapseNames" class="w-full">
            <el-collapse-item name="event-data">
              <template #title>点击展开/收起事件数据</template>
              <pre class="event-data">{{ eventDataJson }}</pre>
            </el-collapse-item>
          </el-collapse>
        </el-descriptions-item>
      </el-descriptions>
    </template>

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
.event-data {
  max-height: 260px;
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
