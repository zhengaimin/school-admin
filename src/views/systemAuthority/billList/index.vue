<template>
  <div class="table-box">
    <div class="btn-box">
      <span>账单管理</span>
      <div>
        <!-- <el-button :icon="ArrowLeft" class="search-btn">
          <img src="@/assets/images/common/delete-circle-2.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          删除
        </el-button>
        <el-button type="primary" class="search-btn">
          <img
            src="@/assets/images/common/add-circle-2.svg"
            alt=""
            style="width: 18px; height: 18px; margin-right: 3px; color: #ffffff"
          />
          新增
        </el-button> -->
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="账单编号" prop="name" align="center" width="100"> </el-table-column>
        <el-table-column label="账单金额" prop="name" align="center"> </el-table-column>
        <el-table-column label="消费人员" prop="email" align="center"> </el-table-column>
        <el-table-column label="消费时间" align="center"> </el-table-column>
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
  </div>
</template>
<script>
// import { ElMessageBox } from "element-plus";
// import FormCom from "@/views/FormConfig/FormCom.vue";
export default {
  // components: { FormCom },
  data() {
    return {
      //新增权限系统
      // dialogVisibleAdd: false,
      // form: {},
      // form1: {},
      // formItems: [],
      // formItems1: [],
      // commonConfig: {
      //   labelPosition: "left",
      //   col: 3,
      //   labelWidth: 100,
      //   size: "default",
      //   labelSize: 14
      // },
      // commonConfig1: {
      //   labelPosition: "left",
      //   col: 3,
      //   labelWidth: 100,
      //   size: "default",
      //   labelSize: 14
      // },
      carbonCk_list: [{}],
      total: 100,
      page: 1,
      page_size: 10
      // dialogVisibleAddUser: false
    };
  },
  mounted() {
    // if (localStorage.getItem("formObj")) {
    //   let val = JSON.parse(localStorage.getItem("formObj"))['"addauthority"'];
    //   let val1 = JSON.parse(localStorage.getItem("formObj"))['"addUser"'];
    //   if (val) {
    //     this.formItems = val.list;
    //     this.commonConfig = val.commonConfig;
    //   }
    //   if (val1) {
    //     this.formItems1 = val1.list;
    //     this.commonConfig1 = val1.commonConfig;
    //   }
    // }
  },
  methods: {
    // addSystem() {
    //   this.dialogVisibleAdd = true;
    // },
    // handleReset() {
    //   this.dialogVisibleAdd = false;
    // },
    // addUser() {
    //   this.dialogVisibleAddUser = true;
    // }
    handleSizeChange(val) {
      console.log(`${val} items per page`);
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
