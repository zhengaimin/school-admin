<script setup lang="ts">
import type { Common, DeviceTag, FaceSync, ResultData } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceTagControlFailItem, DeviceTagRow } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getApkPackagesApi,
  postApkPackagesBatchUpgradeApi,
  postDeviceTagBatchControlApi,
  postFaceSyncBatchApi
} from "@/api/modules";
import {
  APK_PACKAGE_STATUS,
  APK_UPGRADE_SCOPE,
  DEVICE_TAG_CONTROL_ACTION,
  DEVICE_TAG_CONTROL_ACTION_OPTIONS,
  type TDeviceTagControlActionValue
} from "@/config/modules";

const visible = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<{ deviceTagId: number; action: TDeviceTagControlActionValue | ""; apkPackageId: number | null }>({
  deviceTagId: 0,
  action: "",
  apkPackageId: null
});

const rules: FormRules = {
  action: [{ required: true, message: "请选择操作", trigger: "change" }],
  apkPackageId: [
    {
      validator: (_rule, value, callback) => {
        if (ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.UPDATE_APK && !value) {
          callback(new Error("请选择目标 APK 版本"));
          return;
        }
        callback();
      },
      trigger: "change"
    }
  ]
};

const failList = ref<DeviceTagControlFailItem[]>([]);
const showForm = computed(() => failList.value.length === 0);
const isView = computed(() => parameter.value.type === "View");
/** 是否为更新 APK 操作 */
const isUpdateApkAction = computed(() => ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.UPDATE_APK);
/** APK 列表加载状态 */
const apkOptionsLoading = ref(false);
/** 已发布 APK 选项 */
const apkOptions = ref<Array<{ label: string; value: number }>>([]);

/** 处理失败列表 */
function normalizeFailList(list: DeviceTagControlFailItem[] = []) {
  return list.map(item => ({
    ...item,
    describe: item.describe ?? item.message ?? ""
  }));
}

/** 批量控制设备 */
async function axiosPostDeviceTagBatchControlApi(
  params: DeviceTag.ReqPostDeviceTagBatchControlApi
): Promise<ResultData<DeviceTag.ResPostDeviceTagBatchControlApi | null>> {
  try {
    return await postDeviceTagBatchControlApi(params);
  } catch (error) {
    console.error("axiosPostDeviceTagBatchControlApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 触发批量人脸同步 */
async function axiosPostFaceSyncBatchApi(
  params: FaceSync.ReqPostFaceSyncBatchApi
): Promise<ResultData<FaceSync.ResPostFaceSyncActionApi | null>> {
  try {
    return await postFaceSyncBatchApi(params);
  } catch (error) {
    console.error("axiosPostFaceSyncBatchApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 获取已发布 APK 列表（关闭全局 loading） */
async function axiosGetPublishedApkPackagesApi(): Promise<ResultData<Common.ResGetApkPackagesApi>> {
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
    return { code: -1, data: { list: [], total: 0, page: 1, pageSize: 100 }, msg: "请求失败" };
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
/** 通过标签批量升级 APK */
async function axiosPostApkPackagesBatchUpgradeApi(
  params: Common.ReqPostApkPackagesBatchUpgradeApi
): Promise<ResultData<Common.ResPostApkPackagesBatchUpgradeApi | null>> {
  try {
    return await postApkPackagesBatchUpgradeApi(params);
  } catch (error) {
    console.error("axiosPostApkPackagesBatchUpgradeApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 加载已发布 APK 选项 */
async function handleFetchApkOptions() {
  const result = await axiosGetPublishedApkPackagesApi();
  if (result.code !== 0) {
    apkOptions.value = [];
    return;
  }
  apkOptions.value = (result.data?.list || [])
    .filter(item => isPublishedApkStatus(item.status))
    .map(item => ({
      label: `${item.versionName}（${item.versionCode}）`,
      value: item.id
    }));
}
/** 操作类型变更 */
function handleActionChange() {
  ruleForm.value.apkPackageId = null;
  ruleFormRef.value?.clearValidate(["apkPackageId"]);
  if (ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.UPDATE_APK) {
    handleFetchApkOptions();
  }
}
/** 提交表单 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const isUpdateApk = ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.UPDATE_APK;
      const isSyncUser = ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.SYNC_USER;
      if (isUpdateApk) {
        if (!ruleForm.value.apkPackageId) {
          ElMessage.warning("请选择目标 APK 版本");
          return;
        }
        const result = await axiosPostApkPackagesBatchUpgradeApi({
          apkPackageId: ruleForm.value.apkPackageId,
          scope: APK_UPGRADE_SCOPE.TAG,
          tagIds: [ruleForm.value.deviceTagId]
        });
        if (result.code !== 0) return;
        ElMessage.success(`批量升级指令已下发，影响设备 ${result.data?.affectedCount || 0} 台`);
        visible.value = false;
        return;
      }
      if (isSyncUser) {
        const result = await axiosPostFaceSyncBatchApi({ tagId: ruleForm.value.deviceTagId });
        if (result.code !== 0) return;
        ElMessage.success("操作成功");
        visible.value = false;
        return;
      }

      const payload: DeviceTag.ReqPostDeviceTagBatchControlApi = {
        deviceTagId: ruleForm.value.deviceTagId,
        action: ruleForm.value.action as TDeviceTagControlActionValue
      };
      const result = await axiosPostDeviceTagBatchControlApi(payload);
      if (result.code !== 0) return;

      const failCount = result.data?.failCount ?? 0;
      const list = normalizeFailList(result.data?.failList ?? []);
      if (failCount > 0 && list.length > 0) {
        failList.value = list;
        return;
      }

      ElMessage.success("操作成功");
      visible.value = false;
    } catch (error) {
      console.error("handleSubmitForm:", error);
    }
  });
}

/** 接收参数 */
function acceptParams(params: TModalParams, row?: DeviceTagRow) {
  parameter.value = { ...parameter.value, ...params };
  if (!row) return;
  ruleForm.value = {
    deviceTagId: row.id,
    action: "",
    apkPackageId: null
  };
  failList.value = [];
  apkOptions.value = [];
  visible.value = true;

  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="480px"
    destroy-on-close
    draggable
    align-center
  >
    <div class="space-y-4">
      <el-form v-if="showForm" ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="操作" prop="action">
              <el-select v-model="ruleForm.action" class="w-full" placeholder="请选择操作" @change="handleActionChange">
                <el-option
                  v-for="item in DEVICE_TAG_CONTROL_ACTION_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="isUpdateApkAction" :span="24">
            <el-form-item label="目标版本" prop="apkPackageId" required>
              <el-select
                v-model="ruleForm.apkPackageId"
                class="w-full"
                filterable
                clearable
                :loading="apkOptionsLoading"
                placeholder="请选择已发布的 APK 版本"
              >
                <el-option v-for="item in apkOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-else class="space-y-2">
        <div class="text-sm text-red-500">操作失败设备</div>
        <el-table :data="failList">
          <el-table-column label="设备名称" prop="deviceName" />
          <el-table-column label="状态" prop="status" />
          <el-table-column label="描述" prop="describe" />
        </el-table>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        v-if="parameter.showConfirm && showForm"
        type="primary"
        :disabled="isUpdateApkAction && !ruleForm.apkPackageId"
        @click="handleSubmitForm(ruleFormRef)"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
