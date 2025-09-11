<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">学生姓名</label>
      <el-input style="width: 150px" v-model="filterForm.name"></el-input>
      <label for="">年级</label>
      <el-select placeholder="年级" @change="getdepartmentsList" style="width: 150px" v-model="filterForm.gradeId">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <label for="">级部</label>
      <el-select placeholder="级部" @change="getClassList" style="width: 150px" v-model="filterForm.departmentId">
        <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <label for="">班级</label>
      <el-select placeholder="班级" style="width: 150px" v-model="filterForm.classId">
        <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>学生信息</span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
        <el-button type="primary" class="search-btn" @click="uploadFile(1)"> 导入学生信息 </el-button>
        <el-button type="primary" class="search-btn" @click="loadFileTemple"> 下载导入模板 </el-button>
        <el-button type="primary" class="search-btn" @click="exportStudentInfo"> 批量导出学生信息 </el-button>
        <el-button type="primary" class="search-btn" @click="uploadFile(2)"> 批量导入更新学生信息 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list">
        <el-table-column label="学生姓名" prop="name" width="95"> </el-table-column>
        <el-table-column label="图片" width="95" align="center">
          <template #default="{ row }">
            <img style="width: 70px; max-height: 70px; border-radius: 50%" :src="row.faceImageUrl" alt="" srcset="" />
          </template>
        </el-table-column>
        <el-table-column label="人脸核验" width="95">
          <template #default="{ row }">
            {{ ["未采集", "已采集", "审核中", "审核通过", "审核失败"][row.faceStatus] }}
          </template>
        </el-table-column>
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="级部" prop="departmentName"> </el-table-column>
        <el-table-column label="班级" prop="className"> </el-table-column>
        <el-table-column label="学号" prop="studentCode"> </el-table-column>
        <el-table-column label="性别" prop="sex"> </el-table-column>
        <el-table-column label="身份证" prop="idCard" width="200"> </el-table-column>
        <el-table-column label="UUID" prop="uuid" width="180"> </el-table-column>
        <el-table-column label="IC卡号" prop="cardNumber" width="180"> </el-table-column>
        <el-table-column label="电话" prop="phone" width="150"> </el-table-column>
        <el-table-column label="监护人" prop="guardianName" width="110"> </el-table-column>
        <el-table-column label="监护人电话" prop="guardianPhone" width="95"> </el-table-column>
        <el-table-column label="学生类型" width="110">
          <template #default="{ row }">
            {{ row.studentType == "BOARDING" ? "寄宿生" : "走读生" }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            {{ ["停用", "在读", "毕业", "转学"][row.status] }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="addParent(scope.row)">亲情号</div>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="880">
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
              <el-form-item label="年级" prop="gradeId">
                <el-select @change="getdepartmentsList" v-model="form.gradeId">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="级部" prop="">
                <el-select v-model="form.departmentId" @change="getClassList">
                  <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="班级" prop="">
                <el-select v-model="form.classId">
                  <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
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
                <el-input v-model="form.phone" @blur="checkPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="IC卡号" prop="cardNumber">
                <el-input v-model="form.cardNumber"></el-input>
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
            <el-col :span="7">
              <el-form-item label="个人图片">
                <el-upload
                  style="width: 100%"
                  class="upload-demo"
                  ref="uploadFileface"
                  :action="activeUrlFile"
                  :data="{
                    businessType: 'AVATAR'
                  }"
                  :headers="{ Authorization: token }"
                  :before-upload="beforeAvatarUploadfile"
                  :on-success="handleSuccessfile"
                  :limit="1"
                  :show-file-list="false"
                >
                  <div
                    v-if="!form.faceImageUrl"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-around;
                      width: 100px;
                      height: 100px;
                      padding: 0;
                    "
                    class="upload-box"
                  >
                    <el-icon style="font-size: 30px"><Plus /></el-icon>
                  </div>
                  <img
                    @click="clearFile"
                    v-if="form.faceImageUrl"
                    style="width: 100px; height: 100px"
                    :src="form.faceImageUrl"
                    alt=""
                    srcset=""
                  />
                </el-upload>
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
        <el-row v-if="!falseFlag">
          <el-col :span="24">
            <el-upload
              style="width: 100%"
              class="upload-demo"
              ref="uploadFile"
              :action="typeflag == 1 ? activeUrl : uploadStudentUrl"
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
    <!-- 亲情号 -->
    <el-dialog v-model="parentDialog" :close-on-click-modal="false" title="亲情号" :width="900">
      <div>
        <div style="margin: 10px; text-align: right">
          <el-button @click="addInnerDialog" type="primary">新增</el-button>
        </div>
        <el-table class="my-custom-table" :data="parentList">
          <el-table-column label="关系" prop="relationshipName"> </el-table-column>
          <el-table-column label="显示排序" prop="sortOrder"> </el-table-column>
          <el-table-column label="别称" prop="nickname"> </el-table-column>
          <el-table-column label="手机号" prop="phone"> </el-table-column>
          <el-table-column label="是否主联系人" prop="isPrimary">
            <template #default="{ row }">
              {{ row.isPrimary ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120" fixed="right">
            <template #default="scope">
              <div class="table-btn">
                <div @click="editRowParent(scope.row)">
                  <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                </div>
                <div @click="deleteRowparent(scope.row)">
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
      <el-dialog v-model="parentDialog_add" :close-on-click-modal="false" width="700" title="设置亲情号" append-to-body>
        <div style="padding-left: 20px">
          <el-form
            ref="linkFormRefparent"
            :model="parentForm"
            :rules="parentlinkRules"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-row>
              <el-col :span="16">
                <el-form-item label="关系" prop="relationship">
                  <el-select v-model.number="parentForm.relationship">
                    <el-option v-for="v in relationList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="别称" prop="nickname">
                  <el-input v-model="parentForm.nickname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="parentForm.phone" @blur="checkPhonep"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="是否主联系人" prop="isPrimary">
                  <el-select v-model="parentForm.isPrimary">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="显示排序" prop="sortOrder">
                  <el-input type="number" v-model.number="parentForm.sortOrder"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="23">
            <el-col :span="23">
              <div style="margin-top: 20px; text-align: right">
                <el-button @click="parentDialog_add = false">取消</el-button>
                <el-button type="primary" @click="parentconfirmAdd">确定</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: center">
            <el-button @click="parentDialog = false">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 批量导出学生信息 -->
    <el-dialog v-model="exportDialog" :close-on-click-modal="false" title="批量导出" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="exportlinkFormRef" :model="exportForm" :rules="exportlinkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="年级" prop="gradeId">
                <el-select @change="getdepartmentsList" v-model="exportForm.gradeId">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="级部" prop="departmentId">
                <el-select v-model="exportForm.departmentId" @change="getClassList">
                  <el-option v-for="v in departmentsList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item label="班级" prop="classId">
                <el-select v-model="exportForm.classId">
                  <el-option v-for="v in classList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="exportDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmexport">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {
  gradesList,
  departmentsList,
  classesList,
  studentsAdd,
  studentsUpdate,
  studentsList,
  studentsDelete,
  studentsDetail,
  familycontactsAdd,
  familycontactsUpdate,
  familycontactsList,
  familycontactsDetail,
  familycontactsDelete
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        gradeId: "",
        departmentId: "",
        classId: ""
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
      departmentsList: [],
      classList: [],
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
        gradeId: "",
        departmentId: "",
        classId: "",
        studentCode: "",
        faceImageUrl: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        sex: [{ required: true, message: "必填项", trigger: "blur" }],
        studentType: [{ required: true, message: "必填项", trigger: "blur" }],
        gradeId: [{ required: true, message: "必填项", trigger: "blur" }],
        departmentId: [{ required: true, message: "必填项", trigger: "blur" }],
        classId: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      // 导入
      strumentsloadFlag: false,
      typeflag: "",
      falseFlag: false,
      errorData: {},
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 亲情号
      parentDialog: false,
      parentList: [],
      parentDialog_add: false,
      relationList: [
        { id: 1, name: "爸爸" },
        { id: 2, name: "妈妈" },
        { id: 3, name: "爷爷" },
        { id: 4, name: "奶奶" },
        { id: 5, name: "外公" },
        { id: 6, name: "外婆" },
        { id: 7, name: "姐姐" },
        { id: 8, name: "哥哥" },
        { id: 9, name: "其它一" }
      ],
      parentForm: {
        studentId: "",
        relationship: "",
        nickname: "",
        phone: "",
        isPrimary: "",
        sortOrder: ""
      },
      parentlinkRules: {
        relationship: [{ required: true, message: "必填项", trigger: "blur" }],
        nickname: [{ required: true, message: "必填项", trigger: "blur" }],
        phone: [{ required: true, message: "必填项", trigger: "blur" }],
        isPrimary: [{ required: true, message: "必填项", trigger: "blur" }],
        sortOrder: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      // 批量导出
      exportDialog: false,
      exportForm: {
        gradeId: "",
        departmentId: "",
        classId: ""
      }
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
    activeUrlFile() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/files/upload`;
      } else {
        return `/common/files/upload`;
      }
    },
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/import-excel`;
      } else {
        return `/admin/students/import-excel`;
      }
    },
    exportStudentUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/export`;
      } else {
        return `/admin/students/export`;
      }
    },
    uploadStudentUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/admin/students/update-excel`;
      } else {
        return `/admin/students/update-excel`;
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
          this.filterForm.gradeId = "";
          this.filterForm.departmentId = "";
          this.filterForm.classId = "";
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
    checkPhone() {
      if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        this.form.phone = "";
        this.$message.warning("请输入正确的手机号");
      }
    },
    checkPhonep() {
      if (!/^1[3456789]\d{9}$/.test(this.parentForm.phone)) {
        this.parentForm.phone = "";
        this.$message.warning("请输入正确的手机号");
      }
    },
    getGradesList() {
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
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.form.departmentId = "";
      this.form.classId = "";
      this.exportForm.departmentId = "";
      this.exportForm.classId = "";

      let params = `schoolId=${this.schoolId}&page=1&pageSize=100&gradeId=${this.form.gradeId}`;
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
      this.filterForm.classId = "";
      this.form.classId = "";
      this.exportForm.classId = "";
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&gradeId=${this.form.gradeId}&departmentId=${this.form.departmentId}`;
      classesList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.classList = res.data.list;
        } else {
          this.classList = [];
        }
      });
    },

    reset() {
      this.filterForm.name = "";
      this.filterForm.gradeId = "";
      this.filterForm.departmentId = "";
      this.filterForm.classId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let departmentId = this.filterForm.departmentId ? this.filterForm.departmentId : -1;
      let classId = this.filterForm.classId ? this.filterForm.classId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&gradeId=${gradeId}&departmentId=${departmentId}&classId=${classId}`;
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
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      delete this.form.id;
      this.dialogVisibleAdd = true;
      this.form.faceImageUrl = "";
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.$refs.uploadFileface.clearFiles();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      this.form.faceImageUrl = "";
      studentsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
          this.getdepartmentsList();
          this.getClassList();
          this.form.id = row.id;
        } else {
          this.$message.error("获取信息失败");
        }
      });
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
          this.form.schoolId = this.schoolId;
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
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
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
    uploadFile(val) {
      this.typeflag = val;
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
    },
    // 头像
    beforeAvatarUploadfile() {
      return true;
    },
    clearFile() {
      this.$refs.uploadFileface.clearFiles();
    },
    handleSuccessfile(res) {
      this.form.faceImageUrl = window.location.origin + res.data.thumbnailUrl;
      // this.form.faceImageUrl = "https://golanghub.top" + res.data.thumbnailUrl;
    },
    // 亲情号
    addParent(row) {
      this.parentForm.studentId = row.id;
      let params = `page=1&pageSize=150&studentId=${row.id}`;
      this.parentDialog = true;
      familycontactsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.parentList = res.data.list;
        } else {
          this.parentList = [];
        }
      });
    },
    addInnerDialog() {
      delete this.parentForm.id;
      this.parentDialog_add = true;
      this.$nextTick(() => {
        this.$refs.linkFormRefparent.resetFields();
      });
    },
    editRowParent(row) {
      this.parentDialog_add = true;
      familycontactsDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.parentForm[key] = res.data[key];
          }
        } else {
          this.$message.error("获取信息失败");
        }
      });
      this.parentForm.id = row.id;
    },
    parentconfirmAdd() {
      this.$refs.linkFormRefparent.validate(valid => {
        if (valid) {
          if (this.parentForm.id) {
            familycontactsUpdate(this.parentForm).then(res => {
              if (res.code == 0) {
                this.parentDialog_add = false;
                this.$message.success("编辑成功");
                this.addParent({ id: this.parentForm.studentId });
              }
            });
            return;
          }
          familycontactsAdd(this.parentForm).then(res => {
            if (res.code == 0) {
              this.parentDialog_add = false;
              this.$message.success("添加成功");
              this.addParent({ id: this.parentForm.studentId });
            }
          });
        }
      });
    },
    deleteRowparent(row) {
      familycontactsDelete({ id: row.id }).then(res => {
        if (res && res.code == 0) {
          this.$message.success("删除成功");
          this.addParent({ id: this.parentForm.studentId });
        }
      });
    },
    // 批量导出学生信息
    exportStudentInfo() {
      if (this.schoolId == -1) {
        this.$message.warning("请先选择学校");
        return;
      }
      this.exportDialog = true;
      this.$nextTick(() => {
        this.$refs.exportlinkFormRef.resetFields();
      });
    },
    confirmexport() {
      this.exportForm.schoolId = this.schoolId;
      axios
        .post(this.exportStudentUrl, this.exportForm, {
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
          aLink.setAttribute("download", "学生信息.xlsx");
          aLink.click();
          window.URL.revokeObjectURL(url);
          this.exportDialog = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
