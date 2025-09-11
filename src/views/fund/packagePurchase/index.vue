<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生关键词</label>
      <el-input style="width: 200px" v-model="filterForm.studentKeyword"></el-input>
      <label for="name">订单号</label>
      <el-input style="width: 200px" v-model="filterForm.orderNo"></el-input>
      <label for="name">开始时间</label>
      <el-date-picker v-model="filterForm.startDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
      <label for="name">结束时间</label>
      <el-date-picker v-model="filterForm.endDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" />

      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>套餐购买记录</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName" width="160"> </el-table-column>
        <el-table-column label="学生" prop="studentName" width="110"> </el-table-column>
        <el-table-column label="购买人" prop="purchaserName" width="110"> </el-table-column>
        <el-table-column label="套餐类型" width="160">
          <template #default="{ row }">
            {{ { FIXED: "固定套餐", GENERAL: "通用套餐" }[row.packageType] }}
          </template>
        </el-table-column>
        <el-table-column label="购买价格（元）" prop="purchasePrice" width="130"> </el-table-column>
        <el-table-column label="购买时间" prop="purchaseDate" width="160"> </el-table-column>
        <el-table-column label="订单号" prop="orderNo" width="160"> </el-table-column>
        <el-table-column label="状态" prop="statusText"> </el-table-column>
        <el-table-column label="支付时间" prop="paymentTime" width="160"> </el-table-column>
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="detail(scope.row)">详情</div>
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

    <!-- 详情 -->
    <el-dialog v-model="dialogVisibledetail" :close-on-click-modal="false" title="详情" width="809">
      <div style="padding-left: 20px">
        <div>
          <el-descriptions column="2" border title="" style="margin-bottom: 20px">
            <el-descriptions-item label="学生姓名">{{ detailObj.studentName }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ detailObj.studentCode }}</el-descriptions-item>
            <el-descriptions-item label="学校">{{ detailObj.schoolName }}</el-descriptions-item>
            <el-descriptions-item label="年级">{{ detailObj.gradeName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ detailObj.className }}</el-descriptions-item>
            <el-descriptions-item label="套餐类型">{{
              { FIXED: "固定套餐", GENERAL: "通用套餐" }[detailObj.packageType]
            }}</el-descriptions-item>
            <el-descriptions-item label="购买价格">{{ detailObj.purchasePrice }}</el-descriptions-item>
            <el-descriptions-item label="开始时间">{{ detailObj.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ detailObj.endDate }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ detailObj.statusText }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ detailObj.paymentTime }}</el-descriptions-item>
            <el-descriptions-item label="购买人">{{ detailObj.purchaserName }}</el-descriptions-item>
            <el-descriptions-item label="语音通话时长（分钟）">{{
              detailObj.packageContent.videoCallMinutes ? detailObj.packageContent.videoCallMinutes : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="套餐描述">{{ detailObj.templateDescription }}</el-descriptions-item>
            <el-descriptions-item label="使用规则">{{ detailObj.usageRules }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: center">
              <el-button type="primary" @click="dialogVisibledetail = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { packagerecordsList, packagerecordsDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        studentKeyword: "",
        orderNo: "",
        startDate: "",
        endDate: ""
      },
      statusList: [
        { id: "1", name: "在线" },
        { id: "0", name: "离线" }
      ],
      //新增权限系统
      dialogVisibledetail: false,
      detailObj: { packageContent: {} },
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
      this.filterForm.studentKeyword = "";
      this.filterForm.orderNo = "";
      this.filterForm.startDate = "";
      this.filterForm.endDate = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      this.filterForm.startDate = this.filterForm.startDate ? this.filterForm.startDate : "";
      this.filterForm.endDate = this.filterForm.endDate ? this.filterForm.endDate : "";
      let params = `schoolId=${this.schoolId}&studentKeyword=${this.filterForm.studentKeyword}&orderNo=${this.filterForm.orderNo}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}&page=${this.page}&pageSize=${this.pageSize}`;
      packagerecordsList(params).then(res => {
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
    // 详情
    detail(row) {
      this.dialogVisibledetail = true;
      packagerecordsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailObj = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
