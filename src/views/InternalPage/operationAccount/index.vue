<template>
  <div class="table-box">
    <div class="firlter-box">
      <div>
        <label for="">姓名</label>
        <el-input v-model="filterform.name" style="width: 300px; margin-right: 10px" />
        <el-button type="primary" class="search-btn" @click="fetchuser_tenantList"> 查询 </el-button>
      </div>
    </div>
    <div class="btn-box">
      <span>运维账号管理</span>
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
        <el-table-column label="姓名" prop="name" width="170"> </el-table-column>
        <el-table-column label="用户账号" prop="username" align="center" width="120"> </el-table-column>
        <el-table-column label="角色" prop="roleName" align="center"> </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            {{ scope.row.status == 1 ? "正常" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at"> </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="resetpw(scope.row)">重置密码</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="!form.id ? '新增' : '编辑'" width="800">
      <div>
        <el-form ref="form" :model="form" :rules="formrules" label-width="110px" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" v-if="!form.id">
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="form.id">
              <el-form-item label="状态" prop="status">
                <el-switch v-model="form.status" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="margin: 0 10px; text-align: center">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  user_maintainerAdd,
  user_maintainerList,
  user_maintainerUpdate,
  user_maintainerDelete,
  user_maintainer_reset_password
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { get_rsa_public_key } from "@/api/modules/login";
import JSEncrypt from "jsencrypt";
export default {
  data() {
    return {
      filterform: {
        name: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      form: {
        name: "",
        username: "",
        password: "",
        status: "",
        mobile: "",
        email: ""
      },
      formrules: {
        name: [{ required: true, message: "必填项" }],
        username: [{ required: true, message: "必填项" }],
        password: [{ required: true, message: "必填项" }],
        status: [{ required: true, message: "必填项" }]
      },

      carbonCk_list: [],
      total: 0,
      page: 1,
      page_size: 10,
      role_list: [],
      rsa_public_key: ""
    };
  },

  mounted() {
    this.get_rsa_public_key();
    this.fetchuser_tenantList();
  },
  methods: {
    get_rsa_public_key() {
      get_rsa_public_key().then(res => {
        this.rsa_public_key = res.data.public_key;
      });
    },
    rsaEncrypt(value, pubKey) {
      const encryptor = new JSEncrypt(); // 创建加密对象实例
      encryptor.setPublicKey(pubKey); //设置公钥
      // 对内容进行加密
      return encryptor.encrypt(value) || "";
    },

    fetchuser_tenantList() {
      let str = "";
      for (let key in this.filterform) {
        if (this.filterform[key]) {
          str += `&${key}=${this.filterform[key]}`;
        }
      }
      let params = `is_mainer=true&page=${this.page}&page_size=${this.page_size}${str}`;
      user_maintainerList(params).then(res => {
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
      this.fetchuser_tenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchuser_tenantList();
    },

    //新增
    openAddDialog() {
      delete this.form.id;
      this.dialogVisibleAdd = true;
      //清空表单
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        for (let key in row) {
          if (key == "status") {
            this.form.status = row[key] == 1 ? true : false;
          } else {
            this.form[key] = row[key];
          }
        }
        this.form.id = row.id;
      });
    },
    confirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.form.password = this.rsaEncrypt(this.form.password, this.rsa_public_key);
          this.form.status = this.form.status ? 1 : 2;
          if (this.form.id) {
            user_maintainerUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.fetchuser_tenantList();
                this.dialogVisibleAdd = false;
                this.$message.success("修改成功");
              }
            });
            return;
          }
          delete this.form.status;
          user_maintainerAdd(this.form).then(res => {
            if (res.code == 0) {
              this.fetchuser_tenantList();
              this.dialogVisibleAdd = false;
              this.$message.success("新增成功");
            }
          });
        }
      });
    },
    getFormData(form) {
      form.password = this.rsaEncrypt(form.password, this.rsa_public_key);
      form.status = form.status ? 1 : 2;
      if (form.id) {
        user_maintainerUpdate(form).then(res => {
          if (res.code == 0) {
            this.fetchuser_tenantList();
          }
        });
        return;
      }
      user_maintainerAdd(form).then(res => {
        if (res.code == 0) {
          this.fetchuser_tenantList();
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
          user_maintainerDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.fetchuser_tenantList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    resetpw(row) {
      ElMessageBox.confirm("确定重置密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          user_maintainer_reset_password({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              ElMessageBox.confirm(`新密码：${res.data.new_password}`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              });
              this.fetchuser_tenantList();
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
