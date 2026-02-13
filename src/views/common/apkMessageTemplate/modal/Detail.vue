<script setup lang="ts">
import type { Common } from "@/api/interface";

import { ref } from "vue";
import { getApkMessageTemplateDetailApi } from "@/api/modules";
import {
  APK_MESSAGE_TEMPLATE_CATEGORY_I18N,
  APK_MESSAGE_TEMPLATE_SCOPE_I18N,
  type TApkMessageTemplateCategoryValue,
  type TApkMessageTemplateScopeValue
} from "@/config/modules";
import { formatTimestamp } from "@/hooks/useManage";

/** 弹窗可见 */
const visible = ref(false);
/** 详情数据 */
const detail = ref<Common.IApkMessageTemplateDetailVo | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/** 格式化作用域文案 */
function formatScope(scope?: TApkMessageTemplateScopeValue) {
  if (!scope) return "--";
  return APK_MESSAGE_TEMPLATE_SCOPE_I18N[scope] || "--";
}

/** 格式化分类文案 */
function formatCategory(category?: TApkMessageTemplateCategoryValue) {
  if (!category) return "--";
  return APK_MESSAGE_TEMPLATE_CATEGORY_I18N[category] || "--";
}

/** 格式化时间 */
function formatDateTime(value?: string) {
  return formatTimestamp(value, "YYYY-MM-DD HH:mm:ss") || "--";
}

/** 获取详情 */
async function axiosGetApkMessageTemplateDetailApi(id: number) {
  try {
    return await getApkMessageTemplateDetailApi(id);
  } catch (error) {
    console.error("axiosGetApkMessageTemplateDetailApi:", error);
    return { code: -1, data: null };
  }
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: Common.IApkMessageTemplateItemVo) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  if (!row?.id) return;
  const result = await axiosGetApkMessageTemplateDetailApi(row.id);
  if (result.code === 0) {
    detail.value = result.data;
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="900px" destroy-on-close draggable align-center>
    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="语义键">{{ detail.shrgKey || "--" }}</el-descriptions-item>
      <el-descriptions-item label="渠道">{{ detail.channel || "--" }}</el-descriptions-item>
      <el-descriptions-item label="分类">{{ formatCategory(detail.category) }}</el-descriptions-item>
      <el-descriptions-item label="作用域">{{ formatScope(detail.scope) }}</el-descriptions-item>
      <el-descriptions-item label="当前生效作用域">{{ formatScope(detail.effectiveScope) }}</el-descriptions-item>
      <el-descriptions-item label="启用状态">
        <el-tag :type="detail.isEnabled ? 'success' : 'info'">
          {{ detail.isEnabled ? "启用" : "禁用" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="版本号">{{ detail.version ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ formatDateTime(detail.updatedAt) }}</el-descriptions-item>
      <el-descriptions-item label="错误话术" :span="2">
        <div class="whitespace-pre-wrap break-all">{{ detail.message || "--" }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="说明" :span="2">
        <div class="whitespace-pre-wrap break-all">{{ detail.description || "--" }}</div>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
