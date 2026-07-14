<script setup lang="ts" name="hairdryerConfig">
import { useSchool } from "@/hooks/useSchool";
import ConfigTable from "./components/ConfigTable.vue";
import ConfigForm from "./components/ConfigForm.vue";

const { schoolId, isAllSchools } = useSchool();
</script>

<template>
  <div class="flex flex-col h-full">
    <ConfigTable v-if="isAllSchools" />
    <ConfigForm v-else :school-id="schoolId" />
  </div>
</template>
