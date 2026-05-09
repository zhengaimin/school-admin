<script setup lang="ts">
import type { Gift, ResultData, Student } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { TGiftTimeForm, TGiftTimeModalParams, TGiftTimeStudentFilterForm } from "../types";

import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { getStudentsListApi, postGiftsBatchApi } from "@/api/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useSchool } from "@/hooks/useSchool";
import { buildPostGiftTimePayload } from "../utils/payload";

const emits = defineEmits<{ submit: [] }>();
const rules: FormRules<TGiftTimeForm> = {
  minutes: [{ required: true, message: "必填项", trigger: "change" }],
  expireDate: [{ required: true, message: "必填项", trigger: "change" }]
};

const { schoolId, schoolName } = useSchool();
const {
  gradeOptions,
  departmentOptions,
  classOptions,
  loadGradeOptions,
  handleGradeCascade,
  handleDepartmentCascade,
  resetDepartmentOptions,
  resetClassOptions
} = useGradeDepartmentClassOptions({
  schoolId,
  requestOptions: {
    grade: { loading: false },
    department: { loading: false },
    class: { loading: false }
  }
});

const visible = ref(false);
const studentDialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();
const parameter = ref<TGiftTimeModalParams>({
  title: "",
  type: "Add",
  showConfirm: true,
  mode: 1
});
const giftForm = ref<TGiftTimeForm>({
  studentIds: [],
  minutes: null,
  expireDate: "",
  description: "",
  gradeId: "",
  departmentId: "",
  classId: ""
});
const studentFilterForm = ref<TGiftTimeStudentFilterForm>({
  name: "",
  gradeId: "",
  departmentId: "",
  classId: ""
});
const selectedStudentRows = ref<Student.IStudentItemVo[]>([]);
const studentList = ref<Student.IStudentItemVo[]>([]);
const studentTotal = ref(0);
const studentPage = ref(1);
const studentPageSize = ref(10);

const currentSchoolId = computed(() => Number(schoolId.value || -1));
const currentSchoolName = computed(() => schoolName.value || "");
const isBatchMode = computed(() => parameter.value.mode === 1);
const isStudentMode = computed(() => parameter.value.mode === 2);

function createGiftForm(): TGiftTimeForm {
  return {
    studentIds: [],
    minutes: null,
    expireDate: "",
    description: "",
    gradeId: "",
    departmentId: "",
    classId: ""
  };
}
function createStudentFilterForm(): TGiftTimeStudentFilterForm {
  return {
    name: "",
    gradeId: "",
    departmentId: "",
    classId: ""
  };
}
function normalizeSelectedId(value: number | "") {
  return value === "" ? undefined : value;
}
function resetForm() {
  giftForm.value = createGiftForm();
  studentFilterForm.value = createStudentFilterForm();
  selectedStudentRows.value = [];
  studentList.value = [];
  studentTotal.value = 0;
  studentPage.value = 1;
  studentPageSize.value = 10;
  resetDepartmentOptions();
  resetClassOptions();
  formRef.value?.clearValidate();
}
/** 查询学生列表 */
async function fetchStudentList() {
  selectedStudentRows.value = [];
  loading.value = true;
  try {
    const result = await axiosGetStudentsListApi({
      schoolId: currentSchoolId.value,
      page: studentPage.value,
      pageSize: studentPageSize.value,
      name: studentFilterForm.value.name.trim() || undefined,
      gradeId: normalizeSelectedId(studentFilterForm.value.gradeId),
      departmentId: normalizeSelectedId(studentFilterForm.value.departmentId),
      classId: normalizeSelectedId(studentFilterForm.value.classId)
    });
    if (result.code === 0 && result.data) {
      studentList.value = result.data.list ?? [];
      studentTotal.value = result.data.total ?? 0;
      return;
    }
    studentList.value = [];
    studentTotal.value = 0;
  } finally {
    loading.value = false;
  }
}

