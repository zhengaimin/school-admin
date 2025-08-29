<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">电话号码</label>
      <el-input style="width: 250px" v-model="filterForm.phoneNumber"></el-input>
      <label for="name">称呼</label>
      <el-input style="width: 250px" v-model="filterForm.salutation"></el-input>
      <label for="name">启用状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>SOS电话配置</span>
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
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="电话号码" prop="phoneNumber"> </el-table-column>
        <el-table-column label="称呼" prop="salutation"> </el-table-column>
        <el-table-column label="排序号" prop="orderNumber"> </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            {{ ["禁用", "启用"][row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
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
        v-model:page-size="pageSize"
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
              <el-form-item label="电话号码" prop="phoneNumber">
                <el-input v-model="form.phoneNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="称呼" prop="salutation">
                <el-input v-model="form.salutation"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="排序" prop="orderNumber">
                <el-input type="number" v-model.number="form.orderNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio :value="Number(1)">启用</el-radio>
                  <el-radio :value="Number(0)">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" rows="3" v-model="form.description"></el-input>
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
import { schoolsosAdd, schoolsosUpdate, schoolsosList, schoolsosDelete, schoolsosDetail } from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        phoneNumber: "",
        salutation: "",
        status: ""
      },
      gradesList: [
        { id: "1", name: "启用" },
        { id: "0", name: "禁用" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      schoolsList: [],
      form: {
        schoolId: "",
        phoneNumber: "",
        salutation: "",
        orderNumber: 1,
        status: 1,
        description: ""
      },
      linkRules: {
        phoneNumber: [{ required: true, message: "必填项", trigger: "blur" }],
        salutation: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    }
  },
  watch: {
    schoolId: {
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    reset() {
      this.filterForm.phoneNumber = "";
      this.filterForm.salutation = "";
      this.filterForm.status = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let params = `schoolId=${this.schoolId}&phoneNumber=${this.filterForm.phoneNumber}&salutation=${this.filterForm.salutation}&status=${status}&page=${this.page}&pageSize=${this.pageSize}`;
      schoolsosList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonCk_list = res.data.list;
          this.total = res.data.total;
        } else {
          this.carbonCk_list = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.fetchTenantList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchTenantList();
    },

    //新增
    openAddDialog() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择右上角的学校");
        return;
      }
      delete this.form.id;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      schoolsosDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.form.id = row.id;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.form.id) {
            schoolsosUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          schoolsosAdd(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.fetchTenantList();
            }
          });
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
          schoolsosDelete({ id: row.id }).then(res => {
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
