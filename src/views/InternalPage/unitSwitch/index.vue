<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>转换类型</label>
      <el-select style="width: 250px" v-model="filterForm.change_type" placeholder="请选择单位类型">
        <el-option v-for="item in unittypelist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>

      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span>单位列表 <span style="font-size: 12px">（源单位 = 目标单位 * 转换系数）</span></span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="源单位" align="left">
            <template #default="{ row }"> {{ row.source_unit.name }}({{ row.source_unit.symbol }}) </template>
          </el-table-column>
          <el-table-column label="目标单位" align="left">
            <template #default="{ row }"> {{ row.target_unit.name }}({{ row.target_unit.symbol }}) </template>
          </el-table-column>
          <el-table-column label="转换系数" prop="conversion_factor" align="left"> </el-table-column>
          <el-table-column label="转换类型" align="left">
            <template #default="{ row }"> {{ unittypeObj[row.change_type] }} </template>
          </el-table-column>
          <el-table-column label="密度(kg/m³)" prop="density" align="left"> </el-table-column>
          <el-table-column label="备注" prop="notes" align="left"> </el-table-column>
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
              <el-form-item label="密度(kg/m³)" prop="density">
                <el-input type="number" v-model="linkRuleForm.density"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="转换类型" prop="change_type">
                <el-select v-model="linkRuleForm.change_type" placeholder="请选择">
                  <el-option v-for="item in unittypelist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="源单位" prop="source_unit_id">
                <el-select v-model="linkRuleForm.source_unit_id" placeholder="请选择">
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="目的单位" prop="target_unit_id">
                <el-select v-model="linkRuleForm.target_unit_id" placeholder="请选择">
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="转换系数" prop="conversion_factor">
                <el-input type="number" v-model="linkRuleForm.conversion_factor"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="notes">
                <el-input type="textarea" v-model="linkRuleForm.notes"></el-input>
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
import {
  unit_change_add,
  unit_change_list,
  unit_change_delete,
  unit_change_update,
  unit_list
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        search_text: "",
        change_type: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      unittypelist: [
        { name: "通用转换类型", id: 1 },
        { name: "质量体积转换", id: 2 }
      ],
      unitList: [],
      LinkDialog: false,
      linkRuleForm: {
        density: "",
        change_type: "",
        source_unit_id: "",
        target_unit_id: "",
        conversion_factor: "",
        notes: ""
      },
      linkRules: {
        change_type: [{ required: true, message: "必填项" }],
        source_unit_id: [{ required: true, message: "必填项" }],
        target_unit_id: [{ required: true, message: "必填项" }],
        conversion_factor: [{ required: true, message: "必填项" }]
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
      this.unit_change_list();
    },
    search() {
      this.unit_change_list();
    },
    reset() {
      this.filterForm.search_text = "";
      this.filterForm.change_type = "";
      this.unit_change_list();
    },
    // 获取列表
    unit_change_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&change_type=${this.filterForm.change_type}`;
      unit_change_list(str).then(res => {
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
      this.unit_change_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.unit_change_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.unit_list();
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.id = row.id;
      });
    },
    addMethod() {
      this.LinkDialog = true;
      this.unit_list();
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    unit_list() {
      let str = `page=1&page_size=200`;
      unit_list(str).then(res => {
        if (res.code == 0) {
          this.unitList = res.data.list;
        } else {
          this.unitList = [];
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.density = this.linkRuleForm.density ? this.linkRuleForm.density : 0;
          if (this.linkRuleForm.id) {
            unit_change_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.unit_change_list();
              }
            });
            return;
          }
          unit_change_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.unit_change_list();
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
          unit_change_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.unit_change_list();
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
