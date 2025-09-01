<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">年级</label>
      <el-select style="width: 250px" v-model="filterForm.gradeId">
        <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>套餐列表</span>
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
        <el-table-column label="年级" prop="gradeName"> </el-table-column>
        <el-table-column label="套餐名称" prop="packageName"> </el-table-column>
        <el-table-column label="套餐类型" prop="packageType"> </el-table-column>
        <el-table-column label="基础价格（元）" prop="basePrice"> </el-table-column>
        <el-table-column label="套餐开始时间" prop="startTime"> </el-table-column>
        <el-table-column label="套餐结束时间" prop="endTime"> </el-table-column>
        <el-table-column label="通话语音分钟数">
          <template #default="{ row }">
            {{ row.packageContent.voice_call_minutes }}
          </template>
        </el-table-column>
        <el-table-column label="视频通话分钟数">
          <template #default="{ row }">
            {{ row.packageContent.video_call_minutes }}
          </template>
        </el-table-column>
        <el-table-column label="有效期（天）" prop="validityDays"> </el-table-column>
        <el-table-column label="时长分配类型" prop="durationType"> </el-table-column>
        <el-table-column label="是否按月重置" prop="monthlyReset"> </el-table-column>
        <el-table-column label="是否启用">
          <template #default="{ row }">
            {{ row.status == 1 ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="是否为默认套餐">
          <template #default="{ row }">
            {{ row.isDefault ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="排序权重" prop="sortOrder"> </el-table-column>
        <el-table-column label="套餐描述" prop="description"> </el-table-column>
        <el-table-column label="规则说明" prop="usageRules"> </el-table-column>
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
      <div v-if="form.isDefault" style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="基础价格(元)-最小0.1元" prop="basePrice">
                <el-input min="0.1" type="number" v-model.number="form.basePrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="套餐描述" prop="description">
                <el-input v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="使用规则说明" prop="usageRules">
                <el-input v-model="form.usageRules"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-else style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="年级" prop="gradeId">
                <el-select :disabled="form.id" v-model="form.gradeId">
                  <el-option v-for="v in gradesList" :key="v.id" :label="v.name" :value="Number(v.id)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="套餐名称" prop="packageName">
                <el-input v-model="form.packageName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="套餐类型" prop="packageType">
                <el-select :disabled="form.id" v-model="form.packageType">
                  <el-option v-for="v in packageTypeList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="基础价格(元)-最小0.1元" prop="basePrice">
                <el-input min="0.1" type="number" v-model.number="form.basePrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="套餐开始时间" prop="startTime">
                <el-date-picker
                  style="width: 100%"
                  v-model="form.startTime"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="套餐结束时间" prop="endTime">
                <el-date-picker
                  style="width: 100%"
                  v-model="form.endTime"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排序" prop="sortOrder">
                <el-input type="number" v-model.number="form.sortOrder"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="时长分配类型" prop="durationType">
                <el-select :disabled="form.id" v-model="form.durationType">
                  <el-option v-for="v in durationTypeList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="套餐描述" prop="description">
                <el-input v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="使用规则说明" prop="usageRules">
                <el-input v-model="form.usageRules"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="语音通话分钟数" prop="voiceCallMinutes">
                <el-input :disabled="form.packageType == 'VIDEO'" type="number" v-model.number="form.voiceCallMinutes"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="视频通话分钟数" prop="videoCallMinutes">
                <el-input :disabled="form.packageType == 'VOICE'" type="number" v-model.number="form.videoCallMinutes"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否按月重置" prop="monthlyReset">
                <el-select :disabled="form.id" v-model="form.monthlyReset">
                  <el-option v-for="v in monthlyResetList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 20px; text-align: right">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirmAdd">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  gradesList,
  packagesAdd,
  packagesUpdate,
  packagesList,
  packagesDelete,
  packagesDetail
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
      gradesList: [],
      packageTypeList: [
        { id: "VOICE", name: "语音" },
        { id: "VIDEO", name: "视频" }
      ],
      durationTypeList: [
        { id: "MONTHLY", name: "按月" },
        { id: "ONETIME", name: "一次性" }
      ],
      monthlyResetList: [
        { id: true, name: "是" },
        { id: false, name: "否" }
      ],
      form: {
        tenantId: "",
        schoolId: "",
        gradeId: "",
        packageName: "",
        packageType: "",
        basePrice: "",
        startTime: "",
        endTime: "",
        description: "",
        usageRules: "",
        sortOrder: "",
        durationType: "",
        monthlyReset: false,
        voiceCallMinutes: 0,
        videoCallMinutes: 0
      },
      linkRules: {
        tenantId: [{ required: true, message: "必填项", trigger: "blur" }],
        gradeId: [{ required: true, message: "必填项", trigger: "blur" }],
        packageName: [{ required: true, message: "必填项", trigger: "blur" }],
        packageType: [{ required: true, message: "必填项", trigger: "blur" }],
        basePrice: [{ required: true, message: "必填项", trigger: "blur" }],
        startTime: [{ required: true, message: "必填项", trigger: "blur" }],
        endTime: [{ required: true, message: "必填项", trigger: "blur" }],
        durationType: [{ required: true, message: "必填项", trigger: "blur" }]
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
    reset() {
      this.filterForm.name = "";
      this.filterForm.gradeId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let gradeId = this.filterForm.gradeId ? this.filterForm.gradeId : -1;
      let params = `tenantId=${this.userInfo.tenantId}&schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&gradeId=${gradeId}`;
      packagesList(params).then(res => {
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
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.dialogVisibleAdd = true;
      packagesDetail({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            this.form[key] = res.data[key];
          }
          this.form.voiceCallMinutes = res.data.packageContent.voice_call_minutes;
          this.form.videoCallMinutes = res.data.packageContent.video_call_minutes;
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
            packagesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.tenantId = this.userInfo.tenantId;
          this.form.schoolId = this.schoolId;
          packagesAdd(this.form).then(res => {
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
          packagesDelete({ id: row.id }).then(res => {
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
