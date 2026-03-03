<script setup lang="ts" name="systemOrganization">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getOrgDepartmentListApi, deleteOrgDepartmentApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import {
  ORG_DEPARTMENT_STATUS,
  ORG_DEPARTMENT_STATUS_I18N,
  ORG_DEPARTMENT_STATUS_OPTIONS,
  PERMISSION_CODE
} from "@/config/modules";
import DepartmentModal from "./modal/Department.vue";
import UserAssignModal from "./modal/UserAssign.vue";

const modalRef = ref();
const userAssignModalRef = ref();

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: getOrgDepartmentListApi,
  delete: deleteOrgDepartmentApi
});

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
    search: { el: "select", props: { placeholder: "请选择状态" } },
    fixed: "right"
  },
  { prop: "createdAt", label: "创建时间", width: 180 },
  { prop: "updatedAt", label: "更新时间", width: 180 },
  { prop: "operation", label: "操作", width: 160, fixed: "right" }
];

/** 打开用户分配弹窗 */
function handleShowUserAssign(row: System.OrgDepartment) {
  userAssignModalRef.value?.acceptParams({
    title: "分配用户",
    type: "Edit",
    showConfirm: true,
    departmentId: row.id,
    departmentName: row.name
  });
}

/** 打开部门弹窗 */
function handleShowModal(type: "Add" | "Edit", row?: System.OrgDepartment) {
  const titleMap = { Add: "新增部门", Edit: "编辑部门" };
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}

/** 删除部门 */
function handleDelete(row: System.OrgDepartment) {
  deleteRow(row.id, row.name);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="组织架构">
      <template #toolButton>
        <el-button v-permission="PERMISSION_CODE.ORG_CREATE" type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">
          新增部门
        </el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === ORG_DEPARTMENT_STATUS.ENABLED ? 'success' : 'info'">
          {{ ORG_DEPARTMENT_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button v-permission="PERMISSION_CODE.ORG_UPDATE" type="primary" link @click="handleShowModal('Edit', row)">
          编辑
        </el-button>
        <el-button
          v-permission="[PERMISSION_CODE.USER_UPDATE, PERMISSION_CODE.ORG_UPDATE]"
          type="primary"
          link
          @click="handleShowUserAssign(row)"
        >
          分配用户
        </el-button>
        <el-button v-permission="PERMISSION_CODE.ORG_DELETE" type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <DepartmentModal ref="modalRef" @submit="refreshTableList" />
    <UserAssignModal ref="userAssignModalRef" />
  </div>
</template>
