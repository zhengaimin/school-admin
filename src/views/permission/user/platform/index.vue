<script setup lang="ts">
import { ROLE_LEVEL } from "@/config/modules";
import UserPage from "../index.vue";
</script>

<template>
  <UserPage :role-level="ROLE_LEVEL.PLATFORM" />
</template>
