<script setup lang="ts" name="hairdryerRateSchoolForm">
import type { FormInstance, FormRules } from "element-plus";
import type { RateFormProps } from "../types";

import { reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { getSchoolDryerRateApi, putSchoolDryerRateApi } from "@/api/modules";

const props = withDefaults(defineProps<RateFormProps>(), {
  schoolId: ""
});

const { schoolName, guardSchool } = useSchool();

const formRef = ref<FormInstance>();
const loading = ref(false);
const submitting = ref(false);
const hasData = ref(false);

const form = reactive({
  rate: null as number | null,
  templateDescription: ""
});

const rules: FormRules = {
  rate: [{ required: true, message: "请输入费率值", trigger: "change" }]
};

const axiosGetSchoolRate = async (): Promise<void> => {
  if (!props.schoolId || props.schoolId === "-1") return;

  loading.value = true;
  try {
    const result = await getSchoolDryerRateApi(Number(props.schoolId));
    const data = result?.data;
    if (data) {
      hasData.value = true;
      form.rate = data.rate ?? null;
      form.templateDescription = data.templateDescription ?? "";
    } else {
      hasData.value = true;
      handleReset();
    }
  } catch {
    hasData.value = true;
    handleReset();
  } finally {
    loading.value = false;
  }
};

const handleReset = (): void => {
  form.rate = null;
  form.templateDescription = "";
  formRef.value?.clearValidate();
};

const handleSubmit = async (): Promise<void> => {
  if (submitting.value) return;
  if (!guardSchool()) return;

  const formEl = formRef.value;
  if (!formEl) return;

  const isValid = await formEl.validate().catch(() => false);
  if (!isValid) return;

  if (form.rate === null) return;

  submitting.value = true;
  try {
    await putSchoolDryerRateApi(Number(props.schoolId), {
      rate: form.rate,
      templateDescription: form.templateDescription,
      status: 1
    });

    ElMessage.success("保存成功");
    axiosGetSchoolRate();
  } catch (error: any) {
    ElMessage.error(error?.msg || error?.message || "保存失败，请重试");
  } finally {
    submitting.value = false;
  }
};

watch(
  () => props.schoolId,
  () => {
    handleReset();
    axiosGetSchoolRate();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full w-full flex flex-col rounded-lg overflow-hidden">
    <el-card shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>费率配置</span>
        </div>
      </template>

      <template v-if="hasData">
        <div class="flex-1 overflow-y-auto p-4">
          <SchoolInfo :name="schoolName" />

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="费率值（元/分钟）" prop="rate">
                  <el-input-number
                    v-model="form.rate"
                    class="w-full"
                    :min="0"
                    :max="999999.99"
                    :precision="2"
                    :step="0.01"
                    :controls="false"
                    placeholder="请输入费率值"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="模板说明" prop="templateDescription">
                  <el-input v-model="form.templateDescription" type="textarea" :rows="3" placeholder="请输入模板说明" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="px-4 pb-4">
          <div class="flex justify-end pt-4 border-t border-gray-200 gap-3">
            <el-button @click="handleReset">重置</el-button>
            <el-button class="ml-[0]!" type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          </div>
        </div>
      </template>

      <template v-else>
        <el-empty description="暂无数据" />
      </template>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-card__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
