<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学校名称</label>
      <el-input v-model="filterForm.name" style="width: 250px"></el-input>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>学校管理</span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog">
          <img
            src="@/assets/images/common/add-circle-2.svg"
            alt=""
            style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
          />
          新增
        </el-button>
      </div>
    </div>

    <div class="table-list">
      <el-table :data="carbonCk_list" border height="100%" class="my-custom-table">
        <el-table-column label="学校" prop="name" width="180" />
        <el-table-column label="校徽" width="85" align="center">
          <template #default="{ row }">
            <el-avatar v-if="row.badge" :size="60" :src="row.badge" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="学校地址" prop="address" width="200" />
        <el-table-column label="校长" prop="principal" />
        <el-table-column label="联系方式" prop="phone" min-width="180px" />
        <el-table-column label="校训" prop="motto" />
        <el-table-column label="创建时间" prop="createdAt" width="170" />
        <el-table-column label="更新时间" prop="updatedAt" width="170" />
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
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
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="学校名称" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="学校地址" prop="address">
                <el-input v-model="form.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="校长" prop="principal">
                <el-input v-model="form.principal" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="form.phone" @blur="checkPhone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="服务器地址（成绩）" prop="scoreUrl">
                <el-input v-model="form.scoreUrl" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="学校校训" prop="motto">
                <el-input v-model="form.motto" :maxlength="100" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="校徽">
                <el-upload
                  ref="uploadFile"
                  :action="activeUrl"
                  :data="{
                    businessType: 'AVATAR'
                  }"
                  :headers="{ Authorization: token }"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleSuccess"
                  :limit="1"
                  :show-file-list="false"
                  class="upload-demo"
                  style="width: 100%"
                >
                  <div v-if="!form.badge" class="upload-box">
                    <el-icon style="font-size: 30px"><Plus /></el-icon>
                  </div>
                  <img
                    v-if="form.badge"
                    :src="form.badge"
                    alt=""
                    srcset=""
                    style="width: 100px; height: 100px"
                    @click="clearFile"
                  />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="学校简介" prop="description">
                <el-input v-model="form.description" :maxlength="1000" :rows="3" show-word-limit type="textarea" />
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
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { schoolsAdd, schoolsUpdate, schoolsList, schoolsDelete, schoolsDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";

// 响应式数据
const filterForm = reactive({
  name: ""
});

// dialog状态
const dialogVisibleAdd = ref(false);

// 表单数据
const form = reactive({
  name: "",
  address: "",
  phone: "",
  principal: "",
  email: "",
  description: "",
  motto: "",
  principalIntro: "",
  badge: "",
  background: "",
  photos: [],
  tenantId: "",
  scoreUrl: ""
});

// 表单验证规则
const linkRules = reactive({
  name: [{ required: true, message: "必填项", trigger: "blur" }]
});

// 列表数据
const carbonCk_list = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

// 表单引用
const linkFormRef = ref(null);
const uploadFile = ref(null);

// 用户store
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 计算属性
const activeUrl = computed(() => {
  if (process.env.NODE_ENV == "development") {
    return `/api/common/files/upload`;
  } else {
    return `/common/files/upload`;
  }
});

const token = computed(() => userStore.token);

// 生命周期
onMounted(() => {
  fetchTenantList();
});

// 方法
const checkPhone = () => {
  if (!/^1[3456789]\d{9}$/.test(form.phone)) {
    form.phone = "";
    ElMessage.warning("请输入正确的手机号");
  }
};

const reset = () => {
  filterForm.name = "";
  fetchTenantList();
};

const fetchTenantList = async () => {
  const params = {
    page: page.value,
    pageSize: pageSize.value,
    name: filterForm.name
  };
  const result = await schoolsList(params);

  if (result.code == 0 && result.data && result.data.list) {
    carbonCk_list.value = result.data.list;
    total.value = result.data.total;
  } else {
    carbonCk_list.value = [];
    total.value = 0;
  }
};

//获取表单数据
const handleSizeChange = val => {
  page.value = 1;
  pageSize.value = val;
  fetchTenantList();
};

const handleCurrentChange = val => {
  page.value = val;
  fetchTenantList();
};

//新增
const openAddDialog = () => {
  delete form.id;
  form.badge = "";
  dialogVisibleAdd.value = true;
  nextTick(() => {
    linkFormRef.value?.resetFields();
    uploadFile.value?.clearFiles();
  });
};

const editRow = row => {
  dialogVisibleAdd.value = true;
  schoolsDetail({ id: row.id }).then(res => {
    if (res.code == 0 && res.data) {
      for (let key in res.data) {
        form[key] = res.data[key];
      }
    } else {
      ElMessage.error("获取学校信息失败");
    }
  });
  form.id = row.id;
};

const beforeAvatarUpload = () => {
  return true;
};

const clearFile = () => {
  uploadFile.value?.clearFiles();
};

const handleSuccess = res => {
  form.badge = window.location.origin + res.data.thumbnailUrl;
};

const confirmAdd = () => {
  linkFormRef.value?.validate(valid => {
    if (valid) {
      form.tenantId = userInfo.value.tenantId;
      if (form.id) {
        schoolsUpdate(form).then(res => {
          if (res.code == 0) {
            dialogVisibleAdd.value = false;
            ElMessage.success("编辑成功");
            fetchTenantList();
            //触发查询学校的全局接口
            let num = Math.floor(Math.random() * 1000);
            userStore.setCount(num);
          }
        });
        return;
      }
      schoolsAdd(form).then(res => {
        if (res.code == 0) {
          dialogVisibleAdd.value = false;
          ElMessage.success("添加成功");
          fetchTenantList();
          // 随机产生一个数字
          let num = Math.floor(Math.random() * 1000);
          userStore.setCount(num);
        }
      });
    }
  });
};

const deleteRow = row => {
  ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        const result = await schoolsDelete({ id: row.id });

        if (result && result.code == 0) {
          ElMessage.success("删除成功");
          fetchTenantList();
          let num = Math.floor(Math.random() * 1000);
          userStore.setCount(num);

          return;
        }

        ElMessage.error("学校使用中，请勿删除！");
      } catch (error) {
        ElMessage.error("学校使用中，请勿删除！");
      }
    })
    .catch(() => {
      console.log("取消删除");
    });
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
