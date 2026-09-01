<script setup lang="ts" name="platformPackageRefund">
import type { Refund } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getRefundsApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import {
  PACKAGE_TYPE_I18N,
  REFUND_CATEGORY,
  REFUND_PACKAGE_SOURCE,
  REFUND_PACKAGE_SOURCE_I18N,
  REFUND_STATUS,
  REFUND_STATUS_I18N,
  REFUND_STATUS_OPTIONS,
  REFUND_TYPE_I18N,
  getRefundStatusTagType
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import AuditModal from "./modal/Audit.vue";

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getRefundsApi },
  { schoolId: -1, refundCategory: REFUND_CATEGORY.PACKAGE, packageSource: REFUND_PACKAGE_SOURCE.PLATFORM }
);

/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof DetailModal>>();
/** 审核弹窗引用 */
const auditModalRef = ref<InstanceType<typeof AuditModal>>();
/** 表格列配置 */
const columns: ColumnProps<Refund.IRefundItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 140 },
  { prop: "studentName", label: "学生姓名", minWidth: 100 },
  {
    prop: "refundNo",
    label: "退款单号",
    minWidth: 210,
    search: { el: "input", props: { placeholder: "请输入退款单号" } }
  },
  {
    prop: "studentKeyword",
    label: "学生",
    isShow: false,
    search: { el: "input", props: { placeholder: "姓名/学号" } }
  },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "applicantName", label: "申请人", minWidth: 100 },
  { prop: "packageSource", label: "套餐来源", width: 130 },
  { prop: "packageName", label: "套餐名称", minWidth: 160 },
  { prop: "platformPackageId", label: "平台套餐 ID", width: 120 },
  { prop: "packageRecordIds", label: "关联记录数", width: 100 },
  { prop: "packageType", label: "套餐类型", width: 110 },
  { prop: "originalPrice", label: "原支付金额", width: 110 },
  { prop: "applyAmount", label: "申请金额", width: 100 },
  { prop: "actualAmount", label: "实际金额", width: 100 },
  {
    prop: "status",
    label: "状态",
    width: 120,
    fixed: "right",
    enum: REFUND_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "applyTime", label: "申请时间", minWidth: 160 },
  {
    prop: "startDate",
    label: "开始日期",
    isShow: false,
    search: { el: "date-picker", props: { type: "date", placeholder: "开始日期", valueFormat: "YYYY-MM-DD" } }
  },
  {
    prop: "endDate",
    label: "结束日期",
    isShow: false,
    search: { el: "date-picker", props: { type: "date", placeholder: "结束日期", valueFormat: "YYYY-MM-DD" } }
  },
  { prop: "operation", label: "操作", width: 120, fixed: "right" }
];

/** 查看退款详情 */
function handleShowDetail(row: Refund.IRefundItem) {
  detailModalRef.value?.acceptParams({ title: "平台套餐退款详情", type: "View", showConfirm: false }, row);
}

/** 审核退款申请 */
function handleAudit(row: Refund.IRefundItem) {
  auditModalRef.value?.acceptParams({ title: "审核平台套餐退款", type: "Edit", showConfirm: true }, row);
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="平台套餐退款">
      <!-- 退款类型 -->
      <template #refundType="{ row }">
        {{ REFUND_TYPE_I18N[row.refundType] || "--" }}
      </template>
      <!-- 套餐类型 -->
      <template #packageType="{ row }">
        {{ PACKAGE_TYPE_I18N[row.packageType] || row.packageType || "--" }}
      </template>
      <!-- 套餐来源 -->
      <template #packageSource="{ row }">
        {{ row.packageSource ? REFUND_PACKAGE_SOURCE_I18N[row.packageSource] : "平台套餐" }}
      </template>
      <!-- 关联套餐记录 -->
      <template #packageRecordIds="{ row }">
        {{ row.packageRecordIds?.length || (row.packageRecordId ? 1 : 0) }}
      </template>
      <!-- 原支付金额 -->
      <template #originalPrice="{ row }">
        <span class="price">¥{{ Number(row.originalPrice || 0).toFixed(2) }}</span>
      </template>
      <!-- 申请金额 -->
      <template #applyAmount="{ row }">
        <span class="price">¥{{ Number(row.applyAmount || 0).toFixed(2) }}</span>
      </template>
      <!-- 实际金额 -->
      <template #actualAmount="{ row }">
        <span v-if="row.actualAmount !== null && row.actualAmount !== undefined" class="price">
          ¥{{ Number(row.actualAmount).toFixed(2) }}
        </span>
        <span v-else>--</span>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getRefundStatusTagType(row.status)">
          {{ row.statusText || REFUND_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button v-if="row.status === REFUND_STATUS.PENDING" type="primary" link @click="handleAudit(row)">审核</el-button>
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
    <AuditModal ref="auditModalRef" @refresh="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.price {
  font-weight: 500;
  color: var(--el-color-danger);
}
</style>
