<template>
  <div class="table-box">
    <div class="filter-box"></div>
    <div class="btn-box">
      <span>学校账号</span>
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
        <el-table-column label="账号" prop="account"> </el-table-column>
        <el-table-column label="角色名称" prop="rolename" align="center"> </el-table-column>
        <el-table-column label="学校" prop="name" align="center"> </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"> </el-table-column>
        <el-table-column label="是否禁用" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at" width="170"> </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div>发送账号密码</div>
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
            <el-col :span="11">
              <el-form-item label="账号" prop="account">
                <el-input v-model="form.account"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="接收账号和密码邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="学校" prop="name">
                <el-select v-model="form.name" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="角色" prop="rolename">
                <el-select v-model="form.rolename" placeholder="请选择">
                  <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
        account: [{ required: true, message: "必填项", trigger: "blur" }],
        email: [{ required: true, message: "必填项", trigger: "blur" }],
        rolename: [{ required: true, message: "必填项", trigger: "blur" }],
        name: [{ required: true, message: "必填项", trigger: "change" }]
      },
      typeList: [
        {
          id: 1,
          name: "洪山高中"
        },
        {
          id: 2,
          name: "华师附中"
        }
      ],
      roleList: [
        {
          id: 1,
          name: "管理员一"
        },
        {
          id: 2,
          name: "管理员二"
        }
      ],
      carbonCk_list: [
        {
          id: 1,
          account: "taszAdmin",
          rolename: "管理员",
          name: "华师附中",
          email: "tankeshuzhi@163.com",
          status: true,
          created_at: "2025-01-01 10:00:00",
          updated_at: "2025-01-01 10:00:00"
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
