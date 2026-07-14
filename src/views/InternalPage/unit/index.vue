<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label>品种类型</label>
      <el-select style="width: 250px" v-model="filterForm.type">
        <el-option v-for="v in list" :label="v.name" :value="Number(v.id)" :key="v.id" />
      </el-select>
      <label>排放过程</label>
      <el-select style="width: 250px" v-model="filterForm.emission_process_type">
        <el-option v-for="v in processList" :label="v.name" :value="v.id" :key="v.id" />
      </el-select>

      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 因子库列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="名称" prop="name" align="left"> </el-table-column>
          <el-table-column label="品种类型" align="left">
            <template #default="{ row }">
              {{ row.type === 1 ? "能源" : "非能源" }}
            </template>
          </el-table-column>
          <el-table-column label="排放过程" align="left">
            <template #default="{ row }">
              {{ emissionObj[row.emission_process_type] }}
            </template>
          </el-table-column>
          <el-table-column label="基础单位" prop="unit_id" align="left">
            <template #default="{ row }">
              {{ row.unit.name }}
            </template>
          </el-table-column>
          <el-table-column label="密度" prop="unit_id" align="left">
            <template #default="{ row }">
              {{ row.density == 0 ? "/" : row.density + " kg/m³" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right">
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
                <div @click="bindIndustry(scope.row)">关联行业</div>
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
                  <el-option v-for="v in processList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="基础单位" prop="unit_id">
                <el-select v-model="linkRuleForm.unit_id" placeholder="请选择">
                  <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="密度(kg/m³)" prop="density">
                <el-input type="number" v-model="linkRuleForm.density"></el-input>
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
    <el-dialog v-model="bindDialog" :close-on-click-modal="false" title="关联行业" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="bindFormRef" :model="bindRuleForm" :rules="bindRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="23">
              <div style="padding: 10px; margin-bottom: 10px; background: #dee2eb; border-radius: 5px">
                <el-form-item label="已关联行业">
                  <div class="bind-box">
                    <span v-for="v in industryList" :key="v.id">{{ bindObj[v.industry_type] }}</span>
                  </div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item label="行业类型" prop="industry_type">
                <el-select v-model="bindRuleForm.industry_type">
                  <el-option
                    v-for="v in bindList"
                    :label="v.name"
                    :value="Number(v.id)"
                    :key="v.id"
                    :disabled="disableList.indexOf(v.id) > -1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="指南名称" prop="source">
                <el-input v-model="bindRuleForm.source"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="bindDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmBind">确定</el-button>
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
  factor_varieties_update,
  industry_varieties_add,
  industry_varieties_list,
  unit_list
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        name: "",
        type: "",
        emission_process_type: ""
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
      emissionObj: {
        1: "化石燃料燃烧排放",
        2: "企业净购入的电力隐含的CO2排放 ",
        3: "企业净购入的热力(热水)隐含的CO2排放",
        4: "企业净购入的热力(蒸汽)隐含的CO2排放",
        5: "熟料生产过程产生的碳排放(熟料)",
        6: "熟料生产过程产生的碳排放(非碳酸盐替代原料)",
        7: "光伏发电"
      },
      processList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      unitList: [],
      LinkDialog: false,
      linkRuleForm: {
        type: 1,
        name: "",
        emission_process_type: "",
        unit_id: "",
        density: ""
      },
      linkRules: {
        type: [{ required: true, message: "必填项" }],
        name: [{ required: true, message: "必填项" }],
        emission_process_type: [{ required: true, message: "必填项" }],
        unit_id: [{ required: true, message: "必填项" }]
      },
      //绑定
      bindRow: "",
      bindDialog: false,
      industryList: [],
      disableList: [],
      bindObj: {
        1: "水泥行业",
        2: "电解铝行业",
        3: "发电行业",
        4: "工业其他行业"
      },
      bindList: [
        { name: "水泥行业", id: 1 },
        { name: "电解铝行业", id: 2 },
        { name: "发电行业", id: 3 },
        { name: "工业其他行业", id: 4 }
      ],
      bindRuleForm: {
        industry_type: "",
        source: ""
      },
      bindRules: {
        industry_type: [{ required: true, message: "必填项" }],
        source: [{ required: true, message: "必填项" }]
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
    search() {
      this.factor_varieties_list();
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.type = "";
      this.filterForm.emission_process_type = "";
      this.factor_varieties_list();
    },
    // 获取列表
    factor_varieties_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&emission_process_type=${this.filterForm.emission_process_type}&name=${this.filterForm.name}&type=${this.filterForm.type}`;
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
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.factor_varieties_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.factor_varieties_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.unit_list();
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.unit_list();
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
          if (this.linkRuleForm.id) {
            factor_varieties_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.factor_varieties_list();
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
          factor_varieties_delete({ ids: [row.id] }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.factor_varieties_list();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    bindIndustry(row) {
      this.bindRow = row;
      this.bindDialog = true;
      this.industry_varieties_list();
      this.$nextTick(() => {
        this.$refs.bindFormRef.resetFields();
      });
    },
    // 获取列表
    industry_varieties_list() {
      let str = `variety_id=${this.bindRow.id}`;
      industry_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.industryList = res.data.list;
          this.disableList = [];
          this.industryList.map(v => {
            this.disableList.push(v.industry_type);
          });
        } else {
          this.industryList = [];
          this.disableList = [];
        }
      });
    },
    confirmBind() {
      this.$refs.bindFormRef.validate(valid => {
        if (valid) {
          this.bindRuleForm.variety_id = this.bindRow.id;
          industry_varieties_add(this.bindRuleForm).then(res => {
            if (res.code == 0) {
              this.bindDialog = false;
              this.$message.success("添加成功");
              this.factor_varieties_list();
            }
          });
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
