<script setup lang="ts">
import type { Device as DeviceVideo, DeviceGroup, School } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { nextTick, reactive, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getDeviceGroupListApi, getSchoolsListApi, postDeviceChangeSchoolApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

/** 设备组列表页大小 */
const deviceGroupPageSize = 200;
/** 学校列表页大小 */
const schoolPageSize = 100;

/** 提交事件 */
const emit = defineEmits<{
  submit: [];
}>();

/** 弹窗可见 */
const visible = ref(false);
/** 提交加载 */
const submitLoading = ref(false);
/** 学校选项加载 */
const schoolOptionsLoading = ref(false);
/** 设备组选项加载 */
const deviceGroupOptionsLoading = ref(false);
/** 是否正在初始化，避免误触发联动 */
const initializing = ref(false);
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
/** 当前设备 */
const currentDevice = ref<DeviceVideo.IDeviceItemVo | null>(null);
/** 当前学校名称 */
const currentSchoolName = ref("");
/** 学校选项 */
const schoolOptions = ref<School.ISchoolItem[]>([]);
/** 设备组选项 */
const deviceGroupOptions = ref<DeviceGroup.IDeviceGroupItemVo[]>([]);
/** 表单数据 */
const ruleForm = reactive<{
  schoolId: number | null;
  deviceGroupId: number | null;
}>({
  schoolId: null,
  deviceGroupId: null
});

/** 设备组校验 */
const validateDeviceGroup = (_rule: any, value: number | null, callback: (error?: Error) => void) => {
  if (ruleForm.schoolId != null && value == null) {
    callback(new Error("选择学校后请同时选择设备组"));
    return;
  }
  callback();
};

/** 表单校验规则 */
const rules: FormRules = {
  deviceGroupId: [{ validator: validateDeviceGroup, trigger: "change" }]
};

/** 规范化ID */
function normalizeId(value?: number | string | null) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

/** 获取学校选项 */
async function fetchSchoolOptions(keyword = "") {
  schoolOptionsLoading.value = true;
  try {
    const result = await getSchoolsListApi(
      {
        page: 1,
        pageSize: schoolPageSize,
        name: keyword || undefined,
        status: -1
      },
      { loading: false }
    );
    if (result.code !== 0) {
      schoolOptions.value = [];
      return;
    }
    schoolOptions.value = result.data?.list || [];
  } catch (error) {
    console.error("fetchSchoolOptions:", error);
    schoolOptions.value = [];
  } finally {
    schoolOptionsLoading.value = false;
  }
}

/** 获取设备组选项 */
async function fetchDeviceGroupOptions(schoolId: number, name = "") {
  deviceGroupOptionsLoading.value = true;
  try {
    const result = await getDeviceGroupListApi(
      {
        page: 1,
        pageSize: deviceGroupPageSize,
        schoolId,
        status: -1,
        name: name || undefined
      },
      { loading: false }
    );
    if (result.code !== 0) {
      deviceGroupOptions.value = [];
      return;
    }
    deviceGroupOptions.value = result.data?.list || [];
  } catch (error) {
    console.error("fetchDeviceGroupOptions:", error);
    deviceGroupOptions.value = [];
  } finally {
    deviceGroupOptionsLoading.value = false;
  }
}

/** 学校切换联动 */
async function handleSchoolChange(targetSchoolId: number | null, keepDeviceGroup = false) {
  if (targetSchoolId == null) {
    deviceGroupOptions.value = [];
    ruleForm.deviceGroupId = null;
    return;
  }
  if (!keepDeviceGroup) {
    ruleForm.deviceGroupId = null;
  }
  await fetchDeviceGroupOptions(targetSchoolId);
}

/** 学校远程搜索 */
function handleRemoteSchoolSearch(keyword: string) {
  void fetchSchoolOptions(keyword);
}

/** 学校下拉展开状态变化 */
function handleSchoolVisibleChange(visibleValue: boolean) {
  if (!visibleValue) return;
  void fetchSchoolOptions();
}

/** 设备组远程搜索 */
function handleRemoteDeviceGroupSearch(keyword: string) {
  if (ruleForm.schoolId == null) return;
  void fetchDeviceGroupOptions(ruleForm.schoolId, keyword);
}

/** 设备组下拉展开状态变化 */
function handleDeviceGroupVisibleChange(visibleValue: boolean) {
  if (!visibleValue || ruleForm.schoolId == null) return;
  void fetchDeviceGroupOptions(ruleForm.schoolId);
}

/** 提交 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl || submitLoading.value) return;
  if (!currentDevice.value?.id) {
    ElMessage.warning("未获取到设备信息，请关闭后重试");
    return;
  }
  const valid = await formEl.validate().catch(() => false);
  if (!valid) return;

  const targetGroup = deviceGroupOptions.value.find(item => item.id === ruleForm.deviceGroupId);
  if (targetGroup?.isVoipGroup) {
    try {
      await ElMessageBox.confirm(
        "更换到 VOIP 设备组会同步调整微信设备组成员，操作失败时设备不会完成换组。确定继续吗？",
        "同步确认",
        { type: "warning", confirmButtonText: "确认更换", cancelButtonText: "取消" }
      );
    } catch {
      return;
    }
  }

  submitLoading.value = true;
  try {
    const payload: DeviceVideo.ReqPostDeviceChangeSchoolApi =
      ruleForm.schoolId == null
        ? {
            schoolId: null,
            deviceGroupId: null
          }
        : {
            schoolId: ruleForm.schoolId,
            deviceGroupId: ruleForm.deviceGroupId
          };
    const result = await postDeviceChangeSchoolApi(currentDevice.value.id, payload);
    if (result.code !== 0) return;
    ElMessage.success(result.data?.message || "更换学校成功");
    visible.value = false;
    emit("submit");
  } catch (error) {
    console.error("handleSubmitForm:", error);
  } finally {
    submitLoading.value = false;
  }
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceVideo.IDeviceItemVo) {
  parameter.value = { ...parameter.value, ...params };
  currentDevice.value = row || null;
  currentSchoolName.value = row?.schoolName || "未绑定学校";

  const schoolId = normalizeId(row?.schoolId);
  const deviceGroupId = normalizeId(row?.deviceGroupId);

  initializing.value = true;
  ruleForm.schoolId = schoolId;
  ruleForm.deviceGroupId = deviceGroupId;

  schoolOptions.value = [];
  if (schoolId != null && row?.schoolName) {
    schoolOptions.value.push({ id: schoolId, name: row.schoolName });
  }

  deviceGroupOptions.value = [];
  if (schoolId != null) {
    await fetchDeviceGroupOptions(schoolId);
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
  initializing.value = false;
}

watch(
  () => ruleForm.schoolId,
  targetSchoolId => {
    if (initializing.value) return;
    void handleSchoolChange(targetSchoolId);
  }
);

defineExpose({
  acceptParams
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="parameter.title"
    width="760px"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <SchoolInfo :name="currentSchoolName" />

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="目标学校（留空表示解绑）" prop="schoolId">
            <el-select
              v-model="ruleForm.schoolId"
              class="w-full"
              filterable
              remote
              reserve-keyword
              clearable
              :remote-method="handleRemoteSchoolSearch"
              :visible-change="handleSchoolVisibleChange"
              :loading="schoolOptionsLoading"
              placeholder="请输入学校名称搜索"
            >
              <el-option v-for="item in schoolOptions" :key="item.id" :label="item.name || ''" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="目标设备组" prop="deviceGroupId">
            <el-select
              v-model="ruleForm.deviceGroupId"
              class="w-full"
              filterable
              remote
              reserve-keyword
              clearable
              :disabled="ruleForm.schoolId == null"
              :remote-method="handleRemoteDeviceGroupSearch"
              :visible-change="handleDeviceGroupVisibleChange"
              :loading="deviceGroupOptionsLoading"
              placeholder="请选择设备组"
            >
              <el-option v-for="item in deviceGroupOptions" :key="item.id" :label="item.name" :value="item.id" />
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
