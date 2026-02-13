<script setup lang="ts">
import type { System } from "@/api/interface";
import type { TRoleLevelValue } from "@/config/modules";
import type { FormInstance, FormRules } from "element-plus";
import type { TUserFormModel, TUserModalParams } from "../types";

import { computed, nextTick, reactive, ref } from "vue";
import {
  getAdminUserDetailApi,
  getOrgDepartmentListApi,
  getRoleListApi,
  getTenantListApi,
  postCreateAdminUserApi,
  putUpdateAdminUserApi
} from "@/api/modules";
import { ElMessage } from "element-plus";
import { ENABLE_STATUS, ENABLE_STATUS_OPTIONS, ROLE_LEVEL, ROLE_LEVEL_I18N, TENANT_TYPE } from "@/config/modules";
import { usePublicKey } from "@/hooks/usePublicKey";
import { useUserStore } from "@/stores/modules/user";

const props = defineProps<{ roleLevel?: TRoleLevelValue }>();
const emit = defineEmits<{ submit: [] }>();

const userStore = useUserStore();
const { publicKey, rsaEncrypt } = usePublicKey();

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗加载状态 */
const loading = ref(false);
/** 初始化状态 */
const initializing = ref(false);
/** 弹窗参数 */
const parameter = ref<TUserModalParams>({ title: "", type: "Add", showConfirm: true });
/** 角色列表 */
const roles = ref<System.Role[]>([]);
/** 角色列表加载状态 */
const rolesLoading = ref(false);
/** 角色列表是否已加载 */
const rolesLoaded = ref(false);
/** 租户列表 */
const tenantList = ref<System.Tenant[]>([]);
/** 租户列表加载状态 */
const tenantLoading = ref(false);
/** 部门列表 */
const departmentList = ref<System.OrgDepartment[]>([]);
/** 部门列表加载状态 */
const departmentLoading = ref(false);
/** 部门搜索关键字 */
const departmentKeyword = ref("");
/** 部门请求标识 */
const departmentRequestId = ref(0);
/** 表单引用 */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = reactive<TUserFormModel>({
  id: undefined,
  username: "",
  password: "",
  realName: "",
  phone: "",
  email: "",
  roleId: undefined as unknown as number,
  tenantId: undefined as unknown as number,
  orgDepartmentId: undefined,
  status: ENABLE_STATUS.ENABLED,
  roleLevel: undefined
});
/** 弹窗上下文账号类型 */
const contextRoleLevel = ref<TRoleLevelValue | undefined>(undefined);
/** 角色搜索关键字 */
const roleKeyword = ref("");
/** 记录上一次账号类型 */
const lastRoleLevel = ref<TRoleLevelValue | undefined>(undefined);

/** 是否为新增模式 */
const isAdd = computed(() => parameter.value.type === "Add");
/** 是否为编辑模式 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 是否为查看模式 */
const isView = computed(() => parameter.value.type === "View");
/** 账号类型是否锁定 */
const isRoleLevelLocked = computed(() => !!contextRoleLevel.value);
/** 是否展示租户选择 */
const shouldShowTenant = computed(() => ruleForm.roleLevel === ROLE_LEVEL.AGENT || ruleForm.roleLevel === ROLE_LEVEL.CUSTOM);
/** 是否展示部门字段 */
const shouldShowDepartment = computed(
  () => !isAdd.value && (ruleForm.roleLevel === ROLE_LEVEL.AGENT || ruleForm.roleLevel === ROLE_LEVEL.CUSTOM)
);
/** 角色是否可选（需先选择租户） */
const isRoleDisabled = computed(() => shouldShowTenant.value && !ruleForm.tenantId);
/** 角色占位提示 */
const rolePlaceholder = computed(() => (isRoleDisabled.value ? "请先选择租户" : "请选择角色"));
/** 账号类型选项 */
const accountTypeOptions = computed(() => {
  let baseOptions = [
    { label: ROLE_LEVEL_I18N[ROLE_LEVEL.AGENT], value: ROLE_LEVEL.AGENT },
    { label: ROLE_LEVEL_I18N[ROLE_LEVEL.CUSTOM], value: ROLE_LEVEL.CUSTOM }
  ];

  if (contextRoleLevel.value === ROLE_LEVEL.PLATFORM) {
    baseOptions = [{ label: ROLE_LEVEL_I18N[ROLE_LEVEL.PLATFORM], value: ROLE_LEVEL.PLATFORM }];
  } else if (contextRoleLevel.value === ROLE_LEVEL.AGENT) {
    baseOptions = [{ label: ROLE_LEVEL_I18N[ROLE_LEVEL.AGENT], value: ROLE_LEVEL.AGENT }];
  } else if (contextRoleLevel.value === ROLE_LEVEL.CUSTOM) {
    baseOptions = [{ label: ROLE_LEVEL_I18N[ROLE_LEVEL.CUSTOM], value: ROLE_LEVEL.CUSTOM }];
  }

  const currentRoleLevel = ruleForm.roleLevel;
  if (currentRoleLevel && !baseOptions.some(option => option.value === currentRoleLevel)) {
    return [...baseOptions, { label: ROLE_LEVEL_I18N[currentRoleLevel] ?? currentRoleLevel, value: currentRoleLevel }];
  }

  return baseOptions;
});
/** 是否存在角色等级 */
const hasRoleLevel = computed(() => roles.value.some(role => role.roleLevel));
/** 角色搜索关键字（小写） */
const normalizedRoleKeyword = computed(() => roleKeyword.value.trim().toLowerCase());
/** 可选角色列表 - 支持模糊搜索 */
const filteredRoles = computed(() => {
  const keyword = normalizedRoleKeyword.value;
  let list = roles.value;
  if (ruleForm.roleLevel && hasRoleLevel.value) {
    list = list.filter(role => role.roleLevel === ruleForm.roleLevel);
  }
  if (!keyword) return list;
  return list.filter(role => matchRoleKeyword(role, keyword));
});
/** 租户选项 */
const tenantOptions = computed(() => {
  if (!shouldShowTenant.value) return [];
  return tenantList.value.filter(tenant => tenant.type === TENANT_TYPE.AGENT);
});

