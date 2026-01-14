<script setup lang="ts" name="moduleSelect">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SwitchButton } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { getPermissionModulesApi } from "@/api/modules";
import { LOGIN_URL } from "@/config";
import type { ModuleItem } from "@/stores/interface";
import { version } from "../../../package.json";

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
      <div class="flex items-center justify-between w-full h-16 px-8 max-w-[1200px]">
        <div class="flex items-center gap-4">
          <img class="w-10 h-10 logo-shadow" src="@/assets/images/logo.png" alt="校园管理平台" />
          <span class="text-[22px] font-bold navbar-title-color">校园管理平台</span>
        </div>
        <div class="flex items-center gap-6">
          <span class="text-[15px] font-medium user-info-color">{{ userName }}</span>
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
            <el-icon :size="36">
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  max-width: 700px;
}
.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  background: var(--el-bg-color);
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 8%) 0 2px 8px 1px;
  transition: all 0.3s ease;
}
.module-card:hover {
  box-shadow: rgb(0 0 0 / 12%) 0 4px 16px 2px;
  transform: translateY(-4px);
}
.module-card:hover .card-icon {
  background: var(--el-color-primary-light-3);
}
.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 14px;
  color: #ffffff;
  background: var(--el-color-primary);
  border-radius: 12px;
  transition: background 0.3s ease;
}
.version-text {
  margin-top: auto;
  padding: 16px 0;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
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
