<script setup lang="ts" name="videoGradeGeneral">
import type { GradePackage } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { getGradeGeneralPackagesApi, deleteGradeGeneralPackageApi } from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE, PACKAGE_STATUS, PACKAGE_STATUS_OPTIONS } from "@/config/modules";
import PackageModal from "./modal/Package.vue";

const { isAllSchools, schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage(
  {
    get: getGradeGeneralPackagesApi,
    delete: deleteGradeGeneralPackageApi
  },
  { deviceType: DEVICE_TYPE.VIDEO }
);

const modalRef = ref();

const columns: ColumnProps<GradePackage.IGradePackageConfigVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 120 },
  { prop: "gradeName", label: "年级名称", minWidth: 200 },
  { prop: "videoCallMinutes", label: "语音通话时长（分钟/月）", width: 220 },
  { prop: "basePrice", label: "基础价格（元/月）", width: 220 },
  { prop: "totalMonths", label: "套餐总月数", width: 100 },
  { prop: "firstMonthRatio", label: "首月比例扣款", fixed: "right", width: 120 },
  {
    prop: "status",
    label: "状态",
    width: 80,
    enum: PACKAGE_STATUS_OPTIONS,
    fixed: "right"
  },
  { prop: "operation", label: "操作", width: 180, fixed: "right" }
];

/** 显示弹框 */
const onShowModal = (type: TModalType, row?: GradePackage.IGradePackageConfigVo) => {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = {
    Add: "新增套餐",
    Edit: "编辑套餐",
    View: "查看套餐"
  };
  const showConfirm = type === "Add" || type === "Edit";
  modalRef.value.acceptParams({ title: titleMap[type], type, showConfirm }, row);
};

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="年级通用套餐">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增</el-button>
      </template>
      <!-- 语音通话时长 -->
      <template #videoCallMinutes="{ row }">
        {{ row.packageContent?.videoCallMinutes ?? "-" }}
      </template>
      <!-- 首月比例扣款 -->
      <template #firstMonthRatio="{ row }">
        <el-tag :type="row.firstMonthRatio ? 'success' : 'info'">
          {{ row.firstMonthRatio ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="row.status === PACKAGE_STATUS.ENABLED ? 'success' : 'info'">
          {{ row.status === PACKAGE_STATUS.ENABLED ? "启用" : "禁用" }}
        </el-tag>
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal('View', row)">查看</el-button>
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.gradeName)">删除</el-button>
      </template>
    </ProTable>

    <PackageModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
