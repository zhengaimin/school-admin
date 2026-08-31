import type { System } from "@/api/interface";
import type { TRoleLevelValue } from "@/config/modules";

import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthMenuListApi } from "@/api/modules/login";
import { isPlatformRoleLevel, isSuperRoleLevel, ROLE_LEVEL } from "@/config/modules";
import { ROUTE_HAIRDRYER, ROUTE_SYSTEM } from "@/config/router";
import { getPermissionModulesApi } from "@/api/modules/system";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("auth");

// 权限模块 key（平台运营方仅可见此模块）
const PERMISSION_MODULE_KEY = "system";
// 套餐模块 key（平台运营方进入租户后维护该租户套餐）
const PACKAGE_MODULE_KEY = "package";

// 模块路由前缀映射
const MODULE_PATH_MAP: Record<string, string[]> = {
  common: ["/systemAuthority", "/InternalPage", "/moduleControl", "/notificationConfig", "/operationLog", "/dataScreening"],
  video: ["/device", "/fund", "/messagesall", "/merchant", "/video"],
  hairdryer: ["/hairdryer", "/hairdryerFund", "/hairdryerLog", "/hairdryerRate", "/hairdryerPackage", "/paymentConfig"],
  system: ["/system", "/permission"],
  package: ["/package"]
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
  hairdryer: ["device", "payment", "refund", "packageRecord", "gift", "hairdryer"],
  package: ["platformPackage"]
};

// 这些页面不切换当前模块，避免清空原有菜单
const SKIP_MODULE_SWITCH_PATHS = new Set<string>([ROUTE_SYSTEM.PROFILE, ROUTE_SYSTEM.CHANGE_PASSWORD]);
const LEGACY_PAYMENT_CONFIG_PATH = "/paymentConfig";
const LEGACY_PAYMENT_CONFIG_COMPONENT = "/paymentConfig/index";
const HAIRDRYER_PAYMENT_CONFIG_COMPONENT = "/hairdryer/paymentConfig/index";
const HAIRDRYER_PAYMENT_CONFIG_NAME = "hairdryerPaymentConfig";

/** 判断是否旧版支付金额配置菜单 */
const isLegacyPaymentConfigMenu = (menu: Menu.MenuOptions): boolean => {
  return menu.path === LEGACY_PAYMENT_CONFIG_PATH || menu.component === LEGACY_PAYMENT_CONFIG_COMPONENT;
};

/** 合并菜单并按 path 去重 */
const mergeMenusByPath = (baseMenus: Menu.MenuOptions[], appendMenus: Menu.MenuOptions[]): Menu.MenuOptions[] => {
  const merged = [...baseMenus];
  const pathSet = new Set(merged.map(menu => menu.path));
  appendMenus.forEach(menu => {
    if (pathSet.has(menu.path)) return;
    merged.push(menu);
    pathSet.add(menu.path);
  });
  return merged;
};

/** 兼容旧菜单：将公共模块中的支付金额配置迁移到吹风机模块 */
const migrateLegacyPaymentConfigMenu = (rawMenus: Record<string, Menu.MenuOptions[]>): Record<string, Menu.MenuOptions[]> => {
  const commonMenus = Array.isArray(rawMenus.common) ? [...rawMenus.common] : [];
  if (commonMenus.length === 0) return rawMenus;

  const legacyPaymentMenus: Menu.MenuOptions[] = [];
  const nextCommonMenus: Menu.MenuOptions[] = [];
  commonMenus.forEach(menu => {
    if (!isLegacyPaymentConfigMenu(menu)) {
      nextCommonMenus.push(menu);
      return;
    }
    legacyPaymentMenus.push({
      ...menu,
      path: ROUTE_HAIRDRYER.PAYMENT_CONFIG,
      name: HAIRDRYER_PAYMENT_CONFIG_NAME,
      component: HAIRDRYER_PAYMENT_CONFIG_COMPONENT
    });
  });

  if (legacyPaymentMenus.length === 0) return rawMenus;

  return {
    ...rawMenus,
    common: nextCommonMenus,
    hairdryer: mergeMenusByPath(rawMenus.hairdryer || [], legacyPaymentMenus)
  };
};

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
 * 刷新权限模块并返回最新权限上下文（moduleKeys + permissionCodes）
 * 菜单构建必须基于 /admin/permissions/modules 返回值
 */
