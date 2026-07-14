<script setup lang="ts">
import type { Refund } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { postAuditRefundApi } from "@/api/modules";
import { REFUND_TYPE } from "@/config/modules";

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
const formRef = ref<FormInstance>();

const params = reactive({
  id: 0,
  refundType: "" as Refund.IRefundItem["refundType"],
  applyAmount: 0
});

const formData = reactive<Refund.ReqAuditRefundApi>({
  approved: true,
  adminRemark: "",
  actualAmount: undefined
});

const rules = reactive<FormRules>({
  approved: [{ required: true, message: "请选择审核结果", trigger: "change" }]
});

const emit = defineEmits<{ refresh: [] }>();
const isView = computed(() => parameter.value.type === "View");

async function axiosPostAuditRefundApi(id: number, data: Refund.ReqAuditRefundApi) {
  try {
    const result = await postAuditRefundApi(id, data);
    if (result.code === 0) {
      ElMessage.success("审核成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostAuditRefundApi:", error);
    return { code: -1, data: null };
  }
}

function handleClose() {
  visible.value = false;
  formRef.value?.resetFields();
}
async function handleSubmit() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    const data: Refund.ReqAuditRefundApi = {
      approved: formData.approved,
      adminRemark: formData.adminRemark || undefined
    };
    if (params.refundType === REFUND_TYPE.PACKAGE && formData.approved) {
      data.actualAmount = formData.actualAmount;
    }
    const result = await axiosPostAuditRefundApi(params.id, data);
    if (result.code !== 0) return;
    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("handleSubmit:", error);
  } finally {
    loading.value = false;
  }
}
function acceptParams(options: TModalParams, row?: Refund.IRefundItem) {
  parameter.value = { ...parameter.value, ...options };
  if (!row) return;
  params.id = row.id;
  params.refundType = row.refundType;
  params.applyAmount = row.applyAmount;
  formData.approved = true;
  formData.adminRemark = "";
  formData.actualAmount = row.refundType === REFUND_TYPE.PACKAGE ? row.applyAmount : undefined;

  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="500px" destroy-on-close :close-on-click-modal="false">
    <div class="info-row">
      <span class="label">申请退款金额：</span>
      <span class="price">¥{{ Number(params.applyAmount || 0).toFixed(2) }}</span>
    </div>

    <el-form ref="formRef" :model="formData" :rules="rules" :disabled="isView" label-width="110px">
      <el-form-item label="审核结果" prop="approved">
        <el-radio-group v-model="formData.approved">
          <el-radio :value="true">通过</el-radio>
          <el-radio :value="false">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="params.refundType === REFUND_TYPE.PACKAGE && formData.approved" label="实际退款金额">
        <el-input-number
          v-model="formData.actualAmount"
          :min="0"
          :max="params.applyAmount"
          :precision="2"
          :step="0.1"
          :controls="false"
          placeholder="请输入实际金额"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="审核备注">
        <el-input
          v-model="formData.adminRemark"
          type="textarea"
          :rows="3"
          placeholder="请输入审核备注"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.info-row {
  margin-bottom: 20px;
  font-size: 14px;
  .label {
    color: var(--el-text-color-regular);
  }
  .price {
    font-weight: 500;
    color: var(--el-color-danger);
  }
}
</style>
