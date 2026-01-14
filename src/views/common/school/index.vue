<script setup lang="ts" name="school">
import type { School } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSchoolsListApi } from "@/api/modules";
import { schoolsDelete } from "@/api/modules/InternalPage.js";
import { useManage } from "@/hooks/useManage";
import { useUserStore } from "@/stores/modules/user";
import { ENABLE_STATUS_OPTIONS } from "@/config/modules";
import SchoolModal from "./modal/School.vue";

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: getSchoolsListApi });

const modalRef = ref();
const userStore = useUserStore();

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
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "createdAt", label: "创建时间", width: 170 },
  { prop: "updatedAt", label: "更新时间", width: 170 },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

/** 显示弹框 */
const onShowModal = (type: "Add" | "Edit", row?: School.ISchoolItem) => {
  const titleMap = {
    Add: "新增学校",
    Edit: "编辑学校"
  };
  modalRef.value.acceptParams({ title: titleMap[type], type }, row);
};

/** 处理删除行 */
const handleDeleteRow = (row: School.ISchoolItem) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        if (!row.id) return;
        const result = await schoolsDelete({ id: row.id });

        if (result && result.code == 0) {
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
};
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学校管理">
      <!-- 工具按钮 -->
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="onShowModal('Add')">新增</el-button>
      </template>

      <!-- 校徽 -->
      <template #badge="{ row }">
        <el-avatar v-if="row.badge" :size="60" :src="row.badge" fit="cover" />
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal('Edit', row)">编辑</el-button>
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
