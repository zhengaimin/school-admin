<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">年级名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="name">入学年份</label>
      <el-date-picker style="width: 250px" v-model="filterForm.enrollYear" :value-format="'YYYY'" format="YYYY" type="year" />
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>年级管理</span>
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
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="年级名称" prop="name"> </el-table-column>
        <el-table-column label="入学年份" prop="enrollYear"> </el-table-column>
        <el-table-column label="是否毕业" prop="principal">
          <template #default="{ row }">
            {{ row.isGraduated ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
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
            <el-col :span="16">
              <el-form-item label="年级名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否毕业" prop="isGraduated">
                <el-select v-model="form.isGraduated">
                  <el-option label="已毕业" :value="Number(1)"></el-option>
                  <el-option label="未毕业" :value="Number(0)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="入学年份" prop="enrollYear">
                <el-date-picker style="width: 100%" v-model="form.enrollYear" :value-format="'YYYY'" format="YYYY" type="year" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="年级描述" prop="description">
                <el-input type="textarea" :rows="4" v-model="form.description"></el-input>
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
import { gradesAdd, gradesUpdate, gradesList, gradesDelete, gradesDetail } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        enrollYear: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      form: {
        name: "",
        enrollYear: "",
        schoolId: "",
        description: "",
        isGraduated: 0
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        enrollYear: [{ required: true, message: "必填项", trigger: "blur" }],
        description: [{ required: true, message: "必填项", trigger: "blur" }],
        isGraduated: [{ required: true, message: "必填项", trigger: "blur" }]
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
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    }
  },
  // 监听schoolId的变化
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    reset() {
      this.filterForm.name = "";
      this.filterForm.enrollYear = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      this.filterForm.enrollYear = this.filterForm.enrollYear ? this.filterForm.enrollYear : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&enrollYear=${this.filterForm.enrollYear}`;
      gradesList(params).then(res => {
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
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      gradesDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = key == "enrollYear" ? res.data[key].toString() : res.data[key];
          }
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.id = row.id;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.form.enrollYear = Number(this.form.enrollYear);
          if (this.form.id) {
            gradesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          gradesAdd(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.fetchTenantList();
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
          gradesDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
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
