<script setup lang="ts">
import type { Device as DeviceVideo, DeviceBaseTag, School } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { ApkUpgradeAcceptParams, SelectOptionItem } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceBaseTagOptionsApi, getDeviceListApi, getSchoolsListApi, postApkPackagesBatchUpgradeApi } from "@/api/modules";
import { APK_UPGRADE_SCOPE, APK_UPGRADE_SCOPE_OPTIONS, type TApkUpgradeScopeValue } from "@/config/modules";
import { useSchool } from "@/hooks/useSchool";
import {
  buildDeviceBaseTagsOptionsParams,
  buildPostApkPackagesBatchUpgradePayload,
  buildSchoolsListParams,
  buildVideoDevicesListParams
} from "../utils/payload";

const emits = defineEmits(["submit"]);

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();

/** 弹窗可见 */
const visible = ref(false);
/** 提交状态 */
const submitLoading = ref(false);
/** 学校选项加载状态 */
const schoolOptionsLoading = ref(false);
/** 设备选项加载状态 */
const deviceOptionsLoading = ref(false);
/** 标签选项加载状态 */
const tagOptionsLoading = ref(false);
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 弹窗参数 */
const parameter = ref<ApkUpgradeAcceptParams>({
  title: "",
  type: "View",
  showConfirm: true,
  apkPackageId: 0,
  versionName: "",
  versionCode: 0
});
/** 表单数据 */
const ruleForm = ref<{
  scope: TApkUpgradeScopeValue;
  schoolIds: number[];
  tagIds: number[];
  deviceIds: number[];
}>({
  scope: APK_UPGRADE_SCOPE.DEVICE,
  schoolIds: [],
  tagIds: [],
  deviceIds: []
});
/** 学校选项 */
const schoolOptions = ref<SelectOptionItem[]>([]);
/** 标签选项 */
const tagOptions = ref<SelectOptionItem[]>([]);
/** 设备选项 */
const deviceOptions = ref<SelectOptionItem[]>([]);

/** 当前学校ID */
const currentSchoolId = computed(() => {
  const value = Number(schoolId.value);
  if (Number.isNaN(value) || value <= 0) return undefined;
  return value;
});

/** 表单规则 */
const rules: FormRules = {
  scope: [{ required: true, message: "请选择升级范围", trigger: "change" }]
};

/** 获取学校选项 */
async function axiosGetSchoolOptionsApi(keyword: string) {
  schoolOptionsLoading.value = true;
  try {
    const payload = buildSchoolsListParams(keyword);
    const result = await getSchoolsListApi(payload, { loading: false });
    if (result.code !== 0) return;
    schoolOptions.value = (result.data?.list || []).map((item: School.ISchoolItem) => ({
      label: item.name || `学校-${item.id}`,
      value: item.id
    }));
  } catch (error) {
    console.error("axiosGetSchoolOptionsApi:", error);
  } finally {
    schoolOptionsLoading.value = false;
  }
}
/** 获取标签选项 */
async function axiosGetTagOptionsApi() {
  tagOptionsLoading.value = true;
  try {
    const payload = buildDeviceBaseTagsOptionsParams(currentSchoolId.value);
    const result = await getDeviceBaseTagOptionsApi(payload);
    if (result.code !== 0) return;
    tagOptions.value = (result.data || []).map((item: DeviceBaseTag.IDeviceBaseTagOptionVo) => ({
      label: item.name,
      value: item.id
    }));
  } catch (error) {
    console.error("axiosGetTagOptionsApi:", error);
  } finally {
    tagOptionsLoading.value = false;
  }
}
/** 获取设备选项 */
async function axiosGetDeviceOptionsApi(keyword: string) {
  deviceOptionsLoading.value = true;
  try {
    const payload = buildVideoDevicesListParams(keyword, currentSchoolId.value);
    const result = await getDeviceListApi(payload);
    if (result.code !== 0) return;
    deviceOptions.value = (result.data?.list || []).map((item: DeviceVideo.IDeviceItemVo) => ({
      label: `${item.name}（${item.terminalSn}）`,
      value: item.id
    }));
  } catch (error) {
    console.error("axiosGetDeviceOptionsApi:", error);
  } finally {
    deviceOptionsLoading.value = false;
  }
}
/** 批量设置升级目标 */
async function axiosPostApkPackagesBatchUpgradeApi() {
  try {
    const payload = buildPostApkPackagesBatchUpgradePayload({
      apkPackageId: parameter.value.apkPackageId,
      scope: ruleForm.value.scope,
      schoolIds: ruleForm.value.schoolIds,
      tagIds: ruleForm.value.tagIds,
      deviceIds: ruleForm.value.deviceIds
    });
    return await postApkPackagesBatchUpgradeApi(payload);
  } catch (error) {
    console.error("axiosPostApkPackagesBatchUpgradeApi:", error);
    return { code: -1, data: null };
  }
}

