<script setup lang="ts" name="schoolMien">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { TSchoolMienItem } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteSchoolMienApi,
  getSchoolMienListApi,
  putUpdateSchoolMienSortApi,
  putUpdateSchoolMienStatusApi
} from "@/api/modules";
import ProTable from "@/components/ProTable/index.vue";
import SchoolMienModal from "./modal/SchoolMien.vue";
import SchoolMienDetail from "./modal/Detail.vue";
import {
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_STATUS_I18N,
  ANNOUNCEMENT_STATUS_OPTIONS,
  getAnnouncementStatusTagType
} from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";

const { schoolId, isAllSchools } = useSchool();
const { isSelected, selectedList, selectionChange } = useSelection("id");
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: getSchoolMienListApi,
  delete: deleteSchoolMienApi
});

/** 弹窗引用 */
const modalRef = ref<InstanceType<typeof SchoolMienModal> | null>(null);
/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof SchoolMienDetail> | null>(null);

/** 表格列配置 */
const columns: ColumnProps<TSchoolMienItem>[] = [
  { type: "selection", width: 50, fixed: "left" },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  {
    prop: "keyword",
    label: "关键词",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入关键词" } }
  },
  { prop: "content", label: "内容", minWidth: 240, showOverflowTooltip: true },
  { prop: "images", label: "图片数量", width: 100 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ANNOUNCEMENT_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态", clearable: true } },
    fixed: "right"
  },
  { prop: "sort", label: "排序", width: 100, fixed: "right" },
  { prop: "publishedAt", label: "发布时间", minWidth: 160 },
  { prop: "createdAt", label: "创建时间", minWidth: 160 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/** 批量更新校园风采状态 */
async function axiosPutUpdateSchoolMienStatusApi(params: SchoolMien.ReqPutSchoolMienStatusApi) {
  try {
    return await putUpdateSchoolMienStatusApi(params);
  } catch (error) {
    console.error(error);
    return { code: -1, data: null };
  }
}

/** 更新校园风采排序 */
async function axiosPutUpdateSchoolMienSortApi(params: SchoolMien.ReqPutSchoolMienSortApi) {
  try {
    return await putUpdateSchoolMienSortApi(params);
  } catch (error) {
    console.error(error);
    return { code: -1, data: null };
  }
}

/** 获取状态标签类型 */
function getStatusTagType(status?: TSchoolMienItem["status"]) {
  if (!status) return "info";
  return getAnnouncementStatusTagType(status);
}
/** 获取状态文案 */
function getStatusText(status?: TSchoolMienItem["status"], statusText?: string) {
  if (status) return ANNOUNCEMENT_STATUS_I18N[status] || statusText || "--";
  return statusText || "--";
}

/** 批量更新状态 */
async function handleBatchStatus(status: TSchoolMienItem["status"], rows: TSchoolMienItem[]) {
  if (!status) return;
  const statusActionMap: Record<number, string> = {
    [ANNOUNCEMENT_STATUS.PUBLISHED]: "发布",
    [ANNOUNCEMENT_STATUS.REVOKED]: "下架"
  };
  const statusLabel = statusActionMap[status] || "更新";
  const validRows = rows.filter(row => row.status !== status);

  if (!validRows.length) {
    ElMessage.warning(`请选择需要${statusLabel}的校园风采`);
    return;
  }

  try {
    await ElMessageBox.confirm(`确定${statusLabel}选中的 ${validRows.length} 条校园风采吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    const result = await axiosPutUpdateSchoolMienStatusApi({
      ids: validRows.map(row => row.id),
      status
    });
    if (result.code !== 0) return;
    ElMessage.success(`${statusLabel}成功`);
    proTable.value?.clearSelection?.();
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(`${statusLabel}失败，请重试`);
    }
  }
}

/** 更新排序 */
async function handleSortChange(row: TSchoolMienItem, value: number | undefined) {
  if (!row?.id) return;
  if (value === undefined || value === null) {
    ElMessage.warning("请输入排序值");
    return;
  }

  const result = await axiosPutUpdateSchoolMienSortApi({ id: row.id, sort: value });
  if (result.code !== 0) return;
  ElMessage.success("排序更新成功");
  refreshTableList();
}

/** 处理排序显示值 */
function normalizeSortValue(value: TSchoolMienItem["sort"] | string | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
}

/** 显示弹框 */
function handleShowModal(type: "Add" | "Edit", row?: TSchoolMienItem) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = {
    Add: "新增校园风采",
    Edit: "编辑校园风采"
  };
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 显示详情 */
function handleShowDetail(row?: TSchoolMienItem) {
  if (!row?.id) return;
  detailModalRef.value?.acceptParams({ title: "校园风采详情", type: "View", showConfirm: false }, row);
}
/** 删除 */
function handleDelete(row: TSchoolMienItem) {
  if (!row?.id) return;
  deleteRow(row.id);
}

/** 监听学校切换 */
watch(schoolId, () => {
  refreshTableList();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      table-header="校园风采"
      @selection-change="selectionChange"
    >
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button
          type="success"
          :disabled="!isSelected"
          @click="handleBatchStatus(ANNOUNCEMENT_STATUS.PUBLISHED, selectedList as TSchoolMienItem[])"
        >
          批量发布
        </el-button>
        <el-button
          type="warning"
          :disabled="!isSelected"
          @click="handleBatchStatus(ANNOUNCEMENT_STATUS.REVOKED, selectedList as TSchoolMienItem[])"
        >
          批量下架
        </el-button>
      </template>
      <template #images="{ row }">
        {{ row.images?.length !== undefined ? `${row.images.length} 张` : "--" }}
      </template>
      <template #sort="{ row }">
        <el-input-number
          :model-value="normalizeSortValue(row.sort)"
          class="w-full sort-input"
          :min="0"
          controls-position="right"
          @update:model-value="value => (row.sort = value)"
          @change="value => handleSortChange(row, value)"
        />
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ getStatusText(row.status, row.statusText) }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <SchoolMienModal ref="modalRef" @submit="refreshTableList" />
    <SchoolMienDetail ref="detailModalRef" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.sort-input .el-input__inner) {
  text-align: center;
}
:deep(.sort-input.is-controls-right .el-input__wrapper) {
  padding-right: 16px;
  padding-left: 16px;
}
</style>
