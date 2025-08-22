<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>排放过程</label>
          <el-select style="width: 200px" v-model="filterForm.emission_process_type">
            <el-option v-for="v in unitList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
          <label>因子来源</label>
          <el-select style="width: 200px" multiple collapse-tags v-model="filterForm.source_ids" @focus="searchSource">
            <el-option v-for="v in dataSource" :label="v.name" :value="v.id" :key="v.id">
              <span style="float: left">{{ v.name }}</span>
              <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                {{ v.second_category }}
              </span>
            </el-option>
          </el-select>
          <label>因子名称</label>
          <el-input style="width: 200px" v-model.trim="filterForm.variety_name" placeholder="请输入因子名称" />
          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span> 因子库列表</span>
            <div>
              <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="addMethod"> 新增企业因子 </el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
              <el-table-column label="因子名称" align="left">
                <template #default="{ row }">
                  {{ row.variety.name }}
                </template>
              </el-table-column>
              <el-table-column label="品类类型" align="left" width="90">
                <template #default="{ row }">
                  {{ varityObj[row.variety.type] }}
                </template>
              </el-table-column>
              <el-table-column label="排放过程" align="left">
                <template #default="{ row }">
                  {{ emissionObj[row.variety.emission_process_type] }}
                </template>
              </el-table-column>
              <el-table-column label="排放指南" align="left">
                <template #default="{ row }">
                  {{ row.factor_source.name }}
                  <span v-if="row.factor_source.second_category">-</span>
                  {{ row.factor_source.second_category }}
                </template>
              </el-table-column>
              <el-table-column label="因子缺省值" align="left" width="240">
                <template #default="{ row }">
                  <div v-for="v in row.factors" :key="v.key">{{ header[v.key] }}: {{ v.value }}</div>
                </template>
              </el-table-column>
              <el-table-column v-if="isEdit" label="操作" align="center" width="120" fixed="right">
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
    <!-- 新增因子 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="13">
              <el-form-item label="品种类型" prop="variety_type">
                <el-select v-model="linkRuleForm.variety_type" :disabled="linkRuleForm.id">
                  <el-option :disabled="v.id == 2" v-for="v in varityList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="品种名称" prop="variety_name">
                <el-input v-model="linkRuleForm.variety_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="排放过程" prop="emission_process_type">
                <el-select
                  v-model="linkRuleForm.emission_process_type"
                  :disabled="linkRuleForm.id"
                  @change="get_emission_process_field_list"
                >
                  <el-option v-for="v in unitList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col :span="23">
              <el-form-item label="因子来源" prop="source_id">
                <el-select v-model="linkRuleForm.source_id">
                  <el-option v-for="v in dataSource" :label="v.name" :value="Number(v.id)" :key="v.id">
                    <span style="float: left">{{ v.name }}</span>
                    <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                      {{ v.second_category }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-box" v-if="formList.length > 0">
            <div v-for="v in formList" :key="v.sort">
              <el-form-item :label="v.name">
                <el-select :disabled="linkRuleForm.id" v-if="v.field_type == 1" v-model="linkRuleForm.fieldObj[v.key]">
                  <el-option v-for="k in v.options" :label="k" :value="k" :key="k" />
                </el-select>
                <el-input v-else :placeholder="v.placeholder" v-model="linkRuleForm.fieldObj[v.key]"></el-input>
              </el-form-item>
            </div>
          </div>
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
    <!-- 历史数据 -->
    <el-dialog v-model="historyDialog" :close-on-click-modal="false" title="因子历史数据" :width="900">
      <div style="padding-left: 20px">
        <el-table :data="historyList" border>
          <el-table-column label="创建时间" prop="created_at" align="left"> </el-table-column>
          <el-table-column label="历史因子值" align="left" width="660">
            <template #default="{ row }">
              <div class="history-box">
                <div v-for="v in row.data_json" :key="v.name">{{ header[v.name] }}: {{ v.value }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row :gutter="24">
          <el-col :span="24">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="historyDialog = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { api_list } from "@/api/modules/menu.js";
import { ElMessageBox } from "element-plus";
import {
  factor_source_list,
  factor_list,
  factor_add,
  factor_update,
  factor_delete,
  emission_process_field_list,
  factor_history_list
} from "@/api/modules/basicLibrary.js";
export default {
  data() {
    return {
      buttonList: [],
      filterForm: {
        emission_process_type: 1,
        source_ids: [],
        variety_name: ""
      },
      // industry_emission_list: [],
      total: 0,
      page: 1,
      page_size: 10,
      header: {},
      tableData: [],

      //新增
      dataSource: [],
      varityObj: {
        1: "能源",
        2: "非能源"
      },
      varityList: [
        { name: "能源", id: 1 },
        { name: "非能源", id: 2 }
      ],
      bindObj: {
        1: "水泥行业",
        2: "电解铝行业",
        3: "发电行业",
        4: "工业其他行业"
      },
      emissionObj: [
        "",
        "化石燃料燃烧排放",
        "企业净购入的电力隐含的CO2排放 ",
        "企业净购入的热力(热水)隐含的CO2排放",
        "企业净购入的热力(蒸汽)隐含的CO2排放",
        "熟料生产过程产生的碳排放（熟料）",
        "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        "光伏发电"
      ],
      bindList: [
        { name: "水泥行业", id: 1 },
        { name: "电解铝行业", id: 2 },
        { name: "发电行业", id: 3 },
        { name: "工业其他行业", id: 4 }
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
        variety_type: "",
        variety_name: "",
        emission_process_type: "",
        source_id: 0,
        fieldObj: {}
      },
      linkRules: {
        variety_type: [{ required: true, message: "必填项" }],
        variety_name: [{ required: true, message: "必填项" }],
        emission_process_type: [{ required: true, message: "必填项" }],
        source_id: [{ required: true, message: "必填项" }]
      },
      formList: [],
      //历史数据
      historyDialog: false,
      headerHistory: {},
      historyList: []
    };
  },
  computed: {
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.factor_list();
      this.api_list();
    },
    api_list() {
      //获取路由地址
      let path = `path=${this.$router.currentRoute.value.fullPath}&menu_type=F&visible=0`;
      api_list(path).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            this.buttonList.push(v.title);
          });
        } else {
          this.buttonList = [];
        }
      });
    },
    search() {
      this.factor_list();
    },
    reset() {
      this.filterForm.emission_process_type = 1;
      this.filterForm.source_ids = [];
      this.filterForm.variety_name = "";
      this.factor_list();
    },
    // 获取列表
    factor_list() {
      let source_ids_str = this.filterForm.source_ids.join(",");
      let str = `model_type=1&page=${this.page}&page_size=${this.page_size}&emission_process_type=${this.filterForm.emission_process_type}&source_ids=${source_ids_str}&variety_name=${this.filterForm.variety_name}`;
      factor_list(str).then(res => {
        if (res.code == 0) {
          this.header = {};
          res.data.header.map(v => {
            this.header[v.key] = v.name;
          });
          res.data.list.map(v => {
            if (v.factor_now && v.factor_now.data_json) {
              let jsonList = [];
              for (let key in JSON.parse(v.factor_now.data_json)) {
                if (key != "ff_net_consumption") {
                  jsonList.push({
                    name: key,
                    value: JSON.parse(v.factor_now.data_json)[key]
                  });
                }
              }
              v.data_json = jsonList;
            }
          });
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.factor_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.factor_list();
    },
    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.searchSource();
      this.formList = [];
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.variety_type = row.variety.type;
        this.linkRuleForm.variety_name = row.variety.name;
        this.linkRuleForm.emission_process_type = row.variety.emission_process_type;
        this.get_emission_process_field_list();
      });
    },
    addMethod() {
      this.LinkDialog = true;
      this.searchSource();
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
        this.formList = [];
        this.linkRuleForm.fieldObj = {};
      });
    },
    //获取指南-排放
    searchSource() {
      factor_source_list(`model_type=1`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.dataSource = res.data.list;
        } else {
          this.dataSource = [];
        }
      });
    },
    //获取排放过程表头字段
    get_emission_process_field_list() {
      emission_process_field_list(`emission_process_type=${this.linkRuleForm.emission_process_type}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.linkRuleForm.fieldObj = {};
          this.formList = res.data.list.filter(v => v.field_type != 2);
          this.formList.map(v => {
            // 化石燃料单位
            if (v.key == "ff_unit_of_measurement") {
              v.options = ["t", "万Nm³"];
            }
            if (v.key == "ff_low_heat_output_unit") {
              v.options = ["GJ/t", "GJ/万Nm³"];
            }
            if (v.key == "ff_standard_coal_factor_unit") {
              v.options = ["tce/t", "tce/万Nm³"];
            }
            // 电力单位
            if (v.key == "npe_electric_power_unit") {
              v.options = ["MWh"];
            }
            if (v.key == "npe_carbon_emission_factor_unit") {
              v.options = ["tCO₂/MWh"];
            }
            if (v.key == "npe_standard_coal_factor_unit") {
              v.options = ["tce/MWh"];
            }
            //热力单位
            if (v.key == "nphw_carbon_emission_factor_unit") {
              v.options = ["tCO₂/GJ"];
            }
            if (v.key == "nphw_standard_coal_factor_unit") {
              v.options = ["kgce/MJ"];
            }
            if (v.key == "nps_carbon_emission_factor_unit") {
              v.options = ["tCO₂/GJ"];
            }
            if (v.key == "nps_standard_coal_factor_unit") {
              v.options = ["kgce/MJ"];
            }
          });

          if (this.linkRuleForm.id) {
            this.linkRuleForm.factors.map(v => {
              this.linkRuleForm.fieldObj[v.key] = v.value;
            });
          } else {
            this.formList.map(v => {
              // 化石燃料单位
              if (v.key == "ff_unit_of_measurement") {
                this.linkRuleForm.fieldObj[v.key] = "t";
              }
              if (v.key == "ff_low_heat_output_unit") {
                this.linkRuleForm.fieldObj[v.key] = "GJ/t";
              }
              if (v.key == "ff_standard_coal_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "tce/t";
              }
              // 电力单位
              if (v.key == "npe_electric_power_unit") {
                this.linkRuleForm.fieldObj[v.key] = "MWh";
              }
              if (v.key == "npe_carbon_emission_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "tCO₂/MWh";
              }
              if (v.key == "npe_standard_coal_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "tce/MWh";
              }
              //热力单位
              if (v.key == "nphw_carbon_emission_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "tCO₂/GJ";
              }
              if (v.key == "nphw_standard_coal_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "kgce/MJ";
              }
              if (v.key == "nps_carbon_emission_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "tCO₂/GJ";
              }
              if (v.key == "nps_standard_coal_factor_unit") {
                this.linkRuleForm.fieldObj[v.key] = "kgce/MJ";
              }
            });
          }
        } else {
          this.formList = [];
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.fields = [];
          for (let key in this.linkRuleForm.fieldObj) {
            this.linkRuleForm.fields.push({
              key: key,
              value: this.linkRuleForm.fieldObj[key]
            });
          }
          if (this.linkRuleForm.id) {
            factor_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.factor_list();
              }
            });
            return;
          }
          factor_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.factor_list();
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
          factor_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.factor_list();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //历史数据
    getHistory(row) {
      this.historyDialog = true;
      factor_history_list(`industry_varieties_id=${row.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.headerHistory = {};
          res.data.header.map(v => {
            this.headerHistory[v.key] = v.name;
          });
          res.data.list.map(v => {
            if (v.data_json) {
              let jsonList = [];
              for (let key in JSON.parse(v.data_json)) {
                if (key != "ff_net_consumption") {
                  jsonList.push({
                    name: key,
                    value: JSON.parse(v.data_json)[key]
                  });
                }
              }
              v.data_json = jsonList;
            }
          });
          this.historyList = res.data.list.filter(v => v.name != "ff_net_consumption");
        } else {
          this.historyList = [];
        }
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
.history-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0 10px;
}
</style>
