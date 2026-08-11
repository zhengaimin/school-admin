<script setup lang="ts">
import type { System } from "@/api/interface";
import type { CheckboxValueType } from "element-plus";
import type { TPermissionTreeNode } from "../types";

import { ref, nextTick, watch } from "vue";
import { ElTree } from "element-plus";
import { getPermissionCodeLabel } from "@/config/modules";
import { PERMISSION_MODULE_I18N } from "../constants";

const props = withDefaults(defineProps<{ modules?: System.PermissionModule[] }>(), {
  modules: () => []
});

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<TPermissionTreeNode[]>([]);
const allSelectableKeys = ref<number[]>([]);
const filterText = ref("");
const isExpandAll = ref(false);
const isCheckAll = ref(false);

const defaultProps = {
  children: "children",
  label: "name"
};

/** 收集可勾选权限节点的键 */
const collectSelectableKeys = (nodes: TPermissionTreeNode[]): number[] => {
  const keys: number[] = [];
  nodes.forEach(node => {
    if (node.children?.length) {
      keys.push(...collectSelectableKeys(node.children));
      return;
    }
    if (node.isPermission && typeof node.id === "number") {
      keys.push(node.id);
    }
  });
  return keys;
};

/** 构建权限树数据 */
const buildPermissionTree = (modules: System.PermissionModule[]) => {
  const nodes = modules
    .map(module => {
      const moduleName = PERMISSION_MODULE_I18N[module.moduleKey] || module.moduleName || module.moduleKey;
      const permissions = module.permissions || [];
      const children = permissions
        .filter(permission => typeof permission.id === "number")
        .map(permission => {
          const permissionCode = permission.code || "";
          const codeLabel = getPermissionCodeLabel(permissionCode);
          const name =
            codeLabel && codeLabel !== permissionCode ? codeLabel : permission.name || permission.action || permissionCode;

          return {
            id: permission.id,
            name,
            isPermission: true,
            permissionId: permission.id,
            permissionCode: permissionCode,
            permissionAction: permission.action,
            moduleName
          };
        });

      return {
        id: `module:${module.moduleKey}`,
        name: moduleName,
        children: children.length > 0 ? children : undefined
      };
    })
    .filter(node => node.children && node.children.length > 0);

  treeData.value = nodes;
  allSelectableKeys.value = collectSelectableKeys(nodes);
};

/** 设置权限树勾选项 */
const setCheckedKeys = (keys: Array<string | number>) => {
  const uniqueKeys = Array.from(new Set(keys));
  treeRef.value?.setCheckedKeys(uniqueKeys, false);
  nextTick(() => {
    handleSyncCheckAllState();
  });
};

/** 同步全选状态 */
const handleSyncCheckAllState = () => {
  if (!treeRef.value) {
    isCheckAll.value = false;
    return;
  }
  const checkedKeys = treeRef.value.getCheckedKeys(false) as Array<string | number>;
  const checkedSet = new Set(checkedKeys.map(key => key.toString()));
  const selectableKeys = allSelectableKeys.value;
  if (selectableKeys.length === 0) {
    isCheckAll.value = false;
    return;
  }
  isCheckAll.value = selectableKeys.every(key => checkedSet.has(key.toString()));
};

/** 获取已勾选的权限 ID */
const getCheckedPermissionIds = () => {
  if (!treeRef.value) return [];
  const checkedKeys = treeRef.value.getCheckedKeys(false) as Array<string | number>;
  const permissionIds = checkedKeys.filter((key): key is number => typeof key === "number");
  return Array.from(new Set(permissionIds));
};

/** 设置权限树展开状态 */
const setTreeExpanded = (isExpanded: boolean) => {
  const nodes = treeRef.value?.store.nodesMap;
  if (!nodes) return;
  for (let i in nodes) {
    nodes[i].expanded = isExpanded;
  }
};

/** 权限树过滤规则 */
const handleFilterNode = (value: string, data: Record<string, any>) => {
  if (!value) return true;
  const name = typeof data.name === "string" ? data.name : "";
  const moduleName = typeof data.moduleName === "string" ? data.moduleName : "";
  const permissionCode = typeof data.permissionCode === "string" ? data.permissionCode : "";
  const permissionAction = typeof data.permissionAction === "string" ? data.permissionAction : "";
  return name.includes(value) || moduleName.includes(value) || permissionCode.includes(value) || permissionAction.includes(value);
};

/** 处理展开/折叠 */
const handleToggleExpandAll = (value: CheckboxValueType) => {
  setTreeExpanded(value === true);
};

/** 处理全选/全不选 */
const handleToggleCheckAll = (value: CheckboxValueType) => {
  if (!treeRef.value) return;
  const isChecked = value === true;
  if (isChecked) {
    setCheckedKeys(allSelectableKeys.value);
  } else {
    setCheckedKeys([]);
  }
};

/** 处理权限过滤关键词变化 */
const handleFilterTextChange = (value: string) => {
  treeRef.value?.filter(value);
  if (!value) return;
  isExpandAll.value = false;
  // Element Plus 会在过滤后自动展开命中节点，下一帧恢复为手动展开。
  window.requestAnimationFrame(() => setTreeExpanded(false));
};

/** 重置权限树状态 */
const resetTreeState = () => {
  filterText.value = "";
  isExpandAll.value = false;
  isCheckAll.value = false;
  treeData.value = [];
  allSelectableKeys.value = [];
  setCheckedKeys([]);
};

/** 监听权限模块变化 */
watch(
  () => props.modules,
  modules => {
    buildPermissionTree(modules || []);
    nextTick(() => {
      handleSyncCheckAllState();
    });
  },
  { immediate: true }
);

/** 监听权限过滤关键词 */
watch(filterText, handleFilterTextChange);

/** 暴露权限树方法 */
defineExpose({ setCheckedKeys, getCheckedPermissionIds, resetTreeState });
</script>

<template>
  <div class="text-[14px] text-[var(--el-text-color-regular)] mb-[8px] leading-[22px]">权限配置</div>
  <div class="flex flex-col gap-2 w-full flex-1">
    <el-input v-model="filterText" placeholder="搜索权限名称" clearable prefix-icon="Search" />
    <div
      class="flex items-center gap-4 px-2 py-1 border border-[var(--el-border-color-lighter)] rounded bg-[var(--el-fill-color-light)]"
    >
      <el-checkbox v-model="isExpandAll" @change="handleToggleExpandAll">展开/折叠</el-checkbox>
      <el-checkbox v-model="isCheckAll" @change="handleToggleCheckAll">全选/全不选</el-checkbox>
    </div>
    <div class="h-[400px] overflow-y-auto border border-solid border-[var(--el-border-color)] rounded p-2">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="isExpandAll"
        :check-strictly="false"
        :filter-node-method="handleFilterNode"
        @check="handleSyncCheckAllState"
      />
    </div>
  </div>
</template>
