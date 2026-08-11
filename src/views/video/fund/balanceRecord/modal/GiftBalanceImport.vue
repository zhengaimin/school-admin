<!-- 赠费余额导入弹窗，负责 Excel 上传与导入结果展示。 -->
<script setup lang="ts">
import type { GiftBalance, ResultData } from "@/api/interface";
import type { UploadInstance, UploadRequestOptions } from "element-plus";
import type { GiftBalanceImportAcceptParams } from "../types";

import { computed, nextTick, ref } from "vue";
import { Download, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import http from "@/api";
import { postGiftBalanceImportApi } from "@/api/modules";
import { DEVICE_TYPE } from "@/config/modules";
import { useAssetsPath } from "@/hooks/useAssetsPath";

const emit = defineEmits<{
  submit: [];
}>();

const { getUploadPath } = useAssetsPath();

/** 弹窗显隐。 */
const visible = ref(false);
/** 导入中状态。 */
const importing = ref(false);
/** 下载失败文件状态。 */
const downloading = ref(false);
/** 上传组件引用。 */
const uploadFileRef = ref<UploadInstance>();
/** 当前设备类型。 */
const deviceType = ref<GiftBalance.TGiftBalanceDeviceTypeValue>(DEVICE_TYPE.VIDEO);
/** 导入结果。 */
const result = ref<GiftBalance.ResPostGiftBalanceImportApi | null>(null);
/** 弹窗参数。 */
const parameter = ref<TModalParams>({
  title: "导入赠费余额",
  type: "View",
  showConfirm: false
});
/** 是否存在失败记录。 */
const hasFailure = computed(() => Boolean(result.value?.failCount));
/** 根据导入状态切换弹窗宽度。 */
const dialogWidth = computed(() => (result.value?.failCount ? "1120px" : "640px"));

/** 获取默认失败文件名。 */
function getDefaultFailureFileName() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `赠费余额导入失败明细-${date}.xls`;
}

/** 清理导出单元格中的危险字符。 */
function sanitizeExcelCell(value: unknown) {
  let text = String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\t/g, " ");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return text;
}

/** 下载二进制文件。 */
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

/** 根据失败列表生成本地明细文件。 */
function downloadLocalFailureFile(failList: GiftBalance.IGiftBalanceImportFailureVo[], filename: string) {
  const headers = ["行号", "学生UUID", "学生姓名", "学号", "设备类型", "当前赠费余额", "目标赠费余额", "失败原因"];
  const rows = failList.map(item => [
    sanitizeExcelCell(item.row),
    sanitizeExcelCell(item.studentUuid),
    sanitizeExcelCell(item.studentName),
    sanitizeExcelCell(item.studentCode),
    sanitizeExcelCell(item.deviceType),
    sanitizeExcelCell(item.currentGiftBalance),
    sanitizeExcelCell(item.targetGiftBalance),
    sanitizeExcelCell(item.reason)
  ]);
  const content = [headers, ...rows].map(row => row.join("\t")).join("\n");
  const blob = new Blob([`\uFEFF${content}`], { type: "application/vnd.ms-excel;charset=utf-8" });
  downloadBlob(blob, filename);
}

/** 导入赠费余额文件。 */
async function axiosPostGiftBalanceImportApi(file: File): Promise<ResultData<GiftBalance.ResPostGiftBalanceImportApi | null>> {
  try {
    return await postGiftBalanceImportApi({ deviceType: deviceType.value }, file);
  } catch (error) {
    console.error("axiosPostGiftBalanceImportApi:", error);
    return { code: -1, msg: "导入失败，请重试", data: null };
  }
}

/** 校验上传文件。 */
function handleBeforeUpload(file: File) {
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    ElMessage.error("请上传 xls 或 xlsx 格式的文件");
    return false;
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过 10MB");
    return false;
  }
  return true;
}

/** 上传赠费余额文件。 */
async function handleUploadImport(options: UploadRequestOptions) {
  importing.value = true;
  try {
    const response = await axiosPostGiftBalanceImportApi(options.file as File);
    const isSuccess = (response.code === 0 || response.code === 200) && Boolean(response.data);
    if (isSuccess) {
      handleImportSuccess(response);
      options.onSuccess?.(response);
      return;
    }
    handleImportSuccess(response);
    const uploadError = new Error(response.msg || "导入失败，请重试") as Parameters<UploadRequestOptions["onError"]>[0];
    uploadError.status = 0;
    uploadError.method = options.method;
    uploadError.url = options.action;
    options.onError?.(uploadError);
  } catch (error) {
    console.error("handleUploadImport:", error);
    ElMessage.error(error instanceof Error ? error.message : "导入失败，请重试");
    const uploadError = (error instanceof Error ? error : new Error("上传失败")) as Parameters<
      UploadRequestOptions["onError"]
    >[0];
    uploadError.status = 0;
    uploadError.method = options.method;
    uploadError.url = options.action;
    options.onError?.(uploadError);
  } finally {
    importing.value = false;
  }
}

