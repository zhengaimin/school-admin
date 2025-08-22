<template>
  <div class="content">
    <div class="left" ref="refLeft">
      <h1>
        <div>
          <img src="@/assets/images/common/company.svg" alt="" style="width: 19px; height: 19px; margin-right: 3px" />组织构架
        </div>
      </h1>
      <div class="bottom-tree-box">
        <el-input placeholder="请输入关键字" v-model="filterText" class="input-with-select">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-tree
          style="max-width: 600px; margin-top: 15px"
          ref="treeRef"
          :data="dataSource"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :props="{ label: 'name' }"
          draggable
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <div class="slot-tree-div">
              <div
                :style="{ width: node.level == 4 ? '150px' : '170px' }"
                @click="handleClickNode(node, data)"
                :title="node.label"
              >
                <img
                  v-if="data.org_type == 1 || data.org_type == 2"
                  src="@/assets/images/common/company.svg"
                  alt=""
                  style="width: 17px; height: 17px; margin-right: 3px"
                />
                <img
                  v-if="data.org_type == 3"
                  src="@/assets/images/common/bumen.svg"
                  alt=""
                  style="width: 16px; height: 16px; margin-right: 3px"
                />
                {{ node.label }}
              </div>
              <span v-if="data.org_type">
                <el-popover placement="bottom" :width="140" trigger="click">
                  <template #reference>
                    <img src="@/assets/images/common/catalogue-circle-o-3.svg" alt="" style="width: 16px; height: 16px" />
                  </template>
                  <div class="popover-box" style="line-height: 30px; color: #1f304c">
                    <div
                      class="tree-btn"
                      v-if="userInfo.is_admin && isEdit && node.level == 1 && data.org_type == 1"
                      @click="addSubCompany(data)"
                    >
                      <img
                        src="@/assets/images/common/add-circle-2-green.svg"
                        alt=""
                        style="width: 18px; height: 18px; margin-right: 3px"
                      />添加子公司
                    </div>
                    <div class="tree-btn" @click="addDepartment(data)" v-if="isEdit && showDom(node, data, 'addDepartment')">
                      <img
                        src="@/assets/images/common/add-circle-2-green.svg"
                        alt=""
                        style="width: 18px; height: 18px; margin-right: 3px"
                      />添加部门
                    </div>
                    <div v-if="isEdit" class="tree-btn" @click="editNode(node, data)">
                      <img
                        src="@/assets/images/common/edit-circle-2.svg"
                        alt=""
                        style="width: 18px; height: 18px; margin-right: 3px"
                      />编辑
                    </div>
                    <div class="tree-btn" v-if="isEdit && node.level != 1" @click="deleteOrg(data)">
                      <img
                        src="@/assets/images/common/delete-circle-2.svg"
                        alt=""
                        style="width: 18px; height: 18px; margin-right: 3px"
                      />删除
                    </div>
                  </div>
                </el-popover>
              </span>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" ref="refRight">
      <div v-if="dataSource.length == 0 || basicFlag">
        <h1>企业基本信息</h1>
        <div>
          <AddCompany v-if="isEdit" ref="AddCompany" @handle-reset="handleResetCompany"></AddCompany>
        </div>
      </div>
      <!-- 子公司和部门列表 -->
      <CompanyCom
        :is-edit="isEdit"
        v-if="level == 1 && !basicFlag"
        ref="CompanyCom"
        @add-sub-company="addSubCompany"
        @add-department="addDepartment"
        @edit-sub-company="editNode"
        @delete-sub-company="deleteOrg"
      ></CompanyCom>
      <!-- 子公司部门列表 -->
      <SubCompany
        :is-edit="isEdit"
        v-if="level == 3"
        ref="SubCompany"
        @add-department="addDepartment"
        @edit-department="editNode"
        @delete-department="deleteOrg"
      ></SubCompany>
      <!-- 部门成员列表-->
      <Department :is-edit="isEdit" v-if="level == 4" ref="Department"></Department>
    </div>
    <!-- 弹框区 -->
    <!-- 新增子公司 -->
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="parent_id ? '添加子公司' : '编辑子公司'"
      width="600"
    >
      <div style="min-height: 200px; padding: 20px 20px 0; text-align: center">
        <AddSubCompany ref="addsubcompany" @handle-reset="handleReset"></AddSubCompany>
      </div>
    </el-dialog>
    <!-- 添加部门 -->
    <el-dialog
      v-model="dialogVisibleAddDepartment"
      :close-on-click-modal="false"
      :title="parent_id ? '添加部门' : '编辑部门'"
      width="600"
    >
      <div style="min-height: 200px; padding: 20px 20px 0; text-align: center">
        <AddSubDepartment ref="AddDepartment" @handle-reset="handleResetDepartment"></AddSubDepartment>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisibleAddMenber" :close-on-click-modal="false" title="添加部门成员" width="800">
      <div style="min-height: 200px; padding: 20px 20px 0; text-align: center">
        <AddMember @handle-reset="handleReset2" @get-form-data="getFormData2"></AddMember>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisibleAddRole" :close-on-click-modal="false" title="添加角色" width="960">
      <div style="min-height: 200px; padding: 20px 20px 0; text-align: center">
        <AddRole @handle-reset="handleReset3" @get-form-data="getFormData3"></AddRole>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CompanyCom from "./CompanyCom/index.vue";
