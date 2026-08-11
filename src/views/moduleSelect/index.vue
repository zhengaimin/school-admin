<script setup lang="ts" name="moduleSelect">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { SwitchButton } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { isAgentRoleLevel, isCustomRoleLevel, isSuperRoleLevel, ROLE_LEVEL_I18N } from "@/config/modules";
import { LOGIN_URL } from "@/config";
import type { ModuleItem } from "@/stores/interface";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const version = __APP_INFO__.pkg.version;
const PERMISSION_MODULE_KEY = "system";

const moduleList = computed(() => {
  const roleLevel = userStore.userInfo?.roleLevel;
  // 超级级别账号仅显示权限模块
  if (isSuperRoleLevel(roleLevel)) {
    return authStore.moduleListGet.filter(module => module.key === PERMISSION_MODULE_KEY);
  }
  // 代理商和业务员不显示权限模块
  if (isAgentRoleLevel(roleLevel) || isCustomRoleLevel(roleLevel)) {
    return authStore.moduleListGet.filter(module => module.key !== PERMISSION_MODULE_KEY);
  }
  return authStore.moduleListGet;
});
const userName = computed(
  () => userStore.userInfo?.realName || userStore.userInfo?.name || userStore.userInfo?.username || "管理员"
);
/** 当前用户角色类型 */
const roleType = computed(() => {
  const roleLevel = userStore.userInfo?.roleLevel;
  return roleLevel ? ROLE_LEVEL_I18N[roleLevel] : "";
});

const moduleDescMap: Record<string, string> = {
  common: "校园管理、小程序配置、支付配置、通知配置等",
  video: "公话设备管理、资金管理、套餐配置、日志管理等",
  hairdryer: "吹风机设备管理、资金管理、日志管理等",
  system: "角色管理、用户管理、权限配置等"
};

const getModuleDesc = (key: string) => {
  return moduleDescMap[key] || "点击进入模块";
};

/** 处理模块点击事件 */
const handleModuleClick = (module: ModuleItem) => {
  authStore.setCurrentModule(module.key);
  const menus = authStore.authMenuListGet;
  let targetPath = "/";
  if (menus.length > 0) {
    const firstMenu = menus[0];
    if (firstMenu.children && firstMenu.children.length > 0) {
      const visibleChild = firstMenu.children.find(child => !child.meta.isHide);
      targetPath = visibleChild?.path || firstMenu.children[0].path;
    } else {
      targetPath = firstMenu.path;
    }
  }
  window.open(router.resolve(targetPath).href, "_blank");
};

/** 处理退出登录 */
const handleLogout = () => {
  userStore.setToken("");
  router.replace(LOGIN_URL);
};
</script>

<template>
  <div class="module-select-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="flex items-center justify-between w-full h-16 px-8 max-w-[1200px] mx-auto">
        <div class="flex items-center gap-4">
          <img class="w-10 h-10 logo-shadow" src="@/assets/images/logo.png" alt="校园管理平台" />
          <span class="text-[22px] font-bold navbar-title-color">校园管理平台</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[15px] font-medium user-info-color">{{ userName }}</span>
          <span v-if="roleType" class="text-sm user-role-color">（{{ roleType }}）</span>
          <el-button class="navbar-button" type="primary" link @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="w-full max-w-[1200px] py-10 px-5 mx-auto">
      <p class="m-0 mb-6 text-base text-[#8894b3]">请选择要进入的业务模块</p>
      <div class="module-cards">
        <div v-for="item in moduleList" :key="item.key" class="module-card" @click="handleModuleClick(item)">
          <div class="card-icon">
            <el-icon :size="30">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <h2 class="m-0 mb-2 text-base font-semibold text-[#34495e]">{{ item.label }}</h2>
          <p class="m-0 text-xs leading-[1.5] text-[#8894b3]">{{ getModuleDesc(item.key) }}</p>
        </div>
      </div>
    </div>
    <div class="version-text">v{{ version }}</div>
  </div>
</template>

<style scoped>
.module-select-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #eeeeee;
  background-image: url("@/assets/images/common/bg.svg");
  background-size: cover;
}
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--el-bg-color);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 4px rgb(0 21 41 / 4%);
}
.logo-shadow {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 5%));
}
.navbar-title-color {
  color: var(--el-text-color-primary);
}
.user-info-color {
  color: var(--el-text-color-regular);
}
.user-role-color {
  color: var(--el-text-color-secondary);
}
.navbar-button {
  padding: 8px 12px !important;
  font-size: 14px !important;
  color: var(--el-text-color-secondary) !important;
  transition: all 0.3s !important;
}
.navbar-button .el-icon {
  margin-right: 6px;
}
.navbar-button:hover {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9) !important;
  border-radius: 4px !important;
}
.navbar-button:focus-visible {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9) !important;
  border-radius: 4px !important;
  outline: 2px solid var(--el-color-primary) !important;
  outline-offset: 2px !important;
}
.module-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  max-width: 1000px;
}
.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid transparent;
  border-radius: 16px;
  box-shadow: 0 4px 20px -4px rgb(0 0 0 / 8%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.module-card:hover {
  border-color: var(--el-color-primary-light-8);
  box-shadow: 0 12px 32px -8px rgb(0 0 0 / 15%);
  transform: translateY(-8px);
}
.module-card:hover .card-icon {
  background: var(--el-color-primary);
  transform: scale(1.1) rotate(5deg);
}
.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  color: #ffffff;
  background: var(--el-color-primary);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.version-text {
  padding: 16px 0;
  margin-top: auto;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  text-align: center;
}

@media screen and (width <= 600px) {
  .module-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .navbar-title-color {
    display: none;
  }
}
</style>
