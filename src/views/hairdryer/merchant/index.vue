<script setup lang="ts" name="hairdryerMerchant">
import { useSchool } from "@/hooks/useSchool";
import MerchantForm from "./components/MerchantForm.vue";

const { schoolId, isAllSchools } = useSchool();
</script>

<template>
  <div class="flex flex-col h-full">
    <el-empty v-if="isAllSchools" class="h-full" description="请先选择学校" />
    <MerchantForm v-else :school-id="schoolId" />
  </div>
</template>
