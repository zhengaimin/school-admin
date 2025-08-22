<template>
  <div class="sourceTrendChart">
    <h1>
      工序能源分析图
      <span class="yellow"></span>
      <span class="green"></span>
      <img class="dian" src="@/assets/images/home/dian.svg" alt="" />
    </h1>
    <div class="grid-background" id="processChart" style="width: 100%; height: calc(100% - 43px)"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      myChart: null,
      resizeHandler: null,
      yearlyFlowData: [],
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
    initEchart(result) {
      this.myChart = echarts.init(document.getElementById("processChart"));
      let xdata = result["xAxis"];
      let seriesList = result["series"];
      let legendData = [];
      seriesList.map(v => {
        legendData.push(v.name);
      });
      if (seriesList.length == 0) {
        this.myChart.setOption({}, true);
        return;
      }
      let option = {
        color: ["#0EC69A", "#37AFFA", "#0DCD58", "#F23D4F", "#696FE7", "#EFBB05", "#02C0E9"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          type: "scroll",
          top: 10,
          right: 15,
          padding: 2,
          textStyle: {
            color: "#ffffff"
          },
          itemWidth: 20,
          itemHeight: 7,
          data: legendData
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        textStyle: {
          color: "#ffffff"
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            data: xdata
          }
        ],
        yAxis: [
          {
            name: "/tce",
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            }
          }
        ],
        series: seriesList
      };

      this.myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.sourceTrendChart {
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
