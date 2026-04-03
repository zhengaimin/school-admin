<script setup lang="ts">
import type { DeviceDialConfig } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { ControlModalProps, DialConfigForm } from "../types";

import { computed, nextTick, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceDialConfigDetailApi, postDeviceDialConfigApi, putDeviceDialConfigApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import {
  DIAL_MODE,
  DIAL_MODE_OPTIONS,
  PHONE_ENTRY,
  PHONE_ENTRY_OPTIONS,
  PHONE_TYPE,
  SIP_TYPE_OPTIONS,
  YES_NO_FLAG,
  YES_NO_FLAG_OPTIONS
} from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";
import {
  buildPostDeviceDialConfigPayload,
  buildPutDeviceDialConfigPayload,
  normalizeDryerCardRechargeAmountOptions
} from "../utils/payload";

const props = withDefaults(defineProps<ControlModalProps>(), {
  schoolName: ""
});

const emit = defineEmits(["success"]);

const userStore = useUserStore();

/** 弹窗显示状态 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
/** 表单引用 */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = reactive<DialConfigForm>(getInitialForm());
/** 表单校验规则 */
const rules = reactive<FormRules>({
  dryerCardRechargeEnabled: [{ required: true, message: "请选择吹风机圈存开关", trigger: "change" }],
  dryerCardRechargeAmountOptions: [{ validator: validateDryerCardRechargeAmountOptions, trigger: "blur" }]
});

/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 是否查看 */
const isView = computed(() => parameter.value.type === "View");

/** 当前学校ID */
const currentSchoolId = computed<number | "">(() => (userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : ""));

/** 获取表单初始值 */
function getInitialForm(): DialConfigForm {
  return {
    schoolId: "",
    heartbeatFrequency: "",
    callTime: "",
    powerOnTime: "06:00",
    powerOffTime: "",
    forbidPhone: "",
    phoneType: undefined,
    dialMode: DIAL_MODE.FAMILY,
    phoneTypes: [PHONE_ENTRY.SIP],
    messageFlag: YES_NO_FLAG.NO,
    downloadUserFlag: YES_NO_FLAG.NO,
    messageSoundFlag: YES_NO_FLAG.NO,
    mhcFlag: YES_NO_FLAG.NO,
    addPunchFace: YES_NO_FLAG.NO,
    forbidCallTimesAry: [{ fstTime: "", fendTime: "" }],
    forbidCallTimes: "",
    sipDomain: "",
    sipPassword: "",
    sipTransportType: "",
    sipUserName: "",
    callIncomingDisabled: YES_NO_FLAG.NO,
    faceEnabled: YES_NO_FLAG.NO,
    sosTitle: "",
    thirdPartyUrl: "",
    dryerCardRechargeEnabled: YES_NO_FLAG.NO,
    dryerCardRechargeAmountOptions: ""
  };
}

const freeDialPhoneEntrySet = new Set<string>([PHONE_ENTRY.SIP, PHONE_ENTRY.SIM]);
const freeDialPhoneEntryOptions = PHONE_ENTRY_OPTIONS.filter(phoneEntryOption =>
  freeDialPhoneEntrySet.has(phoneEntryOption.value)
);

const phoneEntryOptions = computed(() =>
  ruleForm.dialMode === DIAL_MODE.FREE ? freeDialPhoneEntryOptions : PHONE_ENTRY_OPTIONS
);

function isPhoneEntryValue(value: string): value is NonNullable<DeviceDialConfig.IDeviceDialConfigVo["phoneTypes"]>[number] {
  return value === PHONE_ENTRY.VIDEO || value === PHONE_ENTRY.SIM || value === PHONE_ENTRY.SIP;
}

function normalizePhoneTypesFromSelectValue(value: string | string[]) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.filter(isPhoneEntryValue);
}

const phoneTypesSelectValue = computed({
  get() {
    if (ruleForm.dialMode === DIAL_MODE.FREE) return ruleForm.phoneTypes?.[0] || "";
    return ruleForm.phoneTypes;
  },
  set(value: string | string[]) {
    if (ruleForm.dialMode === DIAL_MODE.FREE) {
      const singleValue = normalizePhoneTypesFromSelectValue(value)[0];
      ruleForm.phoneTypes = singleValue ? [singleValue] : [];
      return;
    }
    ruleForm.phoneTypes = normalizePhoneTypesFromSelectValue(value);
  }
});

/** 解析扩展配置为单项字段 */
function parseExtraConfigFlag(value: unknown) {
  if (typeof value === "boolean") return value ? YES_NO_FLAG.YES : YES_NO_FLAG.NO;
  if (typeof value === "number") return value === 1 ? YES_NO_FLAG.YES : YES_NO_FLAG.NO;
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["y", "yes", "true", "1"].indexOf(normalizedValue) >= 0) return YES_NO_FLAG.YES;
    if (["n", "no", "false", "0"].indexOf(normalizedValue) >= 0) return YES_NO_FLAG.NO;
  }
  return YES_NO_FLAG.NO;
}

