<script setup lang="ts">
import type { Common } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { getApkMessageTemplateDetailApi, putUpdateApkMessageTemplateApi } from "@/api/modules";
import {
  APK_MESSAGE_TEMPLATE_CATEGORY_I18N,
  APK_MESSAGE_TEMPLATE_SCOPE_I18N,
  type TApkMessageTemplateCategoryValue,
  type TApkMessageTemplateScopeValue
} from "@/config/modules";
import { formatTimestamp } from "@/hooks/useManage";
import { buildPutUpdateApkMessageTemplatePayload } from "../utils/payload";

const emits = defineEmits(["submit"]);

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 当前记录 ID */
const currentId = ref<number>();
/** 表单数据 */
const ruleForm = ref<{
  shrgKey: string;
  category?: TApkMessageTemplateCategoryValue;
  scope?: TApkMessageTemplateScopeValue;
  effectiveScope?: TApkMessageTemplateScopeValue;
  message: string;
  description: string;
  version: number;
  isEnabled: boolean;
  updatedAt?: string;
}>({
  shrgKey: "",
  message: "",
  description: "",
  version: 0,
  isEnabled: true
});

/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");

/** 表单规则 */
const rules: FormRules = {
  message: [
    { required: true, message: "请输入错误话术", trigger: "blur" },
    { min: 1, max: 512, message: "错误话术长度需在 1-512 字符之间", trigger: "blur" }
  ],
  description: [{ min: 0, max: 256, message: "说明长度不能超过 256 字符", trigger: "blur" }]
};

/** 格式化作用域文案 */
function formatScope(scope?: TApkMessageTemplateScopeValue) {
  if (!scope) return "--";
  return APK_MESSAGE_TEMPLATE_SCOPE_I18N[scope] || "--";
}

/** 格式化分类文案 */
function formatCategory(category?: TApkMessageTemplateCategoryValue) {
  if (!category) return "--";
  return APK_MESSAGE_TEMPLATE_CATEGORY_I18N[category] || "--";
}

/** 格式化更新时间 */
function formatDateTime(value?: string) {
  return formatTimestamp(value, "YYYY-MM-DD HH:mm:ss") || "--";
}

/** 获取错误话术详情 */
async function axiosGetApkMessageTemplateDetailApi(id: number) {
  try {
    return await getApkMessageTemplateDetailApi(id);
  } catch (error) {
    console.error("axiosGetApkMessageTemplateDetailApi:", error);
    return { code: -1, data: null };
  }
}

/** 更新错误话术 */
async function axiosPutUpdateApkMessageTemplateApi(id: number, form: typeof ruleForm.value) {
  try {
    const payload = buildPutUpdateApkMessageTemplatePayload({
      message: form.message,
      description: form.description,
      version: form.version,
      isEnabled: form.isEnabled
    });
    const result = await putUpdateApkMessageTemplateApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("保存成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateApkMessageTemplateApi:", error);
    return { code: -1, data: null };
  }
}

/** 提交表单 */
async function handleSubmitForm(formEl?: FormInstance) {
  if (!formEl || !isEdit.value || !currentId.value) return;
  await formEl.validate(async valid => {
    if (!valid) return;
    const result = await axiosPutUpdateApkMessageTemplateApi(currentId.value!, ruleForm.value);
    if (result.code !== 0) return;
    visible.value = false;
    emits("submit");
  });
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: Common.IApkMessageTemplateItemVo) {
  parameter.value = { ...parameter.value, ...params };
  currentId.value = row?.id;
  ruleForm.value = {
    shrgKey: "",
    message: "",
    description: "",
    version: 0,
    isEnabled: true
  };

  if (row?.id) {
    const result = await axiosGetApkMessageTemplateDetailApi(row.id);
    if (result.code === 0 && result.data) {
      ruleForm.value = {
        shrgKey: result.data.shrgKey || "",
        category: result.data.category,
        scope: result.data.scope,
        effectiveScope: result.data.effectiveScope,
        message: result.data.message || "",
        description: result.data.description || "",
        version: result.data.version,
        isEnabled: result.data.isEnabled,
        updatedAt: result.data.updatedAt
      };
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
  <el-dialog v-model="visible" :title="parameter.title" width="820px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="语义键">
            <el-input :model-value="ruleForm.shrgKey || '--'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类">
            <el-input :model-value="formatCategory(ruleForm.category)" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="作用域">
            <el-input :model-value="formatScope(ruleForm.scope)" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前生效作用域">
            <el-input :model-value="formatScope(ruleForm.effectiveScope)" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="错误话术" prop="message">
            <el-input v-model="ruleForm.message" type="textarea" :rows="4" maxlength="512" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="说明" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" :rows="3" maxlength="256" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-switch v-model="ruleForm.isEnabled" inline-prompt active-text="启用" inactive-text="禁用" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近更新时间">
            <el-input :model-value="formatDateTime(ruleForm.updatedAt)" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)">保存</el-button>
    </template>
  </el-dialog>
</template>
