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

// 获取用户有权限的模块
const fetchAvailableModules = async () => {
  try {
    const { data } = await getPermissionModulesApi();
    const allModules = authStore.moduleListGet;
    const hasModules = new Set<string>();

    // 根据权限模块映射到业务模块
    data.modules.forEach(permModule => {
      const businessModule = permissionToModuleMap[permModule.moduleKey];
      if (businessModule) {
        hasModules.add(businessModule);
      }
    });

    // 过滤出有权限的业务模块
    availableModules.value = allModules.filter(module => hasModules.has(module.key));
  } catch (error) {
    console.error("获取权限模块失败:", error);
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

const handleModuleClick = (module: ModuleItem) => {
  authStore.setCurrentModule(module.key);
  // 获取该模块的第一个菜单路径
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
  // 打开新页面
  window.open(router.resolve(targetPath).href, "_blank");
};

const handleLogout = () => {
  userStore.setToken("");
  router.replace(LOGIN_URL);
};

onMounted(() => {
  fetchAvailableModules();
});
</script>

<template>
  <div class="module-select-page flex flex-col min-h-100vh bg-[#eeeeee] bg-cover">
    <!-- 顶部导航栏 -->
    <div
      class="sticky top-0 z-1000 bg-[var(--el-bg-color)] border-b border-[var(--el-border-color-light)] shadow-[0_1px_4px_rgb(0_21_41_/_4%)]"
    >
      <div class="flex items-center justify-between w-full h-16 px-8 max-w-[1200px]">
        <div class="flex items-center gap-4">
          <img class="w-10 h-10 drop-shadow-[0_2px_4px_rgb(0_0_0_/_5%)]" src="@/assets/images/logo.png" alt="校园管理平台" />
          <span class="text-[22px] font-bold text-[var(--el-text-color-primary)] max-w-600px:hidden">校园管理平台</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[15px] font-medium text-[var(--el-text-color-regular)]">{{ userName }}</span>
          <el-button class="navbar-button" type="primary" link @click="handleLogout">
            <el-icon class="mr-1.5"><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex flex-1 flex-col items-start justify-start w-full max-w-[1232px] p-4">
      <p class="mb-4 mt-0 text-24px font-500 text-[var(--el-text-color-regular)] tracking-[1px]">请选择要进入的业务模块</p>
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 justify-center w-full max-w-[1000px] max-w-600px:grid-cols-2"
      >
        <div
          v-for="item in moduleList"
          :key="item.key"
          class="module-card group relative flex flex-col items-center px-8 py-10 text-center cursor-pointer bg-[var(--el-bg-color)] border border-[var(--el-border-color-lighter)] rounded-[20px] shadow-[0_4px_20px_-4px_rgb(0_0_0_/_5%)] hover:z-1 hover:border-[var(--el-color-primary-light-7)] hover:shadow-[0_16px_40px_-12px_rgb(0_0_0_/_10%)]"
          @click="handleModuleClick(item)"
        >
          <div
            class="flex items-center justify-center w-[72px] h-[72px] mb-6 text-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)] rounded-[20px] transition-all duration-400 group-hover:text-white group-hover:bg-[var(--el-color-primary)] group-hover:shadow-[0_8px_16px_-4px_var(--el-color-primary-light-5)] group-hover:scale-110 group-hover:rotate-5"
          >
            <el-icon :size="36">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <h2
            class="mb-3 text-20px font-600 text-[var(--el-text-color-primary)] transition-colors duration-300 group-hover:text-[var(--el-color-primary)]"
          >
            {{ item.label }}
          </h2>
          <p class="text-14px leading-[1.6] text-[var(--el-text-color-secondary)] line-clamp-2">{{ getModuleDesc(item.key) }}</p>
        </div>
      </div>
    </div>

    <!-- 底部版本号 -->
    <div class="py-4 text-center text-12px text-[var(--el-text-color-placeholder)]">v{{ version }}</div>
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
