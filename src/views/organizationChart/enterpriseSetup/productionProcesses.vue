<template>
  <div class="process-content">
    <div class="left" ref="refLeft" v-if="false">
      <h1>
        <div>
          <img src="@/assets/images/common/company.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />组织构架
        </div>
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
                <img
                  v-if="data.org_type == 1 || data.org_type == 2"
                  src="@/assets/images/common/company.svg"
                  alt=""
                  style="width: 17px; height: 17px; margin-right: 3px"
                />
                <img
                  v-if="data.org_type == 3"
                  src="@/assets/images/common/bumen.svg"
                  alt=""
                  style="width: 16px; height: 16px; margin-right: 3px"
                />
                {{ node.label }}
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" ref="refRight">
      <!-- 平台来源 -->
      <div class="set-btn">
        <span>工序图 </span>
        <div>
          <el-button type="primary" :disabled="!isEdit" @click="addMethod"> 新增 </el-button>
          <el-button type="primary" :disabled="!isEdit" @click="editProcess">编辑</el-button>
          <el-button type="primary" @click="viewDetail">详情</el-button>
          <el-button type="danger" :disabled="!isEdit" @click="deleteProcess">删除</el-button>
          <el-button type="success" :disabled="!isEdit" @click="setProcess(true)"> 设置工序图 </el-button>
          <el-button type="primary" :disabled="!isEdit" @click="savePosition">保存布局</el-button>
        </div>
      </div>
      <div class="noline-box">
        <div class="box" @click="onNodeClick(v)" v-for="v in noLineNodes" :key="v.id">
          <span :title="v.text">
            {{ v.text }}
          </span>
          <div class="subText">
            <div v-for="k in v.data.products" :key="k.id" :title="k.product_name">{{ k.product_name }}</div>
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
            <div class="my-rg-node" :title="node.text">
              <div class="text">{{ node.text }}</div>
              <div class="subText">
                <div v-for="v in node.data.products" :key="v.id">{{ v.product_name }}</div>
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
    <!-- 工序详情 -->
    <el-drawer v-model="drawer2" :direction="direction" size="700px">
      <template #header>
        <h4>工序详情</h4>
      </template>
      <template #default>
        <div class="process-detail">
          <h1>{{ processInfo.name }}</h1>
          <div style="font-size: 14px; line-height: 24px; color: #4a5975">
            {{ processInfo.description }}
          </div>
          <h1 style="padding-top: 20px">碳排放源</h1>
          <h3><span></span>直接排放</h3>
          <div>
            <ul>
              <li class="product-item" v-for="v in zhijieList" :key="v.id">
                {{ v.industry_varieties.variety.name }}
                <span>
                  {{ emission_process_obj[v.industry_varieties.variety.emission_process_type] }}
                </span>
              </li>
            </ul>
          </div>
          <h3><span></span>间接排放</h3>
          <div>
            <ul>
              <li class="product-item" v-for="v in jianjieList" :key="v.id">
                {{ v.industry_varieties.variety.name }}
                <span>
                  {{ emission_process_obj[v.industry_varieties.variety.emission_process_type] }}
                </span>
              </li>
            </ul>
          </div>
          <h1 style="padding-top: 20px">输出产物</h1>
          <div>
            <ul>
              <li class="product-item" v-for="v in outputList" :key="v.id">
                {{ v.name }}
                <span>
                  {{ v.product_type == 2 ? "最终产物" : "中间产物" }}
                </span>
              </li>
            </ul>
          </div>
          <h1 style="padding-top: 20px">关联上游工序</h1>
          <div v-if="processInfo.up_streams">
            <ul>
              <li class="product-item" v-for="v in processInfo.up_streams" :key="v.id">
                {{ v.name }}
              </li>
            </ul>
          </div>
          <h1 style="padding-top: 20px">关联下游工序</h1>
          <div v-if="processInfo.down_streams">
            <ul>
              <li class="product-item" v-for="v in processInfo.down_streams" :key="v.id">
                {{ v.name }}
              </li>
            </ul>
          </div>
          <div class="co2-box" v-if="false">
            <h2>化石燃料燃烧CO2排放</h2>
            <ul class="one">
              <li>煤</li>
              <li>石油</li>
              <li>燃气</li>
            </ul>
            <h2>工业过程排放</h2>
            <ul>
              <li>碳酸盐使用过程CO2排放（输入）</li>
              <li>CO2回收利用量（输入）</li>
              <li>废水厌氧处理CH4排放（输出）</li>
              <li>CH4回收与销毁量（输出）</li>
            </ul>
          </div>
        </div>
      </template>
    </el-drawer>
    <!-- 设置工序图 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" title="构建工序上下游" :width="700">
      <div class="dialog-content">
        <div>
          <h1>上游工序</h1>
          <div class="dialog-box">
            <div
              @click="selectUpNode(item)"
              :class="{ upActive: upList.indexOf(item.id) != -1 }"
              v-for="item in list"
              :key="item.id"
              :title="item.name + '(' + item.org_name + ')'"
            >
              <p style="font-size: 14px">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div>
          <h1>选中工序</h1>
          <div class="dialog-box">
            <div
              @click="selectNode(item)"
              :class="{ active: nodeFlag == item.id }"
              v-for="item in list"
              :key="item.id"
              :title="item.name + '(' + item.org_name + ')'"
            >
              <p style="font-size: 14px">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div>
          <h1>下游工序</h1>
          <div class="dialog-box">
            <div
              @click="selectNextNode(item)"
              :class="{ nextActive: nextList.indexOf(item.id) != -1 }"
              v-for="item in list"
              :key="item.id"
              :title="item.name + '(' + item.org_name + ')'"
            >
              <p style="font-size: 14px">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 20px; text-align: center">
        <el-button @click="setProcess(false)">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
    <!-- 新增生产工序 -->
    <el-drawer v-model="addDrawer" :direction="direction" size="80%">
      <template #header>
        <h4>{{ editFlag == "edit" ? "编辑" : "新增" }}生产工序</h4>
      </template>
      <addProcesses ref="addProcessesRef" :tree-node="treeNode" :edit-flag="editFlag" @cancel-add="cancelAdd" />
    </el-drawer>
  </div>
