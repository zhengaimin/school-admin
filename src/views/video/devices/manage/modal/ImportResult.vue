<script setup lang="ts">
import { computed, toRefs } from "vue";
import { ElMessage } from "element-plus";
import http from "@/api";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import type { DeviceImportResult } from "../types";

const props = defineProps<{
  modelValue: boolean;
  result: DeviceImportResult;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const { result } = toRefs(props);
const { getUploadPath } = useAssetsPath();

const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
});

const canDownloadFailureExcel = computed(() => result.value.failCount > 0);

function getDefaultFailureFileName() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `设备导入失败明细-${year}${month}${day}.xls`;
}

function sanitizeExcelCell(value: unknown) {
  let text = String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\t/g, " ");
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  return text;
}

function downloadByBlob(content: string, filename: string) {
  const blob = new Blob([`\uFEFF${content}`], { type: "application/vnd.ms-excel;charset=utf-8" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

async function downloadFailureExcel() {
  if (result.value.failureFileUrl) {
    try {
      const downloadUrl = getUploadPath(result.value.failureFileUrl);
      const blob = await http.get(downloadUrl, {}, { responseType: "blob", loading: false, cancel: false });
      if (blob.type.includes("text/html")) {
        throw new Error("remote download returned html");
      }
      const filename = result.value.failureFileName || getDefaultFailureFileName();
      downloadBlob(blob, filename);
      return;
    } catch (error) {
      console.error("downloadFailureExcel remote:", error);
      ElMessage.warning("远程错误文件下载失败，已切换本地失败明细下载");
    }
  }

  if (!result.value.failures.length) {
    ElMessage.warning("暂无可下载的失败记录");
    return;
  }

  const headers = ["行号", "设备SN", "名称", "失败原因"];
  const rows = result.value.failures.map(item => [
    sanitizeExcelCell(item.rowIndex),
    sanitizeExcelCell(item.terminalSn || item.deviceSn || ""),
    sanitizeExcelCell(item.name || ""),
    sanitizeExcelCell(item.reason)
  ]);
  const content = [headers, ...rows].map(row => row.join("\t")).join("\n");
  downloadByBlob(content, result.value.failureFileName || getDefaultFailureFileName());
}
</script>

<template>
  <el-dialog v-model="visible" title="导入结果" width="760px">
    <el-alert
      :title="`成功：${result.successCount} 条，失败：${result.failCount} 条`"
      :type="result.failCount > 0 ? 'warning' : 'success'"
      :closable="false"
      show-icon
      class="mb-4"
    />
    <el-table v-if="result.failCount > 0" :data="result.failures" border max-height="400">
      <el-table-column prop="rowIndex" label="行号" width="80" align="center" />
      <el-table-column prop="terminalSn" label="设备SN" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="reason" label="失败原因" min-width="200" show-overflow-tooltip />
    </el-table>
    <template #footer>
      <el-button v-if="canDownloadFailureExcel" type="warning" @click="downloadFailureExcel">下载错误Excel</el-button>
      <el-button type="primary" @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
