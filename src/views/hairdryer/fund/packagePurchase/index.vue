<script setup lang="ts" name="hairdryerFundPackagePurchase">
import type { PackageRecord } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getPackageRecordsApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useSchool } from "@/hooks/useSchool";
import {
  PACKAGE_TYPE_I18N,
  PACKAGE_TYPE_OPTIONS,
  PACKAGE_RECORD_STATUS_OPTIONS,
  PACKAGE_RECORD_STATUS_I18N,
  getPackageRecordStatusTagType,
  DEVICE_TYPE
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import ExportModal from "./modal/Export.vue";

const { schoolId, guardSchool } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getPackageRecordsApi },
  { deviceType: DEVICE_TYPE.DRYER }
);

const detailModalRef = ref();
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

const columns: ColumnProps<PackageRecord.IPackageRecordItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  {
    prop: "orderNo",
    label: "订单号",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入订单号" } }
  },
  {
    prop: "studentKeyword",
    label: "学生",
    minWidth: 120,
    isShow: false,
    search: { el: "input", props: { placeholder: "姓名/学号" } }
  },
  { prop: "studentName", label: "学生姓名", minWidth: 100 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "purchaserName", label: "购买人", minWidth: 120 },
  {
    prop: "packageType",
    label: "套餐类型",
    width: 100,
    enum: PACKAGE_TYPE_OPTIONS
  },
  { prop: "purchasePrice", label: "购买价格", width: 100, fixed: "right" },
  {
    prop: "status",
    label: "状态",
    width: 100,
    fixed: "right",
    enum: PACKAGE_RECORD_STATUS_OPTIONS
  },
  { prop: "paymentTime", label: "支付时间", minWidth: 160 },
  { prop: "createdAt", label: "创建时间", minWidth: 160 },
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
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

/** 查看详情 */
function handleShowDetail(row: PackageRecord.IPackageRecordItem) {
  detailModalRef.value?.acceptParams({ title: "套餐购买详情", type: "View", showConfirm: false }, row);
}
/** 打开导出弹窗 */
function handleOpenExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    studentKeyword: searchParam.studentKeyword,
    orderNo: searchParam.orderNo,
    packageType: searchParam.packageType,
    status: searchParam.status,
    minPrice: searchParam.minPrice,
    maxPrice: searchParam.maxPrice,
    startDate: searchParam.startDate,
    endDate: searchParam.endDate,
    gradeId: searchParam.gradeId,
    departmentId: searchParam.departmentId,
    classId: searchParam.classId,
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="套餐购买">
      <template #toolButton>
        <el-button type="primary" @click="handleOpenExport">导出</el-button>
      </template>
      <!-- 套餐类型 -->
      <template #packageType="{ row }">
        {{ PACKAGE_TYPE_I18N[row.packageType] || "--" }}
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getPackageRecordStatusTagType(row.status)">
          {{ row.statusText || PACKAGE_RECORD_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 价格 -->
      <template #purchasePrice="{ row }">
        <span class="price">¥{{ Number(row.purchasePrice || 0).toFixed(2) }}</span>
      </template>
      <!-- 支付时间 -->
      <template #paymentTime="{ row }">
        {{ row.paymentTime || "--" }}
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
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
