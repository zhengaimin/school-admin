<template>
  <div class="table-box">
    <div class="filter-box">
      <div>
        <label for="name">学生关键词</label>
        <el-input v-model="filterForm.studentKeyword" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="name">订单号</label>
        <el-input v-model="filterForm.orderNo" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="name">开始时间</label>
        <el-date-picker
          v-model="filterForm.startDate"
          style="width: calc(100% - 90px)"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
        />
      </div>
      <div>
        <label for="name">结束时间</label>
        <el-date-picker
          v-model="filterForm.endDate"
          style="width: calc(100% - 90px)"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
        />
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
        <el-button @click="reset" style="margin-left: 20px">重置</el-button>
        <el-button type="primary" @click="fetchTenantList">查询</el-button>
      </div>
    </div>
    <div class="btn-box">
      <span>套餐购买记录</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName" width="160"> </el-table-column>
        <el-table-column label="唯一号" prop="studentUuid" width="160"> </el-table-column>
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
import {
  gradesList,
  departmentsList,
  classesList,
  packagerecordsList,
  packagerecordsDetail
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        studentKeyword: "",
        orderNo: "",
        startDate: "",
        endDate: "",
        gradeId: "",
        departmentId: "",
        classId: ""
      },
      gradesList: [],
      departmentsList: [],
      classList: [],
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
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
      });
    },
    getdepartmentsList(val) {
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.form.departmentId = "";
      this.form.classId = "";
      this.exportForm.departmentId = "";
      this.exportForm.classId = "";
      let gradeId = val == 1 ? this.filterForm.gradeId : val == 2 ? this.form.gradeId : this.exportForm.gradeId;
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
    getClassList(val) {
      this.filterForm.classId = "";
      this.form.classId = "";
      this.exportForm.classId = "";
      let gradeId = val == 1 ? this.filterForm.gradeId : val == 2 ? this.form.gradeId : this.exportForm.gradeId;
      let departmentId =
        val == 1 ? this.filterForm.departmentId : val == 2 ? this.form.departmentId : this.exportForm.departmentId;
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
      this.filterForm.studentKeyword = "";
      this.filterForm.orderNo = "";
      this.filterForm.startDate = "";
      this.filterForm.endDate = "";
      this.filterForm.gradeId = "";
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      this.filterForm.startDate = this.filterForm.startDate ? this.filterForm.startDate : "";
      this.filterForm.endDate = this.filterForm.endDate ? this.filterForm.endDate : "";
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let departmentId = this.filterForm.departmentId ? this.filterForm.departmentId : -1;
      let classId = this.filterForm.classId ? this.filterForm.classId : -1;
      let params = `schoolId=${this.schoolId}&studentKeyword=${this.filterForm.studentKeyword}&orderNo=${this.filterForm.orderNo}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}`;
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
