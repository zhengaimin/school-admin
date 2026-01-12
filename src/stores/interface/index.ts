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
export interface UserState {
  token: string;
  userInfo: {
    name: string;
    role_key?: string;
    [key: string]: any;
  };
  permissions: string[];
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
  authButtonList: Menu.MenuOptions[];
  authMenuList: Menu.MenuOptions[];
  // 模块相关
  currentModule: string;
  moduleList: ModuleItem[];
  allModuleMenus: Record<string, Menu.MenuOptions[]>;
  // 全局路由（不属于任何模块）
  globalMenus: Menu.MenuOptions[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}
