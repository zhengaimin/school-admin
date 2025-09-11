<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生姓名/学号</label>
      <el-input style="width: 250px" v-model="filterForm.studentKeyword"></el-input>
      <label for="name">退款状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in statusList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>退款审核</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="退款申请单号" prop="refundNo" width="150"> </el-table-column>
        <el-table-column label="退款状态" prop="status" width="130">
          <template #default="{ row }">
            {{
              ["待审核", "审核通过", "退款中", "全部退款完成", "部分退款完成", "审核不通过", "用户取消", "全部失败"][row.status]
            }}
          </template>
        </el-table-column>
        <el-table-column label="申请退款金额（元）" prop="applyAmount" width="155"> </el-table-column>
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="学号" prop="studentCode" width="140"> </el-table-column>
        <el-table-column label="学校" prop="schoolName" width="140"> </el-table-column>
        <el-table-column label="申请人" prop="applicantName"> </el-table-column>
        <el-table-column label="退款类型" prop="refundType" width="120">
          <template #default="{ row }">
            {{ { FULL: "全额退款", SINGLE: "部分退款" }[row.refundType] }}
          </template>
        </el-table-column>
        <el-table-column label="申请退款金额（元）" prop="applyAmount" width="155"> </el-table-column>
        <el-table-column label="实际退款金额（元）" prop="actualAmount" width="155"> </el-table-column>
        <el-table-column label="申请原因" prop="applyReason" width="200"> </el-table-column>
        <el-table-column label="申请时间" prop="applyTime" width="140"> </el-table-column>
        <el-table-column label="审核时间" prop="auditTime" width="140"> </el-table-column>
        <el-table-column label="完成时间" prop="completeTime" width="140"> </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div v-if="scope.row.status == 0" @click="editRow(scope.row)">审核</div>
              <div @click="detail(scope.row)">退款详情</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="审核" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="是否通过" prop="approved">
                <el-radio-group v-model="form.approved">
                  <el-radio :value="true">通过</el-radio>
                  <el-radio :value="false">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="adminRemark">
                <el-input type="textarea" :rows="3" v-model="form.adminRemark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="23">
              <el-form-item label="退款金额（如何不填则以用户申请金额为准）" prop="actualAmount">
                <el-input type="number" :min="0" style="width: 100%" v-model.number="form.actualAmount" />
              </el-form-item>
            </el-col>
          </el-row> -->
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
    <el-dialog v-model="dialogVisibledetail" :close-on-click-modal="false" title="退款详情" width="80%">
      <div style="padding-left: 20px">
        <div v-if="detailObj.studentInfo" style="margin-bottom: 10px">
          <el-descriptions border title="学生信息" style="margin-bottom: 20px">
            <el-descriptions-item label="学生姓名">{{ detailObj.studentInfo.studentName }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ detailObj.studentInfo.studentCode }}</el-descriptions-item>
            <el-descriptions-item label="当前余额">{{ detailObj.studentInfo.balance }}</el-descriptions-item>
            <el-descriptions-item label="年级">{{ detailObj.studentInfo.gradeName }}</el-descriptions-item>
            <el-descriptions-item label="级部">{{ detailObj.studentInfo.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ detailObj.studentInfo.className }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-if="detailObj.refundDetails">
          <el-table class="my-custom-table" :data="detailObj.refundDetails">
            <el-table-column label="原充值金额（元）" prop="originalAmount"> </el-table-column>
            <el-table-column label="本笔退款金额（元）" prop="refundAmount"> </el-table-column>
            <el-table-column label="原充值单号" prop="paymentOrderNo"> </el-table-column>
            <el-table-column label="原支付方式" prop="originalPaymentMethod"> </el-table-column>
            <el-table-column label="原第三方交易流水号" prop="originalTransactionId"> </el-table-column>
            <el-table-column label="原支付时间" prop="originalPayTime"> </el-table-column>
            <el-table-column label="第三方退款流水号" prop="thirdPartyRefundId"> </el-table-column>
            <el-table-column label="退款状态" prop="refundStatus" width="130">
              <template #default="{ row }">
                {{ ["待退款", "退款处理中", "退款成功", "退款失败", "已取消"][row.refundStatus] }}
              </template>
            </el-table-column>
            <el-table-column label="退款失败原因" prop="refundFailReason"> </el-table-column>
          </el-table>
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
import { refundsList, refundscheck, refundsDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        studentKeyword: "",
        status: ""
      },
      statusList: [
        { id: "0", name: "待审核" },
        { id: "1", name: "审核通过" },
        { id: "2", name: "退款中" },
        { id: "3", name: "全部退款完成" },
        { id: "4", name: "部分退款完成" },
        { id: "5", name: "审核不通过" },
        { id: "6", name: "用户取消" },
        { id: "7", name: "全部失败" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      form: {
        refundApplicationId: "",
        approved: true,
        adminRemark: ""
        // actualAmount: ""
      },
      linkRules: {
        approved: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 详情
      dialogVisibledetail: false,
      detailObj: {}
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
      this.filterForm.status = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let params = `schoolId=${this.schoolId}&refundType=FULL&page=${this.page}&pageSize=${this.pageSize}&studentKeyword=${this.filterForm.studentKeyword}&status=${status}`;
      refundsList(params).then(res => {
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

    //审核
    editRow(row) {
      this.dialogVisibleAdd = true;
      this.form.refundApplicationId = row.id;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          // if (this.form.actualAmount < 0 || this.form.actualAmount == 0) {
          //   this.$message.error("实际退款金额必须大于0");
          //   return;
          // }
          // if (this.form.actualAmount == "") {
          //   delete this.form.actualAmount;
          // } else {
          //   this.form.actualAmount = Number(this.form.actualAmount);
          // }
          if (this.form.refundApplicationId) {
            refundscheck(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("审核成功");
                this.fetchTenantList();
              }
            });
            return;
          }
        }
      });
    },
    // 详情
    detail(row) {
      this.dialogVisibledetail = true;
      refundsDetail({ id: row.id }).then(res => {
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
