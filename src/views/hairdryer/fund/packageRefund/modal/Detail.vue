<script setup lang="ts">
import type { Refund } from "@/api/interface";

import { ref } from "vue";
import { getRefundDetailApi } from "@/api/modules";
import { REFUND_STATUS_I18N, getRefundStatusTagType, REFUND_TYPE_I18N, REFUND_CATEGORY_I18N, REFUND_DETAIL_STATUS_I18N, getRefundDetailStatusTagType } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const detail = ref<Refund.IRefundDetail>();

const axiosGetRefundDetailApi = async (id: number) => {
  loading.value = true;
  try {
    const result = await getRefundDetailApi(id);
    if (result.code === 0) {
      detail.value = result.data;
    }
  } catch (error) {
    console.error("axiosGetRefundDetailApi:", error);
  } finally {
    loading.value = false;
  }
};

const acceptParams = async (row: Refund.IRefundItem) => {
  await axiosGetRefundDetailApi(row.id);

  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="退款详情" width="720px" destroy-on-close draggable align-center>
    <div v-loading="loading">
      <template v-if="detail">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="退款单号" :span="2">{{ detail.refundNo }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{ detail.studentName }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ detail.studentCode || "--" }}</el-descriptions-item>
          <el-descriptions-item label="学校名称">{{ detail.schoolName }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ detail.applicantName || "--" }}</el-descriptions-item>
        </el-descriptions>

        <!-- 退款信息 -->
        <el-divider content-position="left">退款信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="退款类型">
            {{ REFUND_TYPE_I18N[detail.refundType] || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="退款分类">
            {{ REFUND_CATEGORY_I18N[detail.refundCategory] || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="申请金额">
            <span class="price">¥{{ Number(detail.applyAmount || 0).toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实际金额">
            <span v-if="detail.actualAmount !== null && detail.actualAmount !== undefined" class="price">
              ¥{{ Number(detail.actualAmount).toFixed(2) }}
            </span>
            <span v-else>--</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getRefundStatusTagType(detail.status)">
              {{ detail.statusText || REFUND_STATUS_I18N[detail.status] || "--" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请原因" :span="2">
            {{ detail.applyReason || "--" }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 时间信息 -->
        <el-divider content-position="left">时间信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请时间">{{ detail.applyTime || "--" }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ detail.auditTime || "--" }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ detail.completeTime || "--" }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.createdAt || "--" }}</el-descriptions-item>
        </el-descriptions>

        <!-- 审核信息 -->
        <template v-if="detail.adminName">
          <el-divider content-position="left">审核信息</el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="审核人">{{ detail.adminName }}</el-descriptions-item>
            <el-descriptions-item label="审核备注" :span="2">{{ detail.adminRemark || "--" }}</el-descriptions-item>
          </el-descriptions>
        </template>

        <!-- 退款明细 -->
        <template v-if="detail.refundDetails && detail.refundDetails.length > 0">
          <el-divider content-position="left">退款明细</el-divider>
          <el-table :data="detail.refundDetails" border style="width: 100%">
            <el-table-column prop="paymentOrderNo" label="充值订单号" min-width="180" show-overflow-tooltip />
            <el-table-column prop="refundAmount" label="退款金额" width="100">
              <template #default="{ row }">
                <span class="price">¥{{ Number(row.refundAmount || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="originalAmount" label="原金额" width="100">
              <template #default="{ row }">
                <span>¥{{ Number(row.originalAmount || 0).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="originalPaymentMethod" label="支付方式" width="120" show-overflow-tooltip />
            <el-table-column prop="refundStatus" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getRefundDetailStatusTagType(row.refundStatus)">
                  {{ REFUND_DETAIL_STATUS_I18N[row.refundStatus] || row.refundStatus }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.price {
  font-weight: 500;
  color: var(--el-color-danger);
}
</style>