/** 用户名校验：仅支持英文、数字及特殊字符 */
function validateUsername(_rule: unknown, value: string, callback: (error?: Error) => void) {
  if (!value) {
    callback();
    return;
  }
  const pattern = /^[\x21-\x7e]+$/;
  if (!pattern.test(value)) {
    callback(new Error("用户名仅支持英文、数字及特殊字符"));
    return;
  }
  callback();
}
/** 表单校验规则 */
const rules = computed<FormRules>(() => {
  const base: FormRules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { validator: validateUsername, trigger: "blur" }
    ],
    realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
    roleLevel: [{ required: true, message: "请选择账号类型", trigger: "change" }],
    roleId: isRoleDisabled.value ? [] : [{ required: true, message: "请选择角色", trigger: "change" }],
    phone: [
      { required: true, message: "请输入手机号", trigger: "blur" },
      {
        validator: (_rule, value, callback) => {
          if (!value) {
            callback();
            return;
          }
          if (!/^1[3-9]\d{9}$/.test(value)) {
            callback(new Error("请输入正确的手机号"));
            return;
          }
          callback();
        },
        trigger: "blur"
      }
    ],
    email: [{ type: "email", message: "请输入正确的邮箱", trigger: "blur" }]
  };
  if (isAdd.value) {
    base.password = [{ required: true, message: "请输入初始密码", trigger: "blur" }];
  }
  if (shouldShowTenant.value) {
    base.tenantId = [{ required: true, message: "请选择租户名称", trigger: "change" }];
  }
  return base;
});

