<template>
  <div class="table-box">
    <div style="padding: 20px 30px">
      <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <el-row>
          <el-col :span="15">
            <el-form-item label="充值金额配置（单位：元）" prop="fixedAmounts">
              <el-input type="textarea" v-model="form.fixedAmounts"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 10px; font-size: 12px; color: red">提示：金额用“,”分隔，例如：10,20,50,100,200</div>
        <el-row>
          <el-col :span="7">
            <el-form-item label="最小金额（元）" prop="minAmount">
              <el-input-number style="width: 100%" :step="1" v-model.number="form.minAmount" :min="1">
                <template #prefix>
                  <span>￥</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="最大金额（元）" prop="maxAmount">
              <el-input-number style="width: 100%" :step="1" v-model.number="form.maxAmount" :min="1">
                <template #prefix>
                  <span>￥</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" maxlength="500" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 10px; text-align: left">
            <el-button type="primary" @click="confirmAdd">提交</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { paymentconfigstenant, paymentconfigsadd } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      form: {
        tenantId: "",
        fixedAmounts: [],
        minAmount: "",
        maxAmount: "",
        remark: ""
      },
      linkRules: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    fetchTenantList() {
      paymentconfigstenant({ tenantId: this.userInfo.tenantId }).then(res => {
        if (res.code == 0 && res.data) {
          this.form = res.data;
        }
      });
    },
    confirmAdd() {
      this.form.tenantId = this.userInfo.tenantId;
      paymentconfigsadd(this.form).then(res => {
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.fetchTenantList();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
