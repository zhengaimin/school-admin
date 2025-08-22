<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>名称/符号</label>
      <el-input style="width: 250px" v-model="filterForm.search_text"></el-input>
      <label>单位类型</label>
      <el-select style="width: 250px" v-model="filterForm.unit_type" placeholder="请选择单位类型">
        <el-option v-for="item in unittypelist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>

      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 单位列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="单位名称" prop="name" align="left"> </el-table-column>
          <el-table-column label="单位符号" prop="symbol" align="left"> </el-table-column>
          <el-table-column label="单位类型" align="left">
            <template #default="{ row }"> {{ unittypeObj[row.unit_type] }} </template>
          </el-table-column>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="14">
              <el-form-item label="单位名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="单位符号" prop="symbol">
                <el-input v-model="linkRuleForm.symbol"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="单位类型" prop="unit_type">
                <el-select v-model="linkRuleForm.unit_type" placeholder="请选择单位类型">
                  <el-option v-for="item in unittypelist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
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
import { unit_add, unit_list, unit_delete, unit_update } from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        search_text: "",
        unit_type: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      unittypelist: [
        { name: "质量", id: 1 },
        { name: "体积", id: 2 },
        { name: "能量", id: 3 },
        { name: "排放相关单位", id: 4 },
        { name: "能源强度单位", id: 5 },
        { name: "产品单位", id: 6 },
        { name: "碳汇单位", id: 7 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        symbol: "",
        unit_type: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        symbol: [{ required: true, message: "必填项" }],
        unit_type: [{ required: true, message: "必填项" }]
      }
    };
  },
  computed: {
    unittypeObj() {
      let obj = {};
      this.unittypelist.map(v => {
        obj[v.id] = v.name;
      });
      return obj;
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.unit_list();
    },
    search() {
      this.unit_list();
    },
    reset() {
      this.filterForm.search_text = "";
      this.filterForm.unit_type = "";
      this.unit_list();
    },
    // 获取列表
    unit_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&search_text=${this.filterForm.search_text}&unit_type=${this.filterForm.unit_type}`;
      unit_list(str).then(res => {
        if (res.code == 0) {
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
      this.unit_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.unit_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.id = row.id;
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
            unit_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.unit_list();
              }
            });
            return;
          }
          unit_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.unit_list();
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
          unit_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.unit_list();
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
  .bind-box {
    > span {
      margin-right: 15px;
    }
  }
}
</style>
