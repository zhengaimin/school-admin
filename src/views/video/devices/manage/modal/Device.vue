<script setup lang="ts">
import type { Device as DeviceVideo, DeviceGroup } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceVideoForm } from "../types";

import { computed, nextTick, ref, unref } from "vue";
import { getDeviceDetailApi, postDeviceApi, putDeviceApi } from "@/api/modules";
import { ElMessage } from "element-plus";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import {
  DIAL_MODE,
  DIAL_MODE_OPTIONS,
  DEVICE_BILL_MODE,
  PHONE_ENTRY,
  PHONE_ENTRY_OPTIONS,
  PHONE_TYPE,
  SIP_TYPE_OPTIONS,
  YES_NO_FLAG,
  YES_NO_FLAG_OPTIONS
} from "@/config/modules";
import type { TYesNoFlagValue } from "@/config/modules";
import { useSchool } from "@/hooks/useSchool";
import { buildPostDevicePayload, buildPutDevicePayload, normalizeDeviceGroupId } from "../utils/payload";

/** 表单校验规则 */
const rules: FormRules = {
  terminalSn: [{ required: true, message: "请输入设备SN号", trigger: "blur" }],
  terminalMac: [{ required: true, message: "请输入设备MAC地址", trigger: "blur" }],
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
};
/** 默认设备组ID */
const defaultDeviceGroupId = -1;
/** 禁拨时间段项 */
type TForbidCallTimeItem = {
  /** 开始时间 */
  fstTime: string;
  /** 结束时间 */
  fendTime: string;
};

/** 扩展配置表单 */
type TDeviceExtraConfigForm = {
  /** 禁止呼入 */
  callIncomingDisabled: TYesNoFlagValue;
  /** 开启人脸 */
  faceEnabled: TYesNoFlagValue;
  /** 是否显示圈存菜单按钮 */
  dryerCardRechargeMenuButtonVisible: TYesNoFlagValue;
  /** SOS 标题 */
  sosTitle: string;
  /** 第三方地址 */
  thirdPartyUrl: string;
};

/** 扩展配置 key */
const deviceExtraConfigKey = {
  callIncomingDisabled: "call.incoming.disabled",
  faceEnabled: "face.enabled",
  dryerCardRechargeMenuButtonVisible: "dryer.card.recharge.menu.button.visible",
  sosTitle: "sos.title",
  thirdPartyUrl: "thirdParty.url"
} as const;

/** 创建空禁拨时间段 */
function createEmptyForbidCallTimeItem(): TForbidCallTimeItem {
  return { fstTime: "", fendTime: "" };
}

/** 获取初始扩展配置表单 */
function getInitialExtraConfigFormData(): TDeviceExtraConfigForm {
  return {
    callIncomingDisabled: YES_NO_FLAG.NO,
    faceEnabled: YES_NO_FLAG.NO,
    dryerCardRechargeMenuButtonVisible: YES_NO_FLAG.NO,
    sosTitle: "",
    thirdPartyUrl: ""
  };
}
/** 设备表单状态 */
type TDeviceFormState = Omit<DeviceVideoForm, "messageFlag" | "messageSoundFlag" | "mhcFlag" | "addPunchFace"> & {
  /** 是否显示留言按钮 */
  messageFlag: TYesNoFlagValue;
  /** 是否启用语音留言 */
  messageSoundFlag: TYesNoFlagValue;
  /** 心理咨询身份认证 */
  mhcFlag: TYesNoFlagValue;
  /** 刷脸记录人员信息 */
  addPunchFace: TYesNoFlagValue;
  /** 是否全量同步人脸 */
  downloadUserFlag: TYesNoFlagValue;
  /** 禁拨时间段列表 */
  forbidCallTimesAry: TForbidCallTimeItem[];
  /** 扩展配置 */
  extraConfig?: Record<string, any>;
};
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
const { schoolName: storeSchoolName } = useSchool();
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
const ruleForm = ref<TDeviceFormState>(getInitialFormData());
/** 扩展配置表单 */
const extraConfigForm = ref<TDeviceExtraConfigForm>(getInitialExtraConfigFormData());
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
/** 设备MAC禁用 */
const isTerminalDisabled = computed(() => !isAdd.value);
/** 设备组禁用（仅新增可选） */
const isDeviceGroupDisabled = computed(() => !isAdd.value);