/** 获取学生列表接口 */
async function axiosGetStudentsListApi(params: Student.ReqGetStudentsApi): Promise<ResultData<Student.ResGetStudentsApi | null>> {
  try {
    return await getStudentsListApi(params, { loading: false });
  } catch (error) {
    console.error("axiosGetStudentsListApi:", error);
    return { code: -1, msg: "", data: null };
  }
}
/** 提交赠费 */
async function axiosPostGiftsBatchApi(): Promise<ResultData<Gift.ResPostGiftsBatchApi | null>> {
  try {
    const payload = buildPostGiftTimePayload(giftForm.value, parameter.value.mode, currentSchoolId.value);
    return await postGiftsBatchApi(payload);
  } catch (error) {
    console.error("axiosPostGiftsBatchApi:", error);
    return { code: -1, msg: "", data: null };
  }
}

async function handleGiftGradeChange() {
  giftForm.value.departmentId = "";
  giftForm.value.classId = "";
  await handleGradeCascade({
    gradeId: normalizeSelectedId(giftForm.value.gradeId),
    targetSchoolId: currentSchoolId.value
  });
}
async function handleGiftDepartmentChange() {
  giftForm.value.classId = "";
  await handleDepartmentCascade({
    gradeId: normalizeSelectedId(giftForm.value.gradeId),
    departmentId: normalizeSelectedId(giftForm.value.departmentId),
    targetSchoolId: currentSchoolId.value
  });
}
async function handleStudentGradeChange() {
  studentFilterForm.value.departmentId = "";
  studentFilterForm.value.classId = "";
  await handleGradeCascade({
    gradeId: normalizeSelectedId(studentFilterForm.value.gradeId),
    targetSchoolId: currentSchoolId.value
  });
}
async function handleStudentDepartmentChange() {
  studentFilterForm.value.classId = "";
  await handleDepartmentCascade({
    gradeId: normalizeSelectedId(studentFilterForm.value.gradeId),
    departmentId: normalizeSelectedId(studentFilterForm.value.departmentId),
    targetSchoolId: currentSchoolId.value
  });
}
function handleOpenStudentDialog() {
  studentDialogVisible.value = true;
  studentFilterForm.value = createStudentFilterForm();
  selectedStudentRows.value = [];
  studentPage.value = 1;
  studentPageSize.value = 10;
  resetDepartmentOptions();
  resetClassOptions();
  fetchStudentList();
}
function handleStudentSearch() {
  studentPage.value = 1;
  fetchStudentList();
}
function handleStudentReset() {
  studentFilterForm.value = createStudentFilterForm();
  studentPage.value = 1;
  resetDepartmentOptions();
  resetClassOptions();
  fetchStudentList();
}
function handleStudentSelectionChange(rows: Student.IStudentItemVo[]) {
  selectedStudentRows.value = rows;
}
function handleConfirmSelectedStudents() {
  if (!selectedStudentRows.value.length) {
    ElMessage.warning("请选择学生");
    return;
  }
  const exists = new Set(giftForm.value.studentIds.map(item => item.id));
  selectedStudentRows.value.forEach(item => {
    if (!exists.has(item.id)) {
      giftForm.value.studentIds.push(item);
      exists.add(item.id);
    }
  });
  studentDialogVisible.value = false;
}
function handleRemoveStudent(row: Student.IStudentItemVo) {
  const index = giftForm.value.studentIds.findIndex(item => item.id === row.id);
  if (index > -1) {
    giftForm.value.studentIds.splice(index, 1);
  }
}
function handleStudentSizeChange(val: number) {
  studentPage.value = 1;
  studentPageSize.value = val;
  fetchStudentList();
}
function handleStudentCurrentChange(val: number) {
  studentPage.value = val;
  fetchStudentList();
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  if (isStudentMode.value && !giftForm.value.studentIds.length) {
    ElMessage.warning("请选择学生");
    return;
  }
  const result = await axiosPostGiftsBatchApi();
  if (result.code === 0) {
    ElMessage.success("添加成功");
    visible.value = false;
    emits("submit");
  }
}
function handleCloseDialog() {
  visible.value = false;
}
function handleCloseStudentDialog() {
  studentDialogVisible.value = false;
}

