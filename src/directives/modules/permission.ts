/**
 * v-permission
 * 权限控制指令
 * @example v-permission="'device:create'" 单个权限
 * @example v-permission="['device:update', 'device:delete']" 多个权限（满足任一即可）
 */
import type { Directive } from "vue";
import { SUPER_ADMIN_ROLE } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";

const hasPermission = (value: string | string[] | null | undefined, permissions: string[], roleCode?: string) => {
  if (roleCode === SUPER_ADMIN_ROLE) return true;
  if (!value || (Array.isArray(value) && value.length === 0)) return true;
  if (Array.isArray(value)) {
    return value.some(code => permissions.includes(code));
  }
  return permissions.includes(value);
};

const removeElement = (el: HTMLElement) => {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    const allowed = hasPermission(binding.value, permissionStore.permissionCodesGet ?? [], userStore.userInfo?.roleCode);
    if (!allowed) {
      removeElement(el);
    }
  },
  updated(el, binding) {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    const allowed = hasPermission(binding.value, permissionStore.permissionCodesGet ?? [], userStore.userInfo?.roleCode);
    if (!allowed) {
      removeElement(el);
    }
  }
};

export default permission;
