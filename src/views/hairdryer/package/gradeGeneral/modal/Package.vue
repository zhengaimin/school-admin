<script setup lang="ts">
import type { GradePackage, GradeGeneralPackage } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, unref, nextTick, computed } from "vue";
import { ElMessage } from "element-plus";
import { DEVICE_TYPE, DEVICE_TYPE_OPTIONS, PACKAGE_STATUS } from "@/config/modules";
import { postGradeGeneralPackageApi, putGradeGeneralPackageApi, getGradesApi } from "@/api/modules";
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

const isView = computed(() => parameter.value.type === "View");
const isEdit = computed(() => parameter.value.type === "Edit");

const rules: FormRules = {
  deviceType: [{ required: true, message: "请选择设备类型", trigger: "change" }],
  gradeIds: [{ required: true, message: "请选择年级", trigger: "change" }],
  basePrice: [{ required: true, message: "请输入基础价格", trigger: "blur" }],
  totalMonths: [{ required: true, message: "请输入套餐月数", trigger: "blur" }]
};

const getInitialFormData = (): Partial<GradeGeneralPackage.ReqPostGradeGeneralPackageApi> => ({
  schoolId: 0,
  gradeIds: [],
  deviceType: DEVICE_TYPE.DRYER,
  basePrice: 0,
  totalMonths: 1,
  packageContent: {},
  templateDescription: "",
  usageRules: "",
  firstMonthRatio: false
});

/** 获取年级列表 */
const axiosGetGradesApi = async (targetSchoolId?: number) => {
  try {
    const result = await getGradesApi({ schoolId: targetSchoolId ?? Number(schoolId.value), page: 1, pageSize: 500 });
    if (result.code === 0) {
      gradeOptions.value = result.data?.list ?? [];
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
      const { type } = unref(parameter);

      try {
        if (type === "Add") {
          await postGradeGeneralPackageApi(form as GradeGeneralPackage.ReqPostGradeGeneralPackageApi);
          ElMessage.success("添加成功");
        } else if (type === "Edit" && form.packageTemplateId) {
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

const acceptParams = async (params: any, row?: GradePackage.IGradePackageConfigVo) => {
  parameter.value = { ...parameter.value, ...params };

  if (params.type === "Add") {
    ruleForm.value = {
      ...getInitialFormData(),
      schoolId: Number(schoolId.value)
    };
    currentSchoolName.value = storeSchoolName.value;
    await axiosGetGradesApi();
  } else if (row) {
    ruleForm.value = {
      packageTemplateId: row.packageTemplateId,
      schoolId: row.schoolId,
      gradeIds: [row.gradeId],
      deviceType: row.deviceType,
      basePrice: row.basePrice,
      totalMonths: row.totalMonths,
      packageContent: row.packageContent as GradePackage.IPackageContent,
      templateDescription: row.templateDescription,
      usageRules: row.usageRules,
      firstMonthRatio: row.firstMonthRatio,
      status: row.status
    };
    currentSchoolName.value = row.schoolName ?? "";
    await axiosGetGradesApi(row.schoolId);
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
              :disabled="isEdit"
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
              style="width: 100%"
            >
              <el-option v-for="item in gradeOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="基础价格" prop="basePrice">
            <el-input-number v-model="ruleForm.basePrice" :min="0" :precision="2" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套餐月数" prop="totalMonths">
            <el-input-number
              v-model="ruleForm.totalMonths"
              :min="1"
              :precision="0"
              controls-position="right"
              style="width: 100%"
            />
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
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="留言条数">
            <el-input-number
              v-model="ruleForm.packageContent!.messageCount"
              :min="0"
              controls-position="right"
              style="width: 100%"
            />
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
              controls-position="right"
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

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="使用规则">
            <el-input v-model="ruleForm.usageRules" type="textarea" :rows="2" placeholder="请输入使用规则" />
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
