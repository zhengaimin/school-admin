<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>厂商名称</label>
          <el-input style="width: 250px" v-model="filterForm.name"></el-input>
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
              <el-table-column label="厂商名称" align="left">
                <template #default="{ row }">
                  {{ row.name }}
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
              <el-form-item label="厂商名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
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
import { manufacturerAdd, manufacturerList, manufacturerUpdate, manufacturerDelete } from "@/api/modules/IotManagement.js";
export default {
  data() {
    return {
      filterForm: {
        name: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      LinkDialog: false,
      linkRuleForm: {
        name: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }]
      }
    };
  },

  mounted() {
    this.manufacturerList();
  },
  methods: {
    search() {
      this.manufacturerList();
    },
    reset() {
      this.filterForm.name = "";
      this.manufacturerList();
    },
    // 获取列表
    manufacturerList() {
      let str = `page=${this.page}&page_size=${this.page_size}&name=${this.filterForm.name}`;
      manufacturerList(str).then(res => {
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
      this.manufacturerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.manufacturerList();
    },
    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            manufacturerUpdate(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.manufacturerList();
              }
            });
            return;
          }
          manufacturerAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.manufacturerList();
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
          manufacturerDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.manufacturerList();
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
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .left {
    width: 300px;
    min-width: 100px;
    height: 100%;
    margin-right: 20px;
    overflow: auto;
    resize: horizontal;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      color: #1f304c;
      border-bottom: 1px solid #f4f6fa;
      > div {
        display: flex;
        align-items: center;
      }
    }
    .bottom-tree-box {
      height: calc(100% - 75px);
      padding: 10px 20px;
      overflow: auto;
      .slot-tree-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        > div {
          display: flex;
          align-items: center;
          width: 85%;
          height: 100%;
          height: 35px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > span {
          font-size: 14px;
        }
      }
      .popover-box {
        > div {
          height: 35px;
          font-size: 14px;
        }
      }
      :deep(.el-tree-node__content) {
        height: 30px !important;
      }
    }
  }
  :deep(.el-popover.el-popper) {
    min-width: 30px !important;
  }
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
:deep(.zm-tree-org) {
  background: none;
}
:deep(.tree-org-node__content) {
  padding: 0;
  border-radius: 10px;
}
.tree-org-node__text {
  padding: 0;
  > div {
    box-sizing: border-box;
    width: 190px;
    height: 63px;
    padding: 0 20px 0 60px;
    overflow: hidden;
    line-height: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: url("@/assets/images/org/cp2.svg") no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
