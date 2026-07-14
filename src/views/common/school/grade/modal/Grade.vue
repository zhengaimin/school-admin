<script setup lang="ts">
import type { Grade, ResultData } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { TGradeForm } from "../types";

import { nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { getGradeDetailApi, postGradeApi, putUpdateGradeApi } from "@/api/modules";
import { GRADE_GRADUATION_STATUS, GRADE_GRADUATION_STATUS_OPTIONS } from "@/config/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { buildPostGradePayload, buildPutGradePayload } from "../utils/payload";

const emit = defineEmits<{
  submit: [];
}>();

const { schoolId, schoolName } = useSchool();

/** 弹窗可见 */
const visible = ref(false);
/** 提交加载 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 表单数据 */
const ruleForm = ref<TGradeForm>(getInitialFormData());

/** 表单验证规则 */
const rules: FormRules = {
  name: [{ required: true, message: "请输入年级名称", trigger: "blur" }],
  enrollYear: [{ required: true, message: "请选择入学年份", trigger: "change" }],
  isGraduated: [{ required: true, message: "请选择是否毕业", trigger: "change" }]
};

/**
 * 获取初始表单数据
 * @returns 表单默认值
 */
function getInitialFormData(): TGradeForm {
  return {
    name: "",
    enrollYear: "",
    description: "",
    isGraduated: GRADE_GRADUATION_STATUS.NOT_GRADUATED
  };
}

/**
 * 获取年级详情
 * @param id 年级ID
 * @returns 年级详情响应
 */
async function axiosGetGradeDetailApi(id: number): Promise<ResultData<Grade.ResGetGradeDetailApi | null>> {
  try {
    return await getGradeDetailApi(id);
  } catch (error) {
    console.error("axiosGetGradeDetailApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/**
 * 新增年级
 * @returns 新增响应
 */
async function axiosPostGradeApi() {
  try {
    return await postGradeApi(buildPostGradePayload(ruleForm.value, Number(schoolId.value)));
  } catch (error) {
    console.error("axiosPostGradeApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/**
 * 更新年级
 * @returns 更新响应
 */
async function axiosPutUpdateGradeApi() {
  try {
    if (!ruleForm.value.id) return { code: -1, msg: "缺少年级ID", data: null };
    return await putUpdateGradeApi(ruleForm.value.id, buildPutGradePayload(ruleForm.value));
  } catch (error) {
    console.error("axiosPutUpdateGradeApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/**
 * 提交表单
 * @returns void
 */
async function handleSubmitForm(): Promise<void> {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    const result = parameter.value.type === "Add" ? await axiosPostGradeApi() : await axiosPutUpdateGradeApi();
    loading.value = false;
    if (result.code !== 0) return;
    ElMessage.success(parameter.value.type === "Add" ? "添加成功" : "编辑成功");
    visible.value = false;
    emit("submit");
  });
}

/**
 * 接收弹窗参数
 * @param params 弹窗参数
 * @param row 当前行
 * @returns void
 */
async function acceptParams(params: TModalParams, row?: Grade.IGradeItemVo): Promise<void> {
  parameter.value = { ...parameter.value, ...params };
  ruleForm.value = getInitialFormData();
  if (parameter.value.type === "Edit" && row?.id) {
    const result = await axiosGetGradeDetailApi(row.id);
    if (result.code === 0 && result.data) {
      ruleForm.value = {
        ...result.data,
        enrollYear: String(result.data.enrollYear)
      };
    } else {
      ElMessage.error("获取年级信息失败");
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
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <SchoolInfo :name="schoolName" />
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入年级名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入学年份" prop="enrollYear">
            <el-date-picker
              v-model="ruleForm.enrollYear"
              type="year"
              format="YYYY"
              value-format="YYYY"
              placeholder="请选择入学年份"
              class="w-full!"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否毕业" prop="isGraduated">
            <el-select v-model="ruleForm.isGraduated" placeholder="请选择是否毕业" class="w-full">
              <el-option
                v-for="item in GRADE_GRADUATION_STATUS_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="年级描述" prop="description">
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="4"
              :maxlength="500"
              show-word-limit
              placeholder="请输入年级描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>
