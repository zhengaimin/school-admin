<script setup lang="ts">
import type { DeviceGroup, ResultData } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";
import type { DeviceGroupForm } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";

import { getDeviceGroupDetailApi, postDeviceGroupApi, putUpdateDeviceGroupApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { buildPostDeviceGroupPayload, buildPutDeviceGroupPayload } from "../utils/payload";

const emit = defineEmits<{
  submit: [];
}>();

const { schoolId, schoolName: storeSchoolName } = useSchool();

/** 当前学校名称 */
const currentSchoolName = ref("");
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
const ruleForm = ref<DeviceGroupForm>(getInitialFormData());

/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 表单验证规则 */
const rules: FormRules<DeviceGroupForm> = {
  name: [
    { required: true, message: "请输入设备组名称", trigger: "blur" },
    { validator: validateVoipGroupName, trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入设备组编码", trigger: "blur" }],
  isVoipGroup: [{ required: true, message: "请选择是否VOIP组", trigger: "change" }]
};

/** 获取初始表单数据 */
function getInitialFormData(): DeviceGroupForm {
  return {
    name: "",
    code: "",
    isVoipGroup: false,
    description: ""
  };
}

/** 校验VOIP设备组名称 */
function validateVoipGroupName(_rule: unknown, value: string, callback: (error?: Error) => void): void {
  if (!ruleForm.value.isVoipGroup || !value) {
    callback();
    return;
  }
  if (new TextEncoder().encode(value).length > 32) {
    callback(new Error("VOIP设备组名称不能超过32字节"));
    return;
  }
  callback();
}

/** 获取设备组详情 */
async function axiosGetDeviceGroupDetailApi(id: number): Promise<ResultData<DeviceGroup.IDeviceGroupItemVo | null>> {
  try {
    return await getDeviceGroupDetailApi(id);
  } catch (error) {
    console.error("axiosGetDeviceGroupDetailApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 新增设备组 */
async function axiosPostDeviceGroupApi(): Promise<ResultData<null>> {
  try {
    return await postDeviceGroupApi(buildPostDeviceGroupPayload(ruleForm.value, Number(schoolId.value)));
  } catch (error) {
    console.error("axiosPostDeviceGroupApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 更新设备组 */
async function axiosPutUpdateDeviceGroupApi(): Promise<ResultData<null>> {
  try {
    if (!ruleForm.value.id) return { code: -1, msg: "缺少设备组ID", data: null };
    return await putUpdateDeviceGroupApi(ruleForm.value.id, buildPutDeviceGroupPayload(ruleForm.value));
  } catch (error) {
    console.error("axiosPutUpdateDeviceGroupApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 提交表单 */
async function handleSubmitForm(): Promise<void> {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    const result = isEdit.value ? await axiosPutUpdateDeviceGroupApi() : await axiosPostDeviceGroupApi();
    loading.value = false;
    if (result.code !== 0) return;
    ElMessage.success(isEdit.value ? "编辑成功" : "添加成功");
    visible.value = false;
    emit("submit");
  });
}

/** 接收弹窗参数 */
async function acceptParams(params: TModalParams, row?: DeviceGroup.IDeviceGroupItemVo): Promise<void> {
  parameter.value = { ...parameter.value, ...params };
  ruleForm.value = getInitialFormData();
  currentSchoolName.value = storeSchoolName.value;
  if (isEdit.value && row?.id) {
    currentSchoolName.value = row.schoolName;
    const result = await axiosGetDeviceGroupDetailApi(row.id);
    if (result.code === 0 && result.data) {
      ruleForm.value = {
        id: result.data.id,
        name: result.data.name,
        code: result.data.code,
        isVoipGroup: result.data.isVoipGroup,
        schoolId: result.data.schoolId,
        status: result.data.status,
        description: result.data.description ?? ""
      };
    } else {
      ElMessage.error("获取设备组信息失败");
    }
  }
  visible.value = true;
  nextTick(() => ruleFormRef.value?.clearValidate());
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="640px" destroy-on-close draggable align-center>
    <SchoolInfo :name="currentSchoolName" />
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备组名称" prop="name">
            <el-input v-model="ruleForm.name" :disabled="isEdit" placeholder="请输入设备组名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备组编码" prop="code">
            <el-input v-model="ruleForm.code" :disabled="isEdit" placeholder="请输入设备组编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否VOIP组" prop="isVoipGroup">
            <el-radio-group v-model="ruleForm.isVoipGroup" :disabled="isEdit">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
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
