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

<script setup lang="ts" name="moduleSelect">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { SwitchButton } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { LOGIN_URL } from "@/config";
import type { ModuleItem } from "@/stores/interface";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const moduleList = computed(() => authStore.moduleListGet);
const userName = computed(() => userStore.userInfo.name || "管理员");

const moduleDescMap: Record<string, string> = {
  common: "校园管理、小程序配置、支付配置、通知配置等",
  phone: "话机设备管理、资金管理、套餐配置、日志管理等",
  hairdryer: "吹风机设备管理、资金管理、日志管理等"
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
</script>

<style scoped lang="scss">
.module-select-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #eeeeee;
  background-image: url("@/assets/images/common/bg.svg");
  background-size: cover;
}
.navbar {
  background: var(--el-bg-color);
  box-shadow: rgb(0 0 0 / 8%) 0 2px 8px 1px;
}
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  height: 60px;
  padding: 0 20px;
  margin: 0 auto;
}
.navbar-left {
  display: flex;
  gap: 12px;
  align-items: center;
  .logo {
    width: 36px;
    height: 36px;
  }
  .navbar-title {
    font-size: 18px;
    font-weight: 600;
    color: #34495e;
  }
}
.navbar-right {
  display: flex;
  gap: 16px;
  align-items: center;
  .user-info {
    font-size: 14px;
    color: #8894b3;
  }
  :deep(.el-button) {
    color: var(--el-color-primary);
    &:hover {
      color: var(--el-color-primary-light-3);
    }
  }
}
.main-content {
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  margin: 0 auto;
  .subtitle {
    margin: 0 0 24px;
    font-size: 16px;
    color: #8894b3;
  }
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
  &:hover {
    box-shadow: rgb(0 0 0 / 12%) 0 4px 16px 2px;
    transform: translateY(-4px);
    .card-icon {
      background: var(--el-color-primary-light-3);
    }
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
  .card-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #34495e;
  }
  .card-desc {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #8894b3;
  }
}

@media screen and (width <= 600px) {
  .module-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .navbar-title {
    display: none;
  }
}
</style>
