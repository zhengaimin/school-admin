<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label for="name">公司名称</label>
      <span>{{ userInfo.tenant_name }}</span>
      <label for="name">年度</label>
      <el-date-picker
        @change="changeYear"
        v-model="year"
        type="year"
        format="YYYY"
        value-format="YYYY"
        placeholder="请选择年份"
      />
    </div>
    <div class="content">
      <h1>
        <span> 综合能源预算量设置 </span>
      </h1>
      <div class="set-box">
        <h2>
          全年综合能源预算量：
          <span>
            {{ companyObj.annual_energy_budget }}
            <span>/tce</span>
          </span>
        </h2>
      </div>
      <div class="month-box" v-if="companyObj.budget_dimension == 2">
        <div v-for="item in month" :key="item.key">
          <p>{{ item.name }}</p>
          <el-input :disabled="!isEdit" min="0" oninput="if(value<0)value=0" type="number" v-model.number="item.value">
            <template #append>%</template>
          </el-input>
        </div>
      </div>
      <div style="padding: 0 20px 20px; text-align: right" v-if="companyObj.budget_dimension == 2">
        <el-button :disabled="!isEdit" type="primary" style="width: 100px" @click="addMonthBudget">提交</el-button>
      </div>
    </div>
    <div class="content" style="margin-top: 20px">
      <h1>
        <div>
          <span v-for="v in sourceList" :key="v.id" @click="selectSource(v.id, v.name)" :class="{ active: v.id == variety_id }">
            {{ v.name }}
          </span>
        </div>
      </h1>
      <div class="set-box">
        <h2>
          {{ variety_name }}全年综合能源预算量：
          <el-input
            :disabled="!isEdit"
            min="0"
            oninput="if(value<0)value=0"
            type="number"
            v-model="year_budget_amount"
            style="width: 300px"
          >
            <template #append>%</template>
          </el-input>
          <el-button :disabled="!isEdit" type="primary" style="width: 80px; margin-left: 10px" @click="addYearBudget">
            提交
          </el-button>
        </h2>
      </div>
      <div class="month-box" v-if="companyObj.budget_dimension == 2">
        <div v-for="item in monthSource" :key="item.key">
          <p>{{ item.name }}</p>
          <el-input :disabled="!isEdit" min="0" oninput="if(value<0)value=0" type="number" v-model.number="item.value">
            <template #append>%</template>
          </el-input>
        </div>
      </div>
      <div style="padding: 0 20px 20px; text-align: right" v-if="companyObj.budget_dimension == 2">
        <el-button :disabled="!isEdit" type="primary" style="width: 100px" @click="addVarietyMonthBudget">提交</el-button>
      </div>
    </div>
    <!-- 工序能源预算 -->
    <div class="content" style="margin-top: 20px">
      <h1>
        <span> 工序能源预算量 </span>
        <span :class="['percent-box', { 'percent-box-red': warningFlag }]" v-if="productFlag == 2"> {{ budgetTips }} </span>
      </h1>
      <div class="table-box">
        <div class="table-list">
          <el-table class="my-custom-table" :data="processListTable">
            <el-table-column fixed="left" label="工序名称" prop="name"> </el-table-column>
            <el-table-column fixed="left" label="年度" :width="companyObj.budget_dimension == 1 ? '' : 140" align="center">
              <template #default="{ row }">
                <el-input
                  :disabled="!isEdit"
                  min="0"
                  max="100"
                  oninput="if(value<0)value=0"
                  type="number"
                  v-model.number="row.month_list[0]"
                  @focus="focusAction(row, 2)"
                  @blur="focusAction(row, 2)"
                >
                  <template #append>%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="left"
              label="年度总量（tce）"
              :width="companyObj.budget_dimension == 1 ? '' : 160"
              align="center"
            >
              <template #default="{ row }">
                <span v-if="row.month_list[0]">
                  {{ (companyObj.annual_energy_budget * row.month_list[0]) / 100 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-for="v in processMonthCol" :key="v.key" :label="v.name" width="120" align="center">
              <template #default="{ row }">
                <el-input
                  :disabled="!isEdit"
                  min="0"
                  oninput="if(value<0)value=0"
                  type="number"
                  v-model.number="row.month_list[v.key]"
                  @focus="focusAction(row, 2)"
                  @blur="focusAction(row, 2)"
                >
                  <template #append>%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="90">
              <template #default="{ row }">
                <el-button :disabled="!isEdit" type="primary" @click="saveProcess(row)">保存</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/modules/user";
import {
  com_budget_info,
  com_budget_monthly_save,
  com_budget_monthly_list,
  com_budget_monthly_update,
  variety_energy_year_save,
  variety_energy_month_save,
  variety_energy_list,
  process_energy_year_save,
  process_energy_month_save,
  process_energy_list
} from "@/api/modules/energyBudget.js";
import { factor_varieties_list, production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import { api_list } from "@/api/modules/menu.js";
export default {
  data() {
    return {
      buttonList: [],
      year: "",
      companyObj: {},
      monthData: [],
      month: [
        {
          name: "一月",
          key: 1,
          value: ""
        },
        {
          name: "二月",
          key: 2,
          value: ""
        },
        {
          name: "三月",
          key: 3,
          value: ""
        },
        {
          name: "四月",
          key: 4,
          value: ""
        },
        {
          name: "五月",
          key: 5,
          value: ""
        },
        {
          name: "六月",
          key: 6,
          value: ""
        },
        {
          name: "七月",
          key: 7,
          value: ""
        },
        {
          name: "八月",
          key: 8,
          value: ""
        },
        {
          name: "九月",
          key: 9,
          value: ""
        },
        {
          name: "十月",
          key: 10,
          value: ""
        },
        {
          name: "十一月",
          key: 11,
          value: ""
        },
        {
          name: "十二月",
          key: 12,
          value: ""
        }
      ],
      //能源
      monthSource: [
        {
          name: "一月",
          key: 1,
          value: ""
        },
        {
          name: "二月",
          key: 2,
          value: ""
        },
        {
          name: "三月",
          key: 3,
          value: ""
        },
        {
          name: "四月",
          key: 4,
          value: ""
        },
        {
          name: "五月",
          key: 5,
          value: ""
        },
        {
          name: "六月",
          key: 6,
          value: ""
        },
        {
          name: "七月",
          key: 7,
          value: ""
        },
        {
          name: "八月",
          key: 8,
          value: ""
        },
        {
          name: "九月",
          key: 9,
          value: ""
        },
        {
          name: "十月",
          key: 10,
          value: ""
        },
        {
          name: "十一月",
          key: 11,
          value: ""
        },
        {
          name: "十二月",
          key: 12,
          value: ""
        }
      ],
      sourceList: [],
      energy_list: [],
      variety_id: "",
      variety_name: "",
      year_budget_amount: "",
      year_budget_amount_id: "",

      // 产品能效预算
      budgetTips: "",
      productFlag: false,
      warningFlag: false,
      productList: [],
      product_energy_list: [],

      //工序能效预算
      productMonth: [
        {
          name: "一月",
          key: 1,
          value: ""
        },
        {
          name: "二月",
          key: 2,
          value: ""
        },
        {
          name: "三月",
          key: 3,
          value: ""
        },
        {
          name: "四月",
          key: 4,
          value: ""
        },
        {
          name: "五月",
          key: 5,
          value: ""
        },
        {
          name: "六月",
          key: 6,
          value: ""
        },
        {
          name: "七月",
          key: 7,
          value: ""
        },
        {
          name: "八月",
          key: 8,
          value: ""
        },
        {
          name: "九月",
          key: 9,
          value: ""
        },
        {
          name: "十月",
          key: 10,
          value: ""
        },
        {
          name: "十一月",
          key: 11,
          value: ""
        },
        {
          name: "十二月",
          key: 12,
          value: ""
        }
      ],
      processList: [],
      process_energy_list: []
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    },
    //工序
    processListTable() {
      this.processList.map(v => {
        v.auth = "%";
        v.month_list = {};
        v.id_list = {};
        this.process_energy_list.map(item => {
          if (v.id == item.process_id) {
            v.month_list[item.month] = item.budget_percentage;
            v.id_list[item.month] = item.id;
          }
        });
      });
      return this.processList;
    },
    processMonthCol() {
      return this.companyObj.budget_dimension == 1 ? [] : this.productMonth;
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.year = new Date().getFullYear().toString();
      this.changeYear();
      this.api_list();
      this.production_process_diagram();
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
    //根据年份查询被分配总量和已填月份信息
    changeYear() {
      com_budget_info(`year=${this.year}`).then(res => {
        if (res.code == 0 && res.data) {
          this.companyObj = res.data;
        }
      });
      this.getMonthList();
      this.factor_varieties_list();
      this.get_process_energy_list();
    },
    getMonthList() {
      com_budget_monthly_list(`year=${Number(this.year)}&budget_type=1`).then(res => {
        if (res.code == 0) {
          this.monthData = res.data.list;
          this.month.map(v => {
            let ary = this.monthData.filter(k => v.key == k.month);
            if (ary.length > 0) {
              v.value = ary[0].budget_percentage;
              v.id = ary[0].id;
            }
          });
        }
      });
    },
    addMonthBudget() {
      let bool = false;
      let val = 0;
      let month_list = [];
      this.month.map(v => {
        if (!v.value) {
          bool = true;
        }
        if (v.value) {
          val += Number(v.value);
          month_list.push({
            id: v.id ? v.id : undefined,
            month: v.key,
            budget_type: 1,
            budget_percentage: v.value
          });
        }
      });
      if (bool) {
        this.$message.warning("请将12个月份填写完成后提交");
        return;
      }
      if (val > 100) {
        this.$message.warning("月份总和占比不能大于100%");
        return;
      }
      let params = {
        year: Number(this.year),
        month_list: month_list
      };
      com_budget_monthly_save(params).then(res => {
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.getMonthList();
        }
      });
    },
    //单个保存失焦保存和修改
    addMonthBudget_one(key, value, id) {
      if (!value) {
        return;
      }
      let val = 0;
      this.month.map(v => {
        val += Number(v.value);
      });
      if (val > this.companyObj.annual_energy_budget) {
        this.$message.warning("月份总和不能大于被分配总量");
        return;
      }
      if (id) {
        let obj = {
          id: id,
          budget_amount: value
        };
        com_budget_monthly_update(obj).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功");
          }
        });
        return;
      }
      let obj = {
        year: Number(this.year),
        month: key,
        budget_type: 1,
        budget_amount: value
      };

      com_budget_monthly_save(obj).then(res => {
        if (res.code == 0) {
          this.$message.success("填写成功");
          this.getMonthList();
        }
      });
    },
    // 查询能源品种
    factor_varieties_list() {
      factor_varieties_list(`model_type=1`).then(res => {
        if (res.code == 0) {
          this.sourceList = res.data.list.filter(v => v.emission_process_type != 5 && v.emission_process_type != 6);
          this.variety_id = res.data.list[0].id;
          this.variety_name = res.data.list[0].name;
          this.variety_energy_list(res.data.list[0].id);
        } else {
          this.sourceList = [];
        }
      });
    },
    variety_energy_list(id) {
      variety_energy_list(`year=${Number(this.year)}&variety_id=${id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.energy_list = res.data.list;
          let ary = this.energy_list.filter(v => v.budget_dimension == 1);
          this.year_budget_amount = ary.length > 0 ? ary[0].budget_percentage : undefined;
          this.year_budget_amount_id = ary.length > 0 ? ary[0].id : undefined;
          this.monthSource.map(v => {
            let ary = this.energy_list.filter(k => v.key == k.month);
            if (ary.length > 0) {
              v.value = ary[0].budget_percentage;
              v.id = ary[0].id;
            } else {
              v.value = "";
              v.id = "";
            }
          });
        } else {
          this.energy_list = [];
          this.year_budget_amount = "";
          this.year_budget_amount_id = undefined;
          this.monthSource.map(v => {
            v.value = "";
            v.id = "";
          });
        }
      });
    },
    selectSource(variety_id, variety_name) {
      this.variety_id = variety_id;
      this.variety_name = variety_name;
      this.variety_energy_list(variety_id);
    },
    addYearBudget() {
      if (!this.year_budget_amount) {
        this.$message.warning("请填写预算占比");
        return;
      }
      let params = {
        id: this.year_budget_amount_id ? this.year_budget_amount_id : undefined,
        variety_id: this.variety_id,
        year: Number(this.year),
        budget_percentage: Number(this.year_budget_amount)
      };
      variety_energy_year_save(params).then(res => {
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.variety_energy_list(this.variety_id);
        }
      });
    },
    addVarietyMonthBudget() {
      let bool = false;
      let val = 0;
      let month_list = [];
      this.monthSource.map(v => {
        if (!v.value) {
          bool = true;
        }
        if (v.value) {
          val += v.value;
          month_list.push({
            id: v.id ? v.id : undefined,
            month: v.key,
            budget_percentage: v.value
          });
        }
      });
      if (bool) {
        this.$message.warning("请将12个月份填写完成后提交");
        return;
      }
      if (val > 100) {
        this.$message.warning("月份总和占比不能大于100%");
        return;
      }
      let params = {
        year: Number(this.year),
        variety_id: this.variety_id,
        month_list: month_list
      };
      variety_energy_month_save(params).then(res => {
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.variety_energy_list(this.variety_id);
        }
      });
    },

    //查询工序
    focusAction(row, type) {
      this.warningFlag = false;
      this.productFlag = type;
      let yearVal = 0;
      let yearLest = 0;
      if (type == 1) {
        this.productListTable.map(v => {
          yearVal += v.month_list[0] ? Number(v.month_list[0]) : 0;
        });
      } else if (type == 2) {
        this.processListTable.map(v => {
          yearVal += v.month_list[0] ? Number(v.month_list[0]) : 0;
        });
      } else if (type == 3) {
        this.equipmentListTable.map(v => {
          yearVal += v.month_list[0] ? Number(v.month_list[0]) : 0;
        });
      }
      if (yearVal > 100) {
        this.warningFlag = true;
      }
      let val = 0;
      let vallest = 0;
      for (let key in row.month_list) {
        if (key > 0) {
          val += Number(row.month_list[key]);
        }
      }
      if (val > 100) {
        this.warningFlag = true;
      }
      yearLest = 100 - yearVal;
      vallest = 100 - val;
      this.budgetTips = `年度预算已填：${yearVal.toFixed(1)}%,剩余${yearLest.toFixed(1)}%; ${row.name}月度预算 : 已填${val.toFixed(1)}%,剩余${vallest.toFixed(1)}%`;
    },
    production_process_diagram() {
      production_process_diagram().then(res => {
        if (res.code == 0 && res.data && res.data.nodes) {
          this.processList = res.data.nodes;
        } else {
          this.processList = [];
        }
      });
    },
    //查询填报历史
    get_process_energy_list() {
      process_energy_list(`year=${this.year}&&budget_type=1`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.process_energy_list = res.data.list;
        } else {
          this.process_energy_list = [];
        }
      });
    },
    saveProcess(row) {
      if (!this.year) {
        this.$message.warning("请选择年份");
        return;
      }
      this.process_energy_year_save(row);
      if (this.companyObj.budget_dimension == 2) {
        this.process_energy_month_save(row);
      }
    },
    process_energy_year_save(row) {
      if (row.month_list[0] !== 0 && !row.month_list[0]) {
        this.$message.warning("请填写预算值");
        return;
      }
      let params = {
        process_id: row.id,
        year: Number(this.year),
        budget_type: 1,
        budget_percentage: row.month_list[0],
        id: row.id_list[0]
      };
      process_energy_year_save(params).then(res => {
        if (res.code == 0) {
          this.$message.success("年度预算保存成功");
          this.get_process_energy_list();
        }
      });
    },
    process_energy_month_save(row) {
      let month_list = [];
      let val = 0;
      for (let key in row.month_list) {
        if (key != 0) {
          let inputVal = row.month_list[key] ? row.month_list[key] : 0;
          val += Number(inputVal);
          month_list.push({
            month: Number(key),
            budget_percentage: row.month_list[key] ? row.month_list[key] : 0,
            id: row.id_list[key]
          });
        }
      }
      if (month_list.length < 12) {
        this.$message.warning("请填写全部的月度预算");
        return;
      }
      if (val > 100) {
        this.$message.warning("月度预算总和不能大于100%");
        return;
      }
      let params = {
        process_id: row.id,
        year: Number(this.year),
        budget_type: 1,
        month_list: month_list
      };
      process_energy_month_save(params).then(res => {
        if (res.code == 0) {
          this.$message.success("月度预算保存成功");
          this.get_process_energy_list();
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
  overflow: auto;
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
    > span {
      margin-right: 20px;
      font-size: 14px;
      color: #4a5975;
    }
  }
  .content {
    background: #ffffff;
    border-radius: 10px;
    :deep(.el-input-group__append) {
      width: 0;
      padding: 0 15px;
    }
    > h1 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 56px;
      padding: 0 20px;
      margin: 0;
      border-bottom: 1px solid #ebeef5;
      > span {
        font-size: 16px;
        font-weight: 500;
        color: #4a5975;
      }
      > div {
        display: flex;
        align-items: center;
        width: 100%;
        overflow-x: auto;
        font-size: 16px;
        font-weight: normal;
        white-space: nowrap;
        > span {
          display: inline-block;
          height: 56px;
          margin-right: 20px;
          line-height: 56px;
          color: #1f304c;
          cursor: pointer;
        }
        .active {
          color: #0ec69a;
          border-bottom: 2px solid #0ec69a;
        }
        > label {
          margin: 0 10px 0 20px;
          font-size: 14px;
          color: #4a5975;
        }
      }
    }
    .percent-box {
      display: inline-block;
      padding: 3px 20px;
      margin-left: 50px;
      font-size: 14px;
      color: #37affa;
      text-align: center;
      background: #dcf1fd;
      border: 1px solid #a0d6f7;
      border-radius: 5px;
    }
    .percent-box-red {
      color: #ffffff;
      background: #f56c6c;
    }
    .set-box {
      padding: 0 20px;
      .company-box {
        display: grid;
        grid-template-columns: auto auto;
      }
      > h2 {
        display: flex;
        align-items: center;
        padding: 15px 0;
        margin: 0;
        font-size: 15px;
        font-weight: normal;
        color: #4a5975;
        > span {
          padding: 2px 10px;
          font-size: 18px;
          color: #ffffff;
          background: #0ec69a;
          border-radius: 5px;
          > span {
            font-size: 13px;
          }
        }
      }
      h3 {
        padding: 20px;
        margin: 0;
        background: #f9fafb;
        border: 1px solid rgb(222 226 235 / 100%);
        border-radius: 6px 0 0 6px;
        h4 {
          margin: 0;
          margin-bottom: 10px;
          font-size: 15px;
          font-weight: normal;
          color: #1f304c;
        }
      }
    }
    .month-box {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto;
      padding: 0 20px 20px;
      > div {
        padding: 20px;
        background: #f9fafb;
        border: 1px solid rgb(222 226 235 / 100%);
        p {
          margin: 0;
          margin-bottom: 10px;
          text-align: right;
        }
      }
    }
  }
}
</style>
