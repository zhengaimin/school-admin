<script setup lang="ts" name="hairdryerTags">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { TagRow } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { deleteDeviceBaseTagApi, getDeviceBaseTagsApi } from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import TagModal from "./modal/Tag.vue";
import DeviceTableModal from "./modal/DeviceTable.vue";
import CommandModal from "./modal/Command.vue";

const { schoolId, isAllSchools } = useSchool();

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  { get: getDeviceBaseTagsApi, delete: deleteDeviceBaseTagApi },
  null,
  list => dateFormatter(list, ["createdAt"])
);

const modalRef = ref();
const deviceTableRef = ref();
const commandRef = ref();

const columns: ColumnProps<TagRow>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  {
    prop: "name",
    label: "标签名称",
    minWidth: 140,
    search: { el: "input", props: { placeholder: "请输入标签名称" } }
  },
  { prop: "description", label: "标签描述", minWidth: 180, showOverflowTooltip: true },
  { prop: "deviceCount", label: "关联设备数", width: 100 },
  { prop: "sort", label: "排序值", width: 80 },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
];

const onShowModal = (type: "Add" | "Edit", row?: TagRow) => {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }
  const titleMap = { Add: "新增标签", Edit: "编辑标签" };
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
};

const onShowDeviceList = (row: TagRow) => {
  const tagLabel = row.name || "标签";
  deviceTableRef.value.acceptParams({ title: `标签设备列表 - ${tagLabel}`, type: "View", showConfirm: true }, { id: row.id });
};

const onShowCommand = (row: TagRow) => {
  const tagLabel = row.name || "标签";
  commandRef.value.acceptParams({ title: `下发命令 - ${tagLabel}`, type: "Edit", showConfirm: true }, { id: row.id });
};

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="标签管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增</el-button>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowCommand(row)">控制</el-button>
        <el-button type="primary" link @click="onShowDeviceList(row)">查看</el-button>
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
      </template>
    </ProTable>

    <TagModal ref="modalRef" @submit="refreshTableList" />
    <DeviceTableModal ref="deviceTableRef" />
    <CommandModal ref="commandRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
