<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { GiftGrantMode, OptionItem, StudentItem } from "../types";

import { reactive, ref, watch } from "vue";
import { User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getClassesListApi, getDepartmentsListApi } from "@/api/modules";
import { postGiftsBatchApi } from "@/api/modules/gifts";
import { gradesList } from "@/api/modules/InternalPage.js";
import type { Gift } from "@/api/interface";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE } from "@/config/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

interface Props {
  /** 赠费模式 */
  mode: GiftGrantMode;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 提交成功后触发 */
  submitted: [];
  /** 点击选择学生按钮时触发，传递年级选项供学生选择弹窗使用 */
  selectStudents: [gradeOptions: OptionItem[]];
}>();

/** 弹窗可见状态 */
const visible = defineModel<boolean>({ default: false });

/** 已选择的学生列表 */
const students = defineModel<StudentItem[]>("students", { default: () => [] });

const { schoolId, schoolName } = useSchool();

const grantFormRef = ref<FormInstance>();
const submitting = ref(false);

const form = reactive({
  minutes: null as number | null,
  expireDate: "",
  description: "",
  gradeId: null as number | null,
  departmentId: null as number | null,
  classId: null as number | null
});

const rules: FormRules = {
  minutes: [{ required: true, message: "请输入赠送时长", trigger: "blur" }],
  expireDate: [{ required: true, message: "请选择过期时间", trigger: "change" }]
};

const gradeOptions = ref<OptionItem[]>([]);
const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

/** 获取级部列表 */
const axiosGetDepartmentsListApi = async (gradeId: number): Promise<OptionItem[]> => {
  try {
    const result = await getDepartmentsListApi(
      {
        schoolId: Number(schoolId.value),
        gradeId,
        page: 1,
        pageSize: 200
      },
      { loading: false }
    );

    if (result.code === 0) {
      return (result.data?.list || []) as OptionItem[];
    }
    return [];
  } catch (error) {
    console.error("axiosGetDepartmentsListApi:", error);
    return [];
  }
};
/** 获取班级列表 */
const axiosGetClassesListApi = async (gradeId: number | null, departmentId: number | null): Promise<OptionItem[]> => {
  try {
    const result = await getClassesListApi(
      {
        schoolId: Number(schoolId.value),
        gradeId: gradeId || undefined,
        departmentId: departmentId || undefined,
        page: 1,
        pageSize: 200
      },
      { loading: false }
    );

    if (result.code === 0) {
      return (result.data?.list || []) as OptionItem[];
    }
    return [];
  } catch (error) {
    console.error("axiosGetClassesListApi:", error);
    return [];
  }
};

