<template>
  <div class="table-box">
    <!-- <div class="filter-box">
      <label for="name">留言方向</label>
      <el-select style="width: 180px" v-model="filterForm.messageDirection">
        <el-option v-for="v in messageToList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
    </div> -->
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
      <span>留言记录</span>
      <div>
        <el-button type="primary" @click="exportInfo">导出</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName" width="130"> </el-table-column>
        <el-table-column label="学生" prop="studentName" width="110"> </el-table-column>
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
  messagesList,
  messagesDetail,
  messagesListExportInfo
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      isloading: false,
      isloading1: false,
      messageToList: [
        { id: "STUDENT_TO_GUARDIAN", name: "学生给家长留言" },
        { id: "GUARDIAN_TO_STUDENT", name: "家长给学生留言" }
      ],
      filterForm: {
        studentName: "",
        messageDirection: "",
        gradeId: "",
        departmentId: "",
        classId: "",
        startTime: "",
        endTime: ""
      },
      statusList: [
        { id: "1", name: "在线" },
        { id: "0", name: "离线" }
      ],
      gradesList: [],
      departmentsList: [],
      classList: [],
      //新增权限系统
      dialogVisibledetail: false,
      detailObj: { packageContent: {} },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 批量导出
      exportDialog: false,
      totalInfo: 0,
      pageInfo: 1,
      pageSizeInfo: 10000,
      exportForm: {}
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
        return `/api/admin/messages/export`;
      } else {
        return `/admin/messages/export`;
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
      this.filterForm.messageDirection = "";
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
      this.filterForm.startTime = this.filterForm.startTime ? this.filterForm.startTime : "";
      this.filterForm.endTime = this.filterForm.endTime ? this.filterForm.endTime : "";
      let params = `schoolId=${this.schoolId}&studentName=${this.filterForm.studentName}&messageDirection=${this.filterForm.messageDirection}&startTime=${this.filterForm.startTime}&endTime=${this.filterForm.endTime}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${this.filterForm.gradeId}&departmentId=${this.filterForm.departmentId}&classId=${this.filterForm.classId}`;
      messagesList(params).then(res => {
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
    // 详情
    detail(row) {
      this.dialogVisibledetail = true;
      messagesDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.detailObj = res.data;
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
      messagesListExportInfo(params).then(res => {
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
          aLink.setAttribute("download", "留言记录.xlsx");
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
