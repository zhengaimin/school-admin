<template>
  <div class="sub-menu-root">
    <template v-for="subItem in menuList" :key="subItem.path">
      <el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
        <template #title>
          <el-icon v-if="subItem.meta.icon">
            <!-- {{ subItem.meta.icon }} -->
            <component :is="subItem.meta.icon"></component>
          </el-icon>
          <span class="sle">{{ subItem.meta.title }}</span>
        </template>
        <SubMenu :menu-list="subItem.children" />
      </el-sub-menu>
      <!-- 没有子菜单 -->
      <el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
        <el-icon v-if="subItem.meta.icon">
          <!-- <img
            v-if="subItem.meta.icon == 'nengtan'"
            style="width: 20px; height: 20px"
            src="@/assets/images/menu/nengtan.svg"
            alt=""
            srcset=""
          /> -->
          <component :is="subItem.meta.icon"></component>
        </el-icon>
        <template #title>
          <span class="sle">{{ subItem.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
defineProps<{ menuList: Menu.MenuOptions[] }>();

const authStore = useAuthStore();
const router = useRouter();
// 点击菜单
function handleClickMenu(subItem: Menu.MenuOptions) {
  //页面按钮权限存储在全局
  authStore.getAuthButtonList(subItem.buttonList ?? []);
  // 如果是外链
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
  router.push(subItem.path);
}
</script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;

      // background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      content: "";
      background-color: var(--el-color-primary);
    }
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}

.sub-menu-root {
  display: contents;
}
</style>
