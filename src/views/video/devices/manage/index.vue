<script setup lang="ts" name="videoDeviceManage">
import type { Device as DeviceVideo, DeviceGroup, FaceSync } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { UploadRequestOptions } from "element-plus";
import type { DeviceImportResult, DeviceRow, HeaderAction } from "./types";

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  deleteDeviceApi,
  getDeviceGroupListApi,
  getDeviceListApi,
  getDeviceTemplateApi,
  postDeviceBatchControlApi,
  postFaceSyncBatchApi,
  postDeviceImportApi
} from "@/api/modules";
import { ArrowDown, CirclePlus, Download, PriceTag, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { DEVICE_STATUS, DEVICE_STATUS_I18N, DEVICE_STATUS_OPTIONS, DEVICE_TAG_CONTROL_ACTION } from "@/config/modules";
import { useDownload } from "@/hooks/useDownload";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";
import BatchTagModal from "./modal/BatchTag.vue";
import DeviceModal from "./modal/Device.vue";
import ExportModal from "./modal/Export.vue";
import ImportResultModal from "./modal/ImportResult.vue";
/** 设备组分页大小 */
const deviceGroupPageSize = 200;
/** 默认设备组ID */
const defaultDeviceGroupId = -1;

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();
/** 选中行信息 */
const { isSelected, selectedList, selectionChange } = useSelection();
/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  {
    get: getDeviceListApi,
    delete: deleteDeviceApi
  },
  null,
  list => dateFormatter(list, ["createdAt", "updatedAt"])
);

/** 设备弹窗引用 */
const modalRef = ref<InstanceType<typeof DeviceModal> | null>(null);
/** 批量标签弹窗引用 */
const batchTagModalRef = ref<InstanceType<typeof BatchTagModal> | null>(null);
/** 导出弹窗引用 */
const exportModalRef = ref<InstanceType<typeof ExportModal> | null>(null);
/** 下载模板加载 */
const downloadLoading = ref(false);
/** 导入加载 */
const importLoading = ref(false);
/** 导入结果弹窗可见 */
const importResultDialogVisible = ref(false);
/** 导入结果数据 */
const importResult = ref<DeviceImportResult>({
  successCount: 0,
  failCount: 0,
  failures: []
});
/** 设备组搜索选项 */
const deviceGroupSearchOptions = ref<DeviceGroup.IDeviceGroupItemVo[]>([]);
/** 设备组搜索加载 */
const deviceGroupSearchLoading = ref(false);
/** 设备组表单选项 */
const deviceGroupFormOptions = ref<DeviceGroup.IDeviceGroupItemVo[]>([]);
/** 设备组表单加载 */
const deviceGroupFormLoading = ref(false);
/** 表头容器引用 */
const headerWrapRef = ref<HTMLDivElement | null>(null);
/** 表头测量容器引用 */
const measureWrapRef = ref<HTMLDivElement | null>(null);
/** 表头左侧容器引用 */
const headerContainerRef = ref<HTMLDivElement | null>(null);
/** 表头宽度 */
const headerWidth = ref(0);
/** 表头水平内边距 */
const headerPaddingX = ref(0);
/** 表头按钮间距 */
const headerGap = ref(0);
/** 操作按钮宽度集合 */
const actionWidths = ref<number[]>([]);
/** 更多按钮宽度 */
const moreButtonWidth = ref(0);
/** 表头尺寸监听器 */
let headerResizeObserver: ResizeObserver | null = null;
/** 表格列配置 */
const columns: ColumnProps<DeviceRow>[] = [
  { type: "selection", width: 50 },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  {
    prop: "terminalSn",
    label: "设备SN号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备SN号" } }
  },
  {
    prop: "name",
    label: "设备名称",
    minWidth: 160,
    search: { el: "input", props: { placeholder: "请输入设备名称" } }
  },
  { prop: "terminalMac", label: "设备MAC地址", minWidth: 160 },
  { prop: "location", label: "设备位置", minWidth: 160 },
  {
    prop: "deviceGroupId",
    label: "设备组",
    isShow: false,
    enum: deviceGroupSearchOptions,
    fieldNames: { label: "name", value: "id" },
    search: {
      el: "select",
      props: { placeholder: "请选择设备组", filterable: true, clearable: true, loading: deviceGroupSearchLoading }
    }
  },
  { prop: "deviceGroupName", label: "设备组", minWidth: 140 },
  { prop: "tags", label: "已绑定标签", minWidth: 180 },
  {
    prop: "status",
    label: "设备状态",
    width: 100,
    enum: DEVICE_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "updatedAt", label: "更新时间", width: 170 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];
