<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="600px" draggable>
    <el-form ref="changePw" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="旧密码" prop="old_password">
        <el-input show-password v-model="form.old_password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input
          placeholder="大写字母，小写字母，0-9 ，特殊符号支持.@#$!"
          show-password
          v-model="form.new_password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          placeholder="大写字母，小写字母，0-9 ，特殊符号支持.@#$!"
          show-password
          v-model="form.confirmPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import JSEncrypt from "jsencrypt";
import { userUpdate } from "@/api/modules/user.js";
import { get_rsa_public_key } from "@/api/modules/login";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        old_password: "",
        new_password: "",
        confirmPassword: ""
      },
      rules: {
        old_password: [{ required: true, message: "请输入旧密码" }],
        new_password: [{ required: true, message: "请输入新密码" }],
        confirmPassword: [{ required: true, message: "请确认密码" }]
      },
      RSA_PUBLIC_KEY: ""
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.form = {
        old_password: "",
        new_password: "",
        confirmPassword: ""
      };
      this.getKey();
    },
    async getKey() {
      const { data } = await get_rsa_public_key();
      this.RSA_PUBLIC_KEY = data["public_key"];
    },
    rsaEncrypt(value, pubKey = this.RSA_PUBLIC_KEY) {
      const encryptor = new JSEncrypt(); // 创建加密对象实例
      encryptor.setPublicKey(pubKey); //设置公钥
      return encryptor.encrypt(value) || "";
    },
    confirm() {
      this.$refs.changePw.validate(valid => {
        if (valid) {
          if (this.form.new_password !== this.form.confirmPassword) {
            this.$message.error("两次输入的新密码不一致");
            return;
          }
          let params = {
            old_password: this.rsaEncrypt(this.form.old_password),
            new_password: this.rsaEncrypt(this.form.new_password)
          };
          userUpdate(params).then(res => {
            if (res.code == 0) {
              this.$message.success("修改成功");
              this.dialogVisible = false;
            }
          });
        }
      });
    }
  }
};
</script>

<!-- <script setup lang="ts">
import { ref } from "vue";

const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script> -->
