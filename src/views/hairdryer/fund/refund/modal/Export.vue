<script setup lang="ts">
import type { Refund } from "@/api/interface";
import type { AcceptParamsOptions, FormData } from "../types";

import { reactive, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { getRefundExportInfoApi, getRefundsExportApi } from "@/api/modules";
import { DEVICE_TYPE, REFUND_CATEGORY, REFUND_STATUS_OPTIONS } from "@/config/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";

const visible = ref(false);
const loading = ref(false);
const exporting = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});

const totalRecords = ref(0);
const totalPages = ref(0);
const selectedPage = ref(1);
const pageSize = ref(10000);

const formData = reactive<FormData>({
  schoolId: 0,
  studentKeyword: "",
  refundNo: "",
  status: null,
  startDate: "",
  endDate: "",
  gradeId: null,
  departmentId: null,
  classId: null
});

const schoolIdRef = computed(() => formData.schoolId);
const {
  gradeOptions,
  departmentOptions,
  classOptions,
  loadGradeOptions,
  loadDepartmentOptions,
  loadClassOptions,
  handleGradeCascade,
  handleDepartmentCascade
} = useGradeDepartmentClassOptions({
  schoolId: schoolIdRef,
  requestOptions: {
    department: { loading: false },
    class: { loading: false }
  }
});

const pageOptions = computed(() => {
  if (!totalRecords.value || !totalPages.value) return [];
  return Array.from({ length: totalPages.value }, (_, index) => {
    const page = index + 1;
    const start = (page - 1) * pageSize.value + 1;
    const end = Math.min(page * pageSize.value, totalRecords.value);
    return {
      value: page,
      label: `第 ${page} 批（${start} - ${end} 条）`
    };
  });
});

/** 构建请求参数 */
function buildRequestParams(): Refund.ReqGetRefundsApi {
  return {
    schoolId: formData.schoolId,
    deviceType: DEVICE_TYPE.DRYER,
    refundCategory: REFUND_CATEGORY.BALANCE,
    studentKeyword: formData.studentKeyword || undefined,
    refundNo: formData.refundNo || undefined,
    status: formData.status ?? undefined,
    startDate: formData.startDate || undefined,
    endDate: formData.endDate || undefined,
    gradeId: formData.gradeId ?? -1,
    departmentId: formData.departmentId ?? -1,
    classId: formData.classId ?? -1,
    page: selectedPage.value,
    pageSize: pageSize.value
  };
}
/** 获取导出信息 */
async function axiosGetExportInfo() {
  loading.value = true;
  try {
    const result = await getRefundExportInfoApi(buildRequestParams());
    if (result.code === 0) {
      totalRecords.value = result.data.totalRecords;
      totalPages.value = result.data.totalPages;
      pageSize.value = result.data.pageSize || 10000;
      selectedPage.value = 1;
    }
    return result;
  } catch (error) {
    console.error("axiosGetExportInfo:", error);
    return { code: -1, data: null };
  } finally {
    loading.value = false;
  }
}
/** 处理年级变更 */
async function handleGradeChange(value: number | null) {
  await handleGradeCascade({
    gradeId: value,
    reset: () => {
      formData.departmentId = null;
      formData.classId = null;
    }
  });
}
/** 处理级部变更 */
async function handleDepartmentChange(value: number | null) {
  await handleDepartmentCascade({
    gradeId: formData.gradeId,
    departmentId: value,
    reset: () => {
      formData.classId = null;
    }
  });
}
/** 处理查询 */
function handleSearch() {
  axiosGetExportInfo();
}
/** 处理导出 */
async function handleExport() {
  if (totalRecords.value === 0) return;

  exporting.value = true;
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "info",
    duration: 0
  });

  try {
    const response = await getRefundsExportApi(buildRequestParams());

    const blob = new Blob([response as any], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "退款记录_吹风机.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);

    visible.value = false;
    ElNotification.closeAll();
    ElNotification({
      title: "成功",
      message: "导出成功",
      type: "success"
    });
  } catch (error) {
    console.error("handleExport:", error);
    ElNotification.closeAll();
    ElNotification({
      title: "错误",
      message: "导出失败，请重试",
      type: "error"
    });
  } finally {
    exporting.value = false;
  }
}
/** 接收参数 */
async function acceptParams(options: AcceptParamsOptions) {
  parameter.value = { ...parameter.value, ...options };
  Object.assign(formData, {
    schoolId: options.schoolId,
    studentKeyword: options.studentKeyword || "",
    refundNo: options.refundNo || "",
    status: options.status ?? null,
    startDate: options.startDate || "",
    endDate: options.endDate || ""
  });
  formData.gradeId = options.gradeId != null && options.gradeId !== -1 ? Number(options.gradeId) : null;
  formData.departmentId = options.departmentId != null && options.departmentId !== -1 ? Number(options.departmentId) : null;
  formData.classId = options.classId != null && options.classId !== -1 ? Number(options.classId) : null;
  if (formData.gradeId == null) {
    formData.departmentId = null;
    formData.classId = null;
  } else if (formData.departmentId == null) {
    formData.classId = null;
  }

  gradeOptions.value = options.gradeOptions || [];
  departmentOptions.value = options.departmentOptions || [];
  classOptions.value = options.classOptions || [];

  if (!gradeOptions.value.length) {
    await loadGradeOptions();
  }
  if (formData.gradeId != null && !departmentOptions.value.length) {
    await loadDepartmentOptions(formData.gradeId);
  }
  if (formData.gradeId != null && formData.departmentId != null && !classOptions.value.length) {
    await loadClassOptions(formData.gradeId, formData.departmentId);
  }

  await axiosGetExportInfo();

  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="export-container">
      <el-form :model="formData">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学生信息">
              <el-input v-model="formData.studentKeyword" placeholder="请输入姓名/学号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退款单号">
              <el-input v-model="formData.refundNo" placeholder="请输入退款单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option v-for="item in REFUND_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择开始日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="选择结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级">
              <el-select
                v-model="formData.gradeId"
                placeholder="请选择年级"
                clearable
                style="width: 100%"
                @change="handleGradeChange"
              >
                <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级部">
              <el-select
                v-model="formData.departmentId"
                placeholder="请选择级部"
                clearable
                :disabled="!formData.gradeId"
                style="width: 100%"
                @change="handleDepartmentChange"
              >
                <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级">
              <el-select
                v-model="formData.classId"
                placeholder="请选择班级"
                clearable
                :disabled="!formData.gradeId || !formData.departmentId"
                style="width: 100%"
              >
                <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            符合条件共 <span class="text-primary">{{ totalRecords }}</span> 条数据
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
        :disabled="loading || totalRecords === 0"
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
