<script setup lang="ts">
import type { ResPage, ResultData, School, System } from "@/api/interface";
import type { DataScopeParams, DataScopeType, TransferSourceItem } from "../types";

import { computed, ref, unref } from "vue";
import {
  getAdminUserDetailApi,
  getSchoolsListApi,
  getTenantListApi,
  getUserDataScopeApi,
  putSetUserDataScopeApi
} from "@/api/modules";
import { ElMessage } from "element-plus";
import { DATA_SCOPE_TYPE, TENANT_TYPE } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";
import { buildDataScopeAcceptPayload } from "../utils/payload";

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗加载状态 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<{ title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean }>({
  title: "",
  type: "Edit",
  showConfirm: true
});
/** 数据权限类型 */
const scopeType = ref<DataScopeType>(DATA_SCOPE_TYPE.SCHOOL);
/** 当前租户 ID */
const tenantId = ref<number | undefined>(undefined);
/** 租户列表 */
const tenantList = ref<System.Tenant[]>([]);
/** 租户列表加载状态 */
const tenantLoading = ref(false);
/** 当前用户 ID */
const userId = ref<number>(0);
/** 当前用户姓名 */
const userName = ref("");
/** 租户名称 */
const tenantName = ref("");
/** 可选数据权限列表 */
const allScopeOptions = ref<{ key: number; label: string }[]>([]);
/** 已选数据权限 ID */
const selectedScopeIds = ref<number[]>([]);
/** 学校列表缓存 */
const schoolList = ref<TransferSourceItem[]>([]);
/** 弹窗标题 */
const dialogTitle = computed(() => {
  const currentUserName = unref(userName);
  const nameText = currentUserName ? ` - ${currentUserName}` : "";
  return `${unref(parameter).title}${nameText}`;
});
/** 是否为供应商权限 */
const isTenantScope = computed(() => unref(scopeType) === DATA_SCOPE_TYPE.TENANT);
/** 是否为学校权限 */
const isSchoolScope = computed(() => unref(scopeType) === DATA_SCOPE_TYPE.SCHOOL);
/** 权限名称 */
const scopeName = computed(() => (unref(isTenantScope) ? "供应商" : "学校"));
/** 穿梭框标题 */
const transferTitles = computed<[string, string]>(() => [`可选${unref(scopeName)}`, `已选${unref(scopeName)}`]);
/** 搜索占位 */
const transferPlaceholder = computed(() => `搜索${unref(scopeName)}`);
/** 租户选项 */
const tenantOptions = computed(() => unref(tenantList).filter(tenant => tenant.type === TENANT_TYPE.AGENT));
/** 是否已选择租户 */
const isTenantSelected = computed(() => !isNullOrUnDef(unref(tenantId)));
const isView = computed(() => parameter.value.type === "View");

/** 构建穿梭框数据 */
function buildTransferData(schools: TransferSourceItem[]) {
  return schools.map(school => ({
    key: school.id,
    label: school.name ?? "-"
  }));
}

/** 同步权限列表 */
function syncScopeOptions(list: TransferSourceItem[], resetSelected: boolean) {
  allScopeOptions.value = buildTransferData(list);
  if (resetSelected) {
    selectedScopeIds.value = [];
    return;
  }
  const scopeKeySet = new Set(allScopeOptions.value.map(item => item.key));
  selectedScopeIds.value = selectedScopeIds.value.filter(key => scopeKeySet.has(key));
}

/** 同步租户学校列表 */
function syncTenantSchools(resetSelected: boolean) {
  const currentTenantId = unref(tenantId);
  if (isNullOrUnDef(currentTenantId)) {
    allScopeOptions.value = [];
    if (resetSelected) {
      selectedScopeIds.value = [];
    }
    return;
  }
  const cachedList = unref(schoolList).filter(item => item.tenantId === currentTenantId);
  syncScopeOptions(cachedList, resetSelected);
}

/** 同步供应商列表 */
function syncTenantScopeOptions(resetSelected: boolean) {
  syncScopeOptions(unref(tenantOptions), resetSelected);
}

