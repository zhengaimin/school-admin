<script setup lang="ts">
import type { PackagePurchaseExportAcceptParams, PackagePurchaseExportFormData, PackagePurchaseModalParams } from "../types";

import { reactive, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { getPackageRecordExportInfoApi, getPackageRecordsExportApi } from "@/api/modules";
import { PACKAGE_TYPE_OPTIONS, PACKAGE_RECORD_STATUS_OPTIONS, DEVICE_TYPE } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";
import { buildPackagePurchaseExportAcceptPayload, buildPackagePurchaseExportRequestParams } from "../utils/payload";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";

const visible = ref(false);
const loading = ref(false);
const exporting = ref(false);
const parameter = ref<PackagePurchaseModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});

const totalRecords = ref(0);
const totalPages = ref(0);
const selectedPage = ref(1);
const pageSize = ref(10000);

const formData = reactive<PackagePurchaseExportFormData>({
  schoolId: 0,
  studentKeyword: "",
  orderNo: "",
  startDate: "",
  endDate: "",
  gradeId: null,
  departmentId: null,
  classId: null,
  status: null,
  packageType: null,
  minPrice: undefined,
  maxPrice: undefined
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

/** 获取导出信息 */
async function axiosGetExportInfo() {
  loading.value = true;
  try {
    const result = await getPackageRecordExportInfoApi(
      buildPackagePurchaseExportRequestParams({
        formData,
        page: selectedPage.value,
        pageSize: pageSize.value,
        deviceType: DEVICE_TYPE.DRYER
      })
    );
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
    gradeId: isNullOrUnDef(value) ? null : value,
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
    departmentId: isNullOrUnDef(value) ? null : value,
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
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const response = await getPackageRecordsExportApi(
      buildPackagePurchaseExportRequestParams({
        formData,
        page: selectedPage.value,
        pageSize: pageSize.value,
        deviceType: DEVICE_TYPE.DRYER
      })
    );

    const blob = new Blob([response as any], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "套餐购买_吹风机.xlsx");
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

/** 接收参数 */
async function acceptParams(options: PackagePurchaseExportAcceptParams) {
  parameter.value = { ...parameter.value, ...options };
  const payload = buildPackagePurchaseExportAcceptPayload(options);

  Object.assign(formData, payload.formData);
  gradeOptions.value = payload.gradeOptions;
  departmentOptions.value = payload.departmentOptions;
  classOptions.value = payload.classOptions;

  if (!gradeOptions.value.length) {
    await loadGradeOptions();
  }
  if (!isNullOrUnDef(formData.gradeId) && !departmentOptions.value.length) {
    await loadDepartmentOptions(formData.gradeId);
  }
  if (!isNullOrUnDef(formData.gradeId) && !isNullOrUnDef(formData.departmentId) && !classOptions.value.length) {
    await loadClassOptions(formData.gradeId, formData.departmentId);
  }

  await axiosGetExportInfo();

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
              <el-input v-model="formData.studentKeyword" placeholder="请输入姓名/学号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="formData.orderNo" placeholder="请输入订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐类型">
              <el-select v-model="formData.packageType" placeholder="请选择套餐类型" clearable class="w-full">
                <el-option v-for="item in PACKAGE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable class="w-full">
                <el-option
                  v-for="item in PACKAGE_RECORD_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低价格">
              <el-input-number v-model="formData.minPrice" :min="0" placeholder="最低价格" class="w-full" :controls="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高价格">
              <el-input-number v-model="formData.maxPrice" :min="0" placeholder="最高价格" class="w-full" :controls="false" />
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
          <el-select v-model="selectedPage" placeholder="请选择导出批次" class="w-[200px]">
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
