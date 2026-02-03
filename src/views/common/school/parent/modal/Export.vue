<script setup lang="ts">
import type { FamilyBindStatus } from "@/api/interface";
import type { AcceptParamsOptions } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getFamilyBindStatusExportApi, getFamilyBindStatusExportInfoApi } from "@/api/modules";
import { buildFamilyBindStatusExportInfoParams, buildFamilyBindStatusExportParams } from "../utils/payload";
import { isNullOrUnDef } from "@/utils/is";

/** 弹窗是否显示 */
const visible = ref(false);
/** 导出信息加载状态 */
const loading = ref(false);
/** 导出中状态 */
const exporting = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});
/** 总记录数 */
const totalRecords = ref(0);
/** 总页数 */
const totalPages = ref(0);
/** 当前导出批次 */
const selectedPage = ref(1);
/** 每页导出数量 */
const pageSize = ref(1000);

/** 导出筛选条件 */
const formData = reactive<FamilyBindStatus.ReqGetFamilyBindStatusExportInfoApi>({
  schoolId: undefined,
  gradeId: undefined,
  classId: undefined,
  studentNo: undefined,
  studentName: undefined,
  phone: undefined,
  wechatBound: undefined
});

/** 导出批次选项 */
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
async function axiosGetFamilyBindStatusExportInfoApi() {
  loading.value = true;
  try {
    const result = await getFamilyBindStatusExportInfoApi(buildFamilyBindStatusExportInfoParams(formData));
    if (result.code === 0) {
      totalRecords.value = result.data?.totalRecords ?? 0;
      totalPages.value = result.data?.totalPages ?? 0;
      pageSize.value = result.data?.pageSize ?? 1000;
      selectedPage.value = 1;
    }
    return result;
  } catch (error) {
    console.error("axiosGetFamilyBindStatusExportInfoApi:", error);
    return { code: -1, data: null };
  } finally {
    loading.value = false;
  }
}

/** 导出家长绑定状态 */
async function handleExport() {
  if (totalRecords.value === 0) return;
  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });
  try {
    const response = await getFamilyBindStatusExportApi(
      buildFamilyBindStatusExportParams({
        ...formData,
        page: selectedPage.value,
        pageSize: pageSize.value
      })
    );
    const blob = new Blob([response as BlobPart], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "家长绑定状态.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
    ElNotification.closeAll();
    ElNotification({ title: "成功", message: "导出成功", type: "success" });
    visible.value = false;
  } catch (error) {
    console.error("handleExport:", error);
    ElNotification.closeAll();
    ElNotification({ title: "错误", message: "导出失败，请重试", type: "error" });
  } finally {
    exporting.value = false;
  }
}

/** 接收参数 */
async function acceptParams(options: AcceptParamsOptions) {
  parameter.value = { ...parameter.value, ...options };
  formData.schoolId = options.schoolId;
  formData.gradeId = options.gradeId;
  formData.classId = options.classId;
  formData.studentNo = options.studentNo;
  formData.studentName = options.studentName;
  formData.phone = options.phone;
  formData.wechatBound = isNullOrUnDef(options.wechatBound) ? undefined : options.wechatBound;
  await axiosGetFamilyBindStatusExportInfoApi();
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="p-2">
      <div class="flex flex-wrap items-center justify-between gap-3 rounded border border-gray-200 bg-gray-50 p-3">
        <div class="text-sm text-gray-600">
          符合条件共
          <span class="mx-1 text-[var(--el-color-primary)] text-lg font-semibold">{{ totalRecords }}</span>
          条数据
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <span class="mr-2">导出范围：</span>
          <el-select v-model="selectedPage" placeholder="请选择导出批次" class="w-52">
            <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-400">* 为保证导出性能，单次限制导出 {{ pageSize }} 条数据</div>
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
