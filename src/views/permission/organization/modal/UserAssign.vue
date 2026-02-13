<script setup lang="ts">
import type { ResPage, ResultData, System } from "@/api/interface";

import { computed, ref } from "vue";
import { getAdminUserListApi, putBatchUpdateAdminUsersOrgDepartmentApi } from "@/api/modules";
import type { TransferDataItem } from "element-plus";
import type { TransferOption, UserAssignParams } from "../types";
import { ElMessage } from "element-plus";

const emit = defineEmits<{ submit: [{ departmentId: number; userIds: number[] }] }>();

const visible = ref(false);
const loading = ref(false);
const saving = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
const departmentId = ref<number | null>(null);
const departmentName = ref("");
const allUsers = ref<System.AdminUser[]>([]);
const originUserIds = ref<number[]>([]);
const selectedUserIds = ref<number[]>([]);

/** 弹窗标题 */
const dialogTitle = computed(() => {
  const name = departmentName.value ? ` - ${departmentName.value}` : "";
  return `${parameter.value.title}${name}`;
});

const isView = computed(() => parameter.value.type === "View");

/** 构建穿梭框数据 */
const transferOptions = computed<TransferOption[]>(() => {
  return allUsers.value.map(user => ({
    key: user.id,
    label: user.realName ? `${user.realName} (${user.username})` : user.username
  }));
});

/** 过滤用户 */
const filterMethod = (query: string, option: TransferDataItem) => {
  if (!query) return true;
  const label = String(option.label ?? "");
  return label.toLowerCase().includes(query.toLowerCase());
};

/** 获取部门已分配用户ID */
function getDepartmentUserIds(targetDepartmentId: number) {
  return allUsers.value.filter(user => user.orgDepartmentId === targetDepartmentId).map(user => user.id);
}

/** 归一化用户ID */
function normalizeUserIds(userIds: number[]) {
  return Array.from(new Set(userIds));
}

/** 获取用户列表 */
async function axiosGetAdminUserListApi(): Promise<ResultData<ResPage<System.AdminUser>>> {
  if (loading.value) {
    return { code: -1, msg: "用户列表加载中", data: { list: [], page: 1, pageSize: 2000, total: 0 } };
  }
  loading.value = true;
  try {
    const result = await getAdminUserListApi({ page: 1, pageSize: 2000 });
    if (result.code === 0) {
      allUsers.value = result.data?.list || [];
    } else {
      allUsers.value = [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetAdminUserListApi:", error);
    allUsers.value = [];
    ElMessage.error("获取用户列表失败");
    return { code: -1, msg: "获取用户列表失败", data: { list: [], page: 1, pageSize: 2000, total: 0 } };
  } finally {
    loading.value = false;
  }
}

/** 接收参数 */
async function acceptParams(params: UserAssignParams) {
  parameter.value = { ...parameter.value, ...params };
  departmentId.value = params.departmentId;
  departmentName.value = params.departmentName;
  selectedUserIds.value = [];
  originUserIds.value = [];
  await axiosGetAdminUserListApi();
  if (departmentId.value) {
    const resolvedOriginUserIds = getDepartmentUserIds(departmentId.value);
    originUserIds.value = normalizeUserIds(resolvedOriginUserIds);
    const resolvedUserIds = Array.isArray(params.userIds) ? params.userIds : originUserIds.value;
    selectedUserIds.value = normalizeUserIds(resolvedUserIds ?? []);
  } else if (Array.isArray(params.userIds)) {
    selectedUserIds.value = normalizeUserIds(params.userIds);
  }
  visible.value = true;
}

/** 确认分配 */
async function handleSubmit() {
  if (!departmentId.value || saving.value) return;
  const currentDepartmentId = departmentId.value;
  const normalizedSelectedIds = normalizeUserIds(selectedUserIds.value);
  const normalizedOriginIds = normalizeUserIds(originUserIds.value);
  const originSet = new Set(normalizedOriginIds);
  const selectedSet = new Set(normalizedSelectedIds);
  const removedIds = normalizedOriginIds.filter(id => !selectedSet.has(id));
  const hasChange =
    normalizedSelectedIds.length !== normalizedOriginIds.length || normalizedSelectedIds.some(id => !originSet.has(id));

  if (!hasChange) {
    ElMessage.info("未检测到变更");
    visible.value = false;
    return;
  }

  saving.value = true;
  try {
    if (normalizedSelectedIds.length > 0) {
      await putBatchUpdateAdminUsersOrgDepartmentApi({
        userIds: normalizedSelectedIds,
        orgDepartmentId: currentDepartmentId
      });
    }
    if (removedIds.length > 0) {
      await putBatchUpdateAdminUsersOrgDepartmentApi({
        userIds: removedIds,
        orgDepartmentId: 0 // 0 表示清空部门
      });
    }
    originUserIds.value = [...normalizedSelectedIds];
    emit("submit", { departmentId: currentDepartmentId, userIds: [...normalizedSelectedIds] });
    ElMessage.success("分配成功");
    visible.value = false;
  } catch (error) {
    console.error("handleSubmit:", error);
    ElMessage.error("分配失败");
  } finally {
    saving.value = false;
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="720px" destroy-on-close draggable align-center>
    <div class="text-sm text-gray-500 mb-3">当前部门：{{ departmentName || "-" }}</div>
    <div v-loading="loading || saving" class="flex w-full items-center min-h-[300px]">
      <el-transfer
        v-model="selectedUserIds"
        :data="transferOptions"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜索用户"
        class="w-full"
        :disabled="isView"
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="saving" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-transfer) {
  display: flex;
  width: 100%;
}
:deep(.el-transfer-panel) {
  flex: 1;
  width: 0;
  min-width: 0;
}
:deep(.el-transfer__buttons) {
  flex: 0 0 auto;
  align-self: center;
}
</style>
