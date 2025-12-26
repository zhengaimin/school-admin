<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

const router = useRouter();
const authStore = useAuthStore();

const moduleList = computed(() => authStore.moduleListGet);
const currentModule = computed(() => authStore.currentModuleGet);

const handleModuleChange = (moduleKey: string) => {
  if (moduleKey === currentModule.value) return;
  authStore.setCurrentModule(moduleKey);
  // 切换模块后跳转到该模块的第一个菜单
  const menus = authStore.authMenuListGet;
  if (menus.length > 0) {
    const firstMenu = menus[0];
    if (firstMenu.children && firstMenu.children.length > 0) {
      router.push(firstMenu.children[0].path);
    } else {
      router.push(firstMenu.path);
    }
  }
};
</script>

<template>
  <div class="module-switch">
    <div
      v-for="item in moduleList"
      :key="item.key"
      class="module-item"
      :class="{ active: currentModule === item.key }"
      @click="handleModuleChange(item.key)"
    >
      <el-icon :size="16">
        <component :is="item.icon" />
      </el-icon>
      <span class="module-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.module-switch {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 20px;
  .module-item {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 6px 14px;
    font-size: 14px;
    color: var(--el-header-text-color);
    cursor: pointer;
    background-color: transparent;
    border-radius: 6px;
    transition: all 0.3s ease;
    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
    &.active {
      color: #ffffff;
      background-color: var(--el-color-primary);
    }
    .module-label {
      white-space: nowrap;
    }
  }
}
</style>
