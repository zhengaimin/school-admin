<template>
  <div class="table-box">
    <div class="filter-box">
      <div>
        <label for="name">通知类型名称或描述</label>
        <el-input v-model="filterForm.searchKeyword" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="name">通知类型代码</label>
        <el-input v-model="filterForm.typeCode" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="">是否启用</label>
        <el-select style="width: calc(100% - 90px)" v-model="filterForm.isEnabled">
          <el-option v-for="v in isEnabledList" :key="v.name" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </div>
      <div>
        <label for="">优先级</label>
        <el-select style="width: calc(100% - 90px)" v-model="filterForm.priority">
          <el-option v-for="v in priorityList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <el-button @click="reset" style="margin-left: 20px">重置</el-button>
        <el-button type="primary" @click="fetchTenantList">查询</el-button>
      </div>
    </div>
    <div class="btn-box">
      <span>通知配置列表</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="通知类型" prop="typeName" width="130"> </el-table-column>
        <el-table-column label="通知类型代码" prop="typeCode" width="140"> </el-table-column>
        <el-table-column label="是否启用" width="90">
          <template #default="{ row }">
            <el-switch @change="changeStatus(row)" v-model="row.isEnabled" :active-value="true" :inactive-value="false" />
          </template>
        </el-table-column>
        <el-table-column label="推送渠道" width="90">
          <template #default="{ row }">
            <span v-for="v in row.pushChannels" :key="v">{{ v }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" prop="priorityText"> </el-table-column>
        <el-table-column label="每日最大发送次数" prop="maxDailyCount" width="150"> </el-table-column>
        <el-table-column label="最小发送间隔(秒)" prop="minIntervalSeconds" width="150"> </el-table-column>
        <el-table-column label="模板数据映射" prop="templateDataMapping" width="190">
          <template #default="{ row }">
            <span v-for="(v, key) in row.templateDataMapping" :key="v">{{ key }}/</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可编辑" align="center" width="100">
          <template #default="{ row }">
            {{ row.isEditable ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="是否系统配置" prop="isSystemConfig" width="110">
          <template #default="{ row }">
            {{ row.isSystemConfig ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" width="250"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="100"> </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="100"> </el-table-column>
        <el-table-column label="操作" align="center" width="90" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div class="table-btn" @click="editRow(scope.row)">编辑</div>
              <div v-if="false" @click="detail(scope.row)">配置详情</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="通知类型" prop="typeName">
                <el-input v-model="form.typeName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="每日最大发送次数" prop="maxDailyCount">
                <el-input-number style="width: 100%" :step="1" v-model.number="form.maxDailyCount" :min="0" :max="1000" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="最小发送间隔(秒)" prop="minIntervalSeconds">
                <el-input-number style="width: 100%" :step="1" v-model.number="form.minIntervalSeconds" :min="0" :max="86400" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="优先级" prop="priority">
                <el-select style="width: 100%" v-model="form.priority">
                  <el-option v-for="v in priorityList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="是否启用" prop="isEnabled">
                <el-radio-group v-model="form.isEnabled">
                  <el-radio :value="true">启用</el-radio>
                  <el-radio :value="false">不启用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
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
    <el-dialog v-model="dialogVisibleDetail" :close-on-click-modal="false" title="详情" :width="1000">
      <div style="padding-left: 20px">
        <div v-if="detailForm.studentBalance">
          <el-descriptions border title="学生账户">
            <el-descriptions-item label="总余额（元）">{{ detailForm.studentBalance.totalBalance }}</el-descriptions-item>
            <el-descriptions-item label="可用余额（元）">{{ detailForm.studentBalance.availableBalance }}</el-descriptions-item>
            <el-descriptions-item label="冻结余额（元）">{{ detailForm.studentBalance.frozenBalance }}</el-descriptions-item>
            <el-descriptions-item label="赠送通话剩余分钟数">{{ detailForm.studentBalance.giftMinutes }}</el-descriptions-item>
            <el-descriptions-item label="套餐通话剩余分钟数">{{ detailForm.studentBalance.packageMinutes }}</el-descriptions-item>
            <el-descriptions-item label="套餐留言剩余条数">{{
              detailForm.studentBalance.packageMessageCount == -1 ? "不限数量" : detailForm.studentBalance.packageMessageCount
            }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{
              detailForm.studentBalance.status == 1 ? "正常" : "冻结"
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-descriptions column="2" border title="通话详情" style="margin-top: 20px">
          <el-descriptions-item label="学生姓名">{{ detailForm.studentName }}</el-descriptions-item>
          <el-descriptions-item label="唯一号">{{ detailForm.studentUuid }}</el-descriptions-item>
          <el-descriptions-item label="物理卡号">{{ detailForm.cardNumber }}</el-descriptions-item>
          <el-descriptions-item label="通话类型">
            {{ { VIDEO: "视频通话", SPEECH: "语音通话" }[detailForm.callType] }}
          </el-descriptions-item>
          <el-descriptions-item label="通道类型">{{ detailForm.channelType }}</el-descriptions-item>
          <el-descriptions-item label="被呼叫号码">{{ detailForm.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="联系人称呼">{{ detailForm.contactName }}</el-descriptions-item>
          <el-descriptions-item label="是否是SOS电话">{{ detailForm.isSos ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="呼叫开始时间">{{ detailForm.callStartTime }}</el-descriptions-item>
          <el-descriptions-item label="呼叫结束时间">{{ detailForm.callEndTime }}</el-descriptions-item>
          <el-descriptions-item label="通话时长(分钟)">{{ detailForm.callLenMinute }}</el-descriptions-item>
          <el-descriptions-item label="拨号和通话时长(秒)">{{ detailForm.callDuration }}</el-descriptions-item>
          <el-descriptions-item label="拨号和通话时长">{{ detailForm.callDurationFormatted }}</el-descriptions-item>
          <el-descriptions-item label="消费流水号">{{ detailForm.consumeSerialNo }}</el-descriptions-item>
          <!-- <el-descriptions-item label="使用时长(秒)">{{ detailForm.usageDuration }}</el-descriptions-item> -->
          <el-descriptions-item label="单价">{{ detailForm.unitPrice }}</el-descriptions-item>
          <el-descriptions-item label="实际扣费金额（元）">{{ detailForm.amount }}</el-descriptions-item>
          <el-descriptions-item label="扣费时间">{{ detailForm.consumeTime }}</el-descriptions-item>
          <el-descriptions-item label="是否使用套餐">{{ detailForm.isPackageUsage ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="使用类型">{{ detailForm.usageTypeText }}</el-descriptions-item>
          <el-descriptions-item label="是否免费使用">{{ detailForm.isFreeUsage ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="使用的赠送分钟数">{{ detailForm.giftMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的套餐分钟数">{{ detailForm.packageMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的余额分钟数">{{ detailForm.balanceMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailForm.distributionText }}</el-descriptions-item>
          <el-descriptions-item label="套餐名称">{{ detailForm.packageName }}</el-descriptions-item>
          <el-descriptions-item label="套餐类型">
            {{ { FIXED: "固定套餐", GENERAL: "通用套餐" }[detailForm.packageType] }}
          </el-descriptions-item>
          <el-descriptions-item label="套餐购买价格（元）">{{ detailForm.purchasePrice }}</el-descriptions-item>
          <el-descriptions-item label="套餐开始日期">{{ detailForm.packageStartDate }}</el-descriptions-item>
          <el-descriptions-item label="套餐结束日期">{{ detailForm.packageEndDate }}</el-descriptions-item>
          <el-descriptions-item label="学校">{{ detailForm.schoolName }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ detailForm.gradeName }}</el-descriptions-item>
          <el-descriptions-item label="级部">{{ detailForm.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ detailForm.className }}</el-descriptions-item>
          <el-descriptions-item label="SN">{{ detailForm.deviceSn }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions-item label="学生姓名">{{ detailForm.studentName }}</el-descriptions-item>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="dialogVisibleDetail = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/modules/user";
import { notificationList, notificationDetail, notificationbatchstatus, notificationupdate } from "@/api/modules/InternalPage.js";
export default {
  data() {
    return {
      isloading: false,
      filterForm: {
        typeCode: "",
        isEnabled: "",
        priority: "",
        searchKeyword: ""
      },
      isEnabledList: [
        { id: true, name: "启用" },
        { id: false, name: "不启用" }
      ],
      priorityList: [
        { id: 0, name: "低" },
        { id: 1, name: "中" },
        { id: 2, name: "高" },
        { id: 3, name: "紧急" }
      ],
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 详情
      dialogVisibleDetail: false,
      detailForm: { studentBalance: {} },
      //编辑系统
      dialogVisibleAdd: false,
      form: {
        typeName: "",
        isEnabled: false,
        priority: "",
        maxDailyCount: "",
        minIntervalSeconds: "",
        description: ""
      },
      linkRules: {
        typeName: [{ required: true, message: "必填项", trigger: "blur" }],
        isEnabled: [{ required: true, message: "必填项", trigger: "blur" }],
        priority: [{ required: true, message: "必填项", trigger: "blur" }],
        maxDailyCount: [{ required: true, message: "必填项", trigger: "blur" }],
        minIntervalSeconds: [{ required: true, message: "必填项", trigger: "blur" }],
        description: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    reset() {
      this.filterForm.searchKeyword = "";
      this.filterForm.typeCode = "";
      this.filterForm.isEnabled = "";
      this.filterForm.priority = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let str = this.filterForm.isEnabled === "" ? "" : `&isEnabled=${this.filterForm.isEnabled}`;
      let priority = this.filterForm.priority === "" ? "" : `&priority=${this.filterForm.priority}`;
      let params = `tenantId=${this.userInfo.tenantId}&page=${this.page}&pageSize=${this.pageSize}&searchKeyword=${this.filterForm.searchKeyword}&typeCode=${this.filterForm.typeCode}${priority}${str}`;
      notificationList(params).then(res => {
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
    detail(row) {
      this.dialogVisibleDetail = true;
      notificationDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailForm = res.data;
        } else {
          this.$message.error("获取信息失败");
        }
      });
    },
    changeStatus(row) {
      notificationbatchstatus({ ids: [row.id], isEnabled: row.isEnabled }).then(res => {
        if (res.code == 0) {
          this.$message.success("操作成功");
          this.fetchTenantList();
        }
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      notificationDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
          this.form.id = row.id;
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.id = row.id;
    },
    confirmAdd() {
      notificationupdate(this.form).then(res => {
        if (res.code == 0) {
          this.dialogVisibleAdd = false;
          this.$message.success("提交成功");
          this.fetchTenantList();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
