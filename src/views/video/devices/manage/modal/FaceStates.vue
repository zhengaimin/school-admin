<script setup lang="ts">
import type { Device as DeviceVideo, FaceSync } from "@/api/interface";
import type { TDeviceFaceSyncStatusValue } from "@/config/modules";

import { ref } from "vue";
import { getFaceSyncDeviceStatesByDeviceApi } from "@/api/modules";
import {
  DEVICE_FACE_DESIRED_ACTION_I18N,
  DEVICE_FACE_SYNC_STATUS_I18N,
  DEVICE_FACE_SYNC_STATUS_OPTIONS,
  getDeviceFaceSyncStatusTagType
} from "@/config/modules";

/** 弹窗可见 */
const visible = ref(false);
/** 列表加载 */
const loading = ref(false);
/** 设备信息 */
const currentDevice = ref<DeviceVideo.IDeviceItemVo | null>(null);
/** 状态筛选 */
const selectedStatus = ref<TDeviceFaceSyncStatusValue | undefined>(undefined);
/** 当前页 */
const page = ref(1);
/** 每页数量 */
const pageSize = ref(50);
/** 总数 */
const total = ref(0);
/** 列表数据 */
const faceStateList = ref<FaceSync.IDeviceFaceSyncStateByDeviceItem[]>([]);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/** 按设备查询人脸同步状态 */
async function axiosGetFaceSyncDeviceStatesByDeviceApi(deviceId: number, params: FaceSync.ReqGetDeviceFaceSyncStatesByDeviceApi) {
  try {
    return await getFaceSyncDeviceStatesByDeviceApi(deviceId, params);
  } catch (error) {
    console.error("axiosGetFaceSyncDeviceStatesByDeviceApi:", error);
    return { code: -1, data: { total: 0, list: [] } };
  }
}

/** 查询列表 */
async function fetchFaceStateList() {
  if (!currentDevice.value?.id) return;
  loading.value = true;
  try {
    const result = await axiosGetFaceSyncDeviceStatesByDeviceApi(currentDevice.value.id, {
      status: selectedStatus.value,
      page: page.value,
      pageSize: pageSize.value
    });
    if (result.code === 0) {
      faceStateList.value = result.data?.list || [];
      total.value = result.data?.total || 0;
      return;
    }
    faceStateList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

/** 状态文案 */
function getStatusText(status: FaceSync.IDeviceFaceSyncStateByDeviceItem["status"]) {
  return DEVICE_FACE_SYNC_STATUS_I18N[status] || status || "--";
}

/** 期望动作文案 */
function getDesiredActionText(action: FaceSync.IDeviceFaceSyncStateByDeviceItem["desiredAction"]) {
  return DEVICE_FACE_DESIRED_ACTION_I18N[action] || action || "--";
}

/** 错误信息 */
function getErrorText(row: FaceSync.IDeviceFaceSyncStateByDeviceItem) {
  if (row.lastErrorMsg) return row.lastErrorMsg;
  if (row.lastErrorCode) return row.lastErrorCode;
  return "--";
}

/** 查询 */
function handleSearch() {
  page.value = 1;
  fetchFaceStateList();
}

/** 重置 */
function handleReset() {
  selectedStatus.value = undefined;
  page.value = 1;
  fetchFaceStateList();
}

/** 页码变化 */
function handleCurrentChange(current: number) {
  page.value = current;
  fetchFaceStateList();
}

/** 每页数量变化 */
function handleSizeChange(size: number) {
  pageSize.value = size;
  page.value = 1;
  fetchFaceStateList();
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceVideo.IDeviceItemVo) {
  parameter.value = { ...parameter.value, ...params };
  currentDevice.value = row || null;
  selectedStatus.value = undefined;
  page.value = 1;
  pageSize.value = 50;
  total.value = 0;
  faceStateList.value = [];
  visible.value = true;
  await fetchFaceStateList();
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="1080px" destroy-on-close draggable align-center>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="text-sm text-gray-600">设备：{{ currentDevice?.name || "--" }}（{{ currentDevice?.terminalSn || "--" }}）</div>
      <div class="flex flex-wrap items-center gap-2">
        <el-select v-model="selectedStatus" clearable placeholder="请选择同步状态" style="width: 180px">
          <el-option v-for="item in DEVICE_FACE_SYNC_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <el-table v-loading="loading" border :data="faceStateList">
      <el-table-column prop="studentId" label="学生ID" min-width="100" />
      <el-table-column prop="studentName" label="学生姓名" min-width="140" />
      <el-table-column label="期望动作" min-width="110">
        <template #default="{ row }">
          {{ getDesiredActionText(row.desiredAction) }}
        </template>
      </el-table-column>
      <el-table-column prop="desiredVersion" label="期望版本" min-width="100" />
      <el-table-column prop="syncedVersion" label="已同步版本" min-width="110" />
      <el-table-column label="同步状态" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getDeviceFaceSyncStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="失败原因" min-width="240" show-overflow-tooltip>
        <template #default="{ row }">
          {{ getErrorText(row) }}
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
