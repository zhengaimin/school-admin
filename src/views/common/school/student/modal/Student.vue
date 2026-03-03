<script setup lang="ts">
import type { ResultData, Student } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { StudentModalParams } from "../types";

import { computed, nextTick, reactive, ref, unref } from "vue";
import { ElMessage } from "element-plus";
import { getStudentDetailApi, postCreateStudentApi, putUpdateStudentApi } from "@/api/modules";
import { postUploadImgApi } from "@/api/modules/upload";
import {
  STUDENT_SEX_OPTIONS,
  STUDENT_STATUS,
  STUDENT_STATUS_OPTIONS,
  STUDENT_TYPE,
  STUDENT_TYPE_OPTIONS
} from "@/config/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import UploadImg from "@/components/Upload/Img.vue";
import { buildPostStudentPayload, buildPutStudentPayload } from "../utils/payload";

const emit = defineEmits<{
  submit: [];
}>();

const { schoolId, schoolName } = useSchool();
const { getUploadPath } = useAssetsPath();
const visible = ref(false);
const modalLoading = ref(false);
const parameter = ref<StudentModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
const ruleFormRef = ref<FormInstance>();
const currentSchoolName = ref("");
const {
  gradeOptions,
  departmentOptions,
  classOptions,
  loadGradeOptions,
  loadDepartmentOptions,
  loadClassOptions,
  handleGradeCascade,
  handleDepartmentCascade
} = useGradeDepartmentClassOptions({
  schoolId,
  setLoading: value => {
    modalLoading.value = value;
  }
});

const ruleForm = reactive<Partial<Student.IStudentItemVo>>({
  name: "",
  uuid: "",
  studentCode: "",
  idCard: "",
  sex: undefined,
  cardNumber: "",
  phone: "",
  guardianName: "",
  guardianPhone: "",
  studentType: STUDENT_TYPE.BOARDING,
  status: STUDENT_STATUS.ACTIVE,
  gradeId: undefined,
  departmentId: undefined,
  classId: undefined,
  faceImageUrl: "",
  address: ""
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
  uuid: [{ required: true, message: "请输入唯一号", trigger: "blur" }],
  studentType: [{ required: true, message: "请选择学生类型", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
  gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
  classId: [{ required: true, message: "请选择班级", trigger: "change" }],
  phone: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }
        if (/^1[3-9]\d{9}$/.test(value)) {
          callback();
          return;
        }
        callback(new Error("请输入正确的手机号"));
      },
      trigger: "blur"
    }
  ]
};

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");
const uploadAvatarApi = (file: File) => postUploadImgApi(file, "AVATAR");
/** 获取初始表单数据 */
function getInitialFormData(): Partial<Student.IStudentItemVo> {
  return {
    name: "",
    uuid: "",
    studentCode: "",
    idCard: "",
    sex: undefined,
    cardNumber: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    studentType: STUDENT_TYPE.BOARDING,
    status: STUDENT_STATUS.ACTIVE,
    gradeId: undefined,
    departmentId: undefined,
    classId: undefined,
    faceImageUrl: "",
    address: ""
  };
}

