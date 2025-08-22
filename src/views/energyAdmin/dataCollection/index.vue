<template>
  <div>
    <div class="process-content" v-if="flag == 1">
      <div class="filter-box">
        <el-popover placement="bottom" :width="400" trigger="hover">
          <template #reference>
            <div class="icon-box">
              <el-icon style="font-size: 16px; color: #fa9e0d"><QuestionFilled /></el-icon>
              <label> 配置能源消耗量填报的时间维度 </label>
            </div>
          </template>
          <div class="tips-box">
            <h1 style="display: flex; align-items: center; font-size: 14px">
              <el-icon style="margin-right: 5px; font-size: 16px; color: #fa9e0d"><QuestionFilled /></el-icon>提示信息
            </h1>
            <div style="padding-left: 20px; font-size: 14px">
              能源消耗量填报时间维度的配置，与产品产量一致，并且仅支持一年配置一次
            </div>
          </div>
        </el-popover>
        <el-date-picker @change="selectYear" style="width: 200px" v-model="year" value-format="YYYY" type="year" />
        <el-button style="margin-left: 10px" type="primary" @click="dialogTableVisible = true" v-if="fill_frequency == 0">
          设置年度填报频率
        </el-button>
      </div>
      <div class="date-box">
        <div class="calendar">
          <h1>
            <span>碳数据日历</span>
            <el-select
              v-if="fill_frequency == 1"
              @change="formateDate"
              v-model="month"
              placeholder="请选择月份"
              style="width: 100px"
            >
              <el-option v-for="item in monthList" :key="item.id" :label="item.name + '月'" :value="item.id" />
            </el-select>
          </h1>
          <!-- 月 -->
          <div class="month-box" v-if="fill_frequency == 2">
            <h2
              @click="selectMonth(2, v.id)"
              v-for="v in monthList"
              :label="v.name"
              :value="Number(v.id)"
              :key="v.id"
              :class="{ active: v.type == 2, 'select-active': month == v.id }"
            >
              <h3>{{ v.name }}</h3>
            </h2>
          </div>
          <!-- 日 -->
          <div class="month-box day-box" v-else-if="fill_frequency == 1">
            <h2
              @click="selectMonth(1, v.id)"
              v-for="v in dayList"
              :label="v.name"
              :value="Number(v.id)"
              :key="v.id"
              :class="{ active: v.type == 2, 'select-active': day == v.id }"
            >
              <h3 style="font-size: 14px">{{ v.name }}</h3>
            </h2>
          </div>
          <div class="month-box" v-else></div>

          <div class="bottom-box">
            <div>
              <h1>碳排放总量(tCO₂eq)</h1>
              <h2>
                {{ sourceObj.energy_total }}
                <span :class="{ low: sourceObj.energy_year_on_year < 0, upper: sourceObj.energy_year_on_year > 0 }">
                  同比去年 {{ (sourceObj.energy_year_on_year * 100).toFixed(2) }}%
                  <el-icon v-if="sourceObj.carbon_year_on_year > 0"><CaretTop /></el-icon>
                  <el-icon v-if="sourceObj.carbon_year_on_year < 0"><CaretBottom /></el-icon>
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div class="process-box">
          <h1>
            <h2>
              <h3 v-if="fill_frequency == 2">{{ strDate }}企业工序数据</h3>
              <h3 v-else>{{ year_month.replace("-", "年") }}月企业工序数据</h3>
              <p>{{ userInfo.tenant_name }}</p>
            </h2>
            <el-button
              :disabled="!isEdit || fill_frequency == 0"
              style="width: 140px"
              type="primary"
              class="search-btn"
              @click="startData()"
            >
              数据填报
            </el-button>
          </h1>
          <div class="table-msg">
            <div>
              <h1>工序能源消耗量(tce)</h1>
              <h2>
                <span class="val-box">{{ sourceObjMonth.energy_total }} </span>
                <span>同比去年</span> <span>{{ (sourceObjMonth.energy_year_on_year * 100).toFixed(2) }}%</span>
              </h2>
              <div class="list-box">
                <div v-for="(v, i) in yoyList" :key="i">
                  <span class="name" :title="v.process_name"><span class="tip"></span>{{ v.process_name }}</span>
                  <span class="value">{{ v.energy_budget }}</span>
                  <span class="present">同比去年 {{ (v.yoy_energy_budget * 100).toFixed(2) }}% </span>
                </div>
              </div>
            </div>
            <div>
              <h1>工序碳排放量(tCO₂eq)</h1>
              <h2>
                <span class="val-box">{{ sourceObjMonth.carbon_total }} </span>
                <span>同比去年</span> <span>{{ (sourceObjMonth.carbon_year_on_year * 100).toFixed(2) }}%</span>
              </h2>
              <div class="list-box">
                <div v-for="(v, i) in yoyList" :key="i">
                  <span class="name" :title="v.process_name"><span class="tip"></span>{{ v.process_name }}</span>
                  <span class="value">{{ v.carbon_budget }}</span>
                  <span class="present">同比去年 {{ (v.yoy_carbon_budget * 100).toFixed(2) }}% </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-box">
        <h1>数据列表</h1>
        <div class="table-list">
          <el-table class="my-custom-table" :data="calculateList">
            <el-table-column label="数据名称" prop="name">
              <template #default="{ row }">
                {{ row.year }}年{{ row.month }}月<span v-show="fill_frequency == 1">{{ row.commit_date }}日</span>
              </template>
            </el-table-column>
            <el-table-column label="综合能源使用量(tce)" prop="energy_budget" align="left"> </el-table-column>
            <el-table-column label="碳排放量(tCO₂eq)" prop="carbon_budget" align="left"> </el-table-column>
            <el-table-column label="操作" width="120px" align="center">
              <template #default="{ row }">
                <div class="table-btn">
                  <div @click="editMath(row)">编辑</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-else>
      <formConfig @go-back="goBack" :timestamp="timestamp" :strdate="strDate" :year="year"></formConfig>
    </div>
    <el-dialog v-model="dialogTableVisible" title="设置年度填报频率" width="600">
      <div class="tips-msg">
        <el-icon><WarningFilled /></el-icon>
        年度填报频率每年仅可设定一次，请确认后进行设置。
      </div>
      <div class="radio-box">
        <el-radio-group v-model="frequencyVal">
          <el-radio-button label="按月" value="2" />
          <el-radio-button label="按日" value="1" />
        </el-radio-group>
      </div>
      <div style="flex: auto; padding-right: 20px; text-align: right">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/modules/user";
