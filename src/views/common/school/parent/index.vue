<script setup lang="ts" name="parentManage">
import type { FamilyBindStatus, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { OptionItem } from "./types";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import FamilyBindStatusModal from "./modal/FamilyBindStatus.vue";
import ExportModal from "./modal/Export.vue";
import { getClassesListApi, getFamilyBindStatusListApi, getGradesApi } from "@/api/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { isNullOrUnDef } from "@/utils/is";
import { WECHAT_BOUND_STATUS_OPTIONS, getWechatBoundStatusText } from "@/config/modules";
import { buildFamilyBindStatusListParams } from "./utils/payload";

/** 学校信息 */
const { schoolId, guardSchool } = useSchool();

/** 订阅弹窗引用 */
const detailModalRef = ref<InstanceType<typeof FamilyBindStatusModal>>();
/** 导出弹窗引用 */
const exportModalRef = ref<InstanceType<typeof ExportModal>>();
/** 年级选项 */
const gradeOptions = ref<OptionItem[]>([]);
/** 班级选项 */
const classOptions = ref<OptionItem[]>([]);

/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetFamilyBindStatusListApi }, null, list =>
  dateFormatter(list, ["wechatBindTime"])
);

/** 表格列配置 */
const columns: ColumnProps<FamilyBindStatus.IFamilyBindStatusItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 120 },
  { prop: "gradeName", label: "年级", minWidth: 100 },
  { prop: "className", label: "班级", minWidth: 100 },
  {
    prop: "uuid",
    label: "学生唯一号",
    minWidth: 160,
    search: { el: "input", key: "studentNo", props: { placeholder: "请输入学生唯一号" } }
  },
  {
    prop: "studentName",
    label: "学生姓名",
    minWidth: 100,
    search: { el: "input", props: { placeholder: "请输入学生姓名" } }
  },
  { prop: "parentName", label: "家长姓名", minWidth: 100 },
  { prop: "relation", label: "称谓", width: 90 },
  {
    prop: "phone",
    label: "手机号",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入手机号" } }
  },
  { prop: "isPrimary", label: "主联系人", width: 130 },
  {
    prop: "wechatBound",
    label: "微信绑定",
    width: 100,
    enum: WECHAT_BOUND_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择绑定状态" } },
    fixed: "right"
  },
  { prop: "wechatBindTime", label: "绑定时间", minWidth: 160 },
  { prop: "subscribedGroupCount", label: "订阅设备组数", width: 120, align: "center" },
  {
    prop: "gradeId",
    label: "年级",
    isShow: false,
    enum: gradeOptions,
    search: { el: "select", props: { placeholder: "请选择年级" } }
  },
  {
    prop: "classId",
    label: "班级",
    isShow: false,
    enum: classOptions,
    search: { el: "select", props: { placeholder: "请选择班级" } }
  },
  { prop: "operation", label: "操作", width: 140, fixed: "right" }
];

/** 获取家长绑定状态列表 */
async function axiosGetFamilyBindStatusListApi(
  params: Record<string, any>
): Promise<ResultData<FamilyBindStatus.ResGetFamilyBindStatusListApi>> {
  try {
    const payload = buildFamilyBindStatusListParams(params);
    if (isNullOrUnDef(payload.schoolId)) {
      return { code: 0, msg: "未选择学校", data: { list: [], total: 0 } };
    }
    return await getFamilyBindStatusListApi(payload);
  } catch (error) {
    console.error("axiosGetFamilyBindStatusListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}
/** 获取年级选项 */
async function axiosGetGradeOptionsApi() {
  const targetSchoolId = Number(schoolId.value);
  if (Number.isNaN(targetSchoolId) || targetSchoolId <= 0) return;
  try {
    const result = await getGradesApi({ schoolId: targetSchoolId, page: 1, pageSize: 200 }, { loading: false });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      gradeOptions.value.splice(0, gradeOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetGradeOptionsApi:", error);
  }
}
/** 获取班级选项 */
async function axiosGetClassOptionsApi(gradeId: number) {
  const targetSchoolId = Number(schoolId.value);
  if (Number.isNaN(targetSchoolId) || targetSchoolId <= 0) return;
  try {
    const result = await getClassesListApi({ schoolId: targetSchoolId, gradeId, page: 1, pageSize: 200 }, { loading: false });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      classOptions.value.splice(0, classOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetClassOptionsApi:", error);
  }
}

/** 查看订阅设备组 */
function handleShowSubscriptions(row: FamilyBindStatus.IFamilyBindStatusItemVo) {
  detailModalRef.value?.acceptParams({ title: "订阅设备组", type: "View", showConfirm: false }, row);
}
/** 打开导出弹窗 */
function handleOpenExport() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  exportModalRef.value?.acceptParams({
    title: "批量导出",
    type: "View",
    showConfirm: true,
    schoolId: Number(schoolId.value),
    gradeId: searchParam.gradeId,
    classId: searchParam.classId,
    studentNo: searchParam.studentNo,
    studentName: searchParam.studentName,
    phone: searchParam.phone,
    wechatBound: searchParam.wechatBound
  });
}

watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.classId = undefined;
    }
    classOptions.value.length = 0;
    if (!isNullOrUnDef(gradeId)) {
      await axiosGetClassOptionsApi(Number(gradeId));
    }
  }
);
watch(
  schoolId,
  () => {
    if (proTable.value?.searchParam) {
      proTable.value.searchParam.gradeId = undefined;
      proTable.value.searchParam.classId = undefined;
    }
    gradeOptions.value.length = 0;
    classOptions.value.length = 0;
    axiosGetGradeOptionsApi();
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="userId" table-header="家长管理">
      <template #toolButton>
        <el-button type="primary" @click="handleOpenExport">导出</el-button>
      </template>

      <template #isPrimary="{ row }">
        <el-tag :type="row.isPrimary ? 'success' : 'info'">{{ row.isPrimary ? "主联系人" : "非主联系人" }}</el-tag>
      </template>

      <template #wechatBound="{ row }">
        <el-tag :type="row.wechatBound ? 'success' : 'info'">
          {{ getWechatBoundStatusText(row.wechatBound) }}
        </el-tag>
      </template>

      <template #wechatBindTime="{ row }">
        {{ row.wechatBindTime || "--" }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowSubscriptions(row)">订阅设备组</el-button>
      </template>
    </ProTable>

    <FamilyBindStatusModal ref="detailModalRef" />
    <ExportModal ref="exportModalRef" />
  </div>
</template>