async function acceptParams(params: TGiftTimeModalParams) {
  parameter.value = { ...parameter.value, ...params };
  resetForm();
  await loadGradeOptions(currentSchoolId.value);
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="parameter.title"
    width="800px"
    destroy-on-close
    draggable
    align-center
    @close="handleCloseStudentDialog"
  >
    <div style="padding-left: 20px">
      <el-form ref="formRef" :model="giftForm" :rules="rules" class="demo-ruleForm" label-position="top">
        <SchoolInfo :name="currentSchoolName" />
        <el-row :gutter="16">
          <el-col :span="11">
            <el-form-item label="赠送时长（分钟）" prop="minutes">
              <el-input-number v-model="giftForm.minutes" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="过期时间" prop="expireDate">
              <el-date-picker
                v-model="giftForm.expireDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                type="date"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="isBatchMode">
          <el-row :gutter="16">
            <el-col :span="7">
              <el-form-item label="年级" prop="gradeId">
                <el-select v-model="giftForm.gradeId" placeholder="年级" style="width: 100%" @change="handleGiftGradeChange">
                  <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="级部" prop="departmentId">
                <el-select
                  v-model="giftForm.departmentId"
                  placeholder="级部"
                  style="width: 100%"
                  @change="handleGiftDepartmentChange"
                >
                  <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="班级" prop="classId">
                <el-select v-model="giftForm.classId" placeholder="班级" style="width: 100%">
                  <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row :gutter="16">
          <el-col :span="23">
            <el-form-item label="描述" prop="description">
              <el-input v-model="giftForm.description" type="textarea" :rows="3" :maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="isStudentMode">
          <el-row :gutter="16">
            <el-col :span="23">
              <el-form-item label="添加学生">
                <div>
                  <div>
                    <el-button type="primary" @click="handleOpenStudentDialog">添加</el-button>
                  </div>
                  <div class="student-tag-list">
                    <el-tag
                      v-for="student in giftForm.studentIds"
                      :key="student.id"
                      closable
                      type="primary"
                      @close="handleRemoveStudent(student)"
                    >
                      {{ student.name }}
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>

    <el-dialog v-model="studentDialogVisible" width="900" title="学生" append-to-body destroy-on-close>
      <div class="student-panel" v-loading="loading">
        <div class="student-toolbar">
          <el-input v-model="studentFilterForm.name" placeholder="学生姓名" style="width: 150px" />
          <el-select
            v-model="studentFilterForm.gradeId"
            placeholder="年级"
            style="width: 150px"
            @change="handleStudentGradeChange"
          >
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select
            v-model="studentFilterForm.departmentId"
            placeholder="级部"
            style="width: 150px"
            @change="handleStudentDepartmentChange"
          >
            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="studentFilterForm.classId" placeholder="班级" style="width: 150px">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button type="primary" @click="handleStudentSearch">查询</el-button>
          <el-button @click="handleStudentReset">重置</el-button>
        </div>

        <el-table :data="studentList" row-key="id" @selection-change="handleStudentSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="学生姓名" prop="name" />
          <el-table-column label="学校" prop="schoolName" />
          <el-table-column label="年级" prop="gradeName" />
          <el-table-column label="级部" prop="departmentName" />
          <el-table-column label="班级" prop="className" />
          <el-table-column label="学号" prop="studentCode" />
          <el-table-column label="性别" prop="sex" />
          <el-table-column label="身份证" prop="idCard" />
        </el-table>

        <div class="demo-pagination-block" style="padding: 10px 0">
          <el-pagination
            v-model:current-page="studentPage"
            v-model:page-size="studentPageSize"
            :page-sizes="[10, 20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="studentTotal"
            @size-change="handleStudentSizeChange"
            @current-change="handleStudentCurrentChange"
          />
        </div>
      </div>

      <template #footer>
        <div style="text-align: right">
          <el-button @click="handleCloseStudentDialog">取消</el-button>
          <el-button type="primary" @click="handleConfirmSelectedStudents">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <template #footer>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: right">
            <el-button @click="handleCloseDialog">取消</el-button>
            <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.student-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.student-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.student-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
:deep(.el-form-item) {
  width: 100%;
}
</style>
