<script setup lang="ts">
import type { Device as DeviceVideo } from "@/api/interface";

import { ref } from "vue";
import { getDeviceDetailApi } from "@/api/modules";
import {
  DEVICE_BILL_MODE_I18N,
  DEVICE_STATUS_I18N,
  DIAL_MODE_I18N,
  PHONE_ENTRY_I18N,
  PHONE_TYPE_I18N,
  SIP_TYPE_I18N,
  YES_NO_FLAG,
  YES_NO_FLAG_I18N
} from "@/config/modules";

/** 弹窗可见 */
const visible = ref(false);
/** 设备详情类型 */
type DeviceDetail = DeviceVideo.IDeviceItemVo & {
  /** Sip用户名 */
  sipUserName?: string | null;
  /** Sip密码 */
  sipPassword?: string | null;
  /** Sip服务地址 */
  sipDomain?: string | null;
  /** Sip协议类型 */
  sipTransportType?: DeviceVideo.ReqPostDeviceApi["sipTransportType"] | null;
};
/** 详情数据 */
const detail = ref<DeviceDetail | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/** 获取设备详情 */
async function axiosGetDeviceDetailApi(id: number) {
  try {
    return await getDeviceDetailApi(id);
  } catch (error) {
    console.error("axiosGetDeviceDetailApi:", error);
    return { code: -1, data: null };
  }
}

/** 获取设备状态文案 */
function getStatusText(value?: DeviceVideo.IDeviceItemVo["status"]) {
  if (value == null) return "--";
  return DEVICE_STATUS_I18N[value] || "--";
}
/** 获取拨号类型文案 */
function getPhoneTypeText(value?: DeviceVideo.IDeviceItemVo["phoneType"]) {
  if (value == null) return "--";
  return PHONE_TYPE_I18N[value] || "--";
}
/** 获取SIP协议文案 */
function getSipTypeText(value?: DeviceDetail["sipTransportType"]) {
  if (!value) return "--";
  return SIP_TYPE_I18N[value] || value;
}
/** 获取是否文案 */
function getYesNoText(value?: DeviceVideo.IDeviceItemVo["messageFlag"]) {
  if (!value) return "--";
  return YES_NO_FLAG_I18N[value] || "--";
}
/** 获取拨号模式文案 */
function getDialModeText(value?: DeviceVideo.IDeviceItemVo["dialMode"]) {
  if (!value) return "--";
  return DIAL_MODE_I18N[value] || value;
}
/** 获取拨号入口文案 */
function getPhoneTypesText(values?: DeviceVideo.IDeviceItemVo["phoneTypes"]) {
  if (!values?.length) return "--";
  return values.map(item => PHONE_ENTRY_I18N[item] || item).join("、");
}
/** 获取计费模式文案 */
function getBillModeText(value?: DeviceVideo.IDeviceItemVo["billMode"]) {
  if (!value) return "--";
  return DEVICE_BILL_MODE_I18N[value] || value;
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

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceVideo.IDeviceItemVo) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  if (!row?.id) return;
  const result = await axiosGetDeviceDetailApi(row.id);
  if (result.code === 0) {
    detail.value = result.data;
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="1120px" destroy-on-close draggable align-center>
    <div>
      <template v-if="detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备名称">{{ detail.name || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备SN号">{{ detail.terminalSn || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备MAC地址">{{ detail.terminalMac || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备类型">{{ detail.terminalType || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备位置">{{ detail.location || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备组">{{ detail.deviceGroupName || "--" }}</el-descriptions-item>
          <el-descriptions-item label="设备状态">{{ getStatusText(detail.status) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.createdAt || "--" }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detail.updatedAt || "--" }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">通话配置</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="心跳频率(ms)">{{ detail.heartbeatFrequency ?? "--" }}</el-descriptions-item>
          <el-descriptions-item label="单次通话时长(分钟)">{{ detail.callTime ?? "--" }}</el-descriptions-item>
          <el-descriptions-item label="拨号类型">{{ getPhoneTypeText(detail.phoneType) }}</el-descriptions-item>
          <el-descriptions-item label="拨号模式">{{ getDialModeText(detail.dialMode) }}</el-descriptions-item>
          <el-descriptions-item label="拨号入口">{{ getPhoneTypesText(detail.phoneTypes) }}</el-descriptions-item>
          <el-descriptions-item label="计费模式">{{ getBillModeText(detail.billMode) }}</el-descriptions-item>
          <el-descriptions-item label="禁拨号码">{{ detail.forbidPhone || "--" }}</el-descriptions-item>
          <el-descriptions-item label="禁拨时间段">{{ detail.forbidCallTimes || "--" }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">功能开关</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="显示留言按钮">{{ getYesNoText(detail.messageFlag) }}</el-descriptions-item>
          <el-descriptions-item label="语音留言">{{ getYesNoText(detail.messageSoundFlag) }}</el-descriptions-item>
          <el-descriptions-item label="心理咨询认证">{{ getYesNoText(detail.mhcFlag) }}</el-descriptions-item>
          <el-descriptions-item label="刷脸记录人员信息">{{ getYesNoText(detail.addPunchFace) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">SIP 配置</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Sip用户名">{{ detail.sipUserName || "--" }}</el-descriptions-item>
          <el-descriptions-item label="Sip密码">{{ detail.sipPassword || "--" }}</el-descriptions-item>
          <el-descriptions-item label="Sip服务地址">{{ detail.sipDomain || "--" }}</el-descriptions-item>
          <el-descriptions-item label="Sip协议类型">{{ getSipTypeText(detail.sipTransportType) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">标签信息</el-divider>
        <div class="flex flex-wrap gap-2">
          <el-tag v-for="tag in detail.tags || []" :key="tag.id" type="primary">
            {{ tag.name }}
          </el-tag>
          <span v-if="!detail.tags?.length" class="text-gray-400">暂无标签</span>
        </div>

        <el-divider content-position="left">扩展配置</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="禁止呼入">
            {{ getExtraConfigYesNoText(detail.extraConfig?.["call.incoming.disabled"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="开启人脸">
            {{ getExtraConfigYesNoText(detail.extraConfig?.["face.enabled"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="图片留言按钮显示">
            {{ getExtraConfigYesNoText(detail.extraConfig?.["message.image.button.visible"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="视频留言按钮显示">
            {{ getExtraConfigYesNoText(detail.extraConfig?.["message.video.button.visible"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="SOS按钮显示">
            {{ getExtraConfigYesNoText(detail.extraConfig?.["sos.button.visible"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="SOS标题">
            {{ getExtraConfigString(detail.extraConfig?.["sos.title"]) }}
          </el-descriptions-item>
          <el-descriptions-item label="第三方地址">
            {{ getExtraConfigString(detail.extraConfig?.["thirdParty.url"]) }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-descriptions__label) {
  width: 140px;
}
</style>
