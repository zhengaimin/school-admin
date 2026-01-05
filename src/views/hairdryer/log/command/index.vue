<script setup lang="ts" name="hairdryerLogCommand">
import type { DeviceCommand } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceCommandListApi } from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DEVICE_COMMAND_STATUS_OPTIONS,
  DEVICE_COMMAND_STATUS_I18N,
  getDeviceCommandStatusTagType,
  DEVICE_COMMAND_TYPE_OPTIONS,
  DEVICE_COMMAND_TYPE_I18N,
  DEVICE_TYPE
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getDeviceCommandListApi },
  { deviceType: DEVICE_TYPE.DRYER },
  list =>
    dateFormatter(list, [
      { field: "executedAt", isUnix: true },
      { field: "completedAt", isUnix: true },
      { field: "createdAt", isUnix: true }
    ])
);

const detailModalRef = ref();

const columns: ColumnProps<DeviceCommand.IDeviceCommandItem>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "deviceSn",
    label: "设备序列号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备序列号" } }
  },
  { prop: "commandName", label: "命令名称", minWidth: 150 },
  {
    prop: "commandType",
    label: "命令类型",
    width: 100,
    enum: DEVICE_COMMAND_TYPE_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择命令类型" } }
  },
  { prop: "description", label: "命令描述", minWidth: 150 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: DEVICE_COMMAND_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "resultMsg", label: "执行结果", minWidth: 150 },
  { prop: "executedAt", label: "执行时间", minWidth: 180 },
  { prop: "createdAt", label: "创建时间", minWidth: 180 },
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

/** 查看详情 */
const handleShowDetail = (row: DeviceCommand.IDeviceCommandItem) => {
  detailModalRef.value?.acceptParams(row);
};

/** 监听学校变化 */
watch(
  schoolId,
  () => {
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备命令列表">
      <!-- 命令类型 -->
      <template #commandType="{ row }">
        {{ DEVICE_COMMAND_TYPE_I18N[row.commandType] || row.commandType || "--" }}
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getDeviceCommandStatusTagType(row.status)">
          {{ DEVICE_COMMAND_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 执行结果 -->
      <template #resultMsg="{ row }">
        {{ row.resultMsg || "--" }}
      </template>
      <!-- 执行时间 -->
      <template #executedAt="{ row }">
        {{ row.executedAt || "--" }}
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
