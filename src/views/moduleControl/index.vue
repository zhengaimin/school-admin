<template>
  <div class="table-box">
    <!-- <div class="filter-box">
      <label for="name">年级</label>
      <el-select style="width: 250px" v-model="filterForm.gradeId">
        <el-option v-for="v in availableList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div> -->
    <div class="btn-box">
      <span>学校模块配置</span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 配置 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="模块配置信息(蓝色表示显示，灰色表示隐藏)" align="left" width="600">
          <template #default="scope">
            <div class="table-module">
              <div v-for="v in scope.row.moduleList" :key="v.moduleKey" :class="{ show: v.isHidden === 1 }">
                <span :title="v.moduleName">
                  <span
                    v-show="
                      v.moduleKey != 'recharge' &&
                      v.moduleKey !== 'select_recharge_amount' &&
                      v.moduleKey !== 'input_recharge_amount' &&
                      v.moduleKey !== 'package_minutes'
                    "
                    >{{ v.sort }}
                  </span>
                  {{ v.moduleName }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="editRow(scope.row)">
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="配置" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
                学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px; font-weight: bold">
            <el-col :span="6">
              <span>模块名称</span>
            </el-col>
            <el-col :span="6"> 排序 </el-col>
            <el-col :span="9"> 是否显示 </el-col>
          </el-row>
          <el-row v-for="v in form.modules" :key="v.moduleKey" style="margin-bottom: 5px">
            <el-col :span="6">
              <span>{{ v.name }}</span>
            </el-col>
            <el-col :span="6">
              <el-input
                v-if="
                  v.key !== 'recharge' &&
                  v.key !== 'select_recharge_amount' &&
                  v.key !== 'input_recharge_amount' &&
                  v.key !== 'package_minutes'
                "
                style="width: 90px"
                type="text"
                v-model="v.defaultSort"
              />
            </el-col>
            <el-col :span="9">
              <el-radio-group v-model="v.isHidden">
                <el-radio :value="Number(1)">显示</el-radio>
                <el-radio :value="Number(2)">隐藏</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: center">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { availableList, modulesassign, modulesList } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      isloading: false,
      filterForm: {
        name: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      form: {
        schoolId: "",
        modules: []
      },
      linkRules: {},
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
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
    }
  },
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
    getGradesList() {
      let params = ``;
      availableList(params).then(res => {
        if (res.code == 0 && res.data && res.data.parentModules) {
          res.data.parentModules.map(v => {
            v.isHidden = 1;
            v.userType = "parent";
            v.status = 1;
          });
          this.form.modules = res.data.parentModules;
        } else {
          this.form.modules = [];
        }
      });
    },
    reset() {
      this.filterForm.name = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      if (this.isloading) return;
      this.isloading = true;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}`;
      modulesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.schools) {
          this.carbonCk_list = res.data.schools;
        } else {
          this.carbonCk_list = [];
        }
        this.isloading = false;
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
      this.dialogVisibleAdd = true;
      this.form.schoolId = this.schoolId;
      this.getGradesList();
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      row.moduleList.map(v => {
        v.name = v.moduleName;
        v.key = v.moduleKey;
        v.defaultSort = v.sort;
        v.userType = "parent";
        v.isHidden = v.isHidden;
      });
      this.form.modules = row.moduleList;
      this.form.schoolId = row.schoolId;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.form.modules.map(v => {
            v.sort = Number(v.defaultSort);
            v.moduleKey = v.key;
          });
          modulesassign(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("配置成功");
              this.fetchTenantList();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
