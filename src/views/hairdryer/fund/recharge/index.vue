<script setup lang="ts" name="hairdryerFundRecharge">
import type { Payment } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getPaymentsApi, getGradesApi, getDepartmentsListApi, getClassesListApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE, getPaymentStatusTagType } from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import ExportModal from "./modal/Export.vue";

interface OptionItem {
  label: string;
  value: number;
}

const { schoolId, guardSchool } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getPaymentsApi }, { deviceType: DEVICE_TYPE.DRYER });

const detailModalRef = ref();
const exportModalRef = ref();

const gradeOptions = ref<OptionItem[]>([]);
const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

const columns: ColumnProps<Payment.IPaymentItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 180 },
  {
    prop: "orderNo",
    label: "订单号",
    minWidth: 200,
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
  { prop: "amount", label: "金额", width: 100, fixed: "right" },
  { prop: "status", label: "状态", width: 100, fixed: "right" },
  { prop: "payerName", label: "充值人", width: 100 },
  { prop: "payTime", label: "支付时间", minWidth: 180 },
  { prop: "createdAt", label: "创建时间", minWidth: 180 },
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

/** 获取年级列表 */
const axiosGetGradeOptions = async () => {
  try {
    const result = await getGradesApi({ schoolId: Number(schoolId.value), page: 1, pageSize: 200 });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      gradeOptions.value.splice(0, gradeOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetGradeOptions:", error);
  }
};
/** 获取级部列表 */
const axiosGetDepartmentOptions = async (gradeId: number) => {
  try {
    const result = await getDepartmentsListApi(
      { schoolId: Number(schoolId.value), gradeId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      departmentOptions.value.splice(0, departmentOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetDepartmentOptions:", error);
  }
};
/** 获取班级列表 */
const axiosGetClassOptions = async (gradeId: number, departmentId: number) => {
  try {
    const result = await getClassesListApi(
      { schoolId: Number(schoolId.value), gradeId, departmentId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      classOptions.value.splice(0, classOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetClassOptions:", error);
  }
};

/** 处理查看详情 */
const handleShowDetail = (row: Payment.IPaymentItem) => {
  detailModalRef.value?.acceptParams(row);
};
/** 处理导出 */
const handleExport = () => {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};

  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    studentKeyword: searchParam.studentKeyword || "",
    orderNo: searchParam.orderNo || "",
    startDate: searchParam.startDate || "",
    endDate: searchParam.endDate || "",
    gradeId: searchParam.gradeId ?? null,
    departmentId: searchParam.departmentId ?? null,
    classId: searchParam.classId ?? null,
    gradeOptions: [...gradeOptions.value],
    departmentOptions: [...departmentOptions.value],
    classOptions: [...classOptions.value]
  });
};

/** 监听年级变化，加载级部和班级选项 */
watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    // 清空级部和班级
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.departmentId = undefined;
      proTable.value.searchParam.classId = undefined;
    }
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;

    if (gradeId) {
      await axiosGetDepartmentOptions(gradeId);
    }
  }
);
/** 监听级部变化，加载班级选项 */
watch(
  () => proTable.value?.searchParam?.departmentId,
  async departmentId => {
    // 清空班级
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.classId = undefined;
    }
    classOptions.value.length = 0;

    const gradeId = proTable.value?.searchParam?.gradeId;
    if (gradeId && departmentId) {
      await axiosGetClassOptions(gradeId, departmentId);
    }
  }
);
/** 监听学校变化 */
watch(
  schoolId,
  () => {
    gradeOptions.value.length = 0;
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;
    axiosGetGradeOptions();
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="充值记录">
      <template #toolButton>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getPaymentStatusTagType(row.status)">
          {{ row.statusText }}
        </el-tag>
      </template>
      <!-- 金额 -->
      <template #amount="{ row }">
        <span class="amount">¥{{ Number(row.amount || 0).toFixed(2) }}</span>
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
.amount {
  font-weight: 500;
  color: var(--el-color-danger);
}
</style>
