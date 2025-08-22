<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" v-if="false" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/common/loginIcon.svg" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo" style="margin-right: 10px; margin-bottom: 30px; font-size: 23px">
          <!-- <img class="login-icon" src="@/assets/images/tzsklogo.png" alt="" /> -->
          <img style="height: 60px" src="@/assets/images/xinkao.png" alt="logo" />
          欢迎登录校园管理平台
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
// 获取路由的参数
export default {
  name: "Login",
  components: {
    LoginForm,
    SwitchDark
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
