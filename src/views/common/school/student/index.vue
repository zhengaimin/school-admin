<script setup lang="ts" name="studentAdmin">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { ResultData, Student } from "@/api/interface";
import type { StudentImportType } from "./types";

import { computed, ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import StudentModal from "./modal/Student.vue";
import FamilyContactModal from "./modal/FamilyContact.vue";
import ImportModal from "./modal/Import.vue";
import FaceSyncModal from "./modal/FaceSync.vue";
import { deleteStudentApi, getStudentTemplateApi, getStudentsListApi, postStudentExportApi } from "@/api/modules";
import { useGradeDepartmentClassOptions } from "@/hooks/useGradeDepartmentClassOptions";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { useUserStore } from "@/stores/modules/user";
import {
  FACE_STATUS_I18N,
  FACE_STATUS_TAG_TYPE,
  ORDER_DIRECTION_OPTIONS,
  STUDENT_STATUS_I18N,
  STUDENT_STATUS_TAG_TYPE,
  STUDENT_TYPE_I18N
} from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

const { schoolId, guardSchool } = useSchool();
const userStore = useUserStore();

const studentModalRef = ref<InstanceType<typeof StudentModal>>();
const familyContactModalRef = ref<InstanceType<typeof FamilyContactModal>>();
const importModalRef = ref<InstanceType<typeof ImportModal>>();
const faceSyncModalRef = ref<InstanceType<typeof FaceSyncModal>>();

const {
  gradeOptions,
  departmentOptions,
  classOptions,
  loadGradeOptions,
  handleGradeCascade,
  handleDepartmentCascade,
  resetAllOptions
} = useGradeDepartmentClassOptions({
  schoolId,
  requestOptions: {
    department: { loading: false },
    class: { loading: false }
  }
});

const userInfo = computed(() => userStore.userInfo);

const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: axiosGetStudentsListApi,
  delete: deleteStudentApi
});

const columns: ColumnProps<Student.IStudentItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "学生姓名",
    minWidth: 110,
    search: { el: "input", props: { placeholder: "请输入学生姓名" } }
  },
  {
    prop: "uuid",
    label: "唯一号",
    minWidth: 160,
    search: { el: "input", props: { placeholder: "请输入唯一号" } }
  },
  { prop: "faceImageUrl", label: "图片", width: 100, align: "center" },
  { prop: "faceStatus", label: "人脸核验", width: 100, fixed: "right" },
  { prop: "gradeName", label: "年级", minWidth: 90 },
  { prop: "departmentName", label: "级部", minWidth: 90 },
  { prop: "className", label: "班级", minWidth: 90 },
  {
    prop: "studentCode",
    label: "学号",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入学号" } }
  },
  { prop: "idCard", label: "身份证", minWidth: 180 },
  { prop: "giftMinutes", label: "赠送通话剩余分钟数", minWidth: 160, align: "center" },
  { prop: "totalBalance", label: "总余额（元）", minWidth: 120, align: "center" },
  { prop: "availableBalance", label: "可用余额（元）", minWidth: 120, align: "center" },
  { prop: "sex", label: "性别", width: 80 },
  { prop: "cardNumber", label: "IC卡号", minWidth: 140 },
  { prop: "phone", label: "电话", minWidth: 120 },
  { prop: "guardianName", label: "监护人", width: 90 },
  { prop: "guardianPhone", label: "监护人电话", minWidth: 120 },
  { prop: "studentType", label: "学生类型", width: 100 },
  { prop: "status", label: "状态", width: 90 },
  { prop: "createdAt", label: "创建时间", minWidth: 160 },
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
    prop: "createdAtOrder",
    label: "创建时间",
    isShow: false,
    enum: ORDER_DIRECTION_OPTIONS,
    search: { el: "select", props: { placeholder: "升降排序" } }
  },
  {
    prop: "uuidOrder",
    label: "唯一号",
    isShow: false,
    enum: ORDER_DIRECTION_OPTIONS,
    search: { el: "select", props: { placeholder: "升降排序" } }
  },
  { prop: "operation", label: "操作", width: 240, fixed: "right" }
];

/** 构建排序参数 */
function buildOrderParam(createdAtOrder?: string, uuidOrder?: string, sort?: string) {
  const orders: string[] = [];
  if (createdAtOrder) orders.push(`created_at:${createdAtOrder}`);
  if (uuidOrder) orders.push(`uuid:${uuidOrder}`);
  if (!orders.length && sort) {
    const [field, direction] = String(sort).split("-");
    if (field && direction) orders.push(`${field}:${direction}`);
  }
  return orders.length ? orders.join(",") : undefined;
}

