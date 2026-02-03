<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
    <div style="padding-left: 20px">
      <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <el-row>
          <el-col :span="23">
            <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
              学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="终端Key" prop="terminalKey">
              <el-input v-model="form.terminalKey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="设备SN号" prop="terminalSn">
              <el-input v-model="form.terminalSn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="设备MAC地址" prop="terminalMac">
              <el-input v-model="form.terminalMac"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="设备组" prop="deviceGroupId">
              <el-select v-model="form.deviceGroupId">
                <el-option v-for="v in deviceGroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="设备地址" prop="location">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="定时开机时间" prop="powerOnTime">
              <el-time-select v-model="form.powerOnTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="定时关机时间" prop="powerOffTime">
              <el-time-select v-model="form.powerOffTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="心跳时间（ms）" prop="heartbeatFrequency">
              <el-input type="number" v-model="form.heartbeatFrequency"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="预警通话时长（分钟）" prop="warnCallTime">
              <el-input type="number" v-model="form.warnCallTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="单次通话限定时长（分钟）" prop="callTime">
              <el-input type="number" v-model="form.callTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="拨号类型" prop="phoneType">
              <el-select v-model="form.phoneType" placeholder="请选择拨号类型" style="width: 100%">
                <el-option v-for="item in PHONE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="sip服务地址" prop="sipDomain">
              <el-input v-model="form.sipDomain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="Sip协议类型" prop="sipTransportType">
              <el-select v-model="form.sipTransportType" placeholder="请选择Sip协议类型" style="width: 100%">
                <el-option v-for="item in SIP_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="sip用户名" prop="sipUserName">
              <el-input v-model="form.sipUserName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="sip密码" prop="sipPassword">
              <el-input v-model="form.sipPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计费模式" prop="billMode">
              <el-select v-model="form.billMode" style="width: 100%">
                <el-option label="免费" value="0"></el-option>
                <el-option label="音视频分开计费" :value="YES_NO_FLAG.YES"></el-option>
                <el-option label="合并计费" :value="YES_NO_FLAG.NO"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否显示留言按钮" prop="messageFlag">
              <el-radio-group v-model="form.messageFlag">
                <el-radio :value="YES_NO_FLAG.YES">是</el-radio>
                <el-radio :value="YES_NO_FLAG.NO">否</el-radio>
                <el-radio value="">暂不配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="是否全量同步人脸" prop="downloadUserFlag">
              <el-radio-group v-model="form.downloadUserFlag">
                <el-radio :value="YES_NO_FLAG.YES">是</el-radio>
                <el-radio :value="YES_NO_FLAG.NO">否</el-radio>
                <el-radio value="">暂不配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否启用语音留言" prop="messageSoundFlag">
              <el-radio-group v-model="form.messageSoundFlag">
                <el-radio :value="YES_NO_FLAG.YES">是</el-radio>
                <el-radio :value="YES_NO_FLAG.NO">否</el-radio>
                <el-radio value="">暂不配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="心理咨询身份认证" prop="mhcFlag">
              <el-radio-group disabled v-model="form.mhcFlag">
                <el-radio :value="YES_NO_FLAG.YES">是</el-radio>
                <el-radio :value="YES_NO_FLAG.NO">否</el-radio>
                <el-radio value="">暂不配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="刷脸记录人员信息" prop="addPunchFace">
              <el-radio-group v-model="form.addPunchFace">
                <el-radio :value="YES_NO_FLAG.YES">是</el-radio>
                <el-radio :value="YES_NO_FLAG.NO">否</el-radio>
                <el-radio value="">暂不配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="禁拨号码" prop="forbidPhone">
              <el-input type="textarea" v-model="form.forbidPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 10px; font-size: 12px; color: red">提示：多个号码用","分隔，例如：110,120,119</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="">
              禁拨时间 <el-button style="margin-left: 10px" @click="AddItem"> + 新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item, i) in form.forbidCallTimesAry" :key="i">
          <el-col :span="10">
            <el-form-item label="禁拨开始时间">
              <el-time-select v-model="item.fstTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin: 0 15px">
            <el-form-item label="禁拨结束时间">
              <el-time-select v-model="item.fendTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="&nbsp">
              <img
                v-if="form.forbidCallTimesAry.length > 1"
                @click="deleteItem(i)"
                src="@/assets/images/common/delete-circle-2.svg"
                alt=""
                style="width: 23px; height: 23px; margin-top: 3px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: right">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { PHONE_TYPE_OPTIONS, SIP_TYPE_OPTIONS } from "@/config/modules/device";
