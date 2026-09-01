<script setup lang="ts">
import type { Refund } from "@/api/interface";

import { ref } from "vue";
import RefundDetailModal from "@/views/hairdryer/fund/packageRefund/modal/Detail.vue";

const modalRef = ref<InstanceType<typeof RefundDetailModal>>();

/** 打开退款详情 */
function acceptParams(params: TModalParams, row?: Refund.IRefundItem) {
  modalRef.value?.acceptParams(params, row);
}

defineExpose({ acceptParams });
</script>

<template>
  <RefundDetailModal ref="modalRef" />
</template>
