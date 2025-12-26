<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
// import AssemblySize from "./components/AssemblySize.vue";
import Language from "./components/Language.vue";
// import SearchMenu from "./components/SearchMenu.vue";
// import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import School from "./components/School.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";

const userStore = useUserStore();
const name = computed(() => userStore.userInfo.realName);
// const schoolList = [
//   { label: "洪山高中", id: "1" },
//   { label: "华师附中", id: "2" }
// ];
// const school = computed(() => "1");
</script>

<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- <AssemblySize id="assemblySize" /> -->
      <School id="school" ref="school" />
      <Language id="language" v-if="false" />
      <SwitchDark id="language" v-if="false" />
      <!-- <SearchMenu /> -->
      <!-- <ThemeSetting id="themeSetting" /> -->
      <Message id="message" v-if="false" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username" v-if="true">{{ name }}</span>
    <!-- <span class="username">管理员</span> -->
    <Avatar />
  </div>
</template>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