import { YES_NO_FLAG } from "@/config/modules/common";
import { devicesAdd, devicesUpdate, devicesDetail } from "@/api/modules/InternalPage.js";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

defineProps({
  schoolName: {
    type: String,
    default: ""
  },
  deviceGroupsList: {
    type: Array,
    default: () => []
  }
});

const userStore = useUserStore();
const dialogVisible = ref(false);
const linkFormRef = ref(null);

const form = reactive({
  name: "",
  terminalKey: "",
  terminalSn: "",
  terminalMac: "",
  location: "",
  deviceGroupId: "",
  heartbeatFrequency: "",
  callTime: "",
  powerOnTime: "",
  powerOffTime: "",
  forbidPhone: "",
  phoneType: "",
  messageFlag: "",
  downloadUserFlag: "",
  messageSoundFlag: "",
  mhcFlag: "",
  addPunchFace: "",
  forbidCallTimesAry: [{ fstTime: "", fendTime: "" }],
  forbidCallTimes: "",
  billMode: "",
  warnCallTime: "",
  sipDomain: "",
  sipPassword: "",
  sipTransportType: "",
  sipUserName: ""
});

const linkRules = reactive({
  name: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalKey: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalSn: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalMac: [{ required: true, message: "必填项", trigger: "blur" }]
});

const schoolId = computed(() => (userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : ""));

const openDialog = row => {
  if (row && row.id) {
    devicesDetail({ id: row.id }).then(res => {
      if (res.code == 0 && res.data) {
        form.forbidCallTimesAry = [];
        for (const key in res.data) {
          if (key === "forbidCallTimes" && res.data["forbidCallTimes"]) {
            const ary = res.data["forbidCallTimes"].split(",");
            ary.forEach(v => {
              const arr = v.split("-");
              form.forbidCallTimesAry.push({ fstTime: arr[0], fendTime: arr[1] });
            });
          } else {
            form[key] = res.data[key];
          }
        }
        form.id = row.id;
      } else {
        ElMessage.error("获取信息失败");
      }
    });
  } else {
    delete form.id;
    Object.assign(form, {
      name: "",
      terminalKey: "",
      terminalSn: "",
      terminalMac: "",
      location: "",
      deviceGroupId: "",
      heartbeatFrequency: "",
      callTime: "",
      powerOnTime: "",
      powerOffTime: "",
      forbidPhone: "",
      phoneType: "",
      messageFlag: "",
      downloadUserFlag: "",
      messageSoundFlag: "",
      mhcFlag: "",
      addPunchFace: "",
      forbidCallTimesAry: [{ fstTime: "", fendTime: "" }],
      forbidCallTimes: "",
      billMode: "",
      warnCallTime: "",
      sipDomain: "",
      sipPassword: "",
      sipTransportType: "",
      sipUserName: ""
    });
    nextTick(() => {
      linkFormRef.value?.resetFields();
    });
  }
  dialogVisible.value = true;
};

const AddItem = () => {
  form.forbidCallTimesAry.push({ fstTime: "", fendTime: "" });
};

const deleteItem = index => {
  form.forbidCallTimesAry.splice(index, 1);
};

const emits = defineEmits(["success"]);
const confirmAdd = async () => {
  if (!linkFormRef.value) return;
  await linkFormRef.value.validate(valid => {
    if (valid) {
      form.schoolId = schoolId.value;
      form.heartbeatFrequency = form.heartbeatFrequency ? Number(form.heartbeatFrequency) : -1;
      form.callTime = form.callTime ? Number(form.callTime) : -1;
      form.warnCallTime = form.warnCallTime ? Number(form.warnCallTime) : -1;
      const ary = form.forbidCallTimesAry.filter(v => v.fstTime && v.fendTime).map(v => `${v.fstTime}-${v.fendTime}`);
      form.forbidCallTimes = ary.join(",");

      const api = form.id ? devicesUpdate : devicesAdd;
      const message = form.id ? "编辑成功" : "添加成功";

      api(form).then(res => {
        if (res.code == 0) {
          dialogVisible.value = false;
          ElMessage.success(message);
          emits("success");
        }
      });
    }
  });
};

defineExpose({ openDialog });
</script>
