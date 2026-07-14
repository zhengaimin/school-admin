<template>
  <div id="fullscreenBox" class="home-box">
    <div class="top-header">
      <el-select size="small" class="year-box" @change="changeYear" v-model="year" style="width: 142px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div>
        <img src="@/assets/images/energy/titlename.svg" alt="" srcset="" />
      </div>
      <div v-if="!fullFlag" class="full-box" @click="fullScreen">
        <img style="width: 22px; height: 22px" src="@/assets/images/energy/quanpin-o.svg" alt="" srcset="" />
      </div>
      <div v-else class="full-box" @click="outfullScreen">
        <img style="width: 22px; height: 22px" src="@/assets/images/energy/tuichuquanpin-o.svg" alt="" srcset="" />
      </div>
    </div>
    <div class="echart-box">
      <div class="left-box">
        <div>
          <sourceTrendChart ref="sourceTrendChart" />
        </div>
        <div>
          <sourcePercentageChart ref="sourcePercentageChart" />
        </div>
        <div>
          <analysisChart ref="analysisChart" />
        </div>
      </div>
      <div class="center-box">
        <div class="center-box-top">
          <carbonSource ref="carbonSource" />
        </div>
        <div class="center-box-bottom">
          <img src="@/assets/images/home/map.svg" alt="" srcset="" />
        </div>
      </div>
      <div class="right-box">
        <div>
          <carbonTrendChart ref="carbonTrendChart" />
        </div>
        <div>
          <carbonPercentageChart ref="carbonPercentageChart" />
        </div>
        <div>
          <carbonAnalysisChart ref="carbonAnalysisChart" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cal_trend, yearly_flow } from "@/api/modules/carbonAnalysis.js";
