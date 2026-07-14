<template>
  <div class="center-echart">
    <div style="background: none">
      <div class="total-value">
        <div class="img-box">
          <img src="@/assets/images/common/dian-2.svg" alt="" srcset="" />
        </div>
        <div class="math-value">
          <h1>综合能源总量(tce)</h1>
          <h2>{{ sourceObj.energy_total }}</h2>
        </div>
        <div class="math-value-right">
          同比去年
          <span :class="{ low: sourceObj.energy_year_on_year < 0, upper: sourceObj.energy_year_on_year > 0 }">
            {{ (sourceObj.energy_year_on_year * 100).toFixed(2) }}%
            <el-icon v-if="sourceObj.energy_year_on_year > 0"><CaretTop /></el-icon>
            <el-icon v-if="sourceObj.energy_year_on_year < 0"><CaretBottom /></el-icon>
          </span>
        </div>
      </div>
      <div class="chart-value">
        <h1>综合能源占比</h1>
        <div id="sourcePercentageChart" style="width: 100%; height: 320px"></div>
      </div>
    </div>
    <div>
      <div class="chartSource-box">
        <h1>
          能源预算指标
          <span>/tce</span>
        </h1>
        <div class="chartSource" id="chartSource" style="width: 100%; height: 150px"></div>
        <div v-if="!budgetObj.flag" class="chartSource-persent">{{ budgetObj.energy_budget_persent }}%</div>
        <div class="chartSource-value">
          <div>
            <span class="icon-green"></span>
            <span class="label">已用量</span>
            <span class="value">{{ budgetObj.energy_used }}</span>
          </div>
          <div>
            <span class="icon-red"></span>
            <span class="label">剩余量</span>
            <span class="value">{{ budgetObj.energy_remain }}</span>
          </div>
        </div>
      </div>
      <div class="chartSource-box">
        <h1>
          碳排放预算指标
          <span>/tCO₂eq</span>
        </h1>
        <div class="chartCarbon" id="chartCarbon" style="width: 100%; height: 150px"></div>
        <div v-if="!budgetObj.flag1" class="chartSource-persent">{{ budgetObj.carbon_budget_persent }}%</div>
        <div class="chartSource-value">
          <div>
            <span class="icon-green"></span>
            <span class="label">已用量</span>
            <span class="value">{{ budgetObj.carbon_used }}</span>
          </div>
          <div>
            <span class="icon-red"></span>
            <span class="label">剩余量</span>
            <span class="value">{{ budgetObj.carbon_remain }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="background: none">
      <div class="total-value">
        <div class="img-box" style="background: #dbfbe7">
          <img src="@/assets/images/common/Co2-2.svg" alt="" srcset="" />
        </div>
        <div class="math-value">
          <h1>碳排放总量(tCO₂eq)</h1>
          <h2>{{ sourceObj.carbon_total }}</h2>
        </div>
        <div class="math-value-right">
          同比去年
          <span :class="{ low: sourceObj.carbon_year_on_year < 0, upper: sourceObj.carbon_year_on_year > 0 }">
            {{ (sourceObj.carbon_year_on_year * 100).toFixed(2) }}%
            <el-icon v-if="sourceObj.carbon_year_on_year > 0"><CaretTop /></el-icon>
            <el-icon v-if="sourceObj.carbon_year_on_year < 0"><CaretBottom /></el-icon>
          </span>
        </div>
      </div>
      <div class="chart-value">
        <h1>碳排放总量占比</h1>
        <div class="carbon-right">
          <div v-for="(v, i) in carbonList" :key="i">
            <h1>{{ boundary_type_obj[v.boundary_type] }}-{{ emission_process_type_obj[v.emission_process_type] }}</h1>
            <div class="present-box">
              <el-progress
                :text-inside="true"
                :percentage="v.percent"
                :stroke-width="20"
                striped
                :color="colorObj[v.emission_process_type]"
              />
              <span>{{ v.consumption }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { total_statistics, energy_proportion, carbon_boundary, budget_compare } from "@/api/modules/carbonAnalysis.js";
export default {
  name: "CenterChart",
  data() {
    return {
      sourceObj: {
        energy_total: 0,
        energy_year_on_year: 0,
        carbon_total: 0,
        carbon_year_on_year: 0
      },
      percentList: [],
      boundary_type_obj: { 1: "直接排放", 2: "间接排放" },
      emission_process_type_obj: {
        1: "化石燃料燃烧排放",
        2: "企业净购入的电力隐含的CO2排放",
        3: "企业净购入的热力(热水)隐含的CO2排放",
        4: "企业净购入的热力(蒸汽)隐含的CO2排放",
        5: "熟料生产过程产生的碳排放(熟料)",
        6: "熟料生产过程产生的碳排放(非碳酸盐替代原料)"
      },
      colorObj: ["#0EC69A", "#09B8DE", "#0DCD58", "#F8C647", "#FFD39B"],
      carbonList: [],
      budgetObj: {}
    };
  },
  methods: {
    initPage(str) {
      this.search_total_statistics(str);
      this.search_energy_proportion(str);
      this.search_carbon_boundary(str);
      this.search_budget_compare(str);
    },
    //查询能源/碳排总量
    search_total_statistics(str) {
      total_statistics(str).then(res => {
        if (res.code == 0 && res.data) {
          for (let key in res.data) {
            res.data[key] = Number(res.data[key]).toFixed(2);
          }
          this.sourceObj = res.data;
        } else {
          this.sourceObj = {
            energy_total: 0,
            energy_year_on_year: 0,
            carbon_total: 0,
            carbon_year_on_year: 0
          };
        }
      });
    },
    //查询综合能源占比
    search_energy_proportion(str) {
      energy_proportion(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          let keys = ["consumption"];
          res.data.list.map(v => {
            for (let key in v) {
              if (keys.includes(key)) {
                v[key] = Number(v[key]).toFixed(2);
              }
            }
          });
          this.percentList = [];
          res.data.list.map(v => {
            this.percentList.push({
              name: v.variety_name,
              value: v.consumption
            });
          });
          this.initEchart();
        } else {
          this.percentList = [];
          this.initEchart();
        }
      });
    },
    initEchart() {
      let myChart = echarts.init(document.getElementById("sourcePercentageChart"));
      let option = {
        series: [
          {
            type: "pie",
            radius: ["30%", "55%"],
            label: {
              show: true,
              // normal: {
              formatter: "{b|{b}} {d|{d}%} \n {c|({c}tce)}",
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
              // }
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
            data: this.percentList
          }
        ]
      };
      myChart.setOption(option);
    },
    //查询二氧化碳排放-核算边界占比接口
    search_carbon_boundary(str) {
      carbon_boundary(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.carbonList = res.data.list;
        } else {
          this.carbonList = [];
        }
      });
    },
    //查询能碳预算对比
    search_budget_compare(str) {
      budget_compare(str).then(res => {
        if (res.code == 0 && res.data && res.data) {
          for (let key in res.data) {
            res.data[key] = Number(res.data[key]).toFixed(2);
          }
          this.budgetObj = res.data;
          this.chartSource();
          this.chartCarbon();
        } else {
          this.budgetObj = {
            energy_budget: 0,
            carbon_budget: 0,
            energy_used: 0,
            carbon_used: 0,
            energy_remain: 0,
            carbon_remain: 0
          };
        }
      });
    },
    chartSource() {
      let myChart = echarts.init(document.getElementById("chartSource"));
      this.budgetObj.flag = Number(this.budgetObj.energy_used) > Number(this.budgetObj.energy_budget) ? false : true;
      if (this.budgetObj.energy_budget == 0) {
        this.budgetObj.energy_budget_persent = this.budgetObj.energy_used;
      } else if (!this.budgetObj.flag) {
        this.budgetObj.energy_budget_persent = ((this.budgetObj.energy_used / this.budgetObj.energy_budget) * 100).toFixed(2);
      }
      let option = {
        series: [
          {
            type: "pie",
            radius: ["65%", "100%"],
            center: ["50%", "80%"],
            label: {
              show: this.budgetObj.flag,
              formatter: "{d}%"
            },
            startAngle: 180,
            endAngle: 360,
            padAngle: 3,
            itemStyle: {
              normal: {
                color: function (colors) {
                  let colorList = ["#20E5CA", "#FA7087"];
                  return colorList[colors.dataIndex];
                }
              }
            },
            data: [
              { value: this.budgetObj.energy_used, name: "已用量" },
              { value: this.budgetObj.energy_remain, name: "剩余量" }
            ]
          }
        ]
      };
      myChart.setOption(option);
    },
    chartCarbon() {
      let myChart = echarts.init(document.getElementById("chartCarbon"));
      this.budgetObj.flag1 = Number(this.budgetObj.carbon_used) > Number(this.budgetObj.carbon_budget) ? false : true;
      if (this.budgetObj.carbon_budget == 0) {
        this.budgetObj.carbon_budget_persent = this.budgetObj.carbon_used;
      } else if (!this.budgetObj.flag1) {
        this.budgetObj.carbon_budget_persent = ((this.budgetObj.carbon_used / this.budgetObj.carbon_budget) * 100).toFixed(2);
      }
      let option = {
        series: [
          {
            type: "pie",
            radius: ["65%", "100%"],
            center: ["50%", "80%"],
            label: {
              show: this.budgetObj.flag1,
              formatter: "{d}%"
            },
            startAngle: 180,
            endAngle: 360,
            padAngle: 3,
            itemStyle: {
              normal: {
                color: function (colors) {
                  let colorList = ["#20E5CA", "#FA7087"];
                  return colorList[colors.dataIndex];
                }
              }
            },
            data: [
              { value: this.budgetObj.carbon_used, name: "已用量" },
              { value: this.budgetObj.carbon_remain, name: "剩余量" }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.center-echart {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 12px;
  height: 500px;
  margin-top: 15px;
  > div {
    background: #ffffff;
    border-radius: 10px;
    .total-value {
      position: relative;
      display: flex;
      align-items: center;
      height: 70px;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
      .img-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        background: #e3fbf5;
        border-radius: 20px;
        > img {
          width: 32px;
          height: 32px;
        }
      }
      .math-value {
        margin-left: 10%;
        h1 {
          margin: 0;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: normal;
          color: #4a5975;
        }
        h2 {
          margin: 0;
          font-size: 28px;
          color: #1f304c;
        }
      }
      .math-value-right {
        position: absolute;
        right: 10%;
        bottom: 13px;
        font-size: 12px;
        color: #8894b3;
        .upper {
          font-size: 14px;
          color: #f23d4f;
        }
        .low {
          color: #0ece5a;
        }
      }
    }
    .chart-value {
      height: 378px;
      margin-top: 12px;
      background: #ffffff;
      border-radius: 10px;
      > h1 {
        height: 56px;
        padding-left: 20px;
        margin: 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 56px;
        color: #1f304c;
        border-bottom: 1px solid #f4f6fa;
      }
      .carbon-right {
        grid-auto-rows: 1fr 1fr 1fr 1fr;
        width: 100%;
        height: 320px;
        overflow: auto;
        > div {
          box-sizing: border-box;
          padding: 0 20px;
          padding-top: 26px;
          > h1 {
            margin: 0;
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: normal;
            color: #627292;
          }
          .present-box {
            position: relative;
            padding-right: 80px;
            > span {
              position: absolute;
              top: 0;
              right: 0;
            }
          }
        }
      }
    }
  }
  .chartSource-box {
    position: relative;
    height: 250px;
    border-bottom: 1px solid #f4f6fa;
    .chartSource-persent {
      position: absolute;
      top: 55%;
      right: 0;
      left: 0;
      text-align: center;
    }
    > h1 {
      height: 50px;
      padding-left: 20px;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      line-height: 50px;
      color: #1f304c;
      > span {
        float: right;
        margin-right: 20px;
        font-size: 14px;
        color: #8894b3;
      }
    }
    .chartSource-value {
      display: flex;
      justify-content: space-around;
      .icon-green {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        background: #0ec69a;
        border-radius: 10px;
      }
      .icon-red {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        background: #f23d4f;
        border-radius: 10px;
      }
      .label {
        margin-right: 10px;
        font-size: 12px;
        color: #8894b3;
      }
      .value {
        font-size: 18px;
        color: #1f304c;
      }
    }
  }
}
</style>
