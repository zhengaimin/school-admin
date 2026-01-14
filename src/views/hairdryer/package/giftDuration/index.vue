<script setup lang="ts" name="hairdryerGiftDuration">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { GiftGrantMode, GiftRow, OptionItem, StudentItem } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { useManage } from "@/hooks/useManage";
import { useSelection } from "@/hooks/useSelection";
import { getGiftsApi, deleteGiftApi, postGiftsBatchCancelApi } from "@/api/modules";
import GrantGiftModal from "./modal/GrantGift.vue";
import StudentSelectModal from "./modal/StudentSelect.vue";
import {
  DEVICE_TYPE,
  GIFT_STATUS_OPTIONS,
  GIFT_STATUS_I18N,
  GIFT_STATUS_TAG_TYPE,
  type TGiftStatusValue
} from "@/config/modules";

const { schoolId, guardSchool } = useSchool();
const { selectedList, selectionChange } = useSelection("id");

/** 表格列配置 */
const columns: ColumnProps<GiftRow>[] = [
  { type: "selection", width: 50, fixed: "left" },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 120 },
  { prop: "studentName", label: "学生", minWidth: 90 },
  { prop: "totalMinutes", label: "总赠送分钟数", width: 90 },
  { prop: "usedMinutes", label: "已使用分钟数", width: 90 },
  { prop: "remainingMinutes", label: "剩余分钟数", width: 90 },
  { prop: "startDate", label: "生效时间", width: 160 },
  { prop: "expireDate", label: "过期时间", width: 160 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: GIFT_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态", clearable: true } }
  },
  { prop: "description", label: "描述", minWidth: 180 },
  { prop: "operation", label: "操作", width: 120, fixed: "right" }
];

const getGiftDurationListApi = async (params: Record<string, any>) => {
  // 规范化 schoolId（useManage 注入的是字符串，API 期望数字）
  const normalizedSchoolId = params?.schoolId ? Number(params.schoolId) : undefined;

  const result = await getGiftsApi({
    ...params,
    schoolId: normalizedSchoolId,
    deviceType: DEVICE_TYPE.DRYER
  });

  return result;
};

/** 使用 useManage hook 管理表格数据 */
const { proTable, axiosGetTableList, refreshTableList } = useManage({
  get: getGiftDurationListApi
});

/** 赠费弹窗可见状态 */
const grantDialogVisible = ref(false);
/** 学生选择弹窗可见状态 */
const studentDialogVisible = ref(false);
/** 赠费模式 */
const grantMode = ref<GiftGrantMode>("range");
/** 已选择的学生 */
const studentSelected = ref<StudentItem[]>([]);
/** 学生选择弹窗使用的年级选项（从 GrantGift 传递） */
const studentGradeOptions = ref<OptionItem[]>([]);

/** 打开赠费弹窗（按范围 / 按学生） */
const openGrantModal = (mode: GiftGrantMode): void => {
  if (!guardSchool()) return;
  grantMode.value = mode;
  grantDialogVisible.value = true;
};
/** 打开学生选择弹窗 */
const handleOpenStudentDialog = (gradeOptions: OptionItem[]): void => {
  studentGradeOptions.value = gradeOptions;
  studentDialogVisible.value = true;
};
/** 赠费提交成功回调 */
const handleGrantSubmitted = (): void => {
  studentSelected.value = [];
  refreshTableList();
};
/** 取消单个赠送 */
const handleCancelGift = async (row: GiftRow): Promise<void> => {
  if (row.status !== 1) return;

  try {
    await ElMessageBox.confirm("确定取消赠送吗？", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    const result = await deleteGiftApi({ id: row.id });
    if (result.code !== 0) throw new Error(result.msg || "请求失败");

    ElMessage.success("操作成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel" && error instanceof Error) {
      ElMessage.error(error.message || "操作失败，请重试");
    }
  }
};
/** 批量取消赠送 */
const handleBatchCancelGift = async (): Promise<void> => {
  const validItems = (selectedList.value as GiftRow[]).filter(item => item.status === 1);
  if (validItems.length === 0) {
    ElMessage.warning("请选择有效的赠送记录");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定取消选中的 ${validItems.length} 条赠送记录吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    const result = await postGiftsBatchCancelApi({ giftIds: validItems.map(item => item.id) });
    if (result.code !== 0) throw new Error(result.msg || "请求失败");

    ElMessage.success(`成功取消 ${result.data?.successCount ?? 0} 条记录`);
    proTable.value?.clearSelection?.();
    refreshTableList();
  } catch (error) {
    if (error !== "cancel" && error instanceof Error) {
      ElMessage.error(error.message || "操作失败，请重试");
    }
  }
};

/** 监听学校切换，重置状态并刷新列表 */
watch(
  schoolId,
  () => {
    studentSelected.value = [];
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      table-header="赠送时长"
      @selection-change="selectionChange"
    >
      <!-- 表格头部按钮 -->
      <template #toolButton>
        <el-button type="danger" @click="handleBatchCancelGift">批量取消</el-button>
        <el-button type="primary" :icon="CirclePlus" @click="openGrantModal('range')">按范围添加</el-button>
        <el-button type="primary" plain :icon="CirclePlus" @click="openGrantModal('students')">按学生添加</el-button>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <el-tag :type="GIFT_STATUS_TAG_TYPE[row.status as TGiftStatusValue]">
          {{ GIFT_STATUS_I18N[row.status as TGiftStatusValue] }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="danger" link :disabled="row.status !== 1" @click="handleCancelGift(row)">取消赠送</el-button>
      </template>
    </ProTable>

    <!-- 赠费弹窗 -->
    <GrantGiftModal
      v-model="grantDialogVisible"
      v-model:students="studentSelected"
      :mode="grantMode"
      @select-students="handleOpenStudentDialog"
      @submitted="handleGrantSubmitted"
    />

    <!-- 学生选择弹窗 -->
    <StudentSelectModal v-model="studentDialogVisible" v-model:selected="studentSelected" :grade-options="studentGradeOptions" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
