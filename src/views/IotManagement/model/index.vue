<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>型号</label>
          <el-input style="width: 250px" v-model="filterForm.name"></el-input>
          <label>计量类型</label>
          <el-select style="width: 250px" v-model="filterForm.meter_type">
            <el-option v-for="v in typeList" :key="v.id" :label="v.label" :value="v.id"></el-option>
          </el-select>
          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span>列表</span>
            <div>
              <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
              <el-table-column label="型号" align="left">
                <template #default="{ row }">
                  {{ row.name }}
                </template>
              </el-table-column>
              <el-table-column label="厂商名称" align="left">
                <template #default="{ row }">
                  {{ row.manufacturer.name }}
                </template>
              </el-table-column>
              <el-table-column label="计量类型" align="left">
                <template #default="{ row }">
                  {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[row.meter_type] }}
                </template>
              </el-table-column>
              <el-table-column label="用户手册" align="left">
                <template #default="{ row }">
                  <span @click="downFile(row.manual_url)" class="download">下载</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="created_at" align="left"> </el-table-column>
              <el-table-column label="更新时间" prop="updated_at" align="left"> </el-table-column>
              <el-table-column label="操作" align="center" width="130" fixed="right">
                <template #default="scope">
                  <div class="table-btn">
                    <div @click="editRow(scope.row)">
                      <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                    </div>
                    <div @click="deleteProcess(scope.row)">
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
              v-model:page-size="page_size"
              :page-sizes="[10, 20, 50, 100, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <el-form-item label="型号名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="计量类型" prop="meter_type">
                <el-select v-model="linkRuleForm.meter_type">
                  <el-option v-for="v in typeList" :key="v.id" :label="v.label" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="厂商" prop="manufacturer_id">
                <el-select v-model="linkRuleForm.manufacturer_id">
                  <el-option v-for="v in List" :key="v.id" :label="v.name" :value="v.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="* 使用手册" prop="manual_url">
                <el-upload
                  v-if="!linkRuleForm.manual_url"
                  style="width: 100%"
                  class="upload-demo"
                  :action="activeUrl"
                  :data="{ source: 2, is_common: 1 }"
                  :headers="{ Authorization: token }"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :limit="1"
                  :show-file-list="false"
                >
                  <div class="upload-box">
                    <el-icon style="font-size: 25px; color: #cccccc"><UploadFilled /></el-icon>
                    <p>请上传手册</p>
                  </div>
                </el-upload>
                <div class="file-box" v-else>
                  <div>
                    <el-icon style="font-size: 25px; color: #cccccc"><Document /></el-icon>
                    <p>{{ linkRuleForm.file_name }}</p>
                  </div>
                  <el-icon @click="handleRemove" class="delete-icon" style="font-size: 20px; color: #f56c6c; cursor: pointer">
                    <Close />
                  </el-icon>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="23">
            <el-col :span="23">
              <div style="margin-top: 20px; text-align: right">
                <el-button @click="LinkDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmAdd">确定</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import {
  meter_modelAdd,
  meter_modelList,
  meter_modelUpdate,
  meter_modelDelete,
  manufacturerList
} from "@/api/modules/IotManagement.js";
export default {
  data() {
    return {
      filterForm: {
        name: "",
        meter_type: ""
      },
      typeList: [
        { label: "电", id: 1 },
        { label: "水", id: 2 },
        { label: "天然气", id: 3 },
        { label: "热量", id: 4 }
      ],
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      LinkDialog: false,
      List: [],
      linkRuleForm: {
        name: "",
        manual_url: "",
        file_name: "",
        manufacturer_id: "",
        meter_type: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        manufacturer_id: [{ required: true, message: "必填项" }],
        meter_type: [{ required: true, message: "必填项" }]
      },
      //上传文件
      loadFlag: false,
      localFile: ""
    };
  },
  computed: {
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/file/upload`;
      } else {
        return `/common/file/upload`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  mounted() {
    this.meter_modelList();
  },
  methods: {
    search() {
      this.meter_modelList();
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.meter_type = "";
      this.meter_modelList();
    },
    // 获取列表
    meter_modelList() {
      let str = `page=${this.page}&page_size=${this.page_size}&name=${this.filterForm.name}&meter_type=${this.filterForm.meter_type}`;
      meter_modelList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.meter_modelList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.meter_modelList();
    },
    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.manufacturerList();
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.file_name = "用户手册";
      });
    },
    addMethod() {
      this.LinkDialog = true;
      this.manufacturerList();
      delete this.linkRuleForm.id;
      this.handleRemove();
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    // 获取列表
    manufacturerList() {
      let str = `page=1&page_size=100&name=`;
      manufacturerList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.List = res.data.list;
        } else {
          this.List = [];
        }
      });
    },
    beforeAvatarUpload(file) {
      this.localFile = file;
      return true;
    },
    handleSuccess(res) {
      this.linkRuleForm.manual_url = res.data.file_url;
      this.linkRuleForm.file_name = this.localFile.name;
    },
    handleRemove() {
      this.linkRuleForm.manual_url = "";
      this.linkRuleForm.file_name = "";
    },
    confirmAdd() {
      if (!this.linkRuleForm.manual_url) {
        this.$message.warning("请上传使用手册");
        return;
      }
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            meter_modelUpdate(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.meter_modelList();
              }
            });
            return;
          }
          meter_modelAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.meter_modelList();
            }
          });
        }
      });
    },
    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          meter_modelDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.meter_modelList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    downFile(manual_url) {
      window.open(manual_url);
    }
  }
};
</script>

<style lang="scss" scoped>
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    border-radius: 10px;
    .fossil-fuel {
      position: relative;
      height: 100%;
      .filter-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0;
        margin-bottom: 10px;
        background: #ffffff;
        border-radius: 10px;
        > label {
          margin: 0 10px 0 20px;
          font-size: 14px;
          color: #4a5975;
        }
      }
      .table-box {
        height: calc(100% - 83px);
        background: #ffffff;
        border-radius: 10px;
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 20px;
          > span {
            font-size: 16px;
          }
        }
        .table-list {
          height: calc(100% - 60px);
          overflow: auto;
          .download {
            color: #3399ff;
            cursor: pointer;
          }
          .date-sort {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .super_admin {
            padding: 3px 8px;
            color: #ffffff;
            background: #0ec69a;
            border-radius: 5px;
          }
        }
      }
      .demo-pagination-block {
        position: absolute;
        right: 12px;
        bottom: 10px;
      }
    }
  }
}
.form-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 10px;
  padding: 20px;
  margin-right: 4%;
  background: #f9fafb;
  border-radius: 10px;
}
.upload-box {
  width: 707px;
  padding: 20px 0;
  text-align: center;
  background: #f9fafb;
  border: 1px solid #dee2eb;
  border-radius: 10px;
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 690px;
  height: 35px;
  padding: 0 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  > div {
    display: flex;
    align-items: center;
  }
}
</style>
