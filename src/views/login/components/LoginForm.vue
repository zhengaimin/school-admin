<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { Login } from "@/api/interface";
import type { LoginForm } from "../types";

import { onMounted, onUnmounted, reactive, ref, unref } from "vue";
import { getCaptchaApi, loginApi } from "@/api/modules/login";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { usePublicKey } from "@/hooks/usePublicKey";
import { useRouter } from "vue-router";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { usePermissionStore } from "@/stores/modules/permission";
import { useTabsStore } from "@/stores/modules/tabs";
import { useUserStore } from "@/stores/modules/user";

const LOGIN_FORM_STORAGE_KEY = "loginForm";

const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const { publicKey, rsaEncrypt } = usePublicKey();

/** 表单实例 */
const loginFormRef = ref<FormInstance>();
/** 登录加载状态 */
const loading = ref(false);
/** 登录表单 */
const loginForm = reactive<LoginForm>({
  username: "",
  password: "",
  captcha: "",
  captchaId: "",
  rememberPassword: false
});
/** 表单校验规则 */
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});
/** 验证码图片 */
const captchaImgPath = ref("");

/** 解析本地缓存表单 */
const parseStoredLoginForm = () => {
  const raw = localStorage.getItem(LOGIN_FORM_STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<LoginForm> & { remberPw?: boolean };
    return {
      username: data.username ?? "",
      password: data.password ?? "",
      rememberPassword: Boolean(data.rememberPassword ?? data.remberPw)
    };
  } catch (error) {
    console.error("parseStoredLoginForm:", error);
    return null;
  }
};
/** 应用本地缓存的登录信息 */
const applyStoredLoginForm = () => {
  const storedForm = parseStoredLoginForm();
  if (!storedForm?.rememberPassword) return;
  loginForm.username = storedForm.username ?? "";
  loginForm.password = storedForm.password ?? "";
  loginForm.rememberPassword = true;
};
/** 同步本地缓存 */
const syncLoginFormStorage = () => {
  if (loginForm.rememberPassword) {
    localStorage.setItem(
      LOGIN_FORM_STORAGE_KEY,
      JSON.stringify({
        username: loginForm.username,
        password: loginForm.password,
        rememberPassword: true
      })
    );
    return;
  }
  localStorage.removeItem(LOGIN_FORM_STORAGE_KEY);
};
/** 构建登录参数 */
const buildLoginPayload = (): Login.ReqLoginForm => ({
  username: loginForm.username,
  password: loginForm.password,
  captcha: loginForm.captcha,
  captchaId: loginForm.captchaId
});
/** 重置验证码 */
const resetCaptcha = async () => {
  loginForm.captcha = "";
  await axiosGetCaptchaApi();
};

/** 获取验证码 */
const axiosGetCaptchaApi = async () => {
  try {
    const result = await getCaptchaApi();
    if (result?.data?.id) {
      loginForm.captchaId = result.data.id;
      captchaImgPath.value = result.data.base64Blob;
    }
  } catch (error) {
    console.error("axiosGetCaptchaApi:", error);
  }
};
/** 登录接口 */
const axiosLoginApi = async (params: Login.ReqLoginForm) => {
  try {
    return await loginApi(params);
  } catch (error) {
    console.error("axiosLoginApi:", error);
    return null;
  }
};
/** 处理验证码点击 */
const handleCaptchaClick = () => {
  axiosGetCaptchaApi();
};
/** 处理登录 */
const handleLogin = () => {
  const formRef = unref(loginFormRef);
  if (!formRef) return;

  formRef.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      const payload = buildLoginPayload();
      if (!unref(publicKey)) {
        ElNotification({
          title: "提示",
          message: "公钥未加载，请稍后重试",
          type: "warning",
          duration: 3000
        });
        return;
      }
      const encryptedPassword = rsaEncrypt(payload.password);
      if (!encryptedPassword) {
        ElNotification({
          title: "提示",
          message: "密码加密失败，请稍后重试",
          type: "warning",
          duration: 3000
        });
        return;
      }

      const result = await axiosLoginApi({
        ...payload,
        password: encryptedPassword
      });
      if (!result || result.code !== 0) {
        await resetCaptcha();
        return;
      }

      const { data } = result;
      userStore.setToken(data.token);
      userStore.setUserInfo(data.userInfo);
      // 新登录清除上次残留的当前租户态，避免平台运营方登录后被误判为"已进入租户"（moduleSelect 不显套餐管理等平台入口）
      userStore.setCurrentTenant(null);

      await initDynamicRouter();
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      syncLoginFormStorage();

      setTimeout(() => {
        router.push("/moduleSelect");
      }, 1000);

      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 校园管理平台",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};
/** 处理回车登录 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === "Enter" || event.code === "enter" || event.code === "NumpadEnter") {
    if (unref(loading)) return;
    handleLogin();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  applyStoredLoginForm();
  axiosGetCaptchaApi();
  userStore.setToken("");
  userStore.setUserInfo({ name: "" });
  permissionStore.resetModulePermissions();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <!-- 用户名 -->
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="captcha" style="margin-bottom: 10px">
      <el-col :span="16">
        <el-input v-model="loginForm.captcha" placeholder="请输入验证码">
          <template #prefix>
            <el-icon class="el-input__icon">
              <key />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <div class="captcha" @click="handleCaptchaClick">
          <el-image :src="captchaImgPath" style="height: 40px" />
        </div>
      </el-col>
    </el-form-item>
    <div class="remember-password">
      <el-checkbox v-model="loginForm.rememberPassword" label="记住账号及密码" style="font-size: 12px !important" />
    </div>
  </el-form>
  <div class="login-btn">
    <el-button size="large" style="width: 100%" type="primary" :loading="loading" @click="handleLogin"> 登录 </el-button>
  </div>
  <div class="private-tip"></div>
</template>

<style scoped lang="scss">
@import "../index";
.captcha {
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
