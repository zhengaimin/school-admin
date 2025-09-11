<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生姓名</label>
      <el-input style="width: 180px" v-model="filterForm.studentName"></el-input>
      <label for="name">留言方向</label>
      <el-select style="width: 180px" v-model="filterForm.messageDirection">
        <el-option v-for="v in messageToList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <label for="name">开始时间</label>
      <el-date-picker
        style="width: 180px"
        v-model="filterForm.startTime"
        type="date"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
      />
      <label for="name">结束时间</label>
      <el-date-picker
        style="width: 180px"
        v-model="filterForm.endTime"
        type="date"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
      />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>留言记录</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学生" prop="studentName" width="110"> </el-table-column>
        <el-table-column label="学校" prop="schoolName" width="160"> </el-table-column>
        <el-table-column label="年级" prop="gradeName" width="100"> </el-table-column>
        <el-table-column label="级部" prop="departmentName" width="100"> </el-table-column>
        <el-table-column label="班级" prop="className" width="100"> </el-table-column>
        <el-table-column label="卡号" prop="cardNumber" width="110"> </el-table-column>
        <el-table-column label="称呼" prop="guardianName" width="90"> </el-table-column>
        <el-table-column label="接收方手机号" prop="receiverPhone" width="130"> </el-table-column>
        <el-table-column label="留言方向" prop="messageDirection" width="130">
          <template #default="{ row }">
            {{ { STUDENT_TO_GUARDIAN: "学生给家长留言", GUARDIAN_TO_STUDENT: "家长给学生留言" }[row.messageDirection] }}
          </template>
        </el-table-column>
        <el-table-column label="是否已读" prop="isRead" width="100">
          <template #default="{ row }">
            {{ row.isRead ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="是否使用套餐" width="120">
          <template #default="{ row }">
            {{ row.isPackageUsage ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            {{ ["", "正常", "删除"][row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="amount" width="130"> </el-table-column>
        <el-table-column label="操作" align="center" width="90" fixed="right">
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
            <el-descriptions-item label="留言方向">{{
              { STUDENT_TO_GUARDIAN: "学生给家长留言", "GUARDIAN_TO_STUDENT ": "家长给学生留言" }[detailObj.messageDirection]
            }}</el-descriptions-item>
            <el-descriptions-item label="接收方手机号">{{ detailObj.receiverPhone }}</el-descriptions-item>
            <el-descriptions-item label="称呼">{{ detailObj.guardianName }}</el-descriptions-item>
            <el-descriptions-item label="UUID">{{ detailObj.studentUuid }}</el-descriptions-item>
            <el-descriptions-item label="卡号">{{ detailObj.cardNumber }}</el-descriptions-item>
            <el-descriptions-item label="是否已读">{{ detailObj.isRead ? "是" : "否" }}</el-descriptions-item>
            <el-descriptions-item label="状态"> {{ ["", "正常", "删除"][detailObj.status] }}</el-descriptions-item>
            <el-descriptions-item label="是否免费试用">{{ detailObj.isFreeUsage ? "是" : "否" }}</el-descriptions-item>
            <el-descriptions-item label="套餐类型">{{
              { GENERAL: "通用套餐", FIXED: "固定套餐" }[detailObj.packageType]
            }}</el-descriptions-item>
            <el-descriptions-item label="套餐购买价格（元）">{{ detailObj.purchasePrice }}</el-descriptions-item>
            <el-descriptions-item label="学校">{{ detailObj.schoolName }}</el-descriptions-item>
            <el-descriptions-item label="年级">{{ detailObj.gradeName }}</el-descriptions-item>
            <el-descriptions-item label="级部">{{ detailObj.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ detailObj.className }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ detailObj.contactName }}</el-descriptions-item>
            <el-descriptions-item label="SN">{{ detailObj.deviceSn }}</el-descriptions-item>
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
import { messagesList, messagesDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      messageToList: [
        { id: "STUDENT_TO_GUARDIAN", name: "学生给家长留言" },
        { id: "GUARDIAN_TO_STUDENT", name: "家长给学生留言" }
      ],
      filterForm: {
        studentName: "",
        messageDirection: "",
        startTime: "",
        endTime: ""
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
      this.filterForm.studentName = "";
      this.filterForm.messageDirection = "";
      this.filterForm.startTime = "";
      this.filterForm.endTime = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      this.filterForm.startTime = this.filterForm.startTime ? this.filterForm.startTime : "";
      this.filterForm.endTime = this.filterForm.endTime ? this.filterForm.endTime : "";
      let params = `schoolId=${this.schoolId}&studentName=${this.filterForm.studentName}&messageDirection=${this.filterForm.messageDirection}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}&page=${this.page}&pageSize=${this.pageSize}`;
      messagesList(params).then(res => {
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
      messagesDetail({ id: row.id }).then(res => {
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
