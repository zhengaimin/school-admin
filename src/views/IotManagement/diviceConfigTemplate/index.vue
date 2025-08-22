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

          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span>寄存器模板列表</span>
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
              <el-table-column label="采集频率(秒)" prop="frequency" align="left"> </el-table-column>
              <el-table-column label="描述" prop="desc" align="left"> </el-table-column>
              <el-table-column label="创建时间" prop="created_at" align="left"> </el-table-column>
              <el-table-column label="更新时间" prop="updated_at" align="left"> </el-table-column>
              <el-table-column label="操作" align="center" width="180" fixed="right">
                <template #default="scope">
                  <div class="table-btn">
                    <div @click="view(scope.row)">寄存器详情</div>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="1000">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="15">
              <el-form-item label="模板名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="计量器具型号" prop="meter_model_id">
                <el-select v-model="linkRuleForm.meter_model_id" @change="selectMeter" placeholder="请选择" style="width: 100%">
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
              <el-form-item label="采集频率(秒)" prop="frequency">
                <el-input placeholder="频率必须大于等于30" type="number" v-model.number="linkRuleForm.frequency"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述" prop="desc">
                <el-input v-model="linkRuleForm.desc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="subForm" v-show="registerdataList.length > 0">
            <el-checkbox-group v-model="checkboxGroup">
              <el-checkbox
                style="margin-bottom: 10px"
                v-for="v in registerdataList"
                :key="v.id"
                :label="v.item_name"
                :value="v.id"
                border
              />
            </el-checkbox-group>
          </div>
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="pageregister"
              v-model:page-size="page_sizeregister"
              :page-sizes="[30, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalRegister"
              @size-change="handleSizeChangeRegister"
              @current-change="handleCurrentChangeRegister"
            />
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
    <!-- 详情 -->
    <el-dialog v-model="detailDialog" :close-on-click-modal="false" title="寄存器详情" :width="1000">
      <div class="detailList" style="padding-left: 20px">
        <div v-for="v in detailList" :key="v.id">
          <span><span class="name">数据项名称：</span> {{ v.item_name }}</span>
          <span style="margin-left: 20px"><span class="name">地址变量名：</span>{{ v.register_name }}</span>
        </div>
      </div>
      <el-row :gutter="23">
        <el-col :span="23">
          <div style="margin-top: 10px; text-align: center">
            <el-button type="primary" @click="detailDialog = false">关 闭</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import {
  register_templateAdd,
  register_templateList,
  register_templateUpdate,
  register_templateDelete,
  register_templateInfo,
  meter_modelList,
  registerList
} from "@/api/modules/IotManagement.js";
export default {
  data() {
    return {
      filterForm: {
        meter_model_id: "",
        name: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      List: [],
      registerdataList: [],
      pageregister: 1,
      page_sizeregister: 50,
      totalRegister: 0,
      checkboxGroup: [],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        meter_model_id: "",
        frequency: 30,
        desc: "",
        register_ids: []
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        meter_model_id: [{ required: true, message: "必填项" }],
        frequency: [{ required: true, message: "必填项" }]
      },
      // 详情
      detailDialog: false,
      detailList: []
    };
  },
  mounted() {
    this.register_templateList();
  },
  methods: {
    search() {
      this.register_templateList();
    },
    reset() {
      this.filterForm.meter_model_id = "";
      this.filterForm.name = "";
      this.filterForm.protocol_type = "";
      this.register_templateList();
    },
    // 获取列表
    register_templateList() {
      let str = `page=${this.page}&page_size=${this.page_size}&meter_model_id=${this.filterForm.meter_model_id}&name=${this.filterForm.name}&protocol_type=${this.filterForm.protocol_type}`;
      register_templateList(str).then(res => {
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
      this.register_templateList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.register_templateList();
    },
    // 新增/编辑
    editRow(row) {
      this.manufacturerList();
      this.LinkDialog = true;
      this.checkboxGroup = [];
      this.pageregister = 1;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.registerList();
        register_templateInfo({ id: row.id }).then(res => {
          if (res.code == 0 && res.data && res.data.registers && res.data.registers.length > 0) {
            res.data.registers.map(v => {
              this.checkboxGroup.push(v.id);
            });
          } else {
            this.checkboxGroup = [];
          }
        });
      });
    },
    addMethod() {
      this.manufacturerList();
      this.LinkDialog = true;
      this.checkboxGroup = [];
      this.registerdataList = [];
      this.pageregister = 1;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    selectMeter() {
      this.registerList();
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
    // 获取寄存器列表
    registerList() {
      let str = `page=${this.pageregister}&page_size=${this.page_sizeregister}&meter_model_id=${this.linkRuleForm.meter_model_id}`;
      registerList(str).then(res => {
        if (res.code == 0 && res.data && res.data.list.length > 0) {
          this.registerdataList = res.data.list;
          this.totalRegister = res.data.total;
        } else {
          this.registerdataList = [];
          this.totalRegister = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChangeRegister(val) {
      this.pageregister = 1;
      this.page_sizeregister = val;
      this.registerList();
    },
    handleCurrentChangeRegister(val) {
      this.pageregister = val;
      this.registerList();
    },
    confirmAdd() {
      console.log(this.checkboxGroup);
      if (this.checkboxGroup.length == 0) {
        this.$message.warning("请选择寄存器");
        return;
      }
      this.linkRuleForm.register_ids = this.checkboxGroup;
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            register_templateUpdate(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.register_templateList();
              }
            });
            return;
          }
          register_templateAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.register_templateList();
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
          register_templateDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.register_templateList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    view(row) {
      this.detailDialog = true;
      register_templateInfo({ id: row.id }).then(res => {
        if (res.code == 0 && res.data && res.data.registers && res.data.registers.length > 0) {
          this.detailList = res.data.registers;
        } else {
          this.detailList = [];
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
  width: 91.5%;
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
.detailList {
  display: grid;
  grid-template-columns: 1fr 1fr;
  > div {
    margin-bottom: 10px;
    .name {
      color: #999999;
    }
  }
}
</style>
