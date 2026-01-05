<script setup lang="ts" name="hairdryerLogUsage">
import type { DeviceUsage } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceUsageListApi } from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DEVICE_USAGE_STATUS_OPTIONS,
  DEVICE_USAGE_STATUS_I18N,
  getDeviceUsageStatusTagType,
  DEVICE_TYPE,
  DEVICE_TYPE_OPTIONS
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getDeviceUsageListApi },
  { deviceType: DEVICE_TYPE.DRYER },
  list =>
    dateFormatter(list, [
      { field: "createdAt", isUnix: false },
      { field: "confirmedAt", isUnix: false },
      { field: "completedAt", isUnix: false },
      { field: "consumeTime", isUnix: false }
    ])
);

const detailModalRef = ref();

const columns: ColumnProps<DeviceUsage.IDeviceUsageItem>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "orderNo",
    label: "订单号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入订单号" } }
  },
  {
    prop: "studentName",
    label: "学生姓名",
    minWidth: 100,
    search: { el: "input", props: { placeholder: "请输入学生姓名" } }
  },
  { prop: "gradeName", label: "年级", minWidth: 100 },
  { prop: "className", label: "班级", minWidth: 100 },
  {
    prop: "deviceSn",
    label: "设备序列号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备序列号" } }
  },
  { prop: "deviceName", label: "设备名称", minWidth: 150 },
  {
    prop: "deviceType",
    label: "设备类型",
    width: 100,
    enum: DEVICE_TYPE_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择设备类型" } }
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: DEVICE_USAGE_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "usageMinutes", label: "计费时长(分)", width: 110 },
  { prop: "actualAmount", label: "实际扣费(元)", width: 110 },
  { prop: "createdAt", label: "刷卡时间", minWidth: 180 },
  { prop: "completedAt", label: "完成时间", minWidth: 180 },
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

/** 查看详情 */
const handleShowDetail = (row: DeviceUsage.IDeviceUsageItem) => {
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备使用记录">
      <!-- 设备类型 -->
      <template #deviceType="{ row }">
        {{ row.deviceType === DEVICE_TYPE.DRYER ? "吹风机" : row.deviceType === DEVICE_TYPE.VIDEO ? "视频话机" : row.deviceType }}
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getDeviceUsageStatusTagType(row.status)">
          {{ row.statusText || DEVICE_USAGE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 完成时间 -->
      <template #completedAt="{ row }">
        {{ row.completedAt || "--" }}
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
