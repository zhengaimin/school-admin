<script setup lang="ts" name="videoCallRecord">
import type { CallRecord, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { h, ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getCallRecordsApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useSchool } from "@/hooks/useSchool";
import DetailModal from "./modal/Detail.vue";
import ExportModal from "./modal/Export.vue";

const { schoolId, guardSchool } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage({
  get: axiosGetCallRecordListApi
});

const detailModalRef = ref<InstanceType<typeof DetailModal> | null>(null);
const exportModalRef = ref<InstanceType<typeof ExportModal> | null>(null);
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

const columns: ColumnProps<CallRecord.ICallRecordItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 140 },
  { prop: "gradeName", label: "年级", minWidth: 100 },
  { prop: "departmentName", label: "级部", minWidth: 100 },
  { prop: "className", label: "班级", minWidth: 100 },
  {
    prop: "studentName",
    label: "学生姓名",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入学生姓名" } }
  },
  {
    prop: "deviceSn",
    label: "设备SN号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备SN号" } }
  },
  { prop: "usageTypeText", label: "扣费类型", width: 120 },
  { prop: "giftMinutes", label: "赠送通话剩余分钟数", width: 170 },
  { prop: "packageMinutes", label: "套餐通话剩余分钟数", width: 170 },
  {
    prop: "totalBalanceAfter",
    label: "总余额（元）",
    width: 120
  },
  {
    prop: "availableBalanceAfter",
    label: "可用余额（元）",
    width: 130
  },
  { prop: "amount", label: "实际扣费金额（元）", width: 160 },
  {
    prop: "totalBalanceBefore",
    label: "总余额（元）",
    width: 120,
    headerRender: () => renderWrappedHeader("总余额（元）\n（使用前）")
  },
  {
    prop: "availableBalanceBefore",
    label: "可用余额（元）",
    width: 130,
    headerRender: () => renderWrappedHeader("可用余额（元）\n（使用前）")
  },
  { prop: "callLenMinute", label: "通话时长（分钟）", width: 140 },
  { prop: "callStartTime", label: "开始时间", minWidth: 170 },
  { prop: "callEndTime", label: "结束时间", minWidth: 170 },
  { prop: "contactName", label: "联系人称呼", width: 130 },
  { prop: "phoneNumber", label: "被呼叫号码", width: 150 },
  { prop: "cardNumber", label: "物理卡号", minWidth: 150 },
  { prop: "packageMessageCount", label: "套餐留言剩余条数", width: 150 },
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
  {
    prop: "startTime",
    label: "开始时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "开始时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  {
    prop: "endTime",
    label: "结束时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "结束时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  { prop: "operation", label: "操作", width: 90, fixed: "right" }
];

/**
 * 构建查询参数。
 * @param params 原始参数
 * @returns 请求参数
 */
function buildCallRecordListParams(params: Record<string, any>): CallRecord.ReqGetCallRecordsApi {
  const payload: CallRecord.ReqGetCallRecordsApi = {
    page: Number(params.page ?? 1),
    pageSize: Number(params.pageSize ?? 10),
    studentName: params.studentName?.trim() || undefined,
    deviceSn: params.deviceSn?.trim() || undefined,
    startTime: params.startTime || undefined,
    endTime: params.endTime || undefined
  };

  if (params.schoolId != null && params.schoolId !== "") {
    payload.schoolId = Number(params.schoolId);
  }
  if (params.gradeId != null && params.gradeId !== "") {
    payload.gradeId = Number(params.gradeId);
  }
  if (params.departmentId != null && params.departmentId !== "") {
    payload.departmentId = Number(params.departmentId);
  }
  if (params.classId != null && params.classId !== "") {
    payload.classId = Number(params.classId);
  }

  return payload;
}

/**
 * 获取通话记录列表。
 * @param params 查询参数
 * @returns 列表结果
 */
async function axiosGetCallRecordListApi(params: Record<string, any>): Promise<ResultData<CallRecord.ResGetCallRecordsApi>> {
  try {
    const payload = buildCallRecordListParams(params);
    return await getCallRecordsApi(payload);
  } catch (error) {
    console.error("axiosGetCallRecordListApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: {
        list: [],
        total: 0,
        page: Number(params.page ?? 1),
        pageSize: Number(params.pageSize ?? 10)
      }
    } as unknown as ResultData<CallRecord.ResGetCallRecordsApi>;
  }
}

