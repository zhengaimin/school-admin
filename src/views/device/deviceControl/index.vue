<template>
  <div class="table-box">
    <el-form :model="filterForm" class="filter-box">
      <el-form-item label="设备组名称">
        <el-input v-model="filterForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select v-model="filterForm.status" placeholder="请选择">
          <el-option v-for="v in statusList" :key="v.id" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备组">
        <el-select v-model="filterForm.deviceGroupId" placeholder="请选择">
          <el-option v-for="v in deviceGroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="fetchDeviceList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-row>
        <el-col :span="12">
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="warning"
            class="search-btn"
            @click="updateStatus('restart')"
          >
            <el-icon style="margin-right: 5px"><Loading /></el-icon> 重启
          </el-button>
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="danger"
            class="search-btn"
            @click="updateStatus('shutdown')"
          >
            <el-icon style="margin-right: 5px"><TurnOff /></el-icon> 关机
          </el-button>
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="success"
            class="search-btn"
            @click="updateStatus('update_config')"
          >
            更新配置
          </el-button>
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="success"
            class="search-btn"
            @click="updateStatus('sync_user_old')"
          >
            同步人员信息
          </el-button>
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="success"
            class="search-btn"
            @click="updateStatus('clear_user')"
          >
            清除人员数据
          </el-button>
          <el-button
            :disabled="!(multipleSelection.length > 0)"
            type="success"
            class="search-btn"
            @click="updateStatus('count_user')"
          >
            查询人员数据
          </el-button>
          <el-button :disabled="!(multipleSelection.length > 0)" type="success" class="search-btn" @click="bindTag">
            绑定标签
          </el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" class="search-btn" @click="downloadFileTemplate"> 下载导入模板 </el-button>
          <el-button type="primary" class="search-btn" @click="uploadFile()"> 设备导入 </el-button>
          <el-button type="primary" class="search-btn" @click="confirmExport"> 设备导出 </el-button>
          <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="设备名称" prop="name" width="160"> </el-table-column>
        <el-table-column label="终端Key" prop="terminalKey"> </el-table-column>
        <el-table-column label="设备SN号" prop="terminalSn"> </el-table-column>
        <el-table-column label="设备MAC地址" prop="terminalMac"> </el-table-column>
        <el-table-column label="设备地址" prop="location"> </el-table-column>
        <el-table-column label="设备组" prop="deviceGroupName"> </el-table-column>
        <el-table-column label="已绑定标签" width="130">
          <template #default="{ row }">
            <div v-if="row.tags">
              <el-tag @close="deleteTag(row, tag)" v-for="tag in row.tags" :key="tag.id" closable type="primary" effect="dark">
                {{ tag.name }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="{ row }">
            {{ ["离线", "在线"][row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="170"> </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="detail(scope.row)">详情</div>
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
              <div @click="deleteRow(scope.row)">
                <img
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; margin-right: 3px"
                />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
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
                  <el-option label="全部" value="all"></el-option>
                  <el-option label="VIDEO" value="video"></el-option>
                  <el-option label="SIM" value="sim"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="计费模式" prop="billMode">
                <el-select v-model="form.billMode" style="width: 100%">
                  <el-option label="免费" value="0"></el-option>
                  <el-option label="音视频分开计费" value="Y"></el-option>
                  <el-option label="合并计费" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否显示留言按钮" prop="messageFlag">
                <el-radio-group v-model="form.messageFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
                  <el-radio value="">暂不配置</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="是否全量同步人脸" prop="downloadUserFlag">
                <el-radio-group v-model="form.downloadUserFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
                  <el-radio value="">暂不配置</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否启用语音留言" prop="messageSoundFlag">
                <el-radio-group v-model="form.messageSoundFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
                  <el-radio value="">暂不配置</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="心理咨询身份认证" prop="mhcFlag">
                <el-radio-group disabled v-model="form.mhcFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
                  <el-radio value="">暂不配置</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="刷脸记录人员信息" prop="addPunchFace">
                <el-radio-group v-model="form.addPunchFace">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
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
          <div style="margin-bottom: 10px; font-size: 12px; color: red">提示：多个号码用“,”分隔，例如：110,120,119</div>
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
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 绑定标签 -->
    <el-dialog v-model="dialogTag" :close-on-click-modal="false" title="绑定标签" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="tagLinkFormRef" :model="tagForm" :rules="tagLinkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="标签" prop="deviceTagIds">
                <el-select v-model="tagForm.deviceTagIds" multiple>
                  <el-option v-for="v in deviceTagsListSelect" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogTag = false">取消</el-button>
              <el-button type="primary" @click="confirmAddTag">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog v-model="instrumentsLoadFlag" :close-on-click-modal="false" title="设备导入" :width="800">
      <div style="min-height: 100px; text-align: center">
        <el-row>
          <el-col :span="23">
            <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
              学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="!falseFlag">
          <el-col :span="24">
            <el-upload
              style="width: 100%"
              class="upload-demo"
              ref="uploadFileRef"
              :action="activeUrl"
              :data="{
                schoolId: schoolId
              }"
              :headers="{ Authorization: token }"
              :before-upload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :limit="1"
              :show-file-list="false"
            >
              <div class="upload-box">
                <el-icon style="font-size: 25px; color: #cccccc"><UploadFilled /></el-icon>
                <p>请上传</p>
              </div>
            </el-upload>
          </el-col>
        </el-row>
        <div v-else>
          <el-row>
            <h1 class="errorMath">
              导入失败数量：<span style="font-weight: bold; color: red">{{ errorData.failCount }}</span>
            </h1>
          </el-row>
          <el-row>
            <el-table class="my-custom-table" :data="errorData.failures">
              <el-table-column label="Excel行号" prop="rowIndex" align="left"> </el-table-column>
              <el-table-column label="失败原因" prop="reason" align="left"> </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="margin: 20px 0; text-align: center">
          <el-button @click="instrumentsLoadFlag = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog v-model="dialogVisibleDetail" :close-on-click-modal="false" title="配置详情" :width="800">
      <div style="padding-left: 20px">
        <div>
          <el-descriptions :column="2" border title="">
            <el-descriptions-item label="学校">{{ detailForm.schoolName }}</el-descriptions-item>
            <el-descriptions-item label="设备名称">{{ detailForm.name }}</el-descriptions-item>
            <el-descriptions-item label="设备终端key">{{ detailForm.terminalKey }}</el-descriptions-item>
            <el-descriptions-item label="设备SN号">{{ detailForm.terminalSn }}</el-descriptions-item>
            <el-descriptions-item label="设备Mac地址">{{ detailForm.terminalMac }}</el-descriptions-item>
            <el-descriptions-item label="设备组">{{ detailForm.deviceGroupName }}</el-descriptions-item>
            <el-descriptions-item label="设备位置">{{ detailForm.location }}</el-descriptions-item>
            <el-descriptions-item label="心跳时间（ms）">{{ detailForm.heartbeatFrequency }}</el-descriptions-item>
            <el-descriptions-item label="单次通话限定时长（分钟）">{{ detailForm.callTime }}</el-descriptions-item>
            <el-descriptions-item label="拨号类型">{{ detailForm.phoneType }}</el-descriptions-item>
            <el-descriptions-item label="定时开机时间">{{ detailForm.powerOnTime }}</el-descriptions-item>
            <el-descriptions-item label="定时关机时间">{{ detailForm.powerOffTime }}</el-descriptions-item>
            <el-descriptions-item label="是否显示留言按钮">
              <span v-if="detailForm.messageFlag">
                {{ detailForm.messageFlag == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="是否全量同步人脸">
              <span v-if="detailForm.downloadUserFlag">
                {{ detailForm.downloadUserFlag == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="是否启用语音留言">
              <span v-if="detailForm.messageSoundFlag">
                {{ detailForm.messageSoundFlag == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="心理咨询身份认证">
              <span v-if="detailForm.mhcFlag">
                {{ detailForm.mhcFlag == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="刷脸记录人员信息">
              <span v-if="detailForm.addPunchFace">
                {{ detailForm.addPunchFace == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="禁拨号码">
              <span v-if="detailForm.forbidPhone">
                {{ detailForm.forbidPhone == "Y" ? "是" : "否" }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="计费模式">
              {{ { "0": "免费", Y: "音视频分开计费", N: "合并计费" }[detailForm.billMode] }}
            </el-descriptions-item>
            <el-descriptions-item label="预警通话时长（分钟）">
              {{ detailForm.warnCallTime }}
            </el-descriptions-item>
            <el-descriptions-item label="禁拨时间段">
              {{ detailForm.forbidCallTimes }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: center">
              <el-button @click="dialogVisibleDetail = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import axios from "axios";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import {
  devicegroupsList as apiDeviceGroupsList,
  devicesAdd,
  devicesUpdate,
  devicesList,
  devicesDelete,
  devicesDetail,
  devicesbatchcontrol,
  devicetagsListSelect as apiDeviceTagsListSelect,
  devicetagsbatchassign as deviceTagsBatchAssign
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
import type { FormInstance, FormRules } from "element-plus";
import { Loading, TurnOff, UploadFilled } from "@element-plus/icons-vue";

const userStore = useUserStore();

const isLoading = ref(false);
const isLoading1 = ref(false);

const filterForm = reactive({
  name: "",
  status: "",
  deviceGroupId: ""
});

const statusList = ref([
  { id: "1", name: "在线" },
  { id: "0", name: "离线" }
]);

// 新增/编辑弹窗
const dialogVisibleAdd = ref(false);
const deviceGroupsList = ref<any[]>([]);
const linkFormRef = ref<FormInstance>();
const form = reactive<any>({
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
  warnCallTime: ""
});

const linkRules = reactive<FormRules>({
  name: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalKey: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalSn: [{ required: true, message: "必填项", trigger: "blur" }],
  terminalMac: [{ required: true, message: "必填项", trigger: "blur" }]
});

// 列表
const deviceList = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const multipleSelection = ref<any[]>([]);

// 绑定标签
const dialogTag = ref(false);
const deviceTagsListSelect = ref<any[]>([]);
const tagLinkFormRef = ref<FormInstance>();
const tagForm = reactive({
  deviceTagIds: []
});
const tagLinkRules = reactive<FormRules>({
  deviceTagIds: [{ required: true, message: "必填项", trigger: "blur" }]
});

// 导入
const instrumentsLoadFlag = ref(false);
const falseFlag = ref(false);
const errorData = ref<any>({});
const uploadFileRef = ref();

// 详情
const dialogVisibleDetail = ref(false);
const detailForm = ref<any>({});

const schoolId = computed(() => (userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : ""));
const schoolName = computed(() => userStore.schoolMsg.schoolName);
const token = computed(() => userStore.token);

const devicesexport = computed(() => {
  return import.meta.env.DEV ? `/api/admin/devices/export` : `/admin/devices/export`;
});

const loadFileTemplateUrl = computed(() => {
  return import.meta.env.DEV ? `/api/admin/devices/template` : `/admin/devices/template`;
});

const activeUrl = computed(() => {
  return import.meta.env.DEV ? `/api/admin/devices/import` : `/admin/devices/import`;
});

// 设备组
const getDeviceGroupsList = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    let params = `schoolId=${schoolId.value}&page=1&pageSize=200&name=&status=-1`;
    const res = await apiDeviceGroupsList(params);
    if (res.code == 0 && res.data && res.data.list) {
      deviceGroupsList.value = res.data.list;
    } else {
      deviceGroupsList.value = [];
    }
  } finally {
    isLoading.value = false;
  }
};

const reset = () => {
  filterForm.name = "";
  filterForm.status = "";
  filterForm.deviceGroupId = "";
  fetchDeviceList();
};

const fetchDeviceList = async () => {
  if (isLoading1.value) return;
  isLoading1.value = true;
  try {
    let status = filterForm.status ? filterForm.status : -1;
    let deviceGroupId = filterForm.deviceGroupId ? filterForm.deviceGroupId : -1;
    const params = {
      schoolId: schoolId.value,
      page: page.value,
      pageSize: pageSize.value,
      name: filterForm.name,
      status: status,
      terminalSn: "",
      deviceGroupId: deviceGroupId
    };

    const res = await devicesList(params);
    if (res.code == 0 && res.data && res.data.list) {
      deviceList.value = res.data.list;
      total.value = res.data.total;
    } else {
      deviceList.value = [];
      total.value = 0;
    }
  } finally {
    isLoading1.value = false;
  }
};

const handleSizeChange = (val: number) => {
  page.value = 1;
  pageSize.value = val;
  fetchDeviceList();
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  fetchDeviceList();
};

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
};

const updateStatus = async (val: string) => {
  const deviceIds = multipleSelection.value.map(v => v.id);
  const res = await devicesbatchcontrol({ deviceIds: deviceIds, action: val });
  if (res.code == 0) {
    ElMessage.success(res.data.message);
  } else {
    ElMessage.error(res.data.message);
  }
};

const bindTag = () => {
  dialogTag.value = true;
  tagForm.deviceTagIds = [];
  getDeviceTagsListSelect();
};

const deleteTag = async (row: any, tag: any) => {
  const tags = row.tags;
  const ary = tags.filter((v: any) => v.id != tag.id);
  const deviceTagIds = ary.map((v: any) => v.id);
  const res = await deviceTagsBatchAssign({ deviceIds: [row.id], deviceTagIds: deviceTagIds });
  if (res.code == 0) {
    ElMessage.success("更新成功");
    fetchDeviceList();
  } else {
    ElMessage.error(res.data.message);
  }
};

const getDeviceTagsListSelect = async () => {
  let params = `schoolId=${schoolId.value}&status=-1`;
  const res = await apiDeviceTagsListSelect(params);
  if (res.code == 0 && res.data && res.data.list) {
    deviceTagsListSelect.value = res.data.list;
  } else {
    deviceTagsListSelect.value = [];
  }
};

const confirmAddTag = () => {
  tagLinkFormRef.value?.validate(async valid => {
    if (valid) {
      const deviceIds = multipleSelection.value.map(v => v.id);
      const res = await deviceTagsBatchAssign({ deviceIds: deviceIds, deviceTagIds: tagForm.deviceTagIds });
      if (res.code == 0) {
        let msg = `成功绑定${res.data.successCount}, 失败${res.data.failCount}`;
        ElMessage.success(msg);
        dialogTag.value = false;
        fetchDeviceList();
      } else {
        ElMessage.error(res.data.message);
      }
    }
  });
};

const openAddDialog = () => {
  if (schoolId.value === -1) {
    ElMessage.warning("请先选择学校");
    return;
  }
  delete form.id;
  dialogVisibleAdd.value = true;
  nextTick(() => {
    linkFormRef.value?.resetFields();
    form.forbidCallTimesAry = [{ fstTime: "", fendTime: "" }];
  });
};

const editRow = async (row: any) => {
  dialogVisibleAdd.value = true;
  const res = await devicesDetail({ id: row.id });
  if (res.code == 0 && res.data) {
    form.forbidCallTimesAry = [];
    for (const key in res.data) {
      if (key === "forbidCallTimes" && res.data["forbidCallTimes"]) {
        const ary = res.data["forbidCallTimes"].split(",");
        ary.forEach((v: string) => {
          const arr = v.split("-");
          form.forbidCallTimesAry.push({ fstTime: arr, fendTime: arr });
        });
      } else {
        form[key] = res.data[key];
      }
    }
    form.id = row.id;
  } else {
    ElMessage.error("获取信息失败");
  }
};

const detail = async (row: any) => {
  dialogVisibleDetail.value = true;
  const res = await devicesDetail({ id: row.id });
  if (res.code == 0 && res.data) {
    detailForm.value = res.data;
  } else {
    ElMessage.error("获取信息失败");
  }
};

const AddItem = () => {
  form.forbidCallTimesAry.push({ fstTime: "", fendTime: "" });
};

const deleteItem = (index: number) => {
  form.forbidCallTimesAry.splice(index, 1);
};

const confirmAdd = () => {
  linkFormRef.value?.validate(async valid => {
    if (valid) {
      form.schoolId = schoolId.value;
      form.heartbeatFrequency = form.heartbeatFrequency ? Number(form.heartbeatFrequency) : -1;
      form.callTime = form.callTime ? Number(form.callTime) : -1;
      form.warnCallTime = form.warnCallTime ? Number(form.warnCallTime) : -1;
      const ary = form.forbidCallTimesAry
        .filter((v: any) => v.fstTime && v.fendTime)
        .map((v: any) => `${v.fstTime}-${v.fendTime}`);
      form.forbidCallTimes = ary.join(",");

      if (form.id) {
        const res = await devicesUpdate(form);
        if (res.code == 0) {
          dialogVisibleAdd.value = false;
          ElMessage.success("编辑成功");
          fetchDeviceList();
        }
      } else {
        const res = await devicesAdd(form);
        if (res.code == 0) {
          dialogVisibleAdd.value = false;
          ElMessage.success("添加成功");
          fetchDeviceList();
        }
      }
    }
  });
};

const deleteRow = (row: any) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const res = await devicesDelete({ id: row.id });
      if (res && res.code == 0) {
        ElMessage.success("删除成功");
        fetchDeviceList();
      }
    })
    .catch(() => {
      console.log("取消删除");
    });
};

const downloadFileTemplate = () => {
  if (schoolId.value === -1) {
    ElMessage.warning("请先选择学校");
    return;
  }
  const url = `${loadFileTemplateUrl.value}?schoolId=${schoolId.value}`;
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value
      },
      responseType: "blob"
    })
    .then(data => {
      const content = data.data;
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement("a");
      aLink.href = url;
      aLink.setAttribute("download", "设备导入模板.xlsx");
      aLink.click();
      window.URL.revokeObjectURL(url);
    });
};

const uploadFile = () => {
  instrumentsLoadFlag.value = true;
  falseFlag.value = false;
  nextTick(() => {
    uploadFileRef.value?.clearFiles();
  });
};

const beforeAvatarUpload = () => {
  ElNotification({
    title: "提示",
    message: "数据导入中，请稍后",
    type: "success",
    duration: 0
  });
};

const handleSuccess = (res: any) => {
  if (res.code == 0 && res.data.failCount == 0) {
    ElMessage.success("导入成功");
    instrumentsLoadFlag.value = false;
  } else {
    errorData.value = res.data;
    falseFlag.value = true;
  }
  ElNotification.closeAll();
  fetchDeviceList();
};

const confirmExport = () => {
  const status = filterForm.status ? filterForm.status : -1;
  const deviceGroupId = filterForm.deviceGroupId ? filterForm.deviceGroupId : -1;
  const url = devicesexport.value;
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "success",
    duration: 0
  });
  const params = {
    schoolId: schoolId.value,
    name: filterForm.name,
    status: status,
    terminalSn: "",
    deviceGroupId: deviceGroupId
  };
  axios
    .post(url, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value
      },
      responseType: "blob"
    })
    .then(data => {
      const content = data.data;
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement("a");
      aLink.href = url;
      aLink.setAttribute("download", "设备信息.xlsx");
      aLink.click();
      window.URL.revokeObjectURL(url);
      ElNotification.closeAll();
    });
};

watch(
  schoolId,
  newVal => {
    if (newVal) {
      getDeviceGroupsList();
      fetchDeviceList();
    }
  },
  { immediate: true }
);

onMounted(() => {
  getDeviceGroupsList();
  fetchDeviceList();
});
</script>
<style lang="scss" scoped>
@import "./index";
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  border: 1px dashed #cccccc;
}
</style>
