<template>
  <div class="carbon-analysis">
    <div class="form-box">
      <div class="grid-content bg-purple-dark">
        <el-form-item label="产品名称">
          <el-select v-model="form.product_id">
            <el-option v-for="v in productList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="时间">
          <el-date-picker style="width: 100%" v-model="form.year" value-format="YYYY" type="year" />
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-button type="primary" class="search-btn" @click="search"> 查询 </el-button>
      </div>
    </div>
    <div class="top-box">
      <div class="left-value">
        <div class="img-box" style="background: #e3fbf5">
          <img src="@/assets/images/carbonAssets/zuji.svg" alt="" />
        </div>
        <div class="persent-box">
          <h1>产品碳足迹(kgCO₂eq/{{ unit }})</h1>
          <div class="h2">
            <span>{{ overviewObj.footprint_value ? (overviewObj.footprint_value * 1000).toFixed(2) : "" }}</span>
            <h3>
              同比去年
              <span> {{ overviewObj.footprint_value_yoy }}% </span>
            </h3>
          </div>
        </div>
      </div>
      <div class="left-value">
        <div class="img-box" style="background: #c9f5ff">
          <img src="@/assets/images/carbonAssets/shopping.svg" alt="" />
        </div>
        <div class="persent-box">
          <h1>产品产量({{ unit }})</h1>
          <div class="h2">
            <span>{{ overviewObj.total_product_amount }}</span>
            <h3>
              同比去年
              <span> {{ overviewObj.total_product_amount_yoy }}% </span>
            </h3>
          </div>
        </div>
      </div>
      <div class="left-value">
        <div class="img-box" style="background: #dbfbe7">
          <img src="@/assets/images/carbonAssets/co2.svg" alt="" />
        </div>
        <div class="persent-box">
          <h1>碳排放总量(tCO₂eq)</h1>
          <div class="h2">
            <span>{{ overviewObj.total_carbon_emission }}</span>
            <h3>
              同比去年
              <span> {{ overviewObj.total_carbon_emission_yoy }}% </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-box" style="margin-bottom: 10px">
      <div class="bottom-echart" style="margin-right: 10px">
        <h1>
          <span> 排放源分析图(产品生产) </span>
        </h1>
        <div id="Chart1" style="width: 100%; height: 340px"></div>
      </div>
      <div class="bottom-echart">
        <h1>
          <span> 产品碳足迹各排放过程占比图 </span>
        </h1>
        <div id="Chart2" style="width: 100%; height: 340px"></div>
      </div>
    </div>
    <div class="bottom-box" style="grid-template-columns: 1fr; margin-bottom: 10px">
      <div class="bottom-echart">
        <h1>
          <span> 产品碳足迹分析图 </span>
        </h1>
        <div id="Chart3" style="width: 100%; height: 340px"></div>
      </div>
    </div>
    <!-- 产品生产阶段的化石燃料燃烧产生的碳排放 -->
    <div class="set-box table-box table-list" style="height: auto">
      <h1>产品生产阶段的化石燃料燃烧产生的碳排放</h1>
      <el-table :data="HList">
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="低位发热值(GJ/t或GJ／万Nm³)" align="center">
          <el-table-column label="A" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio0 == 2">
                  <el-input v-model="row.emission_factor_json.ff_low_heat_output"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_low_heat_output_default"></el-input>
                </div>
                <el-select v-model="row.radio0" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_low_heat_output !== '0'">{{
                  row.emission_factor_json.ff_low_heat_output
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_low_heat_output_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="单位热值含碳量(tC/TJ)" align="center">
          <el-table-column label="B" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio1 == 2">
                  <el-input v-model="row.emission_factor_json.ff_carbon_content_per_calorific_value"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_carbon_content_per_calorific_value_default"></el-input>
                </div>
                <el-select v-model="row.radio1" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_carbon_content_per_calorific_value !== '0'">{{
                  row.emission_factor_json.ff_carbon_content_per_calorific_value
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_carbon_content_per_calorific_value_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳氧化率(%)" align="center">
          <el-table-column label="C" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio2 == 2">
                  <el-input v-model="row.emission_factor_json.ff_fuel_carbon_oxidation_rate"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_fuel_carbon_oxidation_rate_default"></el-input>
                </div>
                <el-select v-model="row.radio2" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_fuel_carbon_oxidation_rate !== '0'">{{
                  row.emission_factor_json.ff_fuel_carbon_oxidation_rate
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_fuel_carbon_oxidation_rate_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="折算因子" align="center">
          <el-table-column label="D" align="center" width="110">
            <template #default="{}">
              <span>44/12</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="消耗量(t或万Nm³)" align="center">
          <el-table-column label="E" prop="energy_consumption" align="center" width="150"> </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(tCO₂)" align="center">
          <el-table-column label="F=A*B*C*D*E/100000" align="center">
            <template #default="{ row }">
              {{ row.carbon_emission }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="set-box table-box table-list" style="height: auto">
      <h1>产品生产阶段的电力、热力的碳排放</h1>
      <el-table :data="DList">
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动数据(A)" align="center">
          <el-table-column label="数值" align="center" prop="energy_consumption"> </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{ row }">
              <span v-if="row.emission_process_type == 2">MWh</span>
              <span v-else>GJ</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CO₂当量排放因子(B)" align="center">
          <el-table-column label="数值" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio3 == 2">
                  <el-input v-model="row.emission_factor_json.other_carbon_emission_factor"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.other_carbon_emission_factor_default"></el-input>
                </div>
                <el-select v-model="row.radio3" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.other_carbon_emission_factor !== '0'">{{
                  row.emission_factor_json.other_carbon_emission_factor
                }}</span>
                <span v-else>{{ row.emission_factor_json.other_carbon_emission_factor_default }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{ row }">
              <div>{{ row.emission_factor_json.other_carbon_emission_factor_unit }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(C=A*B)" align="center">
          <el-table-column label="数值" align="center">
            <template #default="{ row }">
              <div>{{ row.carbon_emission }}</div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{}">
              <div>tCO₂</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!-- 熟料 -->
    <div class="set-box table-box table-list" style="height: auto">
      <h1>生产过程产生的碳排放</h1>
      <el-table :data="SNList" :span-method="mergeSameRows">
        <el-table-column label="类型" align="left">
          <template #default="{ row }">
            <div>{{ { 5: "熟料", 6: "非碳酸盐替代原料" }[row.emission_process_type] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消耗量(t)" align="center">
          <el-table-column label="A" align="center" prop="energy_consumption"> </el-table-column>
        </el-table-column>
        <el-table-column label="排放因子/扣减系数(tCO₂/t)" align="center">
          <el-table-column label="B" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio4 == 2">
                  <el-input-number
                    controls-position="right"
                    :precision="4"
                    v-model="row.emission_factor_json.other_carbon_emission_factor"
                  />
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.other_carbon_emission_factor_default"></el-input>
                </div>
                <el-select v-model="row.radio4" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.other_carbon_emission_factor !== '0'">{{
                  row.emission_factor_json.other_carbon_emission_factor
                }}</span>
                <span v-else>{{ row.emission_factor_json.other_carbon_emission_factor_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(tCO₂)" align="center">
          <el-table-column label="C=A*B" align="center">
            <template #default="{ row }">
              <div>{{ row.carbon_emission }}</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getMergeCells } from "@/utils/table.js";
import * as echarts from "echarts";
import { product_list } from "@/api/modules/enterpriseSetup.js";
import {
  carbon_footprint_overview,
  variety_percent_list,
  lca_percent_list,
  carbon_footprint_year_trend,
  product_carbon_footprint_data_list,
  product_carbon_footprint_status
} from "@/api/modules/carbonFootprint.js";
export default {
  data() {
    return {
      productList: [],
      form: {
        product_id: "",
        year: ""
      },
      overviewObj: {},
      activeId: "",
      HList: [],
      DList: [],
      SList: [],
      NList: [],
      tableColumn: [
        { prop: "emission_process_type", label: "" },
        { prop: "variety_name", label: "" },
        { prop: "energy_consumption", label: "" },
        { prop: "other_carbon_emission_factor", label: "" }
      ]
    };
  },
  computed: {
    unit() {
      let ary = this.productList.filter(v => v.id == this.form.product_id);
      return ary.length > 0 ? ary[0].unit : "";
    },
    SNList() {
      return this.SList.concat(this.NList);
    },
    spanArr() {
      if (!this.tableColumn.length) return [];
      const mergeCols = ["emission_process_type"]; // 需要合并的列（字段）
      return getMergeCells(this.SNList, this.tableColumn, mergeCols);
    }
  },
  mounted() {
    // 获取当前年份
    let year = new Date().getFullYear() - 1;
    this.form.year = year.toString();
    // 获取产品列表
    this.featchData();
  },
  methods: {
    mergeSameRows({ row, column, rowIndex, columnIndex }) {
      if (row && column) {
      }
      return this.spanArr[rowIndex][columnIndex];
    },
    featchData() {
      product_list({}).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.productList = res.data.list.filter(v => v.product_type == 2);
          this.form.product_id = this.productList[0].id;
          this.featchAll();
        } else {
          this.productList = [];
        }
      });
    },
    search() {
      if (!this.form.year) {
        this.$message.warning("请选择年份");
        return;
      }
      this.featchAll();
    },
    featchAll() {
      product_carbon_footprint_status(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data.status == 7) {
          this.featch_overview();
          this.featchList();
          this.featch_variety_percent_list();
          this.featchDataLca();
          this.featch_year_trend();
        } else {
          this.$message.warning("该年份暂未生成碳足迹，请先进行碳足迹计算");
        }
      });
    },
    featch_overview() {
      carbon_footprint_overview(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data) {
          this.overviewObj = res.data;
        } else {
          this.overviewObj = {};
        }
      });
    },
    featch_variety_percent_list() {
      variety_percent_list(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          let xlist = [];
          let ylist = [];
          res.data.map(v => {
            xlist.push(v.variety_name);
            ylist.push(v.carbon_emission);
          });
          this.renderChart1(xlist, ylist);
        } else {
          this.renderChart1([], []);
        }
      });
    },
    featchDataLca() {
      lca_percent_list(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          this.$nextTick(() => {
            let data = [];
            res.data.map(v => {
              data.push({
                value: v.carbon_emission,
                name: { 1: "产品生产", 2: "原辅料生产", 3: "原辅料运输", 4: "产品运输", 5: "使用阶段", 6: "处置回收" }[v.lca_type]
              });
            });
            this.renderChart2(data);
          });
        } else {
          this.$nextTick(() => {
            this.renderChart2([]);
          });
        }
      });
    },
    featch_year_trend() {
      carbon_footprint_year_trend(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          let xlist = [];
          let ylist = [];
          res.data.map(v => {
            xlist.push(v.year);
            ylist.push((v.footprint_value * 1000).toFixed(2));
          });
          this.renderChart3(xlist, ylist);
        } else {
          this.renderChart3([], []);
        }
      });
    },

    renderChart1(xlist, ylist) {
      let domElement = document.getElementById("Chart1");
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      let myChart = echarts.init(domElement);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xlist,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "单位：tCO₂eq",
            type: "value"
          }
        ],
        series: [
          {
            // name: "Direct",
            type: "bar",
            barMaxWidth: 20,
            // barWidth: 30,
            // itemStyle: {
            //   color: "#0EC69A"
            // },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0EC69A" },
                { offset: 0.5, color: "#4fd6b5" },
                { offset: 1, color: "#7de0c9" }
              ])
            },
            data: ylist
          }
        ]
      };
      myChart.setOption(option);
    },
    renderChart2(data) {
      let domElement = document.getElementById("Chart2");
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      let myChart = echarts.init(domElement);
      let option = {
        series: [
          {
            type: "pie",
            radius: ["30%", "45%"],
            label: {
              show: true,
              formatter: "{b|{b}} \n {d|{d}%} \n {c|({c}tCO₂)}",
              rich: {
                b: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: "#4A5975"
                },
                d: {
                  fontSize: 16,
                  lineHeight: 20,
                  color: "#333"
                },
                c: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: "#B6BFD2",
                  align: "left"
                }
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    },
    renderChart3(xlist, ylist) {
      let domElement = document.getElementById("Chart3");
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      let myChart = echarts.init(domElement);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xlist,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "单位：kgCO₂eq/" + this.unit,
            type: "value"
          }
        ],
        series: [
          {
            // name: "Direct",
            type: "line",
            smooth: true,
            areaStyle: {},
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0EC69A" },
                { offset: 0.5, color: "#4fd6b5" },
                { offset: 1, color: "#7de0c9" }
              ])
            },
            data: ylist
          }
        ]
      };
      myChart.setOption(option);
    },
    featchList() {
      product_carbon_footprint_data_list(`product_id=${this.form.product_id}&year=${this.form.year}`).then(res => {
        if (res.code == 0 && res.data && res.data.emission_type_list && res.data.emission_type_list.length > 0) {
          this.HList = res.data.emission_type_list.filter(v => v.emission_process_type == 1);
          this.DList = res.data.emission_type_list.filter(
            v => v.emission_process_type == 2 || v.emission_process_type == 3 || v.emission_process_type == 4
          );
          this.SList = res.data.emission_type_list.filter(v => v.emission_process_type == 5);
          this.NList = res.data.emission_type_list.filter(v => v.emission_process_type == 6);
          this.HList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio0 = "1";
            v.radio1 = "1";
            v.radio2 = "1";
          });
          this.DList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio3 = "1";
          });
          this.SList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio4 = "1";
          });
          this.NList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio5 = "1";
          });
        } else {
          this.HList = [];
          this.DList = [];
          this.SList = [];
          this.NList = [];
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.carbon-analysis {
  .form-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding-top: 20px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    .grid-content {
      padding-left: 20px;
    }
  }
  .top-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 0 10px;
    margin-bottom: 10px;
    .left-value {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100px;
      background: #ffffff;
      border-radius: 10px;
      .img-box {
        width: 56px;
        height: 56px;
        margin: 0 20px;
        line-height: 56px;
        text-align: center;
        border-radius: 20px;
        > img {
          width: 32px;
          height: 37px;
          margin-top: 9px;
        }
      }
      .persent-box {
        box-sizing: border-box;
        width: calc(100% - 70px);
        height: 90px;
        padding: 15px 0;
        > h1 {
          margin: 0;
          font-size: 14px;
          font-weight: 400;
          color: #4a5975;
        }
        .h2 {
          display: flex;
          justify-content: space-between;
          height: 30px;
          margin: 8px 0 0;
          font-size: 28px;
          font-weight: 600;
          color: #1f304c;
          > h3 {
            margin: 0 10px 0 0;
            font-size: 12px;
            font-weight: 400;
            line-height: 50px;
            color: #8894b3;
          }
        }
      }
    }
  }
  .bottom-box {
    display: grid;
    grid-template-columns: 1fr 450px;
    grid-auto-columns: 10px;
    height: 400px;
    > div {
      background: #ffffff;
      border-radius: 10px;
    }
    .bottom-echart {
      > h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
          font-weight: normal;
          > span {
            display: inline-block;
            width: 90px;
            margin-left: 10px;
            font-size: 12px;
            color: #1f304c;
          }
        }
      }
      .message {
        margin: 30px 20px;
        font-size: 14px;
        color: #8894b3;
      }
      .value-message {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 20px;
        margin-bottom: 20px;
        font-size: 16px;
        color: #1f304c;
        > span {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 15px;
          background: #0ec69a;
          border-radius: 8px;
        }
      }
    }
  }
  .content {
    margin-bottom: 10px;
    overflow: hidden;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
        width: 300px;
        font-size: 16px;
        font-weight: normal;
        > span {
          display: inline-block;
          width: 90px;
          margin-right: 10px;
          color: #4a5975;
          cursor: pointer;
        }
      }
    }
  }
}
.set-box {
  margin-bottom: 10px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 10px;
  h1 {
    height: 50px;
    padding-left: 20px;
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 50px;
    color: #1f304c;
    border-bottom: 1px solid #f4f6fa;
  }
  .update-input {
    display: grid;
    grid-template-columns: 1fr 90px;
  }
}
</style>
