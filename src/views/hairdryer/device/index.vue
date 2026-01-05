<script setup lang="ts" name="hairdryerDevice">
import type { DeviceBase } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { CirclePlus, PriceTag } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceBaseListApi, deleteDeviceBaseApi, DeviceStatus, deviceStatusOptions } from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";
import DeviceModal from "./modal/Device.vue";
import ConfigModal from "./modal/Config.vue";
import BatchTagModal from "./modal/BatchTag.vue";

const { isAllSchools, schoolId } = useSchool();
const { isSelected, selectedList, selectionChange } = useSelection();

// 使用 useManage hook
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  {
    get: getDeviceBaseListApi,
    delete: deleteDeviceBaseApi
  },
  null,
  list => dateFormatter(list, ["lastOnline", "createdAt"])
);

const modalRef = ref();
const configModalRef = ref();
const batchTagModalRef = ref();

// 表格列配置
const columns: ColumnProps<DeviceBase.IDeviceBaseItem>[] = [
  { type: "selection", width: 50 },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", width: 150 },
  {
    prop: "deviceSn",
    label: "设备序列号",
    width: 180,
    search: { el: "input", props: { placeholder: "请输入设备序列号" } }
  },
  { prop: "name", label: "设备名称", width: 180 },
  {
    prop: "status",
    label: "设备状态",
    width: 100,
    enum: deviceStatusOptions,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "version", label: "固件版本", width: 120 },
  { prop: "lastOnline", label: "最后在线时间", width: 180 },
  { prop: "createdAt", label: "创建时间", width: 220 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/** 显示弹框 */
const onShowModal = (type: "Add" | "Edit" | "View", row?: DeviceBase.IDeviceBaseItem) => {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = {
    Add: "新增设备",
    Edit: "编辑设备",
    View: "查看设备"
  };
  const showConfirm = type === "Add" || type === "Edit";
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm }, row);
};
// 打开配置弹窗
const onShowConfigModal = (row: DeviceBase.IDeviceBaseItem) => {
  configModalRef.value.acceptParams({ title: "设备配置", type: "Edit" }, row);
};

// 打开批量添加标签弹窗
const onShowBatchTagModal = () => {
  if (!isSelected.value) {
    ElMessage.warning("请先选择设备");
    return;
  }
  batchTagModalRef.value.acceptParams(selectedList.value);
};

// 监听学校切换，刷新表格
watch(schoolId, () => {
  refreshTableList();
});
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      table-header="设备管理"
      @selection-change="selectionChange"
    >
      <!-- 表格头部按钮 -->
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增</el-button>
        <el-button type="warning" :icon="PriceTag" :disabled="!isSelected" @click="onShowBatchTagModal"> 批量添加标签 </el-button>
      </template>
      <!-- 设备状态 -->
      <template #status="{ row }">
        <el-tag :type="row.status === DeviceStatus.ONLINE ? 'success' : 'info'">
          {{ row.status === DeviceStatus.ONLINE ? "在线" : "离线" }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowConfigModal(row)">配置</el-button>
        <el-button type="primary" link @click="onShowModal('View', row)">查看</el-button>
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
        <el-button
          type="danger"
          link
          :disabled="row.status === DeviceStatus.ONLINE"
          @click="deleteRow(row.id, row.name || row.deviceSn)"
        >
          删除
        </el-button>
      </template>
    </ProTable>

    <DeviceModal ref="modalRef" @submit="refreshTableList" />
    <ConfigModal ref="configModalRef" />
    <BatchTagModal ref="batchTagModalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
