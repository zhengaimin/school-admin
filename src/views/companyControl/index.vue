<template>
  <div class="table-box">
    <div style="padding: 20px 30px">
      <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <el-row>
          <el-col :span="7">
            <el-form-item label="微信商户号" prop="merchantId">
              <el-input v-model="form.merchantId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="微信商户密钥" prop="merchantSecret">
              <el-input v-model="form.merchantSecret" type="password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="微信应用ID" prop="appId">
              <el-input v-model="form.appId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="微信应用密钥" prop="appSecret">
              <el-input v-model="form.appSecret" type="password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="证书序列号" prop="serialNumber">
              <el-input v-model="form.serialNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="最小金额（1元）" prop="minAmount">
              <el-input-number style="width: 100%" v-model.number="form.minAmount" :min="1" :max="1000">
                <template #prefix>
                  <span>￥</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="最大金额(10000元)" prop="maxAmount">
              <el-input-number style="width: 100%" v-model.number="form.maxAmount" :precision="2" :min="1" :max="10000">
                <template #prefix>
                  <span>￥</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="API证书文件(.pem格式)">
              <input type="file" id="uploadFile" accept=".pem" />
              <span>已上传文件：{{ form.certFileName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="API密钥文件（.pem格式）">
              <input type="file" id="uploadFile1" accept=".pem" />
              <span>已上传文件：{{ form.keyFileName }}</span>
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
import axios from "axios";
import { wechatConfig } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      form: {
        tenantId: "",
        merchantId: "",
        merchantSecret: "",
        appId: "",
        appSecret: "",
        serialNumber: "",
        remark: "",
        certFile: "",
        keyFile: "",
        minAmount: 1,
        maxAmount: 5000
      },
      linkRules: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    wechatputConfig() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/wechat-merchant-configs/tenant`;
      } else {
        return `/admin/wechat-merchant-configs/tenant`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    fetchTenantList() {
      wechatConfig({ tenantId: this.userInfo.tenantId }).then(res => {
        if (res.code == 0 && res.data) {
          this.form = res.data;
        }
      });
    },
    beforeAvatarUpload() {
      return true;
    },
    clearFile() {
      this.$refs.uploadFile.clearFiles();
    },
    handleSuccess(res) {
      this.form.certFile = res.data.thumbnailUrl;
    },
    confirmAdd() {
      let fb = new FormData();
      let file = document.getElementById("uploadFile").files[0];
      let file1 = document.getElementById("uploadFile1").files[0];
      fb.append("certFile", file);
      fb.append("keyFile", file1);
      fb.append("merchantId", this.form.merchantId);
      fb.append("merchantSecret", this.form.merchantSecret);
      fb.append("appId", this.form.appId);
      fb.append("appSecret", this.form.appSecret);
      fb.append("serialNumber", this.form.serialNumber);
      fb.append("remark", this.form.remark);
      fb.append("minAmount", Number(this.form.minAmount));
      fb.append("maxAmount", Number(this.form.maxAmount));

      let url = this.wechatputConfig + "/" + this.userInfo.tenantId;
      axios
        .put(url, fb, {
          headers: {
            "Content-Type": "application/form-data",
            Authorization: this.token
          }
        })
        .then(res => {
          if (res.data.code == 0) {
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
