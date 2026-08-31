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
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
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
      isloading: false,
      form: {
        tenantId: "",
        merchantId: "",
        merchantSecret: "",
        remark: "",
        certFile: "",
        keyFile: ""
      },
      linkRules: {
        merchantId: [{ required: true, message: "请输入微信商户号", trigger: "blur" }],
        merchantSecret: [{ required: true, message: "请输入微信商户密钥", trigger: "blur" }]
      }
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
    },
    // 租户ID：优先取平台管理员「进入的租户」，回退到用户自身租户
    tenantId() {
      return useUserStore().currentTenant?.tenantId || this.userInfo.tenantId;
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    fetchTenantList() {
      if (this.isloading) return;
      this.isloading = true;
      wechatConfig({ tenantId: this.tenantId }).then(res => {
        if (res.code == 0 && res.data) {
          this.form = res.data;
        }
        this.isloading = false;
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
      fb.append("remark", this.form.remark);
      let url = this.wechatputConfig + "/" + this.tenantId;
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
