<script setup lang="ts">
import type { Payment } from "@/api/interface";

import { ref } from "vue";
import dayjs from "dayjs";
import { getPaymentDetailApi } from "@/api/modules";
import { DEVICE_TYPE_I18N, PAYMENT_METHOD_I18N, PAYMENT_STATUS_I18N, getPaymentStatusTagType } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const detail = ref<Payment.IPaymentDetail>();

const axiosGetPaymentDetailApi = async (id: number) => {
  loading.value = true;
  try {
    const result = await getPaymentDetailApi(id);
    if (result.code === 0) {
      detail.value = result.data;
    }
  } catch (error) {
    console.error("axiosGetPaymentDetailApi:", error);
  } finally {
    loading.value = false;
  }
};

const acceptParams = async (row: Payment.IPaymentItem) => {
  await axiosGetPaymentDetailApi(row.id);

  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="充值记录详情" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading">
      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item label="订单号" :span="2">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="学生姓名">{{ detail.studentName }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ detail.studentCode || "-" }}</el-descriptions-item>
        <el-descriptions-item label="学校名称" :span="2">{{ detail.schoolName }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">
          {{ detail.deviceType ? DEVICE_TYPE_I18N[detail.deviceType] : "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="充值金额">
          <span class="amount">¥{{ Number(detail.amount || 0).toFixed(2) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ PAYMENT_METHOD_I18N[detail.paymentMethod] }}</el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag :type="getPaymentStatusTagType(detail.status)">
            {{ detail.statusText || PAYMENT_STATUS_I18N[detail.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="交易流水号" :span="2">{{ detail.transactionId || "-" }}</el-descriptions-item>
        <el-descriptions-item label="订单描述" :span="2">{{ detail.description || "-" }}</el-descriptions-item>
        <el-descriptions-item label="充值人">{{ detail.payerName || "-" }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ detail.payTime || "-" }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detail.updatedAt }}</el-descriptions-item>
        <el-descriptions-item v-if="detail.expireAt" label="过期时间" :span="2">
          {{ dayjs(detail.expireAt).format("YYYY-MM-DD HH:mm:ss") }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 退款信息 -->
      <template v-if="detail?.refundInfo">
        <el-divider content-position="left">退款信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="已退款金额">
            <span class="amount">¥{{ Number(detail.refundInfo.refundedAmount || 0).toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="可退款金额">
            <span class="amount">¥{{ Number(detail.refundInfo.refundableAmount || 0).toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退款次数">{{ detail.refundInfo.refundCount }}</el-descriptions-item>
          <el-descriptions-item label="最后退款时间">{{ detail.refundInfo.lastRefundTime || "-" }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.amount {
  font-weight: 500;
  color: var(--el-color-danger);
}
</style>