/** 获取租户列表 */
async function axiosGetTenantListApi(): Promise<ResultData<ResPage<System.Tenant>>> {
  if (unref(tenantLoading)) {
    return {
      code: -1,
      msg: "租户列表加载中",
      data: { list: [], page: 1, pageSize: 2000, total: 0 }
    };
  }
  tenantLoading.value = true;
  try {
    const result = await getTenantListApi({ page: 1, pageSize: 2000 });
    if (result.code === 0) {
      tenantList.value = result.data?.list || [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetTenantListApi:", error);
    ElMessage.error("获取租户列表失败");
    return {
      code: -1,
      msg: "获取租户列表失败",
      data: { list: [], page: 1, pageSize: 2000, total: 0 }
    };
  } finally {
    tenantLoading.value = false;
  }
}

/** 获取用户当前的数据权限 */
async function axiosGetUserDataScopeApi(id: number): Promise<ResultData<System.ResGetUserDataScopeApi | null>> {
  try {
    const result = await getUserDataScopeApi(id);
    if (result.code === 0) {
      const scopeIds = unref(isTenantScope) ? result.data?.tenantIds : result.data?.schoolIds;
      selectedScopeIds.value = Array.isArray(scopeIds) ? scopeIds : [];
    } else {
      selectedScopeIds.value = [];
      ElMessage.error("获取数据权限失败");
    }
    return result;
  } catch (error) {
    console.error("axiosGetUserDataScopeApi:", error);
    selectedScopeIds.value = [];
    ElMessage.error("获取数据权限失败");
    return { code: -1, msg: "获取数据权限失败", data: null };
  }
}

/** 获取用户详情 */
async function axiosGetAdminUserDetailApi(id: number): Promise<ResultData<System.AdminUser | null>> {
  try {
    const result = await getAdminUserDetailApi(id);
    if (result.code === 0 && result.data) {
      const detail = result.data as System.AdminUser & { tenantName?: string };
      tenantName.value = detail.tenantName ?? "";
      if (isNullOrUnDef(unref(tenantId)) && !isNullOrUnDef(detail.tenantId)) {
        tenantId.value = detail.tenantId;
      }
    } else {
      tenantName.value = "";
    }
    return result;
  } catch (error) {
    console.error("axiosGetAdminUserDetailApi:", error);
    tenantName.value = "";
    return { code: -1, msg: "获取用户信息失败", data: null };
  }
}

/** 获取租户下的学校列表 */
async function axiosGetTenantSchoolsApi(resetSelected = false): Promise<ResultData<School.ResSchoolsListData | null>> {
  try {
    const result = await getSchoolsListApi(
      {
        page: 1,
        pageSize: 2000
      },
      {
        loading: false
      }
    );
    if (result.code === 0) {
      schoolList.value = result.data?.list ?? [];
      syncTenantSchools(resetSelected);
    } else {
      schoolList.value = [];
      allScopeOptions.value = [];
      if (resetSelected) {
        selectedScopeIds.value = [];
      }
      ElMessage.error("获取学校列表失败");
    }
    return result;
  } catch (error) {
    console.error("axiosGetTenantSchoolsApi:", error);
    schoolList.value = [];
    allScopeOptions.value = [];
    if (resetSelected) {
      selectedScopeIds.value = [];
    }
    ElMessage.error("获取学校列表失败");
    return { code: -1, msg: "获取学校列表失败", data: null };
  }
}
/** 设置用户的数据权限 */
async function axiosPutSetUserDataScopeApi(id: number): Promise<ResultData<null>> {
  try {
    const params: System.ReqUserDataScopeSave = {
      scopeType: unref(scopeType),
      ...(unref(isTenantScope) ? { tenantIds: unref(selectedScopeIds) } : { schoolIds: unref(selectedScopeIds) })
    };
    const result = await putSetUserDataScopeApi(id, params, { loading: false });
    if (result.code === 0) {
      ElMessage.success("数据权限保存成功");
    }
    return result as ResultData<null>;
  } catch (error) {
    console.error("axiosPutSetUserDataScopeApi:", error);
    return { code: -1, msg: "保存数据权限失败", data: null };
  }
}

/** 接收参数 */
async function acceptParams(params: DataScopeParams) {
  const currentParameter = unref(parameter);
  const payload = buildDataScopeAcceptPayload(params);
  parameter.value = {
    ...currentParameter,
    ...payload.parameter
  };
  scopeType.value = payload.scopeType;
  userId.value = payload.userId;
  userName.value = payload.userName;
  tenantId.value = payload.tenantId;
  selectedScopeIds.value = [];
  allScopeOptions.value = [];
  schoolList.value = [];
  tenantName.value = "";
  loading.value = true;

  try {
    await axiosGetUserDataScopeApi(unref(userId));
    if (unref(isSchoolScope)) {
      await axiosGetAdminUserDetailApi(unref(userId));
    }
    if (unref(isTenantScope)) {
      await axiosGetTenantListApi();
    }

    if (unref(isSchoolScope) && unref(isTenantSelected)) {
      await axiosGetTenantSchoolsApi(false);
    }

    if (unref(isTenantScope)) {
      syncTenantScopeOptions(false);
    }
  } finally {
    loading.value = false;
    visible.value = true;
  }
}

/** 提交保存 */
async function handleSubmit() {
  if (unref(loading)) return;
  if (unref(isSchoolScope) && !unref(isTenantSelected)) {
    ElMessage.warning("请选择租户");
    return;
  }
  loading.value = true;
  try {
    const result = await axiosPutSetUserDataScopeApi(unref(userId));
    if (result.code !== 0) return;
    visible.value = false;
  } finally {
    loading.value = false;
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="720px" destroy-on-close draggable align-center>
    <div v-if="isSchoolScope" class="p-3 bg-gray-100 rounded-md">
      租户名称：<span class="font-bold text-blue-500">{{ tenantName || "-" }}</span>
    </div>

    <div v-loading="loading" class="flex w-full items-center min-h-[300px] py-5">
      <el-transfer
        v-model="selectedScopeIds"
        :data="allScopeOptions"
        :titles="transferTitles"
        :filter-placeholder="transferPlaceholder"
        filterable
        class="w-full"
        :disabled="isView || (isSchoolScope && !isTenantSelected)"
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
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
