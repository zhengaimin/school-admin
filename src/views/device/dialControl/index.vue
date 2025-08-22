<template>
  <div class="dial">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基础配置" name="first">
        <el-form ref="linkFormRef" :model="flform" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-form-item label="禁拨号码" prop="price">
            <el-input type="textarea" style="width: 60%" v-model="flform.price"></el-input>
          </el-form-item>
          <div style="font-size: 12px; color: red">提示：多个号码用“,”分隔，例如：110,120,119</div>
          <div style="margin-top: 20px; text-align: left">
            <el-button type="primary" @click="confirmAdd">保存</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通话时间段" name="second" style="width: 100%">
        <div class="table-box">
          <div class="btn-box" style="margin-bottom: 10px">
            <span></span>
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
              <el-table-column label="星期" prop="sbname"> </el-table-column>
              <el-table-column label="开始时间" prop="created_at"> </el-table-column>
              <el-table-column label="结束时间" prop="updated_at"> </el-table-column>
              <el-table-column label="操作" align="center" width="150" fixed="right">
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
          <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="600">
            <div style="padding-left: 20px">
              <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
                <el-row>
                  <el-col :span="23">
                    <el-form-item label="星期" prop="sbname">
                      <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="item in xingqiList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="开始时间" prop="price">
                      <el-date-picker style="width: 100%" v-model="form.start_time" value-format="x" :type="dateType" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <el-form-item label="结束时间" prop="price">
                      <el-date-picker style="width: 100%" v-model="form.end_time" value-format="x" :type="dateType" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="23">
                    <el-radio-group v-model="flform.radio">
                      <el-radio :value="1">启用</el-radio>
                      <el-radio :value="2">不启用</el-radio>
                    </el-radio-group>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { tenantList, tenantDelete } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      activeName: "first",
      flform: {},
      filterForm: {},
      statusList: [
        { id: 1, name: "2024级" },
        { id: 2, name: "2025级" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      form: {},
      linkRules: {
        sbname: [{ required: true, message: "必填项", trigger: "blur" }],
        xinhao: [{ required: true, message: "必填项", trigger: "blur" }],
        status: [{ required: true, message: "必填项", trigger: "change" }],
        bianhao: [{ required: true, message: "必填项", trigger: "change" }]
      },
      xingqiList: [
        { id: 1, name: "星期一" },
        { id: 2, name: "星期二" },
        { id: 3, name: "星期三" },
        { id: 4, name: "星期四" },
        { id: 5, name: "星期五" },
        { id: 6, name: "星期六" },
        { id: 7, name: "星期日" }
      ],
      carbonCk_list: [
        {
          id: 1,
          sbname: "星期一",
          xinhao: "5",
          status: "50",
          bianhao: "Y6478374347387434",
          address: "开启",
          created_at: "06:00:00",
          updated_at: "20:00:00"
        }
      ],
      total: 0,
      page: 1,
      page_size: 10
    };
  },
  methods: {
    handleClick() {
      console.log(this.activeName);
    },
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
    },
    addFl() {
      this.dialogVisibleFL = true;
    },
    addbohao() {
      this.bohaoVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
