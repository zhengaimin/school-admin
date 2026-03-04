import { computed } from "vue";
import { isSuperRoleLevel } from "@/config/modules";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";

const normalizeButtonList = (list: unknown): string[] => {
  if (!Array.isArray(list)) return [];
  return list
    .map(item => (typeof item === "string" ? item : (item as { code?: string })?.code))
    .filter((code): code is string => Boolean(code));
};

/**
 * @description 页面按钮权限
 * @note 优先使用路由 buttonList，缺省回退到权限码
 * */
export const useAuthButtons = () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const BUTTONS = computed(() => {
    const buttonList = normalizeButtonList(authStore.authButtonList);
    const permissions = permissionStore.permissionCodesGet ?? [];
    return new Proxy({} as Record<string, boolean>, {
      get: (_target, key) => {
        if (isSuperRoleLevel(userStore.userInfo?.roleLevel)) return true;
        if (typeof key !== "string") return false;
        if (buttonList.length > 0) return buttonList.includes(key);
        return permissions.includes(key);
      }
    });
  });

  return {
    BUTTONS
  };
};
