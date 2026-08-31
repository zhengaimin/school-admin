<!-- 租户管理列表 -->
<script setup lang="ts" name="systemTenant">
import type { System } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { deleteTenantApi, getTenantListApi, enterTenantApi } from "@/api/modules";
import { ENABLE_STATUS, ENABLE_STATUS_I18N, ENABLE_STATUS_OPTIONS, PERMISSION_CODE } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { resetRouter } from "@/routers/index";
import TenantModal from "./modal/Tenant.vue";

const router = useRouter();
const userStore = useUserStore();

/** 进入租户：写入当前租户会话态 + 前端状态，跳转学校管理 */
const handleEnterTenant = (row: System.Tenant) => {
  ElMessageBox.confirm(`进入租户【${row.name}】进行管理?`, "提示", {
    confirmButtonText: "进入",
    cancelButtonText: "取消",
    type: "info"
  }).then(async () => {
    const res = await enterTenantApi({ tenantId: row.id });
    if (res.code === 0 && res.data) {
      // 先替换本地 token：新 token 携带当前租户ID，后续请求由后端解析并覆盖数据范围
      if (res.data.token) userStore.setToken(res.data.token);
      userStore.setCurrentTenant({ tenantId: res.data.tenantId, tenantName: res.data.tenantName });
      // 进入租户后重建菜单并重新注册动态路由：清旧路由 + 拉新菜单 + addRoute，
      // 否则业务模块路由（如 /common/school/manage）未注册，跳转会失败被踢回登录页
      resetRouter();
      await initDynamicRouter();
      ElMessage.success(`已进入租户【${res.data.tenantName}】`);
      router.push("/common/school/manage");
    }
  });
};

/**
 * 获取租户列表
 * @param params 查询参数
 */
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
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

const proTable = ref();
const modalRef = ref();

const onShowModal = (type: "Add" | "Edit", row?: System.Tenant) => {
  const titleMap = { Add: "新增租户", Edit: "编辑租户" };
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
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
        <el-button v-permission="PERMISSION_CODE.TENANT_CREATE" type="primary" :icon="CirclePlus" @click="onShowModal('Add')">
          新增租户
        </el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button type="success" link @click="handleEnterTenant(row)">进入租户</el-button>
        <el-button v-permission="PERMISSION_CODE.TENANT_UPDATE" type="primary" link @click="onShowModal('Edit', row)">
          编辑
        </el-button>
        <el-button v-permission="PERMISSION_CODE.TENANT_DELETE" type="danger" link @click="handleDelete(row)">删除</el-button>
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
