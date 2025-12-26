<script setup lang="ts">
import type { ColumnProps } from "@/components/ProTable/interface";
import type { OptionItem, StudentItem } from "../types";

import { nextTick, reactive, ref, watch } from "vue";
import { studentsList } from "@/api/modules/InternalPage.js";
import { getClassesListApi, getDepartmentsListApi } from "@/api/modules";
import ProTable from "@/components/ProTable/index.vue";
import { useSchool } from "@/hooks/useSchool";
import { useManage } from "@/hooks/useManage";

interface Props {
  /** 年级选项数据 */
  gradeOptions?: OptionItem[];
}

withDefaults(defineProps<Props>(), {
  gradeOptions: () => []
});

/** 弹窗可见状态 */
const visible = defineModel<boolean>({ default: false });

/** 已选择的学生列表 */
const selected = defineModel<StudentItem[]>("selected", { default: () => [] });

const { schoolId } = useSchool();

/** 弹窗内草稿选中列表，用于跨页保持选择状态 */
const draftSelected = ref<StudentItem[]>([]);

/** 标记是否正在恢复选中状态（避免触发 selection-change 回调） */
const isRestoring = ref(false);

const filters = reactive({
  name: "",
  gradeId: null as number | null,
  departmentId: null as number | null,
  classId: null as number | null
});

const departmentOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

/** 表格列配置 */
const columns: ColumnProps<StudentItem>[] = [
  { type: "selection", width: 55 },
  { prop: "name", label: "学生姓名", minWidth: 120 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "gradeName", label: "年级", minWidth: 120 },
  { prop: "departmentName", label: "级部", minWidth: 120 },
  { prop: "className", label: "班级", minWidth: 120 }
];

/** 获取学生列表 API */
const getStudentsListApi = async (params: Record<string, any>) => {
  const query = new URLSearchParams();
  query.set("schoolId", String(Number(params?.schoolId ?? schoolId.value)));
  query.set("page", String(params?.page ?? 1));
  query.set("pageSize", String(params?.pageSize ?? 10));
  query.set("name", filters.name || "");
  query.set("gradeId", String(filters.gradeId ?? -1));
  query.set("departmentId", String(filters.departmentId ?? -1));
  query.set("classId", String(filters.classId ?? -1));
  return await studentsList(query.toString());
};

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getStudentsListApi });

/** 获取级部列表 */
const axiosGetDepartmentsOptions = async (gradeId: number): Promise<OptionItem[]> => {
  try {
    const result = await getDepartmentsListApi(
      {
        schoolId: Number(schoolId.value),
        gradeId,
        page: 1,
        pageSize: 200
      },
      { loading: false }
    );

    if (result.code === 0) {
      return (result.data?.list || []) as OptionItem[];
    }
    return [];
  } catch (error) {
    console.error("axiosGetDepartmentsOptions:", error);
    return [];
  }
};
/** 获取班级列表 */
const axiosGetClassesOptions = async (gradeId: number | null, departmentId: number | null): Promise<OptionItem[]> => {
  try {
    const result = await getClassesListApi(
      {
        schoolId: Number(schoolId.value),
        gradeId: gradeId || undefined,
        departmentId: departmentId || undefined,
        page: 1,
        pageSize: 200
      },
      { loading: false }
    );

    if (result.code === 0) {
      return (result.data?.list || []) as OptionItem[];
    }
    return [];
  } catch (error) {
    console.error("axiosGetClassesOptions:", error);
    return [];
  }
};

/** 恢复表格选中状态（基于草稿选中列表） */
const restoreSelection = async (): Promise<void> => {
  await nextTick();
  const elTable = proTable.value?.element;
  const tableData = proTable.value?.tableData || [];
  if (!elTable) return;

  isRestoring.value = true;
  try {
    const draftIds = new Set(draftSelected.value.map(s => s.id));
    elTable.clearSelection?.();
    tableData.forEach((row: StudentItem) => {
      if (draftIds.has(row.id)) {
        elTable.toggleRowSelection?.(row, true);
      }
    });
  } finally {
    await nextTick();
    isRestoring.value = false;
  }
};

