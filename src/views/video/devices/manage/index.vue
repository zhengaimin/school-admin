<script setup lang="ts" name="videoDeviceManage">
import type { Common, Device as DeviceVideo, DeviceGroup, FaceSync } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { UploadInstance, UploadRequestOptions } from "element-plus";
import type {
  BatchUpdateCategory,
  BatchUpdateCategoryGroup,
  BatchUpdateField,
  BatchUpdateResult,
  DeviceImportResult,
  DeviceRow,
  HeaderAction
} from "./types";
import type { TDeviceTagControlActionValue } from "@/config/modules";

import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  deleteDeviceApi,
  getDeviceBatchUpdateFieldsApi,
  getDeviceGroupListApi,
  getDeviceListApi,
  getDeviceTemplateApi,
  getApkPackagesApi,
  postDeviceBatchControlApi,
  postApkPackagesBatchUpgradeApi,
  postDeviceBatchUpdateApi,
  postDeviceBatchUpdateTemplateApi,
  postFaceSyncBatchApi,
  postDeviceImportApi
} from "@/api/modules";
import { ArrowDown, Download, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import {
  APK_PACKAGE_STATUS,
  APK_UPGRADE_SCOPE,
  DEVICE_STATUS,
  DEVICE_STATUS_I18N,
  DEVICE_STATUS_OPTIONS,
  DEVICE_TAG_CONTROL_ACTION
} from "@/config/modules";
import { useDownload } from "@/hooks/useDownload";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";
import BatchTagModal from "./modal/BatchTag.vue";
import BatchUpdateResultModal from "./modal/BatchUpdateResult.vue";
import ChangeSchoolModal from "./modal/ChangeSchool.vue";
import DetailModal from "./modal/Detail.vue";
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

/** 新增/编辑弹窗引用 */
const modalRef = ref<InstanceType<typeof DeviceModal> | null>(null);
/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof DetailModal> | null>(null);
/** 更换学校弹窗引用 */
const changeSchoolModalRef = ref<InstanceType<typeof ChangeSchoolModal> | null>(null);
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
/** 批量更新字段加载 */
const batchUpdateFieldsLoading = ref(false);
/** 批量更新字段列表 */
const batchUpdateFields = ref<BatchUpdateField[]>([]);
/** 批量更新字段分类 */
const batchUpdateCategories = ref<BatchUpdateCategory[]>([]);
/** 批量更新字段选择 */
const batchUpdateSelectedFields = ref<string[]>([]);
/** 批量更新模板下载加载 */
const batchUpdateTemplateLoading = ref(false);
/** 批量更新导入加载 */
const batchUpdateImportLoading = ref(false);
/** 批量更新弹窗可见 */
const batchUpdateDialogVisible = ref(false);
/** 批量更新结果弹窗可见 */
const batchUpdateResultDialogVisible = ref(false);
/** 批量更新结果数据 */
const batchUpdateResult = ref<BatchUpdateResult>({
  successCount: 0,
  failedCount: 0,
  failures: []
});
/** APK 版本弹窗可见 */
const apkUpgradeDialogVisible = ref(false);
/** APK 版本选项加载 */
const apkOptionsLoading = ref(false);
/** APK 版本提交加载 */
const apkUpgradeSubmitLoading = ref(false);
/** 已发布 APK 版本选项 */
const apkOptions = ref<Array<{ label: string; value: number }>>([]);
/** 目标 APK 包ID */
const selectedApkPackageId = ref<number | null>(null);
/** 是否可提交 APK 升级 */
const canSubmitApkUpgrade = computed(() => selectedApkPackageId.value !== null);
/** 批量更新默认选中标记 */
const batchUpdateSelectionInitialized = ref(false);
/** 批量更新表单 */
const batchUpdateForm = reactive({
  uniqueKey: "terminalSn"
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
/** 右侧工具栏容器引用 */
const toolWrapRef = ref<HTMLDivElement | null>(null);
/** 右侧工具栏测量容器引用 */
const toolMeasureWrapRef = ref<HTMLDivElement | null>(null);
/** 设备导入上传组件引用 */
const deviceImportUploadRef = ref<UploadInstance | null>(null);
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
/** 右侧工具栏可用宽度 */
const toolWidth = ref(0);
/** 右侧工具栏按钮间距 */
const toolGap = ref(0);
/** 右侧工具栏按钮宽度集合 */
const toolActionWidths = ref<number[]>([]);
/** 右侧工具栏更多按钮宽度 */
const toolMoreButtonWidth = ref(0);
/** 表头尺寸监听器 */
let headerResizeObserver: ResizeObserver | null = null;
/** 右侧工具栏按钮 key */
type ToolActionKey = "add" | "downloadTemplate" | "importDevice" | "export" | "batchTag" | "batchUpdate";
/** 右侧工具栏按钮配置 */
type ToolAction = {
  key: ToolActionKey;
  label: string;
  type: "primary" | "success" | "warning" | "danger";
  color: string;
  needSelection?: boolean;
};
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
  { prop: "operation", label: "操作", width: 260, fixed: "right" }
];
/** 表头操作按钮配置 */
const headerActions: HeaderAction[] = [
  { key: "restart", label: "重启", type: "warning", action: DEVICE_TAG_CONTROL_ACTION.RESTART },
  { key: "shutdown", label: "关机", type: "danger", action: DEVICE_TAG_CONTROL_ACTION.SHUTDOWN },
  { key: "updateConfig", label: "更新配置", type: "success", action: DEVICE_TAG_CONTROL_ACTION.UPDATE_CONFIG },
  { key: "updateApk", label: "更新APK版本", type: "success", isUpdateApk: true },
  { key: "syncUser", label: "同步人员信息", type: "success", action: DEVICE_TAG_CONTROL_ACTION.SYNC_USER },
  { key: "clearUser", label: "清除人员数据", type: "success", action: DEVICE_TAG_CONTROL_ACTION.CLEAR_USER },
  // { key: "countUser", label: "查询人员数据", type: "success", action: DEVICE_TAG_CONTROL_ACTION.COUNT_USER },
  { key: "bindTag", label: "绑定标签", type: "success", isBindTag: true }
];
const toolActions: ToolAction[] = [
  { key: "add", label: "新增", type: "primary", color: "#2563eb" },
  { key: "downloadTemplate", label: "下载导入模板", type: "primary", color: "#1d4ed8" },
  { key: "importDevice", label: "导入设备", type: "primary", color: "#0284c7" },
  { key: "export", label: "导出", type: "primary", color: "#0369a1" },
  { key: "batchTag", label: "批量添加标签", type: "warning", color: "#d97706", needSelection: true },
  { key: "batchUpdate", label: "批量更新", type: "success", color: "#059669" }
];
/** 批量更新：拨号模式字段key集合（兼容下划线命名） */
const batchUpdateDialModeFieldKeys = ["dialMode", "dial_mode"];
/** 批量更新：拨号类型字段key集合（兼容旧字段与下划线命名） */
const batchUpdatePhoneTypeFieldKeys = ["phoneType", "phoneTypes", "phone_type", "phone_types"];
/** 批量更新字段key集合 */
const batchUpdateFieldKeys = computed(() => batchUpdateFields.value.map(item => item.key));
/** 判断是否选中了指定字段 */
function isBatchUpdateFieldSelected(fieldKeys: string[]) {
  const selectedFieldSet = new Set(batchUpdateSelectedFields.value.map(item => String(item).toLowerCase()));
  return fieldKeys.some(fieldKey => selectedFieldSet.has(fieldKey.toLowerCase()));
}
/** 是否选中了拨号模式 */
const isBatchUpdateDialModeSelected = computed(() => isBatchUpdateFieldSelected(batchUpdateDialModeFieldKeys));
/** 是否选中了拨号类型 */
const isBatchUpdatePhoneTypeSelected = computed(() => isBatchUpdateFieldSelected(batchUpdatePhoneTypeFieldKeys));
/** 拨号模式与拨号类型联动校验是否通过 */
const isBatchUpdateDialModeDependencyValid = computed(
  () => !isBatchUpdateDialModeSelected.value || isBatchUpdatePhoneTypeSelected.value
);
/** 批量更新字段分组 */
const batchUpdateCategoryGroups = computed<BatchUpdateCategoryGroup[]>(() => {
  const groups: BatchUpdateCategoryGroup[] = [];
  const groupMap = new Map<string, BatchUpdateCategoryGroup>();
  batchUpdateCategories.value.forEach(item => {
    const group = { key: item.key, name: item.name, fields: [] };
    groupMap.set(item.key, group);
    groups.push(group);
  });
  batchUpdateFields.value.forEach(field => {
    const groupKey = field.category || "unknown";
    let group = groupMap.get(groupKey);
    if (!group) {
      group = { key: groupKey, name: "未分类", fields: [] };
      groupMap.set(groupKey, group);
      groups.push(group);
    }
    group.fields.push(field);
  });
  return groups.filter(group => group.fields.length > 0);
});

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
/** 表头按钮禁用状态 */
function isHeaderActionDisabled(action: HeaderAction) {
  return action.needSelection !== false && !isSelected.value;
}
/** 表头更多按钮禁用状态 */
const headerDropdownDisabled = computed(() => {
  if (!overflowHeaderActions.value.length) return true;
  return overflowHeaderActions.value.every(action => isHeaderActionDisabled(action));
});
/** 右侧工具栏可见按钮数量 */
const toolActionVisibleCount = computed(() => {
  const availableWidth = Math.max(toolWidth.value, 0);
  const widths = toolActionWidths.value;
  if (!availableWidth || !widths.length) return toolActions.length;
  for (let count = widths.length; count >= 0; count -= 1) {
    const visibleWidths = widths.slice(0, count).reduce((total, item) => total + item, 0);
    const visibleGaps = count > 0 ? toolGap.value * (count - 1) : 0;
    const hasOverflow = count < widths.length;
    const moreWidth = hasOverflow ? toolMoreButtonWidth.value + (count > 0 ? toolGap.value : 0) : 0;
    if (visibleWidths + visibleGaps + moreWidth <= availableWidth) return count;
  }
  return 0;
});
/** 右侧工具栏可见按钮列表 */
const visibleToolActions = computed(() => toolActions.slice(0, toolActionVisibleCount.value));
/** 右侧工具栏溢出按钮列表 */
const overflowToolActions = computed(() => toolActions.slice(toolActionVisibleCount.value));
/** 右侧工具栏按钮禁用状态 */
function isToolActionDisabled(action: ToolAction) {
  return !!action.needSelection && !isSelected.value;
}
/** 右侧工具栏更多按钮禁用状态 */
const toolDropdownDisabled = computed(() => {
  if (!overflowToolActions.value.length) return true;
  return overflowToolActions.value.every(action => isToolActionDisabled(action));
});

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

  if (!toolWrapRef.value || !toolMeasureWrapRef.value) return;
  toolWidth.value = toolWrapRef.value.clientWidth;
  const toolStyles = getComputedStyle(toolWrapRef.value);
  const toolGapValue = Number.parseFloat(toolStyles.columnGap || toolStyles.gap || "0");
  toolGap.value = Number.isNaN(toolGapValue) ? 0 : toolGapValue;
  const toolButtonNodes = Array.from(toolMeasureWrapRef.value.querySelectorAll<HTMLButtonElement>("[data-tool-action]"));
  toolActionWidths.value = toolButtonNodes.map(item => calcWidth(item));
  const toolMoreButton = toolMeasureWrapRef.value.querySelector<HTMLElement>("[data-tool-more]");
  toolMoreButtonWidth.value = toolMoreButton ? calcWidth(toolMoreButton) : 0;
}

/** 解析学校ID */
function getSchoolIdValue(value?: number | string) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultDeviceGroupId : parsed;
}

