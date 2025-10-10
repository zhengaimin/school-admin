<template>
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="配置详情" :width="800">
    <div style="padding-left: 20px">
      <div>
        <el-descriptions column="2" border title="">
          <el-descriptions-item label="学校">{{ detailForm.schoolName }}</el-descriptions-item>
          <el-descriptions-item label="心跳时间（ms）">{{ detailForm.heartbeatFrequency }}</el-descriptions-item>
          <el-descriptions-item label="单次通话限定时长（分钟）">{{ detailForm.callTime }}</el-descriptions-item>
          <el-descriptions-item label="拨号类型">{{ PHONE_TYPE_I18N[detailForm.phoneType] }}</el-descriptions-item>
          <el-descriptions-item label="sip服务地址">{{ detailForm.sipDomain }}</el-descriptions-item>
          <el-descriptions-item label="Sip协议类型">{{ SIP_TYPE_I18N[detailForm.sipTransportType] }}</el-descriptions-item>
          <el-descriptions-item label="sip用户名">{{ detailForm.sipUserName }}</el-descriptions-item>
          <el-descriptions-item label="sip密码">{{ detailForm.sipPassword }}</el-descriptions-item>
          <el-descriptions-item label="定时开机时间">{{ detailForm.powerOnTime }}</el-descriptions-item>
          <el-descriptions-item label="定时关机时间">{{ detailForm.powerOffTime }}</el-descriptions-item>
          <el-descriptions-item label="是否显示留言按钮">
            {{ detailForm.messageFlag == "Y" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="是否全量同步人脸">
            {{ detailForm.downloadUserFlag == "Y" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="是否启用语音留言">
            {{ detailForm.messageSoundFlag == "Y" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="心理咨询身份认证">
            {{ detailForm.mhcFlag == "Y" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="刷脸记录人员信息">
            {{ detailForm.addPunchFace == "Y" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="禁拨号码">
            {{ detailForm.forbidPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="禁拨时间段">
            {{ detailForm.forbidCallTimes }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: center">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { PHONE_TYPE_I18N, SIP_TYPE_I18N } from "@/config/modules/device";
import { deviceconfigDetail } from "@/api/modules/InternalPage.js";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const detailForm = reactive({});

const openDialog = row => {
  dialogVisible.value = true;
  deviceconfigDetail({ id: row.id }).then(res => {
    if (res.code == 0 && res.data) {
      Object.assign(detailForm, res.data);
    } else {
      ElMessage.error("获取信息失败");
    }
  });
};

defineExpose({ openDialog });
</script>
