<script setup lang="ts" name="schoolDeviceConfig">
import type { SchoolDeviceConfig } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSchoolDeviceConfigListApi } from "@/api/modules/device/config";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE_OPTIONS } from "@/config/modules";
import ConfigModal from "./modal/Config.vue";

type ConfigRow = SchoolDeviceConfig.ISchoolDeviceConfigItem;

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getSchoolDeviceConfigListApi }, null, list =>
  dateFormatter(list, [
    { field: "createdAt", isUnix: false },
    { field: "updatedAt", isUnix: false }
  ])
);

const modalRef = ref<InstanceType<typeof ConfigModal>>();

/** 显示编辑弹框 */
const onShowModal = (row: ConfigRow) => {
  modalRef.value?.acceptParams({ title: "编辑配置", type: "Edit", showConfirm: true }, row);
};

const columns: ColumnProps<ConfigRow>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "schoolName",
    label: "学校名称",
    minWidth: 140,
    search: { el: "input", props: { placeholder: "请输入学校名称" } }
  },
  {
    prop: "deviceType",
    label: "设备类型",
    width: 120,
    enum: DEVICE_TYPE_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择设备类型" } }
  },
  {
    prop: "vendorCode",
    label: "厂商代码",
    width: 120,
    search: { el: "input", props: { placeholder: "请输入厂商代码" } }
  },
  { prop: "customName", label: "自定义名称", minWidth: 140 },
  { prop: "description", label: "设备描述", minWidth: 180, showOverflowTooltip: true },
  { prop: "sortOrder", label: "显示排序", width: 100 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    fixed: "right",
    search: {
      el: "select",
      props: { placeholder: "请选择状态" }
    },
    enum: [
      { label: "启用", value: 1 },
      { label: "禁用", value: 0 }
    ]
  },
  { prop: "createdAt", label: "创建时间", width: 180 },
  { prop: "updatedAt", label: "更新时间", width: 180 },
  { prop: "operation", label: "操作", width: 100, fixed: "right" }
];

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学校设备配置管理">
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? "启用" : "禁用" }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal(row)">编辑</el-button>
      </template>
    </ProTable>

    <ConfigModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
