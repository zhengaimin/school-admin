<template>
  <div class="table-box">
    <div class="role-nav">
      <div class="role-box">
        <span>超级管理员</span>
        <span class="active">管理员</span>
        <span>团队成员</span>
      </div>
    </div>
    <div class="btn-box">
      <span>角色权限</span>
      <div></div>
    </div>
    <div class="table-list">
      <div class="oneLevel"><el-checkbox v-model="checked1" size="large" style="margin-right: 10px" /> 首页</div>
      <div>
        <div class="oneLevel"><el-checkbox v-model="checked2" size="large" style="margin-right: 10px" /> Dashboard</div>
        <div class="twoLevel"><el-checkbox v-model="checked3" size="large" style="margin-right: 10px" />数据可视化</div>
        <div class="threeLevel">
          <div><el-checkbox v-model="checked4" size="large" /><span @click="addapi">系统权限</span></div>
          <div><el-checkbox v-model="checked4" size="large" /><span @click="addapi">编辑权限</span></div>
          <div><el-checkbox v-model="checked4" size="large" /><span @click="addapi">新增权限</span></div>
          <div><el-checkbox v-model="checked4" size="large" /><span @click="addapi">其它权限</span></div>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="新增后台接口路径" width="700">
      <div style="min-height: 200px; padding: 20px 20px 0; text-align: center">
        <CommonForm
          :form-config="form"
          :common-config="commonConfig"
          :form-items="formItems"
          @handle-reset="handleReset"
          @get-form-data="getFormData"
        >
        </CommonForm>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formInfo } from "@/api/modules/formConfig.js";
// import { ElMessageBox } from "element-plus";
// import FormCom from "@/views/FormConfig/FormCom.vue";
import CommonForm from "@/components/CommonForm/index.vue";
import { deepClone } from "@/utils/deepClone.js";
export default {
  components: { CommonForm },
  data() {
    return {
      checked1: false,
      //新增权限系统
      dialogVisibleAdd: false,
      configObj: {},
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
      extend: "",

      carbonCk_list: [{}],
      total: 100,
      page: 1,
      page_size: 10,
      // dialogVisibleAddUser: false
      titleName: ""
    };
  },
  methods: {
    addapi() {
      this.dialogVisibleAdd = true;
      this.formInfo();
    },
    addMenu(val) {
      this.titleName = val;
      this.formInfo();
    },
    formInfo() {
      formInfo({ key: "addapi" }).then(res => {
        this.configObj = JSON.parse(res.data);
        this.commonConfig = this.configObj.config ? deepClone(JSON.parse(this.configObj.config).commonConfig) : this.localConfig;
        this.formItems = this.configObj.config ? deepClone(JSON.parse(this.configObj.config).configList) : [];
        this.extend = this.configObj.extend ? deepClone(JSON.parse(this.configObj.extend)) : "";
      });
    },
    //获取表单数据
    getFormData(form) {
      console.log(form);
    },
    handleSizeChange(val) {
      console.log(`${val} items per page`);
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`);
    },
    //新增
    openAddDialog() {
      this.dialogVisibleAdd = true;
      this.formInfo();
    },
    handleReset() {
      this.dialogVisibleAdd = false;
    }
    // confirm() {}
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
