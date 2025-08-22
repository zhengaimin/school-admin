<template>
  <div class="table-box">
    <div class="filter-box">
      <!-- <label for="name">学生姓名</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input> -->
      <!-- <label for="name">年级</label>
      <el-select style="width: 250px" v-model="filterForm.gradeId">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select> -->
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>家长信息</span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" :data="carbonCk_list">
        <el-table-column label="班级" prop="name"> </el-table-column>
        <el-table-column label="学生" prop="sex"> </el-table-column>
        <el-table-column label="称谓" prop="idCard" width="200"> </el-table-column>
        <el-table-column label="亲情号" prop="cardNumber" width="180"> </el-table-column>
        <el-table-column label="是否主联系人" prop="phone" width="150"> </el-table-column>
        <el-table-column label="家长微信" prop="address"> </el-table-column>
        <el-table-column label="微信绑定时间" prop="guardianName"> </el-table-column>
        <el-table-column label="操作" align="center" width="220" fixed="right">
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
              <div style="color: red">解除微信绑定</div>
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
            <el-col :span="11">
              <el-form-item label="学生" prop="name">
                <el-select filterable v-model="form.sex">
                  <el-option v-for="v in carbonCk_list" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="称谓" prop="sex">
                <el-select v-model="form.sex">
                  <el-option v-for="v in genderList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="亲情号" prop="phone">
                <el-input v-model="form.phone"></el-input>
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
          this.getGradesList();
          // this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getGradesList();
    // this.fetchTenantList();
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