/** 获取批量更新字段列表 */
async function axiosGetDeviceBatchUpdateFieldsApi() {
  try {
    batchUpdateFieldsLoading.value = true;
    const result = await getDeviceBatchUpdateFieldsApi();
    if (result.code === 0) {
      batchUpdateFields.value = result.data?.fields ?? [];
      batchUpdateCategories.value = result.data?.categories ?? [];
      const availableKeys = batchUpdateFieldKeys.value;
      if (!batchUpdateSelectionInitialized.value) {
        batchUpdateSelectedFields.value = batchUpdateFields.value.filter(item => item.required).map(item => item.key);
        batchUpdateSelectionInitialized.value = true;
      } else {
        batchUpdateSelectedFields.value = batchUpdateSelectedFields.value.filter(key => availableKeys.includes(key));
      }
    } else {
      batchUpdateFields.value = [];
      batchUpdateCategories.value = [];
      batchUpdateSelectedFields.value = [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceBatchUpdateFieldsApi:", error);
    batchUpdateFields.value = [];
    batchUpdateCategories.value = [];
    batchUpdateSelectedFields.value = [];
    return { code: -1, data: null };
  } finally {
    batchUpdateFieldsLoading.value = false;
  }
}

/** 批量更新设备配置 */
async function axiosPostDeviceBatchUpdateApi(file: File) {
  try {
    return await postDeviceBatchUpdateApi(file);
  } catch (error) {
    console.error("axiosPostDeviceBatchUpdateApi:", error);
    return { code: -1, data: null };
  }
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
/** 获取已发布 APK 列表（关闭全局 loading） */
async function axiosGetPublishedApkPackagesApi() {
  try {
    apkOptionsLoading.value = true;
    return await getApkPackagesApi(
      {
        page: 1,
        pageSize: 100,
        status: -1
      },
      { loading: false }
    );
  } catch (error) {
    console.error("axiosGetPublishedApkPackagesApi:", error);
    return { code: -1, data: { list: [], total: 0, page: 1, pageSize: 100 } as Common.ResGetApkPackagesApi };
  } finally {
    apkOptionsLoading.value = false;
  }
}
/** 判断是否已发布 APK（兼容字符串与数字状态值） */
function isPublishedApkStatus(status: unknown) {
  if (status === APK_PACKAGE_STATUS.PUBLISHED || status === 1) return true;
  const normalizedStatus = String(status || "").toUpperCase();
  return normalizedStatus === APK_PACKAGE_STATUS.PUBLISHED || normalizedStatus === "1";
}
/** 批量更新设备 APK 版本 */
async function axiosPostApkPackagesBatchUpgradeApi(params: Common.ReqPostApkPackagesBatchUpgradeApi) {
  try {
    return await postApkPackagesBatchUpgradeApi(params);
  } catch (error) {
    console.error("axiosPostApkPackagesBatchUpgradeApi:", error);
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
  const finalSchoolId = getSchoolIdValue(targetSchoolId);
  if (finalSchoolId === defaultDeviceGroupId) {
    deviceGroupFormOptions.value = [];
    return Promise.resolve({ code: 0, data: { list: [], total: 0 } });
  }
  return axiosGetDeviceGroupListApi(finalSchoolId, name, "form");
}
/** 打开批量更新弹窗 */
function handleShowBatchUpdateDialog() {
  batchUpdateDialogVisible.value = true;
  axiosGetDeviceBatchUpdateFieldsApi();
}
/** 打开更新 APK 版本弹窗 */
async function handleShowApkUpgradeDialog() {
  if (!isSelected.value) {
    ElMessage.warning("请先选择设备");
    return;
  }
  selectedApkPackageId.value = null;
  apkOptions.value = [];
  const result = await axiosGetPublishedApkPackagesApi();
  if (result.code !== 0) return;
  apkOptions.value = (result.data?.list || [])
    .filter(item => isPublishedApkStatus(item.status))
    .map(item => ({
      label: `${item.versionName}（${item.versionCode}）`,
      value: item.id
    }));
  apkUpgradeDialogVisible.value = true;
}
/** 提交批量更新 APK 版本 */
async function handleSubmitApkUpgrade() {
  if (!selectedApkPackageId.value) {
    ElMessage.warning("请选择目标 APK 版本");
    return;
  }
  const deviceIds = (selectedList.value as DeviceRow[]).map(item => item.id);
  if (!deviceIds.length) {
    ElMessage.warning("请先选择设备");
    return;
  }
  apkUpgradeSubmitLoading.value = true;
  try {
    const result = await axiosPostApkPackagesBatchUpgradeApi({
      apkPackageId: selectedApkPackageId.value,
      scope: APK_UPGRADE_SCOPE.DEVICE,
      deviceIds
    });
    if (result.code !== 0) return;
    ElMessage.success(`批量升级指令已下发，影响设备 ${result.data?.affectedCount || 0} 台`);
    apkUpgradeDialogVisible.value = false;
  } finally {
    apkUpgradeSubmitLoading.value = false;
  }
}
/** 导出批量更新模板 */
async function handleDownloadBatchUpdateTemplate() {
  if (!batchUpdateSelectedFields.value.length) {
    ElMessage.warning("请先选择需要更新的字段");
    return;
  }
  if (!isBatchUpdateDialModeDependencyValid.value) {
    ElMessage.warning("选择“拨号模式”更新时，必须同时选择“拨号类型”");
    return;
  }
  batchUpdateTemplateLoading.value = true;
  try {
    const currentSchoolId = isAllSchools.value ? undefined : Number(schoolId.value);
    const payload: DeviceVideo.ReqPostDeviceBatchUpdateTemplateApi = {
      fields: batchUpdateSelectedFields.value
    };
    if (!Number.isNaN(currentSchoolId)) {
      payload.schoolId = currentSchoolId;
    }
    await useDownload(postDeviceBatchUpdateTemplateApi, "设备批量更新模板", payload, false);
  } finally {
    batchUpdateTemplateLoading.value = false;
  }
}
/** 导入批量更新数据 */
async function handleBatchUpdateImport(options: UploadRequestOptions) {
  batchUpdateImportLoading.value = true;
  try {
    const result = await axiosPostDeviceBatchUpdateApi(options.file as File);
    if (result.code !== 0) return;
    const data = result.data as BatchUpdateResult | undefined;
    if (data?.successCount !== undefined) {
      batchUpdateResult.value = {
        successCount: data.successCount ?? 0,
        failedCount: data.failedCount ?? 0,
        failures: data.failures ?? []
      };
      batchUpdateResultDialogVisible.value = true;
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
    batchUpdateImportLoading.value = false;
  }
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
/** 显示新增/编辑弹窗 */
function handleShowModal(type: "Add" | "Edit", row?: DeviceRow) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }
  const titleMap = {
    Add: "新增设备",
    Edit: "编辑设备"
  };
  const showConfirm = type === "Add" || type === "Edit";
  const targetSchoolId = type === "Add" ? getSchoolIdValue(schoolId.value) : getSchoolIdValue(row?.schoolId);
  handleFetchDeviceGroupFormOptions(targetSchoolId);
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm, schoolId: targetSchoolId }, row);
}
/** 显示详情弹窗 */
function handleShowDetail(row: DeviceRow) {
  detailModalRef.value?.acceptParams({ title: "设备详情", type: "View", showConfirm: false }, row);
}
/** 显示更换学校弹窗 */
function handleShowChangeSchool(row: DeviceRow) {
  if (!row?.id) return;
  changeSchoolModalRef.value?.acceptParams({ title: "更换学校", type: "Edit", showConfirm: true }, row);
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
/** 从右侧工具按钮打开批量更新弹窗 */
function handleShowBatchUpdateFromTool() {
  handleShowBatchUpdateDialog();
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
/** 打开设备导入文件选择框 */
function handleDeviceImportUpload() {
  const fileInput = deviceImportUploadRef.value?.$el?.querySelector("input[type='file']") as HTMLInputElement | null;
  fileInput?.click();
}
/** 处理右侧工具按钮下拉命令 */
function onToolDropdownCommand(action: ToolAction) {
  handleToolAction(action);
}
/** 处理右侧工具按钮事件 */
function handleToolAction(action: ToolAction) {
  if (isToolActionDisabled(action)) return;
  const actionMap: Record<ToolActionKey, () => void> = {
    add: () => handleShowModal("Add"),
    downloadTemplate: () => {
      void handleDownloadTemplate();
    },
    importDevice: handleDeviceImportUpload,
    export: handleShowExportModal,
    batchTag: handleShowBatchTagModal,
    batchUpdate: handleShowBatchUpdateFromTool
  };
  actionMap[action.key]();
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
  if (action.isUpdateApk) {
    void handleShowApkUpgradeDialog();
    return;
  }
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
    if (toolWrapRef.value) {
      headerResizeObserver.observe(toolWrapRef.value);
    }
    if (toolMeasureWrapRef.value) {
      headerResizeObserver.observe(toolMeasureWrapRef.value);
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
            :disabled="isHeaderActionDisabled(action)"
            @click="handleHeaderAction(action)"
          >
            {{ action.label }}
          </el-button>
          <el-dropdown v-if="overflowHeaderActions.length" trigger="click" :disabled="headerDropdownDisabled">
            <span
              class="inline-flex items-center pl-3 text-[var(--el-color-primary)]"
              :class="headerDropdownDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
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
                  :disabled="isHeaderActionDisabled(action)"
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
        <div ref="toolWrapRef" class="relative flex h-full w-full flex-wrap content-center items-center justify-end gap-3">
          <el-button
            v-for="action in visibleToolActions"
            :key="action.key"
            :type="action.type"
            class="tool-action-btn"
            :style="{ '--tool-action-color': action.color }"
            :loading="action.key === 'downloadTemplate' ? downloadLoading : action.key === 'importDevice' ? importLoading : false"
            :disabled="isToolActionDisabled(action)"
            @click="handleToolAction(action)"
          >
            {{ action.label }}
          </el-button>
          <el-upload
            ref="deviceImportUploadRef"
            action="#"
            :show-file-list="false"
            :http-request="handleImport"
            :before-upload="handleBeforeImport"
            accept=".xlsx,.xls"
            class="pointer-events-none absolute left-0 top-0 -z-10 h-0 w-0 overflow-hidden opacity-0"
          />
          <el-dropdown
            v-if="overflowToolActions.length"
            trigger="click"
            :disabled="toolDropdownDisabled"
            @command="onToolDropdownCommand"
          >
            <span
              class="inline-flex items-center pl-1 text-[var(--el-color-primary)]"
              :class="toolDropdownDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
            >
              更多
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="action in overflowToolActions"
                  :key="action.key"
                  :command="action"
                  :disabled="isToolActionDisabled(action)"
                >
                  {{ action.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div
            ref="toolMeasureWrapRef"
            class="absolute left-0 top-0 -z-10 flex items-center gap-3 opacity-0 pointer-events-none"
            aria-hidden="true"
          >
            <el-button v-for="action in toolActions" :key="`measure-tool-${action.key}`" :type="action.type" data-tool-action>
              {{ action.label }}
            </el-button>
            <span class="inline-flex items-center text-[var(--el-color-primary)]" data-tool-more>
              更多
              <el-icon class="ml-1">
                <ArrowDown />
              </el-icon>
            </span>
          </div>
        </div>
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
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="warning" link @click="handleShowChangeSchool(row)">更换</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <el-dialog
      v-model="batchUpdateDialogVisible"
      title="批量更新设备配置"
      width="760px"
      :close-on-click-modal="false"
      destroy-on-close
      draggable
      align-center
    >
      <div v-loading="batchUpdateFieldsLoading" class="flex flex-col gap-4">
        <el-form :model="batchUpdateForm" label-position="top" class="batch-update-form">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="操作说明">
                <span class="text-sm text-gray-500">选择字段后导出模板并上传更新结果</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="唯一标识">
                <el-select v-model="batchUpdateForm.uniqueKey" disabled class="w-full">
                  <el-option label="SN号" value="terminalSn" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="选择字段">
                <el-select
                  v-model="batchUpdateSelectedFields"
                  multiple
                  filterable
                  class="w-full"
                  :collapse-tags="false"
                  placeholder="请选择需要更新的字段"
                >
                  <el-option-group v-for="group in batchUpdateCategoryGroups" :key="group.key" :label="group.name">
                    <el-option
                      v-for="field in group.fields"
                      :key="field.key"
                      :label="`${field.name}（${field.key}${field.required ? '，必填' : ''}）`"
                      :value="field.key"
                    />
                  </el-option-group>
                </el-select>
                <div v-if="!isBatchUpdateDialModeDependencyValid" class="mt-2 text-sm text-red-500">
                  选择“拨号模式”更新时，必须同时选择“拨号类型”
                </div>
                <div class="mt-2 text-sm text-gray-500">已选 {{ batchUpdateSelectedFields.length }} 项</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-empty v-if="!batchUpdateFieldsLoading && !batchUpdateCategoryGroups.length" description="暂无可更新字段" />
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-end gap-3">
          <el-button @click="batchUpdateDialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            :icon="Download"
            :loading="batchUpdateTemplateLoading"
            :disabled="!batchUpdateSelectedFields.length || !isBatchUpdateDialModeDependencyValid"
            @click="handleDownloadBatchUpdateTemplate"
          >
            导出模板
          </el-button>
          <el-upload
            action="#"
            :show-file-list="false"
            :http-request="handleBatchUpdateImport"
            accept=".xlsx,.xls"
            class="inline-flex"
          >
            <el-button type="primary" :icon="Upload" :loading="batchUpdateImportLoading">导入模板</el-button>
          </el-upload>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="apkUpgradeDialogVisible"
      title="批量更新 APK 版本"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
      draggable
      align-center
    >
      <el-form label-position="top">
        <el-form-item label="目标版本" required>
          <el-select
            v-model="selectedApkPackageId"
            class="w-full"
            filterable
            clearable
            :loading="apkOptionsLoading"
            placeholder="请选择已发布的 APK 版本"
          >
            <el-option v-for="item in apkOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="apkUpgradeDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="apkUpgradeSubmitLoading"
          :disabled="!canSubmitApkUpgrade"
          @click="handleSubmitApkUpgrade"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <DetailModal ref="detailModalRef" />
    <ChangeSchoolModal ref="changeSchoolModalRef" @submit="refreshTableList" />
    <DeviceModal
      ref="modalRef"
      :device-group-options="deviceGroupFormOptions"
      :device-group-loading="deviceGroupFormLoading"
      :fetch-device-group-options="handleFetchDeviceGroupFormOptions"
      @submit="refreshTableList"
    />
    <BatchTagModal ref="batchTagModalRef" @submit="refreshTableList" />
    <ExportModal ref="exportModalRef" />
    <BatchUpdateResultModal v-model="batchUpdateResultDialogVisible" :result="batchUpdateResult" />
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
:deep(.header-button-ri) {
  min-width: 0;
  max-width: 100%;
}
:deep(.header-button-ri .el-button) {
  margin-bottom: 0;
}
:deep(.header-button-ri .tool-action-btn) {
  color: #ffffff;
  background-color: var(--tool-action-color);
  border-color: var(--tool-action-color);
}
:deep(.header-button-ri .tool-action-btn:hover) {
  color: #ffffff;
  background-color: color-mix(in srgb, var(--tool-action-color) 88%, #ffffff);
  border-color: color-mix(in srgb, var(--tool-action-color) 88%, #ffffff);
}
:deep(.header-button-ri .tool-action-btn:focus-visible) {
  color: #ffffff;
  background-color: color-mix(in srgb, var(--tool-action-color) 92%, #000000);
  border-color: color-mix(in srgb, var(--tool-action-color) 92%, #000000);
}
:deep(.header-button-ri .tool-action-btn.is-disabled) {
  color: #ffffff;
  opacity: 0.6;
}
:deep(.batch-update-form .el-select__tags) {
  flex-wrap: wrap;
}
:deep(.batch-update-form .el-tag) {
  max-width: 100%;
}
:deep(.batch-update-form .el-tag__content) {
  white-space: normal;
}
:deep(.batch-update-form .el-select__tags-text) {
  white-space: normal;
}
</style>
