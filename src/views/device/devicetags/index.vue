<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">标签名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span> 设备标签 </span>
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
      <el-table class="my-custom-table" :data="carbonCk_list" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="标签名称" prop="name" width="150"> </el-table-column>
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="排序" prop="sort" width="140"> </el-table-column>
        <el-table-column label="描述" prop="description" width="220"> </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="170"> </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="170"> </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="scope">
            <div class="table-btn">
              <div @click="openDialogControl(scope.row.id)">控制设备</div>
              <div @click="controlClose(scope.row.id)">设置开关机</div>
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
              <el-form-item label="标签名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="排序" prop="sort">
                <el-input type="number" v-model.number="form.sort"></el-input>
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
    <!-- 批量控制 -->
    <el-dialog v-model="dialogtag" :close-on-click-modal="false" title="设置" :width="600">
      <div style="padding-left: 20px">
        <el-form
          v-if="failList == 0"
          ref="taglinkFormRef"
          :model="tagform"
          :rules="taglinkRules"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-row>
            <el-col :span="23">
              <el-form-item label="操作" prop="action">
                <el-select v-model="tagform.action">
                  <el-option v-for="v in controlList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-if="failList.length > 0">
          <div style="font-size: 14px; color: red">操作失败机器</div>
          <el-table class="my-custom-table" :data="failList">
            <el-table-column label="设备名称" prop="deviceName"> </el-table-column>
            <el-table-column label="状态" prop="status"> </el-table-column>
            <el-table-column label="描述" prop="describe"> </el-table-column>
          </el-table>
        </div>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogtag = false">取消</el-button>
              <el-button v-if="failList == 0" type="primary" @click="controlControl">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 开关机 -->
    <el-dialog v-model="dialogClose" :close-on-click-modal="false" title="开关机" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRefclose" :model="formclose" :rules="linkRulesclose" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="开机时间" prop="powerOnTime">
                <el-time-select v-model="formclose.powerOnTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="关机时间" prop="powerOffTime">
                <el-time-select v-model="formclose.powerOffTime" style="width: 100%" start="00:00" step="00:10" end="23:59" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogClose = false">取消</el-button>
              <el-button v-if="failList == 0" type="primary" @click="closeControl">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  devicetagsAdd,
  devicetagsUpdate,
  devicetagsList,
  devicetagsDelete,
  devicetagsDetail,
  devicetagsbatchcontrol,
  devicetagsbatchschedule
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
      //新增
      dialogVisibleAdd: false,
      form: {
        schoolId: "",
        name: "",
        sort: 1,
        schoolId: "",
        description: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      //  列表
      carbonCk_list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      // 批量控制
      dialogtag: false,
      failList: [],
      controlList: [
        { id: "restart", name: "重启" },
        { id: "shutdown", name: "关机" },
        { id: "update_config", name: "更新配置" },
        { id: "sync_user", name: "更新人员数据" },
        { id: "clear_user", name: "清除人员数据" },
        { id: "count_user", name: "查询人员数据" }
      ],
      tagform: {
        deviceTagId: "",
        action: ""
      },
      taglinkRules: {
        action: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      multipleSelection: [],
      // 开关机
      dialogClose: false,
      formclose: {
        deviceTagId: "",
        powerOnTime: "",
        powerOffTime: ""
      },
      linkRulesclose: {
        powerOnTime: [{ required: true, message: "必填项", trigger: "blur" }],
        powerOffTime: [{ required: true, message: "必填项", trigger: "blur" }]
      }
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
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}`;
      devicetagsList(params).then(res => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openDialogControl(id) {
      this.dialogtag = true;
      this.failList = [];
      this.tagform.deviceTagId = id;
      this.tagform.action = "";
    },
    controlControl() {
      this.$refs.taglinkFormRef.validate(valid => {
        if (valid) {
          devicetagsbatchcontrol(this.tagform).then(res => {
            if (res.code == 0 && res.data.failCount != 0) {
              this.failList = res.data.failList;
              return;
            } else if (res.code == 0 && res.data.failCount == 0) {
              this.$message.success("操作成功");
              this.dialogtag = false;
            }
          });
        }
      });
    },
    // 开关机
    controlClose(id) {
      this.dialogClose = true;
      this.formclose.deviceTagId = id;
    },
    closeControl() {
      this.$refs.linkFormRefclose.validate(valid => {
        if (valid) {
          devicetagsbatchschedule(this.formclose).then(res => {
            if (res.code == 0) {
              let msg = `成功操作${res.data.successCount}台，失败${res.data.failCount}台`;
              this.$message.success(msg);
              this.dialogClose = false;
            }
          });
        }
      });
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
      devicetagsDetail({ id: row.id }).then(res => {
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
        status: row.status
      };
      devicetagsUpdate(params).then(res => {
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
            devicetagsUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          this.form.schoolId = this.schoolId;
          devicetagsAdd(this.form).then(res => {
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
          devicetagsDelete({ id: row.id }).then(res => {
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
