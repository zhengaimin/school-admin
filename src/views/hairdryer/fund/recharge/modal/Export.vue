<script setup lang="ts">
import type { Payment } from "@/api/interface";

import { reactive, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import {
  getPaymentExportInfoApi,
  exportPaymentsApi,
  getGradesApi,
  getDepartmentsListApi,
  getClassesListApi
} from "@/api/modules";
import { DEVICE_TYPE } from "@/config/modules";

interface OptionItem {
  label: string;
  value: number;
}
interface FormData {
  schoolId: number;
  studentKeyword: string;
  orderNo: string;
  startDate: string;
  endDate: string;
  gradeId: number | null;
  departmentId: number | null;
  classId: number | null;
}
export interface AcceptParamsOptions {
  schoolId: number;
  studentKeyword?: string;
  orderNo?: string;
  startDate?: string;
  endDate?: string;
  gradeId?: number | null;
  departmentId?: number | null;
  classId?: number | null;
  gradeOptions?: OptionItem[];
  departmentOptions?: OptionItem[];
  classOptions?: OptionItem[];
}

const visible = ref(false);
const loading = ref(false);
const exporting = ref(false);

const totalRecords = ref(0);
const totalPages = ref(0);
const selectedPage = ref(1);
const pageSize = ref(10000);

const formData = reactive<FormData>({
  schoolId: 0,
  studentKeyword: "",
  orderNo: "",
  startDate: "",
  endDate: "",
  gradeId: null,
  departmentId: null,
  classId: null
});

const gradeOptions = ref<OptionItem[]>([]);
const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

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
const buildRequestParams = (): Payment.ReqGetPaymentsApi => ({
  schoolId: formData.schoolId,
  deviceType: DEVICE_TYPE.DRYER,
  studentKeyword: formData.studentKeyword || undefined,
  orderNo: formData.orderNo || undefined,
  startDate: formData.startDate || undefined,
  endDate: formData.endDate || undefined,
  gradeId: formData.gradeId ?? -1,
  departmentId: formData.departmentId ?? -1,
  classId: formData.classId ?? -1,
  page: selectedPage.value,
  pageSize: pageSize.value
});
/** 获取导出信息 */
const axiosGetExportInfo = async () => {
  loading.value = true;
  try {
    const result = await getPaymentExportInfoApi(buildRequestParams());
    if (result.code === 0) {
      totalRecords.value = result.data.totalRecords;
      totalPages.value = result.data.totalPages;
      pageSize.value = result.data.pageSize || 10000;
      selectedPage.value = 1;
    }
  } catch (error) {
    console.error("axiosGetExportInfo:", error);
  } finally {
    loading.value = false;
  }
};
/** 获取年级列表 */
const axiosGetGradeOptions = async () => {
  try {
    const result = await getGradesApi({ schoolId: formData.schoolId, page: 1, pageSize: 200 });
    if (result.code === 0) {
      gradeOptions.value = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    }
  } catch (error) {
    console.error("axiosGetGradeOptions:", error);
  }
};
/** 获取级部列表 */
const axiosGetDepartmentOptions = async (gradeId: number) => {
  try {
    const result = await getDepartmentsListApi(
      { schoolId: formData.schoolId, gradeId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      departmentOptions.value = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    }
  } catch (error) {
    console.error("axiosGetDepartmentOptions:", error);
  }
};
/** 获取班级列表 */
const axiosGetClassOptions = async (gradeId: number, departmentId: number) => {
  try {
    const result = await getClassesListApi(
      { schoolId: formData.schoolId, gradeId, departmentId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      classOptions.value = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
    }
  } catch (error) {
    console.error("axiosGetClassOptions:", error);
  }
};

/** 处理年级变更 */
const handleGradeChange = async (value: number | null) => {
  formData.departmentId = null;
  formData.classId = null;
  departmentOptions.value = [];
  classOptions.value = [];

  if (value != null) {
    await axiosGetDepartmentOptions(value);
  }
};
/** 处理级部变更 */
const handleDepartmentChange = async (value: number | null) => {
  formData.classId = null;
  classOptions.value = [];

  if (formData.gradeId != null && value != null) {
    await axiosGetClassOptions(formData.gradeId, value);
  }
};
/** 处理查询 */
const handleSearch = () => {
  axiosGetExportInfo();
};
/** 处理导出 */
const handleExport = async () => {
  if (totalRecords.value === 0) return;

  exporting.value = true;
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "info",
    duration: 0
  });

  try {
    const response = await exportPaymentsApi(buildRequestParams());

    const blob = new Blob([response as any], {
      type: "application/vnd.ms-excel;charset=utf-8"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "充值记录_吹风机.xlsx");
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
    console.error("onExport:", error);
    ElNotification.closeAll();
    ElNotification({
      title: "错误",
      message: "导出失败，请重试",
      type: "error"
    });
  } finally {
    exporting.value = false;
  }
};

const acceptParams = async (options: AcceptParamsOptions) => {
  // 批量赋值基础字段
  Object.assign(formData, {
    schoolId: options.schoolId,
    studentKeyword: options.studentKeyword || "",
    orderNo: options.orderNo || "",
    startDate: options.startDate || "",
    endDate: options.endDate || ""
  });
  // 特殊处理：级联字段（-1 转 null）
  formData.gradeId = options.gradeId != null && options.gradeId !== -1 ? Number(options.gradeId) : null;
  formData.departmentId = options.departmentId != null && options.departmentId !== -1 ? Number(options.departmentId) : null;
  formData.classId = options.classId != null && options.classId !== -1 ? Number(options.classId) : null;
  // 级联约束：无年级则无级部/班级，无级部则无班级
  if (formData.gradeId == null) {
    formData.departmentId = null;
    formData.classId = null;
  } else if (formData.departmentId == null) {
    formData.classId = null;
  }

  // 初始化选项
  gradeOptions.value = options.gradeOptions || [];
  departmentOptions.value = options.departmentOptions || [];
  classOptions.value = options.classOptions || [];

  // 如果没有传入年级选项，则获取
  if (!gradeOptions.value.length) {
    await axiosGetGradeOptions();
  }

  // 若已选择年级/级部但未传入联动选项，补拉取以保证回显
  if (formData.gradeId != null && !departmentOptions.value.length) {
    await axiosGetDepartmentOptions(formData.gradeId);
  }
  if (formData.gradeId != null && formData.departmentId != null && !classOptions.value.length) {
    await axiosGetClassOptions(formData.gradeId, formData.departmentId);
  }

  await axiosGetExportInfo();

  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="批量导出" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="export-container">
      <!-- 筛选表单 -->
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

      <!-- 导出设置 -->
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
      <el-button type="primary" :loading="exporting" :disabled="loading || totalRecords === 0" @click="handleExport">
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
