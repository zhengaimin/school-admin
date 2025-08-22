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
        <span> 净购入热水排放因子库列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
          <el-button type="primary" class="search-btn" @click="water_choice"> 复制到企业因子库 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table
          @selection-change="handleSelectionChange"
          style="width: 100%; height: calc(100% - 50px)"
          class="my-custom-table"
          :data="tableData"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="热水质量单位" align="left">
            <template #default="{ row }">
              {{ row.hot_water_quality_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="热水温度单位" align="center">
            <template #default="{ row }">
              {{ row.hot_water_temperature_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="热水热量单位" align="center">
            <template #default="{ row }">
              {{ row.hot_water_heat_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="单位碳排放因子" prop="unit_carbon_emission_factor" align="center"> </el-table-column>
          <el-table-column label="排放因子单位" align="center">
            <template #default="{ row }">
              {{ row.carbon_emission_factor_unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="折标系数" prop="coal_equivalent_factor" align="center"> </el-table-column>
          <el-table-column label="折标系数单位" align="center">
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="新增" :width="1000">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="15">
              <el-form-item label="行业类型" prop="industry_type">
                <el-select v-model="linkRuleForm.industry_type" :disabled="true">
                  <el-option v-for="v in list" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="热水质量单位" prop="hot_water_quality_unit_id">
                <el-select v-model="linkRuleForm.hot_water_quality_unit_id" @focus="get_unit_list">
                  <el-option v-for="v in unitList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="热水温度单位" prop="hot_water_temperature_unit_id">
                <el-select v-model="linkRuleForm.hot_water_temperature_unit_id" @focus="get_sub_list(6)">
                  <el-option v-for="v in subObj[6]" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="热水热量单位" prop="hot_water_heat_unit_id">
                <el-select v-model="linkRuleForm.hot_water_heat_unit_id" @focus="get_sub_list(9)">
                  <el-option v-for="v in subObj[9]" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="单位碳排放因子" prop="unit_carbon_emission_factor">
                <el-input type="number" v-model.number="linkRuleForm.unit_carbon_emission_factor"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="排放因子单位" prop="carbon_emission_factor_unit_id">
                <el-select v-model="linkRuleForm.carbon_emission_factor_unit_id" @focus="get_sub_list(4)">
                  <el-option v-for="v in subObj[4]" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="折标煤系数" prop="coal_equivalent_factor">
                <el-input type="number" v-model.number="linkRuleForm.coal_equivalent_factor"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="折标煤系数单位" prop="coal_equivalent_factor_unit_id">
                <el-select v-model="linkRuleForm.coal_equivalent_factor_unit_id" @focus="get_sub_list(5)">
                  <el-option v-for="v in subObj[5]" :label="v.name" :value="Number(v.id)" :key="v.id" />
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
import { unit_list } from "@/api/modules/InternalPage.js";
import { water_add, water_list, water_delete, water_update, water_choice } from "@/api/modules/basicLibrary.js";
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
      list: [
        { name: "水泥行业", id: 1 },
        { name: "电解铝行业", id: 2 },
        { name: "发电行业", id: 3 },
        { name: "工业其他行业", id: 4 }
      ],
      unitList: [],
      subObj: {},
      LinkDialog: false,
      linkRuleForm: {
        mode: 1,
        industry_type: "",
        hot_water_quality_unit_id: "",
        hot_water_temperature_unit_id: "",
        hot_water_heat_unit_id: "",
        unit_carbon_emission_factor: "",
        carbon_emission_factor_unit_id: "",
        coal_equivalent_factor: "",
        coal_equivalent_factor_unit_id: ""
      },
      linkRules: {
        industry_type: [{ required: true, message: "必填项" }],
        hot_water_quality_unit_id: [{ required: true, message: "必填项" }],
        hot_water_temperature_unit_id: [{ required: true, message: "必填项" }],
        hot_water_heat_unit_id: [{ required: true, message: "必填项" }],
        unit_carbon_emission_factor: [{ required: true, message: "必填项" }],
        carbon_emission_factor_unit_id: [{ required: true, message: "必填项" }],
        coal_equivalent_factor_unit_id: [{ required: true, message: "必填项" }]
      },
      multipleSelection: []
    };
  },
  methods: {
    initPage(id) {
      this.water_list(id);
    },
    // 获取列表
    water_list(id) {
      let str = `mode=1&industry_type=${id}&page=${this.page}&page_size=${this.page_size}`;
      water_list(str).then(res => {
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
      this.water_list(this.nodeObj.parent.data.id);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.water_list(this.nodeObj.parent.data.id);
    },
    //获取全部基础计量单位
    get_unit_list() {
      unit_list(`parent_id=-1`).then(res => {
        if (res.code == 0) {
          this.unitList = res.data.list;
        } else {
          this.unitList = [];
        }
      });
    },
    //1:计量单位 2:发热量单位 3:单位热值含碳量 4:碳排放因子单位 5:折标系数单位
    get_sub_list(val) {
      unit_list(`parent_id=${this.linkRuleForm.hot_water_quality_unit_id}&unit_type=${val}`).then(res => {
        if (res.code == 0) {
          this.subObj[val] = res.data.list;
        } else {
          this.subObj[val] = [];
        }
      });
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.get_unit_list();
      this.get_sub_list(6);
      this.get_sub_list(9);
      this.get_sub_list(4);
      this.get_sub_list(5);
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
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
            water_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.water_list(this.nodeObj.parent.data.id);
              }
            });
            return;
          }
          water_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.water_list(this.nodeObj.parent.data.id);
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
          water_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.water_list(this.nodeObj.parent.data.id);
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    water_choice() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择需要转移的数据");
        return;
      }
      let ids = [];
      this.multipleSelection.map(v => {
        ids.push(v.id);
      });
      water_choice({ ids: ids }).then(res => {
        if (res.code == 0) {
          this.$message.success("复制成功");
        }
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
    height: calc(100% - 82px);
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