/** 批量添加赠费 */
const axiosPostGiftsBatchApi = async (params: Gift.ReqPostGiftsBatchApi): Promise<boolean> => {
  try {
    const result = await postGiftsBatchApi(params);

    if (result.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("axiosPostGiftsBatchApi:", error);
    throw error;
  }
};

/** 获取年级列表 */
const axiosGetGradesOptions = async (): Promise<OptionItem[]> => {
  if (!schoolId.value) return [];
  try {
    const query = new URLSearchParams();
    query.set("schoolId", String(Number(schoolId.value)));
    query.set("page", "1");
    query.set("pageSize", "200");
    query.set("enrollYear", "-1");
    const result = await gradesList(query.toString());
    return (result?.data?.list || []) as OptionItem[];
  } catch (error) {
    console.error("axiosGetGradesOptions:", error);
    return [];
  }
};

/** 年级变更处理 */
const handleGradeChange = async (value: number | null): Promise<void> => {
  form.departmentId = null;
  form.classId = null;
  departmentOptions.value = [];
  classOptions.value = [];

  if (!value) return;
  departmentOptions.value = await axiosGetDepartmentsListApi(value);
  classOptions.value = await axiosGetClassesListApi(value, null);
};
/** 级部变更处理 */
const handleDepartmentChange = async (value: number | null): Promise<void> => {
  form.classId = null;
  classOptions.value = [];

  if (!form.gradeId) return;
  classOptions.value = await axiosGetClassesListApi(form.gradeId, value);
};
/** 移除已选学生 */
const handleRemoveStudent = (studentId: number): void => {
  students.value = students.value.filter(s => s.id !== studentId);
};
/** 打开学生选择弹窗 */
const handleOpenStudentPicker = (): void => {
  emit("selectStudents", gradeOptions.value);
};
/** 提交表单 */
const handleSubmit = async (): Promise<void> => {
  if (submitting.value) return;

  const formEl = grantFormRef.value;
  if (!formEl) return;

  const valid = await formEl.validate().catch(() => false);
  if (!valid) return;

  if (props.mode === "students" && students.value.length === 0) {
    ElMessage.warning("请选择学生");
    return;
  }

  submitting.value = true;
  try {
    if (props.mode === "range") {
      // 按范围批量添加
      await axiosPostGiftsBatchApi({
        deviceType: DEVICE_TYPE.DRYER,
        minutes: Number(form.minutes),
        expireDate: form.expireDate,
        description: form.description || undefined,
        schoolId: Number(schoolId.value),
        gradeId: form.gradeId || undefined,
        departmentId: form.departmentId || undefined,
        classId: form.classId || undefined
      });
    } else {
      // 选择学生添加：使用批量接口
      await axiosPostGiftsBatchApi({
        deviceType: DEVICE_TYPE.DRYER,
        minutes: Number(form.minutes),
        expireDate: form.expireDate,
        description: form.description || undefined,
        studentIds: students.value.map(s => s.id)
      });
    }

    ElMessage.success("添加成功");
    visible.value = false;
    emit("submitted");
  } catch (error: any) {
    ElMessage.error(error?.msg || error?.message || "添加失败，请重试");
  } finally {
    submitting.value = false;
  }
};

/** 监听弹窗打开，加载年级数据 */
watch(visible, async isOpen => {
  if (!isOpen) return;
  if (gradeOptions.value.length === 0) {
    gradeOptions.value = await axiosGetGradesOptions();
  }
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'range' ? '批量添加赠费' : '选择学生赠费'"
    :width="760"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
  >
    <SchoolInfo :name="schoolName" />

    <el-form ref="grantFormRef" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="赠送时长（分钟）" prop="minutes">
            <el-input-number v-model="form.minutes" class="w-full" :min="1" placeholder="请输入赠送时长" :controls="false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="过期时间" prop="expireDate">
            <el-date-picker
              v-model="form.expireDate"
              class="w-full!"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择过期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 按范围模式 -->
      <template v-if="mode === 'range'">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="年级">
              <el-select
                v-model="form.gradeId"
                class="w-full"
                placeholder="请选择年级（可选）"
                clearable
                @change="handleGradeChange"
              >
                <el-option v-for="v in gradeOptions" :key="v.id" :label="v.name" :value="v.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="级部">
              <el-select
                v-model="form.departmentId"
                class="w-full"
                placeholder="请选择级部（可选）"
                clearable
                :disabled="!form.gradeId"
                @change="handleDepartmentChange"
              >
                <el-option v-for="v in departmentOptions" :key="v.id" :label="v.name" :value="v.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级">
              <el-select
                v-model="form.classId"
                class="w-full"
                placeholder="请选择班级（可选）"
                clearable
                :disabled="!form.gradeId"
              >
                <el-option v-for="v in classOptions" :key="v.id" :label="v.name" :value="v.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- 按学生模式 -->
      <template v-else>
        <el-row :gutter="16">
          <el-col :span="24">
            <el-form-item label="已选择学生">
              <div class="w-full">
                <div class="flex flex-row items-center gap-3 mb-3">
                  <el-button type="primary" :icon="User" @click="handleOpenStudentPicker">选择学生</el-button>
                  <span class="text-gray-400">已选 {{ students.length }} 人</span>
                </div>

                <div v-if="students.length === 0" class="text-gray-400">尚未选择学生</div>
                <div v-else class="flex flex-row flex-wrap gap-2">
                  <el-tag v-for="s in students" :key="s.id" closable @close="handleRemoveStudent(s.id)">
                    {{ s.name }}
                  </el-tag>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              :maxlength="255"
              show-word-limit
              placeholder="请输入描述（可选）"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="flex flex-row items-center justify-end gap-3">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
