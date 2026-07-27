<script setup lang="ts">
import type { Device as DeviceVideo } from "@/api/interface";
import type { AcceptParamsOptions, FormData } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getDeviceListApi, postDeviceExportApi } from "@/api/modules";
import { DEVICE_STATUS_OPTIONS } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const exporting = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});

const total = ref(0);

const formData = reactive<FormData>({
  schoolId: undefined,
  name: "",
  terminalSn: "",
  status: null
});

const buildExportParams = (): DeviceVideo.ReqPostDeviceExportApi => ({
  name: formData.name || undefined,
  terminalSn: formData.terminalSn || undefined,
  schoolId: formData.schoolId || undefined,
  status: formData.status ?? undefined
});

const listParams = computed(() => ({
  ...buildExportParams(),
  page: 1,
  pageSize: 1
}));

/** 获取导出信息 */
async function axiosGetExportInfo() {
  loading.value = true;
  try {
    const result = await getDeviceListApi(listParams.value);
    if (result.code === 0) {
      total.value = result.data.total || 0;
    }
  } catch (error) {
    console.error("axiosGetExportInfo:", error);
  } finally {
    loading.value = false;
  }
}

/** 查询 */
function handleSearch() {
  axiosGetExportInfo();
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: AcceptParamsOptions) {
  parameter.value = { ...parameter.value, ...params };
  const options = row || {};
  formData.schoolId = options.schoolId;
  formData.name = options.name || "";
  formData.terminalSn = options.terminalSn || "";
  formData.status = options.status ?? null;
  await axiosGetExportInfo();
  visible.value = true;
}

/** 导出 */
async function handleExport() {
  if (total.value === 0) return;

  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const response = await postDeviceExportApi(buildExportParams());
    const blob = new Blob([response as any], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "设备导出_视频话机.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);

    visible.value = false;
    ElNotification.closeAll();
    ElNotification({ title: "成功", message: "导出成功", type: "success" });
  } catch (error) {
    console.error("handleExport:", error);
    ElNotification.closeAll();
    ElNotification({ title: "错误", message: "导出失败，请重试", type: "error" });
  } finally {
    exporting.value = false;
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="export-container">
      <el-form :model="formData">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="设备SN号">
              <el-input v-model="formData.terminalSn" placeholder="请输入设备SN号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input v-model="formData.name" placeholder="请输入设备名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable class="w-full">
                <el-option v-for="item in DEVICE_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <div class="export-settings">
        <div class="settings-info">
          <span class="text-muted">
            符合条件共 <span class="text-primary">{{ total }}</span> 条数据
          </span>
        </div>
      </div>
      <div class="tip-text">* 导出数据量较大时可能需要等待，请勿关闭页面</div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        v-if="parameter.showConfirm"
        type="primary"
        :loading="exporting"
        :disabled="loading || total === 0"
        @click="handleExport"
      >
        导出
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.export-container {
  padding: 0 10px;
}
.export-settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-top: 8px;
  background-color: #f8f9fb;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  .settings-info {
    .text-muted {
      color: #606266;
    }
    .text-primary {
      margin: 0 4px;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-primary);
    }
  }
}
.tip-text {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
