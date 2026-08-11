<!-- 通话记录详情弹窗，展示通话记录与当时学生账户余额。 -->
<script setup lang="ts">
import type { CallRecord } from "@/api/interface";

import { ref } from "vue";
import { getCallRecordDetailApi } from "@/api/modules";
import { PACKAGE_TYPE_I18N } from "@/config/modules";

/** 通话类型文案（key: 通话类型，value: 中文文案）。 */
const CALL_TYPE_I18N: Record<string, string> = {
  VIDEO: "视频通话",
  SPEECH: "语音通话"
};

/** 弹窗显隐。 */
const visible = ref(false);
/** 详情加载状态。 */
const loading = ref(false);
/** 详情数据。 */
const detail = ref<CallRecord.ResGetCallRecordDetailApi | null>(null);
/** 弹窗参数。 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/**
 * 获取详情。
 * @param id 记录 ID
 * @returns 请求结果
 */
async function axiosGetCallRecordDetailApi(id: number) {
  try {
    return await getCallRecordDetailApi(id);
  } catch (error) {
    console.error("axiosGetCallRecordDetailApi:", error);
    return { code: -1, data: null };
  }
}

/**
 * 获取通话类型文案。
 * @param value 通话类型
 * @returns 文案
 */
function getCallTypeText(value?: string) {
  if (!value) return "--";
  return CALL_TYPE_I18N[value] || value;
}

/**
 * 获取套餐类型文案。
 * @param value 套餐类型
 * @returns 文案
 */
function getPackageTypeText(value?: string | null) {
  if (!value) return "--";
  const textMap = PACKAGE_TYPE_I18N as Record<string, string>;
  return textMap[value] || value;
}

/**
 * 接收参数。
 * @param params 弹窗参数
 * @param row 列表行
 * @returns Promise<void>
 */
async function acceptParams(params: TModalParams, row?: CallRecord.ICallRecordItem) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;

  if (!row?.id) return;

  loading.value = true;
  try {
    const result = await axiosGetCallRecordDetailApi(row.id);

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
      <div v-if="detail.studentBalance" class="mb-4">
        <el-descriptions border title="学生账户">
          <el-descriptions-item label="总余额（元）">{{ detail.studentBalance.totalBalance }}</el-descriptions-item>
          <el-descriptions-item label="可用余额（元）">{{ detail.studentBalance.availableBalance }}</el-descriptions-item>
          <el-descriptions-item label="赠费余额（元）">{{ detail.studentBalance.giftBalance }}</el-descriptions-item>
          <el-descriptions-item label="冻结余额（元）">{{ detail.studentBalance.frozenBalance }}</el-descriptions-item>
          <el-descriptions-item label="赠送通话剩余分钟数">{{ detail.studentBalance.giftMinutes }}</el-descriptions-item>
          <el-descriptions-item label="套餐通话剩余分钟数">{{ detail.studentBalance.packageMinutes }}</el-descriptions-item>
          <el-descriptions-item label="套餐留言剩余条数">
            {{ detail.studentBalance.packageMessageCount === -1 ? "不限数量" : detail.studentBalance.packageMessageCount }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">{{ detail.studentBalance.status === 1 ? "正常" : "冻结" }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <el-descriptions :column="2" border title="通话详情">
        <el-descriptions-item label="学生姓名">{{ detail.studentName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="唯一号">{{ detail.studentUuid || "--" }}</el-descriptions-item>
        <el-descriptions-item label="物理卡号">{{ detail.cardNumber || "--" }}</el-descriptions-item>
        <el-descriptions-item label="通话类型">{{ getCallTypeText(detail.callType) }}</el-descriptions-item>
        <el-descriptions-item label="通道类型">{{ detail.channelType || "--" }}</el-descriptions-item>
        <el-descriptions-item label="被呼叫号码">{{ detail.phoneNumber || "--" }}</el-descriptions-item>
        <el-descriptions-item label="联系人称呼">{{ detail.contactName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="是否是 SOS 电话">{{ detail.isSos ? "是" : "否" }}</el-descriptions-item>
        <el-descriptions-item label="呼叫开始时间">{{ detail.callStartTime || "--" }}</el-descriptions-item>
        <el-descriptions-item label="呼叫结束时间">{{ detail.callEndTime || "--" }}</el-descriptions-item>
        <el-descriptions-item label="通话时长（分钟）">{{ detail.callLenMinute ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="拨号和通话时长（秒）">{{ detail.callDuration ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="拨号和通话时长">{{ detail.callDurationFormatted || "--" }}</el-descriptions-item>
        <el-descriptions-item label="消费流水号">{{ detail.consumeSerialNo || "--" }}</el-descriptions-item>
        <el-descriptions-item label="单价">{{ detail.unitPrice || "--" }}</el-descriptions-item>
        <el-descriptions-item label="实际扣费金额（元）">{{ detail.amount || "--" }}</el-descriptions-item>
        <el-descriptions-item label="本次消费前总余额（元）">{{ detail.totalBalanceBefore || "--" }}</el-descriptions-item>
        <el-descriptions-item label="本次消费后总余额（元）">{{ detail.totalBalanceAfter || "--" }}</el-descriptions-item>
        <el-descriptions-item label="本次消费前可用余额（元）">{{ detail.availableBalanceBefore || "--" }}</el-descriptions-item>
        <el-descriptions-item label="本次消费后可用余额（元）">{{ detail.availableBalanceAfter || "--" }}</el-descriptions-item>
        <el-descriptions-item label="扣费时间">{{ detail.consumeTime || "--" }}</el-descriptions-item>
        <el-descriptions-item label="是否使用套餐">{{ detail.isPackageUsage ? "是" : "否" }}</el-descriptions-item>
        <el-descriptions-item label="使用类型">{{ detail.usageTypeText || "--" }}</el-descriptions-item>
        <el-descriptions-item label="是否免费使用">{{ detail.isFreeUsage ? "是" : "否" }}</el-descriptions-item>
        <el-descriptions-item label="使用的赠送分钟数">{{ detail.giftMinutesUsed ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="使用的套餐分钟数">{{ detail.packageMinutesUsed ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="使用的余额分钟数">{{ detail.balanceMinutesUsed ?? "--" }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ detail.distributionText || "--" }}</el-descriptions-item>
        <el-descriptions-item label="套餐编码">{{ detail.packageCode || "--" }}</el-descriptions-item>
        <el-descriptions-item label="套餐类型">{{ getPackageTypeText(detail.packageType) }}</el-descriptions-item>
        <el-descriptions-item label="套餐购买价格（元）">{{ detail.purchasePrice || "--" }}</el-descriptions-item>
        <el-descriptions-item label="套餐开始日期">{{ detail.packageStartDate || "--" }}</el-descriptions-item>
        <el-descriptions-item label="套餐结束日期">{{ detail.packageEndDate || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学校">{{ detail.schoolName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ detail.gradeName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="级部">{{ detail.departmentName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ detail.className || "--" }}</el-descriptions-item>
        <el-descriptions-item label="SN">{{ detail.deviceSn || "--" }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