/** 获取学生详情 */
async function axiosGetStudentDetailApi(id: number): Promise<ResultData<Student.ResGetStudentDetailApi | null>> {
  try {
    const result = await getStudentDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(ruleForm, result.data);
    }
    return result;
  } catch (error) {
    console.error("axiosGetStudentDetailApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 新增学生 */
async function axiosPostCreateStudentApi(
  form: Partial<Student.ReqPostStudentApi>
): Promise<ResultData<Student.ResPostStudentApi | null>> {
  try {
    const payload = buildPostStudentPayload(form);
    const result = await postCreateStudentApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostCreateStudentApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 更新学生 */
async function axiosPutUpdateStudentApi(
  id: number,
  form: Partial<Student.ReqPutStudentApi>
): Promise<ResultData<Student.ResPutStudentApi | null>> {
  try {
    const payload = buildPutStudentPayload(form);
    const result = await putUpdateStudentApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateStudentApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}

/** 处理年级变更 */
async function handleGradeChange(gradeId?: number) {
  await handleGradeCascade({
    gradeId,
    reset: () => {
      ruleForm.departmentId = undefined;
      ruleForm.classId = undefined;
    }
  });
}
/** 处理级部变更 */
async function handleDepartmentChange(departmentId?: number) {
  const gradeId = ruleForm.gradeId != null ? Number(ruleForm.gradeId) : undefined;
  await handleDepartmentCascade({
    gradeId,
    departmentId,
    reset: () => {
      ruleForm.classId = undefined;
    }
  });
}

/** 获取提交表单数据 */
function getSubmitFormData() {
  const form = unref(ruleForm);
  return {
    ...form,
    faceImageUrl: form.faceImageUrl ? getUploadPath(form.faceImageUrl) : form.faceImageUrl
  };
}
/** 提交表单 */
async function handleSubmitForm(formEl?: FormInstance) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = getSubmitFormData();
      try {
        if (isAdd.value) {
          const result = await axiosPostCreateStudentApi({
            ...form,
            schoolId: Number(schoolId.value)
          });
          if (result.code !== 0) return;
        } else if (isEdit.value && form.id) {
          const result = await axiosPutUpdateStudentApi(form.id, form);
          if (result.code !== 0) return;
        }
        visible.value = false;
        emit("submit");
      } catch (error) {
        console.error("提交失败", error);
      }
    }
  });
}

/** 接收参数 */
async function acceptParams(params: StudentModalParams, row?: Student.IStudentItemVo) {
  parameter.value = { ...parameter.value, ...params };

  Object.assign(ruleForm, getInitialFormData());

  if (isAdd.value) {
    currentSchoolName.value = schoolName.value;
  } else if (row?.id) {
    await axiosGetStudentDetailApi(row.id);
    currentSchoolName.value = row.schoolName ?? "";
  }

  await loadGradeOptions();

  const gradeId = ruleForm.gradeId != null ? Number(ruleForm.gradeId) : undefined;
  if (gradeId) {
    await loadDepartmentOptions(gradeId);
    const departmentId = ruleForm.departmentId != null ? Number(ruleForm.departmentId) : undefined;
    if (departmentId) {
      await loadClassOptions(gradeId, departmentId);
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
  <el-dialog
    v-model="visible"
    v-loading="modalLoading"
    :title="parameter.title"
    width="760px"
    destroy-on-close
    draggable
    align-center
  >
    <SchoolInfo :name="currentSchoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="个人图片" prop="faceImageUrl">
            <UploadImg
              v-model:image-url="ruleForm.faceImageUrl!"
              width="160px"
              height="160px"
              :api="uploadAvatarApi"
              :disabled="isView"
              is-full-path
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学生姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入学生姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年级" prop="gradeId">
            <el-select v-model="ruleForm.gradeId" class="w-full" placeholder="请选择年级" @change="handleGradeChange">
              <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="级部" prop="departmentId">
            <el-select
              v-model="ruleForm.departmentId"
              class="w-full"
              placeholder="请选择级部"
              :disabled="!gradeOptions.length"
              @change="handleDepartmentChange"
            >
              <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级" prop="classId">
            <el-select
              v-model="ruleForm.classId"
              class="w-full"
              placeholder="请选择班级"
              :disabled="!gradeOptions.length || !departmentOptions.length"
            >
              <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="唯一号" prop="uuid">
            <el-input v-model="ruleForm.uuid" placeholder="请输入唯一号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="studentCode">
            <el-input v-model="ruleForm.studentCode" placeholder="请输入学号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监护人电话" prop="guardianPhone">
            <el-input v-model="ruleForm.guardianPhone" placeholder="请输入监护人电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学生类型" prop="studentType">
            <el-select v-model="ruleForm.studentType" class="w-full" placeholder="请选择学生类型">
              <el-option v-for="item in STUDENT_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" class="w-full" placeholder="请选择状态">
              <el-option v-for="item in STUDENT_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="ruleForm.sex" class="w-full" placeholder="请选择性别">
              <el-option v-for="item in STUDENT_SEX_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IC卡号" prop="cardNumber">
            <el-input v-model="ruleForm.cardNumber" placeholder="请输入IC卡号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监护人姓名" prop="guardianName">
            <el-input v-model="ruleForm.guardianName" placeholder="请输入监护人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="家庭住址" prop="address">
            <el-input v-model="ruleForm.address" type="textarea" :rows="2" placeholder="请输入家庭住址" />
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
