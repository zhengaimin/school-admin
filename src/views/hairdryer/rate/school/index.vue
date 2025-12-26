<script setup lang="ts" name="hairdryerRateSchool">
import { useSchool } from "@/hooks/useSchool";
import RateForm from "./components/RateForm.vue";

const { schoolId, isAllSchools } = useSchool();
</script>

<template>
  <div class="flex flex-col h-full">
    <el-empty v-if="isAllSchools" class="h-full" description="请先选择学校" />
    <RateForm v-else :school-id="schoolId" />
  </div>
</template>
