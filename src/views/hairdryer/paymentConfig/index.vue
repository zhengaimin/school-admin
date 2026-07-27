<script setup lang="ts" name="hairdryerPaymentConfig">
import type { FormInstance, FormRules } from "element-plus";

import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { paymentconfigstenant, paymentconfigsadd } from "@/api/modules/InternalPage.js";
import { DEVICE_TYPE } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";

interface IPaymentConfigForm {
  tenantId: number;
  deviceType: string;
  fixedAmounts: string;
  minAmount: number | string | null;
  maxAmount: number | string | null;
  remark: string;
}

/** 用户信息仓库 */
const userStore = useUserStore();
/** 表单实例 */
const formRef = ref<FormInstance>();
/** 页面加载状态 */
const loading = ref(false);
/** 提交状态 */
const submitting = ref(false);
/** 租户ID */
const tenantId = computed(() => Number(userStore.userInfo?.tenantId || 0));

/** 表单校验规则 */
const rules: FormRules = {};

/** 获取初始表单数据 */
function getInitialFormData(): IPaymentConfigForm {
  return {
    tenantId: tenantId.value,
    deviceType: DEVICE_TYPE.DRYER,
    fixedAmounts: "",
    minAmount: null,
    maxAmount: null,
    remark: ""
  };
}

/** 表单数据 */
const form = reactive<IPaymentConfigForm>(getInitialFormData());

/** 归一化金额选项 */
function normalizeFixedAmounts(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(",");
  }
  return typeof value === "string" ? value : "";
}

/** 获取支付金额配置 */
async function axiosGetPaymentConfigApi(): Promise<void> {
  if (!tenantId.value) return;

  loading.value = true;
  try {
    const result = await paymentconfigstenant({
      tenantId: tenantId.value,
      deviceType: DEVICE_TYPE.DRYER
    });

    if (result.code === 0 && result.data) {
      Object.assign(form, getInitialFormData(), result.data);
      form.fixedAmounts = normalizeFixedAmounts(result.data.fixedAmounts);
    } else {
      Object.assign(form, getInitialFormData());
    }

    form.tenantId = tenantId.value;
    form.deviceType = DEVICE_TYPE.DRYER;
  } catch (error: any) {
    console.error("axiosGetPaymentConfigApi:", error);
    ElMessage.error(error?.msg || error?.message || "获取支付金额配置失败");
    Object.assign(form, getInitialFormData());
  } finally {
    loading.value = false;
  }
}

/** 提交支付金额配置 */
async function handleSubmit(): Promise<void> {
  if (submitting.value) return;

  const formEl = formRef.value;
  if (formEl) {
    const isValid = await formEl.validate().catch(() => false);
    if (!isValid) return;
  }

  form.tenantId = tenantId.value;
  form.deviceType = DEVICE_TYPE.DRYER;

  submitting.value = true;
  try {
    const result = await paymentconfigsadd({ ...form });
    if (result.code !== 0) return;

    ElMessage.success("提交成功");
    await axiosGetPaymentConfigApi();
  } catch (error: any) {
    console.error("handleSubmit:", error);
    ElMessage.error(error?.msg || error?.message || "提交失败，请重试");
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void axiosGetPaymentConfigApi();
});
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden">
    <el-card v-loading="loading" shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>支付金额配置</span>
        </div>
      </template>

      <div class="flex-1 overflow-y-auto p-4">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="充值金额配置（单位：元）" prop="fixedAmounts">
                <el-input
                  v-model="form.fixedAmounts"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入充值金额，多个金额用英文逗号分隔"
                />
              </el-form-item>
              <div class="text-red-500 text-xs leading-5 mb-4">提示：金额用“,”分隔，例如：10,20,50,100,200</div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="最小金额（元）" prop="minAmount">
                <el-input-number v-model.number="form.minAmount" :min="1" :step="1" class="w-full" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大金额（元）" prop="maxAmount">
                <el-input-number v-model.number="form.maxAmount" :min="1" :step="1" class="w-full" controls-position="right" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="px-4 pb-4">
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-card__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
