<script setup lang="ts" name="videoHomeLayout">
import type { ApkHomepageLayout } from "@/api/interface";
import type { THomeLayoutDeviceQuery, THomeLayoutSyncStatus, THomeModuleItem } from "./types";

import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getApkHomepageLayoutConfigApi,
  getApkHomepageLayoutDeviceStatesApi,
  postResetApkHomepageLayoutConfigApi,
  postRetryApkHomepageLayoutApi,
  putApkHomepageLayoutConfigApi
} from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import { HOME_LAYOUT_SYNC_STATUS, HOME_LAYOUT_SYNC_STATUS_I18N, HOME_LAYOUT_SYNC_STATUS_OPTIONS } from "./constants";
import LayoutConfigPanel from "./components/LayoutConfigPanel.vue";
import HomePreviewScreen from "./components/HomePreviewScreen.vue";
import { createDefaultModuleList, resolveApiLayoutModulesByModuleList, resolveModuleListByApiLayoutModules } from "./utils";

const { schoolId, schoolName, hasSchool, guardSchool } = useSchool();

/** 当前模块配置列表 */
const moduleList = ref<THomeModuleItem[]>(createDefaultModuleList());
/** 当前布局版本 */
const layoutVersion = ref("--");
/** 当前布局更新时间 */
const layoutUpdatedAt = ref("--");
/** 当前布局更新人 */
const layoutUpdatedBy = ref("--");
/** 同步状态筛选值 */
const syncStatusFilter = ref<THomeLayoutSyncStatus | "">("");
/** 设备同步状态查询参数 */
const deviceQuery = ref<THomeLayoutDeviceQuery>({ page: 1, pageSize: 20 });
/** 设备同步状态列表 */
const deviceStateList = ref<ApkHomepageLayout.IApkHomepageLayoutDeviceStateItem[]>([]);
/** 设备同步状态总数 */
const deviceStateTotal = ref(0);
/** 布局加载中状态 */
const layoutLoading = ref(false);
/** 布局保存中状态 */
const layoutSaving = ref(false);
/** 布局重置中状态 */
const layoutResetting = ref(false);
/** 设备状态加载中状态 */
const deviceStateLoading = ref(false);
/** 重试下发中状态 */
const retryLoading = ref(false);
/** 设备同步状态弹框是否显示 */
const deviceSyncDialogVisible = ref(false);

/** 当前学校ID（仅有效学校返回数值） */
const currentSchoolId = computed(function () {
  const schoolIdValue = Number(schoolId.value);
  if (!Number.isFinite(schoolIdValue) || schoolIdValue <= 0) return undefined;
  return schoolIdValue;
});
/** 页面配置区是否禁用 */
const panelDisabled = computed(function () {
  return !hasSchool.value || layoutLoading.value || layoutSaving.value || layoutResetting.value;
});

/**
 * 获取学校首页布局配置。
 * @param currentSchoolIdValue 当前学校ID
 * @returns 首页布局配置结果
 */
