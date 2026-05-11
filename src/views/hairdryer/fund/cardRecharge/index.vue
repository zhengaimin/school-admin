<script setup lang="ts" name="hairdryerFundCardRecharge">
import type { DryerCardRecharge, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import {
  getDryerCardRechargesApi,
  postConfirmDryerCardRechargeFailedApi,
  postConfirmDryerCardRechargeSuccessApi
} from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DRYER_CARD_RECHARGE_STATUS,
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
/** 人工处理弹窗显示状态。 */
const manualConfirmVisible = ref(false);
/** 人工处理提交状态。 */
const manualConfirmLoading = ref(false);
/** 人工处理目标状态。 */
const manualConfirmType = ref<"success" | "failed">("success");
/** 人工处理当前行。 */
const manualConfirmRow = ref<DryerCardRecharge.IDryerCardRechargeItem>();
/** 人工处理原因。 */
const manualConfirmReason = ref("");
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
    search: { el: "select", props: { placeholder: "请选择状态" } },
    fixed: "right"
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
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
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
 * 判断是否允许人工切换状态。
 * @param row 当前行
 * @returns 是否允许操作
 */
function canManualConfirm(row: DryerCardRecharge.IDryerCardRechargeItem) {
  return row.status === DRYER_CARD_RECHARGE_STATUS.WAIT_WRITE;
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

/**
 * 人工确认圈存成功。
 * @param row 当前行
 * @param reason 人工处理原因
 * @returns 接口结果
 */
async function axiosPostConfirmDryerCardRechargeSuccessApi(row: DryerCardRecharge.IDryerCardRechargeItem, reason: string) {
  try {
    return await postConfirmDryerCardRechargeSuccessApi(row.id, { reason });
  } catch (error) {
    console.error("axiosPostConfirmDryerCardRechargeSuccessApi:", error);
    return { code: -1, data: null };
  }
}

/**
 * 人工确认圈存失败。
 * @param row 当前行
 * @param reason 人工处理原因
 * @returns 接口结果
 */
async function axiosPostConfirmDryerCardRechargeFailedApi(row: DryerCardRecharge.IDryerCardRechargeItem, reason: string) {
  try {
    return await postConfirmDryerCardRechargeFailedApi(row.id, { reason });
  } catch (error) {
    console.error("axiosPostConfirmDryerCardRechargeFailedApi:", error);
    return { code: -1, data: null };
  }
}

/**
 * 打开详情弹窗。
 * @param row 当前行
 * @returns void
 */
function handleShowDetail(row: DryerCardRecharge.IDryerCardRechargeItem) {
  detailModalRef.value?.acceptParams({ title: "圈存记录详情", type: "View", showConfirm: false }, row);
}

/**
 * 打开人工处理弹窗。
 * @param row 当前行
 * @param type 处理类型
 * @returns void
 */
function handleOpenManualConfirm(row: DryerCardRecharge.IDryerCardRechargeItem, type: "success" | "failed") {
  if (!canManualConfirm(row)) {
    ElMessage.warning("只有待写卡状态才能手动切换状态");
    return;
  }
  manualConfirmType.value = type;
  manualConfirmRow.value = row;
  manualConfirmReason.value = "";
  manualConfirmVisible.value = true;
}

/**
 * 人工确认圈存成功。
 * @param row 当前行
 * @returns void
 */
function handleConfirmSuccess(row: DryerCardRecharge.IDryerCardRechargeItem) {
  handleOpenManualConfirm(row, "success");
}

/**
 * 人工确认圈存失败。
 * @param row 当前行
 * @returns void
 */
function handleConfirmFailed(row: DryerCardRecharge.IDryerCardRechargeItem) {
  handleOpenManualConfirm(row, "failed");
}

/**
 * 关闭人工处理弹窗。
 * @returns void
 */
function handleCloseManualConfirm() {
  if (manualConfirmLoading.value) return;
  manualConfirmVisible.value = false;
  manualConfirmRow.value = undefined;
  manualConfirmReason.value = "";
}

/**
 * 提交人工处理。
 * @returns void
 */
async function handleSubmitManualConfirm() {
  const row = manualConfirmRow.value;
  const reason = manualConfirmReason.value.trim();
  if (!row) return;
  if (!reason) {
    ElMessage.warning("请输入人工处理原因");
    return;
  }
  manualConfirmLoading.value = true;
  try {
    const result =
      manualConfirmType.value === "success"
        ? await axiosPostConfirmDryerCardRechargeSuccessApi(row, reason)
        : await axiosPostConfirmDryerCardRechargeFailedApi(row, reason);
    if (result.code !== 0) return;
    ElMessage.success(result.data?.message || (manualConfirmType.value === "success" ? "确认成功" : "确认失败已提交"));
    manualConfirmVisible.value = false;
    refreshTableList();
  } finally {
    manualConfirmLoading.value = false;
  }
}

/**
 * 打开导出弹窗。
 * @returns void
 */
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
        <br />
        <template v-if="canManualConfirm(row)">
          <el-button type="success" link @click="handleConfirmSuccess(row)">确认成功</el-button>
          <el-button type="danger" link @click="handleConfirmFailed(row)">确认失败</el-button>
        </template>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
    <ExportModal ref="exportModalRef" />
    <el-dialog
      v-model="manualConfirmVisible"
      :title="manualConfirmType === 'success' ? '人工确认圈存成功' : '人工确认圈存失败'"
      width="480px"
      destroy-on-close
      draggable
      align-center
      :close-on-click-modal="!manualConfirmLoading"
      :close-on-press-escape="!manualConfirmLoading"
      :show-close="!manualConfirmLoading"
      @close="handleCloseManualConfirm"
    >
      <el-form label-position="top">
        <el-form-item label="圈存单号">
          <el-input :model-value="manualConfirmRow?.rechargeNo || '--'" disabled />
        </el-form-item>
        <el-form-item label="人工处理原因" required>
          <el-input
            v-model="manualConfirmReason"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入人工处理原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="manualConfirmLoading" @click="handleCloseManualConfirm">取消</el-button>
        <el-button type="primary" :loading="manualConfirmLoading" @click="handleSubmitManualConfirm">确定</el-button>
      </template>
    </el-dialog>
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
