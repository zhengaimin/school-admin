<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>型号</label>
          <el-select @focus="manufacturerList" v-model="filterForm.meter_model_id" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in List" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[item.meter_type] }}
              </span>
            </el-option>
          </el-select>
          <label>模板名称</label>
          <el-input style="width: 250px" v-model="filterForm.name"></el-input>
          <label>协议类型</label>
          <el-select style="width: 250px" v-model="filterForm.protocol_type">
            <el-option v-for="v in protocol_type_list" :key="v.id" :label="v.label" :value="v.id"></el-option>
          </el-select>
          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span>采集协议模板列表</span>
            <div>
              <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
              <el-table-column label="模板名称" prop="name" align="left"> </el-table-column>
              <el-table-column label="计量器具型号" align="left" width="150">
                <template #default="{ row }"> {{ row.meter_model.name }} </template>
              </el-table-column>
              <el-table-column label="协议类型" align="left">
                <template #default="{ row }">
                  {{ protocol_type_Obj[row.protocol_type] }}
                </template>
              </el-table-column>
              <el-table-column label="协议配置" align="left">
                <template #default="{ row }">
                  <div>波特率：{{ JSON.parse(row.protocol_config).baud_rate }}</div>
                  <div>校验方式：{{ ["无校验", "奇校验", "偶校验"][JSON.parse(row.protocol_config).parity] }}</div>
                  <div>停止位：{{ JSON.parse(row.protocol_config).stop_bits }}</div>
                  <div>数据位：{{ JSON.parse(row.protocol_config).data_bits }}</div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="created_at" align="left"> </el-table-column>
              <el-table-column label="更新时间" prop="updated_at" align="left"> </el-table-column>
              <el-table-column label="操作" align="center" width="130" fixed="right">
                <template #default="scope">
                  <div class="table-btn">
                    <div @click="editRow(scope.row)">
                      <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                    </div>
                    <div @click="deleteProcess(scope.row)">
                      <img
                        src="@/assets/images/common/delete-circle-2.svg"
                        alt=""
                        style="width: 16px; height: 16px; margin-right: 3px"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="page_size"
              :page-sizes="[10, 20, 50, 100, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="900">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="15">
              <el-form-item label="协议模板名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="计量器具型号" prop="meter_model_id">
                <el-select v-model="linkRuleForm.meter_model_id" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in List" :key="item.id" :label="item.name" :value="item.id">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                      {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[item.meter_type] }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="协议类型" prop="protocol_type">
                <el-select v-model="linkRuleForm.protocol_type" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in protocol_type_list" :key="item.id" :label="item.label" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="subForm">
            <el-row>
              <el-col :span="11">
                <el-form-item label="波特率" prop="baud_rate">
                  <el-select v-model="linkRuleForm.baud_rate" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in baud_rateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="校验方式" prop="parity">
                  <el-select v-model="linkRuleForm.parity" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in parityList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="停止位" prop="stop_bits">
                  <el-select v-model="linkRuleForm.stop_bits" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in stop_bitsList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="数据位" prop="data_bits">
                  <el-select v-model="linkRuleForm.data_bits" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in data_bitsList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="23">
            <el-col :span="23">
              <div style="margin-top: 10px; text-align: right">
                <el-button @click="LinkDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmAdd">确定</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import {
  protocol_templateAdd,
  protocol_templateList,
  protocol_templateUpdate,
  protocol_templateDelete,
  meter_modelList
} from "@/api/modules/IotManagement.js";
export default {
  data() {
    return {
      filterForm: {
        meter_model_id: "",
        name: "",
        protocol_type: ""
      },
      protocol_type_list: [
        { label: "ModbusRTU", id: 1 },
        { label: "ModbusTCP", id: 2 },
        { label: "ModbusASCII", id: 3 },
        { label: "IEC103", id: 4 },
        { label: "DL/T645", id: 5 }
      ],
      protocol_type_Obj: {
        1: "ModbusRTU",
        2: "ModbusTCP",
        3: "ModbusASCII",
        4: "IEC103",
        5: "DL/T645"
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      List: [],
      baud_rateList: [
        { id: 1200, name: "1200" },
        { id: 2400, name: "2400" },
        { id: 4800, name: "4800" },
        { id: 9600, name: "9600" },
        { id: 19200, name: "19200" },
        { id: 38400, name: "38400" },
        { id: 57600, name: "57600" },
        { id: 115200, name: "115200" }
      ],
      parityList: [
        { id: 0, name: "无校验" },
        { id: 1, name: "奇校验" },
        { id: 2, name: "偶检验" }
      ],
      stop_bitsList: [
        { id: 1, name: "停止位1" },
        { id: 2, name: "停止位2" }
      ],
      data_bitsList: [
        { id: 5, name: "5" },
        { id: 6, name: "6" },
        { id: 7, name: "7" },
        { id: 8, name: "8" }
      ],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        meter_model_id: "",
        protocol_type: "",
        baud_rate: "",
        parity: "",
        stop_bits: "",
        data_bits: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        meter_model_id: [{ required: true, message: "必填项" }],
        protocol_type: [{ required: true, message: "必填项" }],
        baud_rate: [{ required: true, message: "必填项" }],
        parity: [{ required: true, message: "必填项" }],
        stop_bits: [{ required: true, message: "必填项" }],
        data_bits: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.protocol_templateList();
  },
  methods: {
    search() {
      this.protocol_templateList();
    },
    reset() {
      this.filterForm.meter_model_id = "";
      this.filterForm.name = "";
      this.filterForm.protocol_type = "";
      this.protocol_templateList();
    },
    // 获取列表
    protocol_templateList() {
      let str = `page=${this.page}&page_size=${this.page_size}&meter_model_id=${this.filterForm.meter_model_id}&name=${this.filterForm.name}&protocol_type=${this.filterForm.protocol_type}`;
      protocol_templateList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.protocol_templateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.protocol_templateList();
    },
    // 新增/编辑
    editRow(row) {
      let obj = JSON.parse(row.protocol_config);
      this.manufacturerList();
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row, ...obj };
      });
    },
    addMethod() {
      this.manufacturerList();
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    // 获取型号列表
    manufacturerList() {
      let str = `page=1&page_size=100&name=`;
      meter_modelList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.List = res.data.list;
        } else {
          this.List = [];
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.protocol_config = JSON.stringify({
            baud_rate: this.linkRuleForm.baud_rate,
            parity: this.linkRuleForm.parity,
            stop_bits: this.linkRuleForm.stop_bits,
            data_bits: this.linkRuleForm.data_bits
          });
          if (this.linkRuleForm.id) {
            protocol_templateUpdate(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.protocol_templateList();
              }
            });
            return;
          }
          protocol_templateAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.protocol_templateList();
            }
          });
        }
      });
    },
    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          protocol_templateDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.protocol_templateList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    downFile(manual_url) {
      window.open(manual_url);
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
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    border-radius: 10px;
    .fossil-fuel {
      position: relative;
      height: 100%;
      .filter-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0;
        margin-bottom: 10px;
        background: #ffffff;
        border-radius: 10px;
        > label {
          margin: 0 10px 0 20px;
          font-size: 14px;
          color: #4a5975;
        }
      }
      .table-box {
        height: calc(100% - 83px);
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
        .table-list {
          height: calc(100% - 60px);
          overflow: auto;
          .download {
            color: #3399ff;
            cursor: pointer;
          }
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
      }
      .demo-pagination-block {
        position: absolute;
        right: 12px;
        bottom: 10px;
      }
    }
  }
}
.subForm {
  width: 90%;
  padding: 15px 20px 5px;
  margin-bottom: 20px;
  background: rgb(249 250 251);
  border: 1px solid rgb(222 226 235);
  border-radius: 6px;
}
.form-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 10px;
  padding: 20px;
  margin-right: 4%;
  background: #f9fafb;
  border-radius: 10px;
}
.upload-box {
  width: 707px;
  padding: 20px 0;
  text-align: center;
  background: #f9fafb;
  border: 1px solid #dee2eb;
  border-radius: 10px;
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 690px;
  height: 35px;
  padding: 0 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  border-radius: 5px;
  > div {
    display: flex;
    align-items: center;
  }
}
</style>
