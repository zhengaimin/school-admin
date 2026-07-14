<template>
  <div class="process-content">
    <div class="left" ref="refLeft">
      <h1>
        <div>
          <img src="@/assets/images/common/bumen.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />{{
            moduleName
          }}
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
          <span>{{ treeNode.name }}用能单元列表</span>
          <div>
            <el-button :disabled="!isEdit" type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
          </div>
        </div>
        <div class="table-list">
          <el-table style="height: calc(100% - 50px)" class="my-custom-table" :data="equipmentList">
            <el-table-column label="用能单元名称" prop="name"> </el-table-column>
            <el-table-column label="用能单元编号" prop="equipment_id"> </el-table-column>
            <el-table-column label="操作" align="center" width="150" fixed="right">
              <template #default="scope">
                <div class="table-btn">
                  <div v-if="isEdit" @click="editRow(scope.row, 2)">
                    <img
                      src="@/assets/images/common/link-circle-2.svg"
                      alt=""
                      style="width: 16px; height: 16px; margin-right: 3px"
                    />
                  </div>
                  <div v-if="isEdit" @click="editRow(scope.row)">
                    <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                  </div>
                  <div v-if="isEdit" @click="deleteProcess(scope.row)">
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
    <!-- 新增弹框 -->
    <el-dialog v-model="dialogVisibleAdd" :close-on-click-modal="false" :title="ruleForm.id ? '编辑' : '新增'" :width="1000">
      <div style="min-height: 100px; padding: 10px 20px 0; text-align: center">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-position="top">
          <h1><span></span>{{ moduleName }}信息</h1>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="moduleName + '名称'" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="用能单元编号" prop="equipment_id">
                <el-input v-model="ruleForm.equipment_id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-for="(item, k) in ruleForm.instruments_info" :key="k">
            <el-row>
              <el-col :span="13">
                <el-form-item label="能源品种" prop="boundary_id_varieties_id">
                  <el-select v-model="item.boundary_id_varieties_id" @focus="process_boundary_list(1)">
                    <el-option
                      v-for="v in sourceList"
                      :key="v.id"
                      :disabled="v.disabled"
                      :label="v.industry_varieties.variety.name"
                      :value="v.id + '_' + v.industry_varieties.variety_id"
                    >
                      <span style="float: left">
                        {{ v.industry_varieties.variety.name }}
                        <span
                          v-if="
                            v.industry_varieties.factor_source.first_category ||
                            v.industry_varieties.factor_source.second_category
                          "
                        >
                          ({{ v.industry_varieties.factor_source.first_category }}
                          {{ v.industry_varieties.factor_source.second_category }})
                        </span>
                      </span>
                      <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                        《{{ v.industry_varieties.factor_source.name }}》
                        {{ v.boundary_type == 1 ? "直接排放" : "间接排放" }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-form-item label="输入/输出" prop="io">
                  <el-select v-model="item.io" placeholder="请选择">
                    <el-option label="输入" :value="Number(1)" />
                    <el-option :disabled="true" label="输出" :value="Number(2)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 10px">
                <el-form-item label="填报类型" prop="instrument_type">
                  <el-select v-model="item.instrument_type" placeholder="请选择">
                    <el-option label="自动填报" :value="Number(1)" />
                    <el-option label="手动填报" :value="Number(2)" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="margin-left: 10px">
                <el-form-item label="&nbsp;">
                  <span class="icon-box" v-if="ruleForm.instruments_info.length > 1" @click="deleteSource(k)">
                    <el-icon><Remove /></el-icon>删除
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="关联计量器具" prop="instrument_id" v-if="item.instrument_type == 1">
                  <el-select v-model="item.instrument_id" placeholder="请选择" @focus="instruments_list(item.varieties_id, k)">
                    <el-option v-for="v in item.instrumentList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row v-if="ruleForm.instruments_info.length > 0">
            <el-col style="text-align: left">
              <span class="icon-box" @click="addSource">
                <el-icon><CirclePlus /></el-icon> 新增
              </span>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="24">
          <el-col :span="24">
            <div style="margin: 10px 0; text-align: right">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="addConfirm">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 计量器具 -->
    <el-dialog v-model="instrumentDialog" :close-on-click-modal="false" title="关联计量器具列表" :width="1000">
      <div style="min-height: 100px; padding: 10px 20px 0; text-align: center">
        <div style="margin-bottom: 10px; text-align: right">
          <el-button type="primary" @click="addLinkApply">新增关联计量器具</el-button>
        </div>
        <el-table border class="my-custom-table" :data="dataList">
          <el-table-column label="计量器具" align="center">
            <template #default="{ row }">
              {{ row.type == 2 ? "无" : row.name }}
            </template>
          </el-table-column>
          <el-table-column label="能源" align="center">
            <template #default="{ row }">
              {{ row.varieties_name }}
            </template>
          </el-table-column>
          <el-table-column label="输入/输出" align="center">
            <template #default="{ row }">
              {{ { 1: "输入", 2: "输出" }[row.io] }}
            </template>
          </el-table-column>
          <el-table-column label="手动填报/自动填报" align="center">
            <template #default="{ row }">
              {{ { 1: "自动填报", 2: "手动填报" }[row.type] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <div style="color: #409eff; cursor: pointer" @click="cancelBind(row)">解除绑定</div>
            </template>
          </el-table-column>
        </el-table>
        <el-row :gutter="24">
          <el-col :span="24">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="instrumentDialog = false">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 绑定计量器具 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="新增关联计量器具" :width="1000">
      <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="计量类型" prop="boundary_id_varieties_id">
              <el-select v-model="linkRuleForm.boundary_id_varieties_id" @focus="process_boundary_list(2)">
                <el-option
                  v-for="v in sourceList"
                  :key="v.id"
                  :disabled="v.disabled"
                  :label="v.industry_varieties.variety.name"
                  :value="v.id + '_' + v.industry_varieties.variety_id"
                >
                  <span style="float: left">
                    {{ v.industry_varieties.variety.name }}
                    <span
                      v-if="
                        v.industry_varieties.factor_source.first_category || v.industry_varieties.factor_source.second_category
                      "
                    >
                      ({{ v.industry_varieties.factor_source.first_category }}
                      {{ v.industry_varieties.factor_source.second_category }})
                    </span>
                  </span>
                  <span style="float: right; font-size: 13px; color: var(--el-text-color-secondary)">
                    《{{ v.industry_varieties.factor_source.name }}》
                    {{ v.boundary_type == 1 ? "直接排放" : "间接排放" }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px">
            <el-form-item label="输入/输出" prop="io">
              <el-select v-model="linkRuleForm.io" placeholder="请选择">
                <el-option label="输入" :value="Number(1)" />
                <el-option :disabled="true" label="输出" :value="Number(2)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px">
            <el-form-item label="填报类型" prop="instrument_type">
              <el-select v-model="linkRuleForm.instrument_type" placeholder="请选择">
                <el-option label="自动填报" :value="Number(1)" />
                <el-option label="手动填报" :value="Number(2)" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" style="margin-left: 10px" v-if="linkRuleForm.instrument_type == 1">
            <el-form-item label="关联计量器具" prop="id">
              <el-select v-model="linkRuleForm.id" placeholder="请选择" @focus="instruments_list(linkRuleForm.varieties_id, -1)">
                <el-option
                  v-for="v in instrumentList"
                  :label="v.name"
                  :value="Number(v.id)"
                  :key="v.id"
                  :disabled="v.energy_equipment_id > 0"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="margin-top: 20px; text-align: right">
            <el-button @click="LinkDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmBind">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { drag } from "./drag.js";
import {
  production_process_diagram,
  equipment_add,
  equipment_list,
  equipment_delete,
  equipment_info,
  equipment_update,
  instruments_add,
  instruments_update,
  process_boundary_list,
  instruments_list
} from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox } from "element-plus";
export default {
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
      equipmentList: [],
      total: 0,
      page: 1,
      page_size: 10,

      treeNode: "",
      localFile: "",

      instrumentObj: {},
      // 新增
      dialogVisibleAdd: false,
      sourceList: [],
      ruleForm: {
        process_id: "",
        name: "",
        equipment_id: "",
        type: 1,
        instruments_info: [
          {
            varieties_id: "",
            boundary_id_varieties_id: "",
            io: "",
            instrumentList: [],
            instrument_type: "",
            instrument_id: ""
          }
        ]
      },
      rules: {
        name: [{ required: true, message: "必填项" }],
        equipment_id: [{ required: true, message: "必填项" }]
      },

      // 关联计量器具列表
      instrumentDialog: false,
      dataList: [],
      LinkDialog: false,
      instrumentList: [],
      linkRuleForm: {
        energy_equipment_id: "", //用能单元Id
        boundary_id_varieties_id: "",
        io: "",
        instrument_type: "",
        id: "" //计量器具
      },
      linkRules: {
        boundary_id_varieties_id: [{ required: true, message: "必填项" }],
        io: [{ required: true, message: "必填项" }],
        instrument_type: [{ required: true, message: "必填项" }],
        id: [{ required: true, message: "必填项" }]
      }
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    moduleName() {
      return "用能单元";
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
  },
  methods: {
    initPage() {
      this.getCompany();
    },
    getCompany() {
      production_process_diagram(`com_id=${this.userInfo.com_id}`).then(res1 => {
        if (res1.code == 0 && res1.data) {
          this.dataSource = res1.data.nodes;
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
      this.ruleForm.level = node.level;
      this.treeNode = data;
      this.ruleForm.process_id = data.id;
      this.getList();
    },

    //查询用能单元
    getList() {
      //process_id 全部 -1  公司 0  工序 id
      let str = `page=${this.page}&page_size=${this.page_size}&type=1&process_id=${this.ruleForm.process_id}`;
      equipment_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.equipmentList = res.data.list;
          this.total = res.data.total;
        } else {
          this.equipmentList = [];
          this.total = 0;
        }
      });
    },
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    //新增用能单元
    addMethod() {
      if (!this.treeNode.id) {
        this.$message.warning("请先选择工序");
        return;
      }
      this.dialogVisibleAdd = true;
      if (this.$refs.ruleFormRef) {
        this.$refs.ruleFormRef.resetFields();
        this.ruleForm.instruments_info = [
          {
            instrument_id: "",
            io: "",
            instrument_type: "",
            varieties_id: ""
          }
        ];
      }
      delete this.ruleForm.id;
    },
    editRow(row, type) {
      equipment_info({ id: row.id }).then(res => {
        if (res.code == 0 && res.data) {
          if (type == 2) {
            this.instrumentDialog = true;
            this.dataList = res.data.instrument_info;
            for (let key in res.data.equipment_info) {
              this.ruleForm[key] = res.data.equipment_info[key];
            }
            return;
          }
          this.dialogVisibleAdd = true;
          this.$nextTick(() => {
            for (let key in res.data.equipment_info) {
              this.ruleForm[key] = res.data.equipment_info[key];
            }
            this.ruleForm.instruments_info = [];
          });
        }
      });
    },
    process_boundary_list(val) {
      process_boundary_list(`production_process_id=${this.ruleForm.process_id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.sourceList = res.data.list;
          let ary = [];
          if (val == 1) {
            this.ruleForm.instruments_info.map(v => {
              ary.push(v.boundary_id_varieties_id);
            });
            this.sourceList.map(v => {
              if (ary.indexOf(v.id + "_" + v.industry_varieties.variety_id) != -1) {
                v.disabled = true;
              }
            });
          } else if (val == 2) {
            this.dataList.map(v => {
              ary.push(v.boundary_id);
            });
            this.sourceList.map(v => {
              if (ary.indexOf(v.id) != -1) {
                v.disabled = true;
              }
            });
          }
        } else {
          this.sourceList = [];
        }
      });
    },
    addSource() {
      this.ruleForm.instruments_info.push({
        instrument_id: "",
        io: "",
        instrument_type: "",
        varieties_id: ""
      });
    },
    deleteSource(index) {
      this.ruleForm.instruments_info.splice(index, 1);
    },
    addConfirm() {
      this.ruleForm.instruments_info.map(v => {
        if (v.instrument_type == 2) {
          v.instrument_id = 0;
        }
        v.boundary_id = Number(v.boundary_id_varieties_id.split("_")[0]);
        v.varieties_id = Number(v.boundary_id_varieties_id.split("_")[1]);
      });
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          if (this.ruleForm.id) {
            equipment_update(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.dialogVisibleAdd = false;
                this.$message.success("修改成功");
                this.getList();
              }
            });
            return;
          }
          equipment_add(this.ruleForm).then(res => {
            if (res.code == 0) {
              this.dialogVisibleAdd = false;
              this.$message.success("添加成功");
              this.getList();
            }
          });
        }
      });
    },
    instruments_list(varieties_id, k) {
      let ary = this.sourceList.filter(v => v.industry_varieties.variety_id == varieties_id);
      if (ary.length == 0) {
        this.$message.warning("暂无关联计量器具");
        return;
      }
      let str = `type=1&emission_process_type=${ary[0].industry_varieties.variety.emission_process_type}`;
      instruments_list(str).then(res => {
        if (res.code == 0) {
          if (k == -1) {
            this.instrumentList = res.data.list;
            return;
          }
          this.ruleForm.instruments_info[k].instrumentList = res.data.list;
        } else {
          if (k == -1) {
            this.instrumentList = [];
            return;
          }
          this.ruleForm.instruments_info[k].instrumentList = [];
        }
      });
    },
    cancel() {
      this.dialogVisibleAdd = false;
    },
    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          equipment_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    // 新增关联计量器具
    addLinkApply() {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    //绑定
    confirmBind() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.instrument_type == 1) {
            let paramsUpdate = {
              energy_equipment_id: this.ruleForm.id,
              boundary_id: Number(this.linkRuleForm.boundary_id_varieties_id.split("_")[0]),
              varieties_id: Number(this.linkRuleForm.boundary_id_varieties_id.split("_")[1]),
              io: this.linkRuleForm.io,
              type: this.linkRuleForm.instrument_type,
              id: this.linkRuleForm.id
            };
            instruments_update(paramsUpdate).then(res => {
              if (res && res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("绑定成功");
                this.editRow({ id: this.ruleForm.id }, 2);
              }
            });
            return;
          }
          let params = {
            energy_equipment_id: this.ruleForm.id,
            boundary_id: Number(this.linkRuleForm.boundary_id_varieties_id.split("_")[0]),
            varieties_id: Number(this.linkRuleForm.boundary_id_varieties_id.split("_")[1]),
            io: this.linkRuleForm.io,
            type: this.linkRuleForm.instrument_type
          };
          instruments_add(params).then(res => {
            if (res && res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("绑定成功");
              this.editRow({ id: this.ruleForm.id }, 2);
            }
          });
        }
      });
    },
    //解绑
    cancelBind(row) {
      let params = {
        id: row.id,
        energy_equipment_id: -1
      };
      instruments_update(params).then(res => {
        if (res && res.code == 0) {
          this.$message.success("解除绑定成功");
          this.editRow({ id: this.ruleForm.id }, 2);
        }
      });
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
      > span {
        font-size: 16px;
      }
    }
    .table-list {
      height: calc(100% - 56px);
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
</style>
