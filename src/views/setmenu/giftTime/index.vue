<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in statusList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>赠送时长信息</span>
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
      <el-table class="my-custom-table" height="100%" border :data="carbonCk_list">
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="学生" prop="studentName"> </el-table-column>
        <el-table-column label="总赠送分钟数" prop="totalMinutes"> </el-table-column>
        <el-table-column label="已使用分钟数" prop="usedMinutes"> </el-table-column>
        <el-table-column label="剩余分钟数" prop="remainingMinutes"> </el-table-column>
        <el-table-column label="生效时间" prop="startDate" width="190"> </el-table-column>
        <el-table-column label="过期时间" prop="expireDate"> </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            {{ ["", "有效", "已用完", "已过期", "已取消"][scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"> </el-table-column>
        <el-table-column label="操作" align="center" width="90" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div v-if="scope.row.status == 1" @click="deleteRow(scope.row)">取消赠送</div>
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
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="form.packageTemplateId ? '编辑' : '新增'"
      :width="800"
    >
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
            <el-col :span="11">
              <el-form-item label="赠送时长（分钟）" prop="minutes">
                <el-input-number style="width: 100%" v-model.number="form.minutes" :min="1"> </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="过期时间" prop="expireDate">
                <el-date-picker
                  style="width: 100%"
                  v-model="form.expireDate"
                  :value-format="'YYYY-MM-DD'"
                  :format="'YYYY-MM-DD'"
                  type="date"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="3" v-model="form.description" :maxlength="255" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="添加学生">
                <div>
                  <div><el-button type="primary" @click="addStudent">添加</el-button><br /></div>
                  <div>
                    <el-tag
                      v-for="tag in form.studentIds"
                      @close="handleClose(tag)"
                      :key="tag.name"
                      closable
                      type="primary"
                      style="margin-right: 10px"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-dialog v-model="innerDialog" width="900" title="学生" append-to-body>
        <div class="table-list" style="padding: 0 10px">
          <div style="margin: 0 10px 10px 0">
            <el-select placeholder="年级" @change="getdepartmentsList" style="width: 200px" v-model="filterForm_s.gradeId">
              <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
            </el-select>
            <el-select
              placeholder="级部"
              @change="getClassList"
              style="width: 200px; margin: 0 10px"
              v-model="filterForm_s.departmentId"
            >
              <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
            </el-select>
            <el-select placeholder="班级" style="width: 200px; margin-right: 10px" v-model="filterForm_s.classId">
              <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
            </el-select>
            <el-button type="primary" @click="fetchstudentsList()">查询</el-button>
          </div>
          <el-table class="my-custom-table" :data="student_list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="学生姓名" prop="name"> </el-table-column>
            <el-table-column label="学校" prop="schoolName"> </el-table-column>
            <el-table-column label="年级" prop="gradeName"> </el-table-column>
            <el-table-column label="级部" prop="departmentName"> </el-table-column>
            <el-table-column label="班级" prop="className"> </el-table-column>
            <el-table-column label="学号" prop="studentCode"> </el-table-column>
            <el-table-column label="性别" prop="sex"> </el-table-column>
            <el-table-column label="身份证" prop="idCard"> </el-table-column>
          </el-table>
          <div class="demo-pagination-block" style="padding: 10px 0">
            <el-pagination
              v-model:current-page="s_page"
              v-model:page-size="s_pageSize"
              :page-sizes="[10, 20, 50, 100, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="s_total"
              @size-change="s_handleSizeChange"
              @current-change="s_handleCurrentChange"
            />
          </div>
        </div>
        <div style="text-align: right">
          <el-button @click="innerDialog = false"> 取消 </el-button>
          <el-button type="primary" @click="confirmAdd_s">确认</el-button>
        </div>
      </el-dialog>
      <template #footer>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogVisibleAdd = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  giftsbatch,
  giftsList,
  studentsList,
  giftsDelete,
  gradesList,
  departmentsList,
  classesList
} from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      statusList: [
        { id: 1, name: "有效" },
        { id: 2, name: "已用完" },
        { id: 3, name: "已过期" },
        { id: 4, name: "已取消" }
      ],
      filterForm: {
        status: ""
      },
      //新增
      dialogVisibleAdd: false,
      form: {
        studentIds: [],
        minutes: [],
        expireDate: "",
        description: ""
      },
      linkRules: {
        studentIds: [{ required: true, message: "必填项", trigger: "blur" }],
        minutes: [{ required: true, message: "必填项", trigger: "blur" }],
        expireDate: [{ required: true, message: "必填项", trigger: "blur" }],
        studentIds: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      // 学生
      innerDialog: false,
      filterForm_s: {
        gradeId: "",
        departmentId: "",
        classId: ""
      },
      gradesList: [],
      departmentsList: [],
      classList: [],
      student_list: [],
      multipleSelection: [],
      s_total: 0,
      s_page: 1,
      s_pageSize: 10,
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
    schoolName() {
      return useUserStore().schoolMsg.schoolName;
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
      this.filterForm.status = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&source=ADMIN_GIFT&status=${status}`;
      giftsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.items) {
          this.carbonCk_list = res.data.items;
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
      this.dialogVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.multipleSelection = [];
        this.form.studentIds = [];
      });
    },
    getGradesList() {
      this.filterForm_s.gradeId = "";
      this.filterForm_s.departmentId = "";
      this.filterForm_s.classId = "";
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&enrollYear=-1`;
      gradesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.gradesList = res.data.list;
        } else {
          this.gradesList = [];
        }
      });
    },
    getdepartmentsList() {
      this.filterForm_s.departmentId = "";
      this.filterForm_s.classId = "";
      let params = `schoolId=${this.schoolId}&page=1&pageSize=100&gradeId=${this.filterForm_s.gradeId}`;
      departmentsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.departmentsList = res.data.list;
        } else {
          this.departmentsList = [];
        }
      });
    },
    // 获取班级
    getClassList() {
      this.filterForm_s.classId = "";
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&gradeId=${this.filterForm_s.gradeId}&departmentId=${this.filterForm_s.departmentId}`;
      classesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.classList = res.data.list;
        } else {
          this.classList = [];
        }
      });
    },
    // 学生列表
    fetchstudentsList() {
      let gradeId = this.filterForm_s.gradeId ? this.filterForm_s.gradeId : -1;
      let departmentId = this.filterForm_s.departmentId ? this.filterForm_s.departmentId : -1;
      let classId = this.filterForm_s.classId ? this.filterForm_s.classId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.s_page}&pageSize=${this.s_pageSize}&name=&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}`;
      studentsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.student_list = res.data.list;
          this.s_total = res.data.total;
        } else {
          this.student_list = [];
          this.s_total = 0;
        }
      });
    },
    //获取表单数据
    s_handleSizeChange(val) {
      this.s_page = 1;
      this.s_pageSize = val;
      this.fetchstudentsList();
    },
    s_handleCurrentChange(val) {
      this.s_page = val;
      this.fetchstudentsList();
    },
    addStudent() {
      this.innerDialog = true;
      this.getGradesList();
      this.fetchstudentsList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    confirmAdd_s() {
      this.multipleSelection.map(v => {
        this.form.studentIds.push(v);
      });
      this.innerDialog = false;
    },
    handleClose(tag) {
      this.form.studentIds.splice(this.form.studentIds.indexOf(tag), 1);
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          let studentIds = [];
          this.form.studentIds.map(v => {
            studentIds.push(v.id);
          });
          let params = {
            studentIds: studentIds,
            minutes: this.form.minutes,
            expireDate: this.form.expireDate,
            description: this.form.description
          };
          giftsbatch(params).then(res => {
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
      ElMessageBox.confirm("确定取消赠送吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          giftsDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("操作成功");
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
