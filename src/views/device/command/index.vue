<template>
  <div class="table-box">
    <div class="filter-box">
      <!-- <label for="name">设备组名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input> -->
      <label for="name">启用状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>设备命令</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list" v-loading="isloading">
        <el-table-column label="学校" prop="schoolName" width="130"> </el-table-column>
        <el-table-column label="命令UUID" prop="cmdUuid" width="150"> </el-table-column>
        <el-table-column label="设备ID" prop="deviceId" width="140"> </el-table-column>
        <el-table-column label="设备名称" prop="deviceName" width="140"> </el-table-column>
        <el-table-column label="终端KEY" prop="terminalKey" width="140"> </el-table-column>
        <el-table-column label="SN" prop="terminalSn" width="140"> </el-table-column>
        <!-- <el-table-column label="命令类型" prop="commandType" width="140"> </el-table-column> -->
        <el-table-column label="命令" prop="commandName" width="140"> </el-table-column>
        <el-table-column label="状态" prop="statusText" width="140"> </el-table-column>
        <el-table-column label="描述" prop="describe" width="220"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="操作" align="center" width="90" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="deleteRow(scope.row)">
                <img
                  src="@/assets/images/common/delete-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; margin-right: 3px"
                />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { devicecommandsList, devicecommandsDelete } from "@/api/modules/InternalPage.js";

// 响应式数据
const isloading = ref(false);
const carbonCk_list = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const filterForm = reactive({
  name: "",
  status: ""
});

const gradesList = ref([
  { id: "PENDING", name: "待执行" },
  { id: "SUCCESS", name: "执行成功" },
  { id: "FAILED", name: "执行失败" }
]);

// 计算属性
const userStore = useUserStore();
const schoolId = computed(() => {
  return userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : "";
});

// 方法
const reset = () => {
  filterForm.name = "";
  filterForm.status = "";
  fetchTenantList();
};

const fetchTenantList = () => {
  if (isloading.value) return;
  isloading.value = true;
  const status = filterForm.status;
  const params = `schoolId=${schoolId.value}&page=${page.value}&pageSize=${pageSize.value}&status=${status}`;
  devicecommandsList(params).then(res => {
    if (res.code == 0 && res.data && res.data.list) {
      carbonCk_list.value = res.data.list;
      total.value = res.data.total;
    } else {
      carbonCk_list.value = [];
      total.value = 0;
    }
    isloading.value = false;
  });
};

// 获取表单数据
const handleSizeChange = val => {
  page.value = 1;
  pageSize.value = val;
  fetchTenantList();
};

const handleCurrentChange = val => {
  page.value = val;
  fetchTenantList();
};

const deleteRow = row => {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      devicecommandsDelete({ id: row.id }).then(res => {
        if (res && res.code == 0) {
          ElMessage.success("删除成功");
          fetchTenantList();
        }
      });
    })
    .catch(() => {
      console.log("取消删除");
    });
};

// 监听器
watch(
  schoolId,
  newVal => {
    if (newVal) {
      fetchTenantList();
    }
  },
  { immediate: true }
);

// 生命周期钩子
onMounted(() => {
  fetchTenantList();
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
