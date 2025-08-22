<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="noline-box">
        <div class="box" @click="onNodeClick(v)" v-for="v in noLineNodes" :key="v.id">
          <span>
            {{ v.text }}
          </span>
          <div class="subText">
            <div v-for="k in v.data.products" :key="k.id">{{ k.product_name }}</div>
          </div>
          <el-icon v-if="activeId == v.id"><Select /></el-icon>
        </div>
      </div>
      <div v-if="list.length > 0" style="height: 100%; overflow: hidden">
        <RelationGraph style="background: #f2f3f5" ref="graphRef" :options="graphOptions" :on-node-click="onNodeClick">
          <template #node="{ node }">
            <div class="my-rg-node" :title="node.text">
              <div class="text">{{ node.text }}</div>
              <div class="subText">
                <div v-for="v in node.data.products" :key="v.id">{{ v.product_name }}</div>
              </div>
            </div>
          </template>
        </RelationGraph>
      </div>
      <div v-else style="margin-top: 150px; color: #999999; text-align: center">
        <img src="@/assets/images/notData.png" alt="" srcset="" />
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import { carbonStore } from "@/stores/modules/carbonFootprint";
import { product_carbon_footprint_diagram, production_process_layout_info } from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
import RelationGraph from "relation-graph-vue3";
export default {
  components: {
    RelationGraph
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ["sendNode"],
  data() {
    return {
      carbonStore: {},
      //关系图配置
      list: [],
      noLineNodes: [],
      activeId: "",
      positionObj: "",
      layoutNameValue: "force",
      graphOptions: {
        defaultLineWidth: 2,
        moveToCenterWhenRefresh: true,
        useAnimationWhenRefresh: true,
        defaultFocusRootNode: false,
        layouts: [
          {
            layoutLabel: "工序图",
            layoutName: "force", //force , tree, center, folder
            distance_coefficient: 1.3,
            from: "top",
            levelDistance: "",
            min_per_width: 100,
            max_per_width: 500,
            min_per_height: 100,
            max_per_height: 500,
            maxLayoutTimes: 300,
            force_node_repulsion: 1.2,
            force_line_elastic: 1
          }
        ]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    carbonRow() {
      return this.carbonStore.carbonRow;
    }
  },
  mounted() {
    this.carbonStore = carbonStore();
    this.featch_process_diagram();
  },
  methods: {
    //查询生产工序
    featch_process_diagram() {
      let str = `product_id=${this.carbonRow.product.id}`;
      product_carbon_footprint_diagram(str).then(res => {
        if (res.code == 0 && res.data && res.data.nodes) {
          this.list = res.data.nodes ? res.data.nodes : [];
          this.linkList = res.data.links ? res.data.links : [];
          production_process_layout_info({ layout_model: 1 })
            .then(res => {
              this.layoutNameValue = "fixed";
              this.graphOptions.layouts[0].layoutName = "fixed";
              this.positionObj = JSON.parse(res.data.layout);
              this.$nextTick(() => {
                this.renderGraph();
              });
            })
            .catch(() => {
              this.layoutNameValue = "force";
              this.graphOptions.layouts[0].layoutName = "force";
              this.$nextTick(() => {
                this.renderGraph();
              });
            });
        } else {
          this.list = [];
          this.linkList = [];
        }
      });
    },
    //渲染图
    renderGraph() {
      let nodes = [];
      let lines = [];
      this.list.map(v => {
        nodes.push({
          id: v.id.toString(),
          text: v.name,
          nodeShape: 1,
          width: 230,
          data: { products: v.products },
          x: this.layoutNameValue == "fixed" ? this.positionObj[v.id + "x"] : undefined,
          y: this.layoutNameValue == "fixed" ? this.positionObj[v.id + "y"] : undefined
        });
      });
      let linesIds = [];
      this.linkList.map(v => {
        if (v.type == 2) {
          lines.push({
            from: v.source.toString(),
            to: v.target.toString()
          });
          linesIds.push(v.source);
          linesIds.push(v.target);
        }
      });
      //将连线和没连线分别展示
      let newLinesIds = Array.from(new Set(linesIds));
      let lineNodes = [];
      this.noLineNodes = [];
      nodes.map(v => {
        if (newLinesIds.includes(Number(v.id))) {
          lineNodes.push(v);
        } else {
          this.noLineNodes.push(v);
        }
      });
      const jsonData = {
        rootId: "process",
        nodes: lineNodes,
        lines: lines
      };
      if (this.noLineNodes.length > 0) {
        this.onNodeClick({ id: this.noLineNodes[0].id, text: this.noLineNodes[0].text });
      }
      if (lines.length == 0) {
        return;
      }
      if (this.noLineNodes.length == 0) {
        this.onNodeClick({ id: lineNodes[0].id, text: lineNodes[0].text });
      }
      // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
      const graphInstance = this.$refs.graphRef.getInstance();
      graphInstance.setOptions(this.graphOptions);
      graphInstance.setJsonData(jsonData);
      this.$nextTick(() => {
        this.$refs.graphRef.onGraphResize();
        this.$refs.graphRef.refresh();
        graphInstance.setZoom("95");
      });
    },
    onNodeClick(nodeObject) {
      console.log(nodeObject.data);
      this.activeId = nodeObject.id;
      this.$emit("sendNode", nodeObject);
    }
  }
};
</script>

<style lang="scss" scoped>
.process-content {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  padding: 5px;
  border: 1px dashed #cccccc;
  border-radius: 10px;
  .right {
    position: relative;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    .set-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 10px;
      background: #ffffff;
      border-bottom: 1px solid #f4f6fa;
      > span {
        font-size: 14px;
        font-weight: 600;
        color: #1f304c;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .noline-box {
      position: absolute;
      top: 10px;
      right: 20px;
      left: 20px;
      z-index: 100;
      .box {
        float: left;
        width: 200px;
        height: 70px;
        padding: 0;
        margin: 0 10px 10px 0;
        color: #1f304c;
        text-align: left;
        cursor: pointer;
        background: url("@/assets/images/org/gx2.svg") center no-repeat;
        background-size: 100% 100%;
        border-radius: 6px;
        > span {
          display: inline-block;
          width: 140px;
          height: 40px;
          margin-left: 60px;
          overflow: hidden;
          font-weight: bold;
          line-height: 58px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .subText {
          display: flex;
          justify-content: flex-start;
          width: 140px;
          padding-left: 60px;
          overflow: hidden;
          font-size: 14px;
          color: #8894b3;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          > div {
            margin-right: 5px;
          }
        }
        > i {
          float: right;
          margin-top: -36px;
          margin-right: 3px;
          font-size: 25px;
          color: #0ec69a;
        }
      }
    }
    :deep(.relation-graph .rel-node-shape-1) {
      background: none !important;
    }
    :deep(.relation-graph .rel-map) {
      background: none !important;
    }
    .my-rg-node {
      position: relative;
      width: 100%;
      min-height: 70px;
      background: url("@/assets/images/org/gx2.svg") center no-repeat;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      border-radius: 10px;
      .text {
        width: 150px;
        height: 45px;
        padding-left: 70px;
        overflow: hidden;
        font-size: 18px;
        font-weight: bold;
        line-height: 65px;
        color: #1f304c;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .subText {
        display: flex;
        justify-content: flex-start;
        width: 140px;
        padding-left: 70px;
        overflow: hidden;
        font-size: 14px;
        color: #8894b3;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        > div {
          margin-right: 5px;
        }
      }
    }
    .echarts {
      height: calc(100% - 50px);
    }
  }
}
.tree-btn {
  display: flex;
  align-items: center;
  height: 28px;
  font-size: 13px;
  cursor: pointer;
}
.tree-btn:hover {
  color: #0ec69a;
  background: #e3fbf5;
  border-radius: 5px;
}
.dialog-content {
  display: flex;
  justify-content: space-around;
  > div {
    h1 {
      margin: 0;
      margin-bottom: 10px;
      font-size: 15px;
      font-weight: normal;
      color: #1f304c;
      text-align: center;
    }
    .dialog-box {
      width: 140px;
      padding: 0 10px;
      border-radius: 10px;
      > div {
        padding: 2px 10px;
        margin-bottom: 10px;
        cursor: pointer;
        background: #dee2eb;
        border-radius: 20px;
        > p {
          height: 30px;
          padding: 0;
          margin: 0;
          overflow: hidden;
          line-height: 30px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .upActive {
        color: #ffffff;
        background: #0ec69a;
      }
      .active {
        color: #ffffff;
        background: #fa8072;
      }
      .nextActive {
        color: #ffffff;
        background: #ffd39b;
      }
    }
  }
}
.process-detail {
  > h1 {
    padding-bottom: 10px;
    margin: 0;
    font-size: 16px;
    color: #505e79;
  }
  > h3 {
    display: flex;
    align-items: center;
    height: 35px;
    margin: 0;
    font-size: 16px;
    font-weight: normal;
    color: #505e79;
    > span {
      display: inline-block;
      width: 5px;
      height: 16px;
      margin-right: 7px;
      background: #0ec69a;
    }
  }
  .product-item {
    margin-bottom: 7px;
    font-size: 14px;
    color: #8894b3;
    > span {
      float: right;
    }
  }
  > div {
    > span {
      display: inline-block;
      min-width: 80px;
      height: 32px;
      padding: 0 10px;
      margin-right: 10px;
      font-size: 14px;
      line-height: 32px;
      color: #ffffff;
      text-align: center;
      background: #0ec69a;
      border-radius: 20px;
    }
  }
  .process-name {
    display: flex;
    align-items: center;
    > img {
      cursor: pointer;
    }
  }
  .co2-box {
    padding: 10px;
    color: #505e79;
    background: #f9fafb;
    > h2 {
      font-size: 15px;
      font-weight: normal;
    }
    ul {
      li {
        margin-bottom: 5px;
      }
    }
    ul.one {
      display: flex;
      justify-content: space-between;
    }
    li {
      font-size: 14px;
    }
  }
}
</style>
