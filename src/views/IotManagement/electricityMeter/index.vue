<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>合作方</label>
          <el-select style="width: 250px" v-model="filterForm.tenant_id" @change="selectTenant" placeholder="请选择">
            <el-option v-for="v in tenant_list" :key="v.id" :label="v.name" :value="v.id" />
          </el-select>
          <label>公司</label>
          <el-select style="width: 250px" v-model="filterForm.com_id" @focus="getcomList(1)" placeholder="请选择">
            <el-option v-for="v in com_list" :key="v.id" :label="v.name" :value="v.id" />
          </el-select>
          <label>型号</label>
          <el-select @focus="manufacturerList" v-model="filterForm.meter_model_id" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in List" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[item.meter_type] }}
              </span>
            </el-option>
          </el-select>
          <label>仪表名称</label>
          <el-input style="width: 250px" v-model="filterForm.name"></el-input>
        </div>
        <div class="filter-box">
          <label>通信类型</label>
          <el-select v-model="filterForm.type" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in type_list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span>计量器具列表</span>
            <div>
              <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
              <el-table-column label="名称" prop="name" align="left"> </el-table-column>
              <el-table-column label="通信类型" prop="type_name" align="left"> </el-table-column>
              <el-table-column label="安装地址" prop="address" align="left"> </el-table-column>
              <el-table-column label="通信地址" prop="con_address" align="left"> </el-table-column>
              <el-table-column label="计量器具编号" prop="instrument_number" align="left"> </el-table-column>
              <el-table-column label="计量器具型号" align="left" width="150">
                <template #default="{ row }"> {{ row.meter_model ? row.meter_model.name : "" }} </template>
              </el-table-column>
              <el-table-column label="状态" align="left" width="100">
                <template #default="{ row }"> {{ statusObj[row.status] }} </template>
              </el-table-column>
              <el-table-column label="已绑定公司" align="left" width="150">
                <template #default="{ row }"> {{ row.company ? row.company.name : "" }} </template>
              </el-table-column>
              <el-table-column label="类型" align="left" width="90">
                <template #default="{ row }"> {{ { 1: "真实表", 4: "虚拟表" }[row.type] }} </template>
              </el-table-column>
              <el-table-column label="采集协议模板名称" align="left" width="150">
                <template #default="{ row }"> {{ row.protocol_template ? row.protocol_template.name : "" }} </template>
              </el-table-column>
              <el-table-column label="寄存器模板名称" align="left" width="150">
                <template #default="{ row }"> {{ row.register_template ? row.register_template.name : "" }} </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="created_at" align="left"> </el-table-column>
              <el-table-column label="更新时间" prop="updated_at" align="left"> </el-table-column>
              <el-table-column label="操作" align="center" width="140" fixed="right">
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
                    <div @click="instrumentOffline(scope.row)">下线</div>
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
              <el-form-item label="仪表名称" prop="name">
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
              <el-form-item label="通信方式" prop="type">
                <el-select v-model="linkRuleForm.type" placeholder="请选择">
                  <el-option v-for="v in type_list" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!linkRuleForm.id">
            <el-col :span="11">
              <el-form-item label="合作方" prop="tenant_id">
                <el-select v-model="linkRuleForm.tenant_id" @change="selectTenant" placeholder="请选择">
                  <el-option v-for="v in tenant_list" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="合作方公司" prop="com_id">
                <el-select v-model="linkRuleForm.com_id" @focus="getcomList(2)" placeholder="请选择">
                  <el-option v-for="v in com_list" :key="v.id" :label="v.name" :value="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="计量器具编号">
                <el-input v-model="linkRuleForm.instrument_number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
  instrumentAdd,
  instrumentList,
  instrumentConfig,
  instrumentDelete,
  instrumentOffline,
  meter_modelList
  // instrumentInfo
} from "@/api/modules/IotManagement.js";
import { tenantList, comList } from "@/api/modules/InternalPage.js";
export default {
  data() {
    return {
      filterForm: {
        tenant_id: "",
        com_id: "",
        meter_model_id: "",
        name: "",
        type: ""
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
      statusObj: {
        1: "待配置",
        2: "已配置",
        3: "上线",
        4: "下线维护",
        5: "故障"
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      List: [],
      tenant_list: [],
      com_list: [],
      type_list: [
        { name: "碳科网关", id: 1 },
        { name: "虚拟网关", id: 2 },
        { name: "安科瑞网关", id: 3 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        meter_model_id: "",
        type: "",
        tenant_id: "",
        instrument_number: "",
        com_id: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        type: [{ required: true, message: "必填项" }],
        meter_model_id: [{ required: true, message: "必填项" }],
        tenant_id: [{ required: true, message: "必填项" }],
        com_id: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.instrumentList();
    this.fetchAllTenantList();
  },
  methods: {
    search() {
      this.instrumentList();
    },
    reset() {
      this.filterForm.tenant_id = "";
      this.filterForm.com_id = "";
      this.filterForm.meter_model_id = "";
      this.filterForm.name = "";
      this.filterForm.type = "";
      this.instrumentList();
    },
    // 获取列表
    instrumentList() {
      let str = `page=${this.page}&page_size=${this.page_size}&meter_model_id=${this.filterForm.meter_model_id}&name=${this.filterForm.name}&query_type=1&&type=${this.filterForm.type}&com_id=${this.filterForm.com_id}`;
      instrumentList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          let obj = {
            1: "碳科网关",
            2: "虚拟网关",
            3: "安科瑞网关"
          };
          res.data.list.map(v => {
            v.type_name = obj[v.type];
          });
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
      this.instrumentList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.instrumentList();
    },
    // 新增/编辑
    addMethod() {
      this.manufacturerList();
      this.fetchAllTenantList();
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    editRow(row) {
      this.manufacturerList();
      this.fetchAllTenantList();
      this.LinkDialog = true;
      // instrumentInfo({ id: row.id }).then(res => {
      //   console.log(res);
      // });
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
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
    //获取合作方
    fetchAllTenantList() {
      let params = `page=1&page_size=100`;
      tenantList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.tenant_list = res.data.list;
        } else {
          this.tenant_list = [];
        }
      });
    },
    // 合作公司
    getcomList(val) {
      if (!this.linkRuleForm.tenant_id && val == 2) {
        this.$message.warning("请先选择合作方");
        this.com_list = [];
        return;
      }
      if (!this.filterForm.tenant_id && val == 1) {
        this.$message.warning("请先选择合作方");
        this.com_list = [];
        return;
      }
      let str;
      if (val == 1) {
        this.com_list = [];
        str = `page=1&page_size=100&tenant_id=${this.filterForm.tenant_id}`;
      } else {
        str = `page=1&page_size=100&tenant_id=${this.linkRuleForm.tenant_id}`;
      }
      comList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.com_list = res.data.list;
          return;
        }
        this.com_list = [];
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
            instrumentConfig(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.instrumentList();
              }
            });
            return;
          }
          instrumentAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.instrumentList();
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
          instrumentDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.instrumentList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //删除
    instrumentOffline(row) {
      ElMessageBox.confirm("确定下线吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          instrumentOffline({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("下线成功");
              this.instrumentList();
            }
          });
        })
        .catch(() => {
          console.log("取消");
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
        height: calc(100% - 173px);
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
