<script setup lang="ts">
import type { GradePackage } from "@/api/interface";

import { ref, unref, nextTick, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { DEVICE_TYPE, DEVICE_TYPE_I18N, PACKAGE_STATUS, GRADE_CONFIG_TYPE, GRADE_PACKAGE_TYPE } from "@/config/modules";
import { postGradeFixedPackageApi, putGradeFixedPackageApi, getUnconfiguredGradesApi } from "@/api/modules";
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
const ruleFormRef = ref();
const ruleForm = ref<Partial<GradePackage.ReqPostGradeFixedPackageApi> & { packageTemplateId?: number; status?: number }>({});
const gradeOptions = ref<{ id: number; name: string }[]>([]);

const isView = computed(() => parameter.value.type === "View");

const validateEndTime = (_rule: any, value: string, callback: any) => {
  if (value && ruleForm.value.startTime && value <= ruleForm.value.startTime) {
    callback(new Error("结束时间必须大于开始时间"));
  } else {
    callback();
  }
};

const rules = {
  deviceType: [{ required: true, message: "请选择设备类型", trigger: "change" }],
  gradeIds: [{ required: true, message: "请选择年级", trigger: "change" }],
  basePrice: [{ required: true, message: "请输入基础价格", trigger: "blur" }],
  totalMonths: [{ required: true, message: "请输入套餐月数", trigger: "blur" }],
  endTime: [{ validator: validateEndTime, trigger: "change" }]
};

const getInitialFormData = (): Partial<GradePackage.ReqPostGradeFixedPackageApi> => ({
  schoolId: 0,
  gradeIds: [],
  deviceType: DEVICE_TYPE.DRYER,
  basePrice: 0,
  totalMonths: 0,
  startTime: "",
  endTime: "",
  packageContent: {},
  templateDescription: "",
  usageRules: "",
  monthlyDecrease: false
});

/** 获取未配置的年级列表 */
const axiosGetGradesApi = async (targetSchoolId?: number) => {
  try {
    const result = await getUnconfiguredGradesApi({
      schoolId: targetSchoolId ?? Number(schoolId.value),
      configType: GRADE_CONFIG_TYPE.PACKAGE,
      packageType: GRADE_PACKAGE_TYPE.FIXED,
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

/** 计算套餐月数 */
const calculateTotalMonths = () => {
  const { startTime, endTime } = ruleForm.value;
  if (!startTime || !endTime) {
    ruleForm.value.totalMonths = 0;
    return;
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  // 计算月份差
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff + 1; // +1 包含起始月

  ruleForm.value.totalMonths = totalMonths > 0 ? totalMonths : 0;
};

/** 将年月格式转换为完整日期格式 */
const formatMonthToDate = (yearMonth: string, isEndDate: boolean = false): string => {
  if (!yearMonth) return "";

  if (isEndDate) {
    // 结束时间：转换为该月的最后一天
    const date = new Date(yearMonth);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    return `${yearMonth}-${String(lastDay).padStart(2, "0")}`;
  } else {
    // 开始时间：转换为该月的第一天
    return `${yearMonth}-01`;
  }
};

/** 监听开始和结束时间变化，自动计算月数并重新验证 */
watch(
  () => [ruleForm.value.startTime, ruleForm.value.endTime],
  () => {
    calculateTotalMonths();
    if (ruleForm.value.endTime) {
      ruleFormRef.value?.validateField("endTime");
    }
  },
  { deep: true }
);

const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(ruleForm);
      const { type } = unref(parameter);

      try {
        if (type === "Add") {
          await postGradeFixedPackageApi({
            ...form,
            startTime: form.startTime ? formatMonthToDate(form.startTime, false) : "",
            endTime: form.endTime ? formatMonthToDate(form.endTime, true) : ""
          } as GradePackage.ReqPostGradeFixedPackageApi);
          ElMessage.success("添加成功");
        } else if (type === "Edit" && form.packageTemplateId) {
          await putGradeFixedPackageApi(form.packageTemplateId, {
            basePrice: form.basePrice!,
            totalMonths: form.totalMonths!,
            status: form.status ?? PACKAGE_STATUS.ENABLED,
            gradeIds: form.gradeIds,
            packageContent: form.packageContent,
            templateDescription: form.templateDescription,
            usageRules: form.usageRules,
            monthlyDecrease: form.monthlyDecrease,
            startTime: form.startTime ? formatMonthToDate(form.startTime, false) : "",
            endTime: form.endTime ? formatMonthToDate(form.endTime, true) : ""
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

/** 将完整日期格式转换为年月格式 */
const formatDateToMonth = (dateStr: string): string => {
  if (!dateStr) return "";
  return dateStr.substring(0, 7); // 截取 YYYY-MM 部分
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
    // 编辑或查看模式
    ruleForm.value = {
      packageTemplateId: row.packageTemplateId,
      schoolId: row.schoolId,
      gradeIds: [row.gradeId],
      deviceType: row.deviceType,
      basePrice: row.basePrice,
      totalMonths: row.totalMonths,
      startTime: formatDateToMonth(row.startTime),
      endTime: formatDateToMonth(row.endTime),
      packageContent: row.packageContent as GradePackage.IPackageContent,
      templateDescription: row.templateDescription,
      usageRules: row.usageRules,
      monthlyDecrease: row.monthlyDecrease,
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
              disabled
              @change="handleDeviceTypeChange"
            >
              <el-option :label="DEVICE_TYPE_I18N[DEVICE_TYPE.DRYER]" :value="DEVICE_TYPE.DRYER" />
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
              :min="0"
              :precision="0"
              controls-position="right"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="ruleForm.startTime"
              type="month"
              value-format="YYYY-MM"
              placeholder="请选择开始时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="ruleForm.endTime"
              type="month"
              value-format="YYYY-MM"
              placeholder="请选择结束时间"
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
          <el-form-item label="是否按月递减">
            <el-switch v-model="ruleForm.monthlyDecrease" />
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
