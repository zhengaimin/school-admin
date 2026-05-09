<script setup lang="ts" name="videoFundBalanceRecord">
import { DEVICE_TYPE } from "@/config/modules";
import BalanceRecordPage from "./components/BalanceRecordPage.vue";
</script>

<template>
  <BalanceRecordPage :device-type="DEVICE_TYPE.VIDEO" export-file-name="学生余额_公话.xlsx" />
</template>
