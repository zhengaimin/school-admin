<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createRoleApi, updateRoleApi, getRoleDetailApi } from "@/api/modules";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref({ title: "", type: "Add" as "Add" | "Edit" });

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<System.ReqRoleSave & { id?: number }>({
  id: undefined,
  name: "",
  description: ""
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
};

/** 获取初始表单数据 */
const getInitialFormData = () => ({
  id: undefined,
  name: "",
  description: ""
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
        await createRoleApi({ name: ruleForm.name, description: ruleForm.description });
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
