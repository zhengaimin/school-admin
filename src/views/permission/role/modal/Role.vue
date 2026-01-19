<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createRoleApi, updateRoleApi, getRoleDetailApi } from "@/api/modules";
import { useUserStore } from "@/stores/modules/user";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref({ title: "", type: "Add" as "Add" | "Edit" });
const userStore = useUserStore();

const roleTypeOptions = [
  { label: "后台管理员", value: "admin" },
  { label: "前台用户", value: "api" }
];

const roleLevelOptions = [
  { label: "超级", value: "super" },
  { label: "平台", value: "platform" },
  { label: "代理商", value: "agent" },
  { label: "自定义", value: "custom" }
];

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<System.ReqRoleCreate & { id?: number }>({
  id: undefined,
  name: "",
  description: "",
  roleType: "admin",
  tenantId: undefined as unknown as number,
  roleLevel: "custom"
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleType: [{ required: true, message: "请选择角色类型", trigger: "change" }],
  tenantId: [{ required: true, message: "请输入租户ID", trigger: "blur" }]
};

/** 获取初始表单数据 */
const getInitialFormData = () => ({
  id: undefined,
  name: "",
  description: "",
  roleType: "admin",
  tenantId: (Number(userStore.userInfo?.tenantId) || undefined) as unknown as number,
  roleLevel: "custom"
});

/** 获取角色详情 */
const fetchRoleDetail = async (id: number) => {
  try {
    const result = await getRoleDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(ruleForm, result.data);
    } else {
      ElMessage.error("获取角色信息失败");
    }
  } catch {
    ElMessage.error("获取角色信息失败");
  }
};

/** 提交表单 */
const onSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    loading.value = true;
    try {
      const { type } = parameter.value;

      if (type === "Add") {
        await createRoleApi({
          name: ruleForm.name,
          description: ruleForm.description,
          roleType: ruleForm.roleType,
          tenantId: ruleForm.tenantId,
          roleLevel: ruleForm.roleLevel
        });
        ElMessage.success("添加成功");
      } else if (type === "Edit" && ruleForm.id) {
        await updateRoleApi(ruleForm.id, { name: ruleForm.name, description: ruleForm.description });
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
const acceptParams = async (params: { title: string; type: "Add" | "Edit" }, row?: System.Role) => {
  parameter.value = { ...params };

  if (params.type === "Add") {
    Object.assign(ruleForm, getInitialFormData());
  } else if (row?.id) {
    await fetchRoleDetail(row.id);
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="500px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入角色名称" maxlength="50" />
      </el-form-item>
      <el-form-item v-if="parameter.type === 'Add'" label="角色类型" prop="roleType">
        <el-select v-model="ruleForm.roleType" placeholder="请选择角色类型" style="width: 100%">
          <el-option v-for="item in roleTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="parameter.type === 'Add'" label="租户ID" prop="tenantId">
        <el-input-number v-model="ruleForm.tenantId" :min="0" placeholder="请输入租户ID" style="width: 100%" />
      </el-form-item>
      <el-form-item v-if="parameter.type === 'Add'" label="角色级别" prop="roleLevel">
        <el-select v-model="ruleForm.roleLevel" placeholder="请选择角色级别" style="width: 100%">
          <el-option v-for="item in roleLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>
