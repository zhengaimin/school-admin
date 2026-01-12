/**
 * v-permission
 * 权限控制指令
 * @example v-permission="'device:create'" 单个权限
 * @example v-permission="['device:update', 'device:delete']" 多个权限（满足任一即可）
 */
import { useUserStore } from "@/stores/modules/user";
import type { Directive, DirectiveBinding } from "vue";

const SUPER_ADMIN_ROLE = "super_admin";

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const { value } = binding;
    if (!value) return;

    const userStore = useUserStore();

    // 超级管理员跳过权限检查
    if (userStore.userInfo?.role_key === SUPER_ADMIN_ROLE) return;

    const permissions = userStore.permissions ?? [];

    let hasPermission = false;
    if (Array.isArray(value)) {
      // 数组模式：满足任一权限即可显示
      hasPermission = value.some(code => permissions.includes(code));
    } else {
      // 单个权限码
      hasPermission = permissions.includes(value);
    }

    if (!hasPermission) {
      el.remove();
    }
  }
};

export default permission;