/** 获取初始表单数据 */
function getInitialFormData(): TDeviceFormState {
  return {
    deviceGroupId: defaultDeviceGroupId,
    billMode: DEVICE_BILL_MODE.MERGED,
    powerOnTime: "06:00",
    phoneType: undefined,
    dialMode: DIAL_MODE.FAMILY,
    phoneTypes: [PHONE_ENTRY.SIP],
    messageFlag: YES_NO_FLAG.NO,
    downloadUserFlag: YES_NO_FLAG.NO,
    messageSoundFlag: YES_NO_FLAG.NO,
    mhcFlag: YES_NO_FLAG.NO,
    addPunchFace: YES_NO_FLAG.NO,
    forbidCallTimes: "",
    forbidCallTimesAry: [createEmptyForbidCallTimeItem()],
    extraConfig: {}
  };
}

const freeDialPhoneEntrySet = new Set<string>([PHONE_ENTRY.SIP, PHONE_ENTRY.SIM]);
const freeDialPhoneEntryOptions = PHONE_ENTRY_OPTIONS.filter(phoneEntryOption =>
  freeDialPhoneEntrySet.has(phoneEntryOption.value)
);

const phoneEntryOptions = computed(() =>
  ruleForm.value.dialMode === DIAL_MODE.FREE ? freeDialPhoneEntryOptions : PHONE_ENTRY_OPTIONS
);

function isPhoneEntryValue(value: string): value is NonNullable<DeviceVideo.IDeviceItemVo["phoneTypes"]>[number] {
  return value === PHONE_ENTRY.VIDEO || value === PHONE_ENTRY.SIM || value === PHONE_ENTRY.SIP;
}

function normalizePhoneTypesFromSelectValue(value: string | string[]) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.filter(isPhoneEntryValue);
}

const phoneTypesSelectValue = computed({
  get() {
    if (ruleForm.value.dialMode === DIAL_MODE.FREE) return ruleForm.value.phoneTypes?.[0] || "";
    return ruleForm.value.phoneTypes;
  },
  set(value: string | string[]) {
    if (ruleForm.value.dialMode === DIAL_MODE.FREE) {
      const singleValue = normalizePhoneTypesFromSelectValue(value)[0];
      ruleForm.value.phoneTypes = singleValue ? [singleValue] : [];
      return;
    }
    ruleForm.value.phoneTypes = normalizePhoneTypesFromSelectValue(value);
  }
});
/** 根据 SN 生成终端 Key */
function normalizeTerminalKeyBySn(terminalSn?: string | null) {
  return terminalSn?.trim?.() || "";
}

/** 兼容旧字段 phoneType，转换为新字段 phoneTypes */
function normalizePhoneTypes(
  phoneTypes?: DeviceVideo.IDeviceItemVo["phoneTypes"],
  legacyPhoneType?: DeviceVideo.IDeviceItemVo["phoneType"]
) {
  const validPhoneTypes = (phoneTypes || []).filter(
    phoneTypeItem => phoneTypeItem === PHONE_ENTRY.VIDEO || phoneTypeItem === PHONE_ENTRY.SIM || phoneTypeItem === PHONE_ENTRY.SIP
  );
  if (validPhoneTypes.length) return validPhoneTypes;
  if (legacyPhoneType === PHONE_TYPE.ALL) return [PHONE_ENTRY.VIDEO, PHONE_ENTRY.SIM, PHONE_ENTRY.SIP];
  if (legacyPhoneType === PHONE_TYPE.VIDEO) return [PHONE_ENTRY.VIDEO];
  if (legacyPhoneType === PHONE_TYPE.SIM) return [PHONE_ENTRY.SIM];
  return [PHONE_ENTRY.VIDEO];
}

/** 自由拨号模式下规范化拨号入口 */
function normalizeFreeDialPhoneTypes(phoneTypes?: DeviceVideo.IDeviceItemVo["phoneTypes"]) {
  const targetPhoneType = (phoneTypes || []).find(phoneTypeItem => freeDialPhoneEntrySet.has(phoneTypeItem));
  return [targetPhoneType || PHONE_ENTRY.SIP];
}