/** 生成下载文件 */
function downloadBlob(data: BlobPart, filename: string) {
  const blob = new Blob([data], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
  window.URL.revokeObjectURL(url);
}

/** 获取学生列表 */
async function axiosGetStudentsListApi(params: Record<string, any>): Promise<ResultData<Student.ResGetStudentsApi>> {
  try {
    const { createdAtOrder, uuidOrder, sort, ...rest } = params;
    const order = buildOrderParam(createdAtOrder, uuidOrder, sort);
    return await getStudentsListApi({
      ...(rest as Student.ReqGetStudentsApi),
      order
    });
  } catch (error) {
    console.error("axiosGetStudentsListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}
/** 下载导入模板 */
async function axiosGetStudentTemplateApi() {
  try {
    const params: Student.ReqGetStudentTemplateApi = {
      schoolId: Number(schoolId.value)
    };
    if (!isNullOrUnDef(userInfo.value?.tenantId)) {
      params.tenantId = userInfo.value.tenantId;
    }
    const blob = await getStudentTemplateApi(params);
    downloadBlob(blob, "学生导入模板.xlsx");
  } catch (error) {
    console.error("axiosGetStudentTemplateApi:", error);
  }
}
/** 批量导出学生信息 */
async function axiosPostStudentExportApi(params: Student.ReqPostStudentExportApi) {
  try {
    const blob = await postStudentExportApi(params);
    downloadBlob(blob, "学生信息.xlsx");
    ElNotification.closeAll();
  } catch (error) {
    console.error("axiosPostStudentExportApi:", error);
    ElNotification.closeAll();
  }
}

/** 打开学生弹窗 */
function handleShowModal(type: "Add" | "Edit", row?: Student.IStudentItemVo) {
  if (type === "Add" && !guardSchool()) return;
  const titleMap = {
    Add: "新增学生",
    Edit: "编辑学生"
  };
  studentModalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 打开亲情号弹窗 */
function handleShowParentDialog(row: Student.IStudentItemVo) {
  familyContactModalRef.value?.acceptParams(row);
}
/** 打开导入弹窗 */
function handleOpenImportDialog(type: StudentImportType) {
  if (!guardSchool()) return;
  importModalRef.value?.acceptParams({ importType: type });
}
/** 下载导入模板 */
function handleDownloadTemplate() {
  if (!guardSchool()) return;
  axiosGetStudentTemplateApi();
}
/** 批量导出学生信息 */
function handleExportStudentInfo() {
  if (!guardSchool()) return;
  const searchParam = proTable.value?.searchParam || {};
  const params = {
    schoolId: Number(schoolId.value),
    gradeId: searchParam.gradeId ?? -1,
    departmentId: searchParam.departmentId ?? -1,
    classId: searchParam.classId ?? -1
  };
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "success",
    duration: 0
  });
  axiosPostStudentExportApi(params);
}
/** 打开人脸下发弹窗 */
function handleOpenFaceControl(row: Student.IStudentItemVo) {
  faceSyncModalRef.value?.acceptParams(row);
}

watch(
  () => proTable.value?.searchParam?.gradeId,
  async gradeId => {
    await handleGradeCascade({
      gradeId: isNullOrUnDef(gradeId) ? null : Number(gradeId),
      reset: () => {
        if (!proTable.value?.searchParam) return;
        proTable.value.searchParam.departmentId = undefined;
        proTable.value.searchParam.classId = undefined;
      }
    });
  }
);
watch(
  () => proTable.value?.searchParam?.departmentId,
  async departmentId => {
    const gradeId = proTable.value?.searchParam?.gradeId;
    await handleDepartmentCascade({
      gradeId: isNullOrUnDef(gradeId) ? null : Number(gradeId),
      departmentId: isNullOrUnDef(departmentId) ? null : Number(departmentId),
      reset: () => {
        if (!proTable.value?.searchParam) return;
        proTable.value.searchParam.classId = undefined;
      }
    });
  }
);
watch(
  schoolId,
  () => {
    resetAllOptions();
    loadGradeOptions();
    refreshTableList();
  },
  { immediate: true }
);
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学生信息">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
        <el-button type="primary" @click="handleOpenImportDialog(1)">导入学生信息</el-button>
        <el-button type="primary" @click="handleDownloadTemplate">下载导入模板</el-button>
        <el-button type="primary" @click="handleExportStudentInfo">批量导出学生信息</el-button>
        <el-button type="primary" @click="handleOpenImportDialog(2)">批量导入更新学生信息</el-button>
      </template>

      <template #faceImageUrl="{ row }">
        <el-avatar v-if="row.faceImageUrl" :size="60" fit="cover" :src="row.faceImageUrl" class="pointer-events-none" />
      </template>

      <template #faceStatus="{ row }">
        <el-tag :type="FACE_STATUS_TAG_TYPE[row.faceStatus]">
          {{ FACE_STATUS_I18N[row.faceStatus] || "--" }}
        </el-tag>
      </template>

      <template #studentType="{ row }">
        {{ STUDENT_TYPE_I18N[row.studentType] || "--" }}
      </template>

      <template #status="{ row }">
        <el-tag :type="STUDENT_STATUS_TAG_TYPE[row.status]">
          {{ STUDENT_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowParentDialog(row)">亲情号</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="deleteRow(row.id, row.name)">删除</el-button>
        <el-button type="warning" link @click="handleOpenFaceControl(row)">人脸下发</el-button>
      </template>
    </ProTable>

    <StudentModal ref="studentModalRef" @submit="refreshTableList" />
    <FamilyContactModal ref="familyContactModalRef" />
    <ImportModal ref="importModalRef" @submit="refreshTableList" />
    <FaceSyncModal ref="faceSyncModalRef" />
  </div>
</template>
