<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { RoleModalParams } from "../types";

import { computed, nextTick, reactive, ref, watch } from "vue";
import { getPermissionModulesApi, getRoleDetailApi, getTenantListApi, postCreateRoleApi, putUpdateRoleApi } from "@/api/modules";
import RolePermissionTree from "../components/RolePermissionTree.vue";
import { ENABLE_STATUS, ENABLE_STATUS_OPTIONS, ROLE_LEVEL, ROLE_LEVEL_OPTIONS, ROLE_TYPE, TENANT_TYPE } from "@/config/modules";
import { normalizePermissionModules } from "@/stores/modules/auth";
import { ElMessage } from "element-plus";

const emit = defineEmits<{ submit: [] }>();

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗加载状态 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<RoleModalParams>({ title: "", type: "Add", showConfirm: true });
/** 租户列表加载状态 */
const tenantLoading = ref(false);
/** 租户列表 */
const tenantList = ref<System.Tenant[]>([]);
/** 权限树实例 */
const permissionTreeRef = ref<InstanceType<typeof RolePermissionTree>>();
/** 权限模块列表 */
const permissionModules = ref<System.PermissionModule[]>([]);
/** 权限模块加载状态 */
const permissionModulesLoading = ref(false);
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = reactive<System.ReqRoleCreate & { id?: number; status?: System.Role["status"] }>({
  id: undefined,
  name: "",
  description: "",
  roleType: ROLE_TYPE.ADMIN,
  tenantId: undefined,
  roleLevel: undefined,
  permissionIds: [],
  status: ENABLE_STATUS.ENABLED
});

/** 是否为新增态 */
const isAdd = computed(() => parameter.value.type === "Add");
/** 是否为编辑态 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 是否为查看态 */
const isView = computed(() => parameter.value.type === "View");
/** 账号类型选项 */
const accountTypeOptions = computed(() => {
  if (isEdit.value && ruleForm.roleLevel === ROLE_LEVEL.SUPER) {
    return ROLE_LEVEL_OPTIONS;
  }
  return ROLE_LEVEL_OPTIONS.filter(option => option.value !== ROLE_LEVEL.SUPER);
});
/** 是否需要显示租户 */
const shouldShowTenant = computed(() => ruleForm.roleLevel === ROLE_LEVEL.AGENT || ruleForm.roleLevel === ROLE_LEVEL.CUSTOM);
/** 表单校验规则 */
const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleLevel: [{ required: true, message: "请选择账号类型", trigger: "change" }],
  tenantId: [{ required: true, message: "请选择租户", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
}));

/** 获取平台租户 ID */
const getPlatformTenantId = () => tenantList.value.find(item => item.type === TENANT_TYPE.PLATFORM)?.id;
/** 获取初始表单数据 */
const getInitialFormData = () => ({
  id: undefined,
  name: "",
  description: "",
  roleType: ROLE_TYPE.ADMIN,
  tenantId: undefined,
  roleLevel: undefined,
  permissionIds: [],
  status: ENABLE_STATUS.ENABLED
});
/** 确保租户列表已加载 */
const ensureTenantList = async () => {
  if (tenantList.value.length > 0) return;
  await axiosGetTenantListApi();
};

