/**
 * v-permission
 * 权限控制指令
 * @example v-permission="'device:create'" 单个权限
 * @example v-permission="['device:update', 'device:delete']" 多个权限（满足任一即可）
 * @note 当前版本所有权限已放开，不会移除任何元素
 */
import type { Directive } from "vue";

const permission: Directive = {
  mounted() {
    // 当前版本所有权限已放开，不做任何处理
    return;
  }
};

export default permission;
