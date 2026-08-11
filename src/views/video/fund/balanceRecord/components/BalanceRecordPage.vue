<!-- 学生余额账户页面，提供余额展示、模板下载和赠费余额导入入口。 -->
<script setup lang="ts">
import type { BalanceRecord, GiftBalance, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { Download, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getBalanceRecordsApi, getGiftBalanceTemplateApi } from "@/api/modules";
import {
  BALANCE_ACCOUNT_STATUS,
  BALANCE_ACCOUNT_STATUS_I18N,
  BALANCE_ACCOUNT_STATUS_OPTIONS,
  DEVICE_TYPE_I18N
} from "@/config/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useManage } from "@/hooks/useManage";
import { useDownload } from "@/hooks/useDownload";
import { useSchool } from "@/hooks/useSchool";
import DetailModal from "../modal/Detail.vue";
import ExportModal from "../modal/Export.vue";
import GiftBalanceImportModal from "../modal/GiftBalanceImport.vue";

const props = defineProps<{
  /** 设备类型 */
  deviceType: BalanceRecord.TBalanceRecordQueryDeviceTypeValue;
  /** 导出文件名 */
  exportFileName: string;
}>();

const { schoolId, guardSchool } = useSchool();
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetBalanceRecordsListApi });
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

/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof DetailModal>>();
/** 导出弹窗引用 */
const exportModalRef = ref<InstanceType<typeof ExportModal>>();
/** 赠费余额导入弹窗引用 */
const giftBalanceImportModalRef = ref<InstanceType<typeof GiftBalanceImportModal>>();
/** 赠费余额模板下载状态 */
const giftBalanceTemplateLoading = ref(false);
/** 表格列配置 */
const columns: ColumnProps<BalanceRecord.IBalanceRecordItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 140 },
  { prop: "gradeName", label: "年级", minWidth: 100 },
  { prop: "departmentName", label: "级部", minWidth: 100 },
  { prop: "className", label: "班级", minWidth: 100 },
  {
    prop: "studentKeyword",
    label: "学生",
    isShow: false,
    search: { el: "input", props: { placeholder: "姓名/学号/UUID" } }
  },
  {
    prop: "studentUuid",
    label: "学生UUID",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入学生UUID" } }
  },
  { prop: "studentName", label: "学生姓名", minWidth: 110 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "studentUuid", label: "学生UUID", minWidth: 180 },
  { prop: "totalBalance", label: "总余额（元）", width: 120 },
  { prop: "availableBalance", label: "可用余额（元）", width: 120 },
  { prop: "giftBalance", label: "赠费余额（元）", width: 120 },
  { prop: "frozenBalance", label: "冻结余额（元）", width: 120 },
  { prop: "giftMinutes", label: "赠送通话剩余分钟数", width: 170 },
  { prop: "packageMinutes", label: "套餐通话剩余分钟数", width: 170 },
  { prop: "packageMessageCount", label: "套餐留言剩余条数", width: 150 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    fixed: "right",
    enum: BALANCE_ACCOUNT_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "updatedAt", label: "更新时间", minWidth: 160 },
  {
    prop: "minBalance",
    label: "可用余额下限",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入余额下限" } }
  },
  {
    prop: "maxBalance",
    label: "可用余额上限",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入余额上限" } }
  },
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

/**
 * 获取文本。
 * @param value 原始值
 * @returns 展示文本
 */
function getText(value: unknown) {
  if (value == null || value === "") return "--";
  return String(value);
}

