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
      <el-descriptions-item label="拨号类型">{{ getPhoneTypeText(detailForm.phoneType) }}</el-descriptions-item>
      <el-descriptions-item label="sip服务地址">{{ detailForm.sipDomain || "--" }}</el-descriptions-item>
      <el-descriptions-item label="Sip协议类型">{{ getSipTypeText(detailForm.sipTransportType) }}</el-descriptions-item>
      <el-descriptions-item label="sip用户名">{{ detailForm.sipUserName || "--" }}</el-descriptions-item>
      <el-descriptions-item label="sip密码">{{ detailForm.sipPassword || "--" }}</el-descriptions-item>
      <el-descriptions-item label="定时开机时间">{{ detailForm.powerOnTime || "--" }}</el-descriptions-item>
      <el-descriptions-item label="定时关机时间">{{ detailForm.powerOffTime || "--" }}</el-descriptions-item>
      <el-descriptions-item label="是否显示留言按钮">
        {{ getYesNoText(detailForm.messageFlag) }}
      </el-descriptions-item>
      <el-descriptions-item label="是否启用语音留言">
        {{ getYesNoText(detailForm.messageSoundFlag) }}
      </el-descriptions-item>
      <el-descriptions-item label="心理咨询身份认证">
        {{ getYesNoText(detailForm.mhcFlag) }}
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
import { PHONE_TYPE_I18N, SIP_TYPE_I18N, YES_NO_FLAG, YES_NO_FLAG_I18N } from "@/config/modules";

/** 弹窗显示状态 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref({
  title: "",
  type: "View" as "Add" | "Edit" | "View",
  showConfirm: false
});
/** 详情数据 */
const detailForm = ref<Partial<TDeviceDialConfigDetail>>({});

/** 获取拨号类型文案 */
function getPhoneTypeText(value?: TDeviceDialConfigDetail["phoneType"]) {
  if (!value) return "--";
  return PHONE_TYPE_I18N[value] || value;
}
/** 获取 Sip 协议类型文案 */
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
async function acceptParams(
  params: { title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean },
  row?: TDeviceDialConfigDetail
) {
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
