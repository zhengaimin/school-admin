<script setup lang="ts">
import type { Refund } from "@/api/interface";

import { ref } from "vue";
import RefundAuditModal from "@/views/hairdryer/fund/packageRefund/modal/Audit.vue";

const emit = defineEmits<{ refresh: [] }>();
const modalRef = ref<InstanceType<typeof RefundAuditModal>>();

/** 打开退款审核 */
function acceptParams(params: TModalParams, row?: Refund.IRefundItem) {
  modalRef.value?.acceptParams(params, row);
}

/** 转发审核完成事件 */
function handleRefresh() {
  emit("refresh");
}

defineExpose({ acceptParams });
</script>

<template>
  <RefundAuditModal ref="modalRef" @refresh="handleRefresh" />
</template>
