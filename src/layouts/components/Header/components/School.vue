<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getSchoolsListApi } from "@/api/modules/schools";
import { useUserStore } from "@/stores/modules/user";

interface SchoolItem {
  id: string;
  name: string;
}

const userStore = useUserStore();
const schoolList = ref<SchoolItem[]>([]);
const school = ref("");

const count = computed(() => userStore.count);

/** “全部学校”选项 */
const ALL_SCHOOLS: SchoolItem = { id: "-1", name: "全部学校" };
/** 记录上次选择的学校 id（localStorage key） */
const LAST_SELECTED_SCHOOL_KEY = "lastSelectedSchoolId";

/**
 * 同步当前选中的学校到：
 * 1) `school`（下拉 v-model）
 * 2) `userStore`（全局学校信息）
 * 可选：持久化到 localStorage
 */
const syncSelectedSchool = (nextSchoolId: string, persist = false) => {
  const selectedSchool = schoolList.value.find(item => item.id === nextSchoolId) ?? ALL_SCHOOLS;
  school.value = selectedSchool.id;
  userStore.setSchoolMsg({ schoolId: selectedSchool.id, schoolName: selectedSchool.name });
  if (persist) localStorage.setItem(LAST_SELECTED_SCHOOL_KEY, selectedSchool.id);
};

/**
 * 计算“优先选中的学校 id”
 * 优先级：当前已选中 > localStorage 上次选择 > 列表第一个学校 > “全部学校”
 */
const resolvePreferredSchoolId = () => {
  const currentSchoolId = school.value;
  if (currentSchoolId && schoolList.value.some(item => item.id === currentSchoolId)) return currentSchoolId;

  const lastSchoolId = localStorage.getItem(LAST_SELECTED_SCHOOL_KEY);
  if (lastSchoolId && schoolList.value.some(item => item.id === lastSchoolId)) return lastSchoolId;

  const firstSchool = schoolList.value.find(item => item.id !== ALL_SCHOOLS.id);
  return firstSchool?.id ?? ALL_SCHOOLS.id;
};

/**
 * 获取学校列表并写入下拉数据源；
 * 同时根据“优先选中规则”同步默认选中项到 store
 */
const axiosGetSchoolsListApi = async () => {
  try {
    const result = await getSchoolsListApi({
      page: 1,
      pageSize: 100
    });

    if (result.code === 0) {
      const list = result.data?.list ?? [];
      if (list.length > 0) {
        schoolList.value = [
          ALL_SCHOOLS,
          ...list.map(item => ({
            id: String(item.id),
            name: item.name ?? ""
          }))
        ];
        syncSelectedSchool(resolvePreferredSchoolId());
        return;
      }

      schoolList.value = [ALL_SCHOOLS];
      syncSelectedSchool(ALL_SCHOOLS.id);
      ElMessage.warning("请创建学校");
      return;
    }

    schoolList.value = [ALL_SCHOOLS];
    syncSelectedSchool(ALL_SCHOOLS.id);
    ElMessage.warning(result.msg || "获取学校列表失败");
  } catch (error) {
    console.error("axiosGetSchoolsListApi:", error);
    schoolList.value = [ALL_SCHOOLS];
    syncSelectedSchool(ALL_SCHOOLS.id);
    ElMessage.warning("获取学校列表失败");
  }
};

/**
 * 处理学校切换事件：
 * 同步到 store，并把本次选择写入 localStorage
 */
const handleSchoolChange = () => {
  syncSelectedSchool(school.value, true);
};

onMounted(() => {
  /** 首次进入：获取学校列表并恢复上次选择 */
  axiosGetSchoolsListApi();
});

/** 监听 `count` 变化时刷新学校列表（例如登录态/权限变化后） */
watch(count, (newVal, oldVal) => {
  if (newVal !== oldVal) axiosGetSchoolsListApi();
});
</script>

<template>
  <div class="school-selector">
    <el-select class="custom-dropdown" @change="handleSchoolChange" v-model="school" placeholder="请选择学校">
      <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.school-selector {
  width: 200px;
}
::v-deep(.custom-dropdown) {
  width: 100%;
  .el-select__wrapper {
    padding: 6px 12px;
    background-color: rgba(64, 158, 255, 0.12);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 4px;
    box-shadow: none;
    transition:
      background-color 0.3s,
      border-color 0.3s;
    .el-select__selected-item {
      font-size: 15px;
      font-weight: 500;
      color: var(--el-header-text-color);
    }
    .el-select__placeholder {
      font-size: 15px;
      font-weight: 400;
      color: var(--el-text-color-secondary);
    }
    .el-select__suffix {
      display: inline-flex;
      color: var(--el-header-text-color);
      opacity: 0.7;
    }
  }
  .el-select__wrapper:hover {
    background-color: var(--el-fill-color-light);
    border-color: var(--el-border-color);
  }
  .el-select__wrapper.is-focused {
    background-color: var(--el-fill-color-light);
    border-color: var(--el-color-primary);
  }
}
</style>
