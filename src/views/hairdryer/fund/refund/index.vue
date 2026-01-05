<script setup lang="ts" name="hairdryerFundRefund">
import type { Refund } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getRefundsApi, getGradesApi, getDepartmentsListApi, getClassesListApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
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
  DEVICE_TYPE
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import AuditModal from "./modal/Audit.vue";

interface OptionItem {
  label: string;
  value: number;
}

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getRefundsApi },
  { refundCategory: REFUND_CATEGORY.BALANCE, deviceType: DEVICE_TYPE.DRYER }
);

const detailModalRef = ref();
const auditModalRef = ref();
const gradeOptions = ref<OptionItem[]>([]);
const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

const columns: ColumnProps<Refund.IRefundItem>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "refundNo",
    label: "退款单号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入退款单号" } }
  },
  {
    prop: "studentKeyword",
    label: "学生",
    isShow: false,
    search: { el: "input", props: { placeholder: "姓名/学号" } }
  },
  { prop: "studentName", label: "学生姓名", minWidth: 100 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "schoolName", label: "学校名称", minWidth: 180 },
  { prop: "applicantName", label: "申请人", minWidth: 100 },
  {
    prop: "refundType",
    label: "退款类型",
    width: 120,
    enum: REFUND_TYPE_OPTIONS
  },
  { prop: "applyAmount", label: "申请金额", width: 100 },
  { prop: "actualAmount", label: "实际金额", width: 100 },
  {
    prop: "status",
    label: "状态",
    width: 120,
    fixed: "right",
    enum: REFUND_STATUS_OPTIONS
  },
  { prop: "applyTime", label: "申请时间", minWidth: 180 },
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

/** 查看详情 */
const onShowDetail = (row: Refund.IRefundItem) => {
  detailModalRef.value?.acceptParams(row);
};
/** 审核退款 */
const onAudit = (row: Refund.IRefundItem) => {
  auditModalRef.value?.acceptParams(row);
};

/** 监听年级变化，加载级部和班级选项 */
watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.departmentId = undefined;
      proTable.value.searchParam.classId = undefined;
    }
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;
    if (gradeId) await axiosGetDepartmentOptions(gradeId);
  }
);

/** 监听级部变化，加载班级选项 */
watch(
  () => proTable.value?.searchParam?.departmentId,
  async departmentId => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.classId = undefined;
    }
    classOptions.value.length = 0;
    const gradeId = proTable.value?.searchParam?.gradeId;
    if (gradeId && departmentId) await axiosGetClassOptions(gradeId, departmentId);
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="退款管理">
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
        <el-button v-if="row.status === REFUND_STATUS.PENDING" type="primary" link @click="onAudit(row)"> 审核 </el-button>
        <el-button type="primary" link @click="onShowDetail(row)">查看</el-button>
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
