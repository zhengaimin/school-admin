<script setup lang="ts" name="school">
import type { ResultData, School } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref, unref } from "vue";
import { getSchoolsListApi } from "@/api/modules";
import { CirclePlus } from "@element-plus/icons-vue";
import { schoolsDelete } from "@/api/modules/InternalPage.js";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import SchoolModal from "./modal/School.vue";
import { ENABLE_STATUS, ENABLE_STATUS_I18N, ENABLE_STATUS_OPTIONS } from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
const { getUploadPath } = useAssetsPath();
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetSchoolListApi });

/** 弹窗引用 */
const modalRef = ref<InstanceType<typeof SchoolModal>>();

// 表格列配置
const columns: ColumnProps<School.ISchoolItem>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "name",
    label: "学校名称",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入学校名称" } }
  },
  { prop: "badge", label: "校徽", width: 100, align: "center" },
  { prop: "address", label: "学校地址", minWidth: 200 },
  { prop: "principal", label: "校长", width: 120 },
  { prop: "phone", label: "联系方式", width: 140 },
  { prop: "motto", label: "校训", minWidth: 150 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    enum: ENABLE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } },
    fixed: "right"
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "updatedAt", label: "更新时间", width: 170 },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

/** 获取校徽地址 */
function getBadgeUrl(badge?: string) {
  return getUploadPath(badge ?? "");
}

/** 获取学校列表 */
async function axiosGetSchoolListApi(params: School.ReqSchoolsListParams): Promise<ResultData<School.ResSchoolsListData>> {
  try {
    return await getSchoolsListApi(params);
  } catch (error) {
    console.error("axiosGetSchoolListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}

/** 删除学校 */
async function axiosDeleteSchoolApi(id: number) {
  try {
    return await schoolsDelete({ id });
  } catch (error) {
    console.error("axiosDeleteSchoolApi:", error);
    return { code: -1, data: null };
  }
}

/** 显示弹框 */
function handleShowModal(type: "Add" | "Edit", row?: School.ISchoolItem) {
  const modal = unref(modalRef);
  if (!modal) return;
  const titleMap = {
    Add: "新增学校",
    Edit: "编辑学校"
  };
  modal.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}

/** 处理删除行 */
function handleDeleteRow(row: School.ISchoolItem) {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        if (!row.id) return;
        const result = await axiosDeleteSchoolApi(row.id);

        if (result && result.code === 0) {
          ElMessage.success("删除成功");
          refreshTableList();
          let num = Math.floor(Math.random() * 1000);
          userStore.setCount(num);

          return;
        }

        ElMessage.error("学校使用中，请勿删除！");
      } catch {
        ElMessage.error("学校使用中，请勿删除！");
      }
    })
    .catch(() => {
      console.log("取消删除");
    });
}
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学校管理">
      <!-- 工具按钮 -->
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
      </template>

      <!-- 校徽 -->
      <template #badge="{ row }">
        <el-avatar v-if="row.badge" :size="60" :src="getBadgeUrl(row.badge)" fit="cover" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="handleDeleteRow(row)">删除</el-button>
      </template>
    </ProTable>

    <SchoolModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
