<script setup lang="ts">
import type { GradePackage, GradeGeneralPackage } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, unref, nextTick, computed } from "vue";
import { ElMessage } from "element-plus";
import { DEVICE_TYPE, DEVICE_TYPE_OPTIONS, PACKAGE_STATUS, GRADE_CONFIG_TYPE, GRADE_PACKAGE_TYPE } from "@/config/modules";
import {
  postGradeGeneralPackageApi,
  putGradeGeneralPackageApi,
  getUnconfiguredGradesApi,
  getGradeGeneralPackageDetailApi
} from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const currentSchoolName = ref("");

const emits = defineEmits(["submit"]);

const visible = ref(false);
const parameter = ref({
  title: "",
  type: "Add" as "Add" | "Edit" | "View",
  showConfirm: true
});
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<
  Partial<GradeGeneralPackage.ReqPostGradeGeneralPackageApi> & { packageTemplateId?: number; status?: number }
>({});
const gradeOptions = ref<{ id: number; name: string }[]>([]);
const boundGrades = ref<{ id: number; name: string }[]>([]);

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");
const mergedGradeOptions = computed(() => {
  const map = new Map<number, { id: number; name: string }>();
  [...boundGrades.value, ...gradeOptions.value].forEach(g => map.set(g.id, g));
  return Array.from(map.values());
});

const rules: FormRules = {
  deviceType: [{ required: true, message: "请选择设备类型", trigger: "change" }],
  gradeIds: [{ required: true, message: "请选择年级", trigger: "change" }],
  basePrice: [{ required: true, message: "请输入基础价格", trigger: "blur" }],
  totalMonths: [{ required: true, message: "请输入套餐月数", trigger: "blur" }]
};

function getInitialFormData(): Partial<GradeGeneralPackage.ReqPostGradeGeneralPackageApi> {
  return {
    schoolId: 0,
    gradeIds: [],
    deviceType: DEVICE_TYPE.DRYER,
    basePrice: 0,
    totalMonths: 1,
    packageContent: {},
    templateDescription: "",
    usageRules: "",
    firstMonthRatio: true
  };
}

