<template>
  <div class="table-box">
    <div class="filter-box">
      <label for="name">设备组名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="name">启用状态</label>
      <el-select style="width: 250px" v-model="filterForm.status">
        <el-option v-for="v in statusList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <label for="name">设备组</label>
      <el-select style="width: 250px" v-model="filterForm.deviceGroupId">
        <el-option v-for="v in devicegroupsList" :key="v.id" :label="v.name" :value="v.id"></el-option>
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="fetchTenantList">查询</el-button>
    </div>
    <div class="btn-box">
      <span>
        <el-button :disabled="!(multipleSelection.length > 0)" type="warning" class="search-btn" @click="updateStatus('restart')">
          <el-icon style="margin-right: 5px"><Loading /></el-icon> 重启
        </el-button>
        <el-button :disabled="!(multipleSelection.length > 0)" type="danger" class="search-btn" @click="updateStatus('shutdown')">
          <el-icon style="margin-right: 5px"><TurnOff /></el-icon> 关机
        </el-button>
        <el-button
          :disabled="!(multipleSelection.length > 0)"
          type="success"
          class="search-btn"
          @click="updateStatus('update_config')"
        >
          更新配置
        </el-button>
        <el-button
          :disabled="!(multipleSelection.length > 0)"
          type="success"
          class="search-btn"
          @click="updateStatus('sync_user_old')"
        >
          同步人员信息
        </el-button>
        <el-button :disabled="!(multipleSelection.length > 0)" type="success" class="search-btn" @click="bindTag">
          绑定标签
        </el-button>
      </span>
      <div>
        <el-button type="primary" class="search-btn" @click="openAddDialog"> 新增 </el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table class="my-custom-table" border :data="carbonCk_list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="学校" prop="schoolName"> </el-table-column>
        <el-table-column label="设备名称" prop="name" width="160"> </el-table-column>
        <el-table-column label="终端Key" prop="terminalKey"> </el-table-column>
        <el-table-column label="设备SN号" prop="terminalSn"> </el-table-column>
        <el-table-column label="设备MAC地址" prop="terminalMac"> </el-table-column>
        <el-table-column label="设备地址" prop="location"> </el-table-column>
        <el-table-column label="设备组" prop="deviceGroupName"> </el-table-column>
        <el-table-column label="已绑定标签" prop=""> </el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="{ row }">
            {{ ["离线", "在线"][row.status] }}
          </template>
        </el-table-column>
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
    <!-- 绑定标签 -->
    <el-dialog v-model="dialogtag" :close-on-click-modal="false" title="绑定标签" :width="600">
      <div style="padding-left: 20px">
        <el-form ref="taglinkFormRef" :model="tagform" :rules="taglinkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="标签" prop="deviceTagId">
                <el-select v-model="tagform.deviceTagId">
                  <el-option v-for="v in devicetagsListSelect" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="dialogtag = false">取消</el-button>
              <el-button type="primary" @click="confirmAddtag">确定</el-button>
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
  devicesDetail,
  devicesbatchcontrol,
  devicetagsListSelect,
  devicetagsbatchassign
} from "@/api/modules/InternalPage.js";
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        status: "",
        deviceGroupId: ""
      },
      statusList: [
        { id: "1", name: "在线" },
        { id: "0", name: "离线" }
      ],
      //新增权限系统
      dialogVisibleAdd: false,
      devicegroupsList: [],
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
      pageSize: 10,
      multipleSelection: [],
      // 绑定标签
      dialogtag: false,
      devicetagsListSelect: [],
      tagform: {
        deviceTagId: ""
      },
      taglinkRules: {
        deviceTagId: [{ required: true, message: "必填项", trigger: "blur" }]
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
          this.getdevicegroupsList();
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getdevicegroupsList();
    this.fetchTenantList();
  },
  methods: {
    // 设备组
    getdevicegroupsList() {
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
      this.filterForm.deviceGroupId = "";
      this.fetchTenantList();
    },
    fetchTenantList() {
      let status = this.filterForm.status ? this.filterForm.status : -1;
      let deviceGroupId = this.filterForm.deviceGroupId ? this.filterForm.deviceGroupId : -1;
      let params = `schoolId=${this.schoolId}&page=${this.page}&pageSize=${this.pageSize}&name=${this.filterForm.name}&status=${status}&terminalSn=&deviceGroupId=${deviceGroupId}`;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateStatus(val) {
      let deviceIds = [];
      this.multipleSelection.map(v => {
        deviceIds.push(v.id);
      });
      devicesbatchcontrol({ deviceIds: deviceIds, action: val }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    bindTag() {
      this.dialogtag = true;
      this.tagform.deviceTagId = "";
      this.getdevicetagsListSelect();
    },
    getdevicetagsListSelect() {
      let params = `schoolId=${this.schoolId}&status=-1`;
      devicetagsListSelect(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.devicetagsListSelect = res.data.list;
        } else {
          this.devicetagsListSelect = [];
        }
      });
    },
    confirmAddtag() {
      this.$refs.taglinkFormRef.validate(valid => {
        if (valid) {
          let deviceIds = [];
          this.multipleSelection.map(v => {
            deviceIds.push(v.id);
          });
          devicetagsbatchassign({ deviceIds: deviceIds, deviceTagId: this.tagform.deviceTagId }).then(res => {
            if (res.code == 0) {
              let msg = `成功绑定${res.data.successCount}, 失败${res.data.failCount}`;
              this.$message.success(msg);
              this.dialogtag = false;
              this.fetchTenantList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
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

    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
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
