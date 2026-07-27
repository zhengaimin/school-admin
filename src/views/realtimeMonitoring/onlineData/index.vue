<template>
  <div class="process-content">
    <div v-if="false" class="left" ref="refLeft">
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
        <div v-if="false">
          <el-button @click="read" style="width: 80px" type="primary">提示语音</el-button>
          <el-switch v-model="flag" />开启语音提示
        </div>
        <div class="checkbox-group">
          <el-checkbox-group v-model="checkList" @change="handleChange">
            <el-checkbox v-for="v in typeList" :key="v.value" :label="v.name" :value="v.value" />
          </el-checkbox-group>
        </div>
        <div>
          <el-button @click="savePositions" type="primary">自定义布局</el-button>
          <el-button @click="clearPositions">自适应布局</el-button>
        </div>
      </div>
      <div class="right-content">
        <div class="realtimeMonitoring">
          <div class="chart-container">
            <div :id="'resizeable' + v" class="box" v-for="v in checkList" :key="v" :data-position="'position' + v">
              <echartBox :index="v" :is-chart="'chart' + v" :list="list" :title="v" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { currentKey } from "@/assets/json/currentData.js";
import echartBox from "../echartBox.vue";
import * as echarts from "echarts";
import { drag } from "@/utils/drag.js";
import { useUserStore } from "@/stores/modules/user";
import { real_time_data, layout_info, layout_add, layout_update } from "@/api/modules/realtimeMonitoring.js";
export default {
  components: {
    echartBox
  },
  data() {
    return {
      filterText: "",
      dataSource: [],
      switchForm: {
        value1: true,
        value2: true,
        value3: true,
        value4: true
      },
      positionId: "",
      checkList: ["vA"],
      flag: true,
      stream_id: "",
      list: [],
      boxes: "",
      eventSource: ""
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    token() {
      return useUserStore().token;
    },
    typeList() {
      return currentKey;
    },
    titleObj() {
      let obj = {};
      currentKey.map(v => {
        obj[v.value] = v.name;
      });
      return obj;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
    this.getReal();
  },
  unmounted() {
    this.eventSource.close();
  },
  methods: {
    getReal() {
      const checkList = JSON.parse(localStorage.getItem("checkList"));
      if (checkList) {
        this.checkList = checkList;
      }
      this.$nextTick(() => {
        this.initPage();
      });
      real_time_data().then(res => {
        this.stream_id = res.data.stream_id;
        // // 创建一个新的 EventSource 实例，指定后端 SSE 服务的 URL
        // this.eventSource = new EventSource(`http://192.168.110.32:8682/events?stream=${this.stream_id}`);
        this.eventSource = new EventSource(`http://47.120.20.136:8681/events?stream=${this.stream_id}`);
        this.eventSource.onmessage = event => {
          const newData = JSON.parse(event.data);
          newData.ts = new Date().toLocaleTimeString();
          this.list.push(newData);
        };
        // // 监听 'message' 事件，当有新消息时触发
        // eventSource.onmessage = function (event) {
        //   console.log("New message from server:", data);
        //   // 处理接收到的数据
        //   const data = JSON.parse(event.data); // 假设服务器发送的是 JSON 格式的数据
        //   // 更新 UI 或者执行其他逻辑
        // };

        // // 可选：监听 'open' 事件，当连接打开时触发
        // eventSource.onopen = function (event) {
        //   console.log(event);
        //   console.log("Connection to server opened.");
        // };

        // // 可选：监听 'error' 事件，当发生错误时触发
        // eventSource.onerror = function (event) {
        //   if (event.target.readyState === EventSource.CLOSED) {
        //     console.error("Connection to server closed.");
        //   } else {
        //     console.error("Error occurred, reconnecting...", event);
        //   }
        // };

        // this.eventSource.addEventListener(this.stream_id, function (event) {
        //   console.log("Custom event received:", event.data);
        // });
      });
    },
    initPage() {
      this.boxes = document.querySelectorAll(".box");
      this.boxes.forEach(box => {
        box.addEventListener("mousedown", function (e) {
          let offsetX = e.clientX - box.offsetLeft;
          let offsetY = e.clientY - box.offsetTop;
          function drag(e) {
            box.style.left = e.clientX - offsetX + "px";
            box.style.top = e.clientY - offsetY + "px";
          }
          function stopDrag() {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", stopDrag);
          }
          document.addEventListener("mousemove", drag);
          document.addEventListener("mouseup", stopDrag);
        });
      });

      // 假设positions是从服务器或本地存储获取的位置对象
      layout_info({ layout_model: 2 }).then(res => {
        if (res.data && res.data.layout) {
          const positions = JSON.parse(res.data.layout);
          this.initPositions(positions);
          this.positionId = res.data.id;
        } else {
          this.positionId = "";
          this.clearPositions();
        }
      });
    },
    handleChange() {
      this.initPage();

      // layout_add()
      localStorage.setItem("checkList", JSON.stringify(this.checkList));
    },
    // 初始化位置
    initPositions(positions) {
      this.boxes.forEach(box => {
        const position = box.getAttribute("data-position");
        if (positions[position]) {
          Object.assign(box.style, positions[position]);
        } else {
          Object.assign(box.style, { top: "20px", left: "30%" });
        }
      });
    },
    savePositions() {
      const positions = {};
      this.boxes.forEach(box => {
        positions[box.getAttribute("data-position")] = {
          top: box.style.top,
          left: box.style.left
        };
      });
      if (this.positionId) {
        layout_update({ layout_model: 2, layout: JSON.stringify(positions), type: 3 }).then(res => {
          if (res.code == 0) {
            this.$message.success("保存布局成功");
          }
        });
        return;
      }
      layout_add({ layout_model: 2, layout: JSON.stringify(positions), type: 3 }).then(res => {
        if (res.code == 0) {
          this.$message.success("保存布局成功");
        }
      });
    },
    clearPositions() {
      let flag = true;
      let val = -400;
      this.boxes.forEach(box => {
        if (flag) {
          val += 410;
        }
        flag = !flag;
        box.style.left = flag ? "50.3%" : "10px";
        box.style.top = val + "px";
      });
      this.savePositions();
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
    renderChart1() {
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
    },
    read() {
      if (!this.flag) {
        return;
      }
      // 创建一个新的 SpeechSynthesisUtterance 对象
      const msg = new SpeechSynthesisUtterance();

      // 设置要朗读的文字
      msg.text = "2024年9月25号，12点35分的电压已超过预警值，请及时处理";

      // 设置语言（可选）
      msg.lang = "zh-CN"; // 指定中文

      // 添加监听器以处理开始、结束等事件
      msg.onstart = function () {
        console.log("开始朗读");
      };
      msg.onend = function () {
        console.log("朗读完毕");
      };

      // 使用 window.speechSynthesis 来发音
      window.speechSynthesis.speak(msg);
    }
  }
};
</script>

<style lang="scss" scoped>
.realtimeMonitoring {
  width: calc(100% - 2px);
  height: 100%;
  border-radius: 10px;
  .checkbox-group {
    padding: 10px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .chart-container {
    position: relative;
    width: 100%;
    height: calc(100% - 4px);
    overflow: auto;
    border: 1px dashed #cccccc;
    border-radius: 10px;
    .box {
      position: absolute;
      min-width: 49%;
      height: 400px;
      cursor: move;
      resize: both;
    }
  }
  .clearfix {
    display: grid;
    grid-template-rows: 400px;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    width: 100%;
    height: calc(100% - 90px);
    padding: 10px;
    overflow: auto;
    border: 1px solid #999999;
    border-radius: 10px;
    > div {
      min-width: 49%;
      height: 400px;
    }
  }
}
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
      grid-template-columns: 3fr 1fr;
      grid-gap: 10px;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
    }
    .right-content {
      height: calc(100% - 82px);
      margin-top: 10px;
      overflow: auto;
      overflow-x: hidden;
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
