<script setup lang="ts" name="deviceEventLog">
import type { DeviceEventLog, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import DetailModal from "./modal/Detail.vue";
import { buildDeviceEventLogListParams } from "./utils/payload";
import { getDeviceEventLogListApi } from "@/api/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_EVENT_TYPE_I18N, DEVICE_EVENT_TYPE_OPTIONS } from "@/config/modules";

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  {
    get: axiosGetDeviceEventLogListApi
  },
  null,
  list => dateFormatter(list, [{ field: "eventTime", isUnix: false }])
);

const detailModalRef = ref<InstanceType<typeof DetailModal> | null>(null);

const columns: ColumnProps<DeviceEventLog.IDeviceEventLogItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 140 },
  { prop: "deviceName", label: "设备名称", minWidth: 180 },
  {
    prop: "terminalSn",
    label: "终端SN",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入终端SN" } }
  },
  {
    prop: "studentId",
    label: "学生ID",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入学生ID" } }
  },
  {
    prop: "eventType",
    label: "事件类型",
    minWidth: 140,
    enum: DEVICE_EVENT_TYPE_OPTIONS,
    search: {
      el: "select",
      props: {
        placeholder: "请选择事件类型",
        clearable: true
      }
    }
  },
  { prop: "eventTime", label: "事件时间", minWidth: 170 },
  { prop: "eventData", label: "事件数据", minWidth: 260 },
  {
    prop: "startTime",
    label: "开始时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "开始时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  {
    prop: "endTime",
    label: "结束时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "结束时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  { prop: "operation", label: "操作", width: 90, fixed: "right" }
];

/** 获取设备事件日志列表 */
async function axiosGetDeviceEventLogListApi(
  params: Record<string, any>
): Promise<ResultData<DeviceEventLog.ResGetDeviceEventLogListApi>> {
  try {
    const payload = buildDeviceEventLogListParams(params);
    return await getDeviceEventLogListApi(payload);
  } catch (error) {
    console.error("axiosGetDeviceEventLogListApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: { list: [], total: 0, page: Number(params.page ?? 1), pageSize: Number(params.pageSize ?? 10) }
    };
  }
}

/** 格式化事件数据预览 */
function formatEventDataPreview(eventData?: Record<string, any> | string | null) {
  if (!eventData) return "--";
  if (typeof eventData === "string") {
    return eventData.length > 80 ? `${eventData.slice(0, 80)}...` : eventData;
  }
  if (typeof eventData.message === "string" && eventData.message.trim()) {
    return eventData.message.trim();
  }
  try {
    const text = JSON.stringify(eventData);
    return text.length > 80 ? `${text.slice(0, 80)}...` : text;
  } catch {
    return "--";
  }
}

/** 获取事件类型文案 */
function getEventTypeLabel(eventType?: string, eventTypeName?: string) {
  if (eventTypeName) return eventTypeName;
  if (!eventType) return "--";
  return (DEVICE_EVENT_TYPE_I18N as Record<string, string>)[eventType] || eventType;
}

/** 查看详情 */
function handleShowDetail(row: DeviceEventLog.IDeviceEventLogItem) {
  detailModalRef.value?.acceptParams({ title: "公话日志详情", type: "View", showConfirm: false }, row);
}

/** 监听学校切换 */
watch(
  schoolId,
  () => {
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex h-full flex-col">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="公话日志">
      <template #eventType="{ row }">
        {{ getEventTypeLabel(row.eventType, row.eventTypeName) }}
      </template>

      <template #eventData="{ row }">
        <span>{{ formatEventDataPreview(row.eventData) }}</span>
      </template>

      <template #eventTime="{ row }">
        {{ row.eventTime || "--" }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">详情</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
  </div>
</template>
