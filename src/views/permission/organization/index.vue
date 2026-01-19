<script setup lang="ts" name="systemOrganization">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getOrgDepartmentListApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { ORG_DEPARTMENT_STATUS_OPTIONS } from "@/config/modules";
import DepartmentModal from "./modal/Department.vue";

const { proTable, axiosGetTableList, refreshTableList } = useManage({
  get: getOrgDepartmentListApi
});

const modalRef = ref();

const columns: ColumnProps<System.OrgDepartment>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "部门名称",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入部门名称" } }
  },
  { prop: "code", label: "部门编码", minWidth: 120 },
  { prop: "tenantId", label: "租户ID", width: 100 },
  { prop: "parentId", label: "父部门ID", width: 100 },
  { prop: "leaderId", label: "负责人ID", width: 100 },
  { prop: "sort", label: "排序", width: 80 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ORG_DEPARTMENT_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "createdAt", label: "创建时间", width: 180 },
  { prop: "updatedAt", label: "更新时间", width: 180 }
];

const onShowModal = () => {
  modalRef.value.acceptParams({ title: "新增部门", type: "Add" });
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="组织架构">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal">新增部门</el-button>
      </template>
    </ProTable>

    <DepartmentModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