/** 按拨号模式规范化拨号入口 */
function normalizePhoneTypesByDialMode(
  dialMode?: DeviceVideo.IDeviceItemVo["dialMode"],
  phoneTypes?: DeviceVideo.IDeviceItemVo["phoneTypes"]
) {
  if (dialMode === DIAL_MODE.FREE) return normalizeFreeDialPhoneTypes(phoneTypes);
  return phoneTypes?.length ? phoneTypes : [PHONE_ENTRY.VIDEO];
}
/** 解析学校ID */
function getSchoolIdValue(value?: number | string) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultDeviceGroupId : parsed;
}
/** 归一化是/否值 */
function normalizeYesNoFlag(value?: TYesNoFlagValue | null) {
  return value ?? YES_NO_FLAG.NO;
}

/** 解析禁拨时间段为列表 */
function parseForbidCallTimes(value?: string | null): TForbidCallTimeItem[] {
  if (!value) return [createEmptyForbidCallTimeItem()];
  return value.split(",").map(timeRangeItem => {
    const [startTime, endTime] = timeRangeItem.split("-");
    return {
      fstTime: startTime || "",
      fendTime: endTime || ""
    };
  });
}

/** 拼装禁拨时间段字符串 */
function stringifyForbidCallTimes(forbidCallTimesAry: TForbidCallTimeItem[]) {
  return forbidCallTimesAry
    .filter(timeRangeItem => timeRangeItem.fstTime && timeRangeItem.fendTime)
    .map(timeRangeItem => `${timeRangeItem.fstTime}-${timeRangeItem.fendTime}`)
    .join(",");
}

/** 设备详情转换为表单结构 */
function transformDetailToFormState(detail: DeviceVideo.ResGetDeviceDetailApi): TDeviceFormState {
  const dialMode = detail.dialMode || DIAL_MODE.FAMILY;
  const normalizedPhoneTypes = normalizePhoneTypesByDialMode(dialMode, normalizePhoneTypes(detail.phoneTypes, detail.phoneType));
  return {
    ...detail,
    terminalKey: normalizeTerminalKeyBySn(detail.terminalSn),
    deviceGroupId: normalizeDeviceGroupId(detail.deviceGroupId, defaultDeviceGroupId),
    billMode: DEVICE_BILL_MODE.MERGED,
    phoneType: detail.phoneType ?? undefined,
    dialMode,
    phoneTypes: normalizedPhoneTypes,
    messageFlag: normalizeYesNoFlag(detail.messageFlag),
    downloadUserFlag: normalizeYesNoFlag(detail.downloadUserFlag),
    messageSoundFlag: normalizeYesNoFlag(detail.messageSoundFlag),
    mhcFlag: normalizeYesNoFlag(detail.mhcFlag),
    addPunchFace: normalizeYesNoFlag(detail.addPunchFace),
    forbidCallTimesAry: parseForbidCallTimes(detail.forbidCallTimes),
    extraConfig: detail.extraConfig || {}
  };
}

/** 设置当前学校上下文 */
function setCurrentSchoolContext(schoolName = "", targetSchoolId?: number | string) {
  currentSchoolName.value = schoolName;
  currentSchoolId.value = getSchoolIdValue(targetSchoolId);
}