/** 表头操作按钮配置 */
const headerActions: HeaderAction[] = [
  { key: "restart", label: "重启", type: "warning", action: DEVICE_TAG_CONTROL_ACTION.RESTART },
  { key: "shutdown", label: "关机", type: "danger", action: DEVICE_TAG_CONTROL_ACTION.SHUTDOWN },
  { key: "updateConfig", label: "更新配置", type: "success", action: DEVICE_TAG_CONTROL_ACTION.UPDATE_CONFIG },
  { key: "syncUser", label: "同步人员信息", type: "success", action: DEVICE_TAG_CONTROL_ACTION.SYNC_USER },
  { key: "clearUser", label: "清除人员数据", type: "success", action: DEVICE_TAG_CONTROL_ACTION.CLEAR_USER },
  // { key: "countUser", label: "查询人员数据", type: "success", action: DEVICE_TAG_CONTROL_ACTION.COUNT_USER },
  { key: "bindTag", label: "绑定标签", type: "success", isBindTag: true }
];

/** 表头可用宽度 */
const headerAvailableWidth = computed(() => Math.max(headerWidth.value - headerPaddingX.value, 0));
/** 表头可见按钮数量 */
const headerActionVisibleCount = computed(() => {
  const availableWidth = headerAvailableWidth.value;
  const widths = actionWidths.value;
  if (!availableWidth || !widths.length) return Math.min(3, headerActions.length);
  for (let count = widths.length; count >= 0; count -= 1) {
    const visibleWidths = widths.slice(0, count).reduce((total, item) => total + item, 0);
    const visibleGaps = count > 0 ? headerGap.value * (count - 1) : 0;
    const hasOverflow = count < widths.length;
    const moreWidth = hasOverflow ? moreButtonWidth.value + (count > 0 ? headerGap.value : 0) : 0;
    if (visibleWidths + visibleGaps + moreWidth <= availableWidth) return count;
  }
  return 0;
});
/** 表头可见按钮列表 */
const visibleHeaderActions = computed(() => headerActions.slice(0, headerActionVisibleCount.value));
/** 表头溢出按钮列表 */
const overflowHeaderActions = computed(() => headerActions.slice(headerActionVisibleCount.value));

/** 更新表头尺寸数据 */
function updateHeaderMetrics() {
  if (!headerWrapRef.value) return;
  headerContainerRef.value = headerWrapRef.value.closest(".header-button-lf") as HTMLDivElement | null;
  headerWidth.value = headerContainerRef.value?.clientWidth ?? 0;

  const styles = getComputedStyle(headerWrapRef.value);
  headerPaddingX.value = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
  const gapValue = Number.parseFloat(styles.columnGap || styles.gap || "0");
  headerGap.value = Number.isNaN(gapValue) ? 0 : gapValue;

  if (!measureWrapRef.value) return;
  const calcWidth = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const margin = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight);
    return Math.ceil(rect.width + (Number.isNaN(margin) ? 0 : margin));
  };
  const buttonNodes = Array.from(measureWrapRef.value.querySelectorAll<HTMLButtonElement>("[data-action]"));
  actionWidths.value = buttonNodes.map(item => calcWidth(item));
  const moreButton = measureWrapRef.value.querySelector<HTMLElement>("[data-more]");
  moreButtonWidth.value = moreButton ? calcWidth(moreButton) : 0;
}

/** 解析学校ID */
function getSchoolIdValue(value?: number | string) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultDeviceGroupId : parsed;
}

/** 批量控制设备 */
async function axiosPostDeviceBatchControlApi(params: DeviceVideo.ReqPostDeviceBatchControlApi) {
  try {
    return await postDeviceBatchControlApi(params);
  } catch (error) {
    console.error("axiosPostDeviceBatchControlApi:", error);
    return { code: -1, data: null };
  }
}
/** 批量同步人员信息 */
async function axiosPostFaceSyncBatchApi(params: FaceSync.ReqPostFaceSyncBatchApi) {
  try {
    return await postFaceSyncBatchApi(params);
  } catch (error) {
    console.error("axiosPostFaceSyncBatchApi:", error);
    return { code: -1, data: null };
  }
}

