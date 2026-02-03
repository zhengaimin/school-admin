<script setup lang="ts">
import type { Device as DeviceVideo, DeviceGroup } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceVideoForm } from "../utils/payload";

import { computed, nextTick, ref, unref } from "vue";
import { getDeviceDetailApi, postDeviceApi, putDeviceApi } from "@/api/modules";
import { ElMessage } from "element-plus";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { DEVICE_BILL_MODE_OPTIONS, PHONE_TYPE_OPTIONS, SIP_TYPE_OPTIONS, YES_NO_FLAG_OPTIONS } from "@/config/modules";
import { useSchool } from "@/hooks/useSchool";
import { buildPostDevicePayload, buildPutDevicePayload, normalizeDeviceGroupId } from "../utils/payload";

/** 表单校验规则 */
const rules: FormRules = {
  terminalSn: [{ required: true, message: "请输入设备SN号", trigger: "blur" }],
  terminalKey: [{ required: true, message: "请输入终端KEY", trigger: "blur" }],
  terminalMac: [{ required: true, message: "请输入设备MAC地址", trigger: "blur" }],
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
};
/** 默认设备组ID */
const defaultDeviceGroupId = -1;
/** 弹窗参数 */
const props = withDefaults(
  defineProps<{
    deviceGroupOptions?: DeviceGroup.IDeviceGroupItemVo[];
    deviceGroupLoading?: boolean;
    fetchDeviceGroupOptions?: (targetSchoolId?: number, name?: string) => Promise<any> | void;
  }>(),
  {
    deviceGroupOptions: () => [],
    deviceGroupLoading: false
  }
);

/** 学校信息 */
const { schoolId, schoolName: storeSchoolName } = useSchool();
/** 弹窗提交事件 */
const emit = defineEmits<{
  submit: [];
}>();

/** 弹窗可见 */
const visible = ref(false);
/** 提交加载 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
/** 表单 ref */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = ref<DeviceVideoForm>({});
/** 当前学校名称 */
const currentSchoolName = ref("");
/** 当前学校ID */
const currentSchoolId = ref(-1);

/** 是否新增 */
const isAdd = computed(() => parameter.value.type === "Add");
/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 是否查看 */
const isView = computed(() => parameter.value.type === "View");
/** 设备SN禁用 */
const isSnDisabled = computed(() => !isAdd.value);

/** 获取初始表单数据 */
function getInitialFormData(): DeviceVideoForm {
  return {
    deviceGroupId: defaultDeviceGroupId
  };
}
/** 解析学校ID */
function getSchoolIdValue(value?: number | string) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultDeviceGroupId : parsed;
}

