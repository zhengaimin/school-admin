<script setup lang="ts">
import type { SchoolDeviceConfig } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, unref, nextTick, computed } from "vue";
import { ElMessage } from "element-plus";
import { putSchoolDeviceConfigApi } from "@/api/modules/device/config";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { ENABLE_STATUS } from "@/config/modules";

const emits = defineEmits<{
  submit: [];
}>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<Partial<SchoolDeviceConfig.ISchoolDeviceConfigItem>>({});

const rules: FormRules = {
  customName: [{ required: false, message: "请输入自定义名称", trigger: "blur" }],
  sortOrder: [{ required: false, message: "请输入显示排序", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");

/** 提交表单 */
const onSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || loading.value) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(ruleForm);

      if (!form.id) {
        ElMessage.error("配置ID不存在");
        return;
      }

      try {
        loading.value = true;
        await putSchoolDeviceConfigApi(form.id, {
          customName: form.customName,
          sortOrder: form.sortOrder ?? undefined,
          description: form.description,
          status: form.status
        });
        ElMessage.success("编辑成功");
        visible.value = false;
        emits("submit");
      } catch (error) {
        console.error("提交失败", error);
      } finally {
        loading.value = false;
      }
    }
  });
};

/** 接收参数 */
const acceptParams = async (params: TModalParams, row?: SchoolDeviceConfig.ISchoolDeviceConfigItem) => {
  parameter.value = { ...parameter.value, ...params };

  if ((isEdit.value || isView.value) && row) {
    ruleForm.value = {
      id: row.id,
      schoolName: row.schoolName || "",
      customName: row.customName || "",
      sortOrder: row.sortOrder ?? 0,
      description: row.description || "",
      status: row.status ?? ENABLE_STATUS.ENABLED
    };
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <SchoolInfo :name="ruleForm.schoolName || ''" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="自定义名称" prop="customName">
            <el-input v-model="ruleForm.customName" placeholder="请输入自定义名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sortOrder">
            <el-input-number
              v-model="ruleForm.sortOrder"
              :min="0"
              :max="9999"
              :value-on-clear="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :value="ENABLE_STATUS.ENABLED">启用</el-radio>
              <el-radio :value="ENABLE_STATUS.DISABLED">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备描述" prop="description">
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              placeholder="请输入设备描述"
              :rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="onSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
