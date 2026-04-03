<script setup lang="ts">
import type { DryerCardRecharge } from "@/api/interface";

import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getDryerCardRechargeDetailApi } from "@/api/modules";
import { DRYER_CARD_RECHARGE_STATUS_I18N, getDryerCardRechargeStatusTagType } from "@/config/modules";

/** 弹窗可见状态。 */
const visible = ref(false);
/** 加载状态。 */
const loading = ref(false);
/** 弹窗参数。 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 圈存详情数据。 */
const detail = ref<DryerCardRecharge.IDryerCardRechargeDetail>();

/**
 * 获取圈存记录详情。
 * @param id 记录ID
 * @returns 请求结果
 */
async function axiosGetDryerCardRechargeDetailApi(id: number) {
  loading.value = true;
  try {
    const result = await getDryerCardRechargeDetailApi(id);
    if (result.code === 0) {
      detail.value = result.data;
    }
    return result;
  } catch (error) {
    console.error("axiosGetDryerCardRechargeDetailApi:", error);
    return { code: -1, data: null };
  } finally {
    loading.value = false;
  }
}

/**
 * 接收弹窗参数。
 * @param params 弹窗参数
 * @param row 列表行数据
 */
async function acceptParams(params: TModalParams, row?: DryerCardRecharge.IDryerCardRechargeItem) {
  parameter.value = { ...parameter.value, ...params };
  if (!row?.id) return;
  const result = await axiosGetDryerCardRechargeDetailApi(row.id);
  if (result.code !== 0) {
    ElMessage.error("获取详情失败");
    return;
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <div v-loading="loading">
      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item label="圈存单号" :span="2">{{ detail.rechargeNo }}</el-descriptions-item>
        <el-descriptions-item label="学校名称">{{ detail.schoolName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学生姓名">{{ detail.studentName || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ detail.studentCode || "--" }}</el-descriptions-item>
        <el-descriptions-item label="卡号">{{ detail.cardNumber || "--" }}</el-descriptions-item>
        <el-descriptions-item label="终端SN">{{ detail.terminalSn || "--" }}</el-descriptions-item>
        <el-descriptions-item label="终端MAC">{{ detail.terminalMac || "--" }}</el-descriptions-item>
        <el-descriptions-item label="圈存金额">
          <span class="amount">¥{{ (Number(detail.amount || 0) / 100).toFixed(2) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getDryerCardRechargeStatusTagType(detail.status)">
            {{ detail.statusText || DRYER_CARD_RECHARGE_STATUS_I18N[detail.status] || "--" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="卡侧交易号">{{ detail.cardTxnNo || "--" }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ detail.requestedAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="回传时间">{{ detail.resultReportedAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createdAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detail.updatedAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="失败码">{{ detail.failCode || "--" }}</el-descriptions-item>
        <el-descriptions-item label="失败原因">{{ detail.failMsg || "--" }}</el-descriptions-item>
        <el-descriptions-item label="终端幂等键" :span="2">{{ detail.idempotencyKey || "--" }}</el-descriptions-item>
      </el-descriptions>
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