/** 转换可选筛选ID。 */
function getOptionalNumber(value: unknown) {
  if (value == null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

/**
 * 获取状态标签类型。
 * @param status 状态
 * @returns 标签类型
 */
function getStatusTagType(status: BalanceRecord.IBalanceRecordItem["status"]) {
  return status === BALANCE_ACCOUNT_STATUS.NORMAL ? "success" : "danger";
}

/**
 * 构建列表查询参数。
 * @param params 原始查询参数
 * @returns 请求参数
 */
function buildBalanceRecordListParams(params: Record<string, any>): BalanceRecord.ReqGetBalanceRecordsApi {
  return {
    page: Number(params.page ?? 1),
    pageSize: Number(params.pageSize ?? 10),
    deviceType: props.deviceType,
    studentKeyword: params.studentKeyword?.trim() || undefined,
    studentUuid: params.studentUuid?.trim() || undefined,
    status: params.status ?? undefined,
    schoolId: params.schoolId != null && params.schoolId !== "" ? Number(params.schoolId) : undefined,
    departmentId: params.departmentId != null && params.departmentId !== "" ? Number(params.departmentId) : undefined,
    gradeId: params.gradeId != null && params.gradeId !== "" ? Number(params.gradeId) : undefined,
    classId: params.classId != null && params.classId !== "" ? Number(params.classId) : undefined,
    minBalance: params.minBalance?.trim() || undefined,
    maxBalance: params.maxBalance?.trim() || undefined,
    startDate: params.startDate || undefined,
    endDate: params.endDate || undefined
  };
}

/** 构建赠费余额模板筛选参数。 */
function buildGiftBalanceTemplateParams(): GiftBalance.ReqGetGiftBalanceTemplateApi {
  const searchParam = proTable.value?.searchParam || {};
  const schoolValue = schoolId.value && schoolId.value !== "-1" ? getOptionalNumber(schoolId.value) : undefined;
  const studentKeyword = String(searchParam.studentKeyword ?? "").trim();
  const studentUuid = String(searchParam.studentUuid ?? "").trim();

  return {
    deviceType: props.deviceType,
    studentKeyword: studentKeyword || undefined,
    studentUuid: studentUuid || undefined,
    schoolId: schoolValue,
    departmentId: getOptionalNumber(searchParam.departmentId),
    gradeId: getOptionalNumber(searchParam.gradeId),
    classId: getOptionalNumber(searchParam.classId)
  };
}

/**
 * 获取余额账户列表。
 * @param params 查询参数
 * @returns 列表结果
 */
async function axiosGetBalanceRecordsListApi(
  params: Record<string, any>
): Promise<ResultData<BalanceRecord.ResGetBalanceRecordsApi>> {
  try {
    return await getBalanceRecordsApi(buildBalanceRecordListParams(params));
  } catch (error) {
    console.error("axiosGetBalanceRecordsListApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: {
        list: [],
        total: 0,
        page: Number(params.page ?? 1),
        pageSize: Number(params.pageSize ?? 10),
        totalPages: 0
      }
    };
  }
}

/**
 * 打开详情弹窗。
 * @param row 当前行
 */
function handleShowDetail(row: BalanceRecord.IBalanceRecordItem) {
  detailModalRef.value?.acceptParams({ title: "学生余额详情", type: "View", showConfirm: false }, row);
}

/** 打开导出弹窗 */
function handleOpenExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    deviceType: props.deviceType,
    exportFileName: props.exportFileName,
    studentKeyword: searchParam.studentKeyword || "",
    studentUuid: searchParam.studentUuid || "",
    status: searchParam.status ?? null,
    minBalance: searchParam.minBalance || "",
    maxBalance: searchParam.maxBalance || "",
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

/** 直接下载赠费余额更新模板。 */
async function handleDownloadGiftBalanceTemplate() {
  const total = Number(proTable.value?.pageable?.total ?? 0);
  if (!total) {
    ElMessage.warning("当前筛选条件下暂无可下载数据");
    return;
  }

  giftBalanceTemplateLoading.value = true;
  try {
    await useDownload(
      getGiftBalanceTemplateApi,
      `赠费余额更新模板_${DEVICE_TYPE_I18N[props.deviceType]}`,
      buildGiftBalanceTemplateParams(),
      false
    );
  } finally {
    giftBalanceTemplateLoading.value = false;
  }
}

/** 打开赠费余额导入弹窗。 */
function handleOpenGiftBalanceImport() {
  giftBalanceImportModalRef.value?.acceptParams({
    title: "导入赠费余额",
    type: "View",
    showConfirm: false,
    deviceType: props.deviceType
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
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学生余额">
      <template #toolButton>
        <el-button type="primary" @click="handleOpenExport">导出</el-button>
        <el-button
          type="primary"
          :icon="Download"
          :loading="giftBalanceTemplateLoading"
          @click="handleDownloadGiftBalanceTemplate"
        >
          下载赠费模板
        </el-button>
        <el-button type="success" :icon="Upload" @click="handleOpenGiftBalanceImport">导入赠费余额</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.status)">
          {{ row.statusText || BALANCE_ACCOUNT_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <template #giftMinutes="{ row }">
        {{ getText(row.giftMinutes) }}
      </template>
      <template #packageMinutes="{ row }">
        {{ getText(row.packageMinutes) }}
      </template>
      <template #packageMessageCount="{ row }">
        {{ row.packageMessageCount === -1 ? "不限数量" : getText(row.packageMessageCount) }}
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
    <ExportModal ref="exportModalRef" />
    <GiftBalanceImportModal ref="giftBalanceImportModalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
