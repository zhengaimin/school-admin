<script setup lang="ts">
import type { Refund } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { postAuditRefundApi } from "@/api/modules";
import { getPaymentDetailApi } from "@/api/modules/payment";
import { REFUND_TYPE } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Edit",
  showConfirm: true
});
const formRef = ref<FormInstance>();
const orderAmount = ref(0);

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
  approved: [{ required: true, message: "请选择审核结果", trigger: "change" }],
  actualAmount: [
    {
      validator: (_rule, value, callback) => {
        if (isNullOrUnDef(value) || value === "") {
          callback(new Error("请输入实际退款金额"));
        } else if (value < 0) {
          callback(new Error("实际退款金额不能小于0"));
        } else if (value > orderAmount.value) {
          callback(new Error(`实际退款金额不能超过 ¥${orderAmount.value.toFixed(2)}`));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
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
async function axiosGetPaymentDetailApi(id: number) {
  try {
    return await getPaymentDetailApi(id);
  } catch (error) {
    console.error("axiosGetPaymentDetailApi:", error);
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
async function acceptParams(options: TModalParams, row?: Refund.IRefundItem) {
  parameter.value = { ...parameter.value, ...options };
  if (!row) return;
  params.id = row.id;
  params.refundType = row.refundType;
  params.applyAmount = row.applyAmount;
  formData.approved = true;
  formData.adminRemark = "";
  formData.actualAmount = Number(row.applyAmount);

  visible.value = true;

  const paymentId = row.paymentId ?? row.paymentID;
  if (!isNullOrUnDef(paymentId)) {
    const res = await axiosGetPaymentDetailApi(paymentId);
    if (res.code === 0 && !isNullOrUnDef(res.data?.amount)) {
      orderAmount.value = Number(res.data.amount);
    } else {
      orderAmount.value = Number(row.originalPrice ?? row.applyAmount);
    }
  } else {
    orderAmount.value = Number(row.originalPrice ?? row.applyAmount);
  }
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="480px" destroy-on-close draggable align-center>
    <div class="p-3 mb-4 bg-gray-100 rounded-md">
      申请退款金额：<span class="font-bold text-red-500">¥{{ Number(params.applyAmount || 0).toFixed(2) }}</span>
    </div>

    <el-form ref="formRef" :model="formData" :rules="rules" :disabled="isView" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="审核结果" prop="approved">
            <el-radio-group v-model="formData.approved">
              <el-radio :value="true">通过</el-radio>
              <el-radio :value="false">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="params.refundType === REFUND_TYPE.PACKAGE && formData.approved" :gutter="24">
        <el-col :span="24">
          <el-form-item prop="actualAmount">
            <template #label>
              实际退款金额
              <span class="text-gray-400 text-xs ml-2">（最大可退 ¥{{ orderAmount.toFixed(2) }}）</span>
            </template>
            <el-input-number
              v-model="formData.actualAmount"
              :precision="2"
              :controls="false"
              placeholder="请输入实际退款金额"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
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
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
