<script setup lang="ts">
import type { DeviceBase } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

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
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<Partial<DeviceBase.IDeviceBaseItem>>({});

const rules: FormRules = {
  deviceSn: [{ required: true, message: "请输入设备序列号", trigger: "blur" }],
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }]
};

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");
const isSnDisabled = computed(() => isView.value || (isEdit.value && ruleForm.value.status === DEVICE_STATUS.ONLINE));

/** 获取设备详情 */
async function axiosGetDeviceBaseDetailApi(id: number) {
  try {
    const result = await getDeviceBaseDetailApi(id);
    return result;
  } catch (error) {
    console.error("axiosGetDeviceBaseDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 新增设备 */
async function axiosPostDeviceBaseApi(params: DeviceBase.ReqCreateDeviceBaseParams) {
  try {
    const result = await postDeviceBaseApi(params);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostDeviceBaseApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新设备 */
async function axiosPutDeviceBaseApi(id: number, params: DeviceBase.ReqUpdateDeviceBaseParams) {
  try {
    const result = await putDeviceBaseApi(id, params);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutDeviceBaseApi:", error);
    return { code: -1, data: null };
  }
}
/** 提交表单 */
async function handleSubmitForm(formEl?: FormInstance) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;
    const form = unref(ruleForm);
    try {
      if (isAdd.value) {
        const result = await axiosPostDeviceBaseApi({
          ...(form as DeviceBase.ReqCreateDeviceBaseParams),
          schoolId: Number(schoolId.value)
        });
        if (result.code !== 0) return;
      } else if (isEdit.value && form.id) {
        const result = await axiosPutDeviceBaseApi(form.id, form as DeviceBase.ReqUpdateDeviceBaseParams);
        if (result.code !== 0) return;
      }
      visible.value = false;
      emits("submit");
    } catch (error) {
      console.error("handleSubmitForm:", error);
    }
  });
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: DeviceBase.IDeviceBaseItem) {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    ruleForm.value = {
      vendorCode: VENDOR_CODE.XINGRI,
      deviceType: DEVICE_TYPE.DRYER
    };
    currentSchoolName.value = storeSchoolName.value;
  } else if ((isEdit.value || isView.value) && row?.id) {
    const result = await axiosGetDeviceBaseDetailApi(row.id);
    if (result.code === 0) {
      ruleForm.value = result.data ?? {};
    }
    currentSchoolName.value = row.schoolName ?? "";
  }

  visible.value = true;
  nextTick(() => {
    if (ruleFormRef.value) {
      ruleFormRef.value.clearValidate();
    }
  });
}

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
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
