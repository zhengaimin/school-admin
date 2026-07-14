<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="760px"
    destroy-on-close
    draggable
    align-center
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="学校">{{ detailForm.schoolName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="心跳时间（ms）">{{ detailForm.heartbeatFrequency ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="单次通话限定时长（分钟）">{{ detailForm.callTime ?? "--" }}</el-descriptions-item>
      <el-descriptions-item label="拨号模式">{{ getDialModeText(detailForm.dialMode) }}</el-descriptions-item>
      <el-descriptions-item label="拨号入口">{{ getPhoneEntriesText(detailForm) }}</el-descriptions-item>
      <el-descriptions-item label="SIP服务地址">{{ detailForm.sipDomain || "--" }}</el-descriptions-item>
      <el-descriptions-item label="SIP协议类型">{{ getSipTypeText(detailForm.sipTransportType) }}</el-descriptions-item>
      <el-descriptions-item label="SIP用户名">{{ detailForm.sipUserName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="SIP密码">{{ detailForm.sipPassword || "--" }}</el-descriptions-item>
      <el-descriptions-item label="定时开机时间">{{ detailForm.powerOnTime || "--" }}</el-descriptions-item>
      <el-descriptions-item label="定时关机时间">{{ detailForm.powerOffTime || "--" }}</el-descriptions-item>
      <el-descriptions-item label="禁止呼入">
        {{ getExtraConfigYesNoText(detailForm.extraConfig?.["call.incoming.disabled"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="开启人脸">
        {{ getExtraConfigYesNoText(detailForm.extraConfig?.["face.enabled"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="SOS标题">
        {{ getExtraConfigString(detailForm.extraConfig?.["sos.title"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="第三方地址">
        {{ getExtraConfigString(detailForm.extraConfig?.["thirdParty.url"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="吹风机圈存开关">
        {{ getExtraConfigYesNoText(detailForm.extraConfig?.["recharge.button.visible"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="圈存金额（元）" :span="2">
        {{ getDryerCardRechargeAmountOptionsText(detailForm.extraConfig?.["dryer.card.recharge.amount.options"]) }}
      </el-descriptions-item>
      <el-descriptions-item label="是否显示留言按钮">
        {{ getYesNoText(detailForm.messageFlag) }}
      </el-descriptions-item>
      <el-descriptions-item label="是否启用语音留言">
        {{ getYesNoText(detailForm.messageSoundFlag) }}
      </el-descriptions-item>
      <el-descriptions-item label="刷脸记录人员信息">
        {{ getYesNoText(detailForm.addPunchFace) }}
      </el-descriptions-item>
      <el-descriptions-item label="禁拨号码">
        {{ detailForm.forbidPhone || "--" }}
      </el-descriptions-item>
      <el-descriptions-item label="禁拨时间段">
        {{ detailForm.forbidCallTimes || "--" }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { TDeviceDialConfigDetail } from "../types";

import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceDialConfigDetailApi } from "@/api/modules";
import {
  DIAL_MODE_I18N,
  PHONE_ENTRY,
  PHONE_ENTRY_I18N,
  PHONE_TYPE,
  SIP_TYPE_I18N,
  YES_NO_FLAG,
  YES_NO_FLAG_I18N
} from "@/config/modules";

/** 弹窗显示状态 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 详情数据 */
const detailForm = ref<Partial<TDeviceDialConfigDetail>>({});

/** 获取拨号模式文案 */
function getDialModeText(value?: TDeviceDialConfigDetail["dialMode"] | null) {
  if (!value) return "--";
  return DIAL_MODE_I18N[value] || value;
}
/** 获取拨号入口文案 */
function getPhoneEntriesText(detail: Partial<TDeviceDialConfigDetail>) {
  if (detail.phoneTypes?.length) {
    return detail.phoneTypes.map(item => PHONE_ENTRY_I18N[item] || item).join("、");
  }
  if (detail.phoneType === PHONE_TYPE.ALL) {
    return [PHONE_ENTRY.VIDEO, PHONE_ENTRY.SIM, PHONE_ENTRY.SIP].map(item => PHONE_ENTRY_I18N[item]).join("、");
  }
  if (detail.phoneType === PHONE_TYPE.VIDEO) return PHONE_ENTRY_I18N[PHONE_ENTRY.VIDEO];
  if (detail.phoneType === PHONE_TYPE.SIM) return PHONE_ENTRY_I18N[PHONE_ENTRY.SIM];
  return "--";
}
/** 获取 SIP 协议类型文案 */
function getSipTypeText(value?: TDeviceDialConfigDetail["sipTransportType"]) {
  if (!value) return "--";
  return SIP_TYPE_I18N[value] || value;
}
/** 获取是否文案 */
function getYesNoText(value?: TDeviceDialConfigDetail["messageFlag"]) {
  if (value === YES_NO_FLAG.YES) return YES_NO_FLAG_I18N[YES_NO_FLAG.YES];
  if (value === YES_NO_FLAG.NO) return YES_NO_FLAG_I18N[YES_NO_FLAG.NO];
  return "--";
}
/** 获取扩展配置开关文案 */
function getExtraConfigYesNoText(value: unknown) {
  if (typeof value === "boolean") return value ? YES_NO_FLAG_I18N[YES_NO_FLAG.YES] : YES_NO_FLAG_I18N[YES_NO_FLAG.NO];
  if (typeof value === "number") return value === 1 ? YES_NO_FLAG_I18N[YES_NO_FLAG.YES] : YES_NO_FLAG_I18N[YES_NO_FLAG.NO];
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (["y", "yes", "true", "1"].includes(normalizedValue)) return YES_NO_FLAG_I18N[YES_NO_FLAG.YES];
    if (["n", "no", "false", "0"].includes(normalizedValue)) return YES_NO_FLAG_I18N[YES_NO_FLAG.NO];
  }
  return "--";
}
/** 获取扩展配置字符串 */
function getExtraConfigString(value: unknown) {
  if (typeof value !== "string") return "--";
  return value || "--";
}
/** 获取吹风机圈存金额文案 */
function getDryerCardRechargeAmountOptionsText(value: unknown) {
  /** 圈存金额列表。 */
  let amountOptions: string[] = [];
  if (Array.isArray(value)) {
    amountOptions = value.map(item => String(item).trim()).filter(Boolean);
  } else if (typeof value === "string") {
    const rawValue = value.trim();
    if (!rawValue) return "--";
    try {
      if (rawValue.indexOf("[") !== 0 || rawValue.lastIndexOf("]") !== rawValue.length - 1) return rawValue;
      const parsedValue = JSON.parse(rawValue);
      if (Array.isArray(parsedValue)) amountOptions = parsedValue.map(item => String(item).trim()).filter(Boolean);
    } catch {
      return rawValue;
    }
  }

  if (!amountOptions.length) return "--";
  return amountOptions.join(",");
}

/** 获取公话配置详情 */
async function axiosGetDialConfigDetailApi(id: number) {
  try {
    return await getDeviceDialConfigDetailApi(id);
  } catch (error) {
    console.error("axiosGetDialConfigDetailApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
}
/** 接收参数 */
async function acceptParams(params: TModalParams, row?: TDeviceDialConfigDetail) {
  parameter.value = { ...parameter.value, ...params };
  if (!row?.id) return;
  const res = await axiosGetDialConfigDetailApi(row.id);
  if (res.code === 0 && res.data) {
    detailForm.value = res.data;
    visible.value = true;
  } else {
    ElMessage.error("获取信息失败");
  }
}

defineExpose({ acceptParams });
</script>