/** 获取弹窗上下文账号类型 */
function resolveContextRoleLevel(row?: System.AdminUser) {
  const rowRoleLevel = row?.roleLevel as TRoleLevelValue | undefined;
  return rowRoleLevel ?? props.roleLevel;
}
/** 角色关键字匹配 */
function matchRoleKeyword(role: System.Role, keyword: string) {
  if (!keyword) return true;
  const target = `${role.name} ${role.code} ${role.description ?? ""}`.toLowerCase();
  return target.includes(keyword);
}
/** 判断是否为取消请求错误 */
function isCanceledError(error: unknown) {
  const detail = error as { name?: string; code?: string; message?: string } | undefined;
  return detail?.name === "CanceledError" || detail?.code === "ERR_CANCELED";
}
/** 获取平台租户 ID */
function getPlatformTenantId() {
  return tenantList.value.find(item => item.type === TENANT_TYPE.PLATFORM)?.id;
}
/** 获取兜底租户 ID */
function getFallbackTenantId() {
  const tenantId = Number(userStore.userInfo?.tenantId);
  return Number.isFinite(tenantId) && tenantId > 0 ? tenantId : undefined;
}
/** 根据角色 ID 推断账号类型 */
function getRoleLevelFromRole() {
  const currentRole = roles.value.find(role => role.id === ruleForm.roleId);
  return currentRole?.roleLevel as TRoleLevelValue | undefined;
}
/** 确保账号类型已设置 */
function ensureRoleLevel(fallback?: TRoleLevelValue) {
  if (ruleForm.roleLevel) return;
  ruleForm.roleLevel = getRoleLevelFromRole() ?? fallback;
}
/** 获取初始表单数据 */
function getInitialFormData(): TUserFormModel {
  return {
    id: undefined,
    username: "",
    password: "",
    realName: "",
    phone: "",
    email: "",
    roleId: undefined as unknown as number,
    tenantId: undefined as unknown as number,
    orgDepartmentId: undefined,
    status: ENABLE_STATUS.ENABLED,
    roleLevel: undefined
  };
}
/** 构建新增用户参数 */
function buildCreatePayload(form: TUserFormModel, encryptedPassword: string, resolvedTenantId: number): System.ReqUserSave {
  const payload: System.ReqUserSave = {
    username: form.username,
    password: encryptedPassword,
    realName: form.realName,
    roleId: form.roleId,
    tenantId: resolvedTenantId,
    orgDepartmentId: form.roleLevel === ROLE_LEVEL.PLATFORM || isAdd.value ? undefined : form.orgDepartmentId,
    status: form.status
  };
  if (form.phone) {
    payload.phone = form.phone;
  }
  if (form.email) {
    payload.email = form.email;
  }
  return payload;
}
/** 构建更新用户参数 */
function buildUpdatePayload(form: TUserFormModel): System.ReqPutAdminUserUpdateApi {
  return {
    realName: form.realName,
    phone: form.phone,
    email: form.email,
    roleId: typeof form.roleId === "number" ? form.roleId : -1,
    orgDepartmentId: form.orgDepartmentId ?? null,
    status: typeof form.status === "number" ? form.status : -1
  };
}
/** 获取平台租户 ID（优先兜底租户） */
function resolvePlatformTenantId() {
  return getFallbackTenantId() ?? getPlatformTenantId();
}
/** 同步账号类型关联字段 */
async function syncRoleLevelDependencies(roleLevel: TRoleLevelValue | undefined, shouldReset: boolean) {
  if (!roleLevel) return;
  if (roleLevel === ROLE_LEVEL.PLATFORM) {
    if (shouldReset || !ruleForm.tenantId) {
      const resolvedTenantId = resolvePlatformTenantId();
      if (resolvedTenantId) {
        ruleForm.tenantId = resolvedTenantId as number;
      }
    }
    ruleForm.orgDepartmentId = undefined;
    if (shouldReset) {
      ruleForm.roleId = undefined as unknown as number;
    }
    return;
  }

  if (shouldReset) {
    ruleForm.tenantId = undefined as unknown as number;
    ruleForm.roleId = undefined as unknown as number;
  }
}
/** 初始化账号类型状态 */
async function initRoleLevelState(value: TRoleLevelValue | undefined) {
  await syncRoleLevelDependencies(value, false);
  lastRoleLevel.value = value;
}

