<template>
  <div class="echart-dom">
    <div class="echart-box">
      <h1>
        {{ titleObj[title] }}
        <div>
          <el-popover placement="bottom" :width="100" trigger="click">
            <template #reference>
              <img
                src="@/assets/images/common/catalogue-circle-o-3.svg"
                alt=""
                style="width: 18px; height: 18px; cursor: pointer"
              />
            </template>
            <div class="popover-box" style="line-height: 30px; color: #1f304c">
              <div class="tree-btn" @click="taggle(1)">折线图</div>
              <div class="tree-btn" @click="taggle(2)">柱状图</div>
              <!-- <div class="tree-btn" @click="taggle(3)">饼图</div> -->
              <div class="tree-btn" @click="taggle(4)">仪表盘</div>
            </div>
          </el-popover>
        </div>
      </h1>
      <div :id="isChart" style="width: 100%; height: 350px"></div>
    </div>
  </div>
</template>
<script>
import { currentKey } from "@/assets/json/currentData.js";
import * as echarts from "echarts";
export default {
  props: {
    isChart: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      val: 1,
      valObj: {},
      myChart: null,
      xlist: [],
      ylist: []
    };
  },
  computed: {
    titleObj() {
      let obj = {};
      currentKey.map(v => {
        obj[v.value] = v.name;
      });
      return obj;
    },
    titleUnitObj() {
      let obj = {};
      currentKey.map(v => {
        obj[v.value] = v.unit;
      });
      return obj;
    }
  },
  //监听list
  watch: {
    list: {
      handler(newVal) {
        console.log(newVal);
        let lastObj = newVal[newVal.length - 1];
        this.updateChart(lastObj);
      },
      deep: true
    }
  },
  mounted() {
    this.valObj = JSON.parse(localStorage.getItem("valObj"));
    if (this.valObj) {
      this.val = this.valObj[this.title] ? this.valObj[this.title] : 1;
    } else {
      this.valObj = {};
    }
    this.$nextTick(() => {
      this.renderChart();
    });
  },
  methods: {
    taggle(val) {
      this.valObj = JSON.parse(localStorage.getItem("valObj")) ? JSON.parse(localStorage.getItem("valObj")) : {};
      this.val = val;
      this.valObj[this.title] = val;
      localStorage.setItem("valObj", JSON.stringify(this.valObj));
      this.renderChart();
    },
    renderChart() {
      let domElement = document.getElementById(this.isChart);
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      this.myChart = echarts.init(domElement);
      let optionLine = {
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
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: this.titleUnitObj[this.title],
            type: "value"
          }
        ],
        series: [
          {
            // name: "Direct",
            type: "line",
            smooth: true,
            areaStyle: {},
            barMaxWidth: 20,
            itemStyle:
              this.val == 3
                ? {}
                : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#0EC69A" },
                      { offset: 0.5, color: "#4fd6b5" },
                      { offset: 1, color: "#7de0c9" }
                    ])
                  },
            data: []
          }
        ]
      };
      let optionBar = {
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
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: this.titleUnitObj[this.title],
            type: "value"
          }
        ],
        series: [
          {
            // name: "Direct",
            type: "bar",
            smooth: true,
            areaStyle: {},
            barMaxWidth: 20,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0EC69A" },
                { offset: 0.5, color: "#4fd6b5" },
                { offset: 1, color: "#7de0c9" }
              ])
            },
            data: []
          }
        ]
      };
      let optionPie = {
        series: [
          {
            type: "pie",
            radius: ["30%", "48%"],
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
            data: this.list
          }
        ]
      };
      let optionGauge = {
        series: [
          {
            name: "",
            type: "gauge",
            detail: {
              formatter: value => {
                return value + "(" + this.titleUnitObj[this.title] + ")";
              }
            },
            data: [
              {
                value: 0,
                name: ""
              }
            ]
          }
        ]
      };
      let option = this.val == 1 ? optionLine : this.val == 2 ? optionBar : this.val == 3 ? optionPie : optionGauge;
      this.myChart.setOption(option);
    },
    updateChart(lastObj) {
      this.xlist.push(lastObj.ts);
      this.ylist.push(lastObj[this.title]);

      // 移除旧数据
      if (this.xlist.length > 20) {
        this.xlist.shift();
        this.ylist.shift();
      }

      if (this.val == 1 || this.val == 2) {
        this.myChart.setOption({
          xAxis: {
            data: this.xlist
          },
          series: [
            {
              data: this.ylist
            }
          ]
        });
      } else if (this.val == 4) {
        // 刷新图表
        this.myChart.setOption({
          series: [
            {
              data: [
                {
                  name: lastObj.ts,
                  value: lastObj[this.title].toFixed(2)
                }
              ]
            }
          ]
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.echart-dom {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  .echart-box {
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #4a5975;
      border-bottom: 1px solid #ebeef5;
      > img {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }
  }
}
::v-deep(.el-popper) {
  padding: 0;
}
.popover-box {
  .tree-btn {
    cursor: pointer;
  }
  .tree-btn:hover {
    color: #0ec69a;
    border-radius: 5px;
  }
}
</style>
