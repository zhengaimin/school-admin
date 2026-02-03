<script setup lang="ts" name="systemUser">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { TRoleLevelValue } from "@/config/modules";

import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAdminUserListApi, deleteAdminUserApi, postResetUserPasswordApi } from "@/api/modules";
import ProTable from "@/components/ProTable/index.vue";
import UserModal from "./modal/User.vue";
import DataScopeModal from "./modal/DataScope.vue";
import { CirclePlus } from "@element-plus/icons-vue";
import {
  ENABLE_STATUS,
  ENABLE_STATUS_I18N,
  ENABLE_STATUS_OPTIONS,
  ROLE_LEVEL,
  ROLE_LEVEL_I18N,
  ROLE_LEVEL_OPTIONS
} from "@/config/modules";
import { useManage } from "@/hooks/useManage";

const props = defineProps<{ roleLevel?: TRoleLevelValue }>();

/** 表格列配置 */
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
  {
    prop: "roleLevel",
    label: "账号类型",
    minWidth: 120,
    enum: ROLE_LEVEL_OPTIONS
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS,
    fixed: "right"
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
];

/** 表格管理 Hook */
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetAdminUserListApi });

/** 用户弹窗引用 */
const userModalRef = ref();
/** 数据权限弹窗引用 */
const dataScopeModalRef = ref();

/** 当前账号类型 */
const pageRoleLevel = computed<TRoleLevelValue>(() => props.roleLevel ?? ROLE_LEVEL.PLATFORM);
/** 表格标题 */
const tableHeader = computed(() => getRoleTitle(pageRoleLevel.value));

/** 获取账号类型标题 */
function getRoleTitle(roleLevel: TRoleLevelValue) {
  return `【${ROLE_LEVEL_I18N[roleLevel]}】用户`;
}
/** 判断是否供应商账号 */
function isSupplierRole(roleLevel?: TRoleLevelValue) {
  return roleLevel === ROLE_LEVEL.AGENT;
}

/** 获取用户列表 */
function axiosGetAdminUserListApi(params: System.ReqUserList) {
  return getAdminUserListApi({ ...params, roleLevel: pageRoleLevel.value });
}
/** 重置用户密码 */
async function axiosPostResetUserPasswordApi(id: number): Promise<System.ResPostResetUserPasswordApi | null> {
  try {
    const result = await postResetUserPasswordApi(id);
    if (result.code === 0) {
      return result.data ?? null;
    }
  } catch (error) {
    console.error("axiosPostResetUserPasswordApi:", error);
  }
  return null;
}

/** 打开用户弹窗 */
function handleShowUserModal(type: "Add" | "Edit", row?: System.AdminUser) {
  const titleMap = {
    Add: `新增${getRoleTitle(pageRoleLevel.value)}`,
    Edit: `编辑${getRoleTitle(pageRoleLevel.value)}`
  };
  userModalRef.value.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 打开数据权限弹窗 */
function handleShowDataScopeModal(row: System.AdminUser) {
  const scopeType = pageRoleLevel.value === ROLE_LEVEL.PLATFORM ? "TENANT" : "SCHOOL";
  dataScopeModalRef.value.acceptParams({
    title: "数据权限配置",
    type: "Edit",
    showConfirm: true,
    userId: row.id,
    userName: row.realName || row.username,
    tenantId: row.tenantId,
    scopeType
  });
}
/** 重置密码 */
function handleResetPassword(row: System.AdminUser) {
  ElMessageBox.confirm(`确定重置用户【${row.username}】的密码吗？`, "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const result = await axiosPostResetUserPasswordApi(row.id);
      if (!result) return;
      const resetPassword = result.password;
      if (resetPassword) {
        ElMessageBox.alert(`新密码：${resetPassword}`, "提示", { confirmButtonText: "确定" });
      } else if (result.message) {
        ElMessage.success(result.message);
      } else {
        ElMessage.success("密码已重置");
      }
      refreshTableList();
    })
    .catch(() => void 0);
}
/** 删除用户 */
function handleDelete(row: System.AdminUser) {
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
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" :table-header="tableHeader">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowUserModal('Add')">新增用户</el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowUserModal('Edit', row)">编辑</el-button>
        <el-button
          v-if="!isSupplierRole(row.roleLevel ?? pageRoleLevel)"
          type="primary"
          link
          @click="handleShowDataScopeModal(row)"
        >
          数据权限
        </el-button>
        <el-button type="warning" link @click="handleResetPassword(row)">重置密码</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <UserModal ref="userModalRef" :role-level="pageRoleLevel" @submit="refreshTableList" />
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
