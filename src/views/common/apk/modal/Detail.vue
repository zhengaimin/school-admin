<script setup lang="ts">
import type { Common } from "@/api/interface";

import { ref } from "vue";
import { getApkPackageDetailApi } from "@/api/modules";
import { formatTimestamp } from "@/hooks/useManage";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import { APK_PACKAGE_STATUS_I18N, APK_TERMINAL_TYPE_I18N } from "@/config/modules";

/** 弹窗可见 */
const visible = ref(false);
/** 详情数据 */
const detail = ref<Common.IApkPackageDetailVo | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
const { getUploadPath } = useAssetsPath();

/** 格式化文件大小 */
function formatFileSize(fileSize?: number) {
  if (!fileSize || Number(fileSize) <= 0) return "--";
  const size = Number(fileSize);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
function formatDateTime(value?: string) {
  return formatTimestamp(value, "YYYY-MM-DD HH:mm:ss") || "--";
}
function formatDownloadUrl(value?: string) {
  if (!value) return "--";
  return getUploadPath(value) || "--";
}

/** 获取详情 */
async function axiosGetApkPackageDetailApi(id: number) {
  try {
    return await getApkPackageDetailApi(id);
  } catch (error) {
    console.error("axiosGetApkPackageDetailApi:", error);
    return { code: -1, data: null };
  }
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: Common.IApkPackageItemVo) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  if (!row?.id) return;
  const result = await axiosGetApkPackageDetailApi(row.id);
  if (result.code === 0) {
    detail.value = result.data;
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="860px" destroy-on-close draggable align-center>
    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="终端类型">
        {{ detail.terminalType ? APK_TERMINAL_TYPE_I18N[detail.terminalType] : "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        {{ detail.status ? APK_PACKAGE_STATUS_I18N[detail.status] : "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="包名">{{ detail.packageName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="版本名称">{{ detail.versionName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="版本号">{{ detail.versionCode || "--" }}</el-descriptions-item>
      <el-descriptions-item label="文件大小">{{ formatFileSize(detail.fileSize) }}</el-descriptions-item>
      <el-descriptions-item label="发布时间">{{ formatDateTime(detail.publishedAt) }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatDateTime(detail.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ formatDateTime(detail.updatedAt) }}</el-descriptions-item>
      <el-descriptions-item label="校验值" :span="2">{{ detail.checksum || "--" }}</el-descriptions-item>
      <el-descriptions-item label="下载地址" :span="2">{{ formatDownloadUrl(detail.downloadUrl) }}</el-descriptions-item>
      <el-descriptions-item label="更新日志" :span="2">
        <div class="whitespace-pre-wrap break-all">{{ detail.changelog || "--" }}</div>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
