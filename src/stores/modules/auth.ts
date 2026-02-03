import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthMenuListApi } from "@/api/modules/login";
import { ROLE_LEVEL, SUPER_ADMIN_ROLE } from "@/config/modules";
import { ROUTE_SYSTEM } from "@/config/router";
// import { getPermissionModulesApi } from "@/api/modules/system";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";
import type { System } from "@/api/interface";

const id = generatePrefix("auth");

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
  system: ["user", "adminuser", "role", "permission", "org", "tenant", "system"],
  common: ["school", "grade", "department", "class", "student", "config", "apikey", "miniapp", "common"],
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
    "gift",
    "fund",
    "video"
  ],
  hairdryer: ["device", "payment", "refund", "packageRecord", "gift", "hairdryer"]
};

const PLATFORM_USER_MENU_PATHS = new Set<string>([ROUTE_SYSTEM.USER, ROUTE_SYSTEM.USER_SUPPLIER, ROUTE_SYSTEM.USER_SALESMAN]);

/** 判断是否平台用户 */
const isPlatformUser = (userInfo?: Record<string, any>): boolean => {
  return userInfo?.role_level === ROLE_LEVEL.PLATFORM;
};

// 这些页面不切换当前模块，避免清空原有菜单
const SKIP_MODULE_SWITCH_PATHS = new Set<string>([ROUTE_SYSTEM.PROFILE, ROUTE_SYSTEM.CHANGE_PASSWORD]);

/**
 * 从权限模块响应中提取 moduleKey 数组
 */
export const normalizePermissionModules = (payload: any): System.PermissionModule[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.modules)) return payload.modules;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.modules)) return payload.data.modules;
  return [];
};

export const extractModuleKeys = (permissionModules: any): string[] => {
  const modules = normalizePermissionModules(permissionModules);
  return modules.map(module => module.moduleKey).filter((key): key is string => Boolean(key));
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
 * @param platformUser 是否平台用户
 */
const filterMenusByPermission = (
  menus: Menu.MenuOptions[],
  permissions: string[],
  userModuleKeys: string[],
  isSuperAdmin: boolean,
  platformUser: boolean
): Menu.MenuOptions[] => {
  return menus
    .map(menu => ({ ...menu, children: menu.children ? [...menu.children] : undefined }))
    .filter(menu => {
      // 超级管理员跳过权限检查
      if (isSuperAdmin) {
        if (menu.children?.length) {
          menu.children = filterMenusByPermission(menu.children, permissions, userModuleKeys, isSuperAdmin, platformUser);
        }
        return true;
      }

      // 检查菜单权限：无 permission 字段则默认允许访问
      const menuPermissions = menu.meta?.permission;
      const isPlatformUserMenu = platformUser && PLATFORM_USER_MENU_PATHS.has(menu.path);
      if (menuPermissions?.length) {
        const hasPermission = isPlatformUserMenu || menuPermissions.some(code => permissions.includes(code));
        if (!hasPermission) return false;
      }

      // 递归处理子菜单
      if (menu.children?.length) {
        menu.children = filterMenusByPermission(menu.children, permissions, userModuleKeys, isSuperAdmin, platformUser);
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
    getAuthButtonList(data?: Menu.ButtonPermission[]) {
      this.authButtonList = data ?? [];
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      this.authMenuList = [];
      const userStore = useUserStore();
      const permissionStore = usePermissionStore();
      const userInfo = userStore.userInfo;
      const permissions = permissionStore.permissionCodesGet ?? [];
      const userModuleKeys = permissionStore.moduleKeysGet ?? [];
      const isSuperAdmin = userInfo?.roleCode === SUPER_ADMIN_ROLE;
      const platformUser = isPlatformUser(userInfo);

      //获取前端固定的菜单
      const { data, systemData, modules, isOperator } = await getAuthMenuListApi();

      // 保存全局路由（应用权限过滤）
      this.globalMenus = filterMenusByPermission(data || [], permissions, userModuleKeys, isSuperAdmin, platformUser);

      // 保存模块列表
      this.moduleList = modules || [];

      // 保存所有模块菜单（应用权限过滤）
      let rawMenus: Record<string, Menu.MenuOptions[]> = systemData || {};
      if (userInfo["roleCode"] == "maintainer") {
        rawMenus = !Array.isArray(isOperator) && isOperator ? isOperator : rawMenus;
      }

      // 对每个模块的菜单应用权限过滤
      this.allModuleMenus = {};
      Object.entries(rawMenus).forEach(([moduleKey, menus]) => {
        // 检查用户是否有访问该模块的权限
        if (isSuperAdmin || hasModuleAccess(moduleKey, userModuleKeys)) {
          this.allModuleMenus[moduleKey] = filterMenusByPermission(
            menus,
            permissions,
            userModuleKeys,
            isSuperAdmin,
            platformUser
          );
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
      if (SKIP_MODULE_SWITCH_PATHS.has(path)) return;
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