import formConfig from "./formConfig.vue";
import {
  calculate,
  total_statistics,
  report_yoy,
  report_calculate,
  com_year_config,
  com_year_config_set
} from "@/api/modules/carbonAnalysis.js";
import { api_list } from "@/api/modules/menu.js";
// import { base_info } from "@/api/modules/login.ts";
export default {
  components: { formConfig },
  data() {
    return {
      fill_frequency: 0,
      buttonList: [],
      flag: 1,
      //月
      year: "",
      month: "",
      //日
      day: "",
      strDate: "",
      timestamp: "",
      // 查询的数据
      sourceObj: {},
      sourceObjMonth: {},
      monthList: [
        { name: "1", id: 1, type: 2 },
        { name: "2", id: 2, type: 2 },
        { name: "3", id: 3, type: 2 },
        { name: "4", id: 4, type: 2 },
        { name: "5", id: 5, type: 2 },
        { name: "6", id: 6, type: 2 },
        { name: "7", id: 7, type: 2 },
        { name: "8", id: 8, type: 2 },
        { name: "9", id: 9, type: 2 },
        { name: "10", id: 10, type: 2 },
        { name: "11", id: 11, type: 2 },
        { name: "12", id: 12, type: 2 }
      ],
      dayList: [],

      yoyList: [],
      calculateList: [],
      dialogTableVisible: false,
      frequencyVal: 2
    };
  },
  computed: {
    year_month() {
      let val = this.month < 10 ? "0" + this.month : this.month;
      return this.year + "-" + val;
    },
    userInfo() {
      return useUserStore().userInfo;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  mounted() {
    this.calculate();
    // 按钮权限
    this.api_list();
    this.year = new Date().getFullYear().toString();
    this.month = new Date().getMonth() + 1;
    this.day = new Date().getDate();
    this.selectYear();
    // this.base_info();
  },
  methods: {
    //触发计算接口
    calculate() {
      calculate();
    },
    api_list() {
      //获取路由地址
      let path = `path=${this.$router.currentRoute.value.fullPath}&menu_type=F&visible=0`;
      api_list(path).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            this.buttonList.push(v.title);
          });
        } else {
          this.buttonList = [];
        }
      });
    },
    //查询企业填报频率信息
    selectYear() {
      com_year_config(`year=${this.year}`).then(res => {
        if (res.code == 0) {
          this.fill_frequency = res.data.fill_frequency;
          this.formateDate();
          if (this.fill_frequency == 0) {
            this.dialogTableVisible = true;
          }
        }
      });
    },
    confirmClick() {
      let params = {
        year: Number(this.year),
        fill_frequency: this.frequencyVal
      };
      com_year_config_set(params).then(res => {
        if (res.code == 0) {
          this.$message.success("设置成功");
          this.dialogTableVisible = false;
          this.selectYear();
        }
      });
    },
    formateDate() {
      //月 - 2     日 - 1
      if (this.fill_frequency == 1) {
        this.getDays(this.year, this.month);
        let val = this.month < 10 ? "0" + this.month : this.month;
        this.year_month = this.year + "-" + val;
      }
      let day = this.fill_frequency == 2 ? 1 : this.day;
      this.strDate =
        this.fill_frequency == 2 ? this.year + "年" + this.month + "月" : this.year + "年" + this.month + "月" + this.day + "日";
      this.timestamp = Number((Date.UTC(this.year, this.month - 1, day) / 1000).toFixed(0));
      this.initPage();
    },
    //点击月份或日期
    selectMonth(val, id) {
      if (val == 2) {
        this.month = id;
      } else {
        this.day = id;
      }
      this.formateDate();
    },
    // 获取一个月的有多少天
    getDays(year, month) {
      this.dayList = [];
      let days = new Date(year, month, 0).getDate();
      for (let i = 1; i <= days; i++) {
        this.dayList.push({
          name: i,
          id: i,
          type: 2
        });
      }
    },
    initPage() {
      this.flag = 1;
      this.search_total_statistics();
      this.search_total_statistics_month();
      this.report_yoy();
      this.report_calculate();
    },
    search_total_statistics() {
      let str = `time_type=1&start_time=${this.timestamp}&end_time=${this.timestamp}`;
      total_statistics(str).then(res => {
        if (res.code == 0 && res.data) {
          this.sourceObj = res.data;
        } else {
          this.sourceObj = {
            energy_total: 0
          };
        }
      });
    },
    //查询能源/碳排总量
    search_total_statistics_month() {
      let str = `time_type=2&start_time=${this.timestamp}&end_time=${this.timestamp}`;
      total_statistics(str).then(res => {
        if (res.code == 0 && res.data) {
          this.sourceObjMonth = res.data;
        } else {
          this.sourceObjMonth = {
            energy_total: 0,
            energy_year_on_year: 0,
            carbon_total: 0,
            carbon_year_on_year: 0
          };
        }
      });
    },
    report_yoy() {
      report_yoy(`date=${this.timestamp}`).then(res => {
        if (res.code == 0 && res.data) {
          this.yoyList = res.data;
        } else {
          this.yoyList = [];
        }
      });
    },
    //数据列表
    report_calculate() {
      let str = `date=${this.timestamp}&is_day=${this.fill_frequency}`;
      report_calculate(str).then(res => {
        if (res.code == 0 && res.data) {
          if (this.fill_frequency == 1) {
            let year = this.year_month.split("-")[0];
            let month = this.year_month.split("-")[1];

            res.data.map(v => {
              v.year = year;
              v.month = month;
            });
            this.calculateList = res.data;
            return;
          }
          this.calculateList = res.data;
        } else {
          this.calculatetList = [];
        }
      });
    },

    startData() {
      let val = this.fill_frequency;
      let year = val == 2 ? this.year : this.year_month.split("-")[0];
      let month = val == 2 ? this.month : this.year_month.split("-")[1];
      let day = val == 2 ? 1 : this.day;
      this.strDate = val == 2 ? year + "年" + month + "月" : year + "年" + month + "月" + this.day + "日";
      this.timestamp = Number((Date.UTC(year, month - 1, day) / 1000).toFixed(0));
      this.flag = 2;
    },
    // 点击操作编辑
    editMath(row) {
      if (this.fill_frequency == 2) {
        this.year = String(row.year);
        this.month = row.month;
      } else {
        this.year_month = row.year + "-" + row.month;
        this.day = row.commit_date;
      }
      this.startData();
    },
    goBack() {
      this.flag = 1;
      this.calculate();
    }
  }
};
</script>

