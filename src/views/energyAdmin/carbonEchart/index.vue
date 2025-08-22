<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div>
        <div class="btn-box">
          <div>
            <el-radio-group v-model="radio2" @change="search">
              <el-radio-button label="工序能源流向图" value="1" />
              <el-radio-button label="工序碳排流向图" value="2" />
            </el-radio-group>
          </div>
          <div>
            <div style="width: 100px">
              <el-radio-group v-model="form.time_type">
                <el-radio-button label="年" value="1" />
                <el-radio-button label="月" value="2" />
              </el-radio-group>
            </div>
            <span style="margin: 0 10px; font-size: 14px; color: #606266">开始时间</span>
            <div class="grid-content bg-purple-dark" style="margin-right: 10px">
              <el-date-picker
                placeholder="开始时间"
                style="width: 200px"
                v-model="form.first_time"
                value-format="x"
                :type="dateType"
              />
            </div>
            <span style="margin: 0 10px; font-size: 14px; color: #606266">结束时间</span>
            <div class="grid-content bg-purple-dark" style="margin-right: 10px">
              <el-date-picker
                placeholder="结束时间"
                style="width: 200px"
                v-model="form.last_time"
                value-format="x"
                :type="dateType"
              />
            </div>
            <div class="grid-content bg-purple-dark" style="margin-right: 10px">
              <el-button type="primary" class="search-btn" @click="search"> 查询 </el-button>
            </div>
          </div>
        </div>
        <div class="chart-box">
          <div v-show="radio2 == 1" id="productEchart" style="width: 100%; height: 400px"></div>
          <div v-show="radio2 == 2" id="productEchart_carbon" style="width: 100%; height: 400px"></div>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <div>
              <span style="margin-right: 20px">工序{{ radio2 == 1 ? "能源" : "碳排" }}数据列表</span>
            </div>
          </div>
          <div class="table-list" v-show="radio2 == 1">
            <el-table class="my-custom-table" border :data="yearlyFlowlist" :span-method="mergeSameRows">
              <el-table-column label="工序名称" prop="process_name"> </el-table-column>
              <el-table-column label="工序各能源消耗量">
                <template #default="{ row }">
                  {{ row.varieties_name }}：{{ row.consumption }} {{ row.consumption_unit }}
                </template>
              </el-table-column>
              <el-table-column label="工序使用的各能源综合量（tce）">
                <template #default="{ row }"> {{ row.varieties_name }}：{{ row.energy_budget }} </template>
              </el-table-column>
              <!-- <el-table-column label="各工序产生的碳排（tCO₂eq）">
                <template #default="{ row }"> {{ row.varieties_name }}：{{ row.carbon_budget }} </template>
              </el-table-column> -->
              <el-table-column label="工序使用的能源总量（tce）">
                <template #default="{ row }"> {{ row.sum_energy_budget }} </template>
              </el-table-column>
              <!-- <el-table-column label="工序产生的总碳排(tCO₂eq)" prop="sum_carbon_budget"> </el-table-column> -->
            </el-table>
          </div>
          <div class="table-list" v-show="radio2 == 2">
            <el-table class="my-custom-table" border :data="yearlyFlowData" :span-method="mergeSameRows1">
              <el-table-column label="工序名称" prop="process_name"> </el-table-column>
              <el-table-column label="工序排放源消耗量">
                <template #default="{ row }">
                  {{ row.varieties_name }}：{{ row.consumption }} {{ row.consumption_unit }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="工序使用的各能源综合量（tce）">
                <template #default="{ row }"> {{ row.varieties_name }}：{{ row.energy_budget }} </template>
              </el-table-column> -->
              <el-table-column label="工序排放源产生的碳排放（tCO₂eq）">
                <template #default="{ row }"> {{ row.varieties_name }}：{{ row.carbon_budget }} </template>
              </el-table-column>
              <!-- <el-table-column label="工序使用的能源总量（tce）" prop="sum_energy_budget"> </el-table-column> -->
              <el-table-column label="工序产生的总碳排(tCO₂eq)" prop="sum_carbon_budget"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { getMergeCells } from "@/utils/table.js";
import { calculate, yearly_flow, monthly_flow } from "@/api/modules/carbonAnalysis.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      radio2: "1",
      form: {
        time_type: "1",
        first_time: "",
        last_time: ""
      },
      yearlyFlowlist: [],
      yearlyFlowData: [],
      tableColumn: [
        { prop: "process_name", label: "" },
        { prop: "consumption", label: "" },
        { prop: "energy_budget", label: "" },
        { prop: "sum_energy_budget", label: "" }
      ],
      tableColumn1: [
        { prop: "process_name", label: "" },
        { prop: "consumption", label: "" },
        { prop: "carbon_budget", label: "" },
        { prop: "sum_carbon_budget", label: "" }
      ]
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    dateType() {
      return this.form.time_type == 1 ? "year" : "month";
    },
    spanArr() {
      if (!this.tableColumn.length) return [];
      const mergeCols = ["process_name", "sum_energy_budget"]; // 需要合并的列（字段）
      return getMergeCells(this.yearlyFlowlist, this.tableColumn, mergeCols);
    },
    spanArr1() {
      if (!this.tableColumn1.length) return [];
      const mergeCols = ["process_name", "sum_carbon_budget"]; // 需要合并的列（字段）
      return getMergeCells(this.yearlyFlowData, this.tableColumn1, mergeCols);
    }
  },
  mounted() {
    this.calculate();
    this.getNormalDate();
  },
  methods: {
    //触发计算接口
    calculate() {
      calculate();
    },
    //获取当前年时间戳
    getNormalDate() {
      //获取前一年的时间戳
      this.form.first_time = new Date().getTime() - 395 * 24 * 60 * 60 * 1000;
      this.form.last_time = new Date().getTime() - 395 * 24 * 60 * 60 * 1000;
      this.search();
    },
    search() {
      if (this.form.first_time > this.form.last_time) {
        this.$message.warning("开始时间不能大于结束时间");
        return;
      }
      if (!this.form.first_time || !this.form.last_time) {
        this.$message.warning("请选择开始时间或结束时间");
        return;
      }
      let sYear = new Date(this.form.first_time).getFullYear();
      let eYear = new Date(this.form.last_time).getFullYear();
      if (this.form.time_type == 2 && sYear != eYear) {
        this.$message.warning("请选择同一年份");
        return;
      }
      let str = "";
      for (let key in this.form) {
        if (key == "first_time" || key == "last_time") {
          str += `${key}=${(this.form[key] / 1000).toFixed(0)}&`;
        } else {
          str += `${key}=${this.form[key]}&`;
        }
      }

      if (this.form.time_type == 1) {
        this.get_yearly_flow(str);
        return;
      }
      this.get_monthly_flow(str);
    },
    get_yearly_flow(str) {
      yearly_flow(str).then(res => {
        if (res.code == 0 && res.data.list && res.data.list.length > 0) {
          let keys = ["carbon_budget", "consumption", "energy_budget", "sum_carbon_budget", "sum_energy_budget"];
          res.data.list.map(v => {
            for (let key in v) {
              if (keys.includes(key)) {
                v[key] = Number(v[key]).toFixed(2);
              }
            }
          });
          this.yearlyFlowlist = res.data.list.filter(v => v.variety_type == 1);
          this.yearlyFlowData = res.data.list;
          if (this.radio2 == 1) {
            this.initEchart();
          } else {
            this.initEchart2();
          }
        } else {
          this.yearlyFlowlist = [];
          this.yearlyFlowData = [];
          if (this.radio2 == 1) {
            this.initEchart();
          } else {
            this.initEchart2();
          }
        }
      });
    },
    get_monthly_flow(str) {
      monthly_flow(str).then(res => {
        if (res.code == 0 && res.data.list && res.data.list.length > 0) {
          let keys = ["carbon_budget", "consumption", "energy_budget", "sum_carbon_budget", "sum_energy_budget"];
          res.data.list.map(v => {
            for (let key in v) {
              if (keys.includes(key)) {
                v[key] = Number(v[key]).toFixed(2);
              }
            }
          });
          this.yearlyFlowlist = res.data.list.filter(v => v.variety_type == 1);
          this.yearlyFlowData = res.data.list;
          if (this.radio2 == 1) {
            this.initEchart();
          } else {
            this.initEchart2();
          }
        } else {
          this.yearlyFlowlist = [];
          this.yearlyFlowData = [];
          if (this.radio2 == 1) {
            this.initEchart();
          } else {
            this.initEchart2();
          }
        }
      });
    },
    mergeSameRows({ row, column, rowIndex, columnIndex }) {
      if (row && column) {
      }
      return this.spanArr[rowIndex][columnIndex];
    },
    mergeSameRows1({ row, column, rowIndex, columnIndex }) {
      if (row && column) {
      }
      return this.spanArr1[rowIndex][columnIndex];
    },
    initEchart() {
      let arr = [];
      this.yearlyFlowData.map(v => {
        arr.push({
          source: v.varieties_name,
          target: v.process_name,
          value: v.energy_budget
        });
        // arr.push({
        //   source: v.process_name,
        //   // target: v.process_name + "碳排",
        //   target: "碳排",
        //   value: v.sum_carbon_budget
        // });
      });
      //去重
      arr = arr
        .map(JSON.stringify)
        .reverse()
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .map(JSON.parse);
      let data = [];
      arr.map(v => {
        for (let key in v) {
          if (key == "source" || key == "target") {
            data.push({ name: v[key] });
          }
        }
      });
      data = data
        .map(JSON.stringify)
        .reverse()
        .filter((item, index, data) => data.indexOf(item) === index)
        .map(JSON.parse);
      let myChart = echarts.init(document.getElementById("productEchart"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let unit = "tce";
            return params.name + "： " + params.value + "(" + unit + ")";
          }
        },
        series: {
          type: "sankey",
          layout: "none",
          emphasis: {
            focus: "adjacency"
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: "#fbb4ae"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: "#b3cde3"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: "#ccebc5"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: "#decbe4"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            }
          ],
          data: data,
          links: arr
        }
      };
      myChart.setOption(option);
    },
    initEchart2() {
      let arr = [];
      this.yearlyFlowData.map(v => {
        // arr.push({
        //   source: v.varieties_name,
        //   target: v.process_name,
        //   value: v.energy_budget
        // });
        arr.push({
          source: v.varieties_name,
          // source: v.process_name,
          // target: v.process_name + "碳排",
          target: v.process_name,
          value: v.carbon_budget
        });
      });
      //去重
      arr = arr
        .map(JSON.stringify)
        .reverse()
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .map(JSON.parse);
      let data = [];
      arr.map(v => {
        for (let key in v) {
          if (key == "source" || key == "target") {
            data.push({ name: v[key] });
          }
        }
      });
      data = data
        .map(JSON.stringify)
        .reverse()
        .filter((item, index, data) => data.indexOf(item) === index)
        .map(JSON.parse);
      let myChart = echarts.init(document.getElementById("productEchart_carbon"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let unit = "tCO₂eq";
            return params.name + "： " + params.value + "(" + unit + ")";
          }
        },
        series: {
          type: "sankey",
          layout: "none",
          emphasis: {
            focus: "adjacency"
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: "#fbb4ae"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: "#b3cde3"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: "#ccebc5"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: "#decbe4"
              },
              lineStyle: {
                color: "source",
                opacity: 0.6
              }
            }
          ],
          data: data,
          links: arr
        }
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;
  margin: 0;
  margin-bottom: 20px;
  font-size: 14px;
  > span {
    display: inline-block;
    width: 4px;
    height: 14px;
    margin-right: 8px;
    vertical-align: middle;
    background: #0ec69a;
  }
}
.sourceSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding: 0 10px;
  margin-top: 10px;
  line-height: 28px;
  text-align: left;
  background: #d9ecff;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  i {
    font-size: 18px;
    color: #f56c6c;
    cursor: pointer;
  }
}
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  :deep(.el-popover.el-popper) {
    min-width: 30px !important;
  }
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    overflow: auto;
    overflow-x: hidden;
    border-radius: 10px;
    > div {
      position: absolute;
      inset: 0;
      .btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        color: #1f304c;
        border-bottom: 1px solid #ebeef5;
        > span {
          font-size: 16px;
        }
        > div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
      .chart-box {
        height: 400px;
        margin-bottom: 12px;
        background: #ffffff;
        border-radius: 10px;
      }
      .table-box {
        height: auto;
        min-height: 400px;
        overflow: auto;
        overflow: hidden;
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 56px;
          padding: 0 20px;
          > span {
            font-size: 16px;
          }
          .tab-box {
            height: 100%;
            margin-left: 30px;
            > span {
              display: inline-block;
              height: 100%;
              margin-right: 20px;
              font-size: 14px;
              line-height: 57px;
              color: #1f304c;
              cursor: pointer;
            }
            .active {
              color: #0ec69a;
              border-bottom: 2px solid #0ec69a;
            }
          }
        }

        background: #ffffff;
        border-radius: 10px;
      }
      .demo-pagination-block {
        position: absolute;
        right: 12px;
        bottom: 10px;
      }
    }
  }
}
:deep(.el-upload) {
  width: 100%;
}
.upload-box {
  width: 100%;
  padding-top: 10px;
  cursor: pointer;
  background: rgb(249 250 251);
  border: 1px solid rgb(222 226 235);
  border-radius: 5px;
  p {
    padding: 0;
    margin: 0;
    margin-top: -15px;
    color: #999999;
  }
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding-right: 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  > div {
    display: flex;
    align-items: center;
  }
}
:deep(.zm-tree-org) {
  background: none;
}
:deep(.tree-org-node__content) {
  padding: 0;
  border-radius: 10px;
}
.tree-org-node__text {
  padding: 0;
  > div {
    box-sizing: border-box;
    width: 190px;
    height: 63px;
    padding: 0 20px 0 60px;
    overflow: hidden;
    line-height: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: url("@/assets/images/org/cp2.svg") no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
