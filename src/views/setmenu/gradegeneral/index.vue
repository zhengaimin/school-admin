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
      <span>年级通用套餐列表</span>
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
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="语音通话时长（分钟/月）" prop="videoCallMinutes" width="190"> </el-table-column>
        <el-table-column label="基础价格（元/月）" prop="basePrice"> </el-table-column>
        <el-table-column label="套餐总月数" prop="totalMonths"> </el-table-column>
        <el-table-column label="是否支持首月比例扣款" prop="firstMonthRatio">
          <template #default="scope">
            {{ scope.row.firstMonthRatio ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="模板说明" prop="templateDescription"> </el-table-column>
        <el-table-column label="使用规则" prop="usageRules"> </el-table-column>
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
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="form.packageTemplateId ? '编辑' : '新增'"
      :width="800"
    >
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="年级" prop="gradeIds">
                <el-select :disabled="form.packageTemplateId" multiple v-model="form.gradeIds">
                  <el-option v-for="v in editgradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="语音通话时长（分钟/月）" prop="videoCallMinutes">
                <el-input-number style="width: 100%" v-model.number="form.videoCallMinutes" :min="1">
                  <template #prefix>
                    <span>
                      <el-icon><Microphone /></el-icon>
                    </span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="基础价格（元/月）" prop="basePrice">
                <el-input-number style="width: 100%" v-model.number="form.basePrice" :min="0.01">
                  <template #prefix>
                    <span>￥</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="套餐总月数" prop="totalMonths">
                <el-input-number style="width: 100%" v-model.number="form.totalMonths" :min="1"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="是否支持首月比例扣款" prop="firstMonthRatio">
                <el-select v-model="form.firstMonthRatio">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="模板说明" prop="templateDescription">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.templateDescription"
                  :maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="使用规则" prop="usageRules">
                <el-input type="textarea" :rows="3" v-model="form.usageRules" :maxlength="1000" show-word-limit></el-input>
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
  gradegeneralpackagesAdd,
  gradegeneralpackagesUpdate,
  gradegeneralpackagesList,
  gradegeneralpackagesDelete,
  gradegeneralpackagesDetail
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        gradeId: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      gradesList: [],
      ungradesList: [],
      form: {
        schoolId: "",
        gradeIds: [],
        packageContent: { messageCount: -1 },
        videoCallMinutes: 1,
        basePrice: 1,
        totalMonths: 0,
        firstMonthRatio: true,
        templateDescription: "",
        usageRules: ""
      },
      linkRules: {
        gradeIds: [{ required: true, message: "必填项", trigger: "blur" }],
        basePrice: [{ required: true, message: "必填项", trigger: "blur" }],
        totalMonths: [{ required: true, message: "必填项", trigger: "blur" }],
        firstMonthRatio: [{ required: true, message: "必填项", trigger: "blur" }]
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
    },
    editgradesList() {
      if (this.form.packageTemplateId) {
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
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
      });
    },
    ungetGradesList() {
      let params = `schoolId=${this.schoolId}&configType=package&packageType=GENERAL`;
      gradeunconfiguredList(params).then(res => {
        if (res.code == 0 && res.data && res.data.grades) {
          this.ungradesList = res.data.grades;
        } else {
          this.ungradesList = [];
        }
      });
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.gradeId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${gradeId}`;
      gradegeneralpackagesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          res.data.list.map(v => {
            v.videoCallMinutes = v.packageContent.videoCallMinutes;
            v.messageCount = v.packageContent.messageCount;
          });
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
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      delete this.form.packageTemplateId;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      gradegeneralpackagesDetail({ packageTemplateId: row.packageTemplateId }).then(res => {
        if (res.code == 0 && res.data) {
          let gradeIds = [];
          res.data.boundGrades.map(v => {
            gradeIds.push(v.id);
          });
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
          this.form.gradeIds = gradeIds;
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.packageTemplateId = row.packageTemplateId;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.form.packageContent.videoCallMinutes = this.form.videoCallMinutes;
          if (this.form.packageTemplateId) {
            gradegeneralpackagesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          gradegeneralpackagesAdd(this.form).then(res => {
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
          gradegeneralpackagesDelete({ id: row.id }).then(res => {
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
