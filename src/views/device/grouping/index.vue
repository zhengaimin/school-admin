<script setup lang="ts" name="deviceGrouping">
import type { DeviceGroup, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { CirclePlus, Upload } from "@element-plus/icons-vue";

import { deleteDeviceGroupApi, getDeviceGroupListApi, putUpdateDeviceGroupApi } from "@/api/modules";
import { ENABLE_STATUS_OPTIONS } from "@/config/modules";
import ProTable from "@/components/ProTable/index.vue";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import DeviceGroupModal from "./modal/DeviceGroup.vue";
import DeviceListModal from "./modal/DeviceList.vue";
import ImportModal from "./modal/Import.vue";

const { schoolId, guardSchool } = useSchool();
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: getDeviceGroupListApi,
  delete: deleteDeviceGroupApi
});

/** 新增编辑弹窗引用 */
const modalRef = ref<InstanceType<typeof DeviceGroupModal>>();
/** 设备列表弹窗引用 */
const deviceListModalRef = ref<InstanceType<typeof DeviceListModal>>();
/** 导入弹窗引用 */
const importModalRef = ref<InstanceType<typeof ImportModal>>();
/** 表格列配置 */
const columns: ColumnProps<DeviceGroup.IDeviceGroupItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 160 },
  {
    prop: "name",
    label: "设备组名称",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入设备组名称" } }
  },
  { prop: "currentDeviceCount", label: "当前设备数（台）", width: 140 },
  { prop: "maxDeviceCount", label: "最大设备数（台）", width: 140 },
  { prop: "isVoipGroup", label: "是否VOIP组", width: 110 },
  {
    prop: "status",
    label: "状态",
    width: 120,
    enum: ENABLE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "description", label: "描述", minWidth: 180 },
  { prop: "createdAt", label: "创建时间", minWidth: 170 },
  { prop: "updatedAt", label: "更新时间", minWidth: 170 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/**
 * 更新设备组状态
 * @param row 当前设备组
 * @returns 更新结果
 */
async function axiosPutUpdateDeviceGroupStatusApi(row: DeviceGroup.IDeviceGroupItemVo): Promise<ResultData<null>> {
  try {
    return await putUpdateDeviceGroupApi(row.id, {
      schoolId: row.schoolId,
      status: row.status
    });
  } catch (error) {
    console.error("axiosPutUpdateDeviceGroupStatusApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/**
 * 显示新增编辑弹窗
 * @param type 弹窗类型
 * @param row 当前设备组
 * @returns void
 */
function handleShowModal(type: "Add" | "Edit", row?: DeviceGroup.IDeviceGroupItemVo): void {
  if (type === "Add" && !guardSchool()) return;
  const titleMap = {
    Add: "新增设备组",
    Edit: "编辑设备组"
  };
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 显示导入弹窗 */
function handleShowImport(): void {
  if (!guardSchool()) return;
  importModalRef.value?.acceptParams();
}
/**
 * 显示设备列表弹窗
 * @param row 当前设备组
 * @returns void
 */
function handleShowDeviceList(row: DeviceGroup.IDeviceGroupItemVo): void {
  deviceListModalRef.value?.acceptParams({ title: `设备列表 - ${row.name}`, type: "View", showConfirm: false }, row);
}
/**
 * 修改状态
 * @param row 当前设备组
 * @returns void
 */
async function handleStatusChange(row: DeviceGroup.IDeviceGroupItemVo): Promise<void> {
  const result = await axiosPutUpdateDeviceGroupStatusApi(row);
  if (result.code !== 0) refreshTableList();
}

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备组管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button type="primary" :icon="Upload" @click="handleShowImport">导入</el-button>
      </template>

      <template #isVoipGroup="{ row }">
        {{ row.isVoipGroup ? "是" : "否" }}
      </template>

      <template #status="{ row }">
        <el-select v-model="row.status" class="w-full" @change="handleStatusChange(row)">
          <el-option v-for="item in ENABLE_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDeviceList(row)">设备列表</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
      </template>
    </ProTable>

    <DeviceGroupModal ref="modalRef" @submit="refreshTableList" />
    <DeviceListModal ref="deviceListModalRef" />
    <ImportModal ref="importModalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
