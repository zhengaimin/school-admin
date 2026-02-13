<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { BatchUpdateResult } from "../types";

const props = defineProps<{
  modelValue: boolean;
  result: BatchUpdateResult;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const { result } = toRefs(props);

const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
});
</script>

<template>
  <el-dialog v-model="visible" title="批量更新结果" width="760px">
    <el-alert
      :title="`成功：${result.successCount} 条，失败：${result.failedCount} 条`"
      :type="result.failedCount > 0 ? 'warning' : 'success'"
      :closable="false"
      show-icon
      class="mb-4"
    />
    <el-table v-if="result.failedCount > 0" :data="result.failures" border max-height="400">
      <el-table-column prop="row" label="行号" width="80" align="center" />
      <el-table-column prop="terminalSn" label="设备SN" width="180" />
      <el-table-column prop="fieldName" label="字段名称" width="160" show-overflow-tooltip />
      <el-table-column prop="field" label="字段Key" width="160" show-overflow-tooltip />
      <el-table-column prop="value" label="字段值" width="160" show-overflow-tooltip />
      <el-table-column prop="error" label="错误原因" min-width="200" show-overflow-tooltip />
      <el-table-column prop="suggestion" label="修正建议" min-width="200" show-overflow-tooltip />
    </el-table>
    <template #footer>
      <el-button type="primary" @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
