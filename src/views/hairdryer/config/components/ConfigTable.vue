<script setup lang="ts">
import type { DeviceConfig } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceFeatureConfigListApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import ConfigModal from "../modal/Config.vue";

// 使用 useManage hook
const { proTable, axiosGetTableList, refreshTableList } = useManage({
  get: getDeviceFeatureConfigListApi
});

const configModalRef = ref();

// 表格列配置
const columns: ColumnProps<DeviceConfig.IDeviceFeatureConfigListItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  { prop: "configVersion", label: "配置版本", width: 100 },
  { prop: "operation", label: "操作", width: 120, fixed: "right" }
];

// 打开编辑弹窗
const onEditConfig = (row: DeviceConfig.IDeviceFeatureConfigListItem) => {
  configModalRef.value.acceptParams({ title: `${row.schoolName} - 编辑配置`, type: "Edit", showConfirm: true }, row);
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学校配置列表">
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="onEditConfig(row)">编辑</el-button>
      </template>
    </ProTable>

    <ConfigModal ref="configModalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
