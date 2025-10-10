<template>
  <div class="table-box">
    <div class="btn-box">
      <span>公话配置</span>
      <div>
        <el-button v-if="total == 0" type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校名称" prop="schoolName" width="160"> </el-table-column>
        <el-table-column label="心跳时间（ms）" prop="heartbeatFrequency"> </el-table-column>
        <el-table-column label="单次通话限定时长（分钟）" prop="callTime"> </el-table-column>
        <el-table-column label="定时开机时间" prop="powerOnTime"> </el-table-column>
        <el-table-column label="定时关机时间" prop="powerOffTime"> </el-table-column>
        <el-table-column label="禁拨号码" prop="forbidPhone" v-if="false"> </el-table-column>
        <el-table-column label="拨号类型">
          <template #default="{ row }">
            {{ PHONE_TYPE_I18N[row.phoneType] }}
          </template>
        </el-table-column>
        <el-table-column label="是否显示留言按钮">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.messageFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="是否全量同步人脸" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.downloadUserFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="开启语音留言" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.messageSoundFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="心理咨询身份认证" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.mhcFlag] }}
          </template>
        </el-table-column>
        <el-table-column label="刷脸记录人员信息" v-if="false">
          <template #default="{ row }">
            {{ { Y: "是", N: "否" }[row.addPunchFace] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="detail(scope.row)">详情</div>
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
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
    <add-or-edit-dialog ref="addOrEditDialogRef" :school-name="schoolName" @success="fetchTenantList" />
    <detail-dialog ref="detailDialogRef" />
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { PHONE_TYPE_I18N } from "@/config/modules/device";
import { deviceconfigList, deviceconfigDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

import AddOrEditDialog from "./modules/AddOrEditDialog.vue";
import DetailDialog from "./modules/DetailDialog.vue";

const userStore = useUserStore();

const isloading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const carbonCk_list = ref([]);
const addOrEditDialogRef = ref(null);
const detailDialogRef = ref(null);

const schoolId = computed(() => (userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : ""));
const schoolName = computed(() => userStore.schoolMsg.schoolName);

const fetchTenantList = () => {
  if (isloading.value) return;
  isloading.value = true;
  let params = `schoolId=${schoolId.value}&page=${page.value}&pageSize=${pageSize.value}`;
  deviceconfigList(params)
    .then(res => {
      if (res.code == 0 && res.data && res.data.list) {
        carbonCk_list.value = res.data.list;
        total.value = res.data.total;
      } else {
        carbonCk_list.value = [];
        total.value = 0;
      }
    })
    .finally(() => {
      isloading.value = false;
    });
};

const handleSizeChange = val => {
  page.value = 1;
  pageSize.value = val;
  fetchTenantList();
};

const handleCurrentChange = val => {
  page.value = val;
  fetchTenantList();
};

const openAddDialog = () => {
  if (schoolId.value == -1) {
    ElMessage.warning("请先选择右上角的学校");
    return;
  }
  addOrEditDialogRef.value?.openDialog();
};

const editRow = row => {
  addOrEditDialogRef.value?.openDialog(row);
};

const detail = row => {
  detailDialogRef.value?.openDialog(row);
};

const deleteRow = row => {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deviceconfigDelete({ id: row.id }).then(res => {
      if (res && res.code == 0) {
        ElMessage.success("删除成功");
        fetchTenantList();
      }
    });
  });
};

watch(
  schoolId,
  newVal => {
    if (newVal) {
      fetchTenantList();
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchTenantList();
});
</script>
<style lang="scss" scoped>
@import "./index";
</style>
