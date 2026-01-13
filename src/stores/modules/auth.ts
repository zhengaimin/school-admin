import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthMenuListApi } from "@/api/modules/login";
// import { getPermissionModulesApi } from "@/api/modules/system";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("auth");

/** 超级管理员角色码 */
const SUPER_ADMIN_ROLE = "super_admin";

// 模块路由前缀映射
const MODULE_PATH_MAP: Record<string, string[]> = {
  common: [
    "/systemAuthority",
    "/InternalPage",
    "/moduleControl",
    "/paymentConfig",
    "/notificationConfig",
    "/operationLog",
    "/dataScreening"
  ],
  video: ["/device", "/fund", "/messagesall", "/merchant", "/video"],
  hairdryer: ["/hairdryer", "/hairdryerFund", "/hairdryerLog", "/hairdryerRate", "/hairdryerPackage"],
  system: ["/system", "/permission"]
};

// moduleKey 到主模块的映射
const MODULE_KEY_MAP: Record<string, string[]> = {
  system: ["user", "role", "permission", "org", "tenant"],
  common: ["school", "grade", "department", "class", "student", "config", "apikey", "miniapp"],
  video: [
    "device",
    "deviceGroup",
    "deviceTag",
    "familyContact",
    "callRecord",
    "deviceUsage",
    "message",
    "payment",
    "refund",
    "packageRecord",
    "gift"
  ],
  hairdryer: ["device", "payment", "refund", "packageRecord", "gift"]
};

/**
 * 从权限模块响应中提取 moduleKey 数组
 */
export const extractModuleKeys = (permissionModules: any): string[] => {
  if (!permissionModules?.data?.modules) return [];
  return permissionModules.data.modules.map((module: any) => module.moduleKey);
};

/**
 * 检查用户是否有访问指定主模块的权限
 */
export const hasModuleAccess = (moduleKey: string, userModuleKeys: string[]): boolean => {
  const requiredKeys = MODULE_KEY_MAP[moduleKey];
  if (!requiredKeys) return true; // 未配置的模块默认允许访问
  return requiredKeys.some(key => userModuleKeys.includes(key));
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

/**
 * 根据权限过滤菜单
 * @param menus 菜单列表
 * @param permissions 用户权限码列表
 * @param userModuleKeys 用户拥有的 moduleKey 列表
 * @param isSuperAdmin 是否为超级管理员
 */
const filterMenusByPermission = (
  menus: Menu.MenuOptions[],
  permissions: string[],
  userModuleKeys: string[],
  isSuperAdmin: boolean
): Menu.MenuOptions[] => {
  return menus
    .map(menu => ({ ...menu, children: menu.children ? [...menu.children] : undefined }))
    .filter(menu => {
      // 超级管理员跳过权限检查
      if (isSuperAdmin) {
        if (menu.children?.length) {
          menu.children = filterMenusByPermission(menu.children, permissions, userModuleKeys, isSuperAdmin);
        }
        return true;
      }

      // 检查菜单权限：无 permission 字段则默认允许访问
      const menuPermissions = menu.meta?.permission;
      if (menuPermissions?.length) {
        const hasPermission = menuPermissions.some(code => permissions.includes(code));
        if (!hasPermission) return false;
      }

      // 递归处理子菜单
      if (menu.children?.length) {
        menu.children = filterMenusByPermission(menu.children, permissions, userModuleKeys, isSuperAdmin);
        // 如果子菜单全部被过滤掉，父菜单也不显示（除非父菜单本身有组件）
        if (menu.children.length === 0 && !menu.component) return false;
      }

      return true;
    });
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
      const userStore = useUserStore();
      const userInfo = userStore.userInfo;
      const permissions = userStore.permissions ?? [];
      const userModuleKeys = userStore.moduleKeys ?? [];
      const isSuperAdmin = userInfo?.role_key === SUPER_ADMIN_ROLE;

      //获取前端固定的菜单
      const { data, systemData, modules, isOperator } = await getAuthMenuListApi();

      // 保存全局路由（应用权限过滤）
      this.globalMenus = filterMenusByPermission(data || [], permissions, userModuleKeys, isSuperAdmin);

      // 保存模块列表
      this.moduleList = modules || [];

      // 保存所有模块菜单（应用权限过滤）
      let rawMenus: Record<string, Menu.MenuOptions[]> = {};
      if (userInfo["role_key"] == "super_admin" || userInfo["role_key"] == "agent_admin") {
        rawMenus = systemData || {};
      } else if (userInfo["role_key"] == "maintainer") {
        rawMenus = (Array.isArray(isOperator) ? {} : isOperator) || {};
      }

      // 对每个模块的菜单应用权限过滤
      this.allModuleMenus = {};
      Object.entries(rawMenus).forEach(([moduleKey, menus]) => {
        // 检查用户是否有访问该模块的权限
        if (isSuperAdmin || hasModuleAccess(moduleKey, userModuleKeys)) {
          this.allModuleMenus[moduleKey] = filterMenusByPermission(menus, permissions, userModuleKeys, isSuperAdmin);
        }
      });

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
