<script setup lang="ts" name="systemTenant">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { deleteTenantApi, getTenantListApi } from "@/api/modules";
import { ENABLE_STATUS_OPTIONS } from "@/config/modules";
import TenantModal from "./modal/Tenant.vue";

const requestTenantList = async (params: System.ReqTenantList) => {
  const result = await getTenantListApi(params);
  const list = (result.data?.list || []).filter(item => item.parentId !== 0);
  return {
    data: list
  };
};

const columns: ColumnProps<System.Tenant>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "租户名称",
    minWidth: 160,
    search: { el: "input", props: { placeholder: "请输入租户名称" } }
  },
  {
    prop: "code",
    label: "租户编码",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入租户编码" } }
  },
  { prop: "contactName", label: "联系人", minWidth: 120 },
  { prop: "contactPhone", label: "联系电话", minWidth: 130 },
  { prop: "contactEmail", label: "联系邮箱", minWidth: 180 },
  { prop: "address", label: "地址", minWidth: 200 },
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
  { prop: "operation", label: "操作", width: 120, fixed: "right" }
];

const proTable = ref();
const modalRef = ref();

const onShowModal = (type: "Add" | "Edit", row?: System.Tenant) => {
  const titleMap = { Add: "新增租户", Edit: "编辑租户" };
  modalRef.value.acceptParams({ title: titleMap[type], type }, row);
};

const refreshTableList = () => {
  proTable.value?.getTableList?.();
};

const handleDelete = (row: System.Tenant) => {
  ElMessageBox.confirm(`确定删除租户【${row.name}】吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteTenantApi(row.id);
    ElMessage.success("删除成功");
    refreshTableList();
  });
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="requestTenantList" :pagination="false" table-header="租户管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增租户</el-button>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>
    <TenantModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
