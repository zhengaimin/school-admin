<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">年级</label>
      <el-select style="width: 250px" v-model="filterForm.gradeId">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>年级通话费率列表</span>
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
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="费率值（元/分钟）" prop="rate"> </el-table-column>
        <el-table-column label="套餐描述" prop="description"> </el-table-column>
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
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="form.rateTemplateID ? '编辑' : '新增'"
      :width="600"
    >
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
                学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="年级" prop="gradeIds">
                <el-select :disabled="form.rateTemplateID" multiple v-model="form.gradeIds">
                  <el-option v-for="v in editgradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="费率值（元/分钟）" prop="rate">
                <el-input-number style="width: 100%" v-model.number="form.rate" :precision="2" :min="0" :max="100">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="费率描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: right">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  gradesList,
  gradeunconfiguredList,
  gradecallratesAdd,
  gradecallratesUpdate,
  gradecallratesList,
  gradecallratesDelete,
  gradecallratesDetail
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      isloading: false,
      isloading1: false,
      isloading2: false,
      filterForm: {
        name: "",
        gradeId: ""
      },
      dialogVisibleAdd: false,
      gradesList: [],
      ungradesList: [],
      form: {
        schoolId: "",
        gradeIds: [],
        rate: 0,
        description: ""
      },
      linkRules: {
        gradeIds: [{ required: true, message: "必填项", trigger: "blur" }],
        rate: [{ required: true, message: "必填项", trigger: "blur" }],
        description: [{ required: true, message: "必填项", trigger: "blur" }]
      },
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
    },
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
    },
    editgradesList() {
      if (this.form.rateTemplateID) {
        return this.gradesList;
      }
      return this.ungradesList;
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.getGradesList();
          this.ungetGradesList();
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getGradesList();
    this.ungetGradesList();
    this.fetchTenantList();
  },
  methods: {
    getGradesList() {
      if (this.isloading) return;
      this.isloading = true;
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
        this.isloading = false;
      });
    },
    ungetGradesList() {
      if (this.isloading1) return;
      this.isloading1 = true;
      let params = `schoolId=${this.schoolId}&configType=rate&serviceType=CALL`;
      gradeunconfiguredList(params).then(res => {
        if (res.code == 0 && res.data && res.data.grades) {
          this.ungradesList = res.data.grades;
        } else {
          this.ungradesList = [];
        }
        this.isloading1 = false;
      });
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.gradeId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      if (this.isloading2) return;
      this.isloading2 = true;
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${gradeId}`;
      gradecallratesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
          this.total = res.data.total;
        } else {
          this.carbonCk_list = [];
          this.total = 0;
        }
        this.isloading2 = false;
      });
    },
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },
    openAddDialog() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      delete this.form.rateTemplateID;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      gradecallratesDetail({ rateTemplateID: row.rateTemplateID }).then(res => {
        if (res.code == 0 && res.data) {
          let gradeIds = [];
          res.data.boundGrades.map(v => {
            gradeIds.push(v.gradeId);
          });
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
          this.form.gradeIds = gradeIds;
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.rateTemplateID = row.rateTemplateID;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.form.rateTemplateID) {
            gradecallratesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          gradecallratesAdd(this.form).then(res => {
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
          gradecallratesDelete({ id: row.id }).then(res => {
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