import SubCompany from "./SubCompany/index.vue";
import Department from "./Department/index.vue";
import AddCompany from "./components/AddCompany.vue";
import AddSubCompany from "./components/AddSubCompany.vue";
import AddSubDepartment from "./components/AddSubDepartment.vue";
import AddMember from "./components/AddMember.vue";
import AddRole from "./components/AddRole.vue";
import { organizationList, organizationDelete } from "@/api/modules/organization.js";
import { api_list } from "@/api/modules/menu.js";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox } from "element-plus";
export default {
  components: {
    AddCompany,
    CompanyCom,
    Department,
    SubCompany,
    AddSubCompany,
    AddSubDepartment,
    AddMember,
    AddRole
  },
  data() {
    return {
      buttonList: [],
      level: "",
      filterText: "",
      dataSource: [],
      // 新增公司
      dialogVisibleAddCompany: false,
      basicFlag: false,
      // 新增子公司
      dialogVisibleAdd: false,
      parent_id: "",
      // 添加部门
      dialogVisibleAddDepartment: false,
      dialogVisibleAddMenber: false,
      dialogVisibleAddRole: false,
      treeNode: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    this.featchTree();
    this.api_list();
  },
  methods: {
    //按钮权限
    api_list() {
      //获取路由地址
      let path = `path=${this.$router.currentRoute.value.fullPath}&menu_type=F&visible=0`;
      api_list(path).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            this.buttonList.push(v.title);
          });
        } else {
          this.buttonList = [];
        }
      });
    },
    //获取树结构
    featchTree() {
      organizationList().then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          if (res.data[0].children && res.data[0].children.length > 0) {
            let obj = {};
            for (let key in res.data[0]) {
              if (key != "children") {
                obj[key] = res.data[0][key];
              }
            }
            let aryCompany = [];
            let aryDepartment = [];
            res.data[0].children.map(item => {
              if (item.org_type == 2) {
                aryCompany.push(item);
              } else if (item.org_type == 3) {
                aryDepartment.push(item);
              }
            });
            obj.children = [];
            if (aryDepartment.length > 0) {
              obj.children.push({
                name: "部门",
                org_type: null,
                children: aryDepartment
              });
            }
            if (aryCompany.length > 0) {
              obj.children.push({
                name: "子公司",
                org_type: null,
                children: aryCompany
              });
            }
            this.dataSource[0] = obj;
          } else {
            this.dataSource = res.data;
          }
          this.handleClickNode({ level: 1 }, res.data[0]);
        } else {
          this.dataSource = [];
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    // 树节点点击事件
    handleClickNode(node, data) {
      if (node.level == 2) {
        return;
      }
      this.treeNode = data;
      this.switchDialog(node.level);
      if (node.level == 1) {
        this.level = 1;
        this.$nextTick(() => {
          this.$refs.CompanyCom.initPage(data);
        });
      } else if (node.level == 3 && data.org_type == 2) {
        this.level = 3;
        this.$nextTick(() => {
          this.$refs.SubCompany.initPage(data);
        });
      } else if (data.org_type == 3) {
        this.level = 4;
        this.$nextTick(() => {
          this.$refs.Department.initPage(data);
        });
      }
    },
    showDom(node, data, domName) {
      if (domName == "addDepartment") {
        if (node.level == 1 || (node.level == 3 && data.org_type == 2)) {
          return true;
        }
      }
    },
    switchDialog(val) {
      this.basicFlag = false;
      this.dialogVisibleAdd = false;
      this.dialogVisibleAddDepartment = false;
      this.level = val;
    },
    // 新增公司
    openDialogCompany() {
      this.basicFlag = true;
    },
    handleResetCompany() {
      this.featchTree();
    },
    //编辑公司/子公司/部门
    editNode(node, data) {
      this.basicFlag = false;
      this.dialogVisibleAdd = false;
      this.dialogVisibleAddDepartment = false;
      this.level = node.level;
      if (node.level == 1) {
        this.basicFlag = true;
        this.$nextTick(() => {
          this.$refs["AddCompany"].initPageEdit(data);
        });
      } else if (node.level == 3 && data.org_type == 2) {
        this.parent_id = "";
        this.dialogVisibleAdd = true;
        this.$nextTick(() => {
          this.$refs["addsubcompany"].initPageEdit(data);
        });
      } else if (node.level == 4 || (node.level == 3 && data.org_type == 3)) {
        this.parent_id = "";
        this.dialogVisibleAddDepartment = true;
        this.$nextTick(() => {
          this.$refs["AddDepartment"].initPageEdit(data);
        });
      }
    },
    // 新增子公司
    addSubCompany(data) {
      this.parent_id = data.id;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs["addsubcompany"].initPage(this.parent_id);
      });
    },
    handleReset() {
      this.dialogVisibleAdd = false;
      this.featchTree();
    },
    //添加部门
    addDepartment(data) {
      this.parent_id = data.id;
      this.dialogVisibleAddDepartment = true;
      this.$nextTick(() => {
        this.$refs["AddDepartment"].initPage(this.parent_id);
      });
    },
    handleResetDepartment() {
      this.dialogVisibleAddDepartment = false;
      this.featchTree();
    },
    //添加部门成员
    addMember() {
      this.dialogVisibleAddMenber = true;
    },
    getFormData2() {
      this.dialogVisibleAddMenber = false;
    },
    handleReset2() {
      this.dialogVisibleAddMenber = false;
    },
    //添加角色
    addRole() {
      this.dialogVisibleAddRole = true;
    },
    handleReset3() {
      this.dialogVisibleAddRole = false;
    },
    getFormData3() {
      this.dialogVisibleAddRole = false;
    },
    //删除节点
    deleteOrg(data) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          organizationDelete({ id: data.id }).then(res => {
            if (res.code == 0) {
              this.$message.success("删除成功");
              this.featchTree();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 拖拽
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "Level two 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      console.log(draggingNode.data);
      // if(draggingNode.data.org_type == 1){
      //   this.$message.error("公司不能拖拽");
      // }
      return true;
      // return !draggingNode.data.label.includes("Level three 3-1-1");
    },
    handleDragStart(node, ev) {
      console.log("drag start", node, ev);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter:", dropNode.label, ev);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave:", dropNode.label, ev);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over:", dropNode.label, ev);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end:", dropNode && dropNode.label, dropType, ev);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop:", dropNode.label, dropType, ev);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
