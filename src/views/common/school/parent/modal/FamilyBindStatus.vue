<script setup lang="ts">
import type { FamilyBindStatus } from "@/api/interface";

import { ref } from "vue";
import { getFamilyBindStatusSubscriptionsApi } from "@/api/modules";
import { getWechatBoundStatusText } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

/** 弹窗是否显示 */
const visible = ref(false);
/** 弹窗加载状态 */
const modalLoading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 当前行数据 */
const currentRow = ref<FamilyBindStatus.IFamilyBindStatusItemVo>();
/** 订阅设备组列表 */
const subscriptionList = ref<FamilyBindStatus.IFamilySubscriptionItemVo[]>([]);

/** 重置弹窗状态 */
function resetModalState() {
  currentRow.value = undefined;
  subscriptionList.value = [];
}

/** 获取订阅设备组列表 */
async function axiosGetFamilyBindStatusSubscriptionsApi(id: number) {
  modalLoading.value = true;
  try {
    const result = await getFamilyBindStatusSubscriptionsApi(id);
    if (result.code === 0) {
      subscriptionList.value = result.data?.list || [];
    } else {
      subscriptionList.value = [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetFamilyBindStatusSubscriptionsApi:", error);
    subscriptionList.value = [];
    return { code: -1, data: null };
  } finally {
    modalLoading.value = false;
  }
}

/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: FamilyBindStatus.IFamilyBindStatusItemVo) {
  parameter.value = { ...parameter.value, ...params };
  resetModalState();
  if (row) {
    currentRow.value = row;
  }
  if (!isNullOrUnDef(row?.userId)) {
    await axiosGetFamilyBindStatusSubscriptionsApi(row.userId);
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    v-loading="modalLoading"
    :title="parameter.title"
    width="760px"
    destroy-on-close
    draggable
    align-center
  >
    <el-descriptions :column="2" border class="mb-4">
      <el-descriptions-item label="学生姓名">
        {{ currentRow?.studentName || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="学生唯一号">
        {{ currentRow?.uuid || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="年级">
        {{ currentRow?.gradeName || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="班级">
        {{ currentRow?.className || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="家长姓名">
        {{ currentRow?.parentName || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="称谓">
        {{ currentRow?.relation || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">
        {{ currentRow?.phone || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="主联系人">
        <el-tag v-if="currentRow" :type="currentRow.isPrimary ? 'success' : 'info'">
          {{ currentRow.isPrimary ? "主联系人" : "非主联系人" }}
        </el-tag>
        <span v-else>--</span>
      </el-descriptions-item>
      <el-descriptions-item label="微信绑定">
        <el-tag v-if="currentRow" :type="currentRow.wechatBound ? 'success' : 'info'">
          {{ getWechatBoundStatusText(currentRow.wechatBound) }}
        </el-tag>
        <span v-else>--</span>
      </el-descriptions-item>
      <el-descriptions-item label="绑定时间">
        {{ currentRow?.wechatBindTime || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="订阅设备组数">
        {{ currentRow?.subscribedGroupCount ?? "--" }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="text-sm font-medium text-gray-700">订阅设备组</div>
    <el-table :data="subscriptionList" class="mt-2 w-full">
      <el-table-column label="设备组ID" prop="groupId" width="120" />
      <el-table-column label="设备组名称" prop="groupName" />
    </el-table>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>