/** 获取角色列表 */
async function axiosGetRoleListApi(tenantId?: number) {
  if (rolesLoading.value) return { code: -1, data: null };
  const resolvedTenantId = Number(tenantId ?? ruleForm.tenantId);
  if (!Number.isFinite(resolvedTenantId) || resolvedTenantId <= 0) {
    roles.value = [];
    rolesLoaded.value = false;
    return { code: -1, data: null };
  }
  rolesLoading.value = true;
  try {
    const result = await getRoleListApi({ page: 1, pageSize: 2000, tenantId: resolvedTenantId }, { loading: false });
    if (result.code === 0) {
      roles.value = result.data?.list || [];
      rolesLoaded.value = true;
    }
    return result;
  } catch (error) {
    console.error("axiosGetRoleListApi:", error);
    return { code: -1, data: null };
  } finally {
    rolesLoading.value = false;
  }
}
/** 获取租户列表 */
async function axiosGetTenantListApi() {
  if (tenantLoading.value) return { code: -1, data: null };
  tenantLoading.value = true;
  try {
    const result = await getTenantListApi({ page: 1, pageSize: 2000 });
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
}
/** 获取部门列表 */
async function axiosGetDepartmentListApi(keyword?: string) {
  const requestId = ++departmentRequestId.value;
  departmentLoading.value = true;
  try {
    const params: System.ReqOrgDepartmentList = { page: 1, pageSize: 10 };
    if (ruleForm.tenantId) {
      params.tenantId = ruleForm.tenantId;
    }
    if (keyword) {
      params.name = keyword;
    }
    const result = await getOrgDepartmentListApi(params, { loading: false });
    if (requestId === departmentRequestId.value && result.code === 0) {
      departmentList.value = result.data?.list || [];
    }
    return result;
  } catch (error) {
    if (isCanceledError(error)) {
      return { code: -1, data: null };
    }
    if (requestId === departmentRequestId.value) {
      departmentList.value = [];
    }
    console.error("axiosGetDepartmentListApi:", error);
    ElMessage.error("获取部门列表失败");
    return { code: -1, data: null };
  } finally {
    if (requestId === departmentRequestId.value) {
      departmentLoading.value = false;
    }
  }
}
/** 获取用户详情 */
async function axiosGetAdminUserDetailApi(id: number) {
  try {
    const result = await getAdminUserDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(ruleForm, result.data);
      ruleForm.password = ""; // 编辑时不显示密码
    } else {
      ElMessage.error("获取用户信息失败");
    }
    return result;
  } catch (error) {
    console.error("axiosGetAdminUserDetailApi:", error);
    ElMessage.error("获取用户信息失败");
    return { code: -1, data: null };
  }
}
/** 新增用户 */
async function axiosPostCreateAdminUserApi(form: TUserFormModel) {
  try {
    const resolvedTenantId = Number(form.tenantId);
    if (!Number.isFinite(resolvedTenantId) || resolvedTenantId <= 0) {
      if (form.roleLevel === ROLE_LEVEL.PLATFORM) {
        ElMessage.warning("未找到平台商户");
      } else {
        ElMessage.warning("请选择租户名称");
      }
      return { code: -1, data: null };
    }
    if (!form.password) {
      ElMessage.warning("请输入初始密码");
      return { code: -1, data: null };
    }
    if (!publicKey.value) {
      ElMessage.error("公钥未加载，请稍后重试");
      return { code: -1, data: null };
    }
    const encryptedPassword = rsaEncrypt(form.password);
    if (!encryptedPassword) {
      ElMessage.error("密码加密失败");
      return { code: -1, data: null };
    }
    const payload = buildCreatePayload(form, encryptedPassword, resolvedTenantId);
    const result = await postCreateAdminUserApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostCreateAdminUserApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新用户 */
async function axiosPutUpdateAdminUserApi(id: number, form: TUserFormModel) {
  try {
    const payload = buildUpdatePayload(form);
    const result = await putUpdateAdminUserApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateAdminUserApi:", error);
    return { code: -1, data: null };
  }
}

/** 角色下拉搜索 */
function handleRoleSearch(query: string) {
  roleKeyword.value = query.trim();
}
/** 角色下拉展开状态 */
function handleRoleVisibleChange(visible: boolean) {
  if (!visible) roleKeyword.value = "";
}
/** 部门下拉搜索 */
function handleDepartmentSearch(query: string) {
  departmentKeyword.value = query.trim();
  axiosGetDepartmentListApi(departmentKeyword.value);
}
/** 部门下拉展开状态 */
function handleDepartmentVisibleChange(visible: boolean) {
  if (!visible) {
    departmentKeyword.value = "";
    return;
  }
  axiosGetDepartmentListApi();
}
/** 账号类型变化处理 */
async function handleRoleLevelChange(value: TRoleLevelValue | undefined) {
  if (!value || initializing.value) return;
  const previous = lastRoleLevel.value;
  const shouldReset = previous !== value;
  lastRoleLevel.value = value;
  await syncRoleLevelDependencies(value, shouldReset);
  await axiosGetRoleListApi();
}
/** 租户变化处理 */
async function handleTenantChange() {
  if (initializing.value) return;
  ruleForm.roleId = undefined as unknown as number;
  await axiosGetRoleListApi();
}
/** 提交表单 */
async function handleSubmitForm() {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    loading.value = true;
    try {
      if (isAdd.value) {
        await axiosPostCreateAdminUserApi(ruleForm);
      } else if (isEdit.value && ruleForm.id) {
        await axiosPutUpdateAdminUserApi(ruleForm.id, ruleForm);
      }

      visible.value = false;
      emit("submit");
    } catch {
      // 错误已由拦截器处理
    } finally {
      loading.value = false;
    }
  });
}
/** 构建空响应 */
function buildEmptyResult() {
  return { code: 0, msg: "success", data: null };
}
/** 初始化编辑详情 */
async function initEditDetail(row?: System.AdminUser) {
  if (!isEdit.value || !row?.id) return;
  await axiosGetAdminUserDetailApi(row.id);
  ensureRoleLevel(contextRoleLevel.value);
  await initRoleLevelState(ruleForm.roleLevel);
}
/** 初始化角色列表 */
async function initRoleList(detailPromise: Promise<void>, tenantPromise: Promise<unknown>) {
  await detailPromise;
  if (ruleForm.roleLevel === ROLE_LEVEL.PLATFORM && !ruleForm.tenantId) {
    await tenantPromise;
    await syncRoleLevelDependencies(ruleForm.roleLevel, false);
  }
  return axiosGetRoleListApi();
}
/** 初始化部门列表 */
async function initDepartmentList(detailPromise: Promise<void>) {
  await detailPromise;
  if (!shouldShowDepartment.value) {
    departmentList.value = [];
    return buildEmptyResult();
  }
  return axiosGetDepartmentListApi();
}
/** 接收参数 */
async function acceptParams(params: TUserModalParams, row?: System.AdminUser) {
  parameter.value = { ...parameter.value, ...params };
  initializing.value = true;
  roleKeyword.value = "";
  departmentKeyword.value = "";
  contextRoleLevel.value = resolveContextRoleLevel(row);

  if (isAdd.value) {
    Object.assign(ruleForm, getInitialFormData());
    ruleForm.roleLevel = contextRoleLevel.value ?? ROLE_LEVEL.AGENT;
    await initRoleLevelState(ruleForm.roleLevel);
  }

  const tenantPromise = tenantList.value.length === 0 ? axiosGetTenantListApi() : Promise.resolve(buildEmptyResult());
  const detailPromise = initEditDetail(row);
  const rolePromise = initRoleList(detailPromise, tenantPromise);
  const departmentPromise = initDepartmentList(detailPromise);

  await Promise.all([tenantPromise, detailPromise, rolePromise, departmentPromise]);

  initializing.value = false;
  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="600px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col v-if="isAdd" :span="12">
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号类型" prop="roleLevel">
            <el-select
              v-model="ruleForm.roleLevel"
              placeholder="请选择账号类型"
              class="w-full"
              :disabled="isRoleLevelLocked"
              @change="handleRoleLevelChange"
            >
              <el-option v-for="item in accountTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col v-if="shouldShowTenant" :span="24">
          <div class="grid grid-cols-2 gap-6">
            <el-form-item label="租户" prop="tenantId">
              <el-select
                v-model="ruleForm.tenantId"
                placeholder="请选择租户"
                class="w-full"
                filterable
                :loading="tenantLoading"
                @change="handleTenantChange"
              >
                <el-option v-for="tenant in tenantOptions" :key="tenant.id" :label="tenant.name" :value="tenant.id">
                  <div class="tenant-option">
                    <span class="tenant-option__name">{{ tenant.name }}</span>
                    <span class="tenant-option__contact">{{ tenant.contactName || "-" }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select
                v-model="ruleForm.roleId"
                :placeholder="rolePlaceholder"
                class="w-full"
                :loading="rolesLoading"
                :disabled="isRoleDisabled"
                filterable
                :filter-method="handleRoleSearch"
                @visible-change="handleRoleVisibleChange"
              >
                <el-option v-for="role in filteredRoles" :key="role.id" :label="role.name" :value="role.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="ruleForm.roleId"
              :placeholder="rolePlaceholder"
              class="w-full"
              :loading="rolesLoading"
              :disabled="isRoleDisabled"
              filterable
              :filter-method="handleRoleSearch"
              @visible-change="handleRoleVisibleChange"
            >
              <el-option v-for="role in filteredRoles" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="shouldShowDepartment" :span="12">
          <el-form-item label="所属部门" prop="orgDepartmentId">
            <el-select
              v-model="ruleForm.orgDepartmentId"
              placeholder="请选择部门"
              class="w-full"
              filterable
              remote
              clearable
              :loading="departmentLoading"
              :remote-method="handleDepartmentSearch"
              @visible-change="handleDepartmentVisibleChange"
            >
              <el-option
                v-for="department in departmentList"
                :key="department.id"
                :label="department.name"
                :value="department.id"
              >
                <div class="flex items-center justify-between gap-3 w-full">
                  <span class="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ department.name }}</span>
                  <span class="flex-shrink-0 text-[var(--el-text-color-secondary)]">{{ department.code }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择状态" class="w-full">
              <el-option v-for="item in ENABLE_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tenant-option {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.tenant-option__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tenant-option__contact {
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
}
</style>
