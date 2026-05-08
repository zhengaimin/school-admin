<script setup lang="ts" name="hairdryerFundCardRecharge">
import type { DryerCardRecharge, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDryerCardRechargesApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DRYER_CARD_RECHARGE_STATUS_I18N,
  DRYER_CARD_RECHARGE_STATUS_OPTIONS,
  getDryerCardRechargeStatusTagType
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import ExportModal from "./modal/Export.vue";
import { buildCardRechargeExportAcceptPayload } from "./utils/payload";

const { schoolId, guardSchool } = useSchool();
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetDryerCardRechargesListApi });

/** 详情弹窗引用。 */
const detailModalRef = ref<InstanceType<typeof DetailModal>>();
/** 导出弹窗引用。 */
const exportModalRef = ref<InstanceType<typeof ExportModal>>();
/** 表格列配置。 */
const columns: ColumnProps<DryerCardRecharge.IDryerCardRechargeItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  {
    prop: "rechargeNo",
    label: "圈存单号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入圈存单号" } }
  },
  {
    prop: "studentKeyword",
    label: "学生",
    isShow: false,
    search: { el: "input", props: { placeholder: "姓名/学号" } }
  },
  { prop: "studentName", label: "学生姓名", minWidth: 100 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  {
    prop: "cardNumber",
    label: "卡号",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入卡号" } }
  },
  {
    prop: "terminalSn",
    label: "终端SN",
    minWidth: 150,
    search: { el: "input", props: { placeholder: "请输入终端SN" } }
  },
  {
    prop: "status",
    label: "状态",
    width: 120,
    enum: DRYER_CARD_RECHARGE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "amount", label: "圈存金额", width: 120, fixed: "right" },
  { prop: "requestedAt", label: "申请时间", minWidth: 160 },
  { prop: "resultReportedAt", label: "回传时间", minWidth: 160 },
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
    prop: "minAmount",
    label: "最小金额（元）",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入最小金额（元）" } }
  },
  {
    prop: "maxAmount",
    label: "最大金额（元）",
    isShow: false,
    search: { el: "input", props: { placeholder: "请输入最大金额（元）" } }
  },
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

/**
 * 规范化金额查询参数。
 * @param value 原始金额
 * @returns 合法金额
 */
function normalizeAmountValue(value: unknown) {
  if (value === "" || value == null) return undefined;
  const amount = Number(value);
  if (Number.isNaN(amount) || amount < 0) return undefined;
  return amount;
}

/**
 * 构建圈存记录查询参数。
 * @param params 原始参数
 * @returns 处理后的参数
 */
function buildDryerCardRechargeQueryParams(params: Record<string, any>): DryerCardRecharge.ReqGetDryerCardRechargesApi {
  const payload: Record<string, any> = { ...params };
  const minAmountYuan = normalizeAmountValue(payload.minAmount);
  const maxAmountYuan = normalizeAmountValue(payload.maxAmount);
  payload.minAmount = typeof minAmountYuan === "number" ? Math.round(minAmountYuan * 100) : undefined;
  payload.maxAmount = typeof maxAmountYuan === "number" ? Math.round(maxAmountYuan * 100) : undefined;
  if (payload.minAmount == null) delete payload.minAmount;
  if (payload.maxAmount == null) delete payload.maxAmount;
  return payload as DryerCardRecharge.ReqGetDryerCardRechargesApi;
}

/**
 * 获取吹风机圈存记录列表。
 * @param params 查询参数
 * @returns 列表结果
 */
async function axiosGetDryerCardRechargesListApi(
  params: Record<string, any>
): Promise<ResultData<DryerCardRecharge.ResGetDryerCardRechargesApi>> {
  try {
    return await getDryerCardRechargesApi(buildDryerCardRechargeQueryParams(params));
  } catch (error) {
    console.error("axiosGetDryerCardRechargesListApi:", error);
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

/** 打开详情弹窗。 */
function handleShowDetail(row: DryerCardRecharge.IDryerCardRechargeItem) {
  detailModalRef.value?.acceptParams({ title: "圈存记录详情", type: "View", showConfirm: false }, row);
}

/** 打开导出弹窗。 */
function handleExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  exportModalRef.value?.acceptParams({
    title: "批量导出",
    type: "View",
    showConfirm: true,
    ...buildCardRechargeExportAcceptPayload(searchParam, Number(schoolId.value))
  });
}

/** 监听学校变化。 */
watch(
  schoolId,
  () => {
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="圈存记录">
      <template #toolButton>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="getDryerCardRechargeStatusTagType(row.status)">
          {{ row.statusText || DRYER_CARD_RECHARGE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <template #amount="{ row }">
        <span class="amount">¥{{ (Number(row.amount || 0) / 100).toFixed(2) }}</span>
      </template>
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