/** 处理升级范围切换 */
function handleUpgradeScopeChange() {
  ruleForm.value.schoolIds = [];
  ruleForm.value.tagIds = [];
  ruleForm.value.deviceIds = [];
}
/** 学校远程搜索 */
function handleRemoteSchoolSearch(keyword: string) {
  axiosGetSchoolOptionsApi(keyword);
}
/** 设备远程搜索 */
function handleRemoteDeviceSearch(keyword: string) {
  axiosGetDeviceOptionsApi(keyword);
}
/** 提交表单 */
async function handleSubmitForm(formEl?: FormInstance) {
  if (!formEl || submitLoading.value) return;
  await formEl.validate(async valid => {
    if (!valid) return;

    if (ruleForm.value.scope === APK_UPGRADE_SCOPE.SCHOOL && !ruleForm.value.schoolIds.length) {
      ElMessage.warning("请选择学校");
      return;
    }
    if (ruleForm.value.scope === APK_UPGRADE_SCOPE.TAG && !ruleForm.value.tagIds.length) {
      ElMessage.warning("请选择标签");
      return;
    }
    if (ruleForm.value.scope === APK_UPGRADE_SCOPE.DEVICE && !ruleForm.value.deviceIds.length) {
      ElMessage.warning("请选择设备");
      return;
    }

    submitLoading.value = true;
    const result = await axiosPostApkPackagesBatchUpgradeApi();
    submitLoading.value = false;

    if (result.code !== 0) return;
    ElMessage.success(`设置成功，影响设备 ${result.data?.affectedCount || 0} 台`);
    visible.value = false;
    emits("submit");
  });
}

/** 接收参数 */
async function acceptParams(params: ApkUpgradeAcceptParams) {
  parameter.value = { ...parameter.value, ...params };
  ruleForm.value = {
    scope: APK_UPGRADE_SCOPE.DEVICE,
    schoolIds: [],
    tagIds: [],
    deviceIds: []
  };

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });

  if (isAllSchools.value) {
    await axiosGetSchoolOptionsApi("");
  } else if (currentSchoolId.value) {
    ruleForm.value.schoolIds = [currentSchoolId.value];
  }
  await axiosGetTagOptionsApi();
  await axiosGetDeviceOptionsApi("");
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-alert type="info" :closable="false" show-icon title="本次升级为强制升级，设备端不支持跳过。" class="mb-4" />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="目标版本">
            <el-input :model-value="`${parameter.versionName}（${parameter.versionCode}）`" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="升级范围" prop="scope">
            <el-select v-model="ruleForm.scope" class="w-full" @change="handleUpgradeScopeChange">
              <el-option v-for="item in APK_UPGRADE_SCOPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="ruleForm.scope === APK_UPGRADE_SCOPE.SCHOOL" :gutter="24">
        <el-col :span="24">
          <el-form-item label="学校选择" required>
            <el-select
              v-model="ruleForm.schoolIds"
              class="w-full"
              multiple
              filterable
              remote
              reserve-keyword
              clearable
              :remote-method="handleRemoteSchoolSearch"
              :loading="schoolOptionsLoading"
              placeholder="请输入学校名称搜索"
            >
              <el-option v-for="item in schoolOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="ruleForm.scope === APK_UPGRADE_SCOPE.TAG" :gutter="24">
        <el-col :span="24">
          <el-form-item label="标签选择" required>
            <el-select v-model="ruleForm.tagIds" class="w-full" multiple filterable clearable :loading="tagOptionsLoading">
              <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="ruleForm.scope === APK_UPGRADE_SCOPE.DEVICE" :gutter="24">
        <el-col :span="24">
          <el-form-item label="设备选择" required>
            <el-select
              v-model="ruleForm.deviceIds"
              class="w-full"
              multiple
              filterable
              remote
              reserve-keyword
              clearable
              :remote-method="handleRemoteDeviceSearch"
              :loading="deviceOptionsLoading"
              placeholder="请输入设备 SN 搜索"
            >
              <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="submitLoading" @click="handleSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
