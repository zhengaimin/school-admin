<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生姓名</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <!-- <label for="name">年级</label>
      <el-select style="width: 250px" v-model="filterForm.gradeId">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select> -->
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>学生信息</span>
      <div>
        <el-button type="primary" class="search-btn" @click="uploadFile"> 导入 </el-button>
        <el-button type="primary" class="search-btn" @click="loadFileTemple"> 下载导入模板 </el-button>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="学生姓名" prop="name"> </el-table-column>
        <el-table-column label="性别" prop="sex"> </el-table-column>
        <el-table-column label="身份证" prop="idCard" width="200"> </el-table-column>
        <el-table-column label="IC卡号" prop="cardNumber" width="180"> </el-table-column>
        <el-table-column label="电话" prop="phone" width="150"> </el-table-column>
        <el-table-column label="家庭住址" prop="address"> </el-table-column>
        <el-table-column label="监护人" prop="guardianName"> </el-table-column>
        <el-table-column label="监护人电话" prop="guardianPhone"> </el-table-column>
        <el-table-column label="学生类型">
          <template #default="{ row }">
            {{ row.studentType == "BOARDING" ? "寄宿生" : "走读生" }}
          </template>
        </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="班级" prop="className"> </el-table-column>
        <el-table-column label="学号" prop="studentCode"> </el-table-column>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="学生姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex">
                  <el-option v-for="v in genderList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="学生类型" prop="studentType">
                <el-select v-model="form.studentType">
                  <el-option v-for="v in typeList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="班级" prop="classId">
                <el-select v-model="form.classId">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="身份证号(身份证和学号至少填一个)" prop="idCard">
                <el-input v-model="form.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="学号" prop="studentCode">
                <el-input v-model="form.studentCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="家庭住址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="监护人姓名" prop="guardianName">
                <el-input v-model="form.guardianName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="监护人电话" prop="guardianPhone">
                <el-input v-model="form.guardianPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="IC卡号" prop="cardNumber">
                <el-input v-model="form.cardNumber"></el-input>
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
    <el-dialog v-model="strumentsloadFlag" :close-on-click-modal="false" title="导入计量器具" :width="800">
      <div style="min-height: 100px; text-align: center">
        <el-row v-if="!falseFlag">
          <el-col :span="24">
            <el-upload
              style="width: 100%"
              class="upload-demo"
              ref="uploadFile"
              :action="activeUrl"
              :data="{
                tenantId: userInfo.tenantId,
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
              导入失败数量：<span style="font-weight: bold; color: red">{{ errorData.failCount }}</span>
            </h1>
          </el-row>
          <el-row>
            <el-table class="my-custom-table" :data="errorData.failList">
              <el-table-column label="Excel行号" prop="index" align="left"> </el-table-column>
              <el-table-column label="姓名" prop="name" align="left"> </el-table-column>
              <el-table-column label="失败原因" prop="reason" align="left"> </el-table-column>
            </el-table>
          </el-row>
        </div>
        <div style="margin: 20px 0; text-align: center">
          <el-button @click="strumentsloadFlag = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {
  classesList,
  studentsAdd,
  studentsUpdate,
  studentsList,
  studentsDelete
  // classesDetail
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        gradeId: ""
      },
      //新增权限系统
      dialogVisibleAdd: false,
      genderList: [
        { id: "男", name: "男" },
        { id: "女", name: "女" }
      ],
      typeList: [
        { id: "BOARDING", name: "寄宿生" },
        { id: "DAY", name: "走读生" }
      ],
      gradesList: [],
      form: {
        name: "",
        sex: "",
        idCard: "",
        cardNumber: "",
        phone: "",
        address: "",
        guardianName: "",
        guardianPhone: "",
        studentType: "",
        classId: "",
        studentCode: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        sex: [{ required: true, message: "必填项", trigger: "blur" }],
        studentType: [{ required: true, message: "必填项", trigger: "blur" }],
        classId: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      // 导入
      strumentsloadFlag: false,
      falseFlag: false,
      errorData: {},
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
    },
    loadTemple() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/template`;
      } else {
        return `/admin/students/template`;
      }
    },
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/import-excel`;
      } else {
        return `/admin/students/import-excel`;
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
          this.getGradesList();
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getGradesList();
    this.fetchTenantList();
  },
  methods: {
    // 获取班级
    getGradesList() {
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200`;
      classesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
      });
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.gradeId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&gradeId=${gradeId}`;
      studentsList(params).then(res => {
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
      delete this.form.id;
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      // classesDetail({ id: row.id }).then(res => {
      //   if (res.code == 0 && res.data) {
      //     for (let key in res.data) {
      //       this.form[key] = res.data[key];
      //     }
      //   } else {
      //     this.$message.error("获取信息失败");
      //   }
      // });
      for (let key in row) {
        this.form[key] = row[key];
      }
      this.form.id = row.id;
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (!this.form.idCard && !this.form.studentCode) {
            this.$message.warning("身份证号和学号不能同时为空");
            return;
          }
          if (this.form.id) {
            studentsUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          studentsAdd(this.form).then(res => {
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
          studentsDelete({ id: row.id }).then(res => {
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
    // 下载导入模板
    loadFileTemple() {
      let url = this.loadTemple + `?tenantId=${this.userInfo.tenantId}&schoolId=${this.schoolId}`;
      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          },
          responseType: "blob"
        })
        .then(data => {
          const content = data.data;
          let blob = new Blob([content], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.href = url;
          aLink.setAttribute("download", "学生导入模板.xlsx");
          aLink.click();
          window.URL.revokeObjectURL(url);
        });
    },
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
      if (res.code == 0 && res.data.failCount == 0) {
        this.$message.success("导入成功");
        this.strumentsloadFlag = false;
      } else {
        this.errorData = res.data;
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
