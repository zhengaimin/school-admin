<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick, computed } from "vue";
import { ElMessage } from "element-plus";
import { postCreateOrgDepartmentApi, putUpdateOrgDepartmentApi, getTenantListApi } from "@/api/modules";
import { ORG_DEPARTMENT_STATUS_OPTIONS, ORG_DEPARTMENT_STATUS } from "@/config/modules";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref<{ title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean; id?: number }>({
  title: "",
  type: "Add",
  showConfirm: true
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<System.ReqOrgDepartmentUpdate>({
  tenantId: undefined,
  name: "",
  code: "",
  sort: 0,
  status: ORG_DEPARTMENT_STATUS.ENABLED
});

const tenantList = ref<System.Tenant[]>([]);
const tenantLoading = ref(false);
const tenantKeyword = ref("");

const rules: FormRules = {
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入部门编码", trigger: "blur" }]
};

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");

/** 租户搜索关键字（小写） */
const normalizedTenantKeyword = computed(() => tenantKeyword.value.trim().toLowerCase());
/** 租户关键字匹配 */
function matchTenantKeyword(tenant: System.Tenant, keyword: string) {
  if (!keyword) return true;
  const target = `${tenant.name} ${tenant.code} ${tenant.contactName ?? ""} ${tenant.contactPhone ?? ""}`.toLowerCase();
  return target.includes(keyword);
}
/** 可选租户列表 - 支持模糊搜索 */
const filteredTenants = computed(() => {
  const keyword = normalizedTenantKeyword.value;
  if (!keyword) return tenantList.value;
  return tenantList.value.filter(tenant => matchTenantKeyword(tenant, keyword));
});

/** 获取租户列表 */
async function axiosGetTenantListApi() {
  if (tenantLoading.value) return;
  tenantLoading.value = true;
  try {
    const result = await getTenantListApi({ page: 1, pageSize: 2000 });
    if (result.code === 0) {
      tenantList.value = result.data?.list || [];
    }
    return result;
  } catch (error) {
    console.error(error);
    ElMessage.error("获取租户列表失败");
    return { code: -1, data: null };
  } finally {
    tenantLoading.value = false;
  }
}

/** 确保租户列表已加载 */
async function ensureTenantList() {
  if (tenantList.value.length > 0 || tenantLoading.value) return;
  await axiosGetTenantListApi();
}

/** 租户下拉搜索 */
function handleTenantSearch(query: string) {
  tenantKeyword.value = query.trim();
}

/** 租户下拉展开状态 */
function handleTenantVisibleChange(visible: boolean) {
  if (!visible) tenantKeyword.value = "";
}

/** 获取初始表单数据 */
function getInitialFormData(): System.ReqOrgDepartmentUpdate {
  return {
    tenantId: undefined,
    name: "",
    code: "",
    sort: 0,
    status: ORG_DEPARTMENT_STATUS.ENABLED
  };
}

/** 新增部门接口 */
async function axiosPostCreateOrgDepartmentApi(params: System.ReqOrgDepartmentCreate) {
  try {
    return await postCreateOrgDepartmentApi(params);
  } catch (error) {
    console.error(error);
    return { code: -1, data: null };
  }
}

/** 更新部门接口 */
async function axiosPutUpdateOrgDepartmentApi(id: number, params: System.ReqOrgDepartmentUpdate) {
  try {
    return await putUpdateOrgDepartmentApi(id, params);
  } catch (error) {
    console.error(error);
    return { code: -1, data: null };
  }
}

/** 提交表单 */
async function handleSubmitForm() {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    loading.value = true;
    try {
      const payload: System.ReqOrgDepartmentUpdate = {
        name: ruleForm.name,
        code: ruleForm.code,
        tenantId: ruleForm.tenantId,
        sort: ruleForm.sort,
        status: ruleForm.status
      };
      if (isEdit.value) {
        if (!parameter.value.id) return;
        const result = await axiosPutUpdateOrgDepartmentApi(parameter.value.id, payload);
        if (result.code !== 0) return;
        ElMessage.success("编辑成功");
      } else if (isAdd.value) {
        const result = await axiosPostCreateOrgDepartmentApi(payload);
        if (result.code !== 0) return;
        ElMessage.success("添加成功");
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

/** 接收参数 */
async function acceptParams(
  params: { title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean },
  row?: System.OrgDepartment
) {
  parameter.value = { ...parameter.value, ...params, id: row?.id };
  Object.assign(ruleForm, getInitialFormData());

  if ((isEdit.value || isView.value) && row) {
    Object.assign(ruleForm, {
      tenantId: row.tenantId,
      name: row.name,
      code: row.code,
      sort: row.sort,
      status: row.status
    });
  }

  tenantKeyword.value = "";
  await ensureTenantList();

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="720px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入部门名称" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门编码" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入部门编码" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租户" prop="tenantId">
            <el-select
              v-model="ruleForm.tenantId"
              placeholder="超管可指定，普通用户可不填"
              class="w-full"
              filterable
              clearable
              :loading="tenantLoading"
              :filter-method="handleTenantSearch"
              @visible-change="handleTenantVisibleChange"
            >
              <el-option v-for="tenant in filteredTenants" :key="tenant.id" :label="tenant.name" :value="tenant.id">
                <div class="flex items-center justify-between gap-3 w-full">
                  <span class="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ tenant.name }}</span>
                  <span class="flex-shrink-0 text-[var(--el-text-color-secondary)]">{{ tenant.contactName || "-" }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="ruleForm.sort" :min="0" placeholder="数字越小越靠前" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择状态" class="w-full">
              <el-option
                v-for="item in ORG_DEPARTMENT_STATUS_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
