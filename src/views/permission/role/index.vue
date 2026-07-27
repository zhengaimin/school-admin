<script setup lang="ts" name="systemRole">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, unref } from "vue";
import { getRoleListApi, deleteRoleApi } from "@/api/modules";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import RoleModal from "./modal/Role.vue";
import {
  ENABLE_STATUS,
  ENABLE_STATUS_I18N,
  ENABLE_STATUS_OPTIONS,
  PERMISSION_CODE,
  ROLE_LEVEL,
  ROLE_LEVEL_OPTIONS
} from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useUserStore } from "@/stores/modules/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

/** 角色列表请求适配 */
function getRoleList(params: System.ReqRoleList & { schoolId?: string }) {
  const { schoolId: _schoolId, ...query } = params;
  const { roleLevel, tenantId } = unref(userInfo);

  // 平台账号的可见租户由后端数据权限控制，不能固定为平台根租户。
  const isTenantBoundRole = roleLevel !== ROLE_LEVEL.SUPER && roleLevel !== ROLE_LEVEL.PLATFORM;
  if (isTenantBoundRole && tenantId) {
    query.tenantId = tenantId;
  }
  return getRoleListApi(query);
}

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: getRoleList,
  delete: deleteRoleApi
});

const roleModalRef = ref();

const columns: ColumnProps<System.Role>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "角色名称",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入角色名称" } }
  },
  {
    prop: "roleLevel",
    label: "账号类型",
    minWidth: 150,
    enum: ROLE_LEVEL_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择账号类型" } }
  },
  { prop: "description", label: "描述", minWidth: 200 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } },
    fixed: "right"
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/** 打开角色弹窗 */
function handleShowRoleModal(type: "Add" | "Edit", row?: System.Role) {
  const titleMap = { Add: "新增角色", Edit: "编辑角色" };
  roleModalRef.value.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}

/** 删除角色 */
function handleDelete(row: System.Role) {
  deleteRow(row.id, row.name);
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="角色管理">
      <template #toolButton>
        <el-button
          v-permission="PERMISSION_CODE.ROLE_CREATE"
          type="primary"
          :icon="CirclePlus"
          @click="handleShowRoleModal('Add')"
        >
          新增角色
        </el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button v-permission="PERMISSION_CODE.ROLE_UPDATE" type="primary" link @click="handleShowRoleModal('Edit', row)">
          编辑
        </el-button>
        <el-button v-permission="PERMISSION_CODE.ROLE_DELETE" type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <RoleModal ref="roleModalRef" @submit="refreshTableList" />
  </div>
</template>
