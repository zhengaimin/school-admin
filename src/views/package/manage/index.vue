<script setup lang="ts" name="platformPackageManage">
import type { PlatformPackage, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { computed, ref } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { deletePlatformPackageApi, getPlatformPackageListApi, updatePlatformPackageStatusApi } from "@/api/modules";

import ProTable from "@/components/ProTable/index.vue";
import PackageModal from "./modal/Package.vue";
import { useManage } from "@/hooks/useManage";
import { isPlatformRoleLevel } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";

/** 定价模式文案映射 */
const PRICING_MODE_TEXT: Record<string, string> = {
  DECREASING: "按月递减",
  FIXED_TOTAL: "固定总价"
};

const userStore = useUserStore();

/** 新增编辑弹窗引用 */
const packageModalRef = ref<InstanceType<typeof PackageModal>>();
/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  { get: axiosGetPlatformPackageListApi, delete: deletePlatformPackageApi },
  null,
  null
);

/** 平台运营方是否尚未选择租户 */
const isPlatformWithoutTenant = computed(() => isPlatformRoleLevel(userStore.userInfo?.roleLevel) && !userStore.currentTenant);

/** 表格列配置 */
const columns: ColumnProps<PlatformPackage.Item>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "name", label: "套餐名称", minWidth: 160 },
  { prop: "schoolIds", label: "适用学校", minWidth: 120 },
  { prop: "dateRange", label: "有效期", minWidth: 200 },
  { prop: "pricingMode", label: "定价模式", minWidth: 120 },
  { prop: "monthlyPrice", label: "价格（元/月）", minWidth: 130 },
  { prop: "status", label: "状态", width: 100, fixed: "right" },
  { prop: "operation", label: "操作", width: 260, fixed: "right" }
];

/** 获取平台套餐列表（平台运营方未选择租户时不加载） */
async function axiosGetPlatformPackageListApi(params: Record<string, any>): Promise<ResultData<any>> {
  if (isPlatformWithoutTenant.value) {
    return { code: 0, msg: "", data: { list: [], total: 0, page: 1, pageSize: 10 } };
  }
  try {
    return await getPlatformPackageListApi(params as PlatformPackage.ListParams);
  } catch (error) {
    console.error("axiosGetPlatformPackageListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0, page: 1, pageSize: 10 } };
  }
}

/** 打开新增/编辑/查看弹窗（查看为只读，不显示确定按钮） */
function handleShowModal(type: "Add" | "Edit" | "View", row?: PlatformPackage.Item) {
  const titleMap = {
    Add: "新建平台套餐",
    Edit: "编辑平台套餐",
    View: "平台套餐详情"
  };
  packageModalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: type !== "View" }, row);
}

/** 停用/启用套餐 */
async function handleToggleStatus(row: PlatformPackage.Item) {
  const nextStatus = row.status === 1 ? 0 : 1;
  try {
    await ElMessageBox.confirm(row.status === 1 ? `确定要停用【${row.name}】吗？` : `确定要启用【${row.name}】吗？`, "提示", {
      type: "warning"
    });
    const result = await updatePlatformPackageStatusApi(row.id, nextStatus);
    if (result.code !== 0) return;
    ElMessage.success(nextStatus === 1 ? "启用成功" : "停用成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("handleToggleStatus:", error);
    }
  }
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="平台套餐">
      <!-- 工具按钮 -->
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新建</el-button>
      </template>

      <template #schoolIds="{ row }">{{ row.schoolIds?.length || 0 }}所学校</template>

      <template #dateRange="{ row }">{{ row.startDate }} ~ {{ row.endDate }}</template>

      <template #pricingMode="{ row }">{{ PRICING_MODE_TEXT[row.pricingMode] || "--" }}</template>

      <!-- 状态列 -->
      <template #status="{ row }">{{ row.statusText || (row.status === 1 ? "启用" : "禁用") }}</template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowModal('View', row)">详情</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button v-if="row.status === 1" type="warning" link @click="handleToggleStatus(row)">停用</el-button>
        <el-button v-else type="success" link @click="handleToggleStatus(row)">启用</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
      </template>
    </ProTable>

    <PackageModal ref="packageModalRef" @submit="refreshTableList" />
  </div>
</template>