import sourceTrendChart from "./sourceTrendChart.vue";
import sourcePercentageChart from "./sourcePercentageChart.vue";
import analysisChart from "./analysisChart.vue";
import carbonSource from "./carbonSource.vue";
import carbonTrendChart from "./carbonTrendChart.vue";
import carbonPercentageChart from "./carbonPercentageChart.vue";
import carbonAnalysisChart from "./carbonAnalysisChart.vue";
export default {
  name: "HomePage",
  components: {
    sourceTrendChart,
    sourcePercentageChart,
    analysisChart,
    carbonSource,
    carbonTrendChart,
    carbonPercentageChart,
    carbonAnalysisChart
  },
  data() {
    return {
      currentyear: "",
      year: "",
      fullFlag: false
    };
  },
  computed: {
    options() {
      let arr = [];
      for (let i = this.currentyear; i >= 2000; i--) {
        arr.push({ label: `${i}年`, value: `${i}` });
      }
      return arr;
    }
  },
  mounted() {
    this.currentyear = new Date().getFullYear();
    this.year = (new Date().getFullYear() - 1).toString();
    this.initPage();
    // 监听全屏状态变化
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", this.onFullscreenChange);
    document.addEventListener("mozfullscreenchange", this.onFullscreenChange);
    document.addEventListener("MSFullscreenChange", this.onFullscreenChange);
  },
  methods: {
    fullScreen() {
      this.fullFlag = true;
      let dom = document.getElementById("fullscreenBox");
      if (dom.requestFullscreen) {
        dom.requestFullscreen();
      } else if (dom.mozRequestFullScreen) {
        // Firefox
        dom.mozRequestFullScreen();
      } else if (dom.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        dom.webkitRequestFullscreen();
      } else if (dom.msRequestFullscreen) {
        // IE/Edge
        dom.msRequestFullscreen();
      }
      this.initPage();
    },
    outfullScreen() {
      this.fullFlag = false;
      location.reload();
    },
    onFullscreenChange() {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        // 如果没有元素处于全屏状态，说明已经退出全屏
        this.outfullScreen();
      } else {
        console.log("In fullscreen mode");
      }
    },
    changeYear() {
      this.initPage();
    },
    initPage() {
      this.cal_trend(this.year);
      this.$refs.carbonSource.initPage(this.year);
      this.$refs.sourcePercentageChart.search_energy_proportion(this.year);
      this.$refs.carbonPercentageChart.search_carbon_boundary(this.year);
      this.get_yearly_flow(this.year);
    },
    cal_trend(year) {
      let first_time = Number((Date.UTC(year, 0, 1) / 1000).toFixed(0));
      let last_time = Number((Date.UTC(year, 11, 1) / 1000).toFixed(0));
      let str = `process_id=0&type=2&first_time=${first_time}&last_time=${last_time}`;
      cal_trend(str).then(res => {
        if (res.code == 0 && res.data.length > 0) {
          this.$refs.sourceTrendChart.initEchart(res.data);
          this.$refs.carbonTrendChart.initEchart(res.data);
        } else {
          this.$refs.sourceTrendChart.initEchart([]);
          this.$refs.carbonTrendChart.initEchart([]);
        }
      });
    },
    get_yearly_flow(year) {
      let first_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let last_time = Number((Date.UTC(year) / 1000).toFixed(0));
      let str = `time_type=1&first_time=${first_time}&last_time=${last_time}`;
      yearly_flow(str).then(res => {
        if (res.code == 0 && res.data.list && res.data.list.length > 0) {
          this.yearlyFlowList = res.data.list.filter(v => v.variety_type == 1);
          this.yearlyFlowData = res.data.list;
          let result = this.parseDataForECharts(this.yearlyFlowList, "energy_budget");
          let result1 = this.parseDataForECharts(this.yearlyFlowData, "carbon_budget");
          this.$refs.analysisChart.initEchart(result);
          this.$refs.carbonAnalysisChart.initEchart(result1);
        } else {
          this.$refs.analysisChart.initEchart({ xAxis: [], series: [] });
          this.$refs.carbonAnalysisChart.initEchart({ xAxis: [], series: [] });
        }
      });
    },
    //通义千问生成的算法
    parseDataForECharts(data, key) {
      // 初始化结果对象
      const result = {
        xAxis: [],
        series: []
      };
      // 获取所有不同的工艺过程名称
      const processNames = new Set(data.map(item => item.process_name));
      processNames.forEach(processName => result.xAxis.push(processName));

      // 获取所有不同的原材料名称
      const varietiesNames = new Set(data.map(item => item.varieties_name));
      varietiesNames.forEach(varietiesName => {
        result.series.push({
          name: varietiesName,
          type: "bar",
          barWidth: 10,
          data: Array.from({ length: processNames.size }, () => 0)
        });
      });

      // 填充数据
      data.forEach(item => {
        const index = result.xAxis.indexOf(item.process_name);
        const seriesIndex = result.series.findIndex(series => series.name === item.varieties_name);
        if (index >= 0 && seriesIndex >= 0) {
          result.series[seriesIndex].data[index] = item[key];
        }
      });
      return result;
    }
  }
};
</script>
<style scoped lang="scss">
.home-box {
  height: 100%;
  background: url("@/assets/images/home/bg.jpg") no-repeat center center;
  background-size: 100% 100%;
  border-radius: 10px;
  .top-header {
    position: relative;
    height: 96px;
    background: url("@/assets/images/home/top.svg") no-repeat center center;
    background-size: 100% 100%;
    ::v-deep(.el-select--small .el-select__wrapper) {
      background: linear-gradient(to bottom, #082925, #225047);
      border-radius: 4px;
      box-shadow: inset 0 1px 5px 0 rgb(210 255 247 / 100%);
    }
    ::v-deep(.el-select__selected-item) {
      color: #ffffff !important;
    }
    > div {
      height: 100%;
      font-size: 38px;
      line-height: 85px;
      color: #ffffff;
      text-align: center;
    }
    .year-box {
      position: absolute;
      top: 35px;
      left: 20px;
    }
    .full-box {
      position: absolute;
      top: 40px;
      right: 20px;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 25px;
      height: 25px;
      cursor: pointer;
      border: 2px solid #225047;
      border-radius: 3px;
    }
  }
  .echart-box {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-gap: 0 20px;
    height: calc(100% - 96px);
    padding: 0 20px;
    .left-box {
      height: calc(100% - 10px);
      > div {
        height: calc(33% - 10px);
        margin-bottom: 10px;
        background: url("@/assets/images/home/borderbg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .center-box {
      height: calc(100% - 10px);
      .center-box-top {
        height: 40%;
      }
      .center-box-bottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 60%;
        > img {
          width: 80%;
          height: 80%;
        }
      }
    }
    .right-box {
      height: calc(100% - 10px);
      > div {
        height: calc(33% - 10px);
        margin-bottom: 10px;
        background: url("@/assets/images/home/borderbg.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
