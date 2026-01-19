<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createTenantApi, getTenantDetailApi, updateTenantApi } from "@/api/modules";
import { ENABLE_STATUS, ENABLE_STATUS_OPTIONS } from "@/config/modules";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref<{ title: string; type: "Add" | "Edit"; id?: number }>({
  title: "",
  type: "Add"
});

const ruleFormRef = ref<FormInstance>();
type TenantForm = System.ReqTenantCreate & { status?: System.Tenant["status"] };

const ruleForm = reactive<TenantForm>({
  name: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  status: ENABLE_STATUS.ENABLED
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入租户名称", trigger: "blur" }],
  contactName: [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
  contactPhone: [{ required: true, message: "请输入联系人电话", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

/** 获取初始表单数据 */
const getInitialFormData = (): TenantForm => ({
  name: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  status: ENABLE_STATUS.ENABLED
});

/** 提交表单 */
const onSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    loading.value = true;
    try {
      if (parameter.value.type === "Add") {
        await createTenantApi({
          name: ruleForm.name,
          contactName: ruleForm.contactName,
          contactPhone: ruleForm.contactPhone,
          contactEmail: ruleForm.contactEmail,
          address: ruleForm.address,
          status: ruleForm.status ?? ENABLE_STATUS.ENABLED
        });
        ElMessage.success("添加成功");
      } else if (parameter.value.type === "Edit" && parameter.value.id) {
        await updateTenantApi(parameter.value.id, {
          name: ruleForm.name,
          contactName: ruleForm.contactName,
          contactPhone: ruleForm.contactPhone,
          contactEmail: ruleForm.contactEmail,
          address: ruleForm.address,
          status: ruleForm.status ?? ENABLE_STATUS.ENABLED
        });
        ElMessage.success("更新成功");
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
const acceptParams = async (params: { title: string; type: "Add" | "Edit" }, row?: System.Tenant) => {
  parameter.value = { ...params, id: row?.id };
  Object.assign(ruleForm, getInitialFormData());

  if (params.type === "Edit" && row?.id) {
    const result = await getTenantDetailApi(row.id);
    const detail = result.data;
    Object.assign(ruleForm, {
      name: detail.name,
      contactName: detail.contactName,
      contactPhone: detail.contactPhone,
      contactEmail: detail.contactEmail,
      address: detail.address,
      status: detail.status
    });
  }

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
          <el-form-item label="租户名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入租户名称" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input v-model="ruleForm.contactName" placeholder="请输入联系人姓名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="contactPhone">
            <el-input v-model="ruleForm.contactPhone" placeholder="请输入联系人电话" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人邮箱" prop="contactEmail">
            <el-input v-model="ruleForm.contactEmail" placeholder="请输入联系人邮箱" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择状态">
              <el-option v-for="item in ENABLE_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="联系人地址" prop="address">
            <el-input v-model="ruleForm.address" type="textarea" :rows="3" placeholder="请输入联系人地址" maxlength="200" />
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
