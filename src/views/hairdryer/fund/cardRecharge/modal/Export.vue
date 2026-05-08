<script setup lang="ts">
import type { AcceptParamsOptions, FormData } from "../types";

import { computed, reactive, ref } from "vue";
import { ElNotification } from "element-plus";
import { getDryerCardRechargesExportApi, getDryerCardRechargesExportInfoApi } from "@/api/modules";
import { DRYER_CARD_RECHARGE_STATUS_OPTIONS } from "@/config/modules";
import { buildCardRechargeExportInfoParams, buildCardRechargeExportParams } from "../utils/payload";

/** 弹窗可见状态。 */
const visible = ref(false);
/** 导出信息加载状态。 */
const loading = ref(false);
/** 导出中状态。 */
const exporting = ref(false);
/** 弹窗参数。 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: true
});
/** 总记录数。 */
const totalRecords = ref(0);
/** 总页数。 */
const totalPages = ref(0);
/** 当前导出批次。 */
const selectedPage = ref(1);
/** 单批导出条数。 */
const pageSize = ref(10000);
/** 导出表单数据。 */
const formData = reactive<FormData>({
  schoolId: 0,
  studentKeyword: "",
  rechargeNo: "",
  cardNumber: "",
  status: null,
  terminalSn: "",
  startTime: "",
  endTime: "",
  minAmount: "",
  maxAmount: ""
});
/** 导出批次选项。 */
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
 * 获取导出信息。
 * @returns 请求结果
 */
async function axiosGetDryerCardRechargeExportInfoApi() {
  loading.value = true;
  try {
    const result = await getDryerCardRechargesExportInfoApi(buildCardRechargeExportInfoParams(formData));
    if (result.code === 0) {
      totalRecords.value = result.data.totalRecords;
      totalPages.value = result.data.totalPages;
      pageSize.value = result.data.pageSize || 10000;
      selectedPage.value = 1;
    }
    return result;
  } catch (error) {
    console.error("axiosGetDryerCardRechargeExportInfoApi:", error);
    return { code: -1, data: null };
  } finally {
    loading.value = false;
  }
}

/**
 * 处理查询。
 */
function handleSearch() {
  axiosGetDryerCardRechargeExportInfoApi();
}

/**
 * 处理导出。
 */
async function handleExport() {
  if (totalRecords.value === 0) return;

  exporting.value = true;
  ElNotification({ title: "提示", message: "数据导出中，请稍后", type: "info", duration: 0 });

  try {
    const response = await getDryerCardRechargesExportApi(buildCardRechargeExportParams(formData, selectedPage.value));
    const blob = new Blob([response as any], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "圈存记录_吹风机.xlsx");
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
 * 接收参数。
 * @param options 弹窗参数
 */
async function acceptParams(options: AcceptParamsOptions) {
  parameter.value = { ...parameter.value, ...options };
  Object.assign(formData, {
    schoolId: options.schoolId,
    studentKeyword: options.studentKeyword || "",
    rechargeNo: options.rechargeNo || "",
    cardNumber: options.cardNumber || "",
    status: options.status ?? null,
    terminalSn: options.terminalSn || "",
    startTime: options.startTime || "",
    endTime: options.endTime || "",
    minAmount: options.minAmount || "",
    maxAmount: options.maxAmount || ""
  });

  await axiosGetDryerCardRechargeExportInfoApi();

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
            <el-form-item label="圈存单号">
              <el-input v-model="formData.rechargeNo" placeholder="请输入圈存单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡号">
              <el-input v-model="formData.cardNumber" placeholder="请输入卡号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option
                  v-for="item in DRYER_CARD_RECHARGE_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端SN">
              <el-input v-model="formData.terminalSn" placeholder="请输入终端SN" clearable />
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
            <el-form-item label="最小金额（元）">
              <el-input v-model="formData.minAmount" placeholder="请输入最小金额（元）" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大金额（元）">
              <el-input v-model="formData.maxAmount" placeholder="请输入最大金额（元）" clearable />
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
