<script setup lang="ts" name="deviceCommandRecord">
import type { DeviceCommandRecord, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DetailModal from "./modal/Detail.vue";
import { buildDeviceCommandRecordListParams } from "./utils/payload";
import { deleteDeviceCommandRecordApi, getDeviceCommandRecordListApi } from "@/api/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DEVICE_COMMAND_STATUS,
  DEVICE_COMMAND_STATUS_I18N,
  DEVICE_COMMAND_STATUS_OPTIONS,
  DEVICE_COMMAND_TYPE_I18N,
  DEVICE_COMMAND_TYPE_OPTIONS,
  getDeviceCommandStatusTagType
} from "@/config/modules";

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  {
    get: axiosGetDeviceCommandRecordListApi,
    delete: axiosDeleteDeviceCommandRecordApi
  },
  null,
  list =>
    dateFormatter(list, [
      { field: "createdAt", isUnix: false },
      { field: "executedAt", isUnix: false }
    ])
);

const detailModalRef = ref<InstanceType<typeof DetailModal> | null>(null);

const columns: ColumnProps<DeviceCommandRecord.IDeviceCommandRecordItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 140 },
  {
    prop: "deviceName",
    label: "设备名称",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备名称" } }
  },
  {
    prop: "terminalSn",
    label: "终端SN",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入终端SN" } }
  },
  {
    prop: "terminalKey",
    label: "终端KEY",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入终端KEY" } }
  },
  {
    prop: "commandType",
    label: "命令类型",
    minWidth: 120,
    enum: DEVICE_COMMAND_TYPE_OPTIONS,
    search: {
      el: "select",
      props: {
        placeholder: "请选择命令类型",
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true,
        clearable: true
      }
    }
  },
  { prop: "commandName", label: "命令", minWidth: 140 },
  { prop: "describe", label: "描述", minWidth: 180 },
  {
    prop: "status",
    label: "状态",
    width: 120,
    fixed: "right",
    enum: DEVICE_COMMAND_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态", clearable: true } }
  },
  { prop: "createdAt", label: "创建时间", minWidth: 170 },
  { prop: "executedAt", label: "执行时间", minWidth: 170 },
  { prop: "operation", label: "操作", width: 140, fixed: "right" }
];

/** 获取设备命令记录列表 */
async function axiosGetDeviceCommandRecordListApi(
  params: Record<string, any>
): Promise<ResultData<DeviceCommandRecord.ResGetDeviceCommandRecordListApi>> {
  try {
    const payload = buildDeviceCommandRecordListParams(params);
    return await getDeviceCommandRecordListApi(payload);
  } catch (error) {
    console.error("axiosGetDeviceCommandRecordListApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: { list: [], total: 0, page: Number(params.page ?? 1), pageSize: Number(params.pageSize ?? 10) }
    };
  }
}
/** 删除设备命令记录 */
async function axiosDeleteDeviceCommandRecordApi(id: number) {
  try {
    return await deleteDeviceCommandRecordApi(id);
  } catch (error) {
    console.error("axiosDeleteDeviceCommandRecordApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 查看详情 */
function handleShowDetail(row: DeviceCommandRecord.IDeviceCommandRecordItem) {
  detailModalRef.value?.acceptParams({ title: "命令详情", type: "View", showConfirm: false }, row);
}
/** 删除记录 */
function handleDelete(row: DeviceCommandRecord.IDeviceCommandRecordItem) {
  if (row.status === DEVICE_COMMAND_STATUS.PENDING) {
    ElMessage.warning("待执行命令不允许删除");
    return;
  }
  deleteRow(row.id, row.commandName || "该命令记录");
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备命令">
      <template #commandType="{ row }">
        {{ DEVICE_COMMAND_TYPE_I18N[row.commandType] || row.commandType || "--" }}
      </template>

      <template #status="{ row }">
        <el-tag :type="getDeviceCommandStatusTagType(row.status)">
          {{ DEVICE_COMMAND_STATUS_I18N[row.status] || row.statusText || "--" }}
        </el-tag>
      </template>

      <template #executedAt="{ row }">
        {{ row.executedAt || "--" }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">详情</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
  </div>
</template>
