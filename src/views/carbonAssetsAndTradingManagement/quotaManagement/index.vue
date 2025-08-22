<template>
  <div class="carbon-analysis">
    <div class="content">
      <h1>
        <span> 每日碳价趋势图 </span>
        <div>
          <span style="width: 40px"> 时间 </span>
          <el-select v-model="dateType" style="width: 180px">
            <el-option v-for="v in dateTypeList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
          <span> 国内市场 </span>
          <el-select v-model="addressAry" multiple collapse-tags style="width: 300px; margin-right: 10px">
            <el-option v-for="v in addressList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
          <el-button type="primary" @click="getCarbonPrice">查询</el-button>
        </div>
      </h1>
      <div id="Chart1" style="width: 100%; height: 370px"></div>
    </div>
    <div class="content">
      <h1>
        <span> 碳资产概况 </span>
        <div>
          <span> 国内市场 </span>
          <el-select @change="asset_list" v-model="addressValue" style="width: 300px; margin-right: 10px">
            <el-option v-for="v in addressList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
        </div>
      </h1>
      <div class="table-box table-list">
        <el-table class="my-custom-table" :data="assetList">
          <el-table-column label="月份" align="left">
            <template #default="{ row }">
              <div>{{ row.month }}月</div>
            </template>
          </el-table-column>
          <el-table-column label="碳排放量(tCO₂eq)" align="left">
            <template #default="{ row }">
              <div v-if="row.carbon_emission == 0">{{ row.carbon_emission }}</div>
              <div v-else-if="row.carbon_emission < 0" style="color: #0dcd58">{{ row.carbon_emission }}</div>
              <div v-else style="color: #f23d4f">+{{ row.carbon_emission }}</div>
            </template>
          </el-table-column>
          <el-table-column label="配额量(tCO₂eq)" align="left">
            <template #default="{ row }">
              <div v-if="row.quota == 0">{{ row.quota }}</div>
              <div v-else-if="row.quota < 0" style="color: #0dcd58">{{ row.quota }}</div>
              <div v-else style="color: #f23d4f">+{{ row.quota }}</div>
            </template>
          </el-table-column>
          <el-table-column label="配额盈余量(tCO₂eq)" align="left">
            <template #default="{ row }">
              <div v-if="row.quota_surplus == 0">{{ row.quota_surplus }}</div>
              <div v-else-if="row.quota_surplus < 0" style="color: #0dcd58">{{ row.quota_surplus }}</div>
              <div v-else style="color: #f23d4f">+{{ row.quota_surplus }}</div>
            </template>
          </el-table-column>
          <el-table-column label="市场价格(￥/tCO₂eq)" align="left">
            <template #default="{ row }">
              <div v-if="row.market_price == 0">{{ row.market_price }}</div>
              <div v-else-if="row.market_price < 0" style="color: #0dcd58">{{ row.market_price }}</div>
              <div v-else style="color: #f23d4f">+{{ row.market_price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="碳资产总值(￥)" align="left">
            <template #default="{ row }">
              <div v-if="row.total_value == 0">{{ row.total_value }}</div>
              <div v-else-if="row.total_value < 0" style="color: #0dcd58">{{ row.total_value }}</div>
              <div v-else style="color: #f23d4f">+{{ row.total_value }}</div>
            </template>
          </el-table-column>
          <el-table-column label="碳资产盈亏值(￥)" align="left">
            <template #default="{ row }">
              <div v-if="row.profit_loss == 0">{{ row.profit_loss }}</div>
              <div v-else-if="row.profit_loss < 0" style="color: #0dcd58">{{ row.profit_loss }}</div>
              <div v-else style="color: #f23d4f">+{{ row.profit_loss }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom-box">
      <div style="margin-right: 10px">
        <div class="left-value">
          <div class="img-box">
            <img src="@/assets/images/carbonAssets/money.svg" alt="" />
          </div>
          <div class="persent-box">
            <h1>截止当月配额盈余量</h1>
            <div class="h2">
              <span>{{ carbon_overviewData.quota_surplus }}</span>
              <h3>
                同比去年
                <span> {{ carbon_overviewData.quota_surplus_yoy }}% </span>
              </h3>
            </div>
          </div>
        </div>
        <div class="message">今年截止上月的碳排放量控制的都很不错, 继续保持</div>
        <div class="value-message"><span></span> 截止当月配额量{{ carbon_overviewData.quota }}(tCO₂eq)</div>
        <div class="value-message"><span></span>截止当月碳排放量{{ carbon_overviewData.carbon_emission }}(tCO₂eq)</div>
      </div>
      <div class="bottom-echart">
        <h1>
          <span> 碳资产盈亏分布图 </span>
          <div>
            <img src="@/assets/images/carbonAssets/bar.svg" alt="" />
            <span> 碳资产盈亏量 </span>
            <img src="@/assets/images/carbonAssets/line.svg" alt="" />
            <span> 碳资产盈亏值 </span>
          </div>
        </h1>
        <div id="Chart33" style="width: 100%; height: 243px"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { daily_carbon_price_trend, carbon_overview, asset_list } from "@/api/modules/carbonAnalysis.js";
export default {
  data() {
    return {
      dateTypeList: [
        { name: "近一周", id: "6" },
        { name: "近一月", id: "30" },
        { name: "近一年", id: "365" }
      ],
      addressList: [
        { name: "全国CEA19-20", id: "全国CEA19-20" },
        { name: "全国CEA21", id: "全国CEA21" },
        { name: "全国CEA22", id: "全国CEA22" },
        { name: "上海SHEA", id: "上海SHEA" },
        { name: "湖北HBEA", id: "湖北HBEA" },
        { name: "天津TJEA", id: "天津TJEA" },
        { name: "北京BEA", id: "北京BEA" },
        { name: "重庆CQEA", id: "重庆CQEA" },
        { name: "广东GDEA", id: "广东GDEA" },
        { name: "福建FJEA", id: "福建FJEA" },
        { name: "深圳SZEA", id: "深圳SZEA" }
      ],
      dateType: "30",
      addressAry: [
        "全国CEA19-20",
        "全国CEA21",
        "全国CEA22",
        "上海SHEA",
        "湖北HBEA",
        "天津TJEA",
        "北京BEA",
        "重庆CQEA",
        "广东GDEA",
        "福建FJEA",
        "深圳SZEA"
      ],
      addressValue: "全国CEA19-20",
      carbon_overviewData: {},
      assetList: []
    };
  },
  mounted() {
    this.daily_carbon_price_trend();
    this.carbon_overview();
    this.asset_list();
  },
  methods: {
    //获取时间戳
    getPastSevenDaysTimestamps() {
      const today = new Date();
      // 获取昨天的日期
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // 设置时间为昨天0点
      yesterday.setHours(0, 0, 0, 0);

      // 计算前七天的日期
      const sevenDaysAgo = new Date(yesterday);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - this.dateType); // 因为已经是从昨天开始，所以是-6而不是-7

      // 设置时间为前七天0点
      sevenDaysAgo.setHours(0, 0, 0, 0);
      // 获取前七天0点的时间戳
      const startOfSevenDaysAgo = sevenDaysAgo.getTime();

      // 设置时间为昨天23:59:59
      yesterday.setHours(23, 59, 59, 999);
      // 获取昨天23:59:59的时间戳
      const endOfYesterday = yesterday.getTime();

      return {
        startOfSevenDaysAgo: startOfSevenDaysAgo,
        endOfYesterday: endOfYesterday
      };
    },
    daily_carbon_price_trend() {
      const timestamps = this.getPastSevenDaysTimestamps();
      const begin_ts = (timestamps.startOfSevenDaysAgo / 1000).toFixed(0);
      const end_ts = (timestamps.endOfYesterday / 1000).toFixed(0);
      let product_names = this.addressAry.join(",");
      let params = `begin_ts=${begin_ts}&end_ts=${end_ts}&product_names=${product_names}`;
      daily_carbon_price_trend(params).then(res => {
        if (res.code == 0) {
          this.renderChart(res.data);
        }
      });
    },
    getCarbonPrice() {
      this.daily_carbon_price_trend();
    },
    renderChart(data) {
      let myChart = echarts.init(document.getElementById("Chart1"));
      if (data.length == 0) {
        myChart.setOption({}, true);
        return;
      }
      let xData = [];
      let series = [];
      data.map(v => {
        let ary = [];
        v.price_info.map(k => {
          ary.push(k.final_price);
          if (xData.indexOf(k.date) == -1) {
            xData.push(k.date);
          }
        });
        series.push({ name: v.product_name, type: "line", barMaxWidth: 20, symbol: "none", data: ary });
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
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "收盘价（元/吨）",
            type: "value"
          }
        ],
        series: series
        // series: [
        //   {
        //     name: "Direct",
        //     type: "line",
        //     barMaxWidth: 20,

        //     data: [23, "/", 12, 34]
        //   }
        // ]
      };
      myChart.setOption(option);
    },

    asset_list() {
      asset_list(`product_name=${this.addressValue}`).then(res => {
        if (res.code == 0) {
          this.assetList = res.data;
          this.renderChart1(res.data);
        }
      });
    },

    renderChart1(data) {
      let xData = [];
      let yData1 = [];
      let yData2 = [];
      data.map(v => {
        xData.push(v.month + "月");

        if (v.quota_surplus < 0) {
          yData1.push({
            value: v.quota_surplus,
            itemStyle: {
              color: "#17D4B0"
            }
          });
        } else {
          yData1.push(v.quota_surplus);
        }
        if (v.profit_loss < 0) {
          yData2.push({
            value: v.profit_loss,
            itemStyle: {
              color: "#17D4B0"
            }
          });
        } else {
          yData2.push(v.profit_loss);
        }
      });
      let domElement = document.getElementById("Chart33");
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      let myChart = echarts.init(domElement);
      const colors = ["#FA7087", "#17D4B0", "#8699BC"];
      let option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          top: "20%",
          right: "8%",
          left: "8%",
          bottom: "15%"
        },

        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "盈亏量(吨)",
            position: "left",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "盈亏值(元)",
            position: "right",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "盈亏量",
            type: "bar",
            barWidth: 25,
            data: yData1
          },
          {
            name: "盈亏值",
            type: "line",
            yAxisIndex: 1,
            data: yData2
          }
        ]
      };
      myChart.setOption(option);
    },
    //碳资产概览
    carbon_overview() {
      carbon_overview().then(res => {
        this.carbon_overviewData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.carbon-analysis {
  .form-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding-top: 20px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    .grid-content {
      padding-left: 20px;
    }
  }
  .content {
    margin-bottom: 10px;
    overflow: hidden;
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
        justify-content: flex-end;
        width: 750px;
        font-size: 16px;
        font-weight: normal;
        > span {
          display: inline-block;
          width: 70px;
          margin-right: 10px;
          margin-left: 15px;
          color: #4a5975;
          cursor: pointer;
        }
      }
    }
  }
  .bottom-box {
    display: grid;
    grid-template-columns: 450px 1fr;
    grid-auto-columns: 10px;
    height: 300px;
    > div {
      background: #ffffff;
      border-radius: 10px;
      .left-value {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 120px;
        border-bottom: 1px dashed #dee2eb;
        .img-box {
          width: 56px;
          height: 56px;
          margin: 0 20px;
          line-height: 56px;
          text-align: center;
          background: #fff4e2;
          border-radius: 20px;
          > img {
            width: 32px;
            height: 37px;
            margin-top: 9px;
          }
        }
        .persent-box {
          box-sizing: border-box;
          width: 340px;
          height: 90px;
          padding: 15px 0;
          > h1 {
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            color: #4a5975;
          }
          .h2 {
            display: flex;
            justify-content: space-between;
            height: 30px;
            margin: 8px 0 0;
            font-size: 28px;
            font-weight: 600;
            color: #1f304c;
            > h3 {
              margin: 0 10px 0 0;
              font-size: 12px;
              font-weight: 400;
              line-height: 50px;
              color: #8894b3;
            }
          }
        }
      }
      .message {
        margin: 25px 20px;
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
    .bottom-echart {
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
    }
  }
}
.green {
  color: #0dcd58;
}
.red {
  color: #f23d4f;
}
</style>
