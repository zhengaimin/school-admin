<script setup lang="ts">
import type { DeviceUsage } from "@/api/interface";

import { ref } from "vue";
import { DEVICE_USAGE_STATUS_I18N, getDeviceUsageStatusTagType, DEVICE_TYPE_I18N } from "@/config/modules";

const visible = ref(false);
const detail = ref<DeviceUsage.IDeviceUsageItem | null>(null);

/** 接收参数 */
const acceptParams = (row: DeviceUsage.IDeviceUsageItem) => {
  detail.value = row;
  visible.value = true;
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="使用记录详情" width="860px" destroy-on-close draggable align-center>
    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="订单号">{{ detail.orderNo || "--" }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getDeviceUsageStatusTagType(detail.status)">
          {{ detail.statusText || DEVICE_USAGE_STATUS_I18N[detail.status] || "--" }}
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="学生姓名">{{ detail.studentName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="学生UUID">{{ detail.studentUuid || "--" }}</el-descriptions-item>
      <el-descriptions-item label="卡号">{{ detail.cardNumber || "--" }}</el-descriptions-item>
      <el-descriptions-item label="年级">{{ detail.gradeName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="班级">{{ detail.className || "--" }}</el-descriptions-item>
      <el-descriptions-item label="设备类型">{{
        DEVICE_TYPE_I18N[detail.deviceType] || detail.deviceType || "--"
      }}</el-descriptions-item>

      <el-descriptions-item label="设备序列号">{{ detail.deviceSn || "--" }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ detail.deviceName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="厂商代码">{{ detail.vendorCode || "--" }}</el-descriptions-item>
      <el-descriptions-item label="最大可用时长(分)">{{ detail.maxUsageMinutes ?? "--" }}</el-descriptions-item>

      <el-descriptions-item label="实际使用时长(秒)">{{ detail.usageDuration ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="计费分钟数">{{ detail.usageMinutes ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="费率(元/分钟)">{{ detail.unitPrice || "--" }}</el-descriptions-item>
      <el-descriptions-item label="冻结金额(元)">{{ detail.frozenAmount || "--" }}</el-descriptions-item>

      <el-descriptions-item label="冻结赠送时长(分)">{{ detail.frozenGiftMinutes ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="冻结套餐时长(分)">{{ detail.frozenPackageMinutes ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="实际扣费金额(元)">{{ detail.actualAmount || "--" }}</el-descriptions-item>
      <el-descriptions-item label="退款金额(元)">{{ detail.refundAmount || "--" }}</el-descriptions-item>

      <el-descriptions-item label="使用赠送时长(分)">{{ detail.giftMinutesUsed ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="使用套餐时长(分)">{{ detail.packageMinutesUsed ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="使用余额时长(分)">{{ detail.balanceMinutesUsed ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="消费流水号">{{ detail.consumeSerialNo || "--" }}</el-descriptions-item>

      <el-descriptions-item label="刷卡时间">{{ detail.createdAt || "--" }}</el-descriptions-item>
      <el-descriptions-item label="确认使用时间">{{ detail.confirmedAt || "--" }}</el-descriptions-item>
      <el-descriptions-item label="完成时间">{{ detail.completedAt || "--" }}</el-descriptions-item>
      <el-descriptions-item label="消费时间">{{ detail.consumeTime || "--" }}</el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-descriptions__label) {
  width: 140px;
}
</style>
