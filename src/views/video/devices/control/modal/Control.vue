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
        <el-col :span="16">
          <el-form-item label="心跳时间（ms）" prop="heartbeatFrequency">
            <el-input v-model="ruleForm.heartbeatFrequency" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="单次通话限定时长（分钟）" prop="callTime">
            <el-input v-model="ruleForm.callTime" type="number" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拨号类型" prop="phoneType">
            <el-select v-model="ruleForm.phoneType" placeholder="请选择拨号类型" class="w-full">
              <el-option v-for="item in PHONE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="sip服务地址" prop="sipDomain">
            <el-input v-model="ruleForm.sipDomain" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Sip协议类型" prop="sipTransportType">
            <el-select v-model="ruleForm.sipTransportType" placeholder="请选择Sip协议类型" class="w-full">
              <el-option v-for="item in SIP_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="sip用户名" prop="sipUserName">
            <el-input v-model="ruleForm.sipUserName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="sip密码" prop="sipPassword">
            <el-input v-model="ruleForm.sipPassword" />
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
          <el-form-item label="是否显示留言按钮" prop="messageFlag">
            <el-radio-group v-model="ruleForm.messageFlag">
              <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用语音留言" prop="messageSoundFlag">
            <el-radio-group v-model="ruleForm.messageSoundFlag">
              <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="心理咨询身份认证" prop="mhcFlag">
            <el-radio-group v-model="ruleForm.mhcFlag" disabled>
              <el-radio v-for="item in YES_NO_FLAG_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
          <el-form-item label="禁拨号码" prop="forbidPhone">
            <el-input v-model="ruleForm.forbidPhone" type="textarea" />
          </el-form-item>
          <el-text type="danger" size="small">提示：多个号码用“,”分隔，例如：110,120,119</el-text>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="禁拨时间">
            <el-button type="primary" link @click="handleAddItem">+ 新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, i) in ruleForm.forbidCallTimesAry" :key="i" :gutter="24">
        <el-col :span="11">
          <el-form-item label="禁拨开始时间">
            <el-time-select v-model="item.fstTime" class="w-full" start="00:00" step="00:10" end="23:59" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="禁拨结束时间">
            <el-time-select v-model="item.fendTime" class="w-full" start="00:00" step="00:10" end="23:59" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label=" ">
            <el-button
              v-if="ruleForm.forbidCallTimesAry.length > 1"
              type="danger"
              link
              class="mt-6 leading-8"
              @click="handleDeleteItem(i)"
            >
              删除
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { ControlModalProps, DialConfigForm } from "../types";

import { computed, nextTick, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceDialConfigDetailApi, postDeviceDialConfigApi, putDeviceDialConfigApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { PHONE_TYPE, PHONE_TYPE_OPTIONS, SIP_TYPE_OPTIONS, YES_NO_FLAG, YES_NO_FLAG_OPTIONS } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";

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
const rules = reactive<FormRules>({});

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
    powerOnTime: "",
    powerOffTime: "",
    forbidPhone: "",
    phoneType: PHONE_TYPE.ALL,
    messageFlag: YES_NO_FLAG.NO,
    messageSoundFlag: YES_NO_FLAG.NO,
    mhcFlag: YES_NO_FLAG.NO,
    addPunchFace: YES_NO_FLAG.NO,
    forbidCallTimesAry: [{ fstTime: "", fendTime: "" }],
    forbidCallTimes: "",
    sipDomain: "",
    sipPassword: "",
    sipTransportType: "",
    sipUserName: ""
  };
}
/** 重置表单数据 */
function resetForm() {
  delete ruleForm.id;
  Object.assign(ruleForm, getInitialForm());
}
/** 解析禁拨时间段 */
function parseForbidCallTimes(value?: string | null) {
  if (!value) {
    ruleForm.forbidCallTimesAry = [{ fstTime: "", fendTime: "" }];
    return;
  }
  ruleForm.forbidCallTimesAry = value.split(",").map(v => {
    const [fst, fend] = v.split("-");
    return { fstTime: fst || "", fendTime: fend || "" };
  });
}

/** 获取公话配置详情 */
async function axiosGetDialConfigDetailApi(id: number) {
  try {
    return await getDeviceDialConfigDetailApi(id);
  } catch (error) {
    console.error("axiosGetDialConfigDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 组装公话配置请求参数 */
function getDialConfigPayload(form: DialConfigForm): DeviceDialConfig.ReqPutDeviceDialConfigApi {
  const heartbeatFrequency = form.heartbeatFrequency === "" ? undefined : Number(form.heartbeatFrequency);
  const callTime = form.callTime === "" ? undefined : Number(form.callTime);
  const forbidCallTimes = form.forbidCallTimesAry
    .filter(v => v.fstTime && v.fendTime)
    .map(v => `${v.fstTime}-${v.fendTime}`)
    .join(",");

  return {
    heartbeatFrequency,
    callTime,
    powerOnTime: form.powerOnTime || undefined,
    powerOffTime: form.powerOffTime || undefined,
    forbidPhone: form.forbidPhone || undefined,
    phoneType: form.phoneType,
    messageFlag: form.messageFlag,
    messageSoundFlag: form.messageSoundFlag,
    mhcFlag: form.mhcFlag,
    addPunchFace: form.addPunchFace,
    forbidCallTimes: forbidCallTimes || undefined,
    sipUserName: form.sipUserName || undefined,
    sipPassword: form.sipPassword || undefined,
    sipDomain: form.sipDomain || undefined,
    sipTransportType: form.sipTransportType || undefined
  };
}
/** 新增公话配置 */
async function axiosPostDialConfigApi(form: DialConfigForm, schoolId: number | "") {
  try {
    const payload: DeviceDialConfig.ReqPostDeviceDialConfigApi = {
      ...getDialConfigPayload(form),
      schoolId: Number(schoolId || 0)
    };
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
    const payload = getDialConfigPayload(form);
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

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceDialConfig.IDeviceDialConfigVo) {
  parameter.value = { ...parameter.value, ...params };
  if ((isEdit.value || isView.value) && row?.id) {
    const res = await axiosGetDialConfigDetailApi(row.id);
    if (res.code === 0 && res.data) {
      Object.assign(ruleForm, res.data);
      parseForbidCallTimes(res.data.forbidCallTimes);
    } else {
      ElMessage.error("获取信息失败");
    }
  } else {
    resetForm();
    nextTick(() => {
      ruleFormRef.value?.resetFields();
    });
  }
  visible.value = true;
}
/** 新增禁拨时间 */
function handleAddItem() {
  ruleForm.forbidCallTimesAry.push({
    fstTime: "",
    fendTime: ""
  });
}
/** 删除禁拨时间 */
function handleDeleteItem(index: number) {
  ruleForm.forbidCallTimesAry.splice(index, 1);
}
/** 提交表单 */
async function handleSubmitForm() {
  if (!ruleFormRef.value) return;
  const valid = await ruleFormRef.value.validate();
  if (!valid) return;

  const res = isEdit.value
    ? await axiosPutDialConfigApi(ruleForm.id!, ruleForm)
    : await axiosPostDialConfigApi(ruleForm, currentSchoolId.value);
  if (res.code !== 0) return;

  visible.value = false;
  emit("success");
}

defineExpose({ acceptParams });
</script>
