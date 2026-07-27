<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
      <div>
        <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
export default {
  computed: {
    router() {
      return useRouter();
    },
    userStore() {
      return useUserStore();
    }
  },
  created() {
    this.toLogin();
  },
  methods: {
    toLogin() {
      this.userStore.setToken("");
      this.userStore.setUserInfo({ name: "" });
      this.router.replace("/login");
    }
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
