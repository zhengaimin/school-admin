<template>
  <div class="process-content">
    <div class="left" ref="refLeft">
      <h1>
        <div>
          <img src="@/assets/images/common/bumen.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          计量器具列表
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
                <img src="@/assets/images/common/bumen.svg" alt="" style="width: 16px; height: 16px; margin-right: 3px" />
                {{ node.label }}
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" ref="refRight">
      <div class="table-box">
        <div class="btn-box">
          <span>现场数据采集</span>
        </div>
        <div class="table-list">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-position="top">
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="数据采集协议" prop="deal_type">
                      <el-radio-group v-model="ruleForm.deal_type">
                        <el-radio value="1">RS485</el-radio>
                        <el-radio value="2">API</el-radio>
                        <el-radio value="3">Database</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div
                  v-if="ruleForm.deal_type == 1"
                  style="
                    padding: 15px 20px 5px;
                    margin-bottom: 20px;
                    background: #f9fafb;
                    border: 1px solid #dee2eb;
                    border-radius: 6px;
                  "
                >
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="协议类型" prop="deal_type_val">
                        <el-select v-model="ruleForm.deal_type_val" placeholder="请选择">
                          <el-option label="Modbus" value="Modbus" />
                          <el-option label="IEC103" value="IEC103" />
                          <el-option label="DL/T645" value="DL/T645" />
                          <el-option label="Modbus-Slave" value="Modbus-Slave" />
                          <el-option label="Modbus-Control" value="Modbus-Control" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="波特率" prop="rate">
                        <el-select v-model="ruleForm.rate" placeholder="请选择">
                          <el-option label="1200" value="1200" />
                          <el-option label="2400" value="2400" />
                          <el-option label="4800" value="4800" />
                          <el-option label="9600" value="9600" />
                          <el-option label="19200" value="19200" />
                          <el-option label="38400" value="38400" />
                          <el-option label="57600" value="57600" />
                          <el-option label="115200" value="115200" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="校验方式" prop="method">
                        <el-select v-model="ruleForm.method" placeholder="请选择">
                          <el-option label="无校验" value="1" />
                          <el-option label="奇校验" value="2" />
                          <el-option label="偶校验" value="3" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="停止位" prop="stop">
                        <el-select v-model="ruleForm.stop" placeholder="请选择">
                          <el-option label="1" value="1" />
                          <el-option label="2" value="2" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="起始地址" prop="startAddress">
                        <el-input v-model="ruleForm.startAddress" placeholder="请选择" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="结束地址" prop="endAddress">
                        <el-input v-model="ruleForm.endAddress" placeholder="请选择" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div style="margin-bottom: 10px; text-align: left">
                        <el-button type="primary" @click="sendLink(1)">连接测试</el-button>
                        <span v-if="linkFlag == 1" style="margin-left: 10px">连接成功</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div
                  v-if="ruleForm.deal_type == 2"
                  style="
                    padding: 15px 20px 5px;
                    margin-bottom: 20px;
                    background: #f9fafb;
                    border: 1px solid #dee2eb;
                    border-radius: 6px;
                  "
                >
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="主机/host" prop="host">
                        <el-input v-model="ruleForm.host" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="主机/端口" prop="port">
                        <el-input v-model="ruleForm.port" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="协议" prop="protocol">
                        <el-select v-model="ruleForm.protocol" placeholder="请选择">
                          <el-option label="http" value="1" />
                          <el-option label="https" value="2" />
                          <el-option label="tcp" value="3" />
                          <el-option label="udp" value="4" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="端点" prop="point">
                        <el-input v-model="ruleForm.point" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="认证方式" prop="way">
                        <el-select v-model="ruleForm.way" placeholder="请选择">
                          <el-option label="无" value="1" />
                          <el-option label="用户名，密码" value="2" />
                          <el-option label="token" value="3" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="值" prop="wayVal">
                        <el-input v-model="ruleForm.wayVal" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div style="margin-bottom: 10px; text-align: left">
                        <el-button type="primary" @click="sendLink(2)">连接测试</el-button>
                        <span v-if="linkFlag == 2" style="margin-left: 10px">连接成功</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div
                  v-if="ruleForm.deal_type == 3"
                  style="
                    padding: 15px 20px 5px;
                    margin-bottom: 20px;
                    background: #f9fafb;
                    border: 1px solid #dee2eb;
                    border-radius: 6px;
                  "
                >
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="数据库类型" prop="databaseType">
                        <el-select v-model="ruleForm.databaseType" placeholder="请选择">
                          <el-option label="postgres" value="1" />
                          <el-option label="mysql" value="2" />
                          <el-option label="sql-server" value="3" />
                          <el-option label="mariadb" value="4" />
                          <el-option label="mongodb" value="5" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="数据库端口" prop="databaseHost">
                        <el-select v-model="ruleForm.databaseHost" placeholder="请选择">
                          <el-option label="5432" value="1" />
                          <el-option label="3306" value="2" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="用户名" prop="username">
                        <el-input v-model="ruleForm.username" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="数据表" prop="dataSheet">
                        <el-input type="textarea" auto v-model="ruleForm.dataSheet" @click="link" readonly placeholder="请选择" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div style="margin-bottom: 10px; text-align: left">
                        <el-button type="primary" @click="sendLink(3)">连接测试</el-button>
                        <span v-if="linkFlag == 3" style="margin-left: 10px">连接成功</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="类型" prop="send_type">
                      <el-select v-model="ruleForm.send_type" placeholder="请选择">
                        <el-option label="pull" value="pull" />
                        <el-option label="push" value="push" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <el-form-item label="频率" prop="frequency">
                      <el-input v-model="ruleForm.frequency" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="计算公式" prop="equation">
                      <el-input v-model="ruleForm.equation" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="自定义字段" prop="defined">
                      <el-input v-model="ruleForm.defined" placeholder="请输入" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="padding-right: 20px; margin-top: 10px; text-align: right">
          <!-- <el-button :disabled="!isEdit" type="primary" class="search-btn"> 调试 </el-button> -->
          <el-button :disabled="!isEdit" style="width: 100px" type="primary" class="search-btn" @click="submitForm">
            保存
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogLink" :close-on-click-modal="false" title="数据表字段关联" :width="1000">
      <div class="link-box">
        <div class="link-left">
          <h2>外部表字段</h2>
          <div>
            <p v-for="v in list" :key="v" @click="selectFrom(v.label)">
              {{ v.label }}<el-icon v-if="from === v.label"><Select /></el-icon>
            </p>
          </div>
        </div>
        <div class="link-center">
          <h2>内部表字段</h2>
          <div>
            <p v-for="v in list1" :key="v" @click="selectTo(v.label)">
              {{ v.label }}<el-icon v-if="to === v.label"><Select /></el-icon>
            </p>
          </div>
        </div>
        <div class="link-right">
          <h2>关联关系</h2>
          <div>
            <p v-for="(v, index) in linkList" :key="v">
              {{ v.from }}
              <span> -> </span>
              {{ v.to }} <el-icon @click="deleteLink(index)"><Close /></el-icon>
            </p>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; text-align: right">
        <el-button @click="dialogLink = false">取消</el-button>
        <el-button type="primary" @click="saveLink">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { drag } from "@/utils/drag.js";
