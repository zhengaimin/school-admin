<script setup lang="ts" name="moduleSelect">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SwitchButton } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { getPermissionModulesApi } from "@/api/modules";
import { LOGIN_URL } from "@/config";
import type { ModuleItem } from "@/stores/interface";
// import { version } from "../../../package.json";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const availableModules = ref<ModuleItem[]>([]);

// 权限模块到业务模块的映射
const permissionToModuleMap: Record<string, string> = {
  device: "video",
  fund: "video",
  video: "video",
  hairdryer: "hairdryer",
  role: "system",
  adminuser: "system",
  system: "system"
};

const moduleList = computed(() => {
  // super_admin 显示所有模块
  if (userStore.userInfo?.role_key === "super_admin") {
    return authStore.moduleListGet;
  }
  return availableModules.value;
});

/** 获取用户有权限的模块 */
const axiosGetPermissionModulesApi = async (): Promise<void> => {
  try {
    const result = await getPermissionModulesApi();

    if (result.code === 0) {
      const allModules = authStore.moduleListGet;
      const hasModules = new Set<string>();

      result.data.modules.forEach(permModule => {
        const businessModule = permissionToModuleMap[permModule.moduleKey];
        if (businessModule) {
          hasModules.add(businessModule);
        }
      });

      availableModules.value = allModules.filter(module => hasModules.has(module.key));
    }
  } catch (error) {
    console.error("axiosGetPermissionModulesApi:", error);
    availableModules.value = [];
  }
};
const userName = computed(() => userStore.userInfo.name || "管理员");

const moduleDescMap: Record<string, string> = {
  common: "校园管理、小程序配置、支付配置、通知配置等",
  video: "话机设备管理、资金管理、套餐配置、日志管理等",
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

onMounted(() => {
  axiosGetPermissionModulesApi();
});
</script>

<template>
  <div class="module-select-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <img class="logo" src="@/assets/images/logo.png" alt="logo" />
          <span class="navbar-title">校园管理平台</span>
        </div>
        <div class="navbar-right">
          <span class="user-info">{{ userName }}</span>
          <el-button type="primary" link @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <p class="subtitle">请选择要进入的业务模块</p>
      <div class="module-cards">
        <div v-for="item in moduleList" :key="item.key" class="module-card" @click="handleModuleClick(item)">
          <div class="card-icon">
            <el-icon :size="36">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <h2 class="card-title">{{ item.label }}</h2>
          <p class="card-desc">{{ getModuleDesc(item.key) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.module-select-page {
  background-image: url("@/assets/images/common/bg.svg");
}
.navbar-button {
  padding: 8px 12px !important;
  font-size: 14px !important;
  color: var(--el-text-color-secondary) !important;
  transition: all 0.3s !important;
  &:hover {
    color: var(--el-color-primary) !important;
    background-color: var(--el-color-primary-light-9) !important;
    border-radius: 4px !important;
  }
  &:focus-visible {
    color: var(--el-color-primary) !important;
    background-color: var(--el-color-primary-light-9) !important;
    border-radius: 4px !important;
    outline: 2px solid var(--el-color-primary) !important;
    outline-offset: 2px !important;
  }
}
.module-card {
  transition:
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  &:hover {
    transform: translateY(-8px);
  }
}
</style>
