<script setup lang="ts">
import type { PlatformPackage } from "@/api/interface";

import { ref } from "vue";

// TODO(Task10): 完善套餐新增/编辑弹窗表单内容与提交逻辑
/** 弹窗可见 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: false
});

/** 接收参数 */
function acceptParams(params: TModalParams, row?: PlatformPackage.Item) {
  parameter.value = { ...parameter.value, ...params };
  visible.value = true;
  void row;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" :title="parameter.title" width="600">
    <div>待 Task10 完善表单</div>
  </el-dialog>
</template>
