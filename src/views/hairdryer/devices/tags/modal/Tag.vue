<script setup lang="ts">
import type { TagRow } from "../types";

import { ref, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { postDeviceBaseTagApi, putDeviceBaseTagApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { DEVICE_TYPE, VENDOR_CODE } from "@/config/modules";

const { schoolId, schoolName: storeSchoolName } = useSchool();

const emits = defineEmits(["submit"]);

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({ title: "", type: "Add", showConfirm: true });
const editingTagId = ref<number | null>(null);
const currentSchoolName = ref("");

const ruleFormRef = ref();
const ruleForm = ref({
  name: "",
  description: "",
  sort: 0
});

const rules = {
  name: [{ required: true, message: "请输入标签名称", trigger: "blur" }]
};

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");

const resetForm = () => {
  ruleForm.value = {
    name: "",
    description: "",
    sort: 0
  };
  editingTagId.value = null;
};

const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      if (isEdit.value && editingTagId.value) {
        await putDeviceBaseTagApi(editingTagId.value, {
          name: ruleForm.value.name,
          description: ruleForm.value.description || undefined,
          sort: ruleForm.value.sort || undefined
        });
        ElMessage.success("更新成功");
      } else if (isAdd.value) {
        await postDeviceBaseTagApi({
          name: ruleForm.value.name,
          description: ruleForm.value.description || undefined,
          sort: ruleForm.value.sort || undefined,
          vendorCode: VENDOR_CODE.XINGRI,
          deviceType: DEVICE_TYPE.DRYER,
          schoolId: Number(schoolId.value)
        });
        ElMessage.success("添加成功");
      }
      visible.value = false;
      emits("submit");
    } catch (error: any) {
      ElMessage.error(error?.msg || error?.message || "操作失败");
    } finally {
      loading.value = false;
    }
  });
};

const acceptParams = (params: TModalParams, row?: TagRow) => {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    resetForm();
    currentSchoolName.value = storeSchoolName.value;
  } else if ((isEdit.value || isView.value) && row) {
    editingTagId.value = row.id;
    currentSchoolName.value = row.schoolName;
    ruleForm.value = {
      name: row.name,
      description: row.description || "",
      sort: row.sort || 0
    };
  }

  visible.value = true;
  nextTick(() => ruleFormRef.value?.clearValidate());
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <div v-loading="loading">
      <SchoolInfo :name="currentSchoolName" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="标签名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入标签名称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序值" prop="sort">
              <el-input-number v-model="ruleForm.sort" class="w-full" :min="0" :max="9999" :controls="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="标签描述" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入标签描述" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="onSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
</style>
