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
        <el-table
          @selection-change="handleSelectionChange"
          style="width: 100%; height: calc(100% - 50px)"
          class="my-custom-table"
          :data="tableData"
        >
          <!-- <el-table-column label="编号" type="index" width="100"> </el-table-column> -->
          <el-table-column type="selection" width="55" />
          <el-table-column label="名称" prop="fuel_name" align="left" width="130"> </el-table-column>
          <el-table-column label="计量单位" align="center" width="100">
            <template #default="{ row }">
              {{ row.emission_process_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="低位发热量" prop="low_calorific_value" align="center" width="100"> </el-table-column>
          <el-table-column label="低位发热量单位" align="center" width="140">
            <template #default="{ row }">
              {{ row.low_calorific_value_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="单位热值含碳量" prop="unit_heat_value_carbon_content" align="center" width="190">
          </el-table-column>
          <el-table-column label="单位热值含碳量单位" align="center" width="160">
            <template #default="{ row }">
              {{ row.unit_heat_value_carbon_content_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="燃料碳氧化率" prop="fuel_carbon_oxidation_rate" align="center" width="130"> </el-table-column>
          <el-table-column label="单位碳排放因子" prop="unit_carbon_emission_factor" align="center" width="160">
          </el-table-column>
          <el-table-column label="碳排放因子单位" align="center" width="160">
            <template #default="{ row }">
              {{ row.carbon_emission_factor_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="指标系数" prop="coal_equivalent_factor" align="center" width="100"> </el-table-column>
          <el-table-column label="折标系数单位" align="center" width="160">
            <template #default="{ row }">
              {{ row.coal_equivalent_factor_unit.name }}
            </template>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="新增" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="13">
              <el-form-item label="品种类型" prop="type">
                <el-select v-model="linkRuleForm.type">
                  <el-option v-for="v in list" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="品种名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排放过程" prop="emission_process_type">
                <el-select v-model="linkRuleForm.emission_process_type">
                  <el-option v-for="v in unitList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="基础单位" prop="base_unit">
                <el-input v-model="linkRuleForm.base_unit"></el-input>
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
  factor_varieties_add,
  factor_varieties_list,
  factor_varieties_delete,
  factor_varieties_update
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  props: {
    nodeObj: {
      type: Object
    },
    treeNode: {
      type: Object
    }
  },
  data() {
    return {
      filterForm: {
        name: "",
        code: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      list: [
        { name: "能源", id: 1 },
        { name: "非能源", id: 2 }
      ],
      unitList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        type: 1,
        name: "",
        emission_process_type: "",
        base_unit: ""
      },
      linkRules: {
        type: [{ required: true, message: "必填项" }],
        name: [{ required: true, message: "必填项" }],
        emission_process_type: [{ required: true, message: "必填项" }],
        base_unit: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.factor_varieties_list();
    },
    // 获取列表
    factor_varieties_list() {
      let str = `page=${this.page}&page_size=${this.page_size}`;
      factor_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },

    handleSizeChange(val) {
      this.page_size = val;
      this.factor_varieties_list(this.nodeObj.parent.data.id);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.factor_varieties_list(this.nodeObj.parent.data.id);
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;

      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.name = row.fuel_name;
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.linkRuleForm.industry_type = Number(this.nodeObj.parent.data.id);
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            factor_varieties_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.factor_varieties_list(this.nodeObj.parent.data.id);
              }
            });
            return;
          }
          factor_varieties_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.factor_varieties_list();
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
          factor_varieties_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.factor_varieties_list(this.nodeObj.parent.data.id);
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
