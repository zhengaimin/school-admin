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
        <label for="name">设备类型</label>
        <el-select v-model="filterForm.deviceType" style="width: calc(100% - 90px)">
          <el-option v-for="v in deviceTypeList" :key="v.id" :label="v.name" :value="v.id"></el-option>
        </el-select>
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
            getdepartmentsList();
            getClassList();
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
      <span>套餐购买</span>
      <div>
        <el-button type="primary" @click="exportInfo">导出</el-button>
      </div>
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
            <el-descriptions-item label="语音通话时长（分钟）">
              {{ detailObj.packageContent.videoCallMinutes ? detailObj.packageContent.videoCallMinutes : "" }}
            </el-descriptions-item>
            <el-descriptions-item label="套餐描述">{{ detailObj.templateDescription }}</el-descriptions-item>
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
  packagerecordsList,
  packagerecordsDetail,
  packagerecordsexportinfo
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
import { DEVICE_TYPE, PACKAGE_KIND } from "@/config/modules";

export default {
  data() {
    return {
      isloading: false,
      isloading1: false,
      filterForm: {
        studentKeyword: "",
        orderNo: "",
        deviceType: -1,
        startDate: "",
        endDate: "",
        gradeId: "",
        departmentId: "",
        classId: ""
      },
      gradesList: [],
      departmentsList: [],
      classList: [],
      deviceTypeList: [
        { id: -1, name: "全部" },
        { id: DEVICE_TYPE.VIDEO, name: "视频话机" },
        { id: DEVICE_TYPE.DRYER, name: "吹风机" }
      ],
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
        return `/api/admin/package-records/export`;
      } else {
        return `/admin/package-records/export`;
      }
    }
  },
  isPlatformPackagePurchase() {
    return this.$route?.path === "/package/purchase";
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
      let params = `schoolId=${this.schoolId}&page=1&pageSize=100&gradeId=${this.filterForm.gradeId}`;
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
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&gradeId=${this.filterForm.gradeId}&departmentId=${this.filterForm.departmentId}`;
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
      this.filterForm.deviceType = -1;
      this.filterForm.startDate = "";
      this.filterForm.endDate = "";
      this.filterForm.gradeId = "";
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.fetchTenantList();
    },
    getDeviceType() {
      if (this.filterForm.deviceType === -1 || this.filterForm.deviceType === "-1" || !this.filterForm.deviceType) return "";
      return this.filterForm.deviceType;
    },
    fetchTenantList() {
      if (this.isloading1) return;
      this.isloading1 = true;
      this.filterForm.startDate = this.filterForm.startDate ? this.filterForm.startDate : "";
      this.filterForm.endDate = this.filterForm.endDate ? this.filterForm.endDate : "";
      let deviceType = this.getDeviceType();
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let departmentId = this.filterForm.departmentId ? this.filterForm.departmentId : -1;
      let classId = this.filterForm.classId ? this.filterForm.classId : -1;
      let params = `${deviceType ? `deviceType=${deviceType}&` : ""}schoolId=${this.schoolId}&studentKeyword=${this.filterForm.studentKeyword}&orderNo=${this.filterForm.orderNo}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}${this.isPlatformPackagePurchase ? `&packageKind=${PACKAGE_KIND.PLATFORM}` : ""}`;
      packagerecordsList(params).then(res => {
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
      packagerecordsDetail({ id: row.id }).then(res => {
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
      this.filterForm.startDate = this.filterForm.startDate ? this.filterForm.startDate : "";
      this.filterForm.endDate = this.filterForm.endDate ? this.filterForm.endDate : "";
      let deviceType = this.getDeviceType();
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let departmentId = this.filterForm.departmentId ? this.filterForm.departmentId : -1;
      let classId = this.filterForm.classId ? this.filterForm.classId : -1;
      let params = `${deviceType ? `deviceType=${deviceType}&` : ""}schoolId=${this.schoolId}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}${this.isPlatformPackagePurchase ? `&packageKind=${PACKAGE_KIND.PLATFORM}` : ""}`;
      packagerecordsexportinfo(params).then(res => {
        if (res.code == 0 && res.data) {
          this.totalInfo = res.data.totalRecords;
        }
      });
    },
    confirmexport() {
      this.filterForm.startDate = this.filterForm.startDate ? this.filterForm.startDate : "";
      this.filterForm.endDate = this.filterForm.endDate ? this.filterForm.endDate : "";
      let deviceType = this.getDeviceType();
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let departmentId = this.filterForm.departmentId ? this.filterForm.departmentId : -1;
      let classId = this.filterForm.classId ? this.filterForm.classId : -1;
      let url = `${this.exportmessageUrl}?${deviceType ? `deviceType=${deviceType}&` : ""}page=${this.pageInfo}&pageSize=${this.pageSizeInfo}&schoolId=${this.schoolId}&startDate=${this.filterForm.startDate}&endDate=${this.filterForm.endDate}&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}${this.isPlatformPackagePurchase ? `&packageKind=${PACKAGE_KIND.PLATFORM}` : ""}`;
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
          aLink.setAttribute("download", "套餐购买.xlsx");
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