/** 同步选中状态到草稿（跨页差分更新） */
const syncDraftSelected = (currentPageSelected: StudentItem[]): void => {
  if (isRestoring.value) return;

  const tableData = (proTable.value?.tableData || []) as StudentItem[];
  const currentPageIds = new Set(tableData.map(s => s.id));
  const currentSelectedIds = new Set(currentPageSelected.map(s => s.id));

  // 保留非当前页的选中 + 当前页被选中的
  const filtered = draftSelected.value.filter(s => {
    if (!currentPageIds.has(s.id)) return true;
    return currentSelectedIds.has(s.id);
  });

  // 添加当前页新选中的
  const existingIds = new Set(filtered.map(s => s.id));
  currentPageSelected.forEach(s => {
    if (!existingIds.has(s.id)) filtered.push(s);
  });

  draftSelected.value = filtered;
};

/** 确认选择 */
const handleConfirm = (): void => {
  selected.value = [...draftSelected.value];
  visible.value = false;
};

/** 年级变更处理 */
const handleGradeChange = async (value: number | null): Promise<void> => {
  filters.departmentId = null;
  filters.classId = null;
  departmentOptions.value = [];
  classOptions.value = [];

  if (value != null) {
    departmentOptions.value = await axiosGetDepartmentsOptions(value);
    classOptions.value = await axiosGetClassesOptions(value, null);
  }
};

/** 级部变更处理 */
const handleDepartmentChange = async (value: number | null): Promise<void> => {
  filters.classId = null;
  classOptions.value = [];

  if (filters.gradeId != null) {
    classOptions.value = await axiosGetClassesOptions(filters.gradeId, value);
  }
};

/** 查询 */
const handleSearch = (): void => {
  proTable.value?.search?.();
};

/** 重置筛选并查询 */
const handleReset = (): void => {
  filters.name = "";
  filters.gradeId = null;
  filters.departmentId = null;
  filters.classId = null;
  departmentOptions.value = [];
  classOptions.value = [];
  proTable.value?.reset?.();
};

/** 弹窗打开处理 */
const handleDialogOpen = async (): Promise<void> => {
  filters.name = "";
  filters.gradeId = null;
  filters.departmentId = null;
  filters.classId = null;
  departmentOptions.value = [];
  classOptions.value = [];
  draftSelected.value = [...selected.value];
  await refreshTableList();
  await restoreSelection();
};

/** 表格选中变化处理 */
const handleSelectionChange = (rows: StudentItem[]): void => {
  if (!visible.value) return;
  syncDraftSelected(rows);
};

/** 监听表格数据变化，恢复选中状态 */
watch(
  () => proTable.value?.tableData as StudentItem[] | undefined,
  () => {
    if (!visible.value) return;
    restoreSelection();
  }
);
</script>

<template>
  <el-dialog
    v-model="visible"
    class="student-select-dialog"
    :close-on-click-modal="false"
    destroy-on-close
    draggable
    align-center
    title="选择学生"
    :width="1120"
    @open="handleDialogOpen"
  >
    <!-- 筛选条件 -->
    <div class="flex flex-row flex-wrap items-center gap-3 mb-4">
      <el-input v-model="filters.name" class="w-[180px]" placeholder="学生姓名" clearable />
      <el-select v-model="filters.gradeId" class="w-40" placeholder="年级" clearable @change="handleGradeChange">
        <el-option v-for="v in gradeOptions" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
      <el-select
        v-model="filters.departmentId"
        class="w-40"
        placeholder="级部"
        clearable
        :disabled="!filters.gradeId"
        @change="handleDepartmentChange"
      >
        <el-option v-for="v in departmentOptions" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
      <el-select
        v-model="filters.classId"
        class="w-40"
        placeholder="班级"
        clearable
        :disabled="!filters.gradeId || !filters.departmentId"
      >
        <el-option v-for="v in classOptions" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
      <el-button @click="handleReset">重置</el-button>
      <el-button class="ml-[0]!" type="primary" @click="handleSearch">查询</el-button>
    </div>

    <!-- 学生列表 -->
    <ProTable
      class="h-[640px]!"
      ref="proTable"
      :columns="columns"
      :request-api="axiosGetTableList"
      row-key="id"
      :tool-button="false"
      @selection-change="handleSelectionChange"
    />

    <template #footer>
      <div class="flex flex-row items-center justify-end gap-3">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认（已选 {{ draftSelected.length }} 人）</el-button>
      </div>
    </template>
  </el-dialog>
</template>
