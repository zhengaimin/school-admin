<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { ROUTE_MODULE_SELECT } from "@/config/router";
import { Grid } from "@element-plus/icons-vue";
import School from "./components/School.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const name = computed(() => userStore.userInfo.realName);
const currentModuleLabel = computed(() => {
  const module = authStore.moduleList.find(m => m.key === authStore.currentModule);
  return module?.label || "";
});
const shouldShowSchool = computed(() => authStore.currentModule !== "system");

const handleBackToModuleSelect = () => {
  router.push(ROUTE_MODULE_SELECT);
};
</script>

<template>
  <div class="flex items-center justify-center pr-[25px]">
    <div class="flex items-center header-icon">
      <!-- 模块徽章区域 -->
      <div v-if="currentModuleLabel" class="flex items-center gap-3 px-4 py-.5 rounded-md cursor-default module-badge">
        <span class="text-sm font-semibold whitespace-nowrap module-label">{{ currentModuleLabel }}</span>
        <template v-if="shouldShowSchool">
          <div class="w-[1px] h-[20px] module-divider"></div>
          <School id="school" ref="school" class="school-in-badge" />
        </template>
      </div>

      <el-tooltip content="主菜单" placement="bottom">
        <div class="flex items-center cursor-pointer transition-colors module-select-icon" @click="handleBackToModuleSelect">
          <el-icon :size="20">
            <Grid />
          </el-icon>
        </div>
      </el-tooltip>

      <Fullscreen id="fullscreen" />
    </div>
    <span class="username mx-[20px] text-[15px]" v-if="true">{{ name }}</span>
    <Avatar />
  </div>
</template>

<style scoped lang="scss">
.header-icon {
  & > * {
    margin-left: 21px;
    color: var(--el-header-text-color);
  }
  .module-badge {
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    transition: all 0.3s;
    &:hover {
      border-color: var(--el-border-color-hover);
    }
  }
  .module-label {
    line-height: 32px !important;
    color: var(--el-text-color-regular);
  }
  .module-divider {
    background-color: var(--el-border-color-light);
  }
  .school-in-badge {
    ::v-deep(.school-selector) {
      width: 140px;
    }
    ::v-deep(.custom-dropdown) {
      .el-select__wrapper {
        padding: 0;
        background-color: transparent;
        border: none;
        box-shadow: none;
        transition: all 0.3s;
        .el-select__selected-item {
          font-size: 13px;
          font-weight: 600;
          color: var(--el-text-color-regular);
        }
        .el-select__placeholder {
          font-size: 13px;
          color: var(--el-text-color-placeholder);
        }
        .el-select__suffix {
          color: var(--el-text-color-regular);
        }
      }
      .el-select__wrapper:hover {
        .el-select__suffix {
          color: var(--el-color-primary);
        }
      }
      .el-select__wrapper.is-focused {
        .el-select__suffix {
          color: var(--el-color-primary);
        }
      }
    }
  }
  .module-select-icon {
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
.username {
  color: var(--el-header-text-color);
}
</style>
