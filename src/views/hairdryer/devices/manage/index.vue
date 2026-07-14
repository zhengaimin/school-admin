<script setup lang="ts" name="hairdryerDevice">
import type { DeviceBase, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { CirclePlus, PriceTag, Download, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadRequestOptions } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceBaseListApi, deleteDeviceBaseApi, getDeviceBaseTemplateApi, postDeviceBaseImportApi } from "@/api/modules";
import { VENDOR_CODE, DEVICE_TYPE, DEVICE_STATUS, DEVICE_STATUS_OPTIONS, DEVICE_STATUS_I18N } from "@/config/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useSelection } from "@/hooks/useSelection";
import DeviceModal from "./modal/Device.vue";
import ConfigModal from "./modal/Config.vue";
import BatchTagModal from "./modal/BatchTag.vue";
import CommandModal from "./modal/Command.vue";
import ExportModal from "./modal/Export.vue";

const { isAllSchools, schoolId } = useSchool();
const { isSelected, selectedList, selectionChange } = useSelection();

// 使用 useManage hook
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  {
    get: getDeviceBaseListApi,
    delete: deleteDeviceBaseApi
  },
  null,
  list => dateFormatter(list, [{ field: "lastOnline", isUnix: true }, "createdAt"])
);

const modalRef = ref();
const configModalRef = ref();
const batchTagModalRef = ref();
const commandRef = ref();
const exportModalRef = ref();
const downloadLoading = ref(false);
const importLoading = ref(false);
const importResultDialogVisible = ref(false);
const importResult = ref<DeviceBase.ResPostDeviceBaseImportApi>({
  successCount: 0,
  failCount: 0,
  failures: []
});

