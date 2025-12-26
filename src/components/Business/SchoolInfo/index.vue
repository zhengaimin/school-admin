<script setup lang="ts">
interface Props {
  /** 学校名称 */
  name?: string;
}

withDefaults(defineProps<Props>(), {
  name: ""
});
</script>

<template>
  <div class="p-3 mb-4 bg-gray-100 rounded-md">
    学校名称：<span class="font-bold text-blue-500">{{ name }}</span>
  </div>
</template>
