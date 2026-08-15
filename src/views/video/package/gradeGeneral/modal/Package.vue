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
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
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
  basePrice: [
    { required: true, message: "请输入基础价格", trigger: "blur" },
    { type: "number", min: 0.01, message: "基础价格必须大于0", trigger: "blur" }
  ],
  totalMonths: [{ required: true, message: "请输入套餐月数", trigger: "blur" }]
};

const getInitialFormData = (): Partial<GradeGeneralPackage.ReqPostGradeGeneralPackageApi> => ({
  schoolId: 0,
  gradeIds: [],
  deviceType: DEVICE_TYPE.VIDEO,
  totalMonths: 1,
  packageContent: { messageCount: -1 },
  templateDescription: "",
  usageRules: "",
  firstMonthRatio: false
});

/** 获取未配置的年级列表 */
const axiosGetGradesApi = async (targetSchoolId?: number) => {
  try {
    const result = await getUnconfiguredGradesApi({
      schoolId: targetSchoolId ?? Number(schoolId.value),
      configType: GRADE_CONFIG_TYPE.PACKAGE,
      deviceType: DEVICE_TYPE.VIDEO,
      packageType: GRADE_PACKAGE_TYPE.GENERAL,
      page: 1,
      pageSize: 100
    });
    if (result.code === 0) {
      gradeOptions.value = result.data?.grades ?? [];
    }
  } catch (error) {
    console.error("axiosGetGradesApi:", error);
  }
};

const handleDeviceTypeChange = () => {
  ruleForm.value.packageContent = {};
};
const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(ruleForm);
      try {
        if (isAdd.value) {
          await postGradeGeneralPackageApi(form as GradeGeneralPackage.ReqPostGradeGeneralPackageApi);
          ElMessage.success("添加成功");
        } else if (isEdit.value && form.packageTemplateId) {
          await putGradeGeneralPackageApi(form.packageTemplateId, {
            basePrice: form.basePrice!,
            totalMonths: form.totalMonths!,
            status: form.status ?? PACKAGE_STATUS.ENABLED,
            gradeIds: form.gradeIds,
            packageContent: form.packageContent,
            templateDescription: form.templateDescription,
            usageRules: form.usageRules,
            firstMonthRatio: form.firstMonthRatio
          });
          ElMessage.success("编辑成功");
        }
        visible.value = false;
        emits("submit");
      } catch (error) {
        console.error("提交失败", error);
      }
    }
  });
};

const acceptParams = async (params: TModalParams, row?: GradePackage.IGradePackageConfigVo) => {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    boundGrades.value = [];
    ruleForm.value = {
      ...getInitialFormData(),
      schoolId: Number(schoolId.value)
    };
    currentSchoolName.value = storeSchoolName.value;
    await axiosGetGradesApi();
  } else if ((isEdit.value || isView.value) && row) {
    // 编辑或查看模式：调用详情接口
    try {
      const result = await getGradeGeneralPackageDetailApi(row.packageTemplateId);
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
          packageContent: { ...(detail.packageContent as GradePackage.IPackageContent), messageCount: -1 },
          templateDescription: detail.templateDescription,
          usageRules: detail.usageRules,
          firstMonthRatio: detail.firstMonthRatio,
          status: detail.status
        };
        currentSchoolName.value = row.schoolName ?? "";
        await axiosGetGradesApi(row.schoolId);
      }
    } catch (error) {
      console.error("获取详情失败", error);
    }
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
    <SchoolInfo :name="currentSchoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="ruleForm.deviceType"
              placeholder="请选择设备类型"
              style="width: 100%"
              disabled
              @change="handleDeviceTypeChange"
            >
              <el-option v-for="item in DEVICE_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级" prop="gradeIds">
            <el-select v-model="ruleForm.gradeIds" multiple placeholder="请选择年级" style="width: 100%">
              <el-option v-for="item in mergedGradeOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="基础价格" prop="basePrice">
            <el-input-number
              v-model="ruleForm.basePrice"
              :min="0"
              :precision="2"
              :controls="false"
              placeholder="请输入基础价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐月数" prop="totalMonths">
            <el-input-number v-model="ruleForm.totalMonths" :min="1" :precision="0" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- VIDEO 设备类型的套餐内容 -->
      <el-row v-if="ruleForm.deviceType === DEVICE_TYPE.VIDEO" :gutter="24">
        <el-col :span="12">
          <el-form-item label="视频通话时长(分钟)">
            <el-input-number
              v-model="ruleForm.packageContent!.videoCallMinutes"
              :min="0"
              :controls="false"
              placeholder="请输入视频通话时长"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="留言条数">
            <el-input disabled value="无限" style="width: 100%" />
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
              style="width: 100%"
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
            <el-input v-model="ruleForm.templateDescription" type="textarea" :rows="2" placeholder="请输入模板说明" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="onSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