/** 获取未配置的年级列表 */
async function axiosGetUnconfiguredGradesApi(targetSchoolId?: number) {
  try {
    const result = await getUnconfiguredGradesApi({
      schoolId: targetSchoolId ?? Number(unref(schoolId)),
      configType: GRADE_CONFIG_TYPE.PACKAGE,
      deviceType: DEVICE_TYPE.DRYER,
      packageType: GRADE_PACKAGE_TYPE.GENERAL,
      page: 1,
      pageSize: 100
    });
    if (result.code === 0) {
      gradeOptions.value = result.data?.grades ?? [];
    }
    return result;
  } catch (error) {
    console.error("axiosGetUnconfiguredGradesApi:", error);
    return { code: -1, data: null };
  }
}
/** 获取详情 */
async function axiosGetGradeGeneralPackageDetailApi(id: number) {
  try {
    const result = await getGradeGeneralPackageDetailApi(id);
    return result;
  } catch (error) {
    console.error("axiosGetGradeGeneralPackageDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 新增 */
async function axiosPostGradeGeneralPackageApi(form: Partial<GradeGeneralPackage.ReqPostGradeGeneralPackageApi>) {
  try {
    const payload: GradeGeneralPackage.ReqPostGradeGeneralPackageApi = {
      schoolId: Number(form.schoolId ?? 0),
      gradeIds: form.gradeIds ?? [],
      deviceType: form.deviceType ?? DEVICE_TYPE.DRYER,
      basePrice: form.basePrice ?? 0,
      totalMonths: form.totalMonths ?? 1,
      packageContent: form.packageContent,
      templateDescription: form.templateDescription,
      usageRules: form.usageRules,
      firstMonthRatio: form.firstMonthRatio
    };
    const result = await postGradeGeneralPackageApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostGradeGeneralPackageApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新 */
async function axiosPutGradeGeneralPackageApi(id: number, form: Partial<GradeGeneralPackage.ReqPutGradeGeneralPackageApi>) {
  try {
    const payload: GradeGeneralPackage.ReqPutGradeGeneralPackageApi = {
      basePrice: form.basePrice ?? 0,
      totalMonths: form.totalMonths ?? 1,
      status: form.status ?? PACKAGE_STATUS.ENABLED,
      gradeIds: form.gradeIds,
      packageContent: form.packageContent,
      templateDescription: form.templateDescription,
      usageRules: form.usageRules,
      firstMonthRatio: form.firstMonthRatio
    };
    const result = await putGradeGeneralPackageApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutGradeGeneralPackageApi:", error);
    return { code: -1, data: null };
  }
}

function handleDeviceTypeChange() {
  ruleForm.value.packageContent = {};
}
async function handleSubmitForm(formEl: any) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(ruleForm);

      try {
        if (isAdd.value) {
          await axiosPostGradeGeneralPackageApi(form);
        } else if (isEdit.value && form.packageTemplateId) {
          await axiosPutGradeGeneralPackageApi(form.packageTemplateId, form);
        }
        visible.value = false;
        emits("submit");
      } catch (error) {
        console.error("提交失败", error);
      }
    }
  });
}

async function acceptParams(
  params: { title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean },
  row?: GradePackage.IGradePackageConfigVo
) {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    boundGrades.value = [];
    ruleForm.value = {
      ...getInitialFormData(),
      schoolId: Number(unref(schoolId))
    };
    currentSchoolName.value = storeSchoolName.value;
    await axiosGetUnconfiguredGradesApi();
  } else if (row) {
    // 编辑或查看模式：调用详情接口
    const result = await axiosGetGradeGeneralPackageDetailApi(row.packageTemplateId);
    if (result.code === 0 && result.data) {
      const detail = result.data;
      boundGrades.value = detail.boundGrades;
      ruleForm.value = {
        packageTemplateId: detail.id,
        schoolId: row.schoolId,
        gradeIds: detail.boundGrades.map(g => g.id),
        deviceType: detail.deviceType,
        basePrice: detail.basePrice,
        totalMonths: detail.totalMonths,
        packageContent: (detail.packageContent ?? {}) as GradePackage.IPackageContent,
        templateDescription: detail.templateDescription,
        usageRules: detail.usageRules,
        firstMonthRatio: detail.firstMonthRatio,
        status: detail.status
      };
      currentSchoolName.value = row.schoolName ?? "";
      await axiosGetUnconfiguredGradesApi(row.schoolId);
    }
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="720px" destroy-on-close draggable align-center>
    <SchoolInfo :name="currentSchoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="ruleForm.deviceType"
              placeholder="请选择设备类型"
              class="w-full"
              disabled
              @change="handleDeviceTypeChange"
            >
              <el-option v-for="item in DEVICE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级" prop="gradeIds">
            <el-select
              v-model="ruleForm.gradeIds"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择年级"
              class="w-full"
            >
              <el-option v-for="item in mergedGradeOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="基础价格" prop="basePrice">
            <el-input-number v-model="ruleForm.basePrice" :min="0" :precision="2" :controls="false" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐月数" prop="totalMonths">
            <el-input-number v-model="ruleForm.totalMonths" :min="1" :precision="0" :controls="false" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- VIDEO 设备类型的套餐内容 -->
      <el-row v-if="ruleForm.deviceType === DEVICE_TYPE.VIDEO" :gutter="24">
        <el-col :span="12">
          <el-form-item label="视频通话时长(分钟)">
            <el-input-number v-model="ruleForm.packageContent!.videoCallMinutes" :min="0" :controls="false" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="留言条数">
            <el-input-number v-model="ruleForm.packageContent!.messageCount" :min="0" :controls="false" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- DRYER 设备类型的套餐内容 -->
      <el-row v-if="ruleForm.deviceType === DEVICE_TYPE.DRYER" :gutter="24">
        <el-col :span="12">
          <el-form-item label="吹风机使用时长(分钟)">
            <el-input-number
              v-model="ruleForm.packageContent!.dryerMinutes"
              :min="0"
              :controls="false"
              placeholder="请输入吹风机使用时长"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="是否支持首月比例扣款">
            <el-switch v-model="ruleForm.firstMonthRatio" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="模板说明">
            <el-input
              v-model="ruleForm.templateDescription"
              type="textarea"
              :rows="2"
              placeholder="请输入模板说明"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
