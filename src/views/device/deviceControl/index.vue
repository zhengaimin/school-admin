<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">设备组名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="name">启用状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in statusList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <label for="name">设备组</label>
      <el-select style="width: 250px" v-model="filterForm.deviceGroupId">
        <el-option v-for="v in devicegroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>
        <el-button :disabled="!(multipleSelection.length > 0)" type="warning" class="search-btn" @click="updateStatus('restart')">
          <el-icon style="margin-right: 5px"><Loading /></el-icon> 重启
        </el-button>
        <el-button :disabled="!(multipleSelection.length > 0)" type="danger" class="search-btn" @click="updateStatus('shutdown')">
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
      </span>
      <div>
        <el-button type="primary" class="search-btn" @click="uploadFile()" v-if="false"> 设备导入 </el-button>
        <el-button type="primary" class="search-btn" @click="confirmexport"> 设备导出 </el-button>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list" @selection-change="handleSelectionChange">
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
              <div
                style="padding: 0 5px; margin-bottom: 5px; border: 1px solid #cccccc; border-radius: 3px"
                v-for="v in row.tags"
                :key="v.id"
              >
                {{ v.name }}
              </div>
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
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
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
                  <el-option v-for="v in devicegroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
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
    <el-dialog v-model="dialogtag" :close-on-click-modal="false" title="绑定标签" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="taglinkFormRef" :model="tagform" :rules="taglinkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="标签" prop="deviceTagId">
                <el-select v-model="tagform.deviceTagId">
                  <el-option v-for="v in devicetagsListSelect" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogtag = false">取消</el-button>
              <el-button type="primary" @click="confirmAddtag">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog v-model="strumentsloadFlag" :close-on-click-modal="false" title="设备导入" :width="800">
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
              ref="uploadFile"
              :action="activeUrl"
              :data="{
                tenantId: userInfo.tenantId,
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
            <el-table class="my-custom-table" :data="errorData.failList">
              <el-table-column label="Excel行号" prop="index" align="left"> </el-table-column>
              <el-table-column label="姓名" prop="name" align="left"> </el-table-column>
              <el-table-column label="失败原因" prop="reason" align="left"> </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="margin: 20px 0; text-align: center">
          <el-button @click="strumentsloadFlag = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {
  devicegroupsList,
  devicesAdd,
  devicesUpdate,
  devicesList,
  devicesDelete,
  devicesDetail,
  devicesbatchcontrol,
  devicetagsListSelect,
  devicetagsbatchassign
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        status: "",
        deviceGroupId: ""
      },
      statusList: [
        { id: "1", name: "在线" },
        { id: "0", name: "离线" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      devicegroupsList: [],
      form: {
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
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalKey: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalSn: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalMac: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      multipleSelection: [],
      // 绑定标签
      dialogtag: false,
      devicetagsListSelect: [],
      tagform: {
        deviceTagId: ""
      },
      taglinkRules: {
        deviceTagId: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      // 导入
      strumentsloadFlag: false,
      falseFlag: false,
      errorData: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    },
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
    },
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/import-excel`;
      } else {
        return `/admin/students/import-excel`;
      }
    },
    devicesexport() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/devices/export`;
      } else {
        return `/admin/devices/export`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.getdevicegroupsList();
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getdevicegroupsList();
    this.fetchTenantList();
  },
  methods: {
    // 设备组
    getdevicegroupsList() {
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&name=&status=-1`;
      devicegroupsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.devicegroupsList = res.data.list;
        } else {
          this.devicegroupsList = [];
        }
      });
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.status = "";
      this.filterForm.deviceGroupId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let deviceGroupId = this.filterForm.deviceGroupId ? this.filterForm.deviceGroupId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&status=${status}&terminalSn=&deviceGroupId=${deviceGroupId}`;
      devicesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
          this.total = res.data.total;
        } else {
          this.carbonCk_list = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateStatus(val) {
      let deviceIds = [];
      this.multipleSelection.map(v => {
        deviceIds.push(v.id);
      });
      devicesbatchcontrol({ deviceIds: deviceIds, action: val }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    bindTag() {
      this.dialogtag = true;
      this.tagform.deviceTagId = "";
      this.getdevicetagsListSelect();
    },
    getdevicetagsListSelect() {
      let params = `schoolId=${this.schoolId}&status=-1`;
      devicetagsListSelect(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.devicetagsListSelect = res.data.list;
        } else {
          this.devicetagsListSelect = [];
        }
      });
    },
    confirmAddtag() {
      this.$refs.taglinkFormRef.validate(valid => {
        if (valid) {
          let deviceIds = [];
          this.multipleSelection.map(v => {
            deviceIds.push(v.id);
          });
          devicetagsbatchassign({ deviceIds: deviceIds, deviceTagId: this.tagform.deviceTagId }).then(res => {
            if (res.code == 0) {
              let msg = `成功绑定${res.data.successCount}, 失败${res.data.failCount}`;
              this.$message.success(msg);
              this.dialogtag = false;
              this.fetchTenantList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    //新增
    openAddDialog() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      delete this.form.id;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.form.forbidCallTimesAry = [{ fstTime: "", fendTime: "" }];
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      devicesDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.form.forbidCallTimesAry = [];
          for (let key in res.data) {
            if (key == "forbidCallTimes" && res.data["forbidCallTimes"]) {
              let ary = res.data["forbidCallTimes"].split(",");
              ary.map(v => {
                let arr = v.split("-");
                this.form.forbidCallTimesAry.push({ fstTime: arr[0], fendTime: arr[1] });
              });
            } else {
              this.form[key] = res.data[key];
            }
          }
          console.log(this.form);
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.id = row.id;
    },
    AddItem() {
      this.form.forbidCallTimesAry.push({
        fstTime: "",
        fendTime: ""
      });
    },
    deleteItem(index) {
      this.form.forbidCallTimesAry.splice(index, 1);
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.form.schoolId = this.schoolId;
          this.form.heartbeatFrequency = this.form.heartbeatFrequency ? Number(this.form.heartbeatFrequency) : -1;
          this.form.callTime = this.form.callTime ? Number(this.form.callTime) : -1;
          this.form.warnCallTime = this.form.warnCallTime ? Number(this.form.warnCallTime) : -1;
          let ary = [];
          this.form.forbidCallTimesAry.map(v => {
            if (v.fstTime && v.fendTime) {
              let str = v.fstTime + "-" + v.fendTime;
              ary.push(str);
            }
          });
          this.form.forbidCallTimes = ary.join(",");
          if (this.form.id) {
            devicesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          devicesAdd(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.fetchTenantList();
            }
          });
        }
      });
    },
    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          devicesDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    uploadFile() {
      this.strumentsloadFlag = true;
      this.falseFlag = false;
      this.$nextTick(() => {
        this.$refs.uploadFile.clearFiles();
      });
    },
    beforeAvatarUpload() {
      // this.$refs.uploadFile.clearFiles();
    },
    handleSuccess(res) {
      if (res.code == 0 && res.data.failCount == 0) {
        this.$message.success("导入成功");
        this.strumentsloadFlag = false;
      } else {
        this.errorData = res.data;
        this.falseFlag = true;
      }
      this.fetchTenantList();
    },
    // 批量导出
    confirmexport() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let deviceGroupId = this.filterForm.deviceGroupId ? this.filterForm.deviceGroupId : -1;
      let url = `${this.devicesexport}?schoolId=${this.schoolId}&name=${this.filterForm.name}&status=${status}&terminalSn=&deviceGroupId=${deviceGroupId}`;
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          },
          responseType: "blob"
        })
        .then(data => {
          const content = data.data;
          let blob = new Blob([content], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.href = url;
          aLink.setAttribute("download", "设备信息.xlsx");
          aLink.click();
          window.URL.revokeObjectURL(url);
          this.exportDialog = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
