<!-- 学生余额账户详情弹窗，展示包含赠费余额在内的账户信息。 -->
<script setup lang="ts">
import type { BalanceRecord } from "@/api/interface";

import { ref } from "vue";
import { getBalanceRecordDetailApi } from "@/api/modules";
import { BALANCE_ACCOUNT_STATUS_I18N, DEVICE_TYPE_I18N } from "@/config/modules";

/** 弹窗显隐 */
const visible = ref(false);
/** 详情加载状态 */
const loading = ref(false);
/** 详情数据 */
const detail = ref<BalanceRecord.IBalanceRecordDetail | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/**
 * 获取详情。
 * @param id 账户ID
 * @returns 请求结果
 */
async function axiosGetBalanceRecordDetailApi(id: number) {
  try {
    return await getBalanceRecordDetailApi(id);
  } catch (error) {
    console.error("axiosGetBalanceRecordDetailApi:", error);
    return { code: -1, data: null };
  }
}

/**
 * 获取文本。
 * @param value 原始值
 * @returns 展示文本
 */
function getText(value: unknown) {
  if (value == null || value === "") return "--";
  return String(value);
}

/**
 * 接收参数。
 * @param params 弹窗参数
 * @param row 当前行
 * @returns Promise<void>
 */
async function acceptParams(params: TModalParams, row?: BalanceRecord.IBalanceRecordItem) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  if (!row?.id) return;

  loading.value = true;
  try {
    const result = await axiosGetBalanceRecordDetailApi(row.id);
    if (result.code === 0 && result.data) {
      detail.value = result.data;
      visible.value = true;
    }
  } finally {
    loading.value = false;
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    v-loading="loading"
    :title="parameter.title"
    width="1120px"
    destroy-on-close
    draggable
    align-center
  >
    <div v-if="detail">
      <el-descriptions :column="3" border title="学生信息" class="mb-4">
        <el-descriptions-item label="学生姓名">{{ getText(detail.studentName) }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ getText(detail.studentCode) }}</el-descriptions-item>
        <el-descriptions-item label="学生UUID">{{ getText(detail.studentUuid) }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ getText(detail.schoolName) }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ getText(detail.gradeName) }}</el-descriptions-item>
        <el-descriptions-item label="级部">{{ getText(detail.departmentName) }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ getText(detail.className) }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">
          {{ detail.deviceTypeText || DEVICE_TYPE_I18N[detail.deviceType] || "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="账户状态">
          {{ detail.statusText || BALANCE_ACCOUNT_STATUS_I18N[detail.status] || "--" }}
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="3" border title="余额信息" class="mb-4">
        <el-descriptions-item label="总余额（元）">{{ getText(detail.totalBalance) }}</el-descriptions-item>
        <el-descriptions-item label="可用余额（元）">{{ getText(detail.availableBalance) }}</el-descriptions-item>
        <el-descriptions-item label="赠费余额（元）">{{ getText(detail.giftBalance) }}</el-descriptions-item>
        <el-descriptions-item label="冻结余额（元）">{{ getText(detail.frozenBalance) }}</el-descriptions-item>
        <el-descriptions-item label="累计充值总额">{{ getText(detail.totalRecharge) }}</el-descriptions-item>
        <el-descriptions-item label="累计消费总额">{{ getText(detail.totalConsumption) }}</el-descriptions-item>
        <el-descriptions-item label="累计退款总额">{{ getText(detail.totalRefund) }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="3" border title="套餐与赠送">
        <el-descriptions-item label="赠送剩余分钟数">{{ getText(detail.giftMinutes) }}</el-descriptions-item>
        <el-descriptions-item label="赠送已使用分钟数">{{ getText(detail.giftMinutesUsed) }}</el-descriptions-item>
        <el-descriptions-item label="冻结赠送分钟数">{{ getText(detail.frozenGiftMinutes) }}</el-descriptions-item>
        <el-descriptions-item label="套餐剩余分钟数">{{ getText(detail.packageMinutes) }}</el-descriptions-item>
        <el-descriptions-item label="套餐已使用分钟数">{{ getText(detail.packageMinutesUsed) }}</el-descriptions-item>
        <el-descriptions-item label="冻结套餐分钟数">{{ getText(detail.frozenPackageMinutes) }}</el-descriptions-item>
        <el-descriptions-item label="套餐留言剩余条数">
          {{ detail.packageMessageCount === -1 ? "不限数量" : getText(detail.packageMessageCount) }}
        </el-descriptions-item>
        <el-descriptions-item label="套餐留言已使用条数">{{ getText(detail.packageMessageCountUsed) }}</el-descriptions-item>
        <el-descriptions-item label="冻结套餐留言条数">{{ getText(detail.frozenPackageMessageCount) }}</el-descriptions-item>
        <el-descriptions-item label="最后清空日期">{{ getText(detail.lastClearDate) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ getText(detail.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ getText(detail.updatedAt) }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
