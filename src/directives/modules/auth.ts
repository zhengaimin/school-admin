/**
 * v-auth
 * 按钮权限指令
 */
import type { Directive } from "vue";
import { SUPER_ADMIN_ROLE } from "@/config/modules";
import { useAuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";

const normalizeButtonList = (list: unknown): string[] => {
  if (!Array.isArray(list)) return [];
  return list
    .map(item => (typeof item === "string" ? item : (item as { code?: string })?.code))
    .filter((code): code is string => Boolean(code));
};

const hasButtonPermission = (
  value: string | string[] | null | undefined,
  buttonList: unknown,
  permissions: string[],
  roleCode?: string
) => {
  if (roleCode === SUPER_ADMIN_ROLE) return true;
  if (!value || (Array.isArray(value) && value.length === 0)) return true;
  const values = Array.isArray(value) ? value : [value];
  const buttonCodes = normalizeButtonList(buttonList);
  if (buttonCodes.length > 0) {
    return values.some(code => buttonCodes.includes(code));
  }
  return values.some(code => permissions.includes(code));
};

const removeElement = (el: HTMLElement) => {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const auth: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();
    const allowed = hasButtonPermission(
      binding.value,
      authStore.authButtonList,
      permissionStore.permissionCodesGet ?? [],
      userStore.userInfo?.roleCode
    );
    if (!allowed) {
      removeElement(el);
    }
  },
  updated(el, binding) {
    const userStore = useUserStore();
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();
    const allowed = hasButtonPermission(
      binding.value,
      authStore.authButtonList,
      permissionStore.permissionCodesGet ?? [],
      userStore.userInfo?.roleCode
    );
    if (!allowed) {
      removeElement(el);
    }
  }
};

export default auth;
