<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div class="fossil-fuel">
        <div class="filter-box">
          <label>数据项名称</label>
          <el-input style="width: 250px" v-model="filterForm.item_name"></el-input>
          <label>型号</label>
          <el-select @focus="manufacturerList" v-model="filterForm.meter_model_id" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in List" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[item.meter_type] }}
              </span>
            </el-option>
          </el-select>
          <label>是否是4G</label>
          <el-select v-model="filterForm.is_4g" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in Is4GList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
          </el-select>
          <el-button style="margin-left: 20px" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <span>寄存器列表</span>
            <div>
              <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
              <el-table-column label="计量器具型号" align="left" width="150">
                <template #default="{ row }"> {{ row.meter_model.name }}({{ row.meter_model.manufacturer.name }}) </template>
              </el-table-column>
              <el-table-column label="数据项名称" align="left">
                <template #default="{ row }">
                  {{ row.item_name }}
                </template>
              </el-table-column>
              <el-table-column label="寄存器地址变量名称" align="left">
                <template #default="{ row }">
                  {{ row.register_name }}
                </template>
              </el-table-column>
              <el-table-column label="起始地址" align="left">
                <template #default="{ row }">
                  {{ row.start_address }}
                </template>
              </el-table-column>
              <el-table-column label="起始地址(10进制)" prop="start_address_dec" align="left"> </el-table-column>
              <el-table-column label="长度(字节)" prop="length" align="left"> </el-table-column>
              <el-table-column label="读写类型" align="left">
                <template #default="{ row }">
                  {{ { 1: "读", 2: "读写" }[row.rw_type] }}
                </template>
              </el-table-column>
              <el-table-column label="单位" prop="item_unit" align="left"> </el-table-column>
              <el-table-column label="4G_ID" prop="id_4g" align="left"> </el-table-column>
              <el-table-column label="计算公式" prop="formula" align="left"> </el-table-column>
              <el-table-column label="备注" prop="remark" align="left"> </el-table-column>
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
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="15">
              <el-form-item label="数据项名称" prop="item_name">
                <el-input v-model="linkRuleForm.item_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="寄存器地址变量名称" prop="register_name">
                <el-input placeholder="只允许字母、数字、下划线的组合" v-model="linkRuleForm.register_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="计量器具型号" prop="meter_model_id">
                <el-select v-model="linkRuleForm.meter_model_id" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in List" :key="item.id" :label="item.name" :value="Number(item.id)">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                      {{ { 1: "电", 2: "水", 3: "天然气", 4: "热量" }[item.meter_type] }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="起始地址" prop="start_address">
                <el-input v-model="linkRuleForm.start_address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="起始地址(10进制)" prop="start_address_dec">
                <el-input type="number" v-model.number="linkRuleForm.start_address_dec"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="长度" prop="length">
                <el-input type="number" v-model.number="linkRuleForm.length"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="读写类型" prop="rw_type">
                <el-select v-model="linkRuleForm.rw_type" placeholder="请选择" style="width: 100%">
                  <el-option label="只读" :value="Number(1)"> </el-option>
                  <el-option label="读写" :value="Number(2)"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="4G_ID" prop="id_4g">
                <el-input type="number" v-model.number="linkRuleForm.id_4g"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="单位" prop="item_unit">
                <el-input v-model.number="linkRuleForm.item_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="计算公式" prop="formula">
                <el-input type="textarea" v-model="linkRuleForm.formula"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="linkRuleForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="23">
            <el-col :span="23">
              <div style="margin-top: 20px; text-align: right">
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
import { useUserStore } from "@/stores/modules/user";
import { registerAdd, registerList, registerUpdate, registerDelete, meter_modelList } from "@/api/modules/IotManagement.js";
export default {
  data() {
    return {
      filterForm: {
        item_name: "",
        meter_model_id: "",
        is_4g: ""
      },
      typeList: [
        { label: "电", id: 1 },
        { label: "水", id: 2 },
        { label: "天然气", id: 3 },
        { label: "热量", id: 4 }
      ],
      Is4GList: [
        { label: "是", id: true },
        { label: "否", id: false }
      ],
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],

      //新增
      LinkDialog: false,
      List: [],
      linkRuleForm: {
        item_name: "",
        register_name: "",
        meter_model_id: "",
        start_address: "",
        start_address_dec: "",
        length: "",
        rw_type: "",
        id_4g: "",
        item_unit: "",
        formula: "",
        remark: ""
      },
      linkRules: {
        item_name: [{ required: true, message: "必填项" }],
        register_name: [{ required: true, message: "必填项" }],
        meter_model_id: [{ required: true, message: "必填项" }],
        start_address: [{ required: true, message: "必填项" }],
        start_address_dec: [{ required: true, message: "必填项" }],
        length: [{ required: true, message: "必填项" }],
        rw_type: [{ required: true, message: "必填项" }]
      },
      //上传文件
      loadFlag: false,
      localFile: ""
    };
  },
  computed: {
    activeUrl() {
      if (process.env.NODE_ENV == "development") {
        return `/api/common/file/upload`;
      } else {
        return `/common/file/upload`;
      }
    },
    token() {
      return useUserStore().token;
    }
  },
  mounted() {
    this.registerList();
  },
  methods: {
    search() {
      this.registerList();
    },
    reset() {
      this.filterForm.item_name = "";
      this.filterForm.meter_model_id = "";
      this.filterForm.is_4g = "";
      this.registerList();
    },
    // 获取列表
    registerList() {
      let str = `page=${this.page}&page_size=${this.page_size}&item_name=${this.filterForm.item_name}&meter_model_id=${this.filterForm.meter_model_id}&is_4g=${this.filterForm.is_4g}`;
      registerList(str).then(res => {
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
      this.registerList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.registerList();
    },
    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.manufacturerList();
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
      });
    },
    addMethod() {
      this.LinkDialog = true;
      this.manufacturerList();
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
          if (this.linkRuleForm.id) {
            registerUpdate(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.registerList();
              }
            });
            return;
          }
          registerAdd(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.registerList();
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
          registerDelete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.registerList();
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
