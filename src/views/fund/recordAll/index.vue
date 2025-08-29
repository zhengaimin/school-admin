<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">开始时间</label>
      <el-date-picker v-model="filterForm.startDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
      <label for="name">结束时间</label>
      <el-date-picker v-model="filterForm.endDate" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>充值统计</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="总充值金额" prop="totalAmount" width="160"> </el-table-column>
        <el-table-column label="总充值笔数" prop="totalCount"> </el-table-column>
        <el-table-column label="成功充值金额" prop="successCount"> </el-table-column>
        <el-table-column label="成功充值笔数" prop="successCount"> </el-table-column>
        <el-table-column label="成功率" prop="successRate"> </el-table-column>
        <el-table-column label="今日充值金额" prop="todayAmount" width="170"> </el-table-column>
        <el-table-column label="今日充值笔数" prop="todayCount" width="170"> </el-table-column>
        <el-table-column label="本月充值金额" prop="monthAmount" width="170"> </el-table-column>
        <el-table-column label="本月充值笔数" prop="monthCount" width="170"> </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </div>
</template>
<script>
import { paymentsStatisticsList } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        startDate: "",
        endDate: ""
      },
      //  列表
      carbonCk_list: []
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
      this.filterForm.startDate = "";
      this.filterForm.endDate = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `schoolId=${this.schoolId}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}`;
      paymentsStatisticsList(params).then(res => {
        if (res.code == 0 && res.data) {
          this.carbonCk_list = [res.data];
        } else {
          this.carbonCk_list = [];
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