/** 处理导入结果。 */
function handleImportSuccess(response: ResultData<GiftBalance.ResPostGiftBalanceImportApi | null>) {
  const isSuccessCode = response.code === undefined || response.code === 0 || response.code === 200;
  if (!response?.data || !isSuccessCode) {
    ElMessage.error(response?.msg || "导入失败，请重试");
    return;
  }

  result.value = {
    ...response.data,
    failList: response.data.failList || []
  };
  if (response.data.successCount > 0) emit("submit");
  if (response.data.failCount > 0) {
    ElMessage.warning(`导入完成，失败 ${response.data.failCount} 条，请下载失败明细`);
  } else {
    ElMessage.success(`导入完成，成功更新 ${response.data.successCount} 条，跳过 ${response.data.skipCount} 条`);
  }
}

/** 下载导入失败文件。 */
async function handleDownloadFailureFile() {
  if (!result.value?.failCount) {
    ElMessage.warning("暂无失败记录");
    return;
  }

  const filename = result.value.failureFileName || getDefaultFailureFileName();
  if (!result.value.failureFileUrl) {
    downloadLocalFailureFile(result.value.failList, filename);
    return;
  }

  downloading.value = true;
  try {
    const downloadUrl = getUploadPath(result.value.failureFileUrl);
    const blob = await http.get(downloadUrl, {}, { responseType: "blob", loading: false, cancel: false });
    if (blob.type.includes("text/html")) throw new Error("remote download returned html");
    downloadBlob(blob, filename);
  } catch (error) {
    console.error("handleDownloadFailureFile:", error);
    ElMessage.warning("失败文件下载失败，已切换本地失败明细下载");
    downloadLocalFailureFile(result.value.failList, filename);
  } finally {
    downloading.value = false;
  }
}

/** 重新上传文件。 */
function handleRetryImport() {
  result.value = null;
  nextTick(() => uploadFileRef.value?.clearFiles());
}

/** 接收弹窗参数。 */
async function acceptParams(options: GiftBalanceImportAcceptParams) {
  parameter.value = { ...parameter.value, ...options };
  deviceType.value = options.deviceType;
  result.value = null;
  visible.value = true;
  await nextTick();
  uploadFileRef.value?.clearFiles();
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" :width="dialogWidth" destroy-on-close draggable align-center>
    <div v-loading="importing">
      <template v-if="!result">
        <el-alert
          title="目标赠费余额为空不更新，填写 0 表示清零；下调金额不能超过账户可用余额。"
          type="info"
          :closable="false"
          show-icon
          class="mb-4"
        />
        <el-upload
          ref="uploadFileRef"
          class="gift-balance-upload"
          action="#"
          accept=".xls,.xlsx"
          :drag="true"
          :http-request="handleUploadImport"
          :before-upload="handleBeforeUpload"
          :limit="1"
          :show-file-list="false"
        >
          <div
            class="flex h-[150px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50"
          >
            <el-icon class="text-3xl text-gray-400"><UploadFilled /></el-icon>
            <p class="mt-2 text-sm text-gray-500">将文件拖到此处，或点击上传赠费余额更新 Excel</p>
          </div>
        </el-upload>
      </template>

      <template v-else>
        <el-alert
          :title="`导入完成：成功 ${result.successCount} 条，跳过 ${result.skipCount} 条，失败 ${result.failCount} 条`"
          :type="result.failCount > 0 ? 'warning' : 'success'"
          :closable="false"
          show-icon
          class="mb-4"
        />
        <el-descriptions :column="2" border class="mb-4">
          <el-descriptions-item label="总行数">{{ result.totalCount }}</el-descriptions-item>
          <el-descriptions-item label="成功更新">{{ result.successCount }}</el-descriptions-item>
          <el-descriptions-item label="跳过">{{ result.skipCount }}</el-descriptions-item>
          <el-descriptions-item label="失败">{{ result.failCount }}</el-descriptions-item>
        </el-descriptions>
        <el-table v-if="hasFailure" :data="result.failList" border max-height="420">
          <el-table-column prop="row" label="Excel行号" width="90" align="center" />
          <el-table-column prop="studentName" label="学生姓名" width="110" />
          <el-table-column prop="studentCode" label="学号" width="130" />
          <el-table-column prop="studentUuid" label="学生UUID" min-width="180" />
          <el-table-column prop="currentGiftBalance" label="当前赠费余额" width="130" />
          <el-table-column prop="targetGiftBalance" label="目标赠费余额" width="130" />
          <el-table-column prop="reason" label="失败原因" min-width="220" show-overflow-tooltip />
        </el-table>
        <el-empty v-else description="本次导入没有失败记录" :image-size="80" />
      </template>
    </div>

    <template #footer>
      <template v-if="result">
        <el-button v-if="hasFailure" type="warning" :icon="Download" :loading="downloading" @click="handleDownloadFailureFile">
          下载失败Excel
        </el-button>
        <el-button type="primary" :icon="UploadFilled" @click="handleRetryImport">重新上传</el-button>
      </template>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.gift-balance-upload {
  :deep(.el-upload) {
    @apply w-full;
  }
}
</style>
