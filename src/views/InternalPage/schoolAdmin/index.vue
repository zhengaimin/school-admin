<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学校名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
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
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="name" width="180"> </el-table-column>
        <el-table-column label="校徽" width="85" align="center">
          <template #default="{ row }">
            <img v-if="row.badge" style="width: 60px; height: 60px" :src="row.badge" alt="" srcset="" />
          </template>
        </el-table-column>
        <el-table-column label="学校地址" prop="address" width="200"> </el-table-column>
        <el-table-column label="校长" prop="principal"> </el-table-column>
        <el-table-column label="联系方式" prop="phone"> </el-table-column>
        <el-table-column label="校训" prop="motto"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="170"> </el-table-column>
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
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="学校地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="校长" prop="principal">
                <el-input v-model="form.principal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="form.phone" @blur="checkPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="学校校训" prop="motto">
                <el-input v-model="form.motto" :maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="校徽">
                <el-upload
                  style="width: 100%"
                  class="upload-demo"
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
                >
                  <div v-if="!form.badge" class="upload-box">
                    <el-icon style="font-size: 30px"><Plus /></el-icon>
                  </div>
                  <img
                    @click="clearFile"
                    v-if="form.badge"
                    style="width: 100px; height: 100px"
                    :src="form.badge"
                    alt=""
                    srcset=""
                  />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="学校简介" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description" :maxlength="1000" show-word-limit></el-input>
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
<script>
import { schoolsAdd, schoolsUpdate, schoolsList, schoolsDelete, schoolsDetail } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      form: {
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
        tenantId: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    userStore() {
      return useUserStore();
    },
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/files/upload`;
      } else {
        return `/common/files/upload`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    checkPhone() {
      if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        this.form.phone = "";
        this.$message.warning("请输入正确的手机号");
      }
    },
    reset() {
      this.filterForm.name = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}`;
      schoolsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
          this.total = res.data.total;
        } else {
          this.carbonCk_list = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },

    //新增
    openAddDialog() {
      delete this.form.id;
      this.form.badge = "";
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.$refs.uploadFile.clearFiles();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      schoolsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
        } else {
          this.$message.error("获取学校信息失败");
        }
      });
      this.form.id = row.id;
    },
    beforeAvatarUpload() {
      return true;
    },
    clearFile() {
      this.$refs.uploadFile.clearFiles();
    },
    handleSuccess(res) {
      this.form.badge = window.location.origin + res.data.thumbnailUrl;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.form.tenantId = this.userInfo.tenantId;
          if (this.form.id) {
            schoolsUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
                //触发查询学校的全局接口
                let num = Math.floor(Math.random() * 1000);
                this.userStore.setCount(num);
              }
            });
            return;
          }
          schoolsAdd(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.fetchTenantList();
              // 随机产生一个数字
              let num = Math.floor(Math.random() * 1000);
              this.userStore.setCount(num);
            }
          });
        }
      });
    },

    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          schoolsDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
              let num = Math.floor(Math.random() * 1000);
              this.userStore.setCount(num);
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
