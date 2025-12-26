import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("auth");

// 模块路由前缀映射
const MODULE_PATH_MAP: Record<string, string[]> = {
  common: [
    "/systemAuthority",
    "/InternalPage",
    "/moduleControl",
    "/paymentConfig",
    "/notificationConfig",
    "/companyControl",
    "/operationLog",
    "/dataScreening"
  ],
  phone: ["/device", "/fund", "/setmenu", "/messagesall"],
  hairdryer: ["/hairdryer", "/hairdryerFund", "/hairdryerLog", "/hairdryerRate", "/hairdryerPackage"]
};

/**
 * 根据路由路径获取模块 key
 */
export const getModuleByPath = (path: string): string => {
  for (const [moduleKey, prefixes] of Object.entries(MODULE_PATH_MAP)) {
    if (prefixes.some(prefix => path.startsWith(prefix))) {
      return moduleKey;
    }
  }
  return "common"; // 默认返回公共模块
};

export const useAuthStore = defineStore(id, {
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: [],
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: "",
    // 当前选中的模块
    currentModule: "common",
    // 模块列表
    moduleList: [],
    // 所有模块的菜单
    allModuleMenus: {},
    // 全局路由（不属于任何模块）
    globalMenus: []
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList),
    // 获取所有模块的扁平化菜单（用于动态路由，包含全局路由）
    allFlatMenuListGet: state => {
      const allMenus: Menu.MenuOptions[] = [...state.globalMenus];
      Object.values(state.allModuleMenus).forEach(menus => {
        allMenus.push(...menus);
      });
      return getFlatMenuList(allMenus);
    },
    // 模块列表
    moduleListGet: state => state.moduleList,
    // 当前模块
    currentModuleGet: state => state.currentModule
  },
  actions: {
    // Get AuthButtonList
    getAuthButtonList(data: Menu.MenuOptions[]) {
      this.authButtonList = data;
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      this.authMenuList = [];
      let userInfo = useUserStore().userInfo;
      //获取前端固定的菜单
      const { data, systemData, modules, isOperator } = await getAuthMenuListApi();

      // 保存全局路由
      this.globalMenus = data || [];

      // 保存模块列表
      this.moduleList = modules || [];

      // 保存所有模块菜单
      if (userInfo["role_key"] == "super_admin" || userInfo["role_key"] == "agent_admin") {
        this.allModuleMenus = systemData || {};
      } else if (userInfo["role_key"] == "maintainer") {
        this.allModuleMenus = isOperator || {};
      }

      // 设置当前模块的菜单
      this.setCurrentModuleMenu();
    },
    // 设置当前模块
    setCurrentModule(moduleKey: string) {
      this.currentModule = moduleKey;
      this.setCurrentModuleMenu();
    },
    // 根据路由路径自动设置模块
    setModuleByPath(path: string) {
      const moduleKey = getModuleByPath(path);
      if (moduleKey !== this.currentModule) {
        this.currentModule = moduleKey;
        this.setCurrentModuleMenu();
      }
    },
    // 设置当前模块的菜单
    setCurrentModuleMenu() {
      const menus = this.allModuleMenus[this.currentModule];
      this.authMenuList = menus || [];
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  },
  persist: piniaPersistConfig(id, ["currentModule"])
});
