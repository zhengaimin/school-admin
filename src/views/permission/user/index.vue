<script setup lang="ts" name="systemUser">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus, DataAnalysis, Key } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getAdminUserListApi, deleteAdminUserApi, resetUserPasswordApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { ENABLE_STATUS_OPTIONS } from "@/config/modules";
import UserModal from "./modal/User.vue";
import DataScopeModal from "./modal/DataScope.vue";

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getAdminUserListApi });

const userModalRef = ref();
const dataScopeModalRef = ref();

const columns: ColumnProps<System.AdminUser>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "username",
    label: "用户名",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入用户名" } }
  },
  {
    prop: "realName",
    label: "真实姓名",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入姓名" } }
  },
  { prop: "phone", label: "手机号", minWidth: 120 },
  { prop: "roleName", label: "角色", minWidth: 120 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
];

/** 打开用户弹窗 */
const onShowUserModal = (type: "Add" | "Edit", row?: System.AdminUser) => {
  const titleMap = { Add: "新增用户", Edit: "编辑用户" };
  userModalRef.value.acceptParams({ title: titleMap[type], type }, row);
};

/** 打开数据权限弹窗 */
const onShowDataScopeModal = (row: System.AdminUser) => {
  dataScopeModalRef.value.acceptParams({ userId: row.id, userName: row.realName || row.username });
};

/** 重置密码 */
const handleResetPassword = (row: System.AdminUser) => {
  ElMessageBox.confirm(`确定重置用户【${row.username}】的密码吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await resetUserPasswordApi(row.id);
      ElMessage.success("密码已重置");
    })
    .catch(() => void 0);
};

/** 删除用户 */
const handleDelete = (row: System.AdminUser) => {
  ElMessageBox.confirm(`确定删除用户【${row.username}】吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await deleteAdminUserApi(row.id);
      ElMessage.success("删除成功");
      refreshTableList();
    })
    .catch(() => void 0);
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="用户管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowUserModal('Add')">新增用户</el-button>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowUserModal('Edit', row)">编辑</el-button>
        <el-button type="primary" link :icon="DataAnalysis" @click="onShowDataScopeModal(row)">数据权限</el-button>
        <el-button type="warning" link :icon="Key" @click="handleResetPassword(row)">重置密码</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <UserModal ref="userModalRef" @submit="refreshTableList" />
    <DataScopeModal ref="dataScopeModalRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
