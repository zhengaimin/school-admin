<template>
  <div class="center-echart">
    <div>
      <div class="chart-value">
        <h1>
          <span> 综合能源趋势图 </span>
          <img v-if="chartShow == 'bar'" @click="changeShow('line')" src="@/assets/images/home/line.svg" alt="" srcset="" />
          <img v-else @click="changeShow('bar')" src="@/assets/images/home/bar.svg" alt="" srcset="" />
        </h1>
        <div id="Chart1" style="width: 100%; height: 380px"></div>
      </div>
    </div>
    <div>
      <div class="chart-value">
        <h1>
          <span> 综合碳排量趋势图 </span>
          <img
            v-if="chartShowRight == 'bar'"
            @click="changeShowRight('line')"
            src="@/assets/images/home/line.svg"
            alt=""
            srcset=""
          />
          <img v-else @click="changeShowRight('bar')" src="@/assets/images/home/bar.svg" alt="" srcset="" />
        </h1>
        <div id="Chart2" style="width: 100%; height: 380px"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { cal_trend } from "@/api/modules/carbonAnalysis.js";
export default {
  name: "CenterChart",
  props: {
    dateType: {
      type: String
    }
  },
  data() {
    return {
      sourceList: [],
      chartShow: "bar",
      chartShowRight: "bar"
    };
  },

  methods: {
    initPage(str) {
      let params = str.replace("start_time", "first_time").replace("end_time", "last_time").replace("time_type", "type");
      this.cal_trend(params);
    },
    cal_trend(str) {
      cal_trend(str).then(res => {
        if (res.code == 0 && res.data.length > 0) {
          this.sourceList = res.data;

          this.initEchart();
          this.chartSource();
        }
      });
    },
    changeShow(val) {
      this.chartShow = val;
      this.initEchart();
    },
    changeShowRight(val) {
      this.chartShowRight = val;
      this.chartSource();
    },
    initEchart() {
      let xData = [];
      let nameData = [];
      let sourceList_filter = this.sourceList.filter(v => v.emission_process_type != 5 && v.emission_process_type != 6);

      sourceList_filter.map(v => {
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
            ary = sourceList_filter.filter(j => j.year == v && j.varieties_name == k);
          }
          if (this.dateType == "month") {
            ary = sourceList_filter.filter(j => j.month == v && j.varieties_name == k);
          }
          if (ary.length > 0) {
            obj.data.push(ary[0].energy_budget);
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
      let myChart = echarts.init(document.getElementById("Chart1"));
      if (seriesList.length == 0) {
        myChart.setOption({}, true);
        return;
      }
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
          containLabel: true
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
            name: "单位：tce",
            type: "value"
          }
        ],
        series: seriesList
        // series: [
        //   {
        //     // name: "Direct",
        //     type: "bar",
        //     barMaxWidth: 20,
        //     // barWidth: 30,
        //     // itemStyle: {
        //     //   color: "#0EC69A"
        //     // },
        //     // itemStyle: {
        //     //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     //     { offset: 0, color: "#0EC69A" },
        //     //     { offset: 0.5, color: "#4fd6b5" },
        //     //     { offset: 1, color: "#7de0c9" }
        //     //   ])
        //     // },
        //     data: yData
        //   },
        //   {
        //     // name: "Direct",
        //     type: "bar",
        //     barMaxWidth: 30,
        //     // itemStyle: {
        //     //   color: "#0EC69A"
        //     // },
        //     // itemStyle: {
        //     //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     //     { offset: 0, color: "#0EC69A" },
        //     //     { offset: 0.5, color: "#4fd6b5" },
        //     //     { offset: 1, color: "#7de0c9" }
        //     //   ])
        //     // },
        //     data: yData
        //   }
        // ]
      };

      myChart.setOption(option);
    },
    chartSource() {
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
          type: this.chartShowRight,
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
            obj.emission_process_type = ary[0].emission_process_type;
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
      // 合并熟料
      let seriesListAdd = [];
      let list = seriesList.filter(v => v.emission_process_type != 5 && v.emission_process_type != 6);
      let list1 = seriesList.filter(v => v.emission_process_type == 5 || v.emission_process_type == 6);
      if (list1.length > 0) {
        let length = list1[0].data.length;
        // 初始化一个空的对象，用于存放最终合并后的 data
        let mergedData = {
          name: "熟料生产过程排放",
          type: this.chartShowRight,
          barMaxWidth: 20,
          data: new Array(length).fill(0)
        };
        // 遍历原始数据
        list1.forEach(item => {
          // 遍历当前 item 的 data 数组
          item.data.forEach((value, index) => {
            // 累加到 mergedData 的对应位置
            mergedData.data[index] += parseFloat(value);
            mergedData.data[index] = Math.round(mergedData.data[index] * 100) / 100;
          });
        });
        seriesListAdd = list.concat(mergedData);
      } else {
        seriesListAdd = list;
      }
      let myChart = echarts.init(document.getElementById("Chart2"));
      myChart.clear();
      if (seriesList.length == 0) {
        myChart.setOption({}, true);
        return;
      }
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
          containLabel: true
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
            name: "单位：/tCO₂eq",
            type: "value"
          }
        ],
        series: seriesListAdd
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.center-echart {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  height: 470px;
  margin-top: 15px;
  > div {
    background: #ffffff;
    border-radius: 10px;
    .chart-value {
      height: 378px;
      margin-top: 12px;
      background: #ffffff;
      border-radius: 10px;
      > h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        padding: 0 20px;
        margin: 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 56px;
        color: #1f304c;
        border-bottom: 1px solid #f4f6fa;
        > img {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
