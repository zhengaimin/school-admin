<template>
  <div class="table-box">
    <div class="filter-box">
      <CommonForm
        :form-config="formFilter"
        :common-config="commonConfigFilter"
        :form-items="formItemsFilter"
        @handle-reset="handleResetFilter"
        @get-form-data="getFormDataFilter"
      >
      </CommonForm>
    </div>
    <div class="btn-box">
      <span>接口列表</span>
      <div>
        <!-- <el-button class="search-btn">
          <img src="@/assets/images/common/delete-circle-2.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          删除
        </el-button> -->
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
        <el-table-column label="名称" prop="title" width="180"> </el-table-column>
        <el-table-column label="接口路径" prop="path"> </el-table-column>
        <el-table-column label="请求方法" prop="action" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="created_at"> </el-table-column>
        <el-table-column label="更新时间" prop="updated_at"> </el-table-column>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="700">
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
import { sys_apiAdd, sys_apiList, sys_apiUpdate, sys_apiDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import CommonForm from "@/components/CommonForm/index.vue";
import { deepClone } from "@/utils/deepClone.js";
export default {
  components: { CommonForm },
  data() {
    return {
      //新增权限系统
      dialogVisibleAdd: false,
      form: {},
      formItems: [],
      commonConfig: {},
      formFilter: {},
      formItemsFilter: [],
      commonConfigFilter: {},
      localConfig: {
        labelPosition: "left",
        col: 3,
        labelWidth: 100,
        size: "default",
        labelSize: 14,
        btnposition: "left"
      },

      carbonCk_list: [],
      total: 0,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.formInfoFilter();
    this.formInfo();
    this.fetchTenantList();
  },
  methods: {
    //获取新增表单
    formInfo() {
      formInfo({ key: "addapiname" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfig = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItems = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
      });
    },
    //获取筛选表单
    formInfoFilter() {
      formInfo({ key: "filterApi" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfigFilter = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItemsFilter = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
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
      sys_apiList(params).then(res => {
        this.carbonCk_list = res.data.list;
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
    getFormData(form) {
      if (form.id) {
        sys_apiUpdate(form).then(res => {
          if (res.code == 0) {
            this.handleReset();
            this.fetchTenantList();
          }
        });
        return;
      }
      sys_apiAdd(form).then(res => {
        if (res.code == 0) {
          this.handleReset();
          this.fetchTenantList();
        }
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      for (let key in row) {
        this.form[key] = row[key];
      }
      this.form.id = row.id;
    },

    deleteRow(row) {
      ElMessageBox.confirm("确定删除该条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sys_apiDelete({ id: row.id }).then(res => {
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
