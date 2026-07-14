<template>
  <div class="process-content">
    <div class="left" ref="refLeft">
      <h1>
        <div><img src="@/assets/images/common/bumen.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />列表</div>
      </h1>
      <div class="bottom-tree-box">
        <el-input placeholder="请输入关键字" v-model="filterText" class="input-with-select">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-tree
          style="max-width: 600px; margin-top: 15px"
          ref="treeRef"
          :data="dataSource"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="{ label: 'name' }"
          draggable
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <div class="slot-tree-div">
              <div @click="handleClickNode(node, data)">
                <img src="@/assets/images/common/bumen.svg" alt="" style="width: 16px; height: 16px; margin-right: 3px" />
                {{ node.label }}
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" ref="refRight">
      <div class="top-content">
        <el-select v-model="filterForm.type">
          <el-option label="搅拌机" value="all"></el-option>
        </el-select>
        <el-select v-model="filterForm.type1">
          <el-option label="电" value="all"></el-option>
        </el-select>
        <el-select v-model="filterForm.type2">
          <el-option label="有功功率" value="all"></el-option>
        </el-select>
        <el-button style="width: 80px" type="primary">查询</el-button>
      </div>
      <div class="right-content">
        <div class="echart-box">
          <div id="moreChart" style="width: 100%; height: 380px"></div>
          <div class="echart-box-bottom">
            <div>
              <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 20px; height: 20px" />
              <span> 总有功功率 </span>
              <el-switch v-model="switchForm.value1" />
            </div>
            <div>
              <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 20px; height: 20px" />
              <span> A相有功功率 </span>
              <el-switch v-model="switchForm.value2" />
            </div>
            <div>
              <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 20px; height: 20px" />
              <span> B相有功功率 </span>
              <el-switch v-model="switchForm.value3" />
            </div>
            <div>
              <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 20px; height: 20px" />
              <span> C相有功功率 </span>
              <el-switch v-model="switchForm.value4" />
            </div>
          </div>
        </div>
        <div class="table-box1">
          <div class="btn-box">
            <span>数据列表</span>
          </div>
          <div class="table-list">
            <el-table class="my-custom-table" :data="equipmentList">
              <el-table-column label="名称" prop="equipment_id" align="left"> </el-table-column>
              <el-table-column label="采集时间" prop="model_specification" align="left"> </el-table-column>
              <el-table-column label="总有功功率(kw)" prop="path" align="left"> </el-table-column>
              <el-table-column label="A相有功功率(kw)" prop="manufacturer" align="left"> </el-table-column>
              <el-table-column label="B相有功功率(kw)" prop="production_date" align="left"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { drag } from "@/utils/drag.js";
import { production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterText: "",
      dataSource: [],
      filterForm: {
        type: "all",
        type1: "all",
        type2: "all"
      },
      switchForm: {
        value1: true,
        value2: true,
        value3: true,
        value4: true
      },
      calculateList: [{}]
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    token() {
      return useUserStore().token;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
    this.renderChart();
  },
  methods: {
    initPage() {
      this.getCompany();
    },
    getCompany() {
      production_process_diagram(`com_id=${this.userInfo.com_id}`).then(res1 => {
        if (res1.code == 0 && res1.data) {
          this.dataSource = res1.data.nodes;
          this.handleClickNode({ level: 1 }, this.dataSource[0]);
        } else {
          this.dataSource = [];
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    // 树节点点击事件
    handleClickNode(node, data) {
      this.treeNode = data;
      this.ruleForm.process_id = data.id;
    },
    renderChart() {
      let domElement = document.getElementById("moreChart");
      if (echarts.getInstanceByDom(domElement)) {
        echarts.dispose(domElement);
      }
      this.myChart = echarts.init(domElement);
      let optionLine = {
        color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
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
            boundaryGap: false,
            data: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: "单位：kW",
            type: "value"
          }
        ],
        series: [
          {
            type: "line",
            showSymbol: false,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)"
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)"
                }
              ])
            },
            data: [14, 22, 11, 24, 90, 34, 25, 66, 55, 6]
          },
          {
            // name: "Direct",
            type: "line",
            smooth: false,
            showSymbol: false,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)"
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)"
                }
              ])
            },
            data: [12, 22, 34, 76, 8, 6, 4, 45, 45, 45, 99]
          },
          {
            // name: "Direct",
            type: "line",
            smooth: false,
            areaStyle: {},
            showSymbol: false,
            barMaxWidth: 20,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)"
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)"
                }
              ])
            },
            data: [2, 2, 74, 16, 28, 36, 44, 95, 85, 15, 90]
          },
          {
            // name: "Direct",
            type: "line",
            smooth: false,
            areaStyle: {},
            showSymbol: false,
            barMaxWidth: 20,
            areaStyle: {
              opacity: 0.1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(128, 255, 165)"
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)"
                }
              ])
            },
            data: [24, 42, 64, 26, 48, 56, 64, 25, 80, 55, 40]
          }
        ]
      };
      this.myChart.setOption(optionLine);
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
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .left {
    width: 300px;
    min-width: 100px;
    height: 100%;
    margin-right: 10px;
    overflow: auto;
    resize: horizontal;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      color: #1f304c;
      border-bottom: 1px solid #f4f6fa;
      > div {
        display: flex;
        align-items: center;
      }
    }
    .bottom-tree-box {
      height: calc(100% - 75px);
      padding: 10px 20px;
      overflow: auto;
      .slot-tree-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        > div {
          display: flex;
          align-items: center;
          width: 85%;
          height: 100%;
          height: 35px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > span {
          font-size: 14px;
        }
      }
      .popover-box {
        > div {
          height: 35px;
          font-size: 14px;
        }
      }
      :deep(.el-tree-node__content) {
        height: 30px !important;
      }
    }
  }
  :deep(.el-popover.el-popper) {
    min-width: 30px !important;
  }
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    .top-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 10px;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
    }
    .right-content {
      height: calc(100% - 82px);
      margin-top: 10px;
      overflow: auto;
      .echart-box {
        height: 430px;
        background: #ffffff;
        border-radius: 10px;
        .echart-box-bottom {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 40px;
          padding: 0 43px;
          > div {
            display: flex;
            align-items: center;
            margin-right: 40px;
            font-size: 14px;
            > span {
              margin: 0 10px 0 5px;
            }
          }
        }
      }
      .table-box1 {
        margin-top: 10px;
        overflow: hidden;
        background: #ffffff;
        border-radius: 10px;
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 20px;
          > span {
            font-size: 16px;
          }
        }
      }
    }
  }
}
:deep(.el-table .el-table__header th) {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #8894b3 !important;
  background: #f9fafb !important;
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