/** 获取租户列表 */
const axiosGetTenantListApi = async () => {
  if (tenantLoading.value) {
    return { code: 0, data: { list: tenantList.value } };
  }

  tenantLoading.value = true;
  try {
    const result = await getTenantListApi({ page: 1, pageSize: 2000 }, { loading: false });
    if (result.code === 0) {
      tenantList.value = result.data?.list || [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetTenantListApi:", error);
    ElMessage.error("获取租户列表失败");
    return { code: -1, data: null };
  } finally {
    tenantLoading.value = false;
  }
};
/** 获取权限模块列表 */
const axiosGetPermissionModulesApi = async () => {
  permissionModulesLoading.value = true;
  try {
    const modulesRes = await getPermissionModulesApi(ruleForm.roleLevel ? { roleLevel: ruleForm.roleLevel } : undefined, {
      loading: false
    });
    const modules = normalizePermissionModules(modulesRes);
    permissionModules.value = modules;
  } catch (error) {
    console.error("axiosGetPermissionModulesApi error", error);
    permissionModules.value = [];
  } finally {
    permissionModulesLoading.value = false;
  }
};
/** 获取角色详情 */
const axiosGetRoleDetailApi = async (id: number) => {
  try {
    const result = await getRoleDetailApi(id);
    if (result.code === 0 && result.data) {
      const roleData = result.data as System.ResGetRoleDetailApi;
      const permissionIds = Array.isArray(roleData.permissionIds)
        ? roleData.permissionIds.filter((item): item is number => typeof item === "number")
        : [];
      Object.assign(ruleForm, roleData);
      ruleForm.permissionIds = permissionIds;
    } else {
      ElMessage.error("获取角色信息失败");
    }
  } catch {
    ElMessage.error("获取角色信息失败");
  }
};

/** 处理账号类型变化 */
const handleRoleLevelChange = async (value: System.ReqRoleCreate["roleLevel"]) => {
  if (isAdd.value) {
    // 新增时切换账号类型需要刷新权限模块
    await axiosGetPermissionModulesApi();
  }

  if (!isAdd.value) return;
  if (value === ROLE_LEVEL.AGENT || value === ROLE_LEVEL.CUSTOM) {
    await ensureTenantList();
    ruleForm.tenantId = undefined;
    return;
  }
  if (value === ROLE_LEVEL.PLATFORM) {
    await ensureTenantList();
    ruleForm.tenantId = getPlatformTenantId();
    return;
  }
  ruleForm.tenantId = undefined;
};
/** 提交表单 */
const handleSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    // 收集勾选的权限
    const permissionIds = permissionTreeRef.value?.getCheckedPermissionIds() ?? [];

    loading.value = true;
    try {
      if (isAdd.value) {
        if (ruleForm.roleLevel === ROLE_LEVEL.SUPER) {
          ElMessage.warning("超级管理员不能添加角色");
          return;
        }
        const payload: System.ReqRoleCreate = {
          name: ruleForm.name,
          description: ruleForm.description,
          roleType: ROLE_TYPE.ADMIN,
          roleLevel: ruleForm.roleLevel,
          permissionIds // 附带权限
        };
        if (shouldShowTenant.value && ruleForm.tenantId) {
          payload.tenantId = ruleForm.tenantId;
        }
        if (ruleForm.roleLevel === ROLE_LEVEL.PLATFORM) {
          await ensureTenantList();
          const platformTenantId = getPlatformTenantId();
          if (!platformTenantId) {
            ElMessage.warning("未找到平台运营方租户");
            return;
          }
          payload.tenantId = platformTenantId;
        }
        await postCreateRoleApi(payload);
        ElMessage.success("添加成功");
      } else if (isEdit.value && ruleForm.id) {
        // 更新角色信息
        const payload: Partial<System.ReqRoleSave> = {
          name: ruleForm.name,
          description: ruleForm.description,
          status: ruleForm.status ?? ENABLE_STATUS.ENABLED,
          permissionIds
        };
        if (shouldShowTenant.value) {
          payload.tenantId = ruleForm.tenantId;
        }
        await putUpdateRoleApi(ruleForm.id, payload);
        ElMessage.success("编辑成功");
      }

      visible.value = false;
      emit("submit");
    } catch {
      // 错误已由拦截器处理
    } finally {
      loading.value = false;
    }
  });
};

/** 接收参数 */
const acceptParams = async (params: RoleModalParams, row?: System.Role) => {
  parameter.value = { ...params };
  let checkedIds: number[] = [];

  if (isAdd.value) {
    Object.assign(ruleForm, getInitialFormData());
    // 首次加载权限模块（可能无 roleLevel 或默认值）
    await axiosGetPermissionModulesApi();
  } else if ((isEdit.value || isView.value) && row?.id) {
    // 编辑时加载角色详情与权限
    await axiosGetRoleDetailApi(row.id);
    if (shouldShowTenant.value) {
      await ensureTenantList();
    }

    // 根据角色等级加载权限模块
    await axiosGetPermissionModulesApi();

    checkedIds = Array.isArray(ruleForm.permissionIds)
      ? ruleForm.permissionIds.filter((item): item is number => typeof item === "number")
      : [];
  }

  visible.value = true;
  nextTick(() => {
    permissionTreeRef.value?.setCheckedKeys(checkedIds);
    ruleFormRef.value?.clearValidate();
  });
};

/** 监听账号类型变化 */
watch(() => ruleForm.roleLevel, handleRoleLevelChange);

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="1000px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <!-- 基础信息 -->
        <el-col :span="12" class="min-w-0">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入角色名称" maxlength="50" />
          </el-form-item>
          <el-form-item label="账号类型" prop="roleLevel">
            <el-select
              v-model="ruleForm.roleLevel"
              placeholder="请选择账号类型"
              class="w-full"
              :disabled="isEdit || tenantLoading"
            >
              <el-option v-for="item in accountTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="shouldShowTenant" label="租户" prop="tenantId">
            <el-select
              v-model="ruleForm.tenantId"
              placeholder="请选择租户"
              class="w-full"
              filterable
              :loading="tenantLoading"
              :disabled="isEdit || tenantLoading"
            >
              <el-option v-for="tenant in tenantList" :key="tenant.id" :label="tenant.name" :value="tenant.id">
                <div class="flex items-center justify-between gap-3 w-full">
                  <span class="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ tenant.name }}</span>
                  <span class="flex-shrink-0 text-[var(--el-text-color-secondary)]">{{ tenant.contactName || "-" }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isEdit" label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status" class="w-full">
              <el-radio v-for="item in ENABLE_STATUS_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <!-- 权限配置 -->
        <el-col :span="12" class="min-w-0">
          <div v-loading="permissionModulesLoading" class="min-h-[320px] w-full">
            <RolePermissionTree ref="permissionTreeRef" :modules="permissionModules" />
          </div>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>
