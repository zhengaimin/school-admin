<template>
  <div class="table-box">
    <!-- <div class="filter-box">
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div> -->
    <div class="btn-box">
      <span>公话配置</span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog">
          <img
            src="@/assets/images/common/add-circle-2.svg"
            alt=""
            style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
          />
          新增
        </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校名称" prop="schoolName" width="160"> </el-table-column>
        <el-table-column label="心跳时间（ms）" prop="heartbeatFrequency"> </el-table-column>
        <el-table-column label="单次通话限定时长（分钟）" prop="callTime"> </el-table-column>
        <el-table-column label="定时开机时间" prop="powerOnTime"> </el-table-column>
        <el-table-column label="定时关机时间" prop="powerOffTime"> </el-table-column>
        <el-table-column label="禁拨号码" prop="forbidPhone" v-if="false"> </el-table-column>
        <el-table-column label="拨号类型" prop="phoneType"> </el-table-column>
        <el-table-column label="是否显示留言按钮">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.messageFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="是否全量同步人脸" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.downloadUserFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="开启语音留言" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.messageSoundFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="心理咨询身份认证" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.mhcFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="刷脸记录人员信息" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.addPunchFace] }}
          </template>
        </el-table-column>
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
            <el-col :span="16">
              <el-form-item label="心跳时间（ms）" prop="heartbeatFrequency">
                <el-input type="number" v-model="form.heartbeatFrequency"></el-input>
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
              <el-form-item label="是否显示留言按钮" prop="messageFlag">
                <el-radio-group v-model="form.messageFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="是否全量同步人脸" prop="downloadUserFlag">
                <el-radio-group v-model="form.downloadUserFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
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
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="心理咨询身份认证" prop="mhcFlag">
                <el-radio-group disabled v-model="form.mhcFlag">
                  <el-radio value="Y">是</el-radio>
                  <el-radio value="N">否</el-radio>
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
    <!-- 详情 -->
    <el-dialog v-model="dialogVisibleDetail" :close-on-click-modal="false" title="配置详情" :width="800">
      <div style="padding-left: 20px">
        <div>
          <el-descriptions column="2" border title="">
            <el-descriptions-item label="学校">{{ detailForm.schoolName }}</el-descriptions-item>
            <el-descriptions-item label="心跳时间（ms）">{{ detailForm.heartbeatFrequency }}</el-descriptions-item>
            <el-descriptions-item label="单次通话限定时长（分钟）">{{ detailForm.callTime }}</el-descriptions-item>
            <el-descriptions-item label="拨号类型">{{ detailForm.phoneType }}</el-descriptions-item>
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
              <el-button @click="dialogVisibleDetail = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  deviceconfigAdd,
  deviceconfigUpdate,
  deviceconfigList,
  deviceconfigDelete,
  deviceconfigDetail
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {},
      statusList: [
        { id: "1", name: "在线" },
        { id: "0", name: "离线" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      schoolsList: [],
      fstTime: "",
      fendTime: "",
      form: {
        schoolId: "",
        heartbeatFrequency: "",
        callTime: "",
        powerOnTime: "",
        powerOffTime: "",
        forbidPhone: "",
        phoneType: "all",
        messageFlag: "N",
        downloadUserFlag: "N",
        messageSoundFlag: "N",
        mhcFlag: "N",
        addPunchFace: "N",
        forbidCallTimesAry: [{ fstTime: "", fendTime: "" }],
        forbidCallTimes: ""
      },
      linkRules: {},
      // 详情
      dialogVisibleDetail: false,
      detailForm: {},
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10
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
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    reset() {
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}`;
      deviceconfigList(params).then(res => {
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

    //新增
    openAddDialog() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择右上角的学校");
        return;
      }
      delete this.form.id;
      this.dialogVisibleAdd = true;
      this.form.forbidCallTimesAry = [];
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      deviceconfigDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.form.forbidCallTimesAry = [];
          for (let key in res.data) {
            if (key == "forbidCallTimes") {
              let ary = res.data["forbidCallTimes"].split(",");
              ary.map(v => {
                let arr = v.split("-");
                this.form.forbidCallTimesAry.push({ fstTime: arr[0], fendTime: arr[1] });
              });
            } else {
              this.form[key] = res.data[key];
            }
          }
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.id = row.id;
    },
    detail(row) {
      this.dialogVisibleDetail = true;
      deviceconfigDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailForm = res.data;
        } else {
          this.$message.error("获取信息失败");
        }
      });
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
          this.form.heartbeatFrequency = Number(this.form.heartbeatFrequency);
          this.form.callTime = Number(this.form.callTime);
          let ary = [];
          this.form.forbidCallTimesAry.map(v => {
            let str = v.fstTime + "-" + v.fendTime;
            ary.push(str);
          });
          this.form.forbidCallTimes = ary.join(",");

          if (this.form.id) {
            deviceconfigUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          deviceconfigAdd(this.form).then(res => {
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
          deviceconfigDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
