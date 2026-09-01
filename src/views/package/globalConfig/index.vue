<script setup lang="ts" name="platformGlobalConfig">
import type { FormInstance, FormRules } from "element-plus";

import { onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";

import { getGlobalConfigApi, getSchoolConfigApi, putUpdateGlobalConfigApi, putUpdateSchoolConfigApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";

const { hasSchool, schoolId, schoolName } = useSchool();

/** 表单实例 */
const formRef = ref<FormInstance>();
/** 页面加载状态 */
const loading = ref(false);
/** 提交状态 */
const submitting = ref(false);
/** 学校配置加载状态 */
const schoolLoading = ref(false);
/** 学校配置提交状态 */
const schoolSubmitting = ref(false);
/** 表单数据 */
const form = reactive({
  refundCurrentMonthPercent: 100
});
/** 学校配置表单数据 */
const schoolForm = reactive({
  packageByGrade: false,
  showRemainingMinutes: true,
  refundEnabled: false
});
/** 表单校验规则 */
const rules: FormRules = {
  refundCurrentMonthPercent: [
    { required: true, message: "请输入退款当月扣除比例", trigger: "blur" },
    { type: "number", min: 0, max: 100, message: "比例范围为 0 到 100", trigger: "blur" }
  ]
};

/** 获取全局配置 */
async function axiosGetGlobalConfigApi(): Promise<void> {
  loading.value = true;
  try {
    const result = await getGlobalConfigApi();
    if (result.code === 0 && result.data) {
      const percent = Number(result.data.refundCurrentMonthPercent);
      form.refundCurrentMonthPercent = Number.isFinite(percent) ? percent : 100;
    }
  } catch (error) {
    console.error("axiosGetGlobalConfigApi:", error);
    ElMessage.error("获取配置失败");
  } finally {
    loading.value = false;
  }
}

/** 更新全局配置 */
async function axiosPutUpdateGlobalConfigApi(): Promise<boolean> {
  try {
    const result = await putUpdateGlobalConfigApi({
      refundCurrentMonthPercent: String(form.refundCurrentMonthPercent)
    });
    if (result.code !== 0) return false;
    ElMessage.success("保存成功");
    return true;
  } catch (error) {
    console.error("axiosPutUpdateGlobalConfigApi:", error);
    ElMessage.error("保存配置失败");
    return false;
  }
}

/** 重置学校配置表单 */
function resetSchoolConfigForm(): void {
  Object.assign(schoolForm, {
    packageByGrade: false,
    showRemainingMinutes: true,
    refundEnabled: false
  });
}

/** 获取学校配置 */
async function axiosGetSchoolConfigApi(): Promise<void> {
  if (!hasSchool.value) {
    resetSchoolConfigForm();
    return;
  }

  const targetSchoolId = Number(schoolId.value);
  if (!Number.isInteger(targetSchoolId) || targetSchoolId <= 0) return;

  schoolLoading.value = true;
  try {
    const result = await getSchoolConfigApi(targetSchoolId);
    if (result.code === 0 && result.data) {
      Object.assign(schoolForm, {
        packageByGrade: result.data.packageByGrade ?? false,
        showRemainingMinutes: result.data.showRemainingMinutes ?? true,
        refundEnabled: result.data.refundEnabled ?? false
      });
    } else {
      resetSchoolConfigForm();
    }
  } catch (error) {
    console.error("axiosGetSchoolConfigApi:", error);
    ElMessage.error("获取学校配置失败");
    resetSchoolConfigForm();
  } finally {
    schoolLoading.value = false;
  }
}

/** 更新学校配置 */
async function axiosPutUpdateSchoolConfigApi(): Promise<boolean> {
  const targetSchoolId = Number(schoolId.value);
  if (!Number.isInteger(targetSchoolId) || targetSchoolId <= 0) return false;

  try {
    const result = await putUpdateSchoolConfigApi(targetSchoolId, {
      packageByGrade: schoolForm.packageByGrade,
      showRemainingMinutes: schoolForm.showRemainingMinutes,
      refundEnabled: schoolForm.refundEnabled
    });
    if (result.code !== 0) return false;
    ElMessage.success("学校配置保存成功");
    return true;
  } catch (error) {
    console.error("axiosPutUpdateSchoolConfigApi:", error);
    ElMessage.error("保存学校配置失败");
    return false;
  }
}

/** 提交全局配置 */
async function handleSubmit(): Promise<void> {
  if (submitting.value) return;
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    await axiosPutUpdateGlobalConfigApi();
  } finally {
    submitting.value = false;
  }
}

/** 提交学校配置 */
async function handleSubmitSchoolConfig(): Promise<void> {
  if (schoolSubmitting.value || !hasSchool.value) {
    if (!hasSchool.value) ElMessage.warning("请先选择学校");
    return;
  }

  schoolSubmitting.value = true;
  try {
    await axiosPutUpdateSchoolConfigApi();
  } finally {
    schoolSubmitting.value = false;
  }
}

onMounted(() => {
  void axiosGetGlobalConfigApi();
});

watch(
  schoolId,
  () => {
    void axiosGetSchoolConfigApi();
  },
  { immediate: true }
);
</script>

<template>
  <div class="h-full flex flex-col gap-4 overflow-y-auto">
    <el-card v-loading="loading" shadow="never">
      <template #header>
        <span>配置</span>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="退款当月扣除比例（%）" prop="refundCurrentMonthPercent">
              <el-input-number
                v-model="form.refundCurrentMonthPercent"
                class="w-full"
                :min="0"
                :max="100"
                :step="0.01"
                :precision="2"
                controls-position="right"
                placeholder="请输入比例"
              />
              <div class="text-gray-400 text-xs leading-5 mt-1">范围为 0 到 100，未配置时默认为 100</div>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-end pt-4 border-t border-gray-200">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card v-loading="schoolLoading" shadow="never">
      <template #header>
        <span>学校配置</span>
      </template>

      <template v-if="hasSchool">
        <el-form label-position="top">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="当前学校">
                <el-input :model-value="schoolName || `学校 ${schoolId}`" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="套餐按年级区分">
                <el-switch v-model="schoolForm.packageByGrade" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="展示剩余分钟">
                <el-switch v-model="schoolForm.showRemainingMinutes" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开启退款功能">
                <el-switch v-model="schoolForm.refundEnabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex justify-end pt-4 border-t border-gray-200">
            <el-button type="primary" :loading="schoolSubmitting" @click="handleSubmitSchoolConfig">保存</el-button>
          </div>
        </el-form>
      </template>
      <el-empty v-else description="请先选择学校" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
