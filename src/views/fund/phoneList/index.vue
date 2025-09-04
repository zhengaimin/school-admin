<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生姓名</label>
      <el-input v-model="filterForm.studentName" style="width: 200px" />
      <label for="name">开始时间</label>
      <el-date-picker
        v-model="filterForm.startTime"
        type="datetime"
        :value-format="'YYYY-MM-DD HH:mm:ss'"
        :format="'YYYY-MM-DD HH:mm:ss'"
      />
      <label for="name">结束时间</label>
      <el-date-picker
        v-model="filterForm.endTime"
        type="datetime"
        :value-format="'YYYY-MM-DD HH:mm:ss'"
        :format="'YYYY-MM-DD HH:mm:ss'"
      />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>通话记录列表</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="学校" prop="schoolName" width="150"> </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="级部" prop="departmentName"> </el-table-column>
        <el-table-column label="班级" prop="className"> </el-table-column>
        <el-table-column label="实际扣费金额（元）" prop="amount" width="160"> </el-table-column>
        <el-table-column label="通话时长" prop="callDurationFormatted" width="90"> </el-table-column>
        <el-table-column label="联系人称呼" prop="contactName" width="120"> </el-table-column>
        <el-table-column label="被呼叫号码" prop="phoneNumber" width="120"> </el-table-column>
        <el-table-column label="物理卡号" prop="cardNumber" width="150"> </el-table-column>
        <el-table-column label="可用余额" align="center" width="100">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.availableBalance }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总余额" align="center" width="100">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.totalBalance }}
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
        <el-table-column label="套餐留言剩余条数" align="center" width="150">
          <template #default="{ row }">
            <span v-if="row.studentBalance">
              {{ row.studentBalance.packageMessageCount }}
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
              detailForm.studentBalance.packageMessageCount
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
          <el-descriptions-item label="通话类型">{{ detailForm.callType }}</el-descriptions-item>
          <el-descriptions-item label="通道类型">{{ detailForm.channelType }}</el-descriptions-item>
          <el-descriptions-item label="被呼叫号码">{{ detailForm.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="联系人称呼">{{ detailForm.contactName }}</el-descriptions-item>
          <el-descriptions-item label="是否是SOS电话">{{ detailForm.isSos ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="呼叫开始时间">{{ detailForm.callStartTime }}</el-descriptions-item>
          <el-descriptions-item label="呼叫结束时间">{{ detailForm.callEndTime }}</el-descriptions-item>
          <el-descriptions-item label="通话时长(秒)">{{ detailForm.callDuration }}</el-descriptions-item>
          <el-descriptions-item label="通话时长(分钟)">{{ detailForm.callLenMinute }}</el-descriptions-item>
          <el-descriptions-item label="格式化通话时长">{{ detailForm.callDurationFormatted }}</el-descriptions-item>
          <el-descriptions-item label="消费流水号">{{ detailForm.consumeSerialNo }}</el-descriptions-item>
          <el-descriptions-item label="使用时长(秒)">{{ detailForm.usageDuration }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ detailForm.unitPrice }}</el-descriptions-item>
          <el-descriptions-item label="实际扣费金额">{{ detailForm.amount }}</el-descriptions-item>
          <el-descriptions-item label="扣费时间">{{ detailForm.consumeTime }}</el-descriptions-item>
          <el-descriptions-item label="是否使用套餐">{{ detailForm.isPackageUsage }}</el-descriptions-item>
          <el-descriptions-item label="使用类型">{{ detailForm.usageTypeText }}</el-descriptions-item>
          <el-descriptions-item label="是否免费使用">{{ detailForm.isFreeUsage }}</el-descriptions-item>
          <el-descriptions-item label="使用的赠送分钟数">{{ detailForm.giftMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的套餐分钟数">{{ detailForm.packageMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的余额分钟数">{{ detailForm.balanceMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailForm.distributionText }}</el-descriptions-item>
          <el-descriptions-item label="套餐名称">{{ detailForm.packageName }}</el-descriptions-item>
          <el-descriptions-item label="套餐类型">{{ detailForm.packageType }}</el-descriptions-item>
          <el-descriptions-item label="套餐购买价格">{{ detailForm.purchasePrice }}</el-descriptions-item>
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
import { callrecordsList, callrecordsDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        studentName: "",
        startTime: "",
        endTime: ""
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      dialogVisibleDetail: false,
      detailForm: { studentBalance: {} }
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
      this.filterForm.studentName = "";
      this.filterForm.startTime = "";
      this.filterForm.endTime = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&studentName=${this.filterForm.studentName}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}`;
      callrecordsList(params).then(res => {
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
      callrecordsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailForm = res.data;
        } else {
          this.$message.error("获取信息失败");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
