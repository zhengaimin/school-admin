<script setup lang="ts">
import type { System } from "@/api/interface";

import { ref, nextTick } from "vue";
import { ElMessage, ElTree } from "element-plus";
import { getPermissionModulesApi, getRolePermissionsApi, setRolePermissionsApi } from "@/api/modules";

const visible = ref(false);
const loading = ref(false);
const roleId = ref<number>(0);
const roleName = ref("");

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<any[]>([]);

const defaultProps = {
  children: "children",
  label: "name"
};

/** 转换权限模块为树形数据 */
const transformToTreeData = (modules: System.PermissionModule[]) => {
  return modules.map(module => ({
    id: `module-${module.moduleKey}`,
    name: module.moduleName,
    children: module.permissions.map(perm => ({
      id: perm.id,
      name: perm.name,
      code: perm.code
    }))
  }));
};

/** 接收参数 */
const acceptParams = async (params: { roleId: number; roleName: string }) => {
  roleId.value = params.roleId;
  roleName.value = params.roleName;
  visible.value = true;
  loading.value = true;

  try {
    // 获取所有权限模块
    const modulesRes = await getPermissionModulesApi();
    treeData.value = transformToTreeData(modulesRes.data?.modules || []);

    // 获取角色已有权限
    const permRes = await getRolePermissionsApi(roleId.value);
    const checkedIds = permRes.data || [];

    nextTick(() => {
      // 设置选中的权限（只设置叶子节点）
      treeRef.value?.setCheckedKeys(checkedIds, false);
    });
  } catch {
    ElMessage.error("获取权限数据失败");
  } finally {
    loading.value = false;
  }
};

/** 提交保存 */
const onSubmit = async () => {
  if (!treeRef.value) return;

  // 获取所有选中的叶子节点（真正的权限ID）
  const checkedKeys = treeRef.value.getCheckedKeys(false) as (number | string)[];
  // 过滤掉模块节点（字符串ID），只保留权限ID（数字）
  const permissionIds = checkedKeys.filter(key => typeof key === "number") as number[];

  loading.value = true;
  try {
    await setRolePermissionsApi(roleId.value, { permissionIds });
    ElMessage.success("权限配置成功");
    visible.value = false;
  } catch {
    // 错误已由拦截器处理
  } finally {
    loading.value = false;
  }
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="`权限配置 - ${roleName}`" width="500px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="permission-tree">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        check-strictly
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.permission-tree {
  max-height: 400px;
  padding: 10px 0;
  overflow-y: auto;
}
</style>
