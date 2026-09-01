<script setup lang="ts" name="hairdryerFundPackageRefund">
import type { Refund } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getRefundsApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useSchool } from "@/hooks/useSchool";
import {
  REFUND_STATUS,
  REFUND_STATUS_OPTIONS,
  REFUND_STATUS_I18N,
  getRefundStatusTagType,
  REFUND_TYPE_OPTIONS,
  REFUND_TYPE_I18N,
  REFUND_CATEGORY,
  REFUND_CATEGORY_I18N,
  REFUND_PACKAGE_SOURCE,
  DEVICE_TYPE
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import AuditModal from "./modal/Audit.vue";
import ExportModal from "./modal/Export.vue";

const { schoolId, guardSchool } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getRefundsApi },
  {
    refundCategory: REFUND_CATEGORY.PACKAGE,
    packageSource: REFUND_PACKAGE_SOURCE.NORMAL,
    deviceType: DEVICE_TYPE.DRYER
  }
);

const detailModalRef = ref();
const auditModalRef = ref();
const exportModalRef = ref();
const {
  gradeOptions,
  departmentOptions,
  classOptions,
  loadGradeOptions,
  handleGradeCascade,
  handleDepartmentCascade,
  resetAllOptions
} = useGradeDepartmentClassOptions({
  schoolId,
  requestOptions: {
    department: { loading: false },
    class: { loading: false }
  }
});

const columns: ColumnProps<Refund.IRefundItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
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
  {
    prop: "refundType",
    label: "退款类型",
    width: 120,
    enum: REFUND_TYPE_OPTIONS
  },
  { prop: "applyAmount", label: "申请金额", width: 90 },
  { prop: "actualAmount", label: "实际金额", width: 90 },
  {
    prop: "status",
    label: "状态",
    width: 120,
    fixed: "right",
    enum: REFUND_STATUS_OPTIONS
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
  {
    prop: "gradeId",
    label: "年级",
    isShow: false,
    enum: gradeOptions,
    search: { el: "select", props: { placeholder: "请选择年级" } }
  },
  {
    prop: "departmentId",
    label: "级部",
    isShow: false,
    enum: departmentOptions,
    search: { el: "select", props: { placeholder: "请选择级部" } }
  },
  {
    prop: "classId",
    label: "班级",
    isShow: false,
    enum: classOptions,
    search: { el: "select", props: { placeholder: "请选择班级" } }
  },
  { prop: "operation", label: "操作", width: 120, fixed: "right" }
];

/** 查看详情 */
function handleShowDetail(row: Refund.IRefundItem) {
  detailModalRef.value?.acceptParams({ title: "退款详情", type: "View", showConfirm: false }, row);
}
/** 审核退款 */
function handleAudit(row: Refund.IRefundItem) {
  auditModalRef.value?.acceptParams({ title: "审核退款申请", type: "Edit", showConfirm: true }, row);
}
/** 处理导出 */
function handleExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};

  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    studentKeyword: searchParam.studentKeyword || "",
    refundNo: searchParam.refundNo || "",
    status: searchParam.status ?? null,
    startDate: searchParam.startDate || "",
    endDate: searchParam.endDate || "",
    gradeId: searchParam.gradeId ?? null,
    departmentId: searchParam.departmentId ?? null,
    classId: searchParam.classId ?? null,
    gradeOptions: [...gradeOptions.value],
    departmentOptions: [...departmentOptions.value],
    classOptions: [...classOptions.value],
    title: "批量导出",
    type: "View",
    showConfirm: true
  });
}

/** 监听年级变化，加载级部和班级选项 */
watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    await handleGradeCascade({
      gradeId: gradeId != null ? Number(gradeId) : undefined,
      reset: () => {
        if (proTable.value?.searchParam) {
          proTable.value.searchParam.departmentId = undefined;
          proTable.value.searchParam.classId = undefined;
        }
      }
    });
  }
);

/** 监听级部变化，加载班级选项 */
watch(
  () => proTable.value?.searchParam?.departmentId,
  async departmentId => {
    const gradeId = proTable.value?.searchParam?.gradeId;
    await handleDepartmentCascade({
      gradeId: gradeId != null ? Number(gradeId) : undefined,
      departmentId: departmentId != null ? Number(departmentId) : undefined,
      reset: () => {
        if (proTable.value?.searchParam) {
          proTable.value.searchParam.classId = undefined;
        }
      }
    });
  }
);

/** 监听学校变化 */
watch(
  schoolId,
  () => {
    resetAllOptions();
    loadGradeOptions();
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="套餐退款管理">
      <template #toolButton>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
      <!-- 退款类型 -->
      <template #refundType="{ row }">
        {{ REFUND_TYPE_I18N[row.refundType] || "--" }}
      </template>
      <!-- 退款分类 -->
      <template #refundCategory="{ row }">
        {{ REFUND_CATEGORY_I18N[row.refundCategory] || "--" }}
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
          {{ REFUND_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button v-if="row.status === REFUND_STATUS.PENDING" type="primary" link @click="handleAudit(row)"> 审核 </el-button>
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
    <AuditModal ref="auditModalRef" @refresh="refreshTableList" />
    <ExportModal ref="exportModalRef" />
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
