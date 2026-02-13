<script setup lang="ts" name="hairdryerRateGrade">
import type { RateDryer } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { GradeRateRow } from "./types";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { useManage } from "@/hooks/useManage";
import { getGradeDryerRatesApi, deleteGradeDryerRatesApi } from "@/api/modules";
import RateModal from "./modal/Rate.vue";

const { schoolId, isAllSchools } = useSchool();

const columns: ColumnProps<GradeRateRow>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  { prop: "gradeName", label: "年级名称", minWidth: 180 },
  { prop: "rate", label: "费率（元/分钟）", width: 100 },
  { prop: "description", label: "描述", minWidth: 160 },
  { prop: "createdAt", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

const getGradeRateListApi = async (params: Record<string, any>) => {
  const normalizedSchoolId = params?.schoolId ? Number(params.schoolId) : -1;
  return await getGradeDryerRatesApi({
    ...params,
    schoolId: normalizedSchoolId
  });
};

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: getGradeRateListApi,
  delete: deleteGradeDryerRatesApi
});

const modalRef = ref();

const onShowModal = (type: "Add" | "Edit", row?: GradeRateRow) => {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = { Add: "新增年级费率", Edit: "编辑年级费率" };
  const showConfirm = type === "Add" || type === "Edit";
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm }, row);
};

watch(schoolId, () => refreshTableList(), { immediate: true });
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="年级费率">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增</el-button>
      </template>
      <template #boundGrades="{ row }">
        <span>{{ row.boundGrades?.map((g: RateDryer.IBoundGradeVo) => g.gradeName).join("、") || "-" }}</span>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.templateName || row.templateCode)">删除</el-button>
      </template>
    </ProTable>

    <RateModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