const refreshPermissionContext = async (permissionStore: ReturnType<typeof usePermissionStore>) => {
  try {
    const result = await getPermissionModulesApi(undefined, { loading: false, errorTip: false });
    if (result?.code === 0) {
      permissionStore.setModulePermissionsByModules(result);
    } else {
      permissionStore.resetModulePermissions();
    }
  } catch (error) {
    console.warn("refreshPermissionContext:", error);
    permissionStore.resetModulePermissions();
  }

  return {
    permissions: permissionStore.permissionCodesGet ?? [],
    userModuleKeys: permissionStore.moduleKeysGet ?? []
  };
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
 * 判断用户管理子菜单是否对当前角色可见
 * @param path 菜单路径
 * @param roleLevel 当前角色层级
 * @returns 是否可见
 */
const isUserMenuVisible = (path: string, roleLevel?: TRoleLevelValue): boolean => {
  if (roleLevel === ROLE_LEVEL.CUSTOM && (path === ROUTE_SYSTEM.USER || path.startsWith(`${ROUTE_SYSTEM.USER}/`))) {
    return false;
  }
  if (roleLevel === ROLE_LEVEL.PLATFORM) {
    return path !== ROUTE_SYSTEM.USER_PLATFORM;
  }
  if (roleLevel === ROLE_LEVEL.AGENT) {
    return path !== ROUTE_SYSTEM.USER_PLATFORM;
  }
  return true;
};

/**
 * 根据权限和角色层级过滤菜单
 * @param menus 菜单列表
 * @param permissions 用户权限码列表
 * @param isSuperAdmin 是否为超级管理员
 * @param roleLevel 当前角色层级
 * @returns 过滤后的菜单列表
 */
const filterMenusByPermission = (
  menus: Menu.MenuOptions[],
  permissions: string[],
  isSuperAdmin: boolean,
  roleLevel?: TRoleLevelValue
): Menu.MenuOptions[] => {
  return menus
    .map(menu => ({ ...menu, children: menu.children ? [...menu.children] : undefined }))
    .filter(menu => {
      if (!isUserMenuVisible(menu.path, roleLevel)) return false;

      // 检查菜单权限：无 permission 字段则默认允许访问
      const menuPermissions = menu.meta?.permission;
      if (!isSuperAdmin && menuPermissions?.length) {
        const hasPermission = menuPermissions.some(code => permissions.includes(code));
        if (!hasPermission) return false;
      }

      // 递归处理子菜单
      if (menu.children?.length) {
        menu.children = filterMenusByPermission(menu.children, permissions, isSuperAdmin, roleLevel);
        // 如果子菜单全部被过滤掉，父菜单也不显示（除非父菜单本身有组件）
        if (menu.children.length === 0 && !menu.component) return false;
        if (menu.path === ROUTE_SYSTEM.USER) {
          menu.redirect = menu.children[0]?.path;
        }
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
      const { permissions, userModuleKeys } = await refreshPermissionContext(permissionStore);
      const isSuperAdmin = isSuperRoleLevel(userInfo?.roleLevel);
      // 平台运营方「未进入租户」时仅可见权限模块
      const isPlatformOperator = isPlatformRoleLevel(userInfo?.roleLevel) && !userStore.currentTenant;
      // 平台运营方「已进入租户」：以租户身份管理，展示业务模块但不含权限模块
      const isPlatformInTenant = isPlatformRoleLevel(userInfo?.roleLevel) && !!userStore.currentTenant;

      //获取前端固定的菜单
      const { data, systemData, modules, isOperator } = await getAuthMenuListApi();

      // 保存全局路由（应用权限过滤）
      this.globalMenus = filterMenusByPermission(data || [], permissions, isSuperAdmin, userInfo?.roleLevel);

      // 保存模块列表
      const allModules = modules || [];
      if (isPlatformOperator) {
        // 平台运营方未进入租户：仅保留权限模块，其余业务模块不展示
        this.moduleList = allModules.filter(module => module.key === PERMISSION_MODULE_KEY);
      } else if (isPlatformInTenant) {
        // 平台运营方已进入租户：按权限过滤业务模块，且排除权限模块；套餐模块固定可见
        this.moduleList = allModules.filter(
          module =>
            module.key !== PERMISSION_MODULE_KEY &&
            (module.key === PACKAGE_MODULE_KEY || hasModuleAccess(module.key, userModuleKeys))
        );
      } else {
        this.moduleList = isSuperAdmin ? allModules : allModules.filter(module => hasModuleAccess(module.key, userModuleKeys));
      }

      // 保存所有模块菜单（应用权限过滤）
      let rawMenus: Record<string, Menu.MenuOptions[]> = systemData || {};
      if (userInfo["roleCode"] == "maintainer") {
        rawMenus = !Array.isArray(isOperator) && isOperator ? isOperator : rawMenus;
      }
      rawMenus = migrateLegacyPaymentConfigMenu(rawMenus);

      // 对每个模块的菜单应用权限过滤
      this.allModuleMenus = {};
      Object.entries(rawMenus).forEach(([moduleKey, menus]) => {
        // 平台运营方未进入租户：仅保留权限模块菜单
        if (isPlatformOperator && moduleKey !== PERMISSION_MODULE_KEY) return;
        // 平台运营方已进入租户：以租户身份管理，排除权限模块菜单
        if (isPlatformInTenant && moduleKey === PERMISSION_MODULE_KEY) return;
        // 检查用户是否有访问该模块的权限（平台运营方进入租户后固定保留套餐模块菜单）
        if (
          isSuperAdmin ||
          isPlatformOperator ||
          (isPlatformInTenant && moduleKey === PACKAGE_MODULE_KEY) ||
          hasModuleAccess(moduleKey, userModuleKeys)
        ) {
          this.allModuleMenus[moduleKey] = filterMenusByPermission(menus, permissions, isSuperAdmin, userInfo?.roleLevel);
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
      let moduleKey = this.currentModule;
      let menus = this.allModuleMenus[moduleKey];

      // 当前模块不可访问时，回退到第一个可访问且有菜单的模块
      if (!menus?.length) {
        const fallback = this.moduleList.find(item => (this.allModuleMenus[item.key] || []).length > 0);
        if (fallback) {
          moduleKey = fallback.key;
          this.currentModule = fallback.key;
          menus = this.allModuleMenus[moduleKey];
        }
      }

      this.authMenuList = menus || [];
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  },
  persist: piniaPersistConfig(id, ["currentModule"])
});
