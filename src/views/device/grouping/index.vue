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
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
        <el-button type="primary" class="search-btn" @click="uploadFile()"> 导入 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName" width="150"> </el-table-column>
        <el-table-column label="设备组名称" prop="name" width="150"> </el-table-column>
        <el-table-column label="当前设备数（台）" prop="currentDeviceCount" width="140"> </el-table-column>
        <el-table-column label="最大设备数（台）" prop="maxDeviceCount" width="140"> </el-table-column>
        <el-table-column label="是否VOIP组" width="100">
          <template #default="{ row }">
            {{ row.isVoipGroup ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch @change="changeStatus(row)" v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
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
              <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
                学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备组名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备组编码" prop="code">
                <el-input v-model="form.code"></el-input>
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
    <!-- 导入 -->
    <el-dialog v-model="strumentsloadFlag" :close-on-click-modal="false" title="导入" :width="800">
      <div style="min-height: 100px; text-align: center">
        <el-row>
          <el-col :span="23">
            <div style="padding: 10px; margin-bottom: 15px; background: #f4f6fa; border-radius: 15px">
              学校名称：<span style="font-weight: bold; color: #409eff">{{ schoolName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="!falseFlag">
          <el-col :span="24">
            <el-upload
              style="width: 100%"
              class="upload-demo"
              ref="uploadFile"
              :action="activeUrl"
              :data="{
                schoolId: schoolId
              }"
              :headers="{ Authorization: token }"
              :before-upload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :limit="1"
              :show-file-list="false"
            >
              <div class="upload-box">
                <el-icon style="font-size: 25px; color: #cccccc"><UploadFilled /></el-icon>
                <p>请上传</p>
              </div>
            </el-upload>
          </el-col>
        </el-row>
        <div v-else>
          <el-row>
            <h1 class="errorMath">
              导入失败数量：<span style="font-weight: bold; color: red">{{ errorData.errorCount }}</span>
            </h1>
          </el-row>
          <el-row>
            <el-table class="my-custom-table" :data="errorData.errorList">
              <el-table-column label="Excel行号" prop="row" align="left"> </el-table-column>
              <el-table-column label="姓名" prop="name" align="left"> </el-table-column>
              <el-table-column label="状态" prop="status" align="left"> </el-table-column>
              <el-table-column label="失败原因" prop="message" align="left"> </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="margin: 20px 0; text-align: center">
          <el-button @click="strumentsloadFlag = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  devicegroupsAdd,
  devicegroupsUpdate,
  devicegroupsList,
  devicegroupsDelete,
  devicegroupsDetail
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
      form: {
        name: "",
        code: "",
        isVoipGroup: false,
        schoolId: "",
        description: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        code: [{ required: true, message: "必填项", trigger: "blur" }],
        isVoipGroup: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 导入
      strumentsloadFlag: false,
      typeflag: "",
      falseFlag: false,
      errorData: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    schoolId() {
      return useUserStore().schoolMsg.schoolId ? Number(useUserStore().schoolMsg.schoolId) : "";
    },
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
    },
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/device-groups/import-excel`;
      } else {
        return `/admin/device-groups/import-excel`;
      }
    },
    token() {
      return useUserStore().token;
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
      devicegroupsList(params).then(res => {
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
      devicegroupsDetail({ id: row.id }).then(res => {
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
      devicegroupsUpdate(params).then(res => {
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
            devicegroupsUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          devicegroupsAdd(this.form).then(res => {
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
          devicegroupsDelete({ id: row.id }).then(res => {
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
    // 导入
    uploadFile() {
      this.strumentsloadFlag = true;
      this.falseFlag = false;
      this.$nextTick(() => {
        this.$refs.uploadFile.clearFiles();
      });
    },
    beforeAvatarUpload() {
      // this.$refs.uploadFile.clearFiles();
    },
    handleSuccess(res) {
      if (res.code == 0 && res.data.errorCount == 0) {
        this.$message.success("导入成功");
        this.strumentsloadFlag = false;
      } else {
        let ary = res.data.results.filter(v => v.status == "失败");
        this.errorData = res.data;
        this.errorData.errorList = ary;
        this.falseFlag = true;
      }
      this.fetchTenantList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
