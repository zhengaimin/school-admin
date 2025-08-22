<template>
  <div class="stepThreeEchart">
    <div class="bottom-echart">
      <h1>
        <span>{{ flag == 1 ? "产品生产过程排放占比分析图" : "产品碳足迹占比分析图" }} </span>
      </h1>
      <div v-if="flag == 1" id="Chart1" style="width: 100%; height: 250px"></div>
      <div v-else id="Chart2" style="width: 100%; height: 250px"></div>
    </div>
    <div class="bottom-echart">
      <h1>
        <span> {{ flag == 1 ? "产品生产过程排放占比" : "产品碳足迹排放占比" }} </span>
      </h1>
      <div v-if="flag == 1" style="height: 250px; overflow: auto; border-radius: 10px">
        <div class="table-box table-list">
          <el-table class="my-custom-table" border :data="carbonCk_list">
            <el-table-column label="项目" prop="role_key" align="left">
              <template #default="{ row }">
                <span v-if="row.emission_process_type == -1"> 合计 </span>
                <span v-else>
                  {{ emission_process_type_obj[row.emission_process_type] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="排放量(kgCO₂)" prop="carbon_emission" align="left"> </el-table-column>
            <el-table-column label="占比" prop="percent" align="left">
              <template #default="{ row }">
                {{ row.percent + "%" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else style="height: 250px; overflow: auto; border-radius: 10px">
        <div class="table-box table-list">
          <el-table class="my-custom-table" border :data="carbonlca_list">
            <el-table-column label="项目" prop="role_key" align="left">
              <template #default="{ row }">
                {{
                  { 1: "产品生产", 2: "原辅料生产", 3: "原辅料运输", 4: "产品运输", 5: "使用阶段", 6: "处置回收" }[row.lca_type]
                }}
              </template>
            </el-table-column>
            <el-table-column label="排放量(kgCO₂)" prop="carbon_emission" align="left"> </el-table-column>
            <el-table-column label="占比" prop="percent" align="left">
              <template #default="{ row }">
                {{ row.percent + "%" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { carbonStore } from "@/stores/modules/carbonFootprint";
import { emission_type_percent_list } from "@/api/modules/carbonFootprint.js";
import { lca_percent_list } from "@/api/modules/carbonFootprint.js";
import * as echarts from "echarts";
export default {
  props: {
    flag: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      carbonCk_list: [],
      carbonlca_list: [],
      emission_process_type_obj: {
        1: "化石燃料燃烧排放",
        2: "企业净购入的电力隐含的CO2排放",
        3: "企业净购入的热力(热水)隐含的CO2排放",
        4: "企业净购入的热力(蒸汽)隐含的CO2排放",
        5: "熟料生产过程排放"
      }
    };
  },
  computed: {
    carbonRow() {
      return this.carbonStore.carbonRow;
    }
  },
  created() {
    this.carbonStore = carbonStore();
    this.featchData();
    this.featchDataLca();
  },
  methods: {
    featchData() {
      if (this.flag == 2) {
        return;
      }
      emission_type_percent_list(`id=${this.carbonRow.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          this.$nextTick(() => {
            // 合并熟料
            let seriesListAdd = [];
            let list = res.data.filter(v => v.emission_process_type != 5 && v.emission_process_type != 6);
            let list1 = res.data.filter(v => v.emission_process_type == 5 || v.emission_process_type == 6);
            if (list1.length > 0) {
              let val = 0;
              let percent = 0;
              list1.map(v => {
                val += Number(v.carbon_emission);
                percent += Number(v.percent);
              });
              let ary = [
                {
                  emission_process_type: 5,
                  carbon_emission: val.toFixed(2),
                  percent: percent.toFixed(2)
                }
              ];
              seriesListAdd = list.concat(ary);
              this.carbonCk_list = seriesListAdd;
            } else {
              seriesListAdd = list;
              this.carbonCk_list = list;
            }
            let totalValue = 0;
            this.carbonCk_list.forEach(function (item) {
              totalValue += Number(item.carbon_emission);
            });
            this.carbonCk_list.push({
              emission_process_type: -1,
              carbon_emission: totalValue,
              percent: 100
            });
            let seriesList = [];
            seriesListAdd.map(v => {
              seriesList.push({
                name: {
                  1: "化石燃料燃烧CO₂排放",
                  2: "电力的CO₂排放",
                  3: "热水的CO₂排放",
                  4: "热力的CO₂排放",
                  5: "熟料生产过程排放"
                }[v.emission_process_type],
                value: Number(v.carbon_emission).toFixed(2)
              });
            });
            this.renderChart1(seriesList);
          });
        } else {
          this.carbonCk_list = [];
          this.$nextTick(() => {
            this.renderChart1([]);
          });
        }
      });
    },
    featchDataLca() {
      if (this.flag == 1) {
        return;
      }
      lca_percent_list(`id=${this.carbonRow.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          this.carbonlca_list = res.data;
          this.$nextTick(() => {
            let data = [];
            res.data.map(v => {
              data.push({
                value: v.carbon_emission,
                name: { 1: "产品生产", 2: "原辅料生产", 3: "原辅料运输", 4: "产品运输", 5: "使用阶段", 6: "处置回收" }[v.lca_type]
              });
            });
            this.renderChart1(data);
          });
        } else {
          this.carbonlca_list = [];
          this.$nextTick(() => {
            this.renderChart1([]);
          });
        }
      });
    },
    renderChart1(data) {
      let domElement = document.getElementById("Chart" + this.flag);
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      let myChart = echarts.init(domElement);
      let option = {
        series: [
          {
            type: "pie",
            radius: ["35%", "60%"],
            label: {
              show: true,
              formatter: "{b|{b}} \n {d|{d}%}  {c|({c}tCO₂)}",
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
    }
  }
};
</script>
<style lang="scss" scoped>
.stepThreeEchart {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
  .bottom-echart {
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
</style>