/** 解析扩展配置字符串 */
function parseExtraConfigString(value: unknown) {
  return typeof value === "string" ? value : "";
}

/** 解析吹风机圈存金额。 */
function parseDryerCardRechargeAmountOptions(value: unknown) {
  return normalizeDryerCardRechargeAmountOptions(value);
}

/** 校验吹风机圈存金额。 */
function validateDryerCardRechargeAmountOptions(
  _rule: unknown,
  value: DialConfigForm["dryerCardRechargeAmountOptions"],
  callback: (error?: Error) => void
) {
  if (ruleForm.dryerCardRechargeEnabled !== YES_NO_FLAG.YES) {
    callback();
    return;
  }
  const amountText = normalizeDryerCardRechargeAmountOptions(value);
  if (!amountText) {
    callback(new Error("请输入圈存金额"));
    return;
  }
  callback();
}

/** 兼容旧字段 phoneType，转换为新字段 phoneTypes */
function normalizePhoneTypes(
  phoneTypes?: DeviceDialConfig.IDeviceDialConfigVo["phoneTypes"],
  legacyPhoneType?: DeviceDialConfig.IDeviceDialConfigVo["phoneType"]
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
function normalizeFreeDialPhoneTypes(phoneTypes?: DeviceDialConfig.IDeviceDialConfigVo["phoneTypes"]) {
  const targetPhoneType = (phoneTypes || []).find(phoneTypeItem => freeDialPhoneEntrySet.has(phoneTypeItem));
  return [targetPhoneType || PHONE_ENTRY.SIP];
}

/** 按拨号模式规范化拨号入口 */
function normalizePhoneTypesByDialMode(
  dialMode: DeviceDialConfig.IDeviceDialConfigVo["dialMode"],
  phoneTypes?: DeviceDialConfig.IDeviceDialConfigVo["phoneTypes"]
) {
  if (dialMode === DIAL_MODE.FREE) return normalizeFreeDialPhoneTypes(phoneTypes);
  return phoneTypes?.length ? phoneTypes : [PHONE_ENTRY.VIDEO];
}

/** 拨号模式变更 */
function handleDialModeChange() {
  if (ruleForm.dialMode !== DIAL_MODE.FREE) return;
  ruleForm.phoneTypes = [PHONE_ENTRY.SIP];
}

/** 拨号入口变更 */
function handlePhoneTypesChange() {
  if (ruleForm.dialMode !== DIAL_MODE.FREE) return;
  ruleForm.phoneTypes = normalizeFreeDialPhoneTypes(ruleForm.phoneTypes);
}
/** 重置表单数据 */
function resetForm() {
  delete ruleForm.id;
  Object.assign(ruleForm, getInitialForm());
}
/** 获取公话配置详情 */
async function axiosGetDialConfigDetailApi(id: number) {
  try {
    const result = await getDeviceDialConfigDetailApi(id);
    if (result.code === 0 && result.data) {
      const dialMode = result.data.dialMode || DIAL_MODE.FAMILY;
      const normalizedPhoneTypes = normalizePhoneTypesByDialMode(
        dialMode,
        normalizePhoneTypes(result.data.phoneTypes, result.data.phoneType)
      );
      Object.assign(ruleForm, {
        ...result.data,
        dialMode,
        phoneTypes: normalizedPhoneTypes,
        downloadUserFlag: result.data.downloadUserFlag || YES_NO_FLAG.NO,
        callIncomingDisabled: parseExtraConfigFlag(result.data.extraConfig?.["call.incoming.disabled"]),
        faceEnabled: parseExtraConfigFlag(result.data.extraConfig?.["face.enabled"]),
        sosTitle: parseExtraConfigString(result.data.extraConfig?.["sos.title"]),
        thirdPartyUrl: parseExtraConfigString(result.data.extraConfig?.["thirdParty.url"]),
        dryerCardRechargeEnabled: parseExtraConfigFlag(result.data.extraConfig?.["dryer.card.recharge.enabled"]),
        dryerCardRechargeAmountOptions: parseDryerCardRechargeAmountOptions(
          result.data.extraConfig?.["dryer.card.recharge.amount.options"]
        )
      });
      handleParseForbidCallTimes(result.data.forbidCallTimes);
    }
    return result;
  } catch (error) {
    console.error("axiosGetDialConfigDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 新增公话配置 */
async function axiosPostDialConfigApi(form: DialConfigForm, schoolId: number | "") {
  try {
    const payload = buildPostDeviceDialConfigPayload(form, Number(schoolId || 0));
    const result = await postDeviceDialConfigApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostDialConfigApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新公话配置 */
async function axiosPutDialConfigApi(id: number, form: DialConfigForm) {
  try {
    const payload = buildPutDeviceDialConfigPayload(form);
    const result = await putDeviceDialConfigApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutDialConfigApi:", error);
    return { code: -1, data: null };
  }
}

/** 新增禁拨时间 */
function handleAddForbidCallTimeItem() {
  ruleForm.forbidCallTimesAry.push({
    fstTime: "",
    fendTime: ""
  });
}
/** 删除禁拨时间 */
function handleDeleteForbidCallTimeItem(index: number) {
  ruleForm.forbidCallTimesAry.splice(index, 1);
}
/** 提交表单 */
async function handleSubmitForm() {
  if (!ruleFormRef.value) return;
  const valid = await ruleFormRef.value.validate();
  if (!valid) return;
  ruleForm.dryerCardRechargeAmountOptions = normalizeDryerCardRechargeAmountOptions(ruleForm.dryerCardRechargeAmountOptions);

  const res = isEdit.value
    ? await axiosPutDialConfigApi(ruleForm.id!, ruleForm)
    : await axiosPostDialConfigApi(ruleForm, currentSchoolId.value);
  if (res.code !== 0) return;

  visible.value = false;
  emit("success");
}
/** 解析禁拨时间段 */
function handleParseForbidCallTimes(value?: string | null) {
  if (!value) {
    ruleForm.forbidCallTimesAry = [{ fstTime: "", fendTime: "" }];
    return;
  }
  ruleForm.forbidCallTimesAry = value.split(",").map(item => {
    const [startTime, endTime] = item.split("-");
    return { fstTime: startTime || "", fendTime: endTime || "" };
  });
}
/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceDialConfig.IDeviceDialConfigVo) {
  parameter.value = { ...parameter.value, ...params };
  if ((isEdit.value || isView.value) && row?.id) {
    const result = await axiosGetDialConfigDetailApi(row.id);
    if (result.code !== 0) {
      ElMessage.error("获取信息失败");
      return;
    }
  } else {
    resetForm();
    nextTick(() => {
      ruleFormRef.value?.resetFields();
    });
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="1120px"
    destroy-on-close
    draggable
    align-center
  >
    <SchoolInfo :name="props.schoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="心跳时间（ms）" prop="heartbeatFrequency">
            <el-input v-model="ruleForm.heartbeatFrequency" type="number" placeholder="请输入心跳时间（ms）" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单次通话限定时长（分钟）" prop="callTime">
            <el-input-number
              v-model="ruleForm.callTime"
              class="w-full"
              :min="0"
              :step="1"
              :step-strictly="true"
              :controls="false"
              placeholder="请输入单次通话限定时长（分钟）"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" />
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="拨号模式" prop="dialMode">
            <el-select v-model="ruleForm.dialMode" placeholder="请选择拨号模式" class="w-full" @change="handleDialModeChange">
              <el-option v-for="item in DIAL_MODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="拨号入口" prop="phoneTypes">
            <el-select
              v-model="phoneTypesSelectValue"
              placeholder="请选择拨号入口"
              class="w-full"
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
            <el-select v-model="ruleForm.sipTransportType" placeholder="请选择SIP协议类型" class="w-full">
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
            <el-input v-model="ruleForm.sipUserName" placeholder="请输入SIP用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SIP密码" prop="sipPassword">
            <el-input v-model="ruleForm.sipPassword" placeholder="请输入SIP密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="定时开机时间" prop="powerOnTime">
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
          <el-form-item label="定时关机时间" prop="powerOffTime">
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
          <el-form-item label="SOS标题" prop="sosTitle">
            <el-input v-model="ruleForm.sosTitle" placeholder="请输入 SOS 标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="第三方地址" prop="thirdPartyUrl">
            <el-input v-model="ruleForm.thirdPartyUrl" type="textarea" placeholder="请输入第三方地址" />
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
          <el-form-item label="禁止呼入" prop="callIncomingDisabled">
            <el-radio-group v-model="ruleForm.callIncomingDisabled">
              <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开启人脸" prop="faceEnabled">
            <el-radio-group v-model="ruleForm.faceEnabled">
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
      <el-divider content-position="left">吹风机圈存配置</el-divider>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="圈存开关" prop="dryerCardRechargeEnabled">
            <el-radio-group v-model="ruleForm.dryerCardRechargeEnabled">
              <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.dryerCardRechargeEnabled === YES_NO_FLAG.YES" :span="16">
          <el-form-item label="圈存金额（元）" prop="dryerCardRechargeAmountOptions">
            <el-input
              v-model="ruleForm.dryerCardRechargeAmountOptions"
              type="textarea"
              :rows="3"
              placeholder="请输入圈存金额，多个金额用英文逗号分隔"
            />
            <div class="form-tips">提示：金额用“,”分隔，例如：0.01,0.02</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="禁拨时间段">
            <el-button type="primary" @click="handleAddForbidCallTimeItem">+ 新增</el-button>
          </el-form-item>
          <el-row v-for="(item, i) in ruleForm.forbidCallTimesAry" :key="i" :gutter="24">
            <el-col :span="8">
              <el-form-item label="禁拨开始时间">
                <el-time-select
                  v-model="item.fstTime"
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
                  v-model="item.fendTime"
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
                <el-button type="danger" link class="leading-8 p-0!" @click="handleDeleteForbidCallTimeItem(i)"> 删除 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