/** 同步禁拨时间段字符串 */
function handleSyncForbidCallTimes() {
  ruleForm.value.forbidCallTimes = stringifyForbidCallTimes(ruleForm.value.forbidCallTimesAry);
}
/** 规范化扩展配置是/否值 */
function normalizeExtraConfigYesNoFlag(value: unknown): TYesNoFlagValue {
  if (typeof value === "boolean") return value ? YES_NO_FLAG.YES : YES_NO_FLAG.NO;
  if (typeof value === "number") return value === 1 ? YES_NO_FLAG.YES : YES_NO_FLAG.NO;
  if (typeof value !== "string") return YES_NO_FLAG.NO;
  const normalizedValue = value.trim().toLowerCase();
  if (["y", "yes", "true", "1"].includes(normalizedValue)) return YES_NO_FLAG.YES;
  return YES_NO_FLAG.NO;
}
/** 规范化扩展配置字符串 */
function normalizeExtraConfigString(value: unknown) {
  return typeof value === "string" ? value : "";
}
/** 规范化扩展配置布尔提交值 */
function normalizeExtraConfigSubmitBoolean(value: TYesNoFlagValue) {
  return value === YES_NO_FLAG.YES;
}
/** 从 extraConfig 同步到扩展配置表单 */
function handleSyncExtraConfigForm() {
  const extraConfig = ruleForm.value.extraConfig || {};
  extraConfigForm.value = {
    callIncomingDisabled: normalizeExtraConfigYesNoFlag(extraConfig[deviceExtraConfigKey.callIncomingDisabled]),
    faceEnabled: normalizeExtraConfigYesNoFlag(extraConfig[deviceExtraConfigKey.faceEnabled]),
    dryerCardRechargeMenuButtonVisible: normalizeExtraConfigYesNoFlag(
      extraConfig[deviceExtraConfigKey.dryerCardRechargeMenuButtonVisible]
    ),
    sosTitle: normalizeExtraConfigString(extraConfig[deviceExtraConfigKey.sosTitle]),
    thirdPartyUrl: normalizeExtraConfigString(extraConfig[deviceExtraConfigKey.thirdPartyUrl])
  };
}
/** 从扩展配置表单同步到 extraConfig */
function handleSyncExtraConfig() {
  const { callIncomingDisabled, faceEnabled, dryerCardRechargeMenuButtonVisible, sosTitle, thirdPartyUrl } =
    extraConfigForm.value;
  const oldExtraConfig = ruleForm.value.extraConfig || {};
  const newExtraConfig = {
    ...oldExtraConfig,
    [deviceExtraConfigKey.callIncomingDisabled]: normalizeExtraConfigSubmitBoolean(callIncomingDisabled),
    [deviceExtraConfigKey.faceEnabled]: normalizeExtraConfigSubmitBoolean(faceEnabled),
    [deviceExtraConfigKey.dryerCardRechargeMenuButtonVisible]: normalizeExtraConfigSubmitBoolean(
      dryerCardRechargeMenuButtonVisible
    ),
    [deviceExtraConfigKey.sosTitle]: sosTitle?.trim?.() || "",
    [deviceExtraConfigKey.thirdPartyUrl]: thirdPartyUrl?.trim?.() || ""
  };
  ruleForm.value.extraConfig = newExtraConfig;
}

