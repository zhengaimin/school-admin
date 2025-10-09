<template>
  <div class="table-box">
    <!-- <div class="filter-box">
      <label for="name">留言方向</label>
      <el-select style="width: 180px" v-model="filterForm.messageDirection">
        <el-option v-for="v in messageToList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
    </div> -->
    <div class="filter-box">
      <div>
        <label for="name">学生姓名</label>
        <el-input v-model="filterForm.studentName" style="width: calc(100% - 90px)"></el-input>
      </div>
      <div>
        <label for="">年级</label>
        <el-select
          placeholder="年级"
          @change="
            getdepartmentsList(1);
            getClassList(1);
          "
          style="width: calc(100% - 90px)"
          v-model="filterForm.gradeId"
        >
          <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="">级部</label>
        <el-select
          placeholder="级部"
          @change="getClassList(1)"
          style="width: calc(100% - 70px)"
          v-model="filterForm.departmentId"
        >
          <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="">班级</label>
        <el-select placeholder="班级" style="width: calc(100% - 90px)" v-model="filterForm.classId">
          <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
        </el-select>
      </div>
      <div>
        <label for="name">开始时间</label>
        <el-date-picker
          v-model="filterForm.startTime"
          type="datetime"
          :value-format="'YYYY-MM-DD HH:mm:ss'"
          :format="'YYYY-MM-DD HH:mm:ss'"
          style="width: calc(100% - 90px)"
        />
      </div>
      <div>
        <label for="name">结束时间</label>
        <el-date-picker
          v-model="filterForm.endTime"
          type="datetime"
          :value-format="'YYYY-MM-DD HH:mm:ss'"
          :format="'YYYY-MM-DD HH:mm:ss'"
          style="width: calc(100% - 90px)"
        />
      </div>
      <div>
        <el-button @click="reset" style="margin-left: 20px">重置</el-button>
        <el-button type="primary" @click="fetchTenantList">查询</el-button>
      </div>
    </div>
    <div class="btn-box">
      <span>留言记录</span>
      <div>
        <el-button type="primary" @click="exportInfo">导出</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="级部" prop="departmentName" width="100"> </el-table-column>
        <el-table-column label="班级" prop="className" width="100"> </el-table-column>
        <el-table-column label="卡号" prop="cardNumber" min-width="110"> </el-table-column>
        <el-table-column label="称呼" prop="guardianName" width="90"> </el-table-column>
        <el-table-column label="接收方手机号" prop="receiverPhone" width="130"> </el-table-column>
        <el-table-column label="留言方向" prop="messageDirection" min-width="130">
          <template #default="{ row }">
            {{ { STUDENT_TO_GUARDIAN: "学生给家长留言", GUARDIAN_TO_STUDENT: "家长给学生留言" }[row.messageDirection] }}
          </template>
        </el-table-column>
        <el-table-column label="是否已读" prop="isRead" width="100">
          <template #default="{ row }">
            {{ row.isRead ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="是否使用套餐" width="120">
          <template #default="{ row }">
            {{ row.isPackageUsage ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            {{ ["", "正常", "删除"][row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="amount" width="130"> </el-table-column>
        <el-table-column label="操作" align="center" width="90" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="detail(scope.row)">详情</div>
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
    <!-- 详情 -->
    <el-dialog v-model="dialogVisibledetail" :close-on-click-modal="false" title="详情" width="809">
      <div style="padding-left: 20px">
        <div>
          <el-descriptions column="2" border title="" style="margin-bottom: 20px">
            <el-descriptions-item label="学生姓名">{{ detailObj.studentName }}</el-descriptions-item>
            <el-descriptions-item label="留言方向">{{
              { STUDENT_TO_GUARDIAN: "学生给家长留言", "GUARDIAN_TO_STUDENT ": "家长给学生留言" }[detailObj.messageDirection]
            }}</el-descriptions-item>
            <el-descriptions-item label="接收方手机号">{{ detailObj.receiverPhone }}</el-descriptions-item>
            <el-descriptions-item label="称呼">{{ detailObj.guardianName }}</el-descriptions-item>
            <el-descriptions-item label="唯一号">{{ detailObj.studentUuid }}</el-descriptions-item>
            <el-descriptions-item label="卡号">{{ detailObj.cardNumber }}</el-descriptions-item>
            <el-descriptions-item label="是否已读">{{ detailObj.isRead ? "是" : "否" }}</el-descriptions-item>
            <el-descriptions-item label="状态"> {{ ["", "正常", "删除"][detailObj.status] }}</el-descriptions-item>
            <el-descriptions-item label="是否免费试用">{{ detailObj.isFreeUsage ? "是" : "否" }}</el-descriptions-item>
            <el-descriptions-item label="套餐类型">{{
              { GENERAL: "通用套餐", FIXED: "固定套餐" }[detailObj.packageType]
            }}</el-descriptions-item>
            <el-descriptions-item label="套餐购买价格（元）">{{ detailObj.purchasePrice }}</el-descriptions-item>
            <el-descriptions-item label="学校">{{ detailObj.schoolName }}</el-descriptions-item>
            <el-descriptions-item label="年级">{{ detailObj.gradeName }}</el-descriptions-item>
            <el-descriptions-item label="级部">{{ detailObj.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ detailObj.className }}</el-descriptions-item>
            <el-descriptions-item label="联系人">{{ detailObj.contactName }}</el-descriptions-item>
            <el-descriptions-item label="SN">{{ detailObj.deviceSn }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: center">
              <el-button type="primary" @click="dialogVisibledetail = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 批量导出 -->
    <el-dialog v-model="exportDialog" :close-on-click-modal="false" title="批量导出" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="exportlinkFormRef" :model="exportForm" class="demo-ruleForm" label-position="left">
          <el-form-item label="">
            <div style="">
              <div style="margin-top: 20px; font-size: 16px">请选择导出页码（每次最多导出一万条）：</div>
              <el-pagination
                v-model:current-page="pageInfo"
                v-model:page-size="pageSizeInfo"
                :page-sizes="[10000]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalInfo"
              />
            </div>
          </el-form-item>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: center">
              <el-button @click="exportDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmexport">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import axios from "axios";
import { ElNotification, ElMessage } from "element-plus";
import {
  gradesList as gradesListApi,
  departmentsList as departmentsListApi,
  classesList as classesListApi,
  messagesList as messagesListApi,
  messagesDetail as messagesDetailApi,
  messagesListExportInfo as messagesListExportInfoApi
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const isloading = ref(false);
const isloading1 = ref(false);

const filterForm = reactive({
  studentName: "",
  messageDirection: "",
  gradeId: "",
  departmentId: "",
  classId: "",
  startTime: "",
  endTime: ""
});

const gradesList = ref([]);
const departmentsList = ref([]);
const classList = ref([]);

const dialogVisibledetail = ref(false);
const detailObj = reactive({ packageContent: {} });

const carbonCk_list = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const exportDialog = ref(false);
const totalInfo = ref(0);
const pageInfo = ref(1);
const pageSizeInfo = ref(10000);
const exportForm = reactive({});

const schoolId = computed(() => (userStore.schoolMsg.schoolId ? Number(userStore.schoolMsg.schoolId) : ""));
const token = computed(() => userStore.token);

const exportmessageUrl = computed(() => {
  if (process.env.NODE_ENV == "development") {
    return `/api/admin/messages/export`;
  } else {
    return `/admin/messages/export`;
  }
});

const getGradesList = () => {
  if (isloading.value) return;
  isloading.value = true;
  let params = `schoolId=${schoolId.value}&page=1&pageSize=200&enrollYear=-1`;
  gradesListApi(params).then(res => {
    if (res.code == 0 && res.data && res.data.list) {
      gradesList.value = res.data.list;
    } else {
      gradesList.value = [];
    }
    isloading.value = false;
  });
};

const getdepartmentsList = () => {
  filterForm.departmentId = "";
  filterForm.classId = "";
  let gradeId = filterForm.gradeId;
  let params = `schoolId=${schoolId.value}&page=1&pageSize=100&gradeId=${gradeId}`;
  departmentsListApi(params).then(res => {
    if (res.code == 0 && res.data && res.data.list) {
      departmentsList.value = res.data.list;
    } else {
      departmentsList.value = [];
    }
  });
};

const getClassList = () => {
  filterForm.classId = "";
  let gradeId = filterForm.gradeId;
  let departmentId = filterForm.departmentId;
  let params = `schoolId=${schoolId.value}&page=1&pageSize=200&gradeId=${gradeId}&departmentId=${departmentId}`;
  classesListApi(params).then(res => {
    if (res.code == 0 && res.data && res.data.list) {
      classList.value = res.data.list;
    } else {
      classList.value = [];
    }
  });
};

const reset = () => {
  filterForm.studentName = "";
  filterForm.messageDirection = "";
  filterForm.gradeId = "";
  filterForm.departmentId = "";
  filterForm.classId = "";
  filterForm.startTime = "";
  filterForm.endTime = "";
  fetchTenantList();
};

const fetchTenantList = () => {
  if (isloading1.value) return;
  isloading1.value = true;
  filterForm.startTime = filterForm.startTime ? filterForm.startTime : "";
  filterForm.endTime = filterForm.endTime ? filterForm.endTime : "";
  let params = `schoolId=${schoolId.value}&studentName=${filterForm.studentName}&messageDirection=${filterForm.messageDirection}&startTime=${filterForm.startTime}&endTime=${filterForm.endTime}&page=${page.value}&pageSize=${pageSize.value}&gradeId=${filterForm.gradeId}&departmentId=${filterForm.departmentId}&classId=${filterForm.classId}`;
  messagesListApi(params).then(res => {
    if (res.code == 0 && res.data && res.data.list) {
      carbonCk_list.value = res.data.list;
      total.value = res.data.total;
    } else {
      carbonCk_list.value = [];
      total.value = 0;
    }
    isloading1.value = false;
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

const detail = row => {
  dialogVisibledetail.value = true;
  messagesDetailApi({ id: row.id }).then(res => {
    if (res.code == 0 && res.data) {
      Object.assign(detailObj, res.data);
    }
  });
};

const exportInfo = () => {
  if (schoolId.value == -1) {
    ElMessage.warning("请先选择学校");
    return;
  }
  exportDialog.value = true;
  let params = `schoolId=${schoolId.value}&gradeId=${filterForm.gradeId}&departmentId=${filterForm.departmentId}&classId=${filterForm.classId}&startTime=${filterForm.startTime}&endTime=${filterForm.endTime}`;
  messagesListExportInfoApi(params).then(res => {
    if (res.code == 0 && res.data) {
      totalInfo.value = res.data.totalRecords;
    }
  });
};

const confirmexport = () => {
  let url = `${exportmessageUrl.value}?page=${pageInfo.value}&pageSize=${pageSizeInfo.value}&schoolId=${schoolId.value}&gradeId=${filterForm.gradeId}&departmentId=${filterForm.departmentId}&classId=${filterForm.classId}&startTime=${filterForm.startTime}&endTime=${filterForm.endTime}`;
  ElNotification({
    title: "提示",
    message: "数据导出中，请稍后",
    type: "success",
    duration: 0
  });
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token.value
      },
      responseType: "blob"
    })
    .then(data => {
      const content = data.data;
      let blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      let url = window.URL.createObjectURL(blob);
      let aLink = document.createElement("a");
      aLink.href = url;
      aLink.setAttribute("download", "留言记录.xlsx");
      aLink.click();
      window.URL.revokeObjectURL(url);
      exportDialog.value = false;
      ElNotification.closeAll();
    });
};

watch(
  schoolId,
  newVal => {
    if (newVal) {
      getGradesList();
      fetchTenantList();
      filterForm.gradeId = "";
      filterForm.departmentId = "";
      filterForm.classId = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  getGradesList();
  fetchTenantList();
});
</script>
<style lang="scss" scoped>
@import "./index";
</style>
