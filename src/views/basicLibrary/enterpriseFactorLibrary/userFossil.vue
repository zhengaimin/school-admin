<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label for="name">名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label for="code">编号</label>
      <el-input style="width: 250px" v-model="filterForm.code"></el-input>
      <el-button style="margin-left: 20px">重置</el-button>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 化石燃料排放因子库列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table border style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="equipmentList">
          <el-table-column label="编号" type="index" width="100"> </el-table-column>
          <el-table-column label="名称" prop="a1" align="center"> </el-table-column>
          <el-table-column label="计量单位" prop="a2" align="center"> </el-table-column>
          <el-table-column label="排放因子" prop="a3" align="center"> </el-table-column>
          <el-table-column label="排放因子单位" prop="a4" align="center"> </el-table-column>
          <el-table-column label="备注（排放因子来源说明）" prop="a5" align="center"> </el-table-column>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="新增" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="13">
              <el-form-item label="名称" prop="a1">
                <el-input v-model="linkRuleForm.a1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="19">
              <el-form-item label="计量单位" prop="a2">
                <el-select v-model="linkRuleForm.a2">
                  <el-option label="t" value="t" />
                  <el-option label="万Nm³" value="万Nm³" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排放因子" prop="a3">
                <el-input v-model="linkRuleForm.a3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="排放因子单位" prop="a4">
                <el-select v-model="linkRuleForm.a4">
                  <el-option label="GJ/t" value="GJ/t" />
                  <el-option label="GJ/万Nm³" value="GJ/万Nm³" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注（排放因子来源说明）" prop="a5">
                <el-input v-model="linkRuleForm.a5" type="textarea" rows="6"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="LinkDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        name: "",
        code: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      equipmentList: [],
      LinkDialog: false,
      linkRuleForm: {
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a5: ""
      },
      linkRules: {
        a1: [{ required: true, message: "必填项" }],
        a2: [{ required: true, message: "必填项" }],
        a3: [{ required: true, message: "必填项" }],
        a4: [{ required: true, message: "必填项" }]
      }
    };
  },
  methods: {
    addMethod() {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
      });
    },
    handleSizeChange(val) {
      this.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.LinkDialog = false;
          this.$message.success("添加成功");
          this.equipmentList.push(this.linkRuleForm);
        }
      });
    },
    //删除
    deleteProcess() {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.equipmentList.splice(0, 1);
          // equipment_delete({ id: row.id }).then(res => {
          //   if (res && res.code == 0) {
          //     this.$message.success("删除成功");
          //     this.getList();
          //   }
          // });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
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
    height: calc(100% - 85px);
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
</style>