/** 获取设备组列表 */
async function axiosGetDeviceGroupListApi(targetSchoolId?: number, name?: string, mode: "search" | "form" = "search") {
  const isSearch = mode === "search";
  const loadingRef = isSearch ? deviceGroupSearchLoading : deviceGroupFormLoading;
  const optionsRef = isSearch ? deviceGroupSearchOptions : deviceGroupFormOptions;
  try {
    loadingRef.value = true;
    const finalSchoolId = getSchoolIdValue(targetSchoolId);
    const result = await getDeviceGroupListApi(
      {
        page: 1,
        pageSize: deviceGroupPageSize,
        schoolId: finalSchoolId,
        status: -1,
        name: name || undefined
      },
      { loading: false }
    );
    if (result.code === 0) {
      const list = result.data?.list ?? [];
      optionsRef.value.splice(0, optionsRef.value.length, ...list);
    } else {
      optionsRef.value.length = 0;
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceGroupListApi:", error);
    optionsRef.value.length = 0;
    return { code: -1, data: null };
  } finally {
    loadingRef.value = false;
  }
}

/** 获取设备组搜索选项 */
function handleFetchDeviceGroupSearchOptions() {
  return axiosGetDeviceGroupListApi(schoolId.value ? Number(schoolId.value) : undefined, undefined, "search");
}
/** 获取设备组表单选项 */
function handleFetchDeviceGroupFormOptions(targetSchoolId?: number, name?: string) {
  return axiosGetDeviceGroupListApi(targetSchoolId, name, "form");
}
/** 下载导入模板 */
async function handleDownloadTemplate() {
  downloadLoading.value = true;
  const currentSchoolId = isAllSchools.value ? undefined : Number(schoolId.value);
  await useDownload(
    getDeviceTemplateApi,
    "设备导入模板",
    { schoolId: Number.isNaN(currentSchoolId) ? undefined : currentSchoolId },
    false
  );
  downloadLoading.value = false;
}
/** 导入前校验 */
function handleBeforeImport() {
  if (isAllSchools.value || !schoolId.value) {
    ElMessage.warning("请选择学校后再导入");
    return false;
  }
  return true;
}
/** 导入设备 */
async function handleImport(options: UploadRequestOptions) {
  if (!schoolId.value) return;
  importLoading.value = true;
  try {
    const result = await postDeviceImportApi({ schoolId: +schoolId.value }, options.file as File);
    if (result.code !== 0) return;
    const data = result.data as DeviceImportResult | undefined;
    if (data?.successCount !== undefined) {
      const failures = (data.failures || []).map(item => ({
        ...item,
        terminalSn: item.terminalSn || item.deviceSn,
        deviceSn: item.deviceSn || item.terminalSn
      }));
      importResult.value = { ...data, failures };
      importResultDialogVisible.value = true;
      if (data.successCount > 0) {
        refreshTableList();
      }
    } else {
      ElMessage.success("导入成功");
      refreshTableList();
    }
  } catch (error: any) {
    ElMessage.error(error?.message || "导入失败，请重试");
  } finally {
    importLoading.value = false;
  }
}
/** 显示弹窗 */
function handleShowModal(type: "Add" | "Edit" | "View", row?: DeviceRow) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }
  const titleMap = {
    Add: "新增设备",
    Edit: "编辑设备",
    View: "查看设备"
  };
  const showConfirm = type === "Add" || type === "Edit";
  const targetSchoolId = type === "Add" ? getSchoolIdValue(schoolId.value) : getSchoolIdValue(row?.schoolId);
  handleFetchDeviceGroupFormOptions(targetSchoolId);
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm }, row);
}
/** 显示批量添加标签弹窗 */
function handleShowBatchTagModal() {
  if (!isSelected.value) {
    ElMessage.warning("请先选择设备");
    return;
  }
  batchTagModalRef.value?.acceptParams(
    { title: "批量添加标签", type: "Edit", showConfirm: true },
    selectedList.value as DeviceRow[]
  );
}
/** 显示导出弹窗 */
function handleShowExportModal() {
  const searchParam = proTable.value?.searchParam || {};
  const currentSchoolId = isAllSchools.value ? undefined : Number(schoolId.value);
  exportModalRef.value?.acceptParams(
    { title: "批量导出", type: "View", showConfirm: true },
    {
      schoolId: Number.isNaN(currentSchoolId) ? undefined : currentSchoolId,
      terminalSn: searchParam.terminalSn,
      name: searchParam.name,
      status: searchParam.status
    }
  );
}
/** 删除设备 */
function handleDelete(row: DeviceRow) {
  if (!row?.id) return;
  deleteRow(row.id, row.name || row.terminalSn);
}
/** 批量控制 */
async function handleBatchControl(action: TDeviceTagControlActionValue, actionName: string) {
  if (!isSelected.value) {
    ElMessage.warning("请先选择设备");
    return;
  }
  const deviceIds = (selectedList.value as DeviceRow[]).map(item => item.id);
  if (action === DEVICE_TAG_CONTROL_ACTION.SYNC_USER) {
    const result = await axiosPostFaceSyncBatchApi({ deviceIds });
    if (result.code !== 0) return;
    ElMessage.success(result.data?.message || `${actionName}指令已下发`);
    return;
  }
  const result = await axiosPostDeviceBatchControlApi({ deviceIds, action });
  if (result.code !== 0) return;
  ElMessage.success(result.data?.message || `${actionName}指令已下发`);
}
/** 表头按钮操作 */
function handleHeaderAction(action: HeaderAction) {
  if (action.isBindTag) {
    handleShowBatchTagModal();
    return;
  }
  if (!action.action) return;
  handleBatchControl(action.action, action.label);
}

