<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { FaceSync, ResultData } from "@/api/interface";
import type { DeviceTagControlFailItem, DeviceTagRow } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { postDeviceTagBatchControlApi, postFaceSyncBatchApi } from "@/api/modules";
import {
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
const ruleForm = ref<{ deviceTagId: number; action: TDeviceTagControlActionValue | "" }>({
  deviceTagId: 0,
  action: ""
});

const rules: FormRules = {
  action: [{ required: true, message: "请选择操作", trigger: "change" }]
};

const failList = ref<DeviceTagControlFailItem[]>([]);
const showForm = computed(() => failList.value.length === 0);
const isView = computed(() => parameter.value.type === "View");

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
/** 提交表单 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const isSyncUser = ruleForm.value.action === DEVICE_TAG_CONTROL_ACTION.SYNC_USER;
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
    action: ""
  };
  failList.value = [];
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
              <el-select v-model="ruleForm.action" class="w-full" placeholder="请选择操作">
                <el-option
                  v-for="item in DEVICE_TAG_CONTROL_ACTION_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
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
      <el-button v-if="parameter.showConfirm && showForm" type="primary" @click="handleSubmitForm(ruleFormRef)"> 确定 </el-button>
    </template>
  </el-dialog>
</template>
