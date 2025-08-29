<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">设备组名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="name">启用状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>设备组</span>
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
        <el-table-column label="设备组名称" prop="name" width="150"> </el-table-column>
        <el-table-column label="当前设备数（台）" prop="currentDeviceCount" width="140"> </el-table-column>
        <el-table-column label="最大设备数（台）" prop="maxDeviceCount" width="140"> </el-table-column>
        <el-table-column label="是否VOIP组" width="100">
          <template #default="{ row }">
            {{ row.isVoipGroup ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch @change="changeStatus(row)" v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" width="220"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="170"> </el-table-column>
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
              <el-form-item label="设备组名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="是否VOIP组" prop="isVoipGroup">
                <el-radio-group v-model="form.isVoipGroup">
                  <el-radio :value="true">是</el-radio>
                  <el-radio :value="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
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
import {
  familycontactsAdd,
  familycontactsUpdate,
  familycontactsList,
  familycontactsDelete,
  familycontactsDetail
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        status: ""
      },
      gradesList: [
        { id: "1", name: "启用" },
        { id: "0", name: "禁用" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      genderList: [
        { id: "1", name: "爸爸" },
        { id: "2", name: "妈妈" },
        { id: "3", name: "爷爷" },
        { id: "4", name: "奶奶" },
        { id: "5", name: "外公" },
        { id: "6", name: "外婆" },
        { id: "7", name: "哥哥" },
        { id: "8", name: "姐姐" },
        { id: "9", name: "其它一" },
        { id: "10", name: "其它二" }
      ],

      form: {
        studentId: "",
        relationship: "",
        nickname: "",
        phone: "",
        isPrimary: "",
        sortOrder: ""
      },
      linkRules: {
        relationship: [{ required: true, message: "必填项", trigger: "blur" }],
        isVoipGroup: [{ required: true, message: "必填项", trigger: "blur" }],
        nickname: [{ required: true, message: "必填项", trigger: "blur" }],
        phone: [{ required: true, message: "必填项", trigger: "blur" }],
        isPrimary: [{ required: true, message: "必填项", trigger: "blur" }],
        sortOrder: [{ required: true, message: "必填项", trigger: "blur" }]
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
      this.filterForm.name = "";
      this.filterForm.status = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&status=${status}`;
      familycontactsList(params).then(res => {
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
      familycontactsDetail({ id: row.id }).then(res => {
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
    changeStatus(row) {
      let params = {
        schoolId: row.schoolId,
        id: row.id,
        status: row.status,
        isVoipGroup: row.isVoipGroup
      };
      familycontactsUpdate(params).then(res => {
        if (res.code == 0) {
          this.$message.success("状态修改成功");
          this.fetchTenantList();
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.form.id) {
            familycontactsUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          familycontactsAdd(this.form).then(res => {
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
          familycontactsDelete({ id: row.id }).then(res => {
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
