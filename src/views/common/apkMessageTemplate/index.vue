<script setup lang="ts" name="commonApkMessageTemplate">
import type { Common, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { ApkMessageTemplateRow } from "./types";

import { computed, ref, watch } from "vue";
import { Download, RefreshRight } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getApkMessageTemplatesApi, getExportApkMessageTemplatesApi, postResetInheritApkMessageTemplateApi } from "@/api/modules";
import {
  APK_MESSAGE_TEMPLATE_CATEGORY_I18N,
  APK_MESSAGE_TEMPLATE_CATEGORY_OPTIONS,
  APK_MESSAGE_TEMPLATE_SCOPE,
  APK_MESSAGE_TEMPLATE_SCOPE_I18N,
  APK_MESSAGE_TEMPLATE_SCOPE_OPTIONS,
  getApkMessageTemplateScopeTagType
} from "@/config/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import ApkMessageTemplateModal from "./modal/ApkMessageTemplate.vue";
import DetailModal from "./modal/Detail.vue";
import {
  buildApkMessageTemplatesListParams,
  buildExportApkMessageTemplatesParams,
  buildPostResetInheritApkMessageTemplatePayload
} from "./utils/payload";

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();

/** 编辑弹窗引用 */
const modalRef = ref<InstanceType<typeof ApkMessageTemplateModal>>();
/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof DetailModal>>();

/** 表格管理 */
const { proTable, query, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetApkMessageTemplatesApi }, null, list =>
  dateFormatter(list, ["updatedAt"])
);

/** 表格头部 */
const tableHeader = computed(() => {
  return `APK 错误话术配置${isAllSchools.value ? "（当前为全部学校）" : ""}`;
});

/** 表格列配置 */
const columns: ColumnProps<ApkMessageTemplateRow>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "shrgKey",
    label: "语义键",
    minWidth: 220,
    search: { el: "input", key: "keyword", props: { placeholder: "请输入语义键/话术关键字" } }
  },
  {
    prop: "category",
    label: "分类",
    minWidth: 120,
    enum: APK_MESSAGE_TEMPLATE_CATEGORY_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择分类", clearable: true } }
  },
  {
    prop: "scope",
    label: "作用域",
    minWidth: 120,
    enum: APK_MESSAGE_TEMPLATE_SCOPE_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择作用域", clearable: true } }
  },
  { prop: "effectiveScope", label: "生效作用域", minWidth: 120 },
  { prop: "message", label: "错误话术", minWidth: 320, showOverflowTooltip: true },
  { prop: "updatedAt", label: "更新时间", minWidth: 170 },
  { prop: "operation", label: "操作", width: 260, fixed: "right" }
];

/** 获取错误话术列表 */
async function axiosGetApkMessageTemplatesApi(
  params: Record<string, any>
): Promise<ResultData<Common.ResGetApkMessageTemplatesApi>> {
  try {
    const payload = buildApkMessageTemplatesListParams({
      ...params,
      schoolId: schoolId.value
    });
    return await getApkMessageTemplatesApi(payload);
  } catch (error) {
    console.error("axiosGetApkMessageTemplatesApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0, page: 1, pageSize: 10 } };
  }
}

/** 恢复继承 */
async function axiosPostResetInheritApkMessageTemplateApi(id: number, version: number) {
  try {
    const payload = buildPostResetInheritApkMessageTemplatePayload(version);
    return await postResetInheritApkMessageTemplateApi(id, payload);
  } catch (error) {
    console.error("axiosPostResetInheritApkMessageTemplateApi:", error);
    return { code: -1, data: null };
  }
}

/** 导出错误话术 */
async function axiosGetExportApkMessageTemplatesApi(params: Common.ReqExportApkMessageTemplatesApi) {
  try {
    return await getExportApkMessageTemplatesApi(params);
  } catch (error) {
    console.error("axiosGetExportApkMessageTemplatesApi:", error);
    return null;
  }
}

/** 打开编辑弹窗 */
function handleShowModal(row: ApkMessageTemplateRow) {
  modalRef.value?.acceptParams({ title: "编辑错误话术", type: "Edit", showConfirm: true }, row);
}

/** 打开详情弹窗 */
function handleShowDetailModal(row: ApkMessageTemplateRow) {
  detailModalRef.value?.acceptParams({ title: "错误话术详情", type: "View", showConfirm: false }, row);
}

/** 恢复继承 */
async function handleResetInherit(row: ApkMessageTemplateRow) {
  if (row.scope === APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL) {
    ElMessage.warning("全局作用域不支持恢复继承");
    return;
  }
  try {
    await ElMessageBox.confirm(`确认将语义键 ${row.shrgKey} 恢复继承吗？`, "提示", { type: "warning" });
    const result = await axiosPostResetInheritApkMessageTemplateApi(row.id, row.version);
    if (result.code !== 0) return;
    ElMessage.success("恢复继承成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("恢复继承失败，请重试");
    }
  }
}

/** 导出 */
async function handleExport() {
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });
  try {
    const payload = buildExportApkMessageTemplatesParams({
      ...(query.value || {}),
      schoolId: schoolId.value
    });
    const blobData = await axiosGetExportApkMessageTemplatesApi(payload);
    if (!blobData) {
      ElNotification.closeAll();
      ElNotification({ title: "错误", message: "导出失败，请重试", type: "error" });
      return;
    }
    const blob = new Blob([blobData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "APK错误话术配置.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
    ElNotification.closeAll();
    ElNotification({ title: "成功", message: "导出成功", type: "success" });
  } catch (error) {
    console.error("handleExport:", error);
    ElNotification.closeAll();
    ElNotification({ title: "错误", message: "导出失败，请重试", type: "error" });
  }
}

/** 监听学校切换 */
watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="flex flex-col h-full">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" :table-header="tableHeader">
      <template #toolButton>
        <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
      </template>

      <template #category="{ row }">
        {{ APK_MESSAGE_TEMPLATE_CATEGORY_I18N[row.category] || "--" }}
      </template>

      <template #scope="{ row }">
        <el-tag :type="getApkMessageTemplateScopeTagType(row.scope)">
          {{ APK_MESSAGE_TEMPLATE_SCOPE_I18N[row.scope] || "--" }}
        </el-tag>
      </template>

      <template #effectiveScope="{ row }">
        <el-tag type="info">
          {{ row.effectiveScope ? APK_MESSAGE_TEMPLATE_SCOPE_I18N[row.effectiveScope] : "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetailModal(row)">详情</el-button>
        <el-button type="primary" link @click="handleShowModal(row)">编辑</el-button>
        <el-button
          type="warning"
          link
          :icon="RefreshRight"
          :disabled="row.scope === APK_MESSAGE_TEMPLATE_SCOPE.GLOBAL"
          @click="handleResetInherit(row)"
        >
          恢复继承
        </el-button>
      </template>
    </ProTable>

    <ApkMessageTemplateModal ref="modalRef" @submit="refreshTableList" />
    <DetailModal ref="detailModalRef" />
  </div>
</template>
