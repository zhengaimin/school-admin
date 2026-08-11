<!-- 学生详情弹窗，展示学生钱包汇总及各设备钱包明细。 -->
<script setup lang="ts">
import type { ResultData, Student } from "@/api/interface";

import { ref } from "vue";
import { getStudentDetailApi } from "@/api/modules";
import {
  DEVICE_TYPE_I18N,
  FACE_STATUS_I18N,
  STUDENT_SEX_I18N,
  STUDENT_STATUS_I18N,
  STUDENT_STATUS_TAG_TYPE,
  STUDENT_TYPE_I18N
} from "@/config/modules";

/** 弹窗可见 */
const visible = ref(false);
/** 详情数据 */
const detail = ref<Student.IStudentItemVo | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/**
 * 获取展示文本。
 * @param value 原始值
 * @returns 展示文本
 */
function getText(value: unknown) {
  if (value == null || value === "") return "--";
  return String(value);
}
/**
 * 获取设备类型文本。
 * @param row 钱包明细
 * @returns 设备类型文本
 */
function getDeviceTypeText(row: Student.IStudentWalletDetailVo) {
  return row.deviceTypeText || DEVICE_TYPE_I18N[row.deviceType] || "--";
}
/**
 * 获取套餐留言条数文本。
 * @param value 套餐留言条数
 * @returns 展示文本
 */
function getPackageMessageCountText(value: number) {
  if (value === -1) return "不限数量";
  return getText(value);
}

/**
 * 获取学生详情。
 * @param id 学生ID
 * @returns 接口结果
 */
async function axiosGetStudentDetailApi(id: number): Promise<ResultData<Student.ResGetStudentDetailApi | null>> {
  try {
    return await getStudentDetailApi(id);
  } catch (error) {
    console.error("axiosGetStudentDetailApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/**
 * 接收参数。
 * @param params 弹窗参数
 * @param row 当前行
 * @returns void
 */
async function acceptParams(params: TModalParams, row?: Student.IStudentItemVo) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  if (!row?.id) return;
  const result = await axiosGetStudentDetailApi(row.id);
  if (result.code === 0) {
    detail.value = result.data;
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="1120px" destroy-on-close draggable align-center>
    <div v-if="detail">
      <el-descriptions :column="3" border title="基础信息" class="mb-4">
        <el-descriptions-item label="学生姓名">{{ getText(detail.name) }}</el-descriptions-item>
        <el-descriptions-item label="唯一号">{{ getText(detail.uuid) }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ getText(detail.studentCode) }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detail.sex ? STUDENT_SEX_I18N[detail.sex] : "--" }}</el-descriptions-item>
        <el-descriptions-item label="学生类型">
          {{ detail.studentType ? STUDENT_TYPE_I18N[detail.studentType] : "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="detail.status != null" :type="STUDENT_STATUS_TAG_TYPE[detail.status]">
            {{ STUDENT_STATUS_I18N[detail.status] || "--" }}
          </el-tag>
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ getText(detail.idCard) }}</el-descriptions-item>
        <el-descriptions-item label="IC卡号">{{ getText(detail.cardNumber) }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ getText(detail.phone) }}</el-descriptions-item>
        <el-descriptions-item label="监护人姓名">{{ getText(detail.guardianName) }}</el-descriptions-item>
        <el-descriptions-item label="监护人电话">{{ getText(detail.guardianPhone) }}</el-descriptions-item>
        <el-descriptions-item label="人脸核验">
          {{ detail.faceStatus != null ? FACE_STATUS_I18N[detail.faceStatus] : "--" }}
        </el-descriptions-item>
        <el-descriptions-item label="学校">{{ getText(detail.schoolName) }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ getText(detail.gradeName) }}</el-descriptions-item>
        <el-descriptions-item label="级部">{{ getText(detail.departmentName) }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ getText(detail.className) }}</el-descriptions-item>
        <el-descriptions-item label="租户">{{ getText(detail.tenantName) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ getText(detail.createdAt) }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="3" border title="钱包汇总" class="mb-4">
        <el-descriptions-item label="总余额（元）">{{ getText(detail.walletSummary?.totalBalance) }}</el-descriptions-item>
        <el-descriptions-item label="可用余额（元）">{{ getText(detail.walletSummary?.availableBalance) }}</el-descriptions-item>
        <el-descriptions-item label="赠费余额（元）">{{ getText(detail.walletSummary?.giftBalance) }}</el-descriptions-item>
        <el-descriptions-item label="冻结余额（元）">{{ getText(detail.walletSummary?.frozenBalance) }}</el-descriptions-item>
        <el-descriptions-item label="赠送剩余分钟数">{{ getText(detail.walletSummary?.giftMinutes) }}</el-descriptions-item>
        <el-descriptions-item label="套餐剩余分钟数">{{ getText(detail.walletSummary?.packageMinutes) }}</el-descriptions-item>
      </el-descriptions>

      <el-table
        :data="detail.walletDetails || []"
        border
        class="detail-wallet-table"
        header-cell-class-name="detail-wallet-header-cell"
      >
        <el-table-column prop="deviceType" label="设备类型" min-width="120">
          <template #default="{ row }">{{ getDeviceTypeText(row) }}</template>
        </el-table-column>
        <el-table-column prop="totalBalance" label="总余额（元）" min-width="140" align="center" />
        <el-table-column prop="availableBalance" label="可用余额（元）" min-width="140" align="center" />
        <el-table-column prop="giftBalance" label="赠费余额（元）" min-width="140" align="center" />
        <el-table-column prop="frozenBalance" label="冻结余额（元）" min-width="140" align="center" />
        <el-table-column prop="giftMinutes" label="赠送剩余分钟数" min-width="140" align="center" />
        <el-table-column prop="giftMinutesUsed" label="赠送已使用分钟数" min-width="150" align="center" />
        <el-table-column prop="frozenGiftMinutes" label="冻结赠送分钟数" min-width="140" align="center" />
        <el-table-column prop="packageMinutes" label="套餐剩余分钟数" min-width="140" align="center" />
        <el-table-column prop="packageMinutesUsed" label="套餐已使用分钟数" min-width="150" align="center" />
        <el-table-column prop="frozenPackageMinutes" label="冻结套餐分钟数" min-width="140" align="center" />
        <el-table-column prop="packageMessageCount" label="套餐留言剩余条数" min-width="150" align="center">
          <template #default="{ row }">{{ getPackageMessageCountText(row.packageMessageCount) }}</template>
        </el-table-column>
        <el-table-column prop="packageMessageCountUsed" label="套餐留言已使用条数" min-width="160" align="center" />
        <el-table-column prop="frozenPackageMessageCount" label="冻结套餐留言条数" min-width="150" align="center" />
      </el-table>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.detail-wallet-header-cell .cell) {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
</style>
