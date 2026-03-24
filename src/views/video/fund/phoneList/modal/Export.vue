<script setup lang="ts">
import type { CallRecord } from "@/api/interface";
import type { AcceptParamsOptions, FormData } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getCallRecordExportInfoApi, getCallRecordsExportApi } from "@/api/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";

/** 弹窗显隐。 */
const visible = ref(false);
/** 弹窗加载状态。 */
const loading = ref(false);
/** 导出中状态。 */
const exporting = ref(false);
/** 弹窗参数。 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});

/** 导出总条数。 */
const totalRecords = ref(0);
/** 导出总页数。 */
const totalPages = ref(0);
/** 当前选择导出页。 */
const selectedPage = ref(1);
/** 导出分页大小。 */
const pageSize = ref(10000);

/** 导出筛选条件。 */
const formData = reactive<FormData>({
  schoolId: 0,
  studentName: "",
  startTime: "",
  endTime: "",
  gradeId: null,
  departmentId: null,
  classId: null
});

/** 学校 ID 引用。 */
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

/** 导出页选项。 */
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
function buildFilterParams(): CallRecord.ReqGetCallRecordExportInfoApi {
  return {
    schoolId: formData.schoolId,
    studentName: formData.studentName || undefined,
    startTime: formData.startTime || undefined,
    endTime: formData.endTime || undefined,
    gradeId: formData.gradeId ?? undefined,
    departmentId: formData.departmentId ?? undefined,
    classId: formData.classId ?? undefined
  };
}

/**
 * 构建导出请求参数。
 * @returns 导出请求参数
 */
function buildExportParams(): CallRecord.ReqExportCallRecordsApi {
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
    const result = await getCallRecordExportInfoApi(buildFilterParams());

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
 * @param value 年级 ID
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
 * @param value 级部 ID
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

/**
 * 处理查询。
 * @returns Promise<void>
 */
async function handleSearch() {
  await axiosGetExportInfoApi();
}

/**
 * 处理导出。
 * @returns Promise<void>
 */
async function handleExport() {
  if (totalRecords.value === 0) return;

  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const response = await getCallRecordsExportApi(buildExportParams());
    const blob = new Blob([response], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "通话记录.xlsx");
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
async function acceptParams(options: AcceptParamsOptions) {
  parameter.value = { ...parameter.value, ...options };

  formData.schoolId = options.schoolId;
  formData.studentName = options.studentName || "";
  formData.startTime = options.startTime || "";
  formData.endTime = options.endTime || "";
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
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="export-container">
      <el-form :model="formData">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学生姓名">
              <el-input v-model="formData.studentName" placeholder="请输入学生姓名" clearable />
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
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                placeholder="选择开始时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                placeholder="选择结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
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
          <el-select v-model="selectedPage" placeholder="请选择导出批次" style="width: 220px">
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
