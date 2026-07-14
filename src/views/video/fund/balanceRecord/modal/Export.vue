<script setup lang="ts">
import type { BalanceRecord } from "@/api/interface";
import type { BalanceRecordExportAcceptParams, BalanceRecordExportFormData } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getBalanceRecordExportInfoApi, getBalanceRecordsExportApi } from "@/api/modules";
import { BALANCE_ACCOUNT_STATUS_OPTIONS, DEVICE_TYPE } from "@/config/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗加载状态 */
const loading = ref(false);
/** 导出中状态 */
const exporting = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});
/** 导出总条数 */
const totalRecords = ref(0);
/** 导出总页数 */
const totalPages = ref(0);
/** 当前选择导出页 */
const selectedPage = ref(1);
/** 导出分页大小 */
const pageSize = ref(10000);
/** 导出筛选条件 */
const formData = reactive<BalanceRecordExportFormData>({
  schoolId: 0,
  studentKeyword: "",
  studentUuid: "",
  minBalance: "",
  maxBalance: "",
  startDate: "",
  endDate: "",
  gradeId: null,
  departmentId: null,
  classId: null,
  status: null,
  deviceType: DEVICE_TYPE.VIDEO,
  exportFileName: "学生余额.xlsx"
});

/** 学校ID引用 */
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
/** 导出页选项 */
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

/**
 * 构建导出筛选参数。
 * @returns 导出筛选参数
 */
function buildFilterParams(): BalanceRecord.ReqGetBalanceRecordExportInfoApi {
  return {
    schoolId: formData.schoolId,
    deviceType: formData.deviceType,
    studentKeyword: formData.studentKeyword.trim() || undefined,
    studentUuid: formData.studentUuid.trim() || undefined,
    status: formData.status ?? undefined,
    gradeId: formData.gradeId ?? undefined,
    departmentId: formData.departmentId ?? undefined,
    classId: formData.classId ?? undefined,
    minBalance: formData.minBalance.trim() || undefined,
    maxBalance: formData.maxBalance.trim() || undefined,
    startDate: formData.startDate || undefined,
    endDate: formData.endDate || undefined
  };
}

/**
 * 构建导出请求参数。
 * @returns 导出请求参数
 */
function buildExportParams(): BalanceRecord.ReqGetBalanceRecordExportApi {
  return {
    ...buildFilterParams(),
    page: selectedPage.value,
    pageSize: pageSize.value
  };
}

/**
 * 获取导出信息。
 * @returns Promise<void>
 */
async function axiosGetExportInfoApi() {
  loading.value = true;
  try {
    const result = await getBalanceRecordExportInfoApi(buildFilterParams());
    if (result.code === 0) {
      totalRecords.value = result.data.totalRecords;
      totalPages.value = result.data.totalPages;
      pageSize.value = result.data.pageSize || 10000;
      selectedPage.value = 1;
      return;
    }
    totalRecords.value = 0;
    totalPages.value = 0;
  } catch (error) {
    console.error("axiosGetExportInfoApi:", error);
    totalRecords.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
}

/**
 * 处理年级切换。
 * @param value 年级ID
 * @returns Promise<void>
 */
async function handleGradeChange(value: number | null) {
  await handleGradeCascade({
    gradeId: value,
    reset: () => {
      formData.departmentId = null;
      formData.classId = null;
    }
  });
}

/**
 * 处理级部切换。
 * @param value 级部ID
 * @returns Promise<void>
 */
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
  axiosGetExportInfoApi();
}

/** 处理导出 */
async function handleExport() {
  if (totalRecords.value === 0) return;

  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const response = await getBalanceRecordsExportApi(buildExportParams());
    const blob = new Blob([response], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", formData.exportFileName);
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

/**
 * 接收弹窗参数。
 * @param options 参数
 * @returns Promise<void>
 */
async function acceptParams(options: BalanceRecordExportAcceptParams) {
  parameter.value = { ...parameter.value, ...options };

  formData.schoolId = options.schoolId;
  formData.deviceType = options.deviceType;
  formData.exportFileName = options.exportFileName;
  formData.studentKeyword = options.studentKeyword || "";
  formData.studentUuid = options.studentUuid || "";
  formData.status = options.status ?? null;
  formData.minBalance = options.minBalance || "";
  formData.maxBalance = options.maxBalance || "";
  formData.startDate = options.startDate || "";
  formData.endDate = options.endDate || "";
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

  await axiosGetExportInfoApi();
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="export-container">
      <el-form :model="formData">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学生信息">
              <el-input v-model="formData.studentKeyword" placeholder="请输入姓名/学号/UUID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生UUID">
              <el-input v-model="formData.studentUuid" placeholder="请输入学生UUID" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable class="w-full">
                <el-option
                  v-for="item in BALANCE_ACCOUNT_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可用余额下限">
              <el-input v-model="formData.minBalance" placeholder="请输入可用余额下限" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可用余额上限">
              <el-input v-model="formData.maxBalance" placeholder="请输入可用余额上限" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择开始日期"
                value-format="YYYY-MM-DD"
                class="w-full"
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
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级">
              <el-select v-model="formData.gradeId" placeholder="请选择年级" clearable class="w-full" @change="handleGradeChange">
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
                class="w-full"
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
                class="w-full"
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
          <el-select v-model="selectedPage" placeholder="请选择导出批次" class="w-[220px]">
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
  @apply px-[10px];
}
.export-settings {
  @apply flex items-center justify-between p-4 mt-2 bg-[#f8f9fb] border border-[#ebeef5] rounded;
  .settings-info {
    .text-muted {
      @apply text-[#606266];
    }
    .text-primary {
      @apply mx-1 text-lg font-bold text-[var(--el-color-primary)];
    }
  }
  .settings-control {
    @apply flex items-center;
    .label {
      @apply mr-2 text-sm text-[#606266];
    }
  }
}
.tip-text {
  @apply mt-2 text-xs text-[#909399];
}
</style>
