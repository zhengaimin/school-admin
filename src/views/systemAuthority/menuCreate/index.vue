<template>
  <div class="table-box">
    <div class="btn-box">
      <div>菜单管理</div>
      <div>
        <el-button class="search-btn" type="primary" @click="addOneLevelMenu"> 新增目录 </el-button>
        <el-button class="search-btn" type="primary" @click="featchadminMenu"> 刷新 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table :data="treeList" row-key="name">
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="title" label="类型" align="center">
          <template #default="scope">
            {{ menuObj[scope.row.menu_type] }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column prop="path" label="路由地址" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column label="权限标识" align="center">
          <template #default="scope">
            <el-popover placement="right" :width="400" trigger="hover" v-if="scope.row.menu_type == 'F'">
              <template #reference>
                <el-button style="margin-right: 16px">接口权限</el-button>
              </template>
              <el-table :data="scope.row.sys_apis">
                <el-table-column width="120" property="title" label="名称" />
                <el-table-column property="action" label="接口地址">
                  <template #default="subScope">
                    <span style="padding: 2px 5px; background: #0ec69a; border-radius: 5px"> {{ subScope.row.action }}</span>
                    {{ subScope.row.path }}
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="visible" label="是否可见" align="center" width="90">
          <template #default="scope">
            {{ scope.row.visible === "0" ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="170">
          <template #default="scope">
            <div class="table-btn">
              <div @click="addSubMenu(scope.row)" v-if="scope.row.menu_type != 'F'">
                新增{{ scope.row.menu_type === "M" ? "子菜单" : "按钮" }}
              </div>
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
    <!-- 新增/编辑目录 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="title" width="900">
      <CommonForm
        ref="addOneLevelMenuRef"
        :form-config="formOneLevel"
        :common-config="commonConfigOneLevel"
        :form-items="formItemsOneLevel"
        @handle-reset="handleResetOneLevel"
        @get-form-data="getFormDataOneLevel"
      >
      </CommonForm>
    </el-dialog>
    <!-- 新增/编辑按钮 -->
    <el-dialog v-model="dialogVisibleAddBtn" :close-on-click-modal="false" :title="subtitle" width="900">
      <CommonForm
        :form-config="formButton"
        :common-config="commonConfigButton"
        :form-items="formItemsButton"
        @handle-reset="handleResetBtn"
        @get-form-data="getFormDataBtn"
      >
        <template #laster>
          <div>
            <el-form-item label="api权限" style="width: 100%">
              <el-transfer v-model="formButton.apis" :data="sysApiList" />
            </el-form-item>
          </div>
        </template>
      </CommonForm>
    </el-dialog>
  </div>
</template>
<script>
import { formInfo } from "@/api/modules/formConfig.js";
import { menuAdd, adminMenu, menuUpdate, menuDelete } from "@/api/modules/menu.js";
import { sys_apiList } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import CommonForm from "@/components/CommonForm/index.vue";
import { deepClone } from "@/utils/deepClone.js";
export default {
  components: { CommonForm },
  data() {
    return {
      treeList: [],
      menuObj: {
        M: "目录",
        C: "菜单",
        F: "按钮"
      },
      //新增权限系统
      dialogVisibleAdd: false,
      dialogVisibleAddBtn: false,
      formOneLevel: {},
      formItemsOneLevel: [],
      commonConfigOneLevel: {},
      formButton: {
        apis: []
      },
      formItemsButton: [],
      commonConfigButton: {},
      formFilter: {},
      localConfig: {
        labelPosition: "left",
        col: 3,
        labelWidth: 100,
        size: "default",
        labelSize: 14,
        btnposition: "left"
      },

      page: 1,
      page_size: 200,
      titleName: "",
      sysApiList: []
    };
  },
  computed: {
    title() {
      let typeStr = this.formOneLevel.id ? "编辑" : "新增";
      let levelStr = this.formOneLevel.parent_id ? "子菜单" : "目录";
      return typeStr + levelStr;
    },
    subtitle() {
      let typeStr = this.formButton.id ? "编辑按钮" : "新增按钮";
      return typeStr;
    }
  },
  mounted() {
    this.featchadminMenu();
    this.fetchTenantList();
  },
  methods: {
    //获取菜单
    featchadminMenu() {
      let str = "";
      for (let key in this.formFilter) {
        if (this.formFilter[key]) {
          str += `&${key}=${this.formFilter[key]}`;
        }
      }
      let params = `page=${this.page}&page_size=${this.page_size}${str}`;
      adminMenu(params).then(res => {
        this.treeList = res.data.list;
      });
    },
    fetchTenantList() {
      let params = ``;
      sys_apiList(params).then(res => {
        this.sysApiList = [];
        res.data.list.map(v => {
          this.sysApiList.push({
            label: v.title,
            key: v.id
          });
        });
      });
    },
    addOneLevelMenu() {
      this.dialogVisibleAdd = true;
      for (let key in this.formOneLevel) {
        this.formOneLevel[key] = "";
      }
      this.formOneLevel.visible = "0";
      this.formOneLevel.is_frame = "0";
      this.formOneLevel.id = "";
      this.formOneLevel.menu_type = "M";
      this.formOneLevel.parent_id = "";
      this.formInfoOnelevel();
    },
    addSubMenu(row) {
      let keys = ["visible", "is_frame", "menu_type", "parent_id", "title", "name", "path", "component", "sort"];
      for (let key in this.formOneLevel) {
        if (keys.indexOf(key) != -1) {
          this.formOneLevel[key] = "";
        } else {
          delete this.formOneLevel[key];
        }
      }
      this.formOneLevel.visible = "0";
      this.formOneLevel.is_frame = "0";
      this.formOneLevel.id = "";
      this.formButton.id = "";
      if (row.menu_type == "M") {
        this.dialogVisibleAdd = true;
        this.formOneLevel.menu_type = "C";
        this.formOneLevel.parent_id = row.id;
        this.formInfoOnelevel();
      } else if (row.menu_type == "C") {
        this.dialogVisibleAddBtn = true;
        this.formButton = {};
        this.formButton.apis = [];
        this.formButton.menu_type = "F";
        this.formButton.parent_id = row.id;
        this.formInfoButton();
      }
    },
    handleResetOneLevel() {
      this.dialogVisibleAdd = false;
    },
    getFormDataOneLevel(form) {
      form.sort = Number(form.sort);
      if (this.formOneLevel.menu_type == "M") {
        form.menu_type = "M";
        delete form.parent_id;
      } else {
        form.menu_type = "C";
        form.parent_id = this.formOneLevel.parent_id;
      }
      if (this.formOneLevel.id) {
        form.id = this.formOneLevel.id;
        menuUpdate(form).then(res => {
          if (res.code === 0) {
            this.$message.success("更新成功");
            this.dialogVisibleAdd = false;
            this.featchadminMenu();
          }
        });
        return;
      }
      delete form.id;
      menuAdd(form).then(res => {
        if (res.code === 0) {
          this.$message.success("新增成功");
          this.dialogVisibleAdd = false;
          this.featchadminMenu();
        }
      });
    },
    handleResetBtn() {
      this.dialogVisibleAddBtn = false;
    },
    getFormDataBtn(form) {
      form.menu_type = "F";
      form.parent_id = this.formButton.parent_id;
      let ary = [];
      form.apis.map(v => {
        ary.push(Number(v));
      });
      form.apis = ary;
      if (this.formButton.id) {
        form.id = this.formButton.id;
        delete form.sys_apis;
        menuUpdate(form).then(res => {
          if (res.code === 0) {
            this.$message.success("更新成功");
            this.dialogVisibleAddBtn = false;
            this.featchadminMenu();
          }
        });
        return;
      }
      menuAdd(form).then(res => {
        if (res.code === 0) {
          this.$message.success("新增成功");
          this.dialogVisibleAddBtn = false;
          this.featchadminMenu();
        }
      });
    },
    //更新
    editRow(row) {
      if (row.menu_type == "M" || row.menu_type == "C") {
        this.dialogVisibleAdd = true;
        this.formInfoOnelevel();
        this.$nextTick(() => {
          for (let key in row) {
            this.formOneLevel[key] = row[key];
          }
        });
      } else if (row.menu_type == "F") {
        let keyAry = ["parent_id", "id", "title", "visible", "is_frame", "sys_apis"];
        keyAry.map(key => {
          this.formButton[key] = row[key];
        });
        this.formButton.sys_apis.map(v => {
          this.formButton.apis.push(v.id);
        });
        this.dialogVisibleAddBtn = true;
        this.formInfoButton();
      }
    },
    //删除
    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          menuDelete({ ids: [row.id] }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.featchadminMenu();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //新增子菜单
    addMenu(val) {
      this.titleName = val;
      this.formInfo();
    },
    //新增目录
    formInfoOnelevel() {
      formInfo({ key: "addOnelevelMenu" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfigOneLevel = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItemsOneLevel = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
      });
    },
    formInfoButton() {
      formInfo({ key: "addMenuButton" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfigButton = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItemsButton = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