/** 获取设备详情 */
async function axiosGetDeviceDetailApi(id: number) {
  try {
    const result = await getDeviceDetailApi(id);
    if (result.code === 0 && result.data) {
      ruleForm.value = transformDetailToFormState(result.data);
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 获取提交所需学校ID */
function getSubmitSchoolId() {
  const targetSchoolId = getSchoolIdValue(currentSchoolId.value);
  if (targetSchoolId === defaultDeviceGroupId) {
    ElMessage.warning("未获取到学校ID，请关闭弹窗后重试");
    return;
  }
  return targetSchoolId;
}
/** 新增设备 */
async function axiosPostDeviceApi(form: DeviceVideoForm, targetSchoolId: number) {
  try {
    const payload = buildPostDevicePayload(form, targetSchoolId, defaultDeviceGroupId);
    const result = await postDeviceApi(payload);
    if (result.code === 0) {
      const successCount = result.data?.successCount ?? 0;
      const failCount = result.data?.failCount ?? 0;
      if (failCount > 0 && successCount <= 0) {
        ElMessage.warning("新增失败，请检查失败明细");
        return { ...result, code: -1 };
      }
      if (failCount > 0) {
        ElMessage.warning(`新增完成：成功${successCount}条，失败${failCount}条`);
      } else {
        ElMessage.success("添加成功");
      }
    }
    return result;
  } catch (error) {
    console.error("axiosPostDeviceApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新设备 */
async function axiosPutDeviceApi(id: number, form: DeviceVideoForm, targetSchoolId: number) {
  try {
    const payload = buildPutDevicePayload(form, targetSchoolId, defaultDeviceGroupId);
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
  const valid = await formEl.validate().catch(() => false);
  if (!valid) return;
  const targetSchoolId = getSubmitSchoolId();
  if (targetSchoolId == null) return;
  loading.value = true;
  try {
    ruleForm.value.terminalKey = normalizeTerminalKeyBySn(ruleForm.value.terminalSn);
    handleSyncExtraConfig();
    handleSyncForbidCallTimes();
    const form = unref(ruleForm);
    const submitForm: DeviceVideoForm = {
      ...form
    };
    if (isAdd.value) {
      const result = await axiosPostDeviceApi(submitForm, targetSchoolId);
      if (result.code !== 0) return;
    } else if (isEdit.value && submitForm.id) {
      const result = await axiosPutDeviceApi(submitForm.id, submitForm, targetSchoolId);
      if (result.code !== 0) return;
    }
    visible.value = false;
    emit("submit");
  } finally {
    loading.value = false;
  }
}
/** 搜索设备组 */
function handleDeviceGroupSearch(name: string) {
  const targetSchoolId = getSchoolIdValue(currentSchoolId.value);
  if (targetSchoolId === defaultDeviceGroupId) return;
  return props.fetchDeviceGroupOptions?.(targetSchoolId, name);
}
/** 新增禁拨时间段 */
function handleAddForbidCallTimeItem() {
  ruleForm.value.forbidCallTimesAry.push(createEmptyForbidCallTimeItem());
}
/** 删除禁拨时间段 */
function handleDeleteForbidCallTimeItem(index: number) {
  ruleForm.value.forbidCallTimesAry.splice(index, 1);
}

/** 拨号模式变更 */
function handleDialModeChange() {
  if (ruleForm.value.dialMode !== DIAL_MODE.FREE) return;
  ruleForm.value.phoneTypes = [PHONE_ENTRY.SIP];
}

/** 拨号入口变更 */
function handlePhoneTypesChange() {
  if (ruleForm.value.dialMode !== DIAL_MODE.FREE) return;
  ruleForm.value.phoneTypes = normalizeFreeDialPhoneTypes(ruleForm.value.phoneTypes);
}

/** 接收参数 */
async function acceptParams(params: TModalParams & { schoolId?: number }, row?: DeviceVideo.IDeviceItemVo) {
  parameter.value = { ...parameter.value, ...params };
  const targetSchoolId = getSchoolIdValue(params.schoolId);
  if (isAdd.value) {
    ruleForm.value = {
      ...getInitialFormData(),
      terminalKey: ""
    };
    extraConfigForm.value = getInitialExtraConfigFormData();
    setCurrentSchoolContext(storeSchoolName.value, targetSchoolId);
  } else if (row?.id) {
    await axiosGetDeviceDetailApi(row.id);
    setCurrentSchoolContext(row.schoolName ?? "", targetSchoolId);
  }
  handleSyncExtraConfigForm();
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
  <el-dialog v-model="visible" :title="parameter.title" width="1120px" destroy-on-close draggable align-center>
    <div>
      <SchoolInfo :name="currentSchoolName" />
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="设备SN号" prop="terminalSn">
              <el-input v-model="ruleForm.terminalSn" placeholder="请输入设备SN号" :disabled="isSnDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备MAC地址" prop="terminalMac">
              <el-input v-model="ruleForm.terminalMac" placeholder="请输入设备MAC地址" :disabled="isTerminalDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备组" prop="deviceGroupId">
              <el-select
                v-model="ruleForm.deviceGroupId"
                class="w-full"
                placeholder="请选择设备组"
                filterable
                remote
                reserve-keyword
                :remote-method="handleDeviceGroupSearch"
                :disabled="isDeviceGroupDisabled"
                clearable
              >
                <el-option label="不绑定" :value="-1" />
                <el-option v-for="item in props.deviceGroupOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备位置" prop="location">
              <el-input v-model="ruleForm.location" placeholder="请输入设备位置" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备密码" prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入设备密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="心跳频率（毫秒）" prop="heartbeatFrequency">
              <el-input-number
                v-model="ruleForm.heartbeatFrequency"
                class="w-full"
                :min="0"
                :step="1"
                :step-strictly="true"
                :controls="false"
                placeholder="请输入心跳频率（毫秒）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次通话时长（分钟）" prop="callTime">
              <el-input-number
                v-model="ruleForm.callTime"
                class="w-full"
                :min="0"
                :step="1"
                :step-strictly="true"
                :controls="false"
                placeholder="请输入单次通话时长（分钟）"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="拨号模式" prop="dialMode">
              <el-select
                v-model="ruleForm.dialMode"
                class="w-full"
                placeholder="请选择拨号模式"
                clearable
                @change="handleDialModeChange"
              >
                <el-option v-for="item in DIAL_MODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拨号入口" prop="phoneTypes">
              <el-select
                v-model="phoneTypesSelectValue"
                class="w-full"
                placeholder="请选择拨号入口"
                :multiple="ruleForm.dialMode !== DIAL_MODE.FREE"
                @change="handlePhoneTypesChange"
              >
                <el-option v-for="item in phoneEntryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="SIP协议类型" prop="sipTransportType">
              <el-select v-model="ruleForm.sipTransportType" class="w-full" placeholder="请选择SIP协议类型" clearable>
                <el-option v-for="item in SIP_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIP服务地址" prop="sipDomain">
              <el-input v-model="ruleForm.sipDomain" placeholder="请输入SIP服务地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIP用户名" prop="sipUserName">
              <el-input v-model="ruleForm.sipUserName" placeholder="请输入SIP用户名" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIP密码" prop="sipPassword">
              <el-input v-model="ruleForm.sipPassword" placeholder="请输入SIP密码" class="w-full" show-password />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="定时开机时间">
              <el-time-select
                v-model="ruleForm.powerOnTime"
                class="w-full"
                start="00:00"
                step="00:10"
                end="23:59"
                placeholder="请选择定时开机时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="定时关机时间">
              <el-time-select
                v-model="ruleForm.powerOffTime"
                class="w-full"
                start="00:00"
                step="00:10"
                end="23:59"
                placeholder="请选择定时关机时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SOS标题" prop="extraConfig.sos.title">
              <el-input v-model="extraConfigForm.sosTitle" placeholder="请输入 SOS 标题" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="第三方地址" prop="extraConfig.thirdParty.url">
              <el-input v-model="extraConfigForm.thirdPartyUrl" type="textarea" placeholder="请输入第三方地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="禁拨号码" prop="forbidPhone">
              <el-input v-model="ruleForm.forbidPhone" type="textarea" placeholder="请输入禁拨号码，多个号码使用英文逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="是否显示留言按钮" prop="messageFlag">
              <el-radio-group v-model="ruleForm.messageFlag">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否启用语音留言" prop="messageSoundFlag">
              <el-radio-group v-model="ruleForm.messageSoundFlag">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="禁止呼入" prop="extraConfig.call.incoming.disabled">
              <el-radio-group v-model="extraConfigForm.callIncomingDisabled">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开启人脸" prop="extraConfig.face.enabled">
              <el-radio-group v-model="extraConfigForm.faceEnabled">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否显示圈存菜单按钮" prop="extraConfig.dryer.card.recharge.menu.button.visible">
              <el-radio-group v-model="extraConfigForm.dryerCardRechargeMenuButtonVisible">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="刷脸记录人员信息" prop="addPunchFace">
              <el-radio-group v-model="ruleForm.addPunchFace">
                <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="禁拨时间段">
              <el-button type="primary" link @click="handleAddForbidCallTimeItem">+ 新增</el-button>
            </el-form-item>
            <el-row v-for="(timeRangeItem, itemIndex) in ruleForm.forbidCallTimesAry" :key="itemIndex" :gutter="24">
              <el-col :span="8">
                <el-form-item label="禁拨开始时间">
                  <el-time-select
                    v-model="timeRangeItem.fstTime"
                    class="w-full"
                    start="00:00"
                    step="00:10"
                    end="23:59"
                    placeholder="请选择禁拨开始时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="禁拨结束时间">
                  <el-time-select
                    v-model="timeRangeItem.fendTime"
                    class="w-full"
                    start="00:00"
                    step="00:10"
                    end="23:59"
                    placeholder="请选择禁拨结束时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作">
                  <el-button type="danger" link class="leading-8 p-0!" @click="handleDeleteForbidCallTimeItem(itemIndex)">
                    删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
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
