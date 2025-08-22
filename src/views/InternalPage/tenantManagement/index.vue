<template>
  <div class="table-box">
    <div class="filter-box"></div>
    <div class="btn-box">
      <span>合作方管理</span>
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
        <el-table-column label="代理商" prop="name" width="120"> </el-table-column>
        <el-table-column label="代理商类型" prop="type" align="center" width="120"> </el-table-column>
        <el-table-column label="联系人" prop="contact" align="center"> </el-table-column>
        <el-table-column label="联系方式" prop="phone" align="center" width="120"> </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center" width="150"> </el-table-column>
        <el-table-column label="备注" prop="description" width="200" show-overflow-tooltip> </el-table-column>
        <el-table-column label="合作状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at" width="170"> </el-table-column>
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
              <el-form-item label="代理商" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="联系人" prop="contact">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="代理商类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="description">
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
import { tenantList, tenantDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      //新增权限系统
      dialogVisibleAdd: false,
      form: {},
      linkRules: {
        name: [{ required: true, message: "请输入代理商名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择代理商类型", trigger: "change" }],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
      },
      typeList: [
        {
          id: 1,
          name: "校外代理"
        },
        {
          id: 2,
          name: "学校直营"
        }
      ],
      carbonCk_list: [
        {
          id: 1,
          name: "代理商1",
          type: "校外代理",
          contact: "李先生",
          phone: "18087765847",
          email: "zhangsan@163.com",
          description: "备注",
          status: true,
          created_at: "2022-02-01 10:00:00",
          updated_at: "2022-02-01 10:00:00"
        }
      ],
      total: 0,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
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
      this.dialogVisibleAdd = true;
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
