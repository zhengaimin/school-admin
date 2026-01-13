import { useUserStore } from "@/stores/modules/user";

/** 超级管理员角色码 */
const SUPER_ADMIN_ROLE = "super_admin";

/**
 * @description 权限检查 Hook
 * @note 当前版本所有权限已放开，始终返回 true
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
   * @param _value 权限码或权限码数组（数组时需全部满足）
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasPermission = (_value?: string | string[] | null): boolean => {
    return true; // 当前版本所有权限已放开
  };

  /**
   * 检查是否拥有任一权限（满足其中一个即可）
   * @param _values 权限码数组
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasAnyPermission = (_values?: string[] | null): boolean => {
    return true; // 当前版本所有权限已放开
  };

  return {
    isSuperAdmin,
    hasPermission,
    hasAnyPermission
  };
};
