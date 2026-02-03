import { SUPER_ADMIN_ROLE } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";

/**
 * @description 权限检查 Hook
 */
export const usePermission = () => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  /**
   * 检查是否为超级管理员
   */
  const isSuperAdmin = (): boolean => {
    return userStore.userInfo?.roleCode === SUPER_ADMIN_ROLE;
  };

  /**
   * 检查是否拥有指定权限（单个或全部满足）
   * @param _value 权限码或权限码数组（数组时需全部满足）
   */
  const hasPermission = (_value?: string | string[] | null): boolean => {
    if (isSuperAdmin()) return true;
    if (!_value || (Array.isArray(_value) && _value.length === 0)) return true;
    const permissions = permissionStore.permissionCodesGet ?? [];
    if (Array.isArray(_value)) {
      return _value.every(code => permissions.includes(code));
    }
    return permissions.includes(_value);
  };

  /**
   * 检查是否拥有任一权限（满足其中一个即可）
   * @param _values 权限码数组
   */
  const hasAnyPermission = (_values?: string[] | null): boolean => {
    if (isSuperAdmin()) return true;
    if (!_values || _values.length === 0) return true;
    const permissions = permissionStore.permissionCodesGet ?? [];
    return _values.some(code => permissions.includes(code));
  };

  return {
    isSuperAdmin,
    hasPermission,
    hasAnyPermission
  };
};