<style lang="scss" scoped>
.process-content {
  height: 100%;
  .filter-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 0;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    .icon-box {
      display: flex;
      align-items: center;
      margin: 0 10px 0 20px;
      i {
        margin-right: 5px;
      }
      > label {
        margin: 0 20px 0 0;
        font-size: 14px;
        color: #4a5975;
      }
    }
    .tips-box {
      border: 1px solid red;
      > h1 {
        font-size: 14px;
      }
    }
  }
  .date-box {
    display: grid;
    grid-template-columns: 336px auto;
    grid-column-gap: 10px;
    height: 395px;
    .calendar {
      overflow: hidden;
      background: linear-gradient(to right, #dee2eb, #f4f6fa);
      border-radius: 10px;
      > h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        padding: 0 20px;
        margin: 0;
        font-weight: normal;
        > span {
          font-size: 16px;
          color: #4a5975;
        }
      }
      .month-box {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 15px 25px;
        height: 197px;
        padding: 20px 15px;
        background: #ffffff;
        > h2 {
          margin: 0;
          font-size: 14px;
          cursor: pointer;
          h3 {
            margin: 0;
            margin-top: 10px;
            font-size: 25px;
            font-weight: 500;
            color: #4a5975;
            text-align: center;
          }
          h4 {
            margin: 0;
            font-size: 12px;
            font-weight: normal;
            color: #b6bfd2;
            text-align: center;
          }
        }
        .active {
          // background: #e3fbf5;
          border-radius: 10px;
          h3 {
            // color: #09a27d;
            color: #1f304c;
          }
          h4 {
            // color: #09a27d;
            color: #1f304c;
          }
        }
        .select-active {
          background: #0ec69a;
          border-radius: 10px;
          h3 {
            color: #ffffff;
          }
          h4 {
            color: #ffffff;
          }
        }
      }
      .day-box {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-gap: 5px;
        height: 205px;
        padding: 15px;
        background: #ffffff;
        > h2 {
          height: 35px;
          line-height: 35px;
          h3 {
            margin: 0;
            font-size: 22px;
          }
        }
      }
      .bottom-box {
        height: 110px;
        background: #ffffff;
        > div {
          height: 90px;
          margin: 0 20px;
          background: linear-gradient(to right, #dee2eb, #f4f6fa);
          border-radius: 8px;
          > h1 {
            padding: 18px 20px 6px;
            margin: 0;
            font-size: 14px;
            font-weight: normal;
            color: #4a5975;
          }
          > h2 {
            position: relative;
            height: 45px;
            padding: 0 20px;
            margin: 0;
            overflow: hidden;
            font-size: 22px;
            font-weight: 600;
            color: #1f304c;
            text-overflow: ellipsis;
            white-space: nowrap;
            > span {
              position: absolute;
              top: 25px;
              right: 10px;
              font-size: 12px;
              font-weight: 500;
              color: #8894b3;
            }
            .upper {
              font-size: 14px;
              color: #f23d4f;
            }
            .low {
              color: #0ece5a;
            }
          }
        }
      }
    }
    .process-box {
      background: #ffffff;
      border-radius: 10px;
      > h1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
        padding: 0 20px;
        margin: 0;
        border-bottom: 1px solid #f4f6fa;
        > h2 {
          margin: 0;
          > h3 {
            padding: 5px 0;
            margin: 0;
            font-size: 18px;
            font-weight: 500;
            color: #4a5975;
          }
          > p {
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            color: #0ec69a;
          }
        }
      }
      .table-msg {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        height: calc(100% - 80px);
        > div {
          padding-top: 15px;
          border-right: 1px solid #f4f6fa;
          > h1 {
            height: 30px;
            padding-left: 20px;
            margin: 0;
            font-size: 14px;
            font-weight: normal;
            line-height: 30px;
            color: #627292;
          }
          > h2 {
            height: 28px;
            padding-left: 20px;
            margin: 0;
            > span {
              font-size: 12px;
              font-weight: normal;
              color: #8894b3;
            }
            .val-box {
              margin-right: 8px;
              font-size: 26px;
              font-weight: 600;
              color: #1f304c;
            }
          }
          .list-box {
            height: 190px;
            padding: 25px 20px;
            overflow: auto;
            > div {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 40px;
              > span {
                font-size: 12px;
              }
              .name {
                display: flex;
                align-items: center;
                width: 40%;
                overflow: hidden;
                color: #627292;
                .tip {
                  display: inline-block;
                  width: 5px;
                  height: 5px;
                  margin-right: 5px;
                  background: #0ec69a;
                  border-radius: 50%;
                }
              }
              .value {
                width: 30%;
                font-size: 18px;
                color: #1f304c;
                text-align: center;
              }
              .present {
                width: 30%;
                font-size: 12px;
                color: #627292;
                text-align: right;
              }
            }
          }
        }
        > div:last-child {
          border-right: none;
        }
      }
    }
  }
  .table-box {
    height: calc(100% - 405px);
    margin-top: 20px;
    overflow: auto;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      height: 50px;
      padding-left: 20px;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      line-height: 50px;
      color: #1f304c;
    }
  }
}
.tips-msg {
  display: flex;
  align-items: center;
  color: #ff0000;
  i {
    margin-right: 5px;
    font-size: 18px;
    color: #ff0000;
  }
}
.radio-box {
  margin-top: 20px;
}
</style>
