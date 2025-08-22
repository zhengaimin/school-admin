<template>
  <div class="carbonSource">
    <div class="sourceTrendChart">
      <h1>
        <span class="yellow"></span>
        <span class="green"></span>
        综合能耗量（tce）
      </h1>
      <div class="value-box grid-background">
        <span v-for="(v, index) in energy_total" :key="index" :class="{ point: v == '.' }"> {{ v }} </span>
      </div>
    </div>
    <div class="sourceTrendChart">
      <h1>
        <span class="yellow"></span>
        <span class="green"></span>
        综合碳排放量（tCO₂eq）
      </h1>

      <div class="value-box grid-background">
        <span v-for="(v, index) in carbon_total" :key="index" :class="{ point: v == '.' }"> {{ v }} </span>
      </div>
    </div>
    <div class="sourceTrendChart">
      <h1>
        <span class="yellow"></span>
        <span class="green"></span>
        能源预算（tce）
      </h1>

      <div v-show="isShow" id="carbonSource" class="grid-background" style="width: 100%; height: calc(100% - 43px)"></div>

      <div v-show="!isShow" class="persent-box grid-background">
        <div v-for="v in budgetList" :key="v.name">
          <div>{{ v.name }}</div>
          <div class="persent">
            <el-progress :stroke-width="18" :text-inside="true" :percentage="v.persent" :color="v.color" />
          </div>
          <div class="value">{{ v.value }}</div>
        </div>
      </div>
    </div>
    <div class="sourceTrendChart">
      <h1>
        <span class="yellow"></span>
        <span class="green"></span>
        综合碳排放预算（tCO₂eq）
      </h1>
      <div v-show="isShow" id="carbonSource2" class="grid-background" style="width: 100%; height: calc(100% - 43px)"></div>
      <div v-show="!isShow" class="persent-box grid-background">
        <div v-for="v in carbonList" :key="v.name">
          <div>{{ v.name }}</div>
          <div class="persent">
            <el-progress :stroke-width="18" :text-inside="true" :percentage="v.persent" :color="v.color" />
          </div>
          <div class="value">{{ v.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import "echarts-liquidfill";
import { total_statistics, budget_compare } from "@/api/modules/carbonAnalysis.js";
export default {
  data() {
    return {
      energy_total_num: 0,
      energy_total: [],
      carbon_total: [],
      budgetList: [],
      carbonList: [],
      isShow: false,
      timer: null
    };
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    initPage(year) {
      clearInterval(this.timer);
      let start_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let end_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let str = `process_id=0&time_type=1&start_time=${start_time}&end_time=${end_time}`;
      this.search_total_statistics(str);
      this.search_budget_compare(str);
    },
    //查询能源/碳排总量
    search_total_statistics(str) {
      total_statistics(str).then(res => {
        if (res.code == 0 && res.data) {
          this.energy_total = this.numberToArray(res.data.energy_total);
          this.carbon_total = this.numberToArray(res.data.carbon_total);
        } else {
          this.energy_total = [0];
          this.carbon_total = [0];
        }
      });
    },
    numberToArray(str) {
      // 将数字转换为字符串
      // 使用split方法将字符串转换为数组
      const arr = parseInt(Number(str)).toString().split("");
      return arr;
    },
    //查询能碳预算对比
    search_budget_compare(str) {
      budget_compare(str).then(res => {
        if (res.code == 0 && res.data && res.data) {
          let val =
            Number(res.data.energy_budget) == 0 ? 1 : (Number(res.data.energy_used) / Number(res.data.energy_budget)).toFixed(2);
          this.initChart(val);
          let val2 =
            Number(res.data.carbon_budget) == 0 ? 1 : (Number(res.data.carbon_used) / Number(res.data.carbon_budget)).toFixed(2);
          this.initChart2(val2);
          this.budgetList = [
            { name: "预算量", value: res.data.energy_budget, persent: res.data.energy_budget == 0 ? 0 : 100, color: "#0EC69A" },
            {
              name: "已用量",
              value: res.data.energy_used,
              persent: res.data.energy_budget == 0 ? 0 : ((res.data.energy_used / res.data.energy_budget) * 100).toFixed(1),
              color: "#37AFFA"
            },
            {
              name: "剩余量",
              value: res.data.energy_remain,
              persent: res.data.energy_budget == 0 ? 0 : ((res.data.energy_remain / res.data.energy_budget) * 100).toFixed(1),
              color: "#FA9E0D"
            }
          ];
          this.carbonList = [
            { name: "预算量", value: res.data.carbon_budget, persent: res.data.carbon_budget == 0 ? 0 : 100, color: "#0EC69A" },
            {
              name: "已用量",
              value: res.data.carbon_used,
              persent: res.data.carbon_budget == 0 ? 0 : ((res.data.carbon_used / res.data.carbon_budget) * 100).toFixed(1),
              color: "#37AFFA"
            },
            {
              name: "剩余量",
              value: res.data.carbon_remain,
              persent: res.data.carbon_budget == 0 ? 0 : ((res.data.carbon_remain / res.data.carbon_budget) * 100).toFixed(1),
              color: "#FA9E0D"
            }
          ];
          this.taggle();
        } else {
          this.budgetList = [];
          this.carbonList = [];
        }
      });
    },
    taggle() {
      this.timer = setInterval(() => {
        this.isShow = !this.isShow;
      }, 500000);
    },
    initChart(val) {
      let myChart = echarts.init(document.getElementById("carbonSource"));
      let option = {
        series: [
          {
            type: "liquidFill",
            name: "能耗",
            radius: "70%",
            itemStyle: {
              opacity: 0.55
            },
            data: [
              {
                name: "score",
                direction: "right",
                value: val,
                itemStyle: {
                  // opacity: 0.55,
                  normal: {
                    color: "#02CDF6"
                  }
                }
              },
              {
                name: "scores",
                direction: "right",
                value: 0.69,
                itemStyle: {
                  opacity: 0.55,
                  normal: {
                    color: "#134892"
                  }
                }
              },
              {
                name: "scorex",
                direction: "right",
                value: 0.45,
                itemStyle: {
                  opacity: 0.55,
                  normal: {
                    // color: 'red'
                  }
                }
              }
            ],
            backgroundStyle: {
              // 设置水球图内部背景色
              // borderColor: '#4348EC',
              // borderWidth: 10,
              color: "transparent" //水球图内部背景色
            },
            itemStyle: {
              opacity: 0.55
              // shadowBlur: 50,
              // shadowColor: 'rgba(0, 0, 0, 0.4)',
            },
            label: {
              // 设置百分比展示
              color: "#02CDF6",
              normal: {
                textStyle: {
                  fontSize: 20
                },
                formatter: function (param) {
                  return param.value * 100 + "%";
                }
              }
            }
            // outline: { // 是否显示外圈
            //   show: false
            // }
          }
        ]
      };
      myChart.setOption(option); // 更新option渲染页面
    },
    initChart2(val) {
      let myChart = echarts.init(document.getElementById("carbonSource2"));
      let option = {
        series: [
          {
            type: "liquidFill",
            name: "碳排",
            radius: "70%",
            itemStyle: {
              opacity: 0.55
            },
            data: [
              {
                name: "score",
                direction: "right",
                value: val,
                itemStyle: {
                  // opacity: 0.55,
                  normal: {
                    color: "#02CDF6"
                  }
                }
              },
              {
                name: "scores",
                direction: "right",
                value: 0.69,
                itemStyle: {
                  opacity: 0.55,
                  normal: {
                    color: "#134892"
                  }
                }
              },
              {
                name: "scorex",
                direction: "right",
                value: 0.45,
                itemStyle: {
                  opacity: 0.55,
                  normal: {
                    // color: 'red'
                  }
                }
              }
            ],
            backgroundStyle: {
              // 设置水球图内部背景色
              // borderColor: "#4348EC",
              // borderWidth: 10,
              color: "transparent" //水球图内部背景色
            },
            itemStyle: {
              opacity: 0.55
              // shadowBlur: 50,
              // shadowColor: 'rgba(0, 0, 0, 0.4)',
            },
            label: {
              // 设置百分比展示
              color: "#02CDF6",
              normal: {
                textStyle: {
                  fontSize: 20
                },
                formatter: function (param) {
                  return param.value * 100 + "%";
                }
              }
            }
            // outline: { // 是否显示外圈
            //   show: false
            // }
          }
        ]
      };
      myChart.setOption(option); // 更新option渲染页面
    }
  }
};
</script>
<style lang="scss" scoped>
.carbonSource {
  display: grid;
  grid-template-rows: 40% 57%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  height: 100%;
  .sourceTrendChart {
    background: url("@/assets/images/home/borderbg.png") no-repeat center;
    background-size: 100% 100%;
    > h1 {
      position: relative;
      height: 40px;
      padding-left: 30px;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      line-height: 40px;
      color: #ffffff;
      white-space: nowrap;
      border-bottom: 1px solid #225047;
      .yellow {
        position: absolute;
        top: 10px;
        left: 10px;
        display: inline-block;
        width: 5px;
        height: 18px;
        background: #ffeb46;
      }
      .green {
        position: absolute;
        top: 15px;
        left: 15px;
        display: inline-block;
        width: 5px;
        height: 18px;
        background: #75ffab;
      }
    }
    .value-box {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: calc(100% - 42px);
      > span {
        display: inline-block;
        height: 65px;
        padding: 0 8px;
        font-size: 30px;
        font-weight: bold;
        line-height: 65px;
        color: #ffffff;
        text-align: center;
        background: url("@/assets/images/home/111233.svg") no-repeat center;
        background-size: 100% 100%;
      }
      .point {
        padding: 0;
        font-size: 30px;
        line-height: 65px;
        color: #efbb05;
        background: none;
      }
    }
    .persent-box {
      display: grid;
      grid-auto-rows: 1fr 1fr 1fr;
      height: calc(100% - 42px);
      > div {
        display: grid;
        grid-template-columns: 50px 1fr 70px;
        align-items: center;
        padding: 0 20px;
        font-size: 13px;
        color: #ffffff;
        .value {
          text-align: right;
        }
      }
    }
  }
}
::v-deep(.el-progress-bar__outer) {
  background: #22463e;
  border-radius: 4px;
}
::v-deep(.el-progress-bar__inner) {
  border-radius: 4px;
}
</style>