async function axiosGetApkHomepageLayoutConfigApi(currentSchoolIdValue: number) {
  try {
    return await getApkHomepageLayoutConfigApi(currentSchoolIdValue, {}, { loading: false });
  } catch (error) {
    console.error("axiosGetApkHomepageLayoutConfigApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/**
 * 保存学校首页布局配置。
 * @param currentSchoolIdValue 当前学校ID
 * @param params 保存参数
 * @returns 保存结果
 */
async function axiosPutApkHomepageLayoutConfigApi(
  currentSchoolIdValue: number,
  params: ApkHomepageLayout.ReqPutApkHomepageLayoutConfigApi
) {
  try {
    return await putApkHomepageLayoutConfigApi(currentSchoolIdValue, params);
  } catch (error) {
    console.error("axiosPutApkHomepageLayoutConfigApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/**
 * 重置学校默认布局。
 * @param currentSchoolIdValue 当前学校ID
 * @returns 重置结果
 */
async function axiosPostResetApkHomepageLayoutConfigApi(currentSchoolIdValue: number) {
  try {
    return await postResetApkHomepageLayoutConfigApi(currentSchoolIdValue);
  } catch (error) {
    console.error("axiosPostResetApkHomepageLayoutConfigApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/**
 * 获取设备同步状态列表。
 * @param currentSchoolIdValue 当前学校ID
 * @param params 查询参数
 * @returns 列表结果
 */
async function axiosGetApkHomepageLayoutDeviceStatesApi(
  currentSchoolIdValue: number,
  params: ApkHomepageLayout.ReqGetApkHomepageLayoutDeviceStatesApi
) {
  try {
    return await getApkHomepageLayoutDeviceStatesApi(currentSchoolIdValue, params);
  } catch (error) {
    console.error("axiosGetApkHomepageLayoutDeviceStatesApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: {
        list: [],
        total: 0,
        page: params.page,
        pageSize: params.pageSize
      }
    };
  }
}
/**
 * 重试下发布局命令。
 * @param currentSchoolIdValue 当前学校ID
 * @param params 重试参数
 * @returns 重试结果
 */
async function axiosPostRetryApkHomepageLayoutApi(
  currentSchoolIdValue: number,
  params?: ApkHomepageLayout.ReqPostRetryApkHomepageLayoutApi
) {
  try {
    return await postRetryApkHomepageLayoutApi(currentSchoolIdValue, params);
  } catch (error) {
    console.error("axiosPostRetryApkHomepageLayoutApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/**
 * 重置页面展示数据。
 * @returns 无返回值
 */
function resetPageViewState(): void {
  moduleList.value = createDefaultModuleList();
  layoutVersion.value = "--";
  layoutUpdatedAt.value = "--";
  layoutUpdatedBy.value = "--";
  syncStatusFilter.value = "";
  deviceQuery.value = { page: 1, pageSize: 20 };
  deviceStateList.value = [];
  deviceStateTotal.value = 0;
}
/**
 * 加载学校布局配置。
 * @returns 无返回值
 */
async function handleLoadLayoutConfig(): Promise<void> {
  const currentSchoolIdValue = currentSchoolId.value;
  if (!currentSchoolIdValue) {
    resetPageViewState();
    return;
  }

  layoutLoading.value = true;
  const result = await axiosGetApkHomepageLayoutConfigApi(currentSchoolIdValue);
  if (result.code === 0 && result.data) {
    moduleList.value = resolveModuleListByApiLayoutModules(result.data.layout?.modules);
    layoutVersion.value = result.data.layoutVersion || "--";
    layoutUpdatedAt.value = result.data.updatedAt || "--";
    layoutUpdatedBy.value = result.data.updatedBy !== undefined ? String(result.data.updatedBy) : "--";
  } else {
    moduleList.value = createDefaultModuleList();
    layoutVersion.value = "--";
    layoutUpdatedAt.value = "--";
    layoutUpdatedBy.value = "--";
  }
  layoutLoading.value = false;
}
/**
 * 加载设备同步状态列表。
 * @param resetPage 是否重置页码
 * @returns 无返回值
 */
async function handleLoadDeviceStateList(resetPage = false): Promise<void> {
  const currentSchoolIdValue = currentSchoolId.value;
  if (!currentSchoolIdValue) {
    deviceStateList.value = [];
    deviceStateTotal.value = 0;
    return;
  }

  if (resetPage) deviceQuery.value.page = 1;
  deviceStateLoading.value = true;
  const result = await axiosGetApkHomepageLayoutDeviceStatesApi(currentSchoolIdValue, {
    status: deviceQuery.value.status,
    page: deviceQuery.value.page,
    pageSize: deviceQuery.value.pageSize
  });
  if (result.code === 0 && result.data) {
    deviceStateList.value = result.data.list || [];
    deviceStateTotal.value = result.data.total || 0;
  } else {
    deviceStateList.value = [];
    deviceStateTotal.value = 0;
  }
  deviceStateLoading.value = false;
}

/**
 * 全部模块显示。
 * @returns 无返回值
 */
function handleShowAllModules(): void {
  moduleList.value.forEach(moduleItem => {
    moduleItem.visible = true;
  });
}
/**
 * 全部模块隐藏。
 * @returns 无返回值
 */
function handleHideAllModules(): void {
  moduleList.value.forEach(moduleItem => {
    moduleItem.visible = false;
  });
}
/**
 * 重置为页面默认配置（未保存）。
 * @returns 无返回值
 */
function handleResetModules(): void {
  moduleList.value = createDefaultModuleList();
}
/**
 * 保存学校布局配置。
 * @returns 无返回值
 */
async function handleSaveLayoutConfig(): Promise<void> {
  if (!guardSchool()) return;

  const currentSchoolIdValue = currentSchoolId.value;
  if (!currentSchoolIdValue) return;

  layoutSaving.value = true;
  const modules = resolveApiLayoutModulesByModuleList(moduleList.value);
  const result = await axiosPutApkHomepageLayoutConfigApi(currentSchoolIdValue, {
    layout: { modules }
  });
  if (result.code === 0) {
    ElMessage.success("保存成功，已触发布局同步");
    await handleLoadLayoutConfig();
    if (deviceSyncDialogVisible.value) await handleLoadDeviceStateList(true);
  }
  layoutSaving.value = false;
}
/**
 * 重置服务端默认布局。
 * @returns 无返回值
 */
async function handleResetRemoteLayout(): Promise<void> {
  if (!guardSchool()) return;

  const currentSchoolIdValue = currentSchoolId.value;
  if (!currentSchoolIdValue) return;

  try {
    await ElMessageBox.confirm("确定重置该学校首页布局为默认配置吗？", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    });
    layoutResetting.value = true;
    const result = await axiosPostResetApkHomepageLayoutConfigApi(currentSchoolIdValue);
    if (result.code === 0) {
      ElMessage.success("已重置为默认布局");
      await handleLoadLayoutConfig();
      if (deviceSyncDialogVisible.value) await handleLoadDeviceStateList(true);
    }
  } catch (error) {
    if (error !== "cancel") ElMessage.error("重置失败，请重试");
  } finally {
    layoutResetting.value = false;
  }
}
/**
 * 重试下发布局命令。
 * @param deviceIds 指定重试的设备ID列表
 * @returns 无返回值
 */
async function handleRetryLayoutCommand(deviceIds?: number[]): Promise<void> {
  if (!guardSchool()) return;

  const currentSchoolIdValue = currentSchoolId.value;
  if (!currentSchoolIdValue) return;

  retryLoading.value = true;
  const result = await axiosPostRetryApkHomepageLayoutApi(currentSchoolIdValue, deviceIds?.length ? { deviceIds } : undefined);
  if (result.code === 0) {
    const accepted = result.data?.accepted;
    if (typeof accepted === "number") {
      ElMessage.success(`重试下发已受理 ${accepted} 台设备`);
    } else {
      ElMessage.success("重试下发已提交");
    }
    await handleLoadDeviceStateList();
  }
  retryLoading.value = false;
}
/**
 * 打开设备同步状态弹框。
 * @returns 无返回值
 */
async function handleOpenDeviceSyncDialog(): Promise<void> {
  if (!guardSchool()) return;

  deviceSyncDialogVisible.value = true;
  await handleLoadDeviceStateList(true);
}
/**
 * 处理同步状态筛选变化。
 * @param value 选中值
 * @returns 无返回值
 */
function handleSyncStatusFilterChange(value: string | number | boolean | undefined): void {
  if (value === undefined || value === "") {
    syncStatusFilter.value = "";
    deviceQuery.value.status = undefined;
    void handleLoadDeviceStateList(true);
    return;
  }
  if (
    value !== HOME_LAYOUT_SYNC_STATUS.PENDING &&
    value !== HOME_LAYOUT_SYNC_STATUS.SUCCESS &&
    value !== HOME_LAYOUT_SYNC_STATUS.FAILED &&
    value !== HOME_LAYOUT_SYNC_STATUS.OFFLINE
  ) {
    return;
  }

  syncStatusFilter.value = value;
  deviceQuery.value.status = value;
  void handleLoadDeviceStateList(true);
}
/**
 * 处理分页页码变化。
 * @param page 目标页码
 * @returns 无返回值
 */
function handleDevicePageChange(page: number): void {
  deviceQuery.value.page = page;
  void handleLoadDeviceStateList();
}
/**
 * 处理分页大小变化。
 * @param pageSize 分页大小
 * @returns 无返回值
 */
function handleDevicePageSizeChange(pageSize: number): void {
  deviceQuery.value.pageSize = pageSize;
  deviceQuery.value.page = 1;
  void handleLoadDeviceStateList();
}
/**
 * 获取同步状态标签类型。
 * @param status 同步状态
 * @returns 标签类型
 */
function getSyncStatusTagType(status: THomeLayoutSyncStatus): "success" | "warning" | "danger" | "info" {
  if (status === HOME_LAYOUT_SYNC_STATUS.SUCCESS) return "success";
  if (status === HOME_LAYOUT_SYNC_STATUS.FAILED) return "danger";
  if (status === HOME_LAYOUT_SYNC_STATUS.OFFLINE) return "info";
  return "warning";
}
/**
 * 获取同步状态文案。
 * @param status 同步状态
 * @returns 文案
 */
function resolveSyncStatusText(status: THomeLayoutSyncStatus | undefined): string {
  if (!status) return "--";
  return HOME_LAYOUT_SYNC_STATUS_I18N[status] || status;
}
/**
 * 是否允许对设备单独重试。
 * @param row 设备状态项
 * @returns 是否可重试
 */
function canRetryDevice(row: ApkHomepageLayout.IApkHomepageLayoutDeviceStateItem): boolean {
  return row.syncStatus === HOME_LAYOUT_SYNC_STATUS.FAILED || row.syncStatus === HOME_LAYOUT_SYNC_STATUS.OFFLINE;
}

watch(
  schoolId,
  function () {
    if (!hasSchool.value || !currentSchoolId.value) {
      resetPageViewState();
      return;
    }
    void handleLoadLayoutConfig();
    if (deviceSyncDialogVisible.value) void handleLoadDeviceStateList(true);
  },
  { immediate: true }
);
</script>

<template>
  <div class="home-layout-page">
    <section class="home-layout-page__workspace">
      <div class="workspace-header">
        <div class="workspace-header__title">首页布局配置</div>
        <div class="workspace-header__meta">
          <span>学校：{{ schoolName || "--" }}</span>
          <span>版本：{{ layoutVersion }}</span>
          <span>更新时间：{{ layoutUpdatedAt }}</span>
          <span>更新人：{{ layoutUpdatedBy }}</span>
        </div>
        <div class="workspace-header__actions">
          <el-button :disabled="!hasSchool" :loading="layoutLoading" @click="handleLoadLayoutConfig">刷新布局</el-button>
          <el-button type="primary" :disabled="!hasSchool" :loading="layoutSaving" @click="handleSaveLayoutConfig">
            保存配置
          </el-button>
          <el-button type="warning" plain :disabled="!hasSchool" :loading="layoutResetting" @click="handleResetRemoteLayout">
            重置服务端默认布局
          </el-button>
          <el-button :disabled="!hasSchool" @click="handleOpenDeviceSyncDialog">设备同步状态</el-button>
        </div>
      </div>

      <div v-if="!hasSchool" class="workspace-empty">
        <el-empty description="请选择学校后再配置首页布局" />
      </div>
      <div v-else v-loading="layoutLoading" class="workspace-main">
        <LayoutConfigPanel
          v-model="moduleList"
          :disabled="panelDisabled"
          @show-all="handleShowAllModules"
          @hide-all="handleHideAllModules"
          @reset="handleResetModules"
        />
        <HomePreviewScreen :module-list="moduleList" />
      </div>
    </section>
    <el-dialog v-model="deviceSyncDialogVisible" title="设备同步状态" width="1120px" destroy-on-close draggable align-center>
      <div class="device-sync-dialog">
        <div class="device-sync-header">
          <div class="device-sync-header__actions">
            <el-select
              v-model="syncStatusFilter"
              clearable
              placeholder="同步状态"
              class="device-sync-header__select"
              @change="handleSyncStatusFilterChange"
            >
              <el-option
                v-for="statusItem in HOME_LAYOUT_SYNC_STATUS_OPTIONS"
                :key="statusItem.value"
                :label="statusItem.label"
                :value="statusItem.value"
              />
            </el-select>
            <el-button :loading="deviceStateLoading" @click="handleLoadDeviceStateList(true)">刷新状态</el-button>
            <el-button type="primary" plain :loading="retryLoading" @click="handleRetryLayoutCommand()">
              重试失败/离线设备
            </el-button>
          </div>
        </div>

        <div class="device-sync-body" v-loading="deviceStateLoading">
          <el-table :data="deviceStateList" border height="100%" empty-text="暂无设备同步状态">
            <el-table-column prop="deviceId" label="设备ID" min-width="100" />
            <el-table-column prop="syncStatus" label="同步状态" min-width="110">
              <template #default="{ row }">
                <el-tag :type="getSyncStatusTagType(row.syncStatus)">{{ resolveSyncStatusText(row.syncStatus) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="targetLayoutVersion" label="目标版本" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.targetLayoutVersion || "--" }}
              </template>
            </el-table-column>
            <el-table-column prop="appliedLayoutVersion" label="已应用版本" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.appliedLayoutVersion || "--" }}
              </template>
            </el-table-column>
            <el-table-column prop="lastReportAt" label="最后回告时间" min-width="180">
              <template #default="{ row }">
                {{ row.lastReportAt || "--" }}
              </template>
            </el-table-column>
            <el-table-column prop="lastError" label="错误信息" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.lastError || "--" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  :disabled="!canRetryDevice(row) || retryLoading"
                  @click="handleRetryLayoutCommand([row.deviceId])"
                >
                  重试
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="device-sync-footer">
          <el-pagination
            v-model:current-page="deviceQuery.page"
            v-model:page-size="deviceQuery.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="deviceStateTotal"
            background
            @current-change="handleDevicePageChange"
            @size-change="handleDevicePageSizeChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.home-layout-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
}
.home-layout-page__workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgb(16 47 86 / 6%);
}
.workspace-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.workspace-header__title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2f4b;
}
.workspace-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #667f9f;
}
.workspace-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.workspace-main {
  display: flex;
  flex: 1;
  gap: 20px;
  min-height: 0;
  overflow: auto hidden;
}
.workspace-empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}
.device-sync-dialog {
  display: flex;
  flex-direction: column;
  height: 560px;
  min-height: 0;
}
.device-sync-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.device-sync-header__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2f4b;
}
.device-sync-header__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.device-sync-header__select {
  width: 140px;
}
.device-sync-body {
  flex: 1;
  min-height: 220px;
}
.device-sync-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
