<script setup lang="ts" name="systemProfile">
import type { FormInstance, FormRules } from "element-plus";
import type { System } from "@/api/interface";
import type { TProfileForm, TUserInfo } from "./types";

import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getUserProfileApi, putUpdateUserProfileApi } from "@/api/modules";
import UploadImg from "@/components/Upload/Img.vue";
import { useUserStore } from "@/stores/modules/user";

/** 表单校验规则 */
const formRules: FormRules = {
  realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }]
};

const userStore = useUserStore();

/** 表单实例 */
const formRef = ref<FormInstance>();
/** 页面加载状态 */
const loading = ref(false);
/** 保存提交状态 */
const submitting = ref(false);
/** 是否已获取数据 */
const hasData = ref(false);
/** 用户个人信息 */
const profile = ref<System.UserProfile | null>(null);
/** 表单数据 */
const form = ref<TProfileForm>({
  realName: "",
  phone: "",
  email: "",
  avatar: ""
});

/** 当前登录用户信息 */
const userInfo = computed<TUserInfo>(() => userStore.userInfo as TUserInfo);
/** 展示用户名 */
const displayUsername = computed(() => {
  return profile.value?.username ?? userInfo.value.username ?? userInfo.value.userName ?? userInfo.value.name ?? "-";
});
/** 展示角色类型 */
const displayRoleType = computed(() => {
  return profile.value?.roleName ?? userInfo.value.roleName ?? "-";
});

/** 填充表单数据 */
const fillForm = (data?: Partial<System.UserProfile> | null) => {
  form.value.realName = data?.realName ?? userInfo.value.realName ?? userInfo.value.name ?? "";
  form.value.phone = data?.phone ?? userInfo.value.phone ?? "";
  form.value.email = data?.email ?? userInfo.value.email ?? "";
  form.value.avatar = data?.avatar ?? userInfo.value.avatar ?? "";
};
/** 应用个人信息数据 */
const applyProfile = (data?: System.UserProfile | null) => {
  profile.value = data ?? null;
  fillForm(data ?? null);
};

/** 获取个人信息 */
const axiosGetUserProfileApi = async () => {
  loading.value = true;
  try {
    const result = await getUserProfileApi({ loading: false });
    if (result.code === 0 && result.data) {
      applyProfile(result.data);
    } else {
      applyProfile(null);
    }
  } catch (error) {
    console.error("axiosGetUserProfileApi:", error);
    applyProfile(null);
  } finally {
    loading.value = false;
    hasData.value = true;
  }
};
/** 更新个人信息 */
const axiosPutUpdateUserProfileApi = async (params: System.ReqUserProfileUpdate) => {
  try {
    const result = await putUpdateUserProfileApi(params, { loading: false });
    return result.code === 0;
  } catch (error) {
    console.error("axiosPutUpdateUserProfileApi:", error);
    throw error;
  }
};

/** 处理表单重置 */
const handleReset = () => {
  fillForm(profile.value);
  formRef.value?.clearValidate();
};
/** 处理表单提交 */
const handleSubmit = async () => {
  if (submitting.value) return;
  const formEl = formRef.value;
  if (!formEl) return;

  const isValid = await formEl.validate().catch(() => false);
  if (!isValid) return;

  submitting.value = true;
  try {
    const isUpdated = await axiosPutUpdateUserProfileApi({
      realName: form.value.realName,
      phone: form.value.phone,
      email: form.value.email,
      avatar: form.value.avatar
    });
    if (!isUpdated) return;

    const updatedProfile = {
      ...(profile.value || {}),
      realName: form.value.realName,
      phone: form.value.phone,
      email: form.value.email,
      avatar: form.value.avatar
    } as System.UserProfile;

    profile.value = updatedProfile;
    userStore.setUserInfo({
      ...userStore.userInfo,
      realName: form.value.realName,
      phone: form.value.phone,
      email: form.value.email,
      avatar: form.value.avatar,
      name: form.value.realName
    });

    ElMessage.success("保存成功");
  } catch (error) {
    const message =
      (error as { msg?: string; message?: string })?.msg || (error as { message?: string })?.message || "保存失败，请重试";
    ElMessage.error(message);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  axiosGetUserProfileApi();
});
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden">
    <el-card v-loading="loading" shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>个人信息</span>
        </div>
      </template>

      <template v-if="hasData">
        <div class="flex-1 overflow-y-auto p-4">
          <el-form ref="formRef" :model="form" :rules="formRules" label-position="top">
            <el-divider content-position="left">基础信息</el-divider>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="用户名">
                  <el-input :model-value="displayUsername" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色类型">
                  <el-input :model-value="displayRoleType" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">可编辑信息</el-divider>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="真实姓名" prop="realName">
                  <el-input v-model="form.realName" placeholder="请输入真实姓名" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="头像" prop="avatar">
                  <div class="flex items-center gap-4">
                    <UploadImg v-model:image-url="form.avatar" width="120px" height="120px" />
                    <div class="text-xs text-gray-500 leading-5">
                      <div>支持 jpg/png/gif，大小不超过 5M</div>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="px-4 pb-4">
          <div class="flex justify-end pt-4 border-t border-gray-200">
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          </div>
        </div>
      </template>

      <template v-else>
        <el-empty description="暂无数据" />
      </template>
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