/**
 * 获取余额字段文案。
 * @param row 列表行
 * @param key 字段名
 * @returns 文案
 */
function getBalanceText(row: CallRecord.ICallRecordItem, key: keyof CallRecord.IStudentBalanceInfo) {
  if (!row.studentBalance) return "--";
  const value = row.studentBalance[key];
  if (value == null || value === "") return "--";
  return String(value);
}

/**
 * 渲染可换行表头。
 * @param text 表头文案
 * @returns 表头节点
 */
function renderWrappedHeader(text: string) {
  const lines = text.split("\n");
  const firstLine = lines[0] || "";
  const secondLine = lines[1] || "";
  const isBeforeLabel = secondLine.includes("使用前");

  return h(
    "span",
    {
      style: {
        lineHeight: "16px",
        display: "inline-block",
        textAlign: "center"
      }
    },
    [firstLine, h("br"), h("span", { style: { fontWeight: isBeforeLabel ? 700 : 400 } }, secondLine)]
  );
}

/**
 * 获取余额前后字段文案。
 * @param row 列表行
 * @param key 字段名
 * @returns 文案
 */
function getRecordBalanceText(
  row: CallRecord.ICallRecordItem,
  key: "totalBalanceBefore" | "totalBalanceAfter" | "availableBalanceBefore" | "availableBalanceAfter"
) {
  const value = row[key];
  if (value == null || value === "") return "--";
  return String(value);
}

/**
 * 获取套餐留言剩余条数文案。
 * @param row 列表行
 * @returns 文案
 */
function getPackageMessageCountText(row: CallRecord.ICallRecordItem) {
  if (!row.studentBalance) return "--";
  if (row.studentBalance.packageMessageCount === -1) return "不限数量";
  if (row.studentBalance.packageMessageCount == null) return "--";
  return String(row.studentBalance.packageMessageCount);
}

/**
 * 打开详情弹窗。
 * @param row 列表行
 */
function handleShowDetail(row: CallRecord.ICallRecordItem) {
  detailModalRef.value?.acceptParams({ title: "通话记录详情", type: "View", showConfirm: false }, row);
}

/** 打开导出弹窗。 */
function handleOpenExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};

  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    studentName: searchParam.studentName || "",
    startTime: searchParam.startTime || "",
    endTime: searchParam.endTime || "",
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

/** 监听年级变化，加载级部和班级选项。 */
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

/** 监听级部变化，加载班级选项。 */
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

/** 监听学校变化。 */
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="通话记录">
      <template #toolButton>
        <el-button type="primary" @click="handleOpenExport">导出</el-button>
      </template>

      <template #giftMinutes="{ row }">
        {{ getBalanceText(row, "giftMinutes") }}
      </template>

      <template #packageMinutes="{ row }">
        {{ getBalanceText(row, "packageMinutes") }}
      </template>

      <template #totalBalanceBefore="{ row }">
        {{ getRecordBalanceText(row, "totalBalanceBefore") }}
      </template>

      <template #totalBalanceAfter="{ row }">
        {{ getRecordBalanceText(row, "totalBalanceAfter") }}
      </template>

      <template #availableBalanceBefore="{ row }">
        {{ getRecordBalanceText(row, "availableBalanceBefore") }}
      </template>

      <template #availableBalanceAfter="{ row }">
        {{ getRecordBalanceText(row, "availableBalanceAfter") }}
      </template>

      <template #packageMessageCount="{ row }">
        {{ getPackageMessageCountText(row) }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">详情</el-button>
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
</style>
