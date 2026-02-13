<script setup lang="ts">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { DeviceRow } from "../types";

import { ref } from "vue";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceBaseTagDevicesApi, deleteDeviceBaseTagDeviceApi } from "@/api/modules";
import { DEVICE_TYPE_OPTIONS } from "@/config/modules";

const visible = ref(false);
const tagId = ref<number | null>(null);
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});
const proTable = ref();

const columns: ColumnProps<DeviceRow>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "deviceSn", label: "设备序列号", minWidth: 140 },
  { prop: "name", label: "设备名称", minWidth: 140 },
  { prop: "vendorCode", label: "厂商代码", width: 100 },
  { prop: "deviceType", label: "设备类型", width: 100, enum: DEVICE_TYPE_OPTIONS },
  { prop: "createdAt", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

const getTagDevicesApi = async () => {
  if (!tagId.value) return { data: [] };
  const res = await getDeviceBaseTagDevicesApi(tagId.value);
  const list = (res.data?.devices ?? []).map(item => ({
    ...item,
    createdAt: item.createdAt ? dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss") : ""
  }));
  return { data: list };
};

const onRemoveDevice = (row: DeviceRow) => {
  if (!tagId.value) return;
  ElMessageBox.confirm(`确定从标签中移除设备【${row.name}】吗？`, "提示", { type: "warning" }).then(async () => {
    await deleteDeviceBaseTagDeviceApi(tagId.value!, row.id);
    ElMessage.success("移除成功");
    proTable.value?.getTableList();
  });
};

const acceptParams = (params: TModalParams, row?: { id: number }) => {
  parameter.value = { ...parameter.value, ...params };
  if (!row) return;
  tagId.value = row.id;
  visible.value = true;
  proTable.value?.getTableList();
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="parameter.title"
    :width="900"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <ProTable
      ref="proTable"
      class="h-[640px]!"
      :columns="columns"
      :request-api="getTagDevicesApi"
      :pagination="false"
      row-key="id"
      :tool-button="false"
    >
      <template #operation="{ row }">
        <el-button type="danger" link @click="onRemoveDevice(row)">移除</el-button>
      </template>
    </ProTable>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
