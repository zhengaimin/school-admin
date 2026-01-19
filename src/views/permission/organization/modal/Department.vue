<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createOrgDepartmentApi } from "@/api/modules";
import { ORG_DEPARTMENT_STATUS_OPTIONS, ORG_DEPARTMENT_STATUS } from "@/config/modules";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref({ title: "", type: "Add" });

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<System.ReqOrgDepartmentCreate>({
  tenantId: undefined,
  parentId: null,
  name: "",
  code: "",
  leaderId: null,
  sort: 0,
  status: ORG_DEPARTMENT_STATUS.ENABLED
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入部门编码", trigger: "blur" }]
};

/** 获取初始表单数据 */
const getInitialFormData = (): System.ReqOrgDepartmentCreate => ({
  tenantId: undefined,
  parentId: null,
  name: "",
  code: "",
  leaderId: null,
  sort: 0,
  status: ORG_DEPARTMENT_STATUS.ENABLED
});

/** 提交表单 */
const onSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    loading.value = true;
    try {
      const payload: System.ReqOrgDepartmentCreate = {
        name: ruleForm.name,
        code: ruleForm.code,
        tenantId: ruleForm.tenantId,
        parentId: ruleForm.parentId ?? null,
        leaderId: ruleForm.leaderId ?? null,
        sort: ruleForm.sort,
        status: ruleForm.status
      };
      await createOrgDepartmentApi(payload);
      ElMessage.success("添加成功");
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
const acceptParams = async (params: { title: string; type: "Add" }) => {
  parameter.value = { ...params };
  Object.assign(ruleForm, getInitialFormData());

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="720px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
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
          <el-form-item label="父部门ID" prop="parentId">
            <el-input-number v-model="ruleForm.parentId" :min="0" placeholder="不填表示顶级部门" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人ID" prop="leaderId">
            <el-input-number v-model="ruleForm.leaderId" :min="0" placeholder="请输入负责人ID" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租户ID" prop="tenantId">
            <el-input-number v-model="ruleForm.tenantId" :min="0" placeholder="超管可指定，普通用户可不填" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="ruleForm.sort" :min="0" placeholder="数字越小越靠前" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择状态" style="width: 100%">
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
      <el-button type="primary" :loading="loading" @click="onSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
