<script setup lang="ts">
import type { RateDryer } from "@/api/interface";

import { ref, unref, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import {
  postGradeDryerRatesApi,
  putGradeDryerRateApi,
  getUnconfiguredGradesApi,
  getGradeDryerRateDetailApi
} from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const currentSchoolName = ref("");

const emits = defineEmits(["submit"]);

const visible = ref(false);
const loading = ref(false);
const parameter = ref({
  title: "",
  type: "Add"
});

const editingRateTemplateId = ref<number | null>(null);

const ruleFormRef = ref();
const ruleForm = ref<{
  gradeIds: number[];
  rate: number | null;
  description: string;
}>({
  gradeIds: [],
  rate: null,
  description: ""
});

const gradeOptions = ref<{ id: number; name: string }[]>([]);

const rules = {
  gradeIds: [{ required: true, message: "请选择年级", trigger: "change" }],
  rate: [{ required: true, message: "请输入费率值", trigger: "change" }],
  description: [{ required: true, message: "请输入描述", trigger: "blur" }]
};

const isEdit = computed(() => parameter.value.type === "Edit");

/** 获取年级费率详情 */
const axiosGetGradeDryerRateDetailApi = async (rateTemplateId: number): Promise<RateDryer.IGradeDryerRateItemVo | null> => {
  try {
    const result = await getGradeDryerRateDetailApi(rateTemplateId);
    if (result.code === 0) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("axiosGetGradeDryerRateDetailApi:", error);
    return null;
  }
};
/** 获取可用年级列表（未配置费率的年级） */
const axiosGetGradesOptions = async (): Promise<void> => {
  const id = Number(schoolId.value);
  if (!id || id === -1) return;

  loading.value = true;
  try {
    const result = await getUnconfiguredGradesApi({
      schoolId: id,
      configType: "rate",
      serviceType: "DRYER",
      page: 1,
      pageSize: 100
    });

    if (result.code === 0 && result?.data?.grades?.length) {
      gradeOptions.value = result.data.grades.map(g => ({ id: g.id, name: g.name }));
    }
  } catch {
    gradeOptions.value = [];
  } finally {
    loading.value = false;
  }
};

const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    const form = unref(ruleForm);
    const { type } = unref(parameter);

    if (form.rate === null) return;

    // 添加
    if (type === "Add") {
      await postGradeDryerRatesApi({
        schoolId: Number(schoolId.value),
        gradeIds: form.gradeIds,
        rate: form.rate,
        description: form.description
      });
      ElMessage.success("添加成功");
    }
    // 编辑
    else if (type === "Edit" && unref(editingRateTemplateId)) {
      await putGradeDryerRateApi(unref(editingRateTemplateId)!, {
        gradeIds: form.gradeIds,
        rate: form.rate,
        description: form.description
      });
      ElMessage.success("更新成功");
    }

    visible.value = false;
    emits("submit");
  });
};

const acceptParams = async (params: any, row?: RateDryer.IGradeDryerRateItemVo) => {
  parameter.value = { ...parameter.value, ...params };

  currentSchoolName.value = storeSchoolName.value;

  if (params.type === "Add") {
    editingRateTemplateId.value = null;
    ruleForm.value = {
      gradeIds: [],
      rate: null,
      description: ""
    };
    await axiosGetGradesOptions();
  } else if (row?.rateTemplateID) {
    editingRateTemplateId.value = row.rateTemplateID;
    // Edit 模式：通过详情接口获取数据
    loading.value = true;
    const data = await axiosGetGradeDryerRateDetailApi(row.rateTemplateID);
    if (data) {
      const boundGrades = data.boundGrades ?? [];
      gradeOptions.value = boundGrades.map(g => ({ id: g.gradeId, name: g.gradeName }));
      console.log(
        gradeOptions.value,
        boundGrades.map(g => g.gradeId)
      );
      ruleForm.value = {
        gradeIds: boundGrades.map(g => g.gradeId),
        rate: data.rate,
        description: data.description
      };
    }
    loading.value = false;
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
    <div v-loading="loading">
      <SchoolInfo :name="currentSchoolName" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="适用年级" prop="gradeIds">
              <el-select
                v-model="ruleForm.gradeIds"
                class="w-full"
                multiple
                filterable
                clearable
                :controls="false"
                placeholder="请选择年级"
                :disabled="isEdit"
              >
                <el-option v-for="v in gradeOptions" :key="v.id" :label="v.name" :value="v.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="费率值" prop="rate">
              <el-input-number
                v-model="ruleForm.rate"
                class="w-full"
                :min="0"
                :max="999999.99"
                :precision="2"
                :step="0.01"
                controls-position="right"
                placeholder="请输入费率值"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="onSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