</template>
<script>
import { organizationList } from "@/api/modules/organization.js";
import {
  production_process_diagram,
  set_process_relation,
  production_process_info,
  production_process_delete,
  product_list,
  production_process_layout_add,
  production_process_layout_update,
  production_process_layout_info,
  process_boundary_list
  // production_process_layout_delete
} from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox } from "element-plus";
import addProcesses from "./addProcesses/index.vue";
import RelationGraph from "relation-graph-vue3";
export default {
  components: {
    addProcesses,
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
      filterText: "",
      dataSource: [],
      treeNode: {},
      //工序详情
      emission_process_obj: {
        1: "化石燃料燃烧排放",
        2: "净购入的电力排放",
        3: "净购入的热力排放(热水)",
        4: "净购入的热力排放(蒸汽)",
        5: "熟料生产过程产生的碳排放（熟料）",
        6: "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        7: "光伏发电"
      },
      drawer2: false,
      direction: "rtl",
      processInfo: "",
      outputList: [],
      zhijieList: [],
      jianjieList: [],
      // 设置工序
      dialogVisibleAdd: false,
      nodeObject: "",
      upList: [],
      nodeFlag: "",
      nextList: [],
      list: [],
      linkList: [],
      //新增工序
      addDrawer: false,
      editFlag: "",
      active: 2,
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
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    is_admin() {
      return this.userInfo.is_admin;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    this.featchTree();
  },
  methods: {
    initPage(val) {
      this.unitVal = val;
    },
    //获取树结构
    featchTree() {
      organizationList().then(res => {
        if (res.code == 0 && res.data && res.data.length > 0) {
          this.dataSource = res.data;
          this.handleClickNode({ level: 1 }, res.data[0]);
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
      this.nodeObject = {};
      this.treeNode = data;
      this.featch_process_diagram(data);
    },
    //新增工序 ,只有在部门可以新增工序，在公司级别设置工序图
    addMethod() {
      this.addDrawer = true;
      this.editFlag = "add";
      this.$nextTick(() => {
        this.$refs.addProcessesRef.initAdd();
      });
    },
    //编辑
    editProcess() {
      if (!this.nodeObject.id) {
        this.$message.warning("请选择工序进行编辑");
        return;
      }
      this.addDrawer = true;
      this.editFlag = "edit";
      production_process_info({ id: this.nodeObject.id }).then(res => {
        if (res.code == 0 && res.data) {
          this.$nextTick(() => {
            this.$refs.addProcessesRef.edit(res.data);
          });
        }
      });
    },
    cancelAdd(val) {
      if (val == "addAndNext") {
        this.featch_process_diagram(this.treeNode);
        return;
      }
      this.addDrawer = false;
      if (val == "addSuccess") {
        this.featch_process_diagram(this.treeNode);
      }
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
    //保存自定义布局
    savePosition() {
      let obj = {};
      this.$refs.graphRef.getInstance().graphData.nodes.map(v => {
        obj[v.id + "x"] = v.x;
        obj[v.id + "y"] = v.y;
      });
      let params = {
        layout: JSON.stringify(obj),
        type: 3,
        layout_model: 1
      };
      if (this.layoutNameValue == "fixed") {
        production_process_layout_update(params).then(res => {
          if (res.code == 0) {
            this.$message.success("保存成功");
          }
        });
        return;
      }
      production_process_layout_add(params).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.featch_process_diagram(this.treeNode);
        }
      });
    },
    onNodeClick(nodeObject) {
      this.activeId = nodeObject.id;
      this.nodeObject = nodeObject;
    },
    onNodeDragEnd(nodeObject) {
      if (this.layoutNameValue == "fixed") {
        this.positionObj[nodeObject.id + "x"] = nodeObject.x;
        this.positionObj[nodeObject.id + "y"] = nodeObject.y;
      }
    },
    //查询工序详情
    getProcessInfo(id) {
      production_process_info({ id: id }).then(res => {
        this.upList = [];
        this.nextList = [];
        if (res.code == 0 && res.data) {
          this.processInfo = res.data;
          if (res.data.up_streams) {
            res.data.up_streams.map(v => {
              this.upList.push(v.id);
            });
          }
          if (res.data.down_streams) {
            res.data.down_streams.map(v => {
              this.nextList.push(v.id);
            });
          }
        }
      });
    },
    onLineClick(lineObject) {
      console.log("onLineClick:", lineObject);
    },
    //设置工序关联关系
    setProcess(val) {
      this.dialogVisibleAdd = val;
      this.upList = [];
      this.nodeFlag = this.nodeObject.id;
      this.nextList = [];
      if (this.nodeFlag) {
        this.getProcessInfo(this.nodeFlag);
      }
    },
    selectUpNode(item) {
      let i = this.upList.indexOf(item.id);
      if (i != -1) {
        this.upList.splice(i, 1);
      } else {
        this.upList.push(item.id);
      }
    },
    selectNode(item) {
      this.nodeFlag = item.id;
      this.getProcessInfo(this.nodeFlag);
    },
    selectNextNode(item) {
      let i = this.nextList.indexOf(item.id);
      if (i != -1) {
        this.nextList.splice(i, 1);
      } else {
        this.nextList.push(item.id);
      }
    },
    confirm() {
      let params = {
        id: Number(this.nodeFlag),
        up_stream_ids: this.upList,
        down_stream_ids: this.nextList
      };
      set_process_relation(params).then(res => {
        if (res.code == 0) {
          this.$message.success("设置成功");
          this.dialogVisibleAdd = false;
          this.featch_process_diagram(this.treeNode);
        }
      });
    },
    //删除工序
    deleteProcess() {
      if (!this.nodeObject.id) {
        this.$message.warning("请选择工序");
        return;
      }
      ElMessageBox.confirm("确定删除该工序吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          production_process_delete({ id: Number(this.nodeObject.id) }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.featch_process_diagram(this.treeNode);
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //查看详情
    viewDetail() {
      if (!this.nodeObject.id) {
        this.$message.warning("请选择工序");
        return;
      }
      this.getProcessInfo(this.nodeObject.id);
      this.output_list();
      this.process_boundary_list();
      this.drawer2 = true;
    },
    //物料列表
    output_list() {
      // admin/product/list?page=1&page_size=100&process_id=18
      product_list({ process_id: this.nodeObject.id }).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.outputList = res.data.list;
        } else {
          this.outputList = [];
        }
      });
    },
    process_boundary_list() {
      process_boundary_list(`production_process_id=${this.nodeObject.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.zhijieList = [];
          this.jianjieList = [];
          res.data.list.map(v => {
            if (v.boundary_type == 1) {
              this.zhijieList.push(v);
            } else if (v.boundary_type == 2) {
              this.jianjieList.push(v);
            }
          });
        } else {
          this.zhijieList = [];
          this.jianjieList = [];
        }
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
          white-space: nowrap;
          > div {
            margin-right: 5px;
          }
        }
        > i {
          float: right;
          margin-top: -35px;
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
