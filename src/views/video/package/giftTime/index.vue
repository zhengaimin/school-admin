<script setup lang="ts" name="videoGiftTime">
import type { Gift } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { TGiftStatusValue } from "@/config/modules";
import type { TGiftTimeMode } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { deleteGiftApi, getGiftsApi, postGiftsBatchCancelApi } from "@/api/modules";
import {
  DEVICE_TYPE,
  GIFT_SOURCE,
  GIFT_STATUS,
  GIFT_STATUS_I18N,
  GIFT_STATUS_OPTIONS,
  GIFT_STATUS_TAG_TYPE
} from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import GiftTimeModal from "./modal/GiftTime.vue";

const { isAllSchools, schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage({
  get: getGiftTimeListApi
});

const modalRef = ref<InstanceType<typeof GiftTimeModal> | null>(null);
const selectedGiftRows = ref<Gift.IGiftItemVo[]>([]);

const columns: ColumnProps<Gift.IGiftItemVo>[] = [
  { type: "selection", width: 55, fixed: "left" },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 120 },
  { prop: "studentName", label: "学生", minWidth: 100 },
  { prop: "studentCode", label: "学号", minWidth: 140 },
  {
    prop: "sort",
    label: "学号排序",
    isShow: false,
    enum: [
      { label: "正序", value: "student_no-asc" },
      { label: "倒序", value: "student_no-desc" }
    ],
    search: { el: "select", defaultValue: "student_no-asc", props: { placeholder: "请选择学号排序", clearable: true } }
  },
  { prop: "totalMinutes", label: "总赠送分钟数", width: 120 },
  { prop: "usedMinutes", label: "已使用分钟数", width: 120 },
  { prop: "remainingMinutes", label: "剩余分钟数", width: 120 },
  { prop: "startDate", label: "生效时间", width: 170 },
  { prop: "expireDate", label: "过期时间", width: 170 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: GIFT_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态", clearable: true } }
  },
  { prop: "description", label: "描述", minWidth: 180 },
  { prop: "operation", label: "操作", width: 100, fixed: "right" }
];

async function getGiftTimeListApi(params: Gift.ReqGetGiftsApi) {
  const schoolIdValue = params.schoolId ? Number(params.schoolId) : undefined;
  const studentCodeSort = proTable.value?.searchParam?.sort;
  return await getGiftsApi({
    ...params,
    schoolId: schoolIdValue,
    sort: studentCodeSort || params.sort,
    source: GIFT_SOURCE.ADMIN_GIFT,
    deviceType: DEVICE_TYPE.VIDEO
  });
}

/** 取消赠费 */
async function axiosDeleteGiftApi(params: Gift.ReqCancelGiftApi) {
  try {
    return await deleteGiftApi(params);
  } catch (error) {
    console.error("axiosDeleteGiftApi:", error);
    return { code: -1, msg: "", data: null };
  }
}
/** 批量取消赠费 */
async function axiosPostGiftsBatchCancelApi(data: Gift.ReqPostGiftsBatchCancelApi) {
  try {
    return await postGiftsBatchCancelApi(data);
  } catch (error) {
    console.error("axiosPostGiftsBatchCancelApi:", error);
    return { code: -1, msg: "", data: null };
  }
}

/** 显示新增弹窗 */
function handleShowModal(mode: TGiftTimeMode) {
  if (isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }
  modalRef.value?.acceptParams({
    title: mode === 1 ? "批量添加赠费" : "选择学生赠费",
    type: "Add",
    showConfirm: true,
    mode
  });
}
/** 取消赠送 */
async function handleDeleteRow(row: Gift.IGiftItemVo) {
  const action = await ElMessageBox.confirm("确定取消赠送吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch(() => null);
  if (!action) return;
  const result = await axiosDeleteGiftApi({ id: row.id });
  if (result.code === 0) {
    ElMessage.success("操作成功");
    refreshTableList();
  }
}
/** 批量取消赠送 */
async function handleBatchCancel() {
  if (!selectedGiftRows.value.length) return;
  const action = await ElMessageBox.confirm("确定取消赠送吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch(() => null);
  if (!action) return;
  const result = await axiosPostGiftsBatchCancelApi({
    giftIds: selectedGiftRows.value.map(item => item.id)
  });
  if (result.code === 0) {
    ElMessage.success("操作成功");
    selectedGiftRows.value = [];
    proTable.value?.clearSelection?.();
    refreshTableList();
  }
}
function handleSelectionChange(rows: Gift.IGiftItemVo[]) {
  selectedGiftRows.value = rows;
}
function handleSubmitSuccess() {
  refreshTableList();
}

watch(schoolId, () => {
  selectedGiftRows.value = [];
  refreshTableList();
});
</script>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      table-header="赠送时长信息"
      @selection-change="handleSelectionChange"
    >
      <template #toolButton>
        <el-button :disabled="selectedGiftRows.length === 0" type="primary" @click="handleBatchCancel">批量取消赠费</el-button>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal(1)">批量添加赠费</el-button>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal(2)">选择学生赠费</el-button>
      </template>

      <template #status="{ row }">
        <el-tag :type="GIFT_STATUS_TAG_TYPE[row.status as TGiftStatusValue]">
          {{ row.statusText || GIFT_STATUS_I18N[row.status as TGiftStatusValue] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button :disabled="row.status !== GIFT_STATUS.VALID" type="danger" link @click="handleDeleteRow(row)">
          取消赠送
        </el-button>
      </template>
    </ProTable>

    <GiftTimeModal ref="modalRef" @submit="handleSubmitSuccess" />
  </div>
</template>

<style lang="scss" scoped>
@import "./index";
</style>
