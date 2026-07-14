import authMenuList from "./authMenuList";
import { ROUTE_MODULE_SELECT } from "./router";

export type PermissionMenuGroup = {
  key: string;
  label: string;
  menus: Menu.MenuOptions[];
};

const EXCLUDED_PATHS = new Set<string>([
  "/systemAuthority/parentAdmin",
  "/systemAuthority/billList",
  "/systemAuthority/refund",
  "/dataScreening",
  "/fund/recordAll",
  "/fund/consumption"
]);

const filterMenus = (menus: Menu.MenuOptions[]): Menu.MenuOptions[] => {
  return menus
    .filter(menu => !EXCLUDED_PATHS.has(menu.path))
    .map(menu => ({
      ...menu,
      children: menu.children ? filterMenus(menu.children) : undefined
    }));
};

const systemMenus = authMenuList.systemData || {};

export const permissionMenuTreeConfig: {
  groups: PermissionMenuGroup[];
  lockedPaths: string[];
} = {
  groups: [
    { key: "video", label: "公话模块", menus: filterMenus(systemMenus.video || []) },
    { key: "hairdryer", label: "吹风机模块", menus: filterMenus(systemMenus.hairdryer || []) },
    { key: "common", label: "公共模块", menus: filterMenus(systemMenus.common || []) },
    { key: "system", label: "权限模块", menus: filterMenus(systemMenus.system || []) }
  ],
  lockedPaths: [ROUTE_MODULE_SELECT]
};
