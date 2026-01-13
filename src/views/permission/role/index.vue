<script setup lang="ts" name="systemRole">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus, Setting } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getRoleListApi, deleteRoleApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { ENABLE_STATUS_OPTIONS } from "@/config/modules";
import RoleModal from "./modal/Role.vue";
import PermissionModal from "./modal/Permission.vue";

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getRoleListApi });

const roleModalRef = ref();
const permissionModalRef = ref();

const columns: ColumnProps<System.Role>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "角色名称",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入角色名称" } }
  },
  { prop: "code", label: "角色标识", minWidth: 150 },
  { prop: "description", label: "描述", minWidth: 200 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/** 打开角色弹窗 */
const onShowRoleModal = (type: "Add" | "Edit", row?: System.Role) => {
  const titleMap = { Add: "新增角色", Edit: "编辑角色" };
  roleModalRef.value.acceptParams({ title: titleMap[type], type }, row);
};

/** 打开权限配置弹窗 */
const onShowPermissionModal = (row: System.Role) => {
  permissionModalRef.value.acceptParams({ roleId: row.id, roleName: row.name });
};

/** 删除角色 */
const handleDelete = (row: System.Role) => {
  ElMessageBox.confirm(`确定删除角色【${row.name}】吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteRoleApi(row.id);
    ElMessage.success("删除成功");
    refreshTableList();
  });
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="角色管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowRoleModal('Add')">新增角色</el-button>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowRoleModal('Edit', row)">编辑</el-button>
        <el-button type="primary" link :icon="Setting" @click="onShowPermissionModal(row)">权限配置</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <RoleModal ref="roleModalRef" @submit="refreshTableList" />
    <PermissionModal ref="permissionModalRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
