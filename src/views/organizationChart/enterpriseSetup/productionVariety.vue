<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <!-- 平台来源 -->
      <div class="set-btn">
        <span>物质流向图</span>
        <div>
          <el-button type="primary" :disabled="!isEdit" @click="addMethod"> 新增 </el-button>
          <!-- <el-button type="primary" :disabled="!isEdit" @click="editProcess">编辑</el-button>
          <el-button type="danger" :disabled="!isEdit" @click="deleteProcess">删除</el-button> -->
        </div>
      </div>
      <div class="noline-box">
        <div
          class="box"
          :style="{ height: v.data.products ? v.data.products.length * 38 + 'px' : '80px' }"
          @click="onNodeClick(v)"
          v-for="v in noLineNodes"
          :key="v.id"
        >
          <div class="name-text">
            <div v-for="k in v.data.products" :key="k.id">{{ k.product_name }}</div>
            <div class="subText">
              {{ v.text }}
            </div>
          </div>
          <el-icon v-if="activeId == v.id"><Select /></el-icon>
        </div>
      </div>
      <div v-if="list.length > 0" style="height: calc(100% - 53px); overflow: hidden">
        <RelationGraph
          style="background: #f2f3f5"
          ref="graphRef"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-line-click="onLineClick"
          :on-node-drag-end="onNodeDragEnd"
        >
          <template #node="{ node }">
            <div
              class="my-rg-node"
              :title="node.text"
              :style="{ height: node.data.products ? node.data.products.length * 45 + 'px' : '80px' }"
            >
              <div class="box" :style="{ height: node.data.products ? node.data.products.length * 45 + 'px' : '80px' }">
                <div class="name-text">
                  <div v-for="v in node.data.products" :key="v.id">{{ v.product_name }}</div>
                  <div class="subText">
                    {{ node.text }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </RelationGraph>
      </div>

      <div v-else style="margin-top: 30%; color: #999999; text-align: center">
        <img src="@/assets/images/notData.png" alt="" srcset="" />
        <p>暂无数据</p>
      </div>
    </div>
    <!-- 新增产品 -->
    <el-dialog
      v-model="dialogVisibleAdd"
      :close-on-click-modal="false"
      :title="addFlag == 1 ? '新增产品' : '编辑产品'"
      :width="700"
    >
      <div style="padding: 10px 20px 0; text-align: center">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="所属工序" prop="process_id">
            <el-select v-model="ruleForm.process_id">
              <el-option v-for="v in processList" :label="v.name" :value="Number(v.id)" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否最终产品" prop="product_type">
            <el-select v-model="ruleForm.product_type">
              <el-option v-for="v in product_typeList" :label="v.name" :value="Number(v.id)" :key="v.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品描述" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </div>
      <div style="flex: auto; padding-right: 20px; text-align: right">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  production_process_diagram,
  production_process_layout_info,
  production_process_list,
  product_add,
  product_update,
  // product_info,
  product_delete
  // production_process_layout_delete
} from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
// import { ElMessageBox } from "element-plus";
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
  data() {
    return {
      list: [],
      //关系图配置
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
      },
      // 新增产品
      dialogVisibleAdd: false,
      processList: [],
      product_typeList: [
        { name: "最终产物", id: 2 },
        { name: "中间产物", id: 1 }
      ],
      addFlag: "",
      ruleForm: {
        name: "",
        // product_file_id: "",
        description: "",
        process_id: "",
        product_type: 1,
        // org_id: "",
        process_ids: []
      },
      rules: {
        name: [{ required: true, message: "请输入产品名称" }],
        process_id: [{ required: true, message: "必填项" }],
        product_type: [{ required: true, message: "必填项" }]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    }
  },
  mounted() {
    this.featch_process_diagram();
  },
  methods: {
    initPage(val) {
      this.unitVal = val;
    },
    //查询生产工序
    featch_process_diagram() {
      let str = "";
      production_process_diagram(str).then(res => {
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
      if (lines.length == 0) {
        return;
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
      this.activeId = nodeObject.id;
      this.nodeObject = nodeObject;
      console.log(this.nodeObject);
    },
    onNodeDragEnd(nodeObject) {
      if (this.layoutNameValue == "fixed") {
        this.positionObj[nodeObject.id + "x"] = nodeObject.x;
        this.positionObj[nodeObject.id + "y"] = nodeObject.y;
      }
    },
    onLineClick(lineObject) {
      console.log("onLineClick:", lineObject);
    },
    //新增产品
    //查询工序列表
    production_process_list() {
      production_process_list().then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.processList = res.data.list;
        } else {
          this.processList = [];
        }
      });
    },
    addMethod() {
      this.addFlag = 1;
      this.dialogVisibleAdd = true;
      this.production_process_list();
      this.ruleForm = {
        name: "",
        description: "",
        product_type: 1,
        process_ids: []
      };
    },
    //编辑产品
    editProcess() {
      if (!this.productNode.id) {
        this.$message.warning("请先选择一个产品");
        return;
      }
      this.addFlag = 2;
      this.dialogVisibleAdd = true;
      this.production_process_list();
      this.ruleForm.id = this.productNode.id;
      this.ruleForm.name = this.productNode.name;
      this.ruleForm.description = this.productNode.description;
      this.ruleForm.process_id = this.productNode.process_id;
      this.ruleForm.product_type = this.productNode.product_type;
      this.ruleForm.process_ids = this.selectProcessList.map(Number);
    },
    cancelClick() {
      this.dialogVisibleAdd = false;
    },
    confirmClick() {
      if (this.addFlag == 1) {
        product_add({ process_id: this.ruleForm.process_id, list: [this.ruleForm] }).then(res => {
          if (res.code == 0) {
            this.$message.success("新增成功");
            this.featch_process_diagram();
            this.dialogVisibleAdd = false;
          }
        });
        return;
      }
      product_update([this.ruleForm]).then(res => {
        if (res.code == 0) {
          this.$message.success("更新成功");
          this.featch_process_diagram();
          this.clickNode(this.clickProductNode);
          this.dialogVisibleAdd = false;
        }
      });
    },
    deleteProcess() {
      if (!this.productNode.id) {
        this.$message.warning("请选择产品");
        return;
      }
      ElMessageBox.confirm("确定删除该产品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          product_delete({ id: Number(this.productNode.id) }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.product_list();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .left {
    width: 300px;
    min-width: 100px;
    height: 100%;
    margin-right: 20px;
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
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    border: 1px solid #cccccc;
    border-radius: 10px;
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
      top: 70px;
      right: 20px;
      left: 20px;
      z-index: 100;
      .box {
        position: relative;
        float: left;
        width: 225px;
        min-height: 70px;
        margin: 0 10px 10px 0;
        cursor: pointer;
        background: #ffffff;
        border-radius: 6px;
        .name-text {
          position: absolute;
          top: 5px;
          box-sizing: border-box;
          width: 225px;
          min-height: 60px;
          padding-top: 8px;
          padding-left: 70px;
          background: url("@/assets/images/org/cp2.svg") no-repeat;
          background-size: 100% 100%;
          > div {
            overflow: hidden;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .subText {
            font-size: 14px;
            font-weight: normal;
            color: #8894b3;
          }
        }
        > i {
          float: right;
          margin-top: 30px;
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
      min-height: 80px;

      // border: 1px solid blue;
      .box {
        position: relative;
        float: left;
        width: 225px;
        min-height: 80px;
        margin: 0 10px 10px 0;
        cursor: pointer;
        background: #ffffff;

        // border: 1px solid red;
        border-radius: 6px;
        .name-text {
          position: absolute;
          top: 10px;
          box-sizing: border-box;
          width: 225px;
          min-height: 60px;
          padding-top: 10px;
          padding-left: 70px;
          background: url("@/assets/images/org/cp2.svg") no-repeat;
          background-size: 100% 100%;
          > div {
            overflow: hidden;
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .subText {
            font-size: 14px;
            font-weight: normal;
            color: #8894b3;
          }
        }
        > i {
          float: right;
          margin-top: -50px;
          margin-right: 3px;
          font-size: 25px;
          color: #0ec69a;
        }
      }

      // .box {
      //   position: relative;
      //   width: 225px;
      //   overflow: hidden;
      //   text-align: left;
      //   cursor: pointer;
      //   background: #ffffff;
      //   border-radius: 6px;
      //   > img {
      //     float: left;
      //   }
      //   .name-text {
      //     box-sizing: border-box;

      //     // float: left;
      //     width: 225px;
      //     padding-left: 70px;
      //     margin-top: -40px;
      //     > div {
      //       overflow: hidden;
      //       font-size: 16px;
      //       font-weight: bold;
      //       color: #1f304c;
      //       text-overflow: ellipsis;
      //       white-space: nowrap;
      //     }
      //     .subText {
      //       font-size: 14px;
      //       font-weight: normal;
      //       color: #8894b3;
      //     }
      //   }
      // }
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
