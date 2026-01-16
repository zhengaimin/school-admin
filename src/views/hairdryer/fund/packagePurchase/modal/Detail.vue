<script setup lang="ts">
import type { PackageRecord } from "@/api/interface";

import { ref } from "vue";
import { getPackageRecordDetailApi } from "@/api/modules";
import { PACKAGE_TYPE_I18N, PACKAGE_RECORD_STATUS_I18N, getPackageRecordStatusTagType } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const detail = ref<PackageRecord.IPackageRecordDetail>();

const axiosGetPackageRecordDetailApi = async (id: number) => {
  loading.value = true;
  try {
    const result = await getPackageRecordDetailApi(id);
    if (result.code === 0) {
      detail.value = result.data;
    }
  } catch (error) {
    console.error("axiosGetPackageRecordDetailApi:", error);
  } finally {
    loading.value = false;
  }
};

const acceptParams = async (row: PackageRecord.IPackageRecordItem) => {
  await axiosGetPackageRecordDetailApi(row.id);

  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="套餐购买详情" width="720px" destroy-on-close draggable align-center>
    <div v-loading="loading">
      <template v-if="detail">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号" :span="2">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{ detail.studentName }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ detail.studentCode || "--" }}</el-descriptions-item>
          <el-descriptions-item label="学校">{{ detail.schoolName }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ detail.gradeName || "--" }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ detail.className || "--" }}</el-descriptions-item>
          <el-descriptions-item label="购买人">{{ detail.purchaserName || "--" }}</el-descriptions-item>
        </el-descriptions>

        <!-- 套餐信息 -->
        <el-divider content-position="left">套餐信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="套餐类型">
            {{ PACKAGE_TYPE_I18N[detail.packageType] || "--" }}
          </el-descriptions-item>
          <el-descriptions-item label="套餐编码">{{ detail.packageCode || "--" }}</el-descriptions-item>
          <el-descriptions-item label="购买价格">
            <span class="price">¥{{ Number(detail.purchasePrice || 0).toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="套餐描述" :span="2">
            {{ detail.templateDescription || "--" }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 时间信息 -->
        <el-divider content-position="left">时间信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="购买时间">{{ detail.purchaseDate || "--" }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ detail.paymentTime || "--" }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ detail.startDate || "--" }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ detail.endDate || "--" }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{ detail.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <!-- 状态信息 -->
        <el-divider content-position="left">状态信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="支付方式">{{ detail.paymentMethod || "--" }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getPackageRecordStatusTagType(detail.status)">
              {{ detail.statusText || PACKAGE_RECORD_STATUS_I18N[detail.status] || "--" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 使用统计 -->
        <template v-if="detail.usageStats">
          <el-divider content-position="left">使用统计</el-divider>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="总分钟数">{{ detail.usageStats.totalMinutes }} 分钟</el-descriptions-item>
            <el-descriptions-item label="已使用">{{ detail.usageStats.usedMinutes }} 分钟</el-descriptions-item>
            <el-descriptions-item label="剩余">{{ detail.usageStats.remainingMinutes }} 分钟</el-descriptions-item>
          </el-descriptions>
          <div class="usage-progress">
            <el-progress
              :percentage="detail.usageStats.usagePercentage"
              :stroke-width="20"
              :format="() => `${detail?.usageStats?.usagePercentage ?? 0}%`"
            />
          </div>
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
.usage-progress {
  margin-top: 16px;
}
</style>
