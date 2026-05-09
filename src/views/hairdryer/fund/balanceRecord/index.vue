<script setup lang="ts" name="hairdryerFundBalanceRecord">
import { DEVICE_TYPE } from "@/config/modules";
import BalanceRecordPage from "@/views/video/fund/balanceRecord/components/BalanceRecordPage.vue";
</script>

<template>
  <BalanceRecordPage :device-type="DEVICE_TYPE.DRYER" export-file-name="学生余额_吹风机.xlsx" />
</template>
