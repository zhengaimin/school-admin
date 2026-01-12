<script setup lang="ts" name="hairdryerLogUsage">
import type { DeviceUsage } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getDeviceUsageListApi, getGradesApi, getDepartmentsListApi, getClassesListApi } from "@/api/modules";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  DEVICE_USAGE_STATUS_OPTIONS,
  DEVICE_USAGE_STATUS_I18N,
  getDeviceUsageStatusTagType,
  DEVICE_TYPE,
  DEVICE_TYPE_OPTIONS
} from "@/config/modules";
import DetailModal from "./modal/Detail.vue";
import ExportModal from "./modal/Export.vue";

interface OptionItem {
  label: string;
  value: number;
}

const { schoolId, guardSchool } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage(
  { get: getDeviceUsageListApi },
  { deviceType: DEVICE_TYPE.DRYER },
  list =>
    dateFormatter(list, [
      { field: "createdAt", isUnix: false },
      { field: "confirmedAt", isUnix: false },
      { field: "completedAt", isUnix: false },
      { field: "consumeTime", isUnix: false }
    ])
);

const detailModalRef = ref();
const exportModalRef = ref();
const gradeOptions = ref<OptionItem[]>([]);
const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

const columns: ColumnProps<DeviceUsage.IDeviceUsageItem>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "orderNo",
    label: "订单号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入订单号" } }
  },
  {
    prop: "studentName",
    label: "学生姓名",
    minWidth: 100,
    search: { el: "input", props: { placeholder: "请输入学生姓名" } }
  },
  { prop: "gradeName", label: "年级", minWidth: 100 },
  { prop: "className", label: "班级", minWidth: 100 },
  {
    prop: "deviceSn",
    label: "设备序列号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备序列号" } }
  },
  { prop: "deviceName", label: "设备名称", minWidth: 150 },
  {
    prop: "deviceType",
    label: "设备类型",
    width: 100,
    enum: DEVICE_TYPE_OPTIONS
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: DEVICE_USAGE_STATUS_OPTIONS,
    fixed: "right",
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "usageMinutes", label: "计费时长(分)", width: 110 },
  { prop: "usageDuration", label: "计费时长(秒)", width: 110 },
  { prop: "actualAmount", label: "实际扣费(元)", width: 110 },
  { prop: "createdAt", label: "刷卡时间", minWidth: 180 },
  { prop: "completedAt", label: "完成时间", minWidth: 180 },
  {
    prop: "gradeId",
    label: "年级",
    isShow: false,
    enum: gradeOptions,
    search: { el: "select", props: { placeholder: "请选择年级" } }
  },
  {
    prop: "departmentId",
    label: "级部",
    isShow: false,
    enum: departmentOptions,
    search: { el: "select", props: { placeholder: "请选择级部" } }
  },
  {
    prop: "classId",
    label: "班级",
    isShow: false,
    enum: classOptions,
    search: { el: "select", props: { placeholder: "请选择班级" } }
  },
  {
    prop: "startTime",
    label: "开始时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "开始时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  {
    prop: "endTime",
    label: "结束时间",
    isShow: false,
    search: { el: "date-picker", props: { type: "datetime", placeholder: "结束时间", valueFormat: "YYYY-MM-DD HH:mm:ss" } }
  },
  { prop: "operation", label: "操作", width: 80, fixed: "right" }
];

/** 获取年级列表 */
const axiosGetGradeOptions = async () => {
  try {
    const result = await getGradesApi({ schoolId: Number(schoolId.value), page: 1, pageSize: 200 });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      gradeOptions.value.splice(0, gradeOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetGradeOptions:", error);
  }
};
/** 获取级部列表 */
const axiosGetDepartmentOptions = async (gradeId: number) => {
  try {
    const result = await getDepartmentsListApi(
      { schoolId: Number(schoolId.value), gradeId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      departmentOptions.value.splice(0, departmentOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetDepartmentOptions:", error);
  }
};
/** 获取班级列表 */
const axiosGetClassOptions = async (gradeId: number, departmentId: number) => {
  try {
    const result = await getClassesListApi(
      { schoolId: Number(schoolId.value), gradeId, departmentId, page: 1, pageSize: 200 },
      { loading: false }
    );
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      classOptions.value.splice(0, classOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetClassOptions:", error);
  }
};

/** 查看详情 */
const handleShowDetail = (row: DeviceUsage.IDeviceUsageItem) => {
  detailModalRef.value?.acceptParams(row.id);
};
/** 打开导出弹窗 */
const handleOpenExport = () => {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  exportModalRef.value?.acceptParams({
    schoolId: Number(schoolId.value),
    studentName: searchParam.studentName,
    orderNo: searchParam.orderNo,
    deviceSn: searchParam.deviceSn,
    status: searchParam.status,
    startTime: searchParam.startTime,
    endTime: searchParam.endTime,
    gradeId: searchParam.gradeId,
    departmentId: searchParam.departmentId,
    classId: searchParam.classId,
    gradeOptions: [...gradeOptions.value],
    departmentOptions: [...departmentOptions.value],
    classOptions: [...classOptions.value]
  });
};

/** 监听年级变化，加载级部和班级选项 */
watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.departmentId = undefined;
      proTable.value.searchParam.classId = undefined;
    }
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;
    if (gradeId) await axiosGetDepartmentOptions(gradeId);
  }
);
/** 监听级部变化，加载班级选项 */
watch(
  () => proTable.value?.searchParam?.departmentId,
  async departmentId => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.classId = undefined;
    }
    classOptions.value.length = 0;
    const gradeId = proTable.value?.searchParam?.gradeId;
    if (gradeId && departmentId) await axiosGetClassOptions(gradeId, departmentId);
  }
);

/** 监听学校变化 */
watch(
  schoolId,
  () => {
    gradeOptions.value.length = 0;
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;
    axiosGetGradeOptions();
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="设备使用记录">
      <template #toolButton>
        <el-button type="primary" @click="handleOpenExport">导出</el-button>
      </template>
      <!-- 设备类型 -->
      <template #deviceType="{ row }">
        {{ row.deviceType === DEVICE_TYPE.DRYER ? "吹风机" : row.deviceType === DEVICE_TYPE.VIDEO ? "视频话机" : row.deviceType }}
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="getDeviceUsageStatusTagType(row.status)">
          {{ row.statusText || DEVICE_USAGE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
      <!-- 完成时间 -->
      <template #completedAt="{ row }">
        {{ row.completedAt || "--" }}
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetail(row)">查看</el-button>
      </template>
    </ProTable>

    <DetailModal ref="detailModalRef" />
    <ExportModal ref="exportModalRef" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
