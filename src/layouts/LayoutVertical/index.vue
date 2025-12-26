<!-- 纵向布局 -->
<template>
  <el-container class="layout">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flx-center" v-if="currentModuleName.length < 8">
          <img v-if="ruleForm.logo" class="logo-img" :src="ruleForm.logo" alt="logo" />
          <img v-else class="logo-img" src="@/assets/images/xinkao.png" alt="logo" />
          <span v-show="!isCollapse" class="logo-text">{{ currentModuleName }}</span>
        </div>
        <div v-else class="logo logo-more">
          <img v-if="ruleForm.logo" :src="ruleForm.logo" alt="logo" />
          <img v-else src="@/assets/images/xinkao.png" alt="logo" />
          <div v-show="!isCollapse" class="logo-text" style="font-size: 14px">{{ currentModuleName }}</div>
        </div>
        <!-- 左侧菜单 -->
        <el-scrollbar>
          <el-menu
            :router="false"
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="accordion"
            :collapse-transition="false"
            :default-openeds="[]"
          >
            <SubMenu :menu-list="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <MainC />
    </el-container>
  </el-container>
</template>
<script>
import MainC from "@/layouts/components/Main/index.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import { useAuthStore } from "@/stores/modules/auth";
import { useGlobalStore } from "@/stores/modules/global";
import { system_info } from "@/api/modules/menu.js";
import { formConfigStore } from "@/stores/modules/formConfig";
export default {
  components: {
    MainC,
    ToolBarLeft,
    ToolBarRight,
    SubMenu
  },
  data() {
    return {
      ruleForm: {
        name: "校园管理系统",
        logo: ""
      }
    };
  },
  computed: {
    currentModuleName() {
      const authStore = useAuthStore();
      const currentModule = authStore.currentModuleGet;
      const moduleList = authStore.moduleListGet;
      const module = moduleList.find(m => m.key === currentModule);
      return module?.label || this.ruleForm.name;
    },
    menuList() {
      const authStore = useAuthStore();
      return authStore.showMenuListGet;
    },
    accordion() {
      const globalStore = useGlobalStore();
      return globalStore.accordion;
    },
    isCollapse() {
      const globalStore = useGlobalStore();
      return globalStore.isCollapse;
    },
    activeMenu() {
      return this.$route.meta.activeMenu ? this.$route.meta.activeMenu : this.$route.path;
    }
  },
  mounted() {
    this.formConfigStore = formConfigStore();
    // this.system_info();
  },
  methods: {
    system_info() {
      system_info().then(res => {
        if (res && res.code == 0) {
          this.ruleForm.name = res.data.name;
          this.ruleForm.logo = res.data.logo;
          this.formConfigStore.setLogoObj(res.data);
          // if (!this.ruleForm.name) {
          //   // 跳转到系统设置页面
          //   this.$message.warning("请优先设置系统企业LOGO和系统名称");
          //   this.$router.push({ path: "/systemSetting" });
          // }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "./index";
</style>
