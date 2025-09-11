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
      <span>充值记录</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="订单号" prop="orderNo" width="160"> </el-table-column>
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="学号" prop="studentCode"> </el-table-column>
        <el-table-column label="充值金额（元）" prop="amount"> </el-table-column>
        <el-table-column label="支付方式" prop="paymentMethod"> </el-table-column>
        <el-table-column label="支付人" prop="payerName"> </el-table-column>
        <el-table-column label="支付状态">
          <template #default="{ row }">
            {{ ["待支付", "支付成功", "支付失败", "已退款", "已取消", "已过期"][row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="状态文本" prop="statusText" width="170"> </el-table-column>
        <el-table-column label="第三方交易流水号" prop="transactionId" width="170"> </el-table-column>
        <el-table-column label="支付时间" prop="payTime" width="170"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="操作" align="center" width="110" fixed="right" v-if="false">
          <template #default="scope">
            <div class="table-btn">
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="终端Key" prop="terminalKey">
                <el-input v-model="form.terminalKey"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备SN号" prop="terminalSn">
                <el-input v-model="form.terminalSn"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="设备MAC地址" prop="terminalMac">
                <el-input v-model="form.terminalMac"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备组" prop="deviceGroupId">
                <el-select v-model="form.deviceGroupId">
                  <el-option v-for="v in devicegroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备地址" prop="location">
                <el-input v-model="form.location"></el-input>
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
  </div>
</template>
<script>
import { paymentsList, paymentsDetail } from "@/api/modules/InternalPage.js";
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
      dialogVisibleAdd: false,
      devicegroupsList: [],
      form: {
        name: "",
        terminalKey: "",
        terminalSn: "",
        terminalMac: "",
        location: "",
        deviceGroupId: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalKey: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalSn: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalMac: [{ required: true, message: "必填项", trigger: "blur" }]
      },
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
      paymentsList(params).then(res => {
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

    editRow(row) {
      this.dialogVisibleAdd = true;
      paymentsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
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
