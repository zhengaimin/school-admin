<script setup lang="ts" name="grade">
import type { Grade, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, watch } from "vue";
import { CirclePlus, Download } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import GradeModal from "./modal/Grade.vue";
import { deleteGradeApi, getGradesApi, postGradeExportApi } from "@/api/modules";
import {
  GRADE_GRADUATION_STATUS_I18N,
  GRADE_GRADUATION_STATUS_OPTIONS,
  GRADE_GRADUATION_STATUS_TAG_TYPE
} from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";

const { schoolId, guardSchool } = useSchool();
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: axiosGetGradesListApi,
  delete: deleteGradeApi
});

/** 年级弹窗引用 */
const modalRef = ref<InstanceType<typeof GradeModal>>();

/** 表格列配置 */
const columns: ColumnProps<Grade.IGradeItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校", minWidth: 160 },
  {
    prop: "name",
    label: "年级名称",
    minWidth: 140,
    search: { el: "input", props: { placeholder: "请输入年级名称" } }
  },
  {
    prop: "enrollYear",
    label: "入学年份",
    width: 120,
    search: {
      el: "date-picker",
      props: { type: "year", format: "YYYY", valueFormat: "YYYY", placeholder: "请选择入学年份" }
    }
  },
  {
    prop: "isGraduated",
    label: "是否毕业",
    width: 110,
    enum: GRADE_GRADUATION_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择是否毕业" } }
  },
  { prop: "description", label: "描述", minWidth: 180 },
  { prop: "createdAt", label: "创建时间", minWidth: 170 },
  { prop: "updatedAt", label: "更新时间", minWidth: 170 },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

/**
 * 生成下载文件
 * @param data 文件内容
 * @param filename 文件名
 * @returns void
 */
function downloadBlob(data: BlobPart, filename: string): void {
  const blob = new Blob([data], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * 获取年级列表
 * @param params 查询参数
 * @returns 年级列表响应
 */
async function axiosGetGradesListApi(params: Grade.ReqGetGradesApi): Promise<ResultData<Grade.ResGetGradesApi>> {
  try {
    return await getGradesApi({
      ...params,
      enrollYear: params.enrollYear ? Number(params.enrollYear) : -1,
      isGraduated: params.isGraduated ?? undefined
    } as Grade.ReqGetGradesApi);
  } catch (error) {
    console.error("axiosGetGradesListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}
/**
 * 导出年级列表
 * @param params 导出参数
 * @returns void
 */
async function axiosPostGradeExportApi(params: Grade.ReqPostGradeExportApi): Promise<void> {
  try {
    const blob = await postGradeExportApi(params);
    downloadBlob(blob, "年级信息.xlsx");
  } catch (error) {
    console.error("axiosPostGradeExportApi:", error);
  } finally {
    ElNotification.closeAll();
  }
}

/**
 * 显示年级弹窗
 * @param type 弹窗类型
 * @param row 当前行
 * @returns void
 */
function handleShowModal(type: "Add" | "Edit", row?: Grade.IGradeItemVo): void {
  if (type === "Add" && !guardSchool()) return;
  const titleMap = {
    Add: "新增年级",
    Edit: "编辑年级"
  };
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/**
 * 导出年级信息
 * @returns void
 */
function handleExport(): void {
  if (!guardSchool()) return;
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "success",
    duration: 0
  });
  const searchParam = proTable.value?.searchParam || {};
  axiosPostGradeExportApi({
    schoolId: Number(schoolId.value),
    name: searchParam.name,
    enrollYear: searchParam.enrollYear ? Number(searchParam.enrollYear) : -1
  });
}

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="年级管理">
      <!-- 工具按钮 -->
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
      </template>

      <!-- 是否毕业 -->
      <template #isGraduated="{ row }">
        <el-tag :type="GRADE_GRADUATION_STATUS_TAG_TYPE[row.isGraduated]">
          {{ GRADE_GRADUATION_STATUS_I18N[row.isGraduated] || "--" }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
      </template>
    </ProTable>

    <GradeModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
