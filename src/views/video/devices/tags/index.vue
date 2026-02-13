<script setup lang="ts" name="deviceTags">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { DeviceTagRow } from "./types";

import { ref, watch } from "vue";
import { deleteDeviceTagApi, getDeviceTagListApi } from "@/api/modules";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ENABLE_STATUS, ENABLE_STATUS_I18N, ENABLE_STATUS_OPTIONS } from "@/config/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import ControlModal from "./modal/Control.vue";
import PowerModal from "./modal/Power.vue";
import TagModal from "./modal/Tag.vue";

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();
/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  { get: getDeviceTagListApi, delete: deleteDeviceTagApi },
  null,
  list => dateFormatter(list, ["createdAt", "updatedAt"])
);
/** 标签弹窗引用 */
const modalRef = ref<InstanceType<typeof TagModal>>();
/** 控制弹窗引用 */
const controlModalRef = ref<InstanceType<typeof ControlModal>>();
/** 开关机弹窗引用 */
const powerModalRef = ref<InstanceType<typeof PowerModal>>();
/** 表格列配置 */
const columns: ColumnProps<DeviceTagRow>[] = [
  { type: "selection", width: 50 },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  { prop: "tenantName", label: "租户名称", minWidth: 120 },
  {
    prop: "name",
    label: "标签名称",
    minWidth: 140,
    search: { el: "input", props: { placeholder: "请输入标签名称" } }
  },
  { prop: "description", label: "标签描述", minWidth: 180, showOverflowTooltip: true },
  { prop: "sort", label: "排序", width: 80 },
  { prop: "deviceCount", label: "关联设备数", width: 110 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } },
    fixed: "right"
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "updatedAt", label: "更新时间", width: 170 },
  { prop: "operation", label: "操作", width: 220, fixed: "right" }
];

/** 显示弹框 */
function handleShowModal(type: TModalType, row?: DeviceTagRow) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }
  const titleMap = {
    Add: "新增设备标签",
    Edit: "编辑设备标签",
    View: "查看设备标签"
  };
  const showConfirm = type === "Add" || type === "Edit";
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm }, row);
}
/** 显示控制设备弹窗 */
function handleShowControl(row: DeviceTagRow) {
  const title = row.name ? `控制设备 - ${row.name}` : "控制设备";
  controlModalRef.value?.acceptParams({ title, type: "Edit", showConfirm: true }, row);
}
/** 显示开关机弹窗 */
function handleShowPower(row: DeviceTagRow) {
  const title = row.name ? `设置开关机 - ${row.name}` : "设置开关机";
  powerModalRef.value?.acceptParams({ title, type: "Edit", showConfirm: true }, row);
}
/** 监听学校切换 */
watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备标签">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowControl(row)">控制设备</el-button>
        <el-button type="primary" link @click="handleShowPower(row)">设置开关机</el-button>
        <br />
        <el-button type="primary" link @click="handleShowModal('View', row)">查看</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
      </template>
    </ProTable>

    <TagModal ref="modalRef" @submit="refreshTableList" />
    <ControlModal ref="controlModalRef" />
    <PowerModal ref="powerModalRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
