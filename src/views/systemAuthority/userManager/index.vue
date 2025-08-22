<template>
  <div class="table-box">
    <div class="btn-box">
      <span>项目成员</span>
      <div>
        <el-button class="search-btn">
          <img src="@/assets/images/common/delete-circle-2.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          删除
        </el-button>
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="name" align="center" width="100"> </el-table-column>
        <el-table-column label="ID" prop="name" align="center" width="100"> </el-table-column>
        <el-table-column label="姓名" prop="name" align="center"> </el-table-column>
        <el-table-column label="账号" prop="email" align="center"> </el-table-column>
        <el-table-column label="电话" align="center"> </el-table-column>
        <el-table-column label="邮箱" align="center"> </el-table-column>
        <el-table-column label="角色" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center"> </el-table-column>
        <el-table-column label="更新时间" align="center"> </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div>
                <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
              </div>
              <div @click="delete scope.row">
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="新增成员" width="700">
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
      page_size: 10
      // dialogVisibleAddUser: false
    };
  },
  mounted() {
    this.formInfo();
  },
  methods: {
    formInfo() {
      formInfo({ key: "addProjectUser" }).then(res => {
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
