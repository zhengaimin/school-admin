<template>
  <div class="current-link">
    <div class="form-box">
      <label for="">合作方</label>
      <el-select filterable @change="selectTenant" style="width: 300px" v-model="tenant_id" placeholder="请选择">
        <el-option v-for="v in tenant_list" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
      <label for="" style="margin-left: 20px">合作方公司</label>
      <el-select filterable style="width: 300px" v-model="com_id" @focus="getcomList" @change="selectCom" placeholder="请选择">
        <el-option v-for="v in com_list" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
      <div style="margin-top: 5px">
        <el-radio-group v-model="device_id" @change="selectDevice">
          <el-radio-button v-for="v in device_list" :key="v.id" :label="v.labelName" :value="v.id" />
        </el-radio-group>
      </div>
    </div>
    <div ref="myPage" class="my-graph" @click="isShowNodeMenuPanel = false">
      <RelationGraph ref="graphRef" :options="graphOptions">
        <template #node="{ node }">
          <div>
            <div v-if="node.text == '主设备'" style="width: 300px; padding: 10px; text-align: left; cursor: pointer">
              <div style="display: grid; grid-template-columns: auto 100px">
                <div style="color: #ffffff">
                  <div style="font-size: 16px">{{ node.text }}</div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>
                      设备名称：<span style="color: #fafd05">{{ node.data.name }}</span>
                    </p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>
                      MAC地址：<span style="color: #fafd05">{{ node.data.mac }}</span>
                    </p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>网络: 4G</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>总连接设备: 在线：{{ lines.length }}个</p>
                  </div>
                  <div class="btnText">
                    <el-button type="primary" @click="addDevide(node)">添加电表</el-button>
                    <el-button type="primary" @click="send_config(node)">下发配置</el-button>
                  </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center">
                  <img style="width: 100px; height: 100px" src="@/assets/images/divice/main.svg" alt="" srcset="" />
                </div>
              </div>
            </div>
            <div v-else style="width: 300px; padding: 10px; text-align: left; cursor: pointer">
              <div style="display: grid; grid-template-columns: auto 90px">
                <div style="color: #ffffff">
                  <div style="font-size: 14px">计量设备名称：{{ node.text }}</div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>型号: {{ node.data.meter_model }}</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>连接状态: 连接成功/连接失败</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>通信地址: {{ node.data.con_address }}</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>计量器具编号: {{ node.data.instrument_number }}</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>安装地址: {{ node.data.address }}</p>
                  </div>
                  <div class="text-name">
                    <span class="dot1"></span>
                    <p>
                      手册下载：
                      <span @click="downFile(node.data.manual_url)" style="color: #fafd05">{{ node.data.manual_url }}</span>
                    </p>
                  </div>
                  <div class="btnText">
                    <el-button type="primary" @click="sendAgain(node)">重连</el-button>
                    <el-button type="primary" @click="readAndWrite(node)">读写测试</el-button>
                  </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center">
                  <img
                    v-if="node.data.link"
                    style="width: 90px; height: 90px"
                    src="@/assets/images/divice/eq2.svg"
                    alt=""
                    srcset=""
                  />
                  <img v-else style="width: 90px; height: 90px" src="@/assets/images/divice/eq1.svg" alt="" srcset="" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </RelationGraph>
    </div>
    <!-- 添加子节点 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="!form.id ? '新增' : '编辑'" width="1000">
      <div>
        <el-form ref="form" :model="form" :rules="formrules" label-width="110px" label-position="top">
          <el-row>
            <el-col :span="11">
              <el-form-item label="计量器具" prop="id">
                <el-select filterable v-model="form.id" @change="selectqj" placeholder="请选择">
                  <el-option v-for="v in instrumentList" :key="v.id" :label="v.labelName" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="通信地址" prop="con_address">
                <el-input placeholder="范围在1~1014" type="number" v-model.number="form.con_address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="安装地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="协议模板" prop="protocol_template_id">
                <el-select
                  v-model="form.protocol_template_id"
                  placeholder="请选择"
                  style="width: 100%"
                  @focus="protocol_templateList"
                >
                  <el-option v-for="item in protocolTemplateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="寄存器模板" prop="register_template_id">
                <el-select
                  v-model="form.register_template_id"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="getInfo"
                  @focus="register_templateList"
                >
                  <el-option v-for="item in registerTemplateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="false">
            <el-col :span="23">
              <el-form-item label="计量器具编号">
                <el-input v-model="form.instrument_number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="messageDetail">
            <el-row>
              <el-col :span="7">协议类型：Modbus</el-col>
              <el-col :span="7" offset="1">波特率：{{ protocol_config.baud_rate }}</el-col>
              <el-col :span="7" offset="1">校验方式：{{ ["无校验", "奇校验", "偶校验"][protocol_config.parity] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="7">数据位：{{ protocol_config.data_bits }}</el-col>
              <el-col :span="7" offset="1">停止位：{{ protocol_config.stop_bits }}</el-col>
            </el-row>
          </div>
          <div class="messageDetail info_box">
            <div v-for="v in registerInfoList" :key="v.id">{{ v.item_name }}</div>
          </div>
          <div style="margin: 10px 0 0 10px; text-align: center">
            <el-button @click="dialogVisibleAdd = false">取消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 读写测试 -->
    <el-dialog v-model="readDialogVisible" :close-on-click-modal="false" title="寄存器读写测试" width="1000">
      <div style="margin: 5px 0 10px">
        <el-radio-group v-model="readForm.type" @change="changeReadType">
          <el-radio-button label="读测试" :value="Number(1)" />
          <el-radio-button label="写测试" :value="Number(2)" />
        </el-radio-group>
      </div>
      <div v-if="readForm.type == 1">
        <el-checkbox-group v-model="readForm.register_ids">
          <template v-for="v in TemplateList" :key="v.id">
            <el-checkbox style="margin-bottom: 10px" :label="v.item_name + '(' + v.register_name + ')'" :value="v.id" border />
          </template>
        </el-checkbox-group>
      </div>
      <div v-else>
        <el-radio-group v-model="readForm.register_id">
          <template v-for="v in TemplateList" :key="v.id">
            <el-radio v-if="v.rw_type == 2" :value="v.id">{{ v.item_name + "(" + v.register_name + ")" }}</el-radio>
          </template>
        </el-radio-group>
      </div>
      <div v-if="readForm.type == 1">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="readList">
          <el-table-column label="数据项名称" prop="register_name" align="left"> </el-table-column>
          <el-table-column label="寄存器地址变量名" prop="register_hex_address" align="left"> </el-table-column>
          <el-table-column label="值" prop="data" align="left"> </el-table-column>
        </el-table>
      </div>
      <div class="read-box" v-else>
        <span style="padding-right: 10px">写入值:</span> <el-input style="width: 30%" v-model="readForm.data"></el-input>
        <div style="padding-left: 20px" v-for="v in readList" :key="v.id">
          <span>读取值：{{ v.data }}</span>
        </div>
      </div>
      <div style="margin: 10px 0 0 10px; text-align: center">
        <el-button @click="resetForm(false)">取消</el-button>
        <el-button type="primary" v-if="readForm.type == 1" @click="confirmRead">读取测试</el-button>
        <el-button type="primary" v-else @click="confirmRead">写入测试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RelationGraph from "relation-graph-vue3";
const graphOptions = {
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultJunctionPoint: "border",
  defaultNodeColor: "#409EFF",
  defaultNodeShape: 1,
  defaultNodeBorderWidth: 0,
  defaultNodeBorderColor: "#409EFF",
  layouts: [
    {
      layoutLabel: "网关图",
      layoutName: "center", //force , tree, center, folder
      distance_coefficient: 1.3
    }
  ]
};
import {
  meter_modelList,
  protocol_templateList,
  register_templateList,
  register_templateInfo,
  instrumentConfig,
  instrumentList,
  test_register
} from "@/api/modules/IotManagement.js";
import { tenantList, comList } from "@/api/modules/InternalPage.js";
import { device_list, send_register_config } from "@/api/modules/currentLink.js";
export default {
  name: "Demo4AdvLineSlot",
  components: { RelationGraph },
  data() {
    return {
      isShowCodePanel: false,
      isShowNodeMenuPanel: false,
      nodeMenuPanelPosition: { x: 0, y: 0 },
      graphOptions,
      tenant_list: [],
      tenant_id: "",
      com_list: [],
      device_list: [],
      device_id: "",
      mainNode: {},
      // 新增
      nodes: [],
      lines: [],
      dialogVisibleAdd: false,
      instrumentList: [],

      xinghao_list: [],
      protocolTemplateList: [],
      registerTemplateList: [],
      registerInfoList: [],
      form: {
        id: "",
        meter_model_id: "",
        name: "",
        address: "",
        instrument_number: "",
        con_address: "",
        protocol_template_id: "",
        register_template_id: "",
        device_id: ""
      },
      formrules: {
        id: [{ required: true, message: "必填项" }],
        address: [{ required: true, message: "必填项" }],
        con_address: [{ required: true, message: "必填项" }],
        protocol_template_id: [{ required: true, message: "必填项" }],
        register_template_id: [{ required: true, message: "必填项" }]
      },
      // 读写测试
      TemplateList: [],
      readDialogVisible: false,
      readForm: {
        instrument_id: "",
        type: 1,
        register_ids: [],
        register_id: "",
        data: ""
      },
      readList: []
    };
  },
  computed: {
    protocol_config() {
      let ary = this.protocolTemplateList.filter(item => item.id == this.form.protocol_template_id);
      return ary.length > 0 ? JSON.parse(ary[0].protocol_config) : "";
    }
  },
  mounted() {
    this.fetchAllTenantList();
  },
  methods: {
    //获取合作方
    fetchAllTenantList() {
      let params = `page=1&page_size=100`;
      tenantList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.tenant_list = res.data.list;
          this.tenant_id = this.tenant_list[0].id;
        } else {
          this.tenant_list = [];
          this.tenant_id = "";
        }
      });
    },
    selectTenant() {
      this.com_id = "";
    },
    // 合作公司
    getcomList() {
      let str = `page=1&page_size=100&tenant_id=${this.tenant_id}`;
      comList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.com_list = res.data.list;
          return;
        }
        this.com_list = [];
      });
    },
    selectCom() {
      let str = `tenant_id=${this.tenant_id}&com_id=${this.com_id}&page=1&page_size=100`;
      device_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
          res.data.list.map(v => {
            let typename = v.device_type == 1 ? "真实网关" : "虚拟网关";
            v.labelName = v.name + "(" + typename + ")";
          });
          this.device_list = res.data.list;
          this.device_id = this.device_list[0].id;
          this.selectDevice();
          return;
        }
        this.$message.warning("该合作方暂无网关设备");
        this.device_list = [];
        this.device_id = "";
      });
    },
    selectDevice() {
      this.mainNode = this.device_list.filter(item => item.id == this.device_id)[0];
      this.nodes = [
        {
          id: "main" + this.mainNode.id,
          text: "主设备",
          color: "none",
          borderColor: "none",
          data: {
            name: this.mainNode.name,
            mac: this.mainNode.mac
          }
        }
      ];
      this.lines = [];
      this.device_list.filter(item => item.id);
      let str = `type=${this.mainNode.device_type}&page=1&page_size=100&&com_id=${this.com_id}&device_id=${this.mainNode.id}`;
      instrumentList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          res.data.list.map(v => {
            let obj = {
              id: v.id,
              text: v.name,
              color: "none",
              borderColor: "none",
              data: {
                link: true,
                id: v.id,
                meter_model: v.meter_model ? v.meter_model.name : "",
                register_template_id: v.register_template_id,
                manual_url: v.meter_model ? v.meter_model.manual_url : "",
                con_address: v.con_address,
                address: v.address,
                instrument_number: v.instrument_number
              }
            };
            let lineObj = {
              from: v.id.toString(),
              to: "main" + this.mainNode.id.toString(),
              text: "",
              // animation: 1,
              color: "#F23D4F",
              lineWidth: 2,
              showStartArrow: true,
              useTextPath: true
            };
            this.nodes.push(obj);
            this.lines.push(lineObj);
          });
          this.showGraph();
        } else {
          this.lines = [];
          this.showGraph();
        }
      });
    },
    showGraph() {
      const __graph_json_data = {
        rootId: "aa",
        nodes: this.nodes,
        lines: this.lines
        // nodes: [
        //   // 注意：在节点配置信息中，你的自定义属性需要像下面这样放到data标签中，否则数据会丢失
        //   { id: "2", text: "主设备", color: "none", borderColor: "none" },
        //   { id: "1", text: "电表1", color: "none", borderColor: "none", data: { link: true } },
        //   { id: "4", text: "电表2", color: "#ffffff", borderColor: "#ffffff", data: { link: true } },
        //   { id: "6", text: "电表3", color: "#ffffff", borderColor: "#ffffff", data: { link: true } },
        //   { id: "7", text: "电表4", color: "#ffffff", borderColor: "#ffffff", data: { link: true } },
        //   { id: "8", text: "电表5", color: "#ffffff", borderColor: "#ffffff", data: { link: false } },
        //   { id: "9", text: "电表6", color: "#ffffff", borderColor: "#ffffff", data: { link: false } }
        // ],
        // lines: [
        //   {
        //     from: "1",
        //     to: "2",
        //     text: "数据传输中",
        //     animation: 1,
        //     color: "#0DCD58",
        //     lineWidth: 3,
        //     showStartArrow: true,
        //     useTextPath: true
        //   },
        //   {
        //     from: "4",
        //     to: "2",
        //     text: "数据传输中",
        //     animation: 1,
        //     color: "#0DCD58",
        //     lineWidth: 3,

        //     showStartArrow: true,
        //     useTextPath: true
        //   },
        //   {
        //     from: "6",
        //     to: "2",
        //     text: "数据传输中",
        //     animation: 1,
        //     color: "#0DCD58",
        //     lineWidth: 3,

        //     showStartArrow: true,
        //     useTextPath: true
        //   },
        //   {
        //     from: "7",
        //     to: "2",
        //     text: "数据传输中",
        //     animation: 1,
        //     color: "#0DCD58",
        //     lineWidth: 3,

        //     showStartArrow: true,
        //     useTextPath: true
        //   },
        //   {
        //     from: "8",
        //     to: "2",
        //     lineWidth: 2,

        //     text: "连接失败",
        //     color: "#F23D4F",
        //     showEndArrow: false,
        //     useTextPath: true
        //   },
        //   {
        //     from: "9",
        //     to: "2",
        //     lineWidth: 2,

        //     text: "连接失败",
        //     color: "#F23D4F",
        //     showEndArrow: false,
        //     useTextPath: true
        //   }
        // ]
      };
      this.$refs.graphRef.setJsonData(__graph_json_data, graphInstance => {
        // 这些写上当图谱初始化完成后需要执行的代码
        return;
        console.log("onLineClick:", graphInstance);
      });
    },
    send_config() {
      send_register_config({ id: this.mainNode.id }).then(res => {
        if (res.code == 0) {
          this.$message.success("下发成功");
        }
      });
    },
    //添加子节点
    addDevide(node) {
      console.log(node);
      this.getinstrumentList();
      this.form.id = "";
      this.dialogVisibleAdd = true;
      this.meter_modelList();
      //清空表单
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    // 获取计量器具列表
    getinstrumentList() {
      let str = `scope=2&page=1&page_size=100&&com_id=${this.com_id}&type=${this.mainNode.device_type}`;
      instrumentList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          let obj = {
            1: "碳科网关",
            2: "虚拟网关",
            3: "安科瑞网关"
          };
          res.data.list.map(v => {
            let typename = obj[v.type];
            v.labelName = v.name + "(" + typename + ")";
          });
          this.instrumentList = res.data.list;
        } else {
          this.instrumentList = [];
        }
      });
    },
    selectqj() {
      let ary = this.instrumentList.filter(item => item.id == this.form.id);
      this.form.meter_model_id = ary[0].meter_model_id;
      this.form.name = ary[0].name;
    },
    // 获取型号列表
    meter_modelList() {
      let str = `page=1&page_size=100&name=&meter_type=`;
      meter_modelList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.xinghao_list = res.data.list;
        } else {
          this.xinghao_list = [];
        }
      });
    },
    // 获取协议模板列表
    protocol_templateList() {
      let str = `page=1&page_size=100&name=&meter_model_id=${this.form.meter_model_id}`;
      protocol_templateList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.protocolTemplateList = res.data.list;
        } else {
          this.protocolTemplateList = [];
        }
      });
    },
    register_templateList() {
      let str = `page=1&page_size=100&meter_model_id=${this.form.meter_model_id}`;
      register_templateList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.registerTemplateList = res.data.list;
        } else {
          this.registerTemplateList = [];
        }
      });
    },
    getInfo() {
      register_templateInfo({ id: this.form.register_template_id }).then(res => {
        if (res.code == 0 && res.data && res.data.registers && res.data.registers.length > 0) {
          this.registerInfoList = res.data.registers;
        } else {
          this.registerInfoList = [];
        }
      });
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.device_id = this.mainNode.id;
          instrumentConfig(this.form).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.selectDevice();
            }
          });
        }
      });
    },
    downFile(manual_url) {
      window.open(manual_url);
    },
    sendAgain() {
      this.$message.success("重新连接中");
    },
    //读写测试
    readAndWrite(node) {
      this.readForm.instrument_id = node.data.id;
      this.resetForm(true);
      register_templateInfo({ id: node.data.register_template_id }).then(res => {
        if (res.code == 0 && res.data && res.data.registers && res.data.registers.length > 0) {
          this.TemplateList = res.data.registers;
        } else {
          this.TemplateList = [];
        }
      });
    },
    resetForm(bool) {
      this.readForm.type = 1;
      this.readForm.register_ids = [];
      this.readList = [];
      this.readDialogVisible = bool;
    },
    changeReadType() {
      this.readList = [];
      this.readForm.readForm = "";
    },
    confirmRead() {
      if (this.readForm.type == 2) {
        this.readForm.register_ids = [this.readForm.register_id];
      }
      test_register(this.readForm).then(res => {
        if (res.code == 0) {
          this.readList = res.data.list;
          let msg = this.readForm.type == 1 ? "读取成功" : "写入成功";
          this.$message.success(msg);
        } else {
          this.readList = [];
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .rel-map {
  background: none !important;
  .rel-node-shape-1 {
    background: rgb(255 255 255 / 20%) !important;
    backdrop-filter: blur(5px);
    border-radius: 10px;
  }
}
::v-deep .rel-node-checked {
  box-shadow: 0 0 0 8px rgb(255 255 255 / 30%);
}
.current-link {
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 10px;
  .form-box {
    height: 75px;
    > label {
      margin-right: 10px;
      font-size: 14px;
      color: #4a5975;
    }
  }
  .my-graph {
    height: calc(100% - 75px);
    background: url("@/assets/images/divice/bg.jpg") no-repeat center;
    background-size: 100% 100%;
  }
  .text-name {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 200px;
    padding-top: 5px;
    > p {
      width: 190px;
      margin: 0;
      overflow: hidden;
      font-size: 12px;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: nowrap;
    }
    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 5px;
      background: #fafd05;
      border-radius: 8px;
    }
    .dot1 {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 5px;
      background: #cccccc;
      border-radius: 8px;
    }
  }
  .btnText {
    padding: 5px 0 0 10px;
  }
}
.messageDetail {
  width: 880px;
  padding: 20px 20px 10px;
  margin-bottom: 10px;
  background: #dcf1fd;
  border-radius: 10px;
  ::v-deep(.el-row) {
    margin-bottom: 15px;
  }
}
.info_box {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 20px;
  background: #dbfbe7;
}
.read-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}
</style>
