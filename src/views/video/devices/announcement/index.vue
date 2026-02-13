<script setup lang="ts" name="announcement">
import type { Announcement, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { AnnouncementRow } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import AnnouncementModal from "./modal/Announcement.vue";
import { buildAnnouncementListParams } from "./utils/payload";
import {
  getAnnouncementsApi,
  postPublishAnnouncementsApi,
  postRevokeAnnouncementsApi,
  deleteAnnouncementsApi
} from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";
import {
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_STATUS_I18N,
  ANNOUNCEMENT_STATUS_OPTIONS,
  getAnnouncementStatusTagType
} from "@/config/modules";

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();
/** 选中行数据 */
const { selectedList, isSelected, selectionChange } = useSelection("id");

/** 弹窗引用 */
const modalRef = ref();

/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetAnnouncementsApi }, null, list =>
  dateFormatter(list, ["publishedAt", "createdAt"])
);

/** 表格列配置 */
const columns: ColumnProps<AnnouncementRow>[] = [
  { type: "selection", width: 50, fixed: "left" },
  { type: "index", label: "#", width: 60 },
  {
    prop: "title",
    label: "标题",
    minWidth: 200,
    search: { el: "input", key: "keyword", props: { placeholder: "请输入标题关键词" } }
  },
  { prop: "content", label: "正文", minWidth: 240, showOverflowTooltip: true },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ANNOUNCEMENT_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态", clearable: true } }
  },
  { prop: "publishedAt", label: "发布时间", width: 170 },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
];

/** 获取公告列表 */
async function axiosGetAnnouncementsApi(params: Record<string, any>): Promise<ResultData<Announcement.ResGetAnnouncementsApi>> {
  try {
    const payload = buildAnnouncementListParams(params);
    return await getAnnouncementsApi(payload);
  } catch (error) {
    console.error("axiosGetAnnouncementsApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}
/** 发布公告 */
async function axiosPostPublishAnnouncementsApi(ids: number[]) {
  try {
    return await postPublishAnnouncementsApi({ ids });
  } catch (error) {
    console.error("axiosPostPublishAnnouncementsApi:", error);
    return { code: -1, data: null };
  }
}
/** 撤回公告 */
async function axiosPostRevokeAnnouncementsApi(ids: number[]) {
  try {
    return await postRevokeAnnouncementsApi({ ids });
  } catch (error) {
    console.error("axiosPostRevokeAnnouncementsApi:", error);
    return { code: -1, data: null };
  }
}
/** 删除公告 */
async function axiosDeleteAnnouncementsApi(ids: number[]) {
  try {
    return await deleteAnnouncementsApi({ ids });
  } catch (error) {
    console.error("axiosDeleteAnnouncementsApi:", error);
    return { code: -1, data: null };
  }
}

/** 显示弹框 */
function handleShowModal(type: "Add" | "Edit", row?: AnnouncementRow) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = {
    Add: "新增公告",
    Edit: "编辑公告"
  };
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 批量发布 */
async function handlePublish(rows: AnnouncementRow[]) {
  const validRows = rows.filter(row => row.status === ANNOUNCEMENT_STATUS.REVOKED);
  if (!validRows.length) {
    ElMessage.warning("请选择待发布的公告");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定发布选中的 ${validRows.length} 条公告吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    const result = await axiosPostPublishAnnouncementsApi(validRows.map(row => row.id));
    if (result.code !== 0) return;
    ElMessage.success("发布成功");
    proTable.value?.clearSelection?.();
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("发布失败，请重试");
    }
  }
}
/** 批量撤回 */
async function handleRevoke(rows: AnnouncementRow[]) {
  const validRows = rows.filter(row => row.status === ANNOUNCEMENT_STATUS.PUBLISHED);
  if (!validRows.length) {
    ElMessage.warning("请选择已发布的公告");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定撤回选中的 ${validRows.length} 条公告吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    const result = await axiosPostRevokeAnnouncementsApi(validRows.map(row => row.id));
    if (result.code !== 0) return;
    ElMessage.success("撤回成功");
    proTable.value?.clearSelection?.();
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("撤回失败，请重试");
    }
  }
}
/** 批量删除 */
async function handleDelete(rows: AnnouncementRow[]) {
  const validRows = rows.filter(row => row.status === ANNOUNCEMENT_STATUS.REVOKED);
  if (!validRows.length) {
    ElMessage.warning("请选择已下架的公告");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定删除选中的 ${validRows.length} 条公告吗？`, "提示", {
      type: "warning"
    });
    const result = await axiosDeleteAnnouncementsApi(validRows.map(row => row.id));
    if (result.code !== 0) return;
    ElMessage.success("删除成功");
    proTable.value?.clearSelection?.();
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败，请重试");
    }
  }
}

/** 监听学校切换 */
watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="flex flex-col h-full">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      table-header="公告管理"
      @selection-change="selectionChange"
    >
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button type="success" :disabled="!isSelected" @click="handlePublish(selectedList as AnnouncementRow[])">
          批量发布
        </el-button>
        <el-button type="warning" :disabled="!isSelected" @click="handleRevoke(selectedList as AnnouncementRow[])">
          批量撤回
        </el-button>
        <el-button type="danger" :disabled="!isSelected" @click="handleDelete(selectedList as AnnouncementRow[])">
          批量删除
        </el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="getAnnouncementStatusTagType(row.status)">
          {{ ANNOUNCEMENT_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button
          type="primary"
          link
          :disabled="row.status === ANNOUNCEMENT_STATUS.PUBLISHED"
          @click="handleShowModal('Edit', row)"
        >
          编辑
        </el-button>
        <el-button type="success" link :disabled="row.status !== ANNOUNCEMENT_STATUS.REVOKED" @click="handlePublish([row])">
          发布
        </el-button>
        <el-button type="warning" link :disabled="row.status !== ANNOUNCEMENT_STATUS.PUBLISHED" @click="handleRevoke([row])">
          撤回
        </el-button>
        <el-button type="danger" link :disabled="row.status !== ANNOUNCEMENT_STATUS.REVOKED" @click="handleDelete([row])">
          删除
        </el-button>
      </template>
    </ProTable>

    <AnnouncementModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>
