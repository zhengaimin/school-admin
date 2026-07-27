<template>
  <div class="sourcePercentageChart">
    <h1>
      能源占比图
      <span class="yellow"></span>
      <span class="green"></span>
      <img class="dian" src="@/assets/images/home/dian.svg" alt="" />
    </h1>
    <div class="grid-background" id="sourcePercentageChart" style="width: 100%; height: calc(100% - 43px)"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { energy_proportion } from "@/api/modules/carbonAnalysis.js";
export default {
  data() {
    return {
      myChart: null,
      resizeHandler: null
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
    //查询综合能源占比
    search_energy_proportion(year) {
      let first_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let last_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let str = `process_id=0&time_type=1&start_time=${first_time}&end_time=${last_time}`;
      energy_proportion(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.percentList = [];
          res.data.list.map(v => {
            this.percentList.push({
              name: v.variety_name,
              value: Number(v.consumption).toFixed(2)
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
      this.myChart = echarts.init(document.getElementById("sourcePercentageChart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} ({c}tce)<br/>{d}% "
        },
        series: [
          {
            // 第四环
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["29%", "31%"],
            startAngle: 50,
            hoverAnimation: false,
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false,
                color: "#fff"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(13, 205, 88, 0.85)"
              }
            },

            data: [1]
          },
          {
            // 第三环
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["26%", "27%"],
            startAngle: 50,
            hoverAnimation: false,
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false,
                color: "#fff"
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(14,198,154, 0.65)"
              }
            },
            data: [1]
          },
          {
            // 第二环
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["18%", "18.5%"],
            startAngle: 50,
            hoverAnimation: false,
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(13,205,88, 0.45)"
              }
            },
            data: [1]
          },
          {
            // 第一环
            type: "pie",
            zlevel: 2,
            silent: true,
            radius: ["15%", "15.5%"],
            startAngle: 50,
            hoverAnimation: false,
            // animation:false,    //charts3 no
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(14,198,154, 0.25)"
              }
            },
            data: [1]
          },
          {
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: false,
            padAngle: 2,

            label: {
              show: true,
              formatter: "{b|{b}} {c|({c}tCO₂eq)} \n {d|{d}%}  ",
              rich: {
                b: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: "#ffffff"
                },
                d: {
                  fontSize: 16,
                  lineHeight: 20,
                  color: "#3EDDBB"
                },
                c: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: "#ffffff",
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
              borderRadius: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
              normal: {
                color: function (params) {
                  let colorList = ["#0EC69A", "#02C0E9", "#FA9E0D", "#F23D4F", "#0DCD58", "#37AFFA", "#EFBB05", "#696FE7"];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: this.percentList
          }
        ]
      };
      this.myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.sourcePercentageChart {
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
