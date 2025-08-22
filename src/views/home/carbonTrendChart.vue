<template>
  <div class="carbonTrendChart">
    <h1>
      综合碳排趋势图
      <span class="yellow"></span>
      <span class="green"></span>
      <img class="dian" src="@/assets/images/home/dian.svg" alt="" />
    </h1>
    <div class="grid-background" id="carbonTrendChart" style="width: 100%; height: calc(100% - 43px)"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      myChart: null,
      resizeHandler: null,
      dateType: "month",
      sourceList: [],
      chartShow: "line"
    };
  },
  mounted() {
    //图表自适应宽高
    this.resizeHandler = () => {
      if (this.myChart) {
        this.myChart.resize();
      }
    };
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeUnmount() {
    // 或者使用 unmounted 如果你是使用的 Composition API
    // 清理事件监听器
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  },
  methods: {
    initEchart(sourceList) {
      this.sourceList = sourceList;
      let xData = [];
      let nameData = [];
      this.sourceList.map(v => {
        if (this.dateType == "year" && !xData.includes(v.year)) {
          xData.push(v.year);
        } else if (this.dateType == "month" && !xData.includes(v.month)) {
          xData.push(v.month);
        }
        if (v.varieties_name && !nameData.includes(v.varieties_name)) {
          nameData.push(v.varieties_name);
        }
      });
      let seriesList = [];
      nameData.map(k => {
        let obj = {
          name: k,
          type: this.chartShow,
          barMaxWidth: 20,
          data: []
        };
        xData.map(v => {
          let ary = [];
          if (this.dateType == "year") {
            ary = this.sourceList.filter(j => j.year == v && j.varieties_name == k);
          }
          if (this.dateType == "month") {
            ary = this.sourceList.filter(j => j.month == v && j.varieties_name == k);
          }
          if (ary.length > 0) {
            obj.data.push(ary[0].carbon_budget);
          } else {
            obj.data.push(0);
          }
        });
        seriesList.push(obj);
      });
      let xList = [];
      xData.map(v => {
        let val = this.dateType == "year" ? v + "年" : v + "月";
        xList.push(val);
      });
      this.myChart = echarts.init(document.getElementById("carbonTrendChart"));
      if (seriesList.length == 0) {
        this.myChart.setOption({}, true);
        return;
      }
      // 将多个series合并成一个
      let totalData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      seriesList.map(v => {
        v.data.map((j, i) => {
          totalData[i] += Number(v.data[i]);
        });
      });
      totalData.map((v, i) => {
        totalData[i] = Number(v.toFixed(2));
      });
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
          bottom: "3%",
          top: "15%",
          containLabel: true
        },
        textStyle: {
          color: "#ffffff"
        },
        xAxis: [
          {
            type: "category",
            data: xList,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "/tCO₂eq",
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            }
          }
        ],
        series: {
          type: "line",
          data: totalData,
          name: "综合碳排量",
          smooth: true,
          areaStyle: {},
          lineStyle: {
            width: 1
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgb(14, 198, 154, 90)" },
              { offset: 1, color: "rgb(14, 198, 154, 0)" }
            ])
          }
        }
      };

      this.myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.carbonTrendChart {
  height: 100%;
  color: #ffffff;
  > h1 {
    position: relative;
    height: 40px;
    padding-left: 30px;
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    line-height: 40px;
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
    .dian {
      position: absolute;
      top: 25px;
      right: 15px;
    }
  }
}
</style>
