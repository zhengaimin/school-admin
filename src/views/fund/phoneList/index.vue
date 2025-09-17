<template>
  <div class="table-box">
    <div class="filter-box">
      <div>
        <label for="name">学生姓名</label>
        <el-input v-model="filterForm.studentName" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="">年级</label>
        <el-select
          placeholder="年级"
          @change="
            getdepartmentsList(1);
            getClassList(1);
          "
          style="width: calc(100% - 90px)"
          v-model="filterForm.gradeId"
        >
          <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="">级部</label>
        <el-select
          placeholder="级部"
          @change="getClassList(1)"
          style="width: calc(100% - 70px)"
          v-model="filterForm.departmentId"
        >
          <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="">班级</label>
        <el-select placeholder="班级" style="width: calc(100% - 90px)" v-model="filterForm.classId">
          <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="name">开始时间</label>
        <el-date-picker
          v-model="filterForm.startTime"
          type="datetime"
          :value-format="'YYYY-MM-DD HH:mm:ss'"
          :format="'YYYY-MM-DD HH:mm:ss'"
          style="width: calc(100% - 90px)"
        />
      </div>
      <div>
        <label for="name">结束时间</label>
        <el-date-picker
          v-model="filterForm.endTime"
          type="datetime"
          :value-format="'YYYY-MM-DD HH:mm:ss'"
          :format="'YYYY-MM-DD HH:mm:ss'"
          style="width: calc(100% - 90px)"
        />
      </div>
      <div>
        <el-button @click="reset" style="margin-left: 20px">重置</el-button>
        <el-button type="primary" @click="fetchTenantList">查询</el-button>
      </div>
    </div>
    <div class="btn-box">
      <span>通话记录列表</span>
      <div>
        <el-button type="primary" @click="exportInfo">导出</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName" width="130"> </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="级部" prop="departmentName"> </el-table-column>
        <el-table-column label="班级" prop="className"> </el-table-column>
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="设备SN号" prop="deviceSn" width="110"> </el-table-column>
        <el-table-column label="扣费类型" prop="usageTypeText" width="90"> </el-table-column>
        <el-table-column label="赠送通话剩余分钟数" align="center" width="160">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.giftMinutes }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="套餐通话剩余分钟数" align="center" width="160">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.packageMinutes }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总余额（元）" align="center" width="110">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.totalBalance }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="可用余额（元）" align="center" width="130">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.availableBalance }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="实际扣费金额（元）" prop="amount" width="160"> </el-table-column>
        <el-table-column label="通话时长（分钟）" prop="callLenMinute" width="140"> </el-table-column>
        <el-table-column label="开始时间" prop="callStartTime" width="140"> </el-table-column>
        <el-table-column label="结束时间" prop="callEndTime" width="140"> </el-table-column>
        <el-table-column label="联系人称呼" prop="contactName" width="120"> </el-table-column>
        <el-table-column label="被呼叫号码" prop="phoneNumber" width="120"> </el-table-column>
        <el-table-column label="物理卡号" prop="cardNumber" width="150"> </el-table-column>
        <el-table-column label="套餐留言剩余条数" align="center" width="150">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.packageMessageCount == -1 ? "不限数量" : row.studentBalance.packageMessageCount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="90" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="detail(scope.row)">通话详情</div>
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
          <el-descriptions-item label="UUID">{{ detailForm.studentUuid }}</el-descriptions-item>
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
    <!-- 批量导出 -->
    <el-dialog v-model="exportDialog" :close-on-click-modal="false" title="批量导出" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="exportlinkFormRef" :model="exportForm" :rules="exportlinkRules" class="demo-ruleForm" label-position="left">
          <el-form-item label="">
            <div style="">
              <div style="margin-top: 20px; font-size: 16px">请选择导出页码（每次最多导出一万条）：</div>
              <el-pagination
                v-model:current-page="pageInfo"
                v-model:page-size="pageSizeInfo"
                :page-sizes="[10000]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalInfo"
              />
            </div>
          </el-form-item>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: center">
              <el-button @click="exportDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmexport">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { ElNotification } from "element-plus";
import {
  gradesList,
  departmentsList,
  classesList,
  callrecordsList,
  callrecordsDetail,
  callrecordsListExportInfo
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      isloading: false,
      isloading1: false,
      filterForm: {
        studentName: "",
        gradeId: "",
        departmentId: "",
        classId: "",
        startTime: "",
        endTime: ""
      },
      gradesList: [],
      departmentsList: [],
      classList: [],
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      dialogVisibleDetail: false,
      detailForm: { studentBalance: {} },
      // 批量导出
      exportDialog: false,
      totalInfo: 0,
      pageInfo: 1,
      pageSizeInfo: 10000,
      exportForm: {},
      exportlinkRules: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    },
    token() {
      return useUserStore().token;
    },
    exportmessageUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/call-records/export`;
      } else {
        return `/admin/call-records/export`;
      }
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.getGradesList();
          this.fetchTenantList();
          this.filterForm.gradeId = "";
          this.filterForm.departmentId = "";
          this.filterForm.classId = "";
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getGradesList();
    this.fetchTenantList();
  },
  methods: {
    getGradesList() {
      if (this.isloading) return;
      this.isloading = true;
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
        this.isloading = false;
      });
    },
    getdepartmentsList() {
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      let gradeId = this.filterForm.gradeId;
      let params = `schoolId=${this.schoolId}&page=1&pageSize=100&gradeId=${gradeId}`;
      departmentsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.departmentsList = res.data.list;
        } else {
          this.departmentsList = [];
        }
      });
    },
    // 获取班级
    getClassList() {
      this.filterForm.classId = "";
      let gradeId = this.filterForm.gradeId;
      let departmentId = this.filterForm.departmentId;
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&gradeId=${gradeId}&departmentId=${departmentId}`;
      classesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.classList = res.data.list;
        } else {
          this.classList = [];
        }
      });
    },
    reset() {
      this.filterForm.studentName = "";
      this.filterForm.gradeId = "";
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.filterForm.startTime = "";
      this.filterForm.endTime = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      if (this.isloading1) return;
      this.isloading1 = true;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&studentName=${this.filterForm.studentName}&gradeId=${this.filterForm.gradeId}&departmentId=${this.filterForm.departmentId}&classId=${this.filterForm.classId}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}`;
      callrecordsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
          this.total = res.data.total;
        } else {
          this.carbonCk_list = [];
          this.total = 0;
        }
        this.isloading1 = false;
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
      callrecordsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailForm = res.data;
        } else {
          this.$message.error("获取信息失败");
        }
      });
    },
    // 批量导出
    exportInfo() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      this.exportDialog = true;
      let params = `schoolId=${this.schoolId}&gradeId=${this.filterForm.gradeId}&departmentId=${this.filterForm.departmentId}&classId=${this.filterForm.classId}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}`;
      callrecordsListExportInfo(params).then(res => {
        if (res.code == 0 && res.data) {
          this.totalInfo = res.data.totalRecords;
        }
      });
    },
    confirmexport() {
      let url = `${this.exportmessageUrl}?page=${this.pageInfo}&pageSize=${this.pageSizeInfo}&schoolId=${this.schoolId}&gradeId=${this.filterForm.gradeId}&departmentId=${this.filterForm.departmentId}&classId=${this.filterForm.classId}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}`;
      ElNotification({
        title: "提示",
        message: "数据导出中，请稍后",
        type: "success",
        duration: 0
      });
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
          aLink.setAttribute("download", "通话记录.xlsx");
          aLink.click();
          window.URL.revokeObjectURL(url);
          this.exportDialog = false;
          ElNotification.closeAll();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
