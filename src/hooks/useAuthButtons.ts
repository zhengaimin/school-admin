import { computed } from "vue";

/**
 * @description 页面按钮权限
 * @note 当前版本所有权限已放开，所有按钮都返回 true
 * */
export const useAuthButtons = () => {
  const BUTTONS = computed(() => {
    // 当前版本所有权限已放开，使用 Proxy 让所有按钮权限都返回 true
    return new Proxy({} as Record<string, boolean>, {
      get: () => true
    });
  });

  return {
    BUTTONS
  };
};
