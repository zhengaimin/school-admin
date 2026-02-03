import type { Login, System } from "@/api/interface";

export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  accordion: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
}

/* UserState */
export type TUserInfo = Partial<Login.UserInfo> & {
  name?: string;
  [key: string]: any;
};

export interface UserState {
  token: string;
  userInfo: TUserInfo;
  schoolMsg: { schoolId: string; schoolName: string };
  count: number;
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* ModuleItem */
export interface ModuleItem {
  key: string;
  label: string;
  icon: string;
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: Menu.ButtonPermission[];
  authMenuList: Menu.MenuOptions[];
  // 模块相关
  currentModule: string;
  moduleList: ModuleItem[];
  allModuleMenus: Record<string, Menu.MenuOptions[]>;
  // 全局路由（不属于任何模块）
  globalMenus: Menu.MenuOptions[];
}

/* 权限状态 */
export interface PermissionState {
  modulePermissions: Record<string, System.Permission[]>;
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}
