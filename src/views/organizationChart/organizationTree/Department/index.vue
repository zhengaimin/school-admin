<template>
  <div class="company-com">
    <div class="company-msg">
      <h1>{{ treeNode.name }}</h1>
      <!-- <span>所属公司：</span> -->
      <div>
        <div>
          <span></span>
          <label>联系人：{{ treeNode.contact }}</label>
        </div>
        <div>
          <span></span>
          <label>联系电话：{{ treeNode.contact_info }}</label>
        </div>
      </div>
    </div>
    <div class="company-table table-box">
      <div class="nav-box">
        <div>
          <span>部门成员列表</span>
        </div>
        <div>
          <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="handleAddUser('add')">
            <img
              src="@/assets/images/common/add-circle-2.svg"
              alt=""
              style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
            />
            新增成员
          </el-button>
        </div>
      </div>
      <div>
        <div class="sub-filter-form">
          <label>姓名</label>
          <el-input v-model="filterForm.name" style="width: 200px; margin-right: 10px"></el-input>
          <label>手机号</label>
          <el-input v-model="filterForm.mobile" style="width: 200px"></el-input>
          <el-button class="search-btn" style="margin-left: 10px" @click="resetForm"> 重置 </el-button>
          <el-button type="primary" class="search-btn" @click="featchUserList"> 查询 </el-button>
        </div>
        <div class="table-list">
          <el-table class="my-custom-table" :data="carbonCk_list">
            <el-table-column label="姓名" prop="name" align="center"> </el-table-column>
            <el-table-column label="账号" prop="username" align="center"> </el-table-column>
            <el-table-column label="角色" align="center" width="130">
              <template #default="scope">
                {{ scope.row.role.name }}
              </template>
            </el-table-column>
            <el-table-column label="所属部门" align="center" width="130">
              <template #default="scope">
                {{ scope.row.org.name }}
              </template>
            </el-table-column>
            <el-table-column label="手机号" prop="mobile" align="center" width="140"> </el-table-column>
            <el-table-column label="邮箱" prop="email" align="center" width="130"> </el-table-column>
            <el-table-column label="职务" prop="post" align="center"> </el-table-column>
            <el-table-column label="创建时间" prop="created_at" align="center" width="200"> </el-table-column>
            <el-table-column label="操作" align="center" width="200" fixed="right">
              <template #default="scope">
                <div class="table-btn" v-if="isEdit">
                  <div @click="handleAddUser('edit', scope.row)">编辑</div>
                  <div @click="resetpw(scope.row)">重置密码</div>
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
      </div>
    </div>
    <!-- 添加成员 -->
    <el-dialog
      v-model="dialogVisibleAddUser"
      :close-on-click-modal="false"
      :title="form.id ? '编辑成员' : '添加成员'"
      width="500"
    >
      <div style="padding-right: 30px">
        <CommonForm
          ref="addUserDom"
          :form-config="form"
          :common-config="commonConfig"
          :form-items="formItems"
          @handle-reset="handleReset"
          @get-form-data="getFormData"
        ></CommonForm>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formInfo } from "@/api/modules/formConfig.js";
import CommonForm from "@/components/CommonForm/index.vue";
import { ElMessageBox } from "element-plus";
import { deepClone } from "@/utils/deepClone.js";
import { roleList } from "@/api/modules/roler.js";
import { userAdd, userList, userUpdate, userDelete, userreset_password } from "@/api/modules/user.js";
import { get_rsa_public_key } from "@/api/modules/login";
import JSEncrypt from "jsencrypt";
export default {
  components: { CommonForm },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeNode: {},
      filterForm: {
        name: "",
        mobile: ""
      },
      carbonCk_list: [],
      dialogVisibleAddUser: false,
      form: {},
      formItems: [],
      commonConfig: {},
      localConfig: {
        labelPosition: "left",
        col: 3,
        labelWidth: 100,
        size: "default",
        labelSize: 14,
        btnposition: "left"
      },
      role_list: [],
      rsa_public_key: ""
    };
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
    initPage(data) {
      this.treeNode = data;
      this.featchUserList();
    },
    //查询用户
    featchUserList() {
      let str = `org_id=${this.treeNode.id}&name=${this.filterForm.name}&mobile=${this.filterForm.mobile}`;
      userList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
        } else {
          this.carbonCk_list = [];
        }
      });
    },
    resetForm() {
      this.filterForm.name = "";
      this.filterForm.mobile = "";
      this.featchUserList();
    },
    //新增/编辑
    async handleAddUser(val, row) {
      this.dialogVisibleAddUser = true;
      if (val == "edit") {
        for (let key in row) {
          this.form[key] = row[key];
        }
      } else {
        this.form.id = "";
        this.$nextTick(() => {
          this.$refs.addUserDom.resetForm();
        });
      }
      this.get_rsa_public_key();
      let res = await this.fetchRoleList();
      if (res.code == 0 && res.data && res.data.list) {
        this.role_list = res.data.list;
        this.formInfo();
      } else {
        this.$message.error("请先创建角色");
        this.dialogVisibleAddUser = false;
        this.role_list = [];
      }
    },
    //获取角色
    async fetchRoleList() {
      let params = `page=1&page_size=100`;
      let res = await roleList(params);
      if (res.code == 0 && res.data && res.data.list) {
        this.role_list = res.data.list;
      } else {
        this.role_list = [];
      }
      return res;
    },
    formInfo() {
      formInfo({ key: "addMember" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfig = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItems = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
        this.formItems.forEach((v, i) => {
          if (v.model == "role_id") {
            v.options = [];
            this.role_list.map(item => {
              if (!item.admin) {
                v.options.push({ label: item.name, value: item.id });
              }
            });
          }
          if (v.model == "password" && this.form.id) {
            this.formItems.splice(i, 1);
          }
        });
      });
    },
    getFormData(form) {
      form.org_id = this.treeNode.id;
      form.password = this.rsaEncrypt(form.password, this.rsa_public_key);
      if (!this.form.id) {
        userAdd(form).then(res => {
          if (res.code == 0) {
            this.$message.success("添加成功");
            this.dialogVisibleAddUser = false;
            this.featchUserList();
          }
        });
        return;
      }
      userUpdate(form).then(res => {
        if (res.code == 0) {
          this.$message.success("修改成功");
          this.dialogVisibleAddUser = false;
          this.featchUserList();
        }
      });
    },
    handleReset() {
      this.dialogVisibleAddUser = false;
    },
    deleteRow(row) {
      ElMessageBox.confirm("确定删除用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.featchUserList();
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
          userreset_password({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              ElMessageBox.confirm(`新密码：${res.data.new_password}`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              });
              this.featchUserList();
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
