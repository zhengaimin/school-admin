<script setup lang="ts">
import type { DeviceBase } from "@/api/interface";

import { ref, unref, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { DEVICE_TYPE, VENDOR_CODE, DEVICE_STATUS } from "@/config/modules";
import { postDeviceBaseApi, getDeviceBaseDetailApi, putDeviceBaseApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const currentSchoolName = ref("");

const emits = defineEmits(["submit"]);

const visible = ref(false);
const parameter = ref({
  title: "",
  type: "Add",
  showConfirm: true
});
const ruleFormRef = ref();
const ruleForm = ref<Partial<DeviceBase.IDeviceBaseItem>>({});

const rules = {
  deviceSn: [{ required: true, message: "请输入设备序列号", trigger: "blur" }],
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
};

const isView = computed(() => parameter.value.type === "View");
const isSnDisabled = computed(
  () => isView.value || (parameter.value.type === "Edit" && ruleForm.value.status === DEVICE_STATUS.ONLINE)
);

/**
 * 提交表单
 */
const onSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(ruleForm);
      const { type } = unref(parameter);

      try {
        if (type === "Add") {
          await postDeviceBaseApi({
            ...form,
            schoolId: Number(schoolId.value)
          } as DeviceBase.ReqCreateDeviceBaseParams);
          ElMessage.success("添加成功");
        } else if (type === "Edit" && form.id) {
          await putDeviceBaseApi(form.id, form as DeviceBase.ReqUpdateDeviceBaseParams);
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

/**
 * 接收参数
 */
const acceptParams = async (params: any, row?: DeviceBase.IDeviceBaseItem) => {
  parameter.value = { ...parameter.value, ...params };

  if (params.type === "Add") {
    ruleForm.value = {
      vendorCode: VENDOR_CODE.XINGRI,
      deviceType: DEVICE_TYPE.DRYER
    };
    currentSchoolName.value = storeSchoolName.value;
  } else if (row?.id) {
    const { data } = await getDeviceBaseDetailApi(row.id);
    ruleForm.value = data;
    currentSchoolName.value = row.schoolName ?? "";
  }

  visible.value = true;
  nextTick(() => {
    if (ruleFormRef.value) {
      ruleFormRef.value.clearValidate();
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <SchoolInfo :name="currentSchoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备序列号" prop="deviceSn">
            <el-input v-model="ruleForm.deviceSn" placeholder="请输入设备序列号" :disabled="isSnDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备位置" prop="location">
            <el-input v-model="ruleForm.location" placeholder="请输入设备位置" />
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
