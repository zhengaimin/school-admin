<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img :src="avatarSrc" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="roleType" disabled>
          <el-icon><UserFilled /></el-icon>{{ roleType }}
        </el-dropdown-item>
        <el-dropdown-item @click="goToProfile">
          <el-icon><User /></el-icon>个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="goToChangePassword">
          <el-icon><Edit /></el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon><Memo /></el-icon>版本号：v{{ version }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="setLogo" v-if="false && userInfo['is_admin']">
          <el-icon><Setting /></el-icon>系统设置
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { ROUTE_SYSTEM } from "@/config/router";
// import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage } from "element-plus";
import { computed } from "vue";
import defaultAvatar from "@/assets/images/avatar1.jpeg";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import { ROLE_LEVEL_I18N } from "@/config/modules";

const version = __APP_INFO__.pkg.version;

const router = useRouter();
const userStore = useUserStore();
const userInfo = userStore.userInfo;
const { getUploadPath } = useAssetsPath();
/** 当前用户角色类型 */
const roleType = computed(() => {
  const roleLevel = userStore.userInfo?.roleLevel;
  return roleLevel ? ROLE_LEVEL_I18N[roleLevel] : "";
});
/** 用户头像地址 */
const avatarSrc = computed(() => {
  const avatar = userStore.userInfo?.avatar;
  if (!avatar) return defaultAvatar;
  const resolved = getUploadPath(avatar);
  return resolved || defaultAvatar;
});

// 退出登录
const logout = () => {
  ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    // 1.执行退出登录接口
    // await logoutApi();

    // 2.清除 Token
    userStore.setToken("");
    userStore.setUserInfo({ name: "" });

    // 3.重定向到登陆页
    router.replace(LOGIN_URL);
    ElMessage.success("退出登录成功！");
  });
};

const setLogo = () => {
  router.push("/systemSetting");
};

const goToProfile = () => {
  router.push(ROUTE_SYSTEM.PROFILE);
};

const goToChangePassword = () => {
  router.push(ROUTE_SYSTEM.CHANGE_PASSWORD);
};
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
