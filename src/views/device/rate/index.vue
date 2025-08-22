<template>
  <div class="table-box">
    <div class="filter-box">
      <!-- <label for="name">年级</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input> -->
      <label for="code">年级</label>
      <el-select style="width: 250px" v-model="filterForm.status" placeholder="请选择">
        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
      <el-button style="margin-left: 20px">重置</el-button>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="btn-box">
      <span>设备组</span>
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
        <el-table-column label="年级" prop="sbname"> </el-table-column>
        <el-table-column label="创建时间" prop="created_at"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at"> </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
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
        v-model:page-size="page_size"
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
            <el-col :span="18">
              <el-form-item label="设备组名称" prop="sbname">
                <el-input v-model="form.sbname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="最大设备数（台）" prop="xinhao">
                <el-input v-model="form.xinhao"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
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
    <!-- 费率配置 -->
    <el-dialog v-model="dialogVisibleFL" :close-on-click-modal="false" title="设置费率" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="flform" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="年级" prop="deviceGroupId">
                <el-select v-model="form.gradeId">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 15px">
            <el-col :span="23">
              <el-radio-group v-model="flform.radio">
                <el-radio :value="1">时间计费</el-radio>
                <el-radio :value="2">学期计费</el-radio>
                <el-radio :value="3">年计费</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row v-if="flform.radio == 1">
            <el-col :span="23">
              <el-form-item label="每分钟价格(元)" prop="price">
                <el-input type="number" v-model="flform.price"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flform.radio == 2">
            <el-col :span="23">
              <el-form-item label="一学期价格(元)" prop="price">
                <el-input type="number" v-model="flform.price"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flform.radio == 2">
            <el-col :span="11">
              <el-form-item label="开始时间" prop="price">
                <el-date-picker style="width: 100%" v-model="form.start_time" value-format="x" :type="dateType" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="结束时间" prop="price">
                <el-date-picker style="width: 100%" v-model="form.end_time" value-format="x" :type="dateType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flform.radio == 3">
            <el-col :span="23">
              <el-form-item label="一年价格(元)" prop="price">
                <el-input type="number" v-model="flform.price"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="flform.radio == 3">
            <el-col :span="11">
              <el-form-item label="开始时间" prop="price">
                <el-date-picker style="width: 100%" v-model="form.start_time" value-format="x" :type="dateType" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="结束时间" prop="price">
                <el-date-picker style="width: 100%" v-model="form.end_time" value-format="x" :type="dateType" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleFL = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { gradesList, tenantList, tenantDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";

import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {},
      statusList: [
        { id: 1, name: "2024级" },
        { id: 2, name: "2025级" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      gradesList: [],
      form: {},
      linkRules: {
        sbname: [{ required: true, message: "必填项", trigger: "blur" }],
        xinhao: [{ required: true, message: "必填项", trigger: "blur" }],
        status: [{ required: true, message: "必填项", trigger: "change" }],
        bianhao: [{ required: true, message: "必填项", trigger: "change" }]
      },
      typeList: [
        { id: 1, name: "启用" },
        { id: 2, name: "不启用" }
      ],
      carbonCk_list: [
        {
          id: 1,
          sbname: "xxx高中",
          xinhao: "5",
          status: "50",
          bianhao: "Y6478374347387434",
          address: "开启",
          created_at: "2022-02-01 10:00:00",
          updated_at: "2022-02-01 10:00:00"
        }
      ],
      total: 0,
      page: 1,
      page_size: 10,
      // 配置费率
      dialogVisibleFL: false,
      flform: {
        radio: 1,
        price: ""
      },
      // 拨号控制
      bohaoVisible: false,
      bohaoform: {
        radio: 1
      }
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
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.getGradesList();
          // this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getGradesList();
    // this.fetchTenantList();
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
    fetchTenantList() {
      let str = "";
      for (let key in this.formFilter) {
        if (this.formFilter[key]) {
          str += `&${key}=${this.formFilter[key]}`;
        }
      }
      let params = `page=${this.page}&page_size=${this.page_size}${str}`;
      tenantList(params).then(res => {
        return;
        this.carbonCk_list = res.data.list;
        this.carbonCk_list.map(v => {
          v.status = v.status == 1 ? true : false;
        });
        this.total = res.data.total;
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },
    //筛选
    getFormDataFilter() {
      this.fetchTenantList();
    },
    handleResetFilter() {
      this.fetchTenantList();
    },
    //新增
    openAddDialog() {
      delete this.form.id;
      this.form = {};
      this.dialogVisibleFL = true;
    },
    handleReset() {
      this.dialogVisibleAdd = false;
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      for (let key in row) {
        this.form[key] = row[key];
      }
      this.form.id = row.id;
    },
    changeStatus(row) {
      this.getFormData(row);
    },

    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          tenantDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchTenantList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    addbohao() {
      this.bohaoVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
