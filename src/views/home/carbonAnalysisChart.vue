<template>
  <div class="sourceTrendChart">
    <h1>
      工序碳排分析图
      <span class="yellow"></span>
      <span class="green"></span>
      <img class="dian" src="@/assets/images/home/dian.svg" alt="" />
    </h1>
    <div class="grid-background" id="processCarban" style="width: 100%; height: calc(100% - 43px)"></div>
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
    // 使用箭头函数来保持正确的 this 上下文
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
      this.myChart = echarts.init(document.getElementById("processCarban"));
      let xdata = result["xAxis"];
      let seriesList = result["series"];
      if (seriesList.length == 0) {
        this.myChart.setOption({}, true);
        return;
      }
      // 将多个series合并成一个
      let totalData = [];
      seriesList.map(v => {
        v.data.map((j, i) => {
          totalData[i] = totalData[i] ? totalData[i] : 0;
          totalData[i] += Number(j);
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
          left: "2%",
          top: "3%",
          right: "15%",
          bottom: "3%",
          containLabel: true
        },
        textStyle: {
          color: "#ffffff"
        },
        xAxis: [
          {
            type: "value",
            name: "/tCO₂eq",
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisLabel: {
              // 设置X轴标签的旋转角度
              rotate: 45 // 可以是 -90 到 90 之间的任何值
            }
          }
        ],
        yAxis: {
          // type: "value",
          type: "category",
          data: xdata
        },
        series: {
          data: totalData,
          name: "综合碳排量",
          barWidth: 20,
          type: "bar",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#37AFFA" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#0EC69A" // 100% 处的颜色
                }
              ])
            }
          }
        }
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
