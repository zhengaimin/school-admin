<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb v-show="globalStore.breadcrumb" id="breadcrumb" />

    <!-- 平台管理员当前租户：常显名称 + 退出 -->
    <div v-if="userStore.currentTenant" class="current-tenant">
      <el-tag type="success" size="small">当前租户：{{ userStore.currentTenant.tenantName }}</el-tag>
      <el-button type="warning" link size="small" @click="handleExitTenant">退出租户</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useGlobalStore } from "@/stores/modules/global";
import { useUserStore } from "@/stores/modules/user";
import { exitTenantApi } from "@/api/modules";
import CollapseIcon from "./components/CollapseIcon.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

const globalStore = useGlobalStore();
const userStore = useUserStore();
const router = useRouter();

/** 退出当前租户：清会话态 + 前端状态，返回租户管理 */
const handleExitTenant = async () => {
  const res = await exitTenantApi();
  if (res.code === 0) {
    userStore.setCurrentTenant(null);
    ElMessage.success("已退出当前租户");
    router.push("/permission/tenant");
  }
};
</script>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;

  .current-tenant {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;
  }
}
</style>
