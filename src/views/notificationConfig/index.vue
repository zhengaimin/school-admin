<template>
  <div class="table-box">
    <el-form :model="filterForm" class="filter-box">
      <el-form-item label="通知类型名称或描述">
        <el-input v-model="filterForm.searchKeyword" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="通知类型代码">
        <el-input v-model="filterForm.typeCode" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="filterForm.isEnabled" placeholder="请选择">
          <el-option v-for="v in isEnabledList" :key="v.name" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="filterForm.priority" placeholder="请选择">
          <el-option v-for="v in priorityList" :key="v.id" :label="v.name" :value="Number(v.id)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="fetchTenantList">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <span>通知配置列表</span>
    </div>

    <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
      <el-table-column label="通知类型" prop="typeName" width="130"> </el-table-column>
      <el-table-column label="是否启用" width="90">
        <template #default="{ row }">
          <el-switch @change="changeStatus(row)" v-model="row.isEnabled" :active-value="true" :inactive-value="false" />
        </template>
      </el-table-column>
      <el-table-column label="优先级" prop="priorityText" />
      <el-table-column label="每日最大发送次数" prop="maxDailyCount" width="150" />
      <el-table-column label="最小发送间隔(秒)" prop="minIntervalSeconds" width="150" />
      <el-table-column label="模板数据映射" prop="templateDataMapping" width="190">
        <template #default="{ row }">
          <span v-for="(v, key) in row.templateDataMapping" :key="v">{{ key }}/</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" width="250" />
      <el-table-column label="创建时间" prop="createdAt" width="180" />
      <el-table-column label="更新时间" prop="updatedAt" width="180" />
      <el-table-column label="操作" align="center" width="90" fixed="right">
        <template #default="scope">
          <div class="table-btn">
            <div class="table-btn" @click="editRow(scope.row)">编辑</div>
            <div v-if="false" @click="detail(scope.row)">配置详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 新增/编辑 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="通知类型" prop="typeName">
                <el-input v-model="form.typeName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="每日最大发送次数" prop="maxDailyCount">
                <el-input-number style="width: 100%" :step="1" v-model.number="form.maxDailyCount" :min="0" :max="1000" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="最小发送间隔(秒)" prop="minIntervalSeconds">
                <el-input-number style="width: 100%" :step="1" v-model.number="form.minIntervalSeconds" :min="0" :max="86400" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="优先级" prop="priority">
                <el-select style="width: 100%" v-model="form.priority">
                  <el-option v-for="v in priorityList" :key="v.id" :label="v.name" :value="Number(v.id)" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="是否启用" prop="isEnabled">
                <el-radio-group v-model="form.isEnabled">
                  <el-radio :value="true">启用</el-radio>
                  <el-radio :value="false">不启用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog v-model="dialogVisibleDetail" :close-on-click-modal="false" title="详情" :width="1000">
      <div style="padding-left: 20px">
        <div v-if="detailForm.studentBalance">
          <el-descriptions border title="学生账户">
            <el-descriptions-item label="总余额（元）">{{ detailForm.studentBalance.totalBalance }}</el-descriptions-item>
            <el-descriptions-item label="可用余额（元）">{{ detailForm.studentBalance.availableBalance }}</el-descriptions-item>
            <el-descriptions-item label="冻结余额（元）">{{ detailForm.studentBalance.frozenBalance }}</el-descriptions-item>
            <el-descriptions-item label="赠送通话剩余分钟数">{{ detailForm.studentBalance.giftMinutes }}</el-descriptions-item>
            <el-descriptions-item label="套餐通话剩余分钟数">{{ detailForm.studentBalance.packageMinutes }}</el-descriptions-item>
            <el-descriptions-item label="套餐留言剩余条数">
              {{
                detailForm.studentBalance.packageMessageCount == -1 ? "不限数量" : detailForm.studentBalance.packageMessageCount
              }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              {{ detailForm.studentBalance.status == 1 ? "正常" : "冻结" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-descriptions column="2" border title="通话详情" style="margin-top: 20px">
          <el-descriptions-item label="学生姓名">{{ detailForm.studentName }}</el-descriptions-item>
          <el-descriptions-item label="唯一号">{{ detailForm.studentUuid }}</el-descriptions-item>
          <el-descriptions-item label="物理卡号">{{ detailForm.cardNumber }}</el-descriptions-item>
          <el-descriptions-item label="通话类型">
            {{ { VIDEO: "视频通话", SPEECH: "语音通话" }[detailForm.callType] }}
          </el-descriptions-item>
          <el-descriptions-item label="通道类型">{{ detailForm.channelType }}</el-descriptions-item>
          <el-descriptions-item label="被呼叫号码">{{ detailForm.phoneNumber }}</el-descriptions-item>
          <el-descriptions-item label="联系人称呼">{{ detailForm.contactName }}</el-descriptions-item>
          <el-descriptions-item label="是否是SOS电话">{{ detailForm.isSos ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="呼叫开始时间">{{ detailForm.callStartTime }}</el-descriptions-item>
          <el-descriptions-item label="呼叫结束时间">{{ detailForm.callEndTime }}</el-descriptions-item>
          <el-descriptions-item label="通话时长(分钟)">{{ detailForm.callLenMinute }}</el-descriptions-item>
          <el-descriptions-item label="拨号和通话时长(秒)">{{ detailForm.callDuration }}</el-descriptions-item>
          <el-descriptions-item label="拨号和通话时长">{{ detailForm.callDurationFormatted }}</el-descriptions-item>
          <el-descriptions-item label="消费流水号">{{ detailForm.consumeSerialNo }}</el-descriptions-item>
          <el-descriptions-item label="单价">{{ detailForm.unitPrice }}</el-descriptions-item>
          <el-descriptions-item label="实际扣费金额（元）">{{ detailForm.amount }}</el-descriptions-item>
          <el-descriptions-item label="扣费时间">{{ detailForm.consumeTime }}</el-descriptions-item>
          <el-descriptions-item label="是否使用套餐">{{ detailForm.isPackageUsage ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="使用类型">{{ detailForm.usageTypeText }}</el-descriptions-item>
          <el-descriptions-item label="是否免费使用">{{ detailForm.isFreeUsage ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="使用的赠送分钟数">{{ detailForm.giftMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的套餐分钟数">{{ detailForm.packageMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="使用的余额分钟数">{{ detailForm.balanceMinutesUsed }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailForm.distributionText }}</el-descriptions-item>
          <el-descriptions-item label="套餐名称">{{ detailForm.packageName }}</el-descriptions-item>
          <el-descriptions-item label="套餐类型">
            {{ { FIXED: "固定套餐", GENERAL: "通用套餐" }[detailForm.packageType] }}
          </el-descriptions-item>
          <el-descriptions-item label="套餐购买价格（元）">{{ detailForm.purchasePrice }}</el-descriptions-item>
          <el-descriptions-item label="套餐开始日期">{{ detailForm.packageStartDate }}</el-descriptions-item>
          <el-descriptions-item label="套餐结束日期">{{ detailForm.packageEndDate }}</el-descriptions-item>
          <el-descriptions-item label="学校">{{ detailForm.schoolName }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ detailForm.gradeName }}</el-descriptions-item>
          <el-descriptions-item label="级部">{{ detailForm.departmentName }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ detailForm.className }}</el-descriptions-item>
          <el-descriptions-item label="SN">{{ detailForm.deviceSn }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div style="text-align: center">
          <el-button @click="dialogVisibleDetail = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { notificationList, notificationDetail, notificationbatchstatus, notificationupdate } from "@/api/modules/InternalPage.js";
import { ElMessage } from "element-plus";

// 用户信息
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 筛选表单
const filterForm = reactive({
  typeCode: "",
  isEnabled: "",
  priority: "",
  searchKeyword: ""
});

const isEnabledList = [
  { id: true, name: "启用" },
  { id: false, name: "不启用" }
];

const priorityList = [
  { id: 0, name: "低" },
  { id: 1, name: "中" },
  { id: 2, name: "高" },
  { id: 3, name: "紧急" }
];

// 列表数据
const carbonCk_list = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

// 详情
const dialogVisibleDetail = ref(false);
const detailForm = ref({ studentBalance: {} });

// 新增/编辑
const dialogVisibleAdd = ref(false);
const form = reactive({
  id: null,
  typeName: "",
  isEnabled: false,
  priority: "",
  maxDailyCount: "",
  minIntervalSeconds: "",
  description: ""
});
const linkFormRef = ref(null);
const linkRules = {
  typeName: [{ required: true, message: "必填项", trigger: "blur" }],
  isEnabled: [{ required: true, message: "必填项", trigger: "blur" }],
  priority: [{ required: true, message: "必填项", trigger: "blur" }],
  maxDailyCount: [{ required: true, message: "必填项", trigger: "blur" }],
  minIntervalSeconds: [{ required: true, message: "必填项", trigger: "blur" }],
  description: [{ required: true, message: "必填项", trigger: "blur" }]
};

// 重置筛选
const reset = () => {
  filterForm.searchKeyword = "";
  filterForm.typeCode = "";
  filterForm.isEnabled = "";
  filterForm.priority = "";
  fetchTenantList();
};

// 获取列表
const fetchTenantList = async () => {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      tenantId: userInfo.value.tenantId,
      searchKeyword: filterForm.searchKeyword,
      typeCode: filterForm.typeCode
    };
    if (filterForm.isEnabled !== "") {
      params.isEnabled = filterForm.isEnabled;
    }
    if (filterForm.priority !== "") {
      params.priority = filterForm.priority;
    }
    const { code, data } = await notificationList(params);
    if (code === 0 && data && data.list) {
      carbonCk_list.value = data.list;
      total.value = data.total;
    } else {
      carbonCk_list.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("获取通知列表失败", error);
    carbonCk_list.value = [];
    total.value = 0;
  }
};

// 分页大小改变
const handleSizeChange = val => {
  page.value = 1;
  pageSize.value = val;
  fetchTenantList();
};

// 当前页改变
const handleCurrentChange = val => {
  page.value = val;
  fetchTenantList();
};

// 查看详情
const detail = async row => {
  dialogVisibleDetail.value = true;
  try {
    const { code, data } = await notificationDetail({ id: row.id });
    if (code === 0 && data) {
      detailForm.value = data;
    } else {
      ElMessage.error("获取信息失败");
    }
  } catch (error) {
    console.error("获取详情失败", error);
  }
};

// 改变状态
const changeStatus = async row => {
  try {
    const { code } = await notificationbatchstatus({ ids: [row.id], isEnabled: row.isEnabled });
    if (code === 0) {
      ElMessage.success("操作成功");
      fetchTenantList();
    }
  } catch (error) {
    console.error("更新状态失败", error);
  }
};

// 编辑行
const editRow = async row => {
  dialogVisibleAdd.value = true;
  try {
    const { code, data } = await notificationDetail({ id: row.id });
    if (code === 0 && data) {
      Object.assign(form, data);
      form.id = row.id;
    } else {
      ElMessage.error("获取信息失败");
    }
  } catch (error) {
    console.error("获取编辑数据失败", error);
  }
};

// 确认新增/编辑
const confirmAdd = async () => {
  await linkFormRef.value.validate();
  try {
    const { code } = await notificationupdate(form);
    if (code === 0) {
      dialogVisibleAdd.value = false;
      ElMessage.success("提交成功");
      fetchTenantList();
    }
  } catch (error) {
    console.error("提交失败", error);
  }
};

onMounted(() => {
  fetchTenantList();
});
</script>

<style lang="scss" scoped>
@import "./index";
.filter-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .el-form-item {
    margin-bottom: 0;
  }
}
.btn-box {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.demo-pagination-block {
  margin-top: 10px;
}
</style>
