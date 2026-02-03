<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { DeviceImportResult } from "../types";

const props = defineProps<{
  modelValue: boolean;
  result: DeviceImportResult;
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
  <el-dialog v-model="visible" title="导入结果" width="760px">
    <el-alert
      :title="`成功：${result.successCount} 条，失败：${result.failCount} 条`"
      :type="result.failCount > 0 ? 'warning' : 'success'"
      :closable="false"
      show-icon
      class="mb-4"
    />
    <el-table v-if="result.failCount > 0" :data="result.failures" border max-height="400">
      <el-table-column prop="rowIndex" label="行号" width="80" align="center" />
      <el-table-column prop="terminalSn" label="设备SN" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="reason" label="失败原因" min-width="200" show-overflow-tooltip />
    </el-table>
    <template #footer>
      <el-button type="primary" @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
