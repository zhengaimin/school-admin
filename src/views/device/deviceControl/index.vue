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
      <span>公话管理</span>
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
        <el-table-column label="设备名称" prop="name" width="160"> </el-table-column>
        <el-table-column label="终端Key" prop="terminalKey"> </el-table-column>
        <el-table-column label="设备SN号" prop="terminalSn"> </el-table-column>
        <el-table-column label="设备MAC地址" prop="terminalMac"> </el-table-column>
        <el-table-column label="设备地址" prop="location"> </el-table-column>
        <el-table-column label="设备组" prop="maxDeviceCount"> </el-table-column>
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
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="form" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="终端Key" prop="terminalKey">
                <el-input v-model="form.terminalKey"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备SN号" prop="terminalSn">
                <el-input v-model="form.terminalSn"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="设备MAC地址" prop="terminalMac">
                <el-input v-model="form.terminalMac"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="设备组" prop="deviceGroupId">
                <el-select v-model="form.deviceGroupId">
                  <el-option v-for="v in devicegroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="设备地址" prop="location">
                <el-input v-model="form.location"></el-input>
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
  devicegroupsList,
  devicesAdd,
  devicesUpdate,
  devicesList,
  devicesDelete,
  devicesDetail
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
        terminalKey: "",
        terminalSn: "",
        terminalMac: "",
        location: "",
        deviceGroupId: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalKey: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalSn: [{ required: true, message: "必填项", trigger: "blur" }],
        terminalMac: [{ required: true, message: "必填项", trigger: "blur" }]
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
          this.devicegroupsList();
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.devicegroupsList();
    this.fetchTenantList();
  },
  methods: {
    devicegroupsList() {
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&name=&status=-1`;
      devicegroupsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.devicegroupsList = res.data.list;
        } else {
          this.devicegroupsList = [];
        }
      });
    },

    reset() {
      this.filterForm.name = "";
      this.filterForm.status = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let params = `schoolId=${this.schoolId}&page=1&pageSize=200&name=&status=-1`;
      devicesList(params).then(res => {
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
      devicesDetail({ id: row.id }).then(res => {
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
        schoolId: this.schoolId,
        id: row.id,
        status: row.status,
        isVoipGroup: row.isVoipGroup
      };
      devicesUpdate(params).then(res => {
        if (res.code == 0) {
          this.$message.success("状态修改成功");
          this.fetchTenantList();
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          // this.form.schoolId = this.schoolId;
          if (this.form.id) {
            devicesUpdate(this.form).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("编辑成功");
                this.fetchTenantList();
              }
            });
            return;
          }
          devicesAdd(this.form).then(res => {
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
          devicesDelete({ id: row.id }).then(res => {
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
