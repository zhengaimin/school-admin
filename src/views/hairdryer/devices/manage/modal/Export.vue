<script setup lang="ts">
import type { DeviceBase, ResultData } from "@/api/interface";
import type { AcceptParamsOptions, FormData } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getDeviceBaseExportInfoApi, postDeviceBaseExportApi } from "@/api/modules";
import { DEVICE_TYPE, VENDOR_CODE, DEVICE_STATUS_OPTIONS } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const exporting = ref(false);
const parameter = ref({
  title: "",
  type: "View" as "Add" | "Edit" | "View",
  showConfirm: true
});

const total = ref(0);
const selectedPage = ref(1);
const pageSize = ref(10000);

const formData = reactive<FormData>({
  schoolId: undefined,
  deviceSn: "",
  status: null
});

const totalPages = computed(() => (total.value ? Math.ceil(total.value / pageSize.value) : 0));
const pageOptions = computed(() => {
  if (!total.value || !totalPages.value) return [];
  return Array.from({ length: totalPages.value }, (_, index) => {
    const page = index + 1;
    const start = (page - 1) * pageSize.value + 1;
    const end = Math.min(page * pageSize.value, total.value);
    return {
      value: page,
      label: `第 ${page} 批（${start} - ${end} 条）`
    };
  });
});

/** 构建查询参数 */
function buildBaseParams(): DeviceBase.ReqGetDeviceBaseExportInfoApi {
  return {
    vendorCode: VENDOR_CODE.XINGRI,
    deviceType: DEVICE_TYPE.DRYER,
    deviceSn: formData.deviceSn || undefined,
    schoolId: formData.schoolId || undefined,
    status: formData.status ?? undefined
  };
}

/** 构建导出参数 */
function buildExportParams(): DeviceBase.ReqPostDeviceBaseExportApi {
  return {
    ...buildBaseParams(),
    page: selectedPage.value,
    pageSize: pageSize.value
  };
}

/** 获取导出信息 */
async function axiosGetDeviceBaseExportInfoApi(): Promise<ResultData<DeviceBase.ResGetDeviceBaseExportInfoApi | null>> {
  loading.value = true;
  try {
    const result = await getDeviceBaseExportInfoApi(buildBaseParams());
    if (result.code === 0) {
      total.value = result.data.total || 0;
      selectedPage.value = 1;
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceBaseExportInfoApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  } finally {
    loading.value = false;
  }
}

/** 导出设备 */
async function axiosPostDeviceBaseExportApi(params: DeviceBase.ReqPostDeviceBaseExportApi): Promise<ResultData<Blob | null>> {
  try {
    const result = await postDeviceBaseExportApi(params);
    return { code: 0, msg: "success", data: result };
  } catch (error) {
    console.error("axiosPostDeviceBaseExportApi:", error);
    return { code: -1, msg: "导出失败，请重试", data: null };
  }
}

async function acceptParams(
  params: { title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean },
  row?: AcceptParamsOptions
) {
  parameter.value = { ...parameter.value, ...params };
  const options = row || {};
  formData.schoolId = options.schoolId;
  formData.deviceSn = options.deviceSn || "";
  formData.status = options.status ?? null;
  selectedPage.value = 1;
  await axiosGetDeviceBaseExportInfoApi();
  visible.value = true;
}

/** 查询 */
function handleSearch() {
  axiosGetDeviceBaseExportInfoApi();
}
/** 导出 */
async function handleExport() {
  if (total.value === 0) return;

  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const result = await axiosPostDeviceBaseExportApi(buildExportParams());
    if (result.code !== 0 || !result.data) {
      ElNotification.closeAll();
      ElNotification({ title: "错误", message: result.msg || "导出失败，请重试", type: "error" });
      return;
    }
    const blob = new Blob([result.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "设备导出_吹风机.xlsx");
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
            <el-form-item label="设备序列号">
              <el-input v-model="formData.deviceSn" placeholder="请输入设备序列号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable style="width: 100%">
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
        <div class="settings-control">
          <span class="label">导出范围：</span>
          <el-select v-model="selectedPage" placeholder="请选择导出批次" style="width: 200px">
            <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="tip-text">* 为保证导出性能，单次限制导出 {{ pageSize }} 条数据</div>
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
  .settings-control {
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
      font-size: 14px;
      color: #606266;
    }
  }
}
.tip-text {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