/** 监听表头宽度 */
onMounted(() => {
  handleFetchDeviceGroupSearchOptions();
  nextTick(() => {
    updateHeaderMetrics();
    headerResizeObserver = new ResizeObserver(() => {
      updateHeaderMetrics();
    });
    if (headerContainerRef.value) {
      headerResizeObserver.observe(headerContainerRef.value);
    }
    if (measureWrapRef.value) {
      headerResizeObserver.observe(measureWrapRef.value);
    }
  });
});
/** 清理表头监听 */
onBeforeUnmount(() => {
  headerResizeObserver?.disconnect();
  headerResizeObserver = null;
});
/** 监听学校切换 */
watch(schoolId, () => {
  refreshTableList();
  handleFetchDeviceGroupSearchOptions();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" @selection-change="selectionChange">
      <template #tableHeader>
        <div ref="headerWrapRef" class="relative flex h-full w-full flex-wrap content-center items-center px-4">
          <el-button
            v-for="action in visibleHeaderActions"
            :key="action.key"
            :type="action.type"
            :disabled="!isSelected"
            @click="handleHeaderAction(action)"
          >
            {{ action.label }}
          </el-button>
          <el-dropdown v-if="overflowHeaderActions.length" trigger="click" :disabled="!isSelected">
            <span
              class="inline-flex items-center pl-3 text-[var(--el-color-primary)]"
              :class="!isSelected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
            >
              更多
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="action in overflowHeaderActions"
                  :key="action.key"
                  :disabled="!isSelected"
                  @click="handleHeaderAction(action)"
                >
                  {{ action.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div
            ref="measureWrapRef"
            class="absolute left-0 top-0 -z-10 flex items-center gap-2 px-4 opacity-0 pointer-events-none"
            aria-hidden="true"
          >
            <el-button v-for="action in headerActions" :key="`measure-${action.key}`" :type="action.type" data-action>
              {{ action.label }}
            </el-button>
            <span class="inline-flex items-center text-[var(--el-color-primary)]" data-more>
              更多
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </span>
          </div>
        </div>
      </template>
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button type="primary" :icon="Download" :loading="downloadLoading" @click="handleDownloadTemplate">
          下载导入模板
        </el-button>
        <el-upload
          action="#"
          :show-file-list="false"
          :http-request="handleImport"
          :before-upload="handleBeforeImport"
          accept=".xlsx,.xls"
          class="inline-flex"
        >
          <el-button type="primary" :icon="Upload" :loading="importLoading">导入设备</el-button>
        </el-upload>
        <el-button type="primary" :icon="Download" @click="handleShowExportModal">导出</el-button>
        <el-button type="warning" :icon="PriceTag" :disabled="!isSelected" @click="handleShowBatchTagModal">
          批量添加标签
        </el-button>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === DEVICE_STATUS.ONLINE ? 'success' : 'info'">
          {{ DEVICE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <template #tags="{ row }">
        <div v-if="row.tags?.length" class="flex w-full flex-wrap items-center justify-center gap-2">
          <el-tag v-for="tag in row.tags" :key="tag.id" type="primary">
            {{ tag.name }}
          </el-tag>
        </div>
        <span v-else class="block w-full text-center">--</span>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowModal('View', row)">查看</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <DeviceModal
      ref="modalRef"
      :device-group-options="deviceGroupFormOptions"
      :device-group-loading="deviceGroupFormLoading"
      :fetch-device-group-options="handleFetchDeviceGroupFormOptions"
      @submit="refreshTableList"
    />
    <BatchTagModal ref="batchTagModalRef" @submit="refreshTableList" />
    <ExportModal ref="exportModalRef" />
    <ImportResultModal v-model="importResultDialogVisible" :result="importResult" />
  </div>
</template>

<style scoped lang="scss">
:deep(.header-button-lf) {
  flex: 1;
  min-width: 0;
}
:deep(.header-button-lf .el-button) {
  margin-bottom: 0;
}
</style>
