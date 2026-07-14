<script setup lang="ts">
import type { TPasswordForm } from "../types";

import {
  CONFIRM_PASSWORD_PLACEHOLDER,
  NEW_PASSWORD_PLACEHOLDER,
  OLD_PASSWORD_PLACEHOLDER,
  PASSWORD_FORM_GUTTER
} from "../constants";

const form = defineModel<TPasswordForm>({ required: true });
</script>

<template>
  <el-row :gutter="PASSWORD_FORM_GUTTER">
    <el-col :span="12">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" show-password :placeholder="OLD_PASSWORD_PLACEHOLDER" />
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="PASSWORD_FORM_GUTTER">
    <el-col :span="12">
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" show-password :placeholder="NEW_PASSWORD_PLACEHOLDER" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          show-password
          :placeholder="CONFIRM_PASSWORD_PLACEHOLDER"
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>
