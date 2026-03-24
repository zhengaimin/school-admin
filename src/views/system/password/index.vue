<script setup lang="ts" name="systemPassword">
import type { FormInstance, FormRules } from "element-plus";
import type { System } from "@/api/interface";
import type { TPasswordForm } from "./types";

import { ref } from "vue";
import { ElMessage } from "element-plus";
import { postChangeUserPasswordApi } from "@/api/modules";
import { usePublicKey } from "@/hooks/usePublicKey";
import PasswordFormFields from "./components/PasswordFormFields.vue";
import { createPasswordFormData, createPasswordFormRules, resetPasswordForm } from "./utils";

const { publicKey, rsaEncrypt } = usePublicKey();

/** 表单实例 */
const formRef = ref<FormInstance>();
/** 保存提交状态 */
const submitting = ref(false);
/** 表单数据 */
const form = ref<TPasswordForm>(createPasswordFormData());
/** 表单校验规则 */
const formRules: FormRules = createPasswordFormRules(() => form.value.newPassword);

/**
 * 修改密码。
 * @param params 修改密码请求参数
 * @returns 接口返回消息
 */
async function axiosPostChangeUserPasswordApi(params: System.ReqUserChangePassword) {
  try {
    const result = await postChangeUserPasswordApi(params);
    return result.code === 0 ? result.data?.message || "修改成功" : "";
  } catch (error) {
    console.error("axiosPostChangeUserPasswordApi:", error);
    throw error;
  }
}

/**
 * 处理表单重置。
 * @returns 无返回值
 */
function handleReset() {
  resetPasswordForm(form.value);
  formRef.value?.clearValidate();
}

/**
 * 处理表单提交。
 * @returns 无返回值
 */
async function handleSubmit() {
  if (submitting.value) return;
  const formEl = formRef.value;
  if (!formEl) return;

  const isValid = await formEl.validate().catch(() => false);
  if (!isValid) return;

  if (form.value.newPassword === form.value.oldPassword) {
    ElMessage.warning("新密码不能与旧密码一致");
    return;
  }

  if (!publicKey.value) {
    ElMessage.error("公钥获取失败，请刷新重试");
    return;
  }

  const encryptedOldPassword = rsaEncrypt(form.value.oldPassword);
  const encryptedNewPassword = rsaEncrypt(form.value.newPassword);

  if (!encryptedOldPassword || !encryptedNewPassword) {
    ElMessage.error("密码加密失败，请重试");
    return;
  }

  submitting.value = true;
  try {
    const message = await axiosPostChangeUserPasswordApi({
      oldPassword: encryptedOldPassword,
      newPassword: encryptedNewPassword
    });
    if (!message) return;
    ElMessage.success(message);
    handleReset();
  } catch (error) {
    const errorMessage =
      (error as { msg?: string; message?: string })?.msg || (error as { message?: string })?.message || "修改失败，请重试";
    ElMessage.error(errorMessage);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden">
    <el-card shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>修改密码</span>
        </div>
      </template>

      <div class="flex-1 overflow-y-auto p-4">
        <el-form ref="formRef" :model="form" :rules="formRules" label-position="top">
          <PasswordFormFields v-model="form" />
        </el-form>
      </div>

      <div class="px-4 pb-4">
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-card__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