import { instruments_list, instruments_info, bind_config } from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
import { api_list } from "@/api/modules/menu.js";
export default {
  data() {
    return {
      buttonList: [],
      filterText: "",
      dataSource: [],
      treeNode: "",

      localFile: "",
      linkFlag: false,
      dialogLink: false,
      from: "",
      to: "",
      list: [
        {
          label: "host"
        },
        {
          label: "address"
        },
        {
          label: "update"
        },
        {
          label: "color"
        },
        {
          label: "causes"
        },
        {
          label: "console"
        },
        {
          label: "script"
        },
        {
          label: "header"
        }
      ],
      list1: [
        {
          label: "change"
        },
        {
          label: "click"
        },
        {
          label: "data"
        },
        {
          label: "light"
        },
        {
          label: "color"
        },
        {
          label: "background"
        },
        {
          label: "dialog"
        }
      ],
      linkList: [],
      varietiesList: [],
      emissionObj: [
        "",
        "化石燃料燃烧排放",
        "企业净购入的电力隐含的CO2排放 ",
        "企业净购入的热力(热水)隐含的CO2排放",
        "企业净购入的热力(蒸汽)隐含的CO2排放",
        "熟料生产过程产生的碳排放（熟料）",
        "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        "光伏发电"
      ],
      unitList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      ruleForm: {
        id: "",
        // ----
        deal_type: "1",
        // 1
        deal_type_val: "",
        rate: "",
        method: "",
        stop: "",
        startAddress: "",
        endAddress: "",
        // 2
        host: "",
        port: "",
        protocol: "",
        point: "",
        way: "",
        wayVal: "",
        // 3
        databaseType: "",
        databaseHost: "",
        username: "",
        password: "",
        dataSheet: "",
        // -----
        send_type: "",
        frequency: "",
        equation: "",
        defined: "",
        config_json: ""
      },
      rules: {
        deal_type: [{ required: true, message: "必填项" }],
        deal_type_val: [{ required: true, message: "必填项" }],
        rate: [{ required: true, message: "必填项" }],
        method: [{ required: true, message: "必填项" }],
        stop: [{ required: true, message: "必填项" }],
        startAddress: [{ required: true, message: "必填项" }],
        endAddress: [{ required: true, message: "必填项" }],
        send_type: [{ required: true, message: "必填项" }],
        frequency: [{ required: true, message: "必填项" }],
        equation: [{ required: true, message: "必填项" }],
        host: [{ required: true, message: "必填项" }],
        port: [{ required: true, message: "必填项" }],
        protocol: [{ required: true, message: "必填项" }],
        point: [{ required: true, message: "必填项" }],
        way: [{ required: true, message: "必填项" }],
        wayVal: [{ required: true, message: "必填项" }],
        databaseType: [{ required: true, message: "必填项" }],
        databaseHost: [{ required: true, message: "必填项" }],
        username: [{ required: true, message: "必填项" }],
        password: [{ required: true, message: "必填项" }],
        dataSheet: [{ required: true, message: "必填项" }]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
    this.api_list();
    this.get_instruments_list();
  },
  methods: {
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
    //查询计量器具
    get_instruments_list() {
      let str = ``;
      instruments_list(str).then(res => {
        if (res && res.data && res.data.list) {
          this.dataSource = res.data.list;
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
      this.ruleForm.id = data.id;
      this.getInfo();
    },
    getInfo() {
      instruments_info({ id: this.ruleForm.id }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.initPage(res.data);
        }
      });
    },
    //查询原来采集协议信息
    initPage(data) {
      if (data && data.config_json) {
        this.ruleForm["id"] = data.id;
        let configObj = JSON.parse(data.config_json);
        for (let key in this.ruleForm) {
          if (configObj[key]) {
            this.ruleForm[key] = configObj[key];
          }
          if (configObj.obj[key]) {
            this.ruleForm[key] = configObj.obj[key];
          }
        }
        return;
      }
      this.$refs.ruleFormRef.resetFields();
    },
    submitForm() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          this.ruleForm.config_json = JSON.stringify({
            deal_type: this.ruleForm.deal_type,
            obj: {
              // 1
              deal_type_val: this.ruleForm.deal_type_val,
              rate: this.ruleForm.rate,
              method: this.ruleForm.method,
              stop: this.ruleForm.stop,
              startAddress: this.ruleForm.startAddress,
              endAddress: this.ruleForm.endAddress,
              // 2
              host: this.ruleForm.host,
              port: this.ruleForm.port,
              protocol: this.ruleForm.protocol,
              point: this.ruleForm.point,
              way: this.ruleForm.way,
              wayVal: this.ruleForm.wayVal,
              // 3
              databaseType: this.ruleForm.databaseType,
              databaseHost: this.ruleForm.databaseHost,
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              dataSheet: this.ruleForm.dataSheet
            },
            send_type: this.ruleForm.send_type,
            frequency: this.ruleForm.frequency,
            equation: this.ruleForm.equation,
            defined: this.ruleForm.defined
          });
          let params = {
            id: this.ruleForm.id,
            config_json: this.ruleForm.config_json
          };
          bind_config(params).then(res => {
            if (res.code == 0) {
              this.$message.success("保存成功");
            }
          });
        }
      });
    },
    sendLink(val) {
      this.linkFlag = val;
    },
    link() {
      this.dialogLink = true;
    },
    selectFrom(label) {
      this.from = label;
    },
    selectTo(label) {
      if (this.from == "") {
        this.$message.error("请先选择外部字段");
      } else {
        this.to = label;
        let obj = {
          from: this.from,
          to: this.to
        };
        this.linkList.push(obj);
        this.from = "";
        this.to = "";
      }
    },
    deleteLink(index) {
      this.linkList.splice(index, 1);
    },
    saveLink() {
      this.ruleForm.dataSheet = JSON.stringify(this.linkList);
      this.dialogLink = false;
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
    display: auto;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    background: #ffffff;
    border-radius: 10px;
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 20px;
      border-bottom: 1px solid #f4f6fa;
      > span {
        font-size: 16px;
      }
    }
    .table-list {
      height: calc(100% - 146px);
      padding: 20px 30px;
      overflow: auto;
      .date-sort {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .super_admin {
        padding: 3px 8px;
        color: #ffffff;
        background: #0ec69a;
        border-radius: 5px;
      }
    }
    .demo-pagination-block {
      position: absolute;
      right: 12px;
      bottom: 10px;
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
.icon-box {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #4a5975;
  cursor: pointer;
  i {
    margin-right: 3px;
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
.link-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 600px;
  border: 1px solid #cccccc;
  > div {
    height: 600px;
    h2 {
      padding: 10px 0;
      margin: 0;
      font-size: 15px;
      font-weight: normal;
      color: #ffffff;
      text-align: center;
      background: #0ec69a;
    }
    p {
      height: 35px;
      padding: 0;
      margin: 0;
      line-height: 35px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #cccccc;
      i {
        float: right;
        margin-top: 10px;
        margin-right: 10px;
        font-size: 18px;
        color: #0ec69a;
      }
    }
  }
  .link-left {
    width: 200px;
    border-right: 1px solid #cccccc;
  }
  .link-center {
    width: 200px;
    border-right: 1px solid #cccccc;
  }
  .link-right {
    flex: auto;
  }
}
</style>
