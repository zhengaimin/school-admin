<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceTagForm } from "../types";

import { computed, nextTick, ref, unref } from "vue";
import { ElMessage } from "element-plus";
import { getDeviceTagDetailApi, postDeviceTagApi, putDeviceTagApi } from "@/api/modules";
import { ENABLE_STATUS, ENABLE_STATUS_OPTIONS } from "@/config/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const currentSchoolName = ref("");

const emit = defineEmits(["submit"]);

// 弹窗显示状态
const visible = ref(false);
// 加载状态
const loading = ref(false);
// 弹窗参数
const parameter = ref<{ title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean }>({
  title: "",
  type: "Add",
  showConfirm: true
});

// 表单引用
const ruleFormRef = ref<FormInstance>();
// 表单数据
const ruleForm = ref<DeviceTagForm>(getInitialFormData());

// 表单校验规则
const rules: FormRules = {
  name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
};

// 是否新增
const isAdd = computed(() => parameter.value.type === "Add");
// 是否编辑
const isEdit = computed(() => parameter.value.type === "Edit");
// 是否查看
const isView = computed(() => parameter.value.type === "View");

// 获取表单初始值
function getInitialFormData(): DeviceTagForm {
  return {
    name: "",
    description: "",
    sort: 0,
    status: ENABLE_STATUS.ENABLED
  };
}

// 获取设备标签详情
async function axiosGetDeviceTagDetailApi(id: number) {
  try {
    const result = await getDeviceTagDetailApi(id);
    if (result.code === 0) {
      ruleForm.value = {
        ...getInitialFormData(),
        ...result.data
      };
    }
    return result;
  } catch (error) {
    console.error("axiosGetDeviceTagDetailApi:", error);
    return { code: -1, data: null };
  }
}

// 新增设备标签
async function axiosPostDeviceTagApi(form: DeviceTagForm) {
  try {
    const payload: DeviceTag.ReqPostDeviceTagApi = {
      name: form.name ?? "",
      schoolId: Number(schoolId.value),
      description: form.description || undefined,
      sort: form.sort ?? undefined
    };
    const result = await postDeviceTagApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostDeviceTagApi:", error);
    return { code: -1, data: null };
  }
}

// 更新设备标签
async function axiosPutDeviceTagApi(id: number, form: DeviceTagForm) {
  try {
    const payload: DeviceTag.ReqPutDeviceTagApi = {
      name: form.name ?? "",
      description: form.description || undefined,
      sort: form.sort ?? undefined,
      status: form.status ?? ENABLE_STATUS.ENABLED
    };
    const result = await putDeviceTagApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutDeviceTagApi:", error);
    return { code: -1, data: null };
  }
}

// 提交表单
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      const form = unref(ruleForm);
      if (isAdd.value) {
        const result = await axiosPostDeviceTagApi(form);
        if (result.code !== 0) return;
      } else if (isEdit.value && form.id) {
        const result = await axiosPutDeviceTagApi(form.id, form);
        if (result.code !== 0) return;
      }
      visible.value = false;
      emit("submit");
    } catch (error) {
      console.error("handleSubmitForm:", error);
    } finally {
      loading.value = false;
    }
  });
}

// 接收参数
async function acceptParams(
  params: { title: string; type: "Add" | "Edit" | "View"; showConfirm: boolean },
  row?: DeviceTag.IDeviceTagItemVo
) {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    ruleForm.value = {
      ...getInitialFormData()
    };
    currentSchoolName.value = storeSchoolName.value;
  } else if ((isEdit.value || isView.value) && row?.id) {
    const result = await axiosGetDeviceTagDetailApi(row.id);
    if (result.code === 0 && result.data) {
      currentSchoolName.value = result.data.schoolName ?? row.schoolName ?? "";
    } else {
      currentSchoolName.value = row.schoolName ?? "";
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
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="space-y-4">
      <SchoolInfo :name="currentSchoolName" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="标签名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入标签名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="ruleForm.sort" class="w-full" :min="0" :max="9999" :controls="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入标签描述" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="!isAdd" :gutter="24">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="ruleForm.status" class="w-full" placeholder="请选择状态">
                <el-option v-for="item in ENABLE_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