/** 获取设备详情 */
async function axiosGetDeviceDetailApi(id: number) {
  try {
    const result = await getDeviceDetailApi(id);
    if (result.code === 0 && result.data) {
      ruleForm.value = {
        ...result.data,
        deviceGroupId: normalizeDeviceGroupId(result.data.deviceGroupId, defaultDeviceGroupId)
      };
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 新增设备 */
async function axiosPostDeviceApi(form: DeviceVideoForm) {
  try {
    const currentSchoolId = getSchoolIdValue(schoolId.value);
    if (currentSchoolId === defaultDeviceGroupId) {
      ElMessage.warning("请选择学校");
      return { code: -1, data: null };
    }
    const payload = buildPostDevicePayload(form, currentSchoolId, defaultDeviceGroupId);
    const result = await postDeviceApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostDeviceApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新设备 */
async function axiosPutDeviceApi(id: number, form: DeviceVideoForm) {
  try {
    const payload = buildPutDevicePayload(form);
    const result = await putDeviceApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutDeviceApi:", error);
    return { code: -1, data: null };
  }
}

/** 提交表单 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl || loading.value) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;
    loading.value = true;
    const form = unref(ruleForm);
    try {
      if (isAdd.value) {
        const result = await axiosPostDeviceApi(form);
        if (result.code !== 0) return;
      } else if (isEdit.value && form.id) {
        const result = await axiosPutDeviceApi(form.id, form);
        if (result.code !== 0) return;
      }
      visible.value = false;
      emit("submit");
    } finally {
      loading.value = false;
    }
  });
}
/** 搜索设备组 */
function handleDeviceGroupSearch(name: string) {
  return props.fetchDeviceGroupOptions?.(currentSchoolId.value, name);
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceVideo.IDeviceItemVo) {
  parameter.value = { ...parameter.value, ...params };
  if (isAdd.value) {
    ruleForm.value = {
      ...getInitialFormData()
    };
    currentSchoolName.value = storeSchoolName.value;
    currentSchoolId.value = getSchoolIdValue(schoolId.value);
  } else if (row?.id) {
    await axiosGetDeviceDetailApi(row.id);
    currentSchoolName.value = row.schoolName ?? "";
    currentSchoolId.value = getSchoolIdValue(row.schoolId);
  }
  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

/** 暴露方法 */
defineExpose({
  acceptParams
});
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="props.deviceGroupLoading">
      <SchoolInfo :name="currentSchoolName" />
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备SN号" prop="terminalSn">
              <el-input v-model="ruleForm.terminalSn" placeholder="请输入设备SN号" :disabled="isSnDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端KEY" prop="terminalKey">
              <el-input v-model="ruleForm.terminalKey" placeholder="请输入终端KEY" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备MAC地址" prop="terminalMac">
              <el-input v-model="ruleForm.terminalMac" placeholder="请输入设备MAC地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备位置" prop="location">
              <el-input v-model="ruleForm.location" placeholder="请输入设备位置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备组" prop="deviceGroupId">
              <el-select
                v-model="ruleForm.deviceGroupId"
                class="w-full"
                placeholder="请选择设备组"
                :loading="props.deviceGroupLoading"
                filterable
                remote
                reserve-keyword
                :remote-method="handleDeviceGroupSearch"
                clearable
              >
                <el-option label="不绑定" :value="-1" />
                <el-option v-for="item in props.deviceGroupOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="定时开机时间" prop="powerOnTime">
              <el-time-select v-model="ruleForm.powerOnTime" class="w-full" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定时关机时间" prop="powerOffTime">
              <el-time-select v-model="ruleForm.powerOffTime" class="w-full" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="心跳频率（毫秒）" prop="heartbeatFrequency">
              <el-input-number v-model="ruleForm.heartbeatFrequency" class="w-full" :min="0" :controls="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单次通话时长（分钟）" prop="callTime">
              <el-input-number v-model="ruleForm.callTime" class="w-full" :min="0" :controls="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="预警通话时长（分钟）" prop="warnCallTime">
              <el-input-number v-model="ruleForm.warnCallTime" class="w-full" :min="0" :controls="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费模式" prop="billMode">
              <el-select v-model="ruleForm.billMode" class="w-full" placeholder="请选择计费模式" clearable>
                <el-option v-for="item in DEVICE_BILL_MODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="拨号类型" prop="phoneType">
              <el-select v-model="ruleForm.phoneType" class="w-full" placeholder="请选择拨号类型" clearable>
                <el-option v-for="item in PHONE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁拨号码" prop="forbidPhone">
              <el-input v-model="ruleForm.forbidPhone" placeholder="请输入禁拨号码" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="禁拨时间段" prop="forbidCallTimes">
              <el-input v-model="ruleForm.forbidCallTimes" placeholder="如 08:00-12:00,14:00-18:00" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="显示留言按钮" prop="messageFlag">
              <el-select v-model="ruleForm.messageFlag" class="w-full" placeholder="请选择" clearable>
                <el-option v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开启语音留言" prop="messageSoundFlag">
              <el-select v-model="ruleForm.messageSoundFlag" class="w-full" placeholder="请选择" clearable>
                <el-option v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="全量同步人脸" prop="downloadUserFlag">
              <el-select v-model="ruleForm.downloadUserFlag" class="w-full" placeholder="请选择" clearable>
                <el-option v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="心理咨询身份认证" prop="mhcFlag">
              <el-select v-model="ruleForm.mhcFlag" class="w-full" placeholder="请选择" clearable>
                <el-option v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="刷脸记录人员信息" prop="addPunchFace">
              <el-select v-model="ruleForm.addPunchFace" class="w-full" placeholder="请选择" clearable>
                <el-option v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备密码" prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入设备密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Sip用户名" prop="sipUserName">
              <el-input v-model="ruleForm.sipUserName" placeholder="请输入Sip用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sip密码" prop="sipPassword">
              <el-input v-model="ruleForm.sipPassword" placeholder="请输入Sip密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="Sip服务地址" prop="sipDomain">
              <el-input v-model="ruleForm.sipDomain" placeholder="请输入Sip服务地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sip协议类型" prop="sipTransportType">
              <el-select v-model="ruleForm.sipTransportType" class="w-full" placeholder="请选择Sip协议类型" clearable>
                <el-option v-for="item in SIP_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