/** 生成下载文件 */
function downloadBlob(data: BlobPart, filename: string) {
  const blob = new Blob([data], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
  window.URL.revokeObjectURL(url);
}

/** 获取导入模板 */
async function axiosGetDeviceBaseTemplateApi(params: DeviceBase.ReqGetDeviceBaseTemplateApi): Promise<ResultData<Blob | null>> {
  try {
    const result = await getDeviceBaseTemplateApi(params);
    return { code: 0, msg: "success", data: result };
  } catch (error) {
    console.error("axiosGetDeviceBaseTemplateApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 导入设备 */
async function axiosPostDeviceBaseImportApi(
  params: DeviceBase.ReqPostDeviceBaseImportApi,
  file: File
): Promise<ResultData<DeviceBase.ResPostDeviceBaseImportApi | null>> {
  try {
    const result = await postDeviceBaseImportApi(params, file);
    return result;
  } catch (error: any) {
    console.error("axiosPostDeviceBaseImportApi:", error);
    return { code: -1, msg: error?.message || "导入失败，请重试", data: null };
  }
}

// 表格列配置
const columns: ColumnProps<DeviceBase.IDeviceBaseItem>[] = [
  { type: "selection", width: 50 },
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", width: 120 },
  {
    prop: "deviceSn",
    label: "设备序列号",
    width: 180,
    search: { el: "input", props: { placeholder: "请输入设备序列号" } }
  },
  { prop: "name", label: "设备名称", width: 180 },
  { prop: "tags", label: "标签", width: 200 },
  {
    prop: "status",
    label: "设备状态",
    width: 100,
    enum: DEVICE_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "version", label: "固件版本", width: 120 },
  { prop: "lastOnline", label: "最后在线时间", width: 160 },
  { prop: "createdAt", label: "创建时间", width: 220 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

/** 下载导入模板 */
async function handleDownloadTemplate() {
  downloadLoading.value = true;
  const result = await axiosGetDeviceBaseTemplateApi({
    vendorCode: VENDOR_CODE.XINGRI,
    deviceType: DEVICE_TYPE.DRYER
  });
  if (result.code === 0 && result.data) {
    downloadBlob(result.data, "设备导入模板.xlsx");
  }
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
  const result = await axiosPostDeviceBaseImportApi(
    { vendorCode: VENDOR_CODE.XINGRI, deviceType: DEVICE_TYPE.DRYER, schoolId: Number(schoolId.value) },
    options.file as File
  );
  if (result.code === 0 && result.data) {
    importResult.value = result.data;
    importResultDialogVisible.value = true;
    if (result.data.successCount > 0) {
      refreshTableList();
    }
  } else {
    ElMessage.error(result.msg || "导入失败，请重试");
  }
  importLoading.value = false;
}
/** 显示弹框 */
function handleShowModal(type: TModalType, row?: DeviceBase.IDeviceBaseItem) {
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
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm }, row);
}
/** 打开配置弹窗 */
function handleShowConfigModal(row: DeviceBase.IDeviceBaseItem) {
  configModalRef.value.acceptParams({ title: "设备配置", type: "Edit", showConfirm: true }, row);
}
/** 打开批量添加标签弹窗 */
function handleShowBatchTagModal() {
  if (!isSelected.value) {
    ElMessage.warning("请先选择设备");
    return;
  }
  batchTagModalRef.value.acceptParams({ title: "批量添加标签", type: "Edit", showConfirm: true }, selectedList.value);
}
/** 打开命令下发弹窗 */
function handleShowCommand(row: DeviceBase.IDeviceBaseItem) {
  const deviceLabel = row.name || row.deviceSn || "设备";
  commandRef.value.acceptParams(
    { title: `下发命令 - ${deviceLabel}`, type: "Edit", showConfirm: true },
    { id: row.id, status: row.status }
  );
}
/** 打开导出弹窗 */
function handleShowExportModal() {
  const searchParam = proTable.value?.searchParam || {};
  const currentSchoolId = isAllSchools.value ? undefined : Number(schoolId.value);
  exportModalRef.value?.acceptParams(
    { title: "批量导出", type: "View", showConfirm: true },
    {
      schoolId: Number.isNaN(currentSchoolId) ? undefined : currentSchoolId,
      deviceSn: searchParam.deviceSn,
      status: searchParam.status
    }
  );
}

// 监听学校切换，刷新表格
watch(schoolId, () => {
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
      table-header="设备管理"
      @selection-change="selectionChange"
    >
      <!-- 表格头部按钮 -->
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
          style="display: inline-flex"
        >
          <el-button type="primary" :icon="Upload" :loading="importLoading">导入设备</el-button>
        </el-upload>
        <el-button type="primary" :icon="Download" @click="handleShowExportModal">导出</el-button>
        <el-button type="warning" :icon="PriceTag" :disabled="!isSelected" @click="handleShowBatchTagModal">
          批量添加标签
        </el-button>
      </template>
      <!-- 标签 -->
      <template #tags="{ row }">
        <el-tag v-for="tag in row.tags" :key="tag.id" style="margin-right: 4px">
          {{ tag.name }}
        </el-tag>
      </template>
      <!-- 设备状态 -->
      <template #status="{ row }">
        <el-tag :type="row.status === DEVICE_STATUS.ONLINE ? 'success' : 'info'">
          {{ DEVICE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :disabled="row.status !== DEVICE_STATUS.ONLINE" @click="handleShowCommand(row)">
          控制
        </el-button>
        <el-button type="primary" link @click="handleShowConfigModal(row)">配置</el-button>
        <el-button type="primary" link @click="handleShowModal('View', row)">查看</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button
          type="danger"
          link
          :disabled="row.status === DEVICE_STATUS.ONLINE"
          @click="deleteRow(row.id, row.name || row.deviceSn)"
        >
          删除
        </el-button>
      </template>
    </ProTable>

    <DeviceModal ref="modalRef" @submit="refreshTableList" />
    <ConfigModal ref="configModalRef" />
    <BatchTagModal ref="batchTagModalRef" @submit="refreshTableList" />
    <CommandModal ref="commandRef" />
    <ExportModal ref="exportModalRef" />

    <!-- 导入结果弹窗 -->
    <el-dialog v-model="importResultDialogVisible" title="导入结果" width="800px">
      <el-alert
        :title="`成功：${importResult.successCount} 条，失败：${importResult.failCount} 条`"
        :type="importResult.failCount > 0 ? 'warning' : 'success'"
        :closable="false"
        show-icon
        style="margin-bottom: 16px"
      />
      <el-table v-if="importResult.failCount > 0" :data="importResult.failures" border max-height="400">
        <el-table-column prop="rowIndex" label="行号" width="80" align="center" />
        <el-table-column prop="deviceSn" label="设备SN" width="180" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="reason" label="失败原因" min-width="200" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button type="primary" @click="importResultDialogVisible = false">关闭</el-button>
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
</style>
