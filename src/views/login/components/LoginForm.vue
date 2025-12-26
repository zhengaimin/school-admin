<script setup lang="ts">
import type { ElForm } from "element-plus";
import { Login } from "@/api/interface";

import { ref, reactive, onMounted } from "vue";
// import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import JSEncrypt from "jsencrypt";

// api
import { getCaptchaApi, get_rsa_public_key, loginApi } from "@/api/modules/login";
// utils
import { getTimeState } from "@/utils";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { useRouter } from "vue-router";

// constants

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
  captcha: "",
  captchaId: "",
  remberPw: false
});
const captchaImgPath = ref("");

const RSA_PUBLIC_KEY = ref("");

//获取秘匙
const getKey = async () => {
  const { data } = await get_rsa_public_key();
  RSA_PUBLIC_KEY.value = data["publicKey"];
};
getKey();
// rsa 加密
const rsaEncrypt = (value: string, pubKey = RSA_PUBLIC_KEY.value): string => {
  const encryptor = new JSEncrypt(); // 创建加密对象实例
  //之前ssl生成的公钥，复制的时候要小心不要有空格
  encryptor.setPublicKey(pubKey); //设置公钥
  // 对内容进行加密
  return encryptor.encrypt(value) || "";
};

/** 获取验证码 */
const ajaxGetCaptcha = async () => {
  const { data } = await getCaptchaApi();
  if (data?.id) {
    loginForm.captchaId = data.id;
    captchaImgPath.value = data?.base64Blob;
  }
};
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      const ajaxLogin = loginApi({ ...loginForm, password: rsaEncrypt(loginForm.password) });
      ajaxLogin.catch(error => {
        if (error?.code !== 0) {
          loginForm.captcha = "";
          ajaxGetCaptcha();
        }
      });

      const { data, code } = await ajaxLogin;
      if (code !== 0) {
        loginForm.captcha = "";
        ajaxGetCaptcha();
        return;
      }
      data["userInfo"]["role_key"] = data["userInfo"]["roleCode"];
      data["userInfo"]["role_name"] = data["userInfo"]["roleName"];
      data["login_user_info"] = data["userInfo"];
      let login_user_info = data["login_user_info"];
      if (login_user_info.role_key != "agent_admin") {
        loginForm.captcha = "";
        ajaxGetCaptcha();
        ElNotification({
          title: getTimeState(),
          message: "该账号没有权限登录",
          type: "error",
          duration: 3000
        });
        return;
      }
      userStore.setToken(data.token);
      userStore.setUserInfo(data["login_user_info"]);
      // 2.添加动态路由
      await initDynamicRouter();
      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);
      // 4.跳转到首页
      // 记住账号及密码
      if (loginForm.remberPw) {
        localStorage.setItem("loginForm", JSON.stringify(loginForm));
      } else {
        localStorage.removeItem("loginForm");
      }

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

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };

  const formStr = localStorage.getItem("loginForm");
  let form = formStr ? JSON.parse(formStr) : null;
  if (form && form["remberPw"]) {
    loginForm["username"] = form.username;
    loginForm["password"] = form.password;
    loginForm["remberPw"] = form.remberPw;
  }

  ajaxGetCaptcha();
  // 2.清除 Token
  userStore.setToken("");
  userStore.setUserInfo({ name: "" });
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
    <el-form-item prop="username" style="margin-bottom: 10px">
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
        <div class="captcha" @click="ajaxGetCaptcha">
          <el-image :src="captchaImgPath" style="height: 40px" />
        </div>
      </el-col>
    </el-form-item>
    <div class="remember-password">
      <el-checkbox v-model="loginForm.remberPw" label="记住账号及密码" style="font-size: 12px !important" />
    </div>
  </el-form>
  <div class="login-btn">
    <el-button size="large" style="width: 100%" type="primary" :loading="loading" @click="login(loginFormRef)"> 登录 </el-button>
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
