import { useUserStore } from "@/stores/modules/user";

/** 超级管理员角色码 */
const SUPER_ADMIN_ROLE = "super_admin";

/**
 * @description 权限检查 Hook
 */
export const usePermission = () => {
  const userStore = useUserStore();

  /**
   * 检查是否为超级管理员
   */
  const isSuperAdmin = (): boolean => {
    return userStore.userInfo?.role_key === SUPER_ADMIN_ROLE;
  };

  /**
   * 检查是否拥有指定权限（单个或全部满足）
   * @param value 权限码或权限码数组（数组时需全部满足）
   */
  const hasPermission = (value?: string | string[] | null): boolean => {
    if (isSuperAdmin()) return true;
    if (value === undefined || value === null) return false;

    const permissions = userStore.permissions ?? [];
    if (Array.isArray(value)) {
      if (value.length === 0) return false;
      return value.every(code => permissions.includes(code));
    }
    return permissions.includes(value);
  };

  /**
   * 检查是否拥有任一权限（满足其中一个即可）
   * @param values 权限码数组
   */
  const hasAnyPermission = (values?: string[] | null): boolean => {
    if (isSuperAdmin()) return true;
    if (!Array.isArray(values) || values.length === 0) return false;

    const permissions = userStore.permissions ?? [];
    return values.some(code => permissions.includes(code));
  };

  return {
    isSuperAdmin,
    hasPermission,
    hasAnyPermission
  };
};
