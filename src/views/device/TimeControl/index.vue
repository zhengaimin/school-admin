<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学校名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>按校设置</span>
      <div></div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="学校" prop="name"> </el-table-column>

        <el-table-column label="单次通话时长" prop="address"> </el-table-column>
        <el-table-column label="禁播时段" prop="principal"> </el-table-column>
        <el-table-column label="视频通话" prop="phone"> </el-table-column>
        <el-table-column label="操作" align="center" width="110" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="editRow(scope.row)">设置</div>
              <div>开关机</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="设置" :width="700">
      <div style="padding-left: 20px">
        <el-form
          ref="linkFormRef"
          :model="form"
          :rules="linkRules"
          class="demo-ruleForm"
          label-position="right"
          label-width="150px"
        >
          <el-row>
            <el-col :span="23">
              <el-form-item label="拨打视频电话" prop="name">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="单次通话时长（分钟）" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="电话禁播时段" prop="motto">
                <el-button plain> + 新时段</el-button>
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
    // 租户ID：优先取平台管理员「进入的租户」，回退到用户自身租户
    tenantId() {
      return useUserStore().currentTenant?.tenantId || this.userInfo.tenantId;
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
    },
    localhost() {
      return process.env.VUE_APP_BASE_API;
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    reset() {
      this.filterForm.name = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.filterForm.name
      };
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
          this.form.tenantId = this.tenantId;
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
