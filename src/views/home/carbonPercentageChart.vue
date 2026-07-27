<template>
  <div class="carbonPercentageChart">
    <h1>
      碳排占比图
      <span class="yellow"></span>
      <span class="green"></span>
      <img class="dian" src="@/assets/images/home/dian.svg" alt="" />
    </h1>
    <div class="grid-background" id="carbonPercentageChart" style="width: 100%; height: calc(100% - 43px)"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { cal_trend } from "@/api/modules/carbonAnalysis.js";
export default {
  data() {
    return {
      myChart: null,
      resizeHandler: null,
      percentList: []
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
    //查询二氧化碳排放-核算边界占比接口
    search_carbon_boundary(year) {
      let start_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let end_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let str = `process_id=0&type=1&first_time=${start_time}&last_time=${end_time}`;
      cal_trend(str).then(res => {
        if (res.code == 0 && res.data) {
          // 合并熟料
          let seriesListAdd = [];
          let list = res.data.filter(v => v.emission_process_type != 5 && v.emission_process_type != 6);
          let list1 = res.data.filter(v => v.emission_process_type == 5 || v.emission_process_type == 6);
          if (list1.length > 0) {
            let val = 0;
            list1.map(v => {
              val += Number(v.carbon_budget);
            });
            let ary = [
              {
                varieties_name: "熟料生产过程排放",
                carbon_budget: val
              }
            ];
            seriesListAdd = list.concat(ary);
          } else {
            seriesListAdd = list;
          }
          this.percentList = [];
          seriesListAdd.map(v => {
            this.percentList.push({
              name: v.varieties_name,
              value: Number(v.carbon_budget).toFixed(2)
            });
          });
          this.initEchart();
        } else {
          this.initEchart([]);
        }
      });
    },
    initEchart() {
      this.myChart = echarts.init(document.getElementById("carbonPercentageChart"));
      let option = {
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
                  let colorList = [
                    "#696FE7",
                    "#EFBB05",
                    "#37AFFA",
                    "#0DCD58",
                    "#F23D4F",
                    "#FA9E0D",
                    "#02C0E9",
                    "#0EC69A",
                    "#696FE7",
                    "#EFBB05",
                    "#37AFFA",
                    "#0DCD58",
                    "#F23D4F",
                    "#FA9E0D",
                    "#02C0E9",
                    "#0EC69A"
                  ];
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
.carbonPercentageChart {
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
