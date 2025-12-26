<template>
  <div style="height: 100%">
    <div class="add-dialog">
      <el-steps style="width: 80%" :active="active" align-center>
        <el-step title="工序名称" />
        <el-step title="碳排放源" />
        <el-step title="输出产物" />
      </el-steps>
    </div>
    <div style="height: calc(100% - 60px); overflow: auto">
      <!-- 工序信息 -->
      <div style="width: 60%; margin: 50px auto 0" v-if="active == 0">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-position="top">
          <el-form-item label="工序名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="工序描述">
            <el-input type="textarea" :rows="3" v-model="ruleForm.description" />
          </el-form-item>
          <div style="padding: 20px; text-align: center">
            <el-button @click="cancelAdd('close')">取消</el-button>
            <el-button type="primary" @click="addProcesses('save')">保存</el-button>
            <el-button type="primary" @click="addProcesses('next')">下一步</el-button>
          </div>
        </el-form>
      </div>
      <!-- 核算边界 -->
      <div style="width: 70%; margin: 50px auto 0" v-if="active == 1">
        <h1 class="title"><span></span>添加排放源</h1>
        <div class="add-source-box">
          <el-select
            placeholder="排放类型"
            @change="select_emission_process_type"
            v-model="linkRuleForm.emission_process_type"
            style="margin-right: 10px"
          >
            <el-option v-for="k in emission_process_type_list" :label="k.name" :value="Number(k.id)" :key="k.id" />
          </el-select>
          <el-select
            @focus="varieties_list"
            @change="select_variety_id"
            :placeholder="placeholder"
            v-model="linkRuleForm.variety_id"
            style="margin-right: 10px"
          >
            <el-option v-for="k in varietiesList" :label="k.name" :value="Number(k.id)" :key="k.id" />
          </el-select>
          <!-- 非电力 -->
          <el-select
            v-if="linkRuleForm.emission_process_type != 2"
            @focus="industry_varieties_list"
            placeholder="排放指南"
            v-model="linkRuleForm.factor_id"
            style="margin-right: 10px"
          >
            <el-option v-for="j in factor_list" :label="j.factor_source.name" :value="Number(j.id)" :key="j.id" />
          </el-select>
          <!-- 电力 -->
          <el-select
            v-if="linkRuleForm.emission_process_type == 2"
            @focus="industry_varieties_list"
            placeholder="排放指南"
            v-model="linkRuleForm.name"
            style="margin-right: 10px"
          >
            <el-option v-for="j in name_list" :label="j" :value="j" :key="j" />
          </el-select>
          <el-select
            v-if="linkRuleForm.emission_process_type == 2"
            placeholder="一级分类"
            @focus="getFirstList"
            v-model="linkRuleForm.first"
            style="margin-right: 10px"
          >
            <el-option v-for="j in first_list" :label="j" :value="j" :key="j" />
          </el-select>
          <el-select
            v-if="linkRuleForm.emission_process_type == 2"
            placeholder="二级分类"
            @focus="getSecondList"
            v-model="linkRuleForm.second"
            style="margin-right: 10px"
          >
            <el-option v-for="j in second_list" :label="j" :value="j" :key="j" />
          </el-select>
          <el-select placeholder="边界类型" v-model="linkRuleForm.boundary_type" style="margin-right: 10px">
            <el-option v-for="j in boundary_type_list" :label="j.name" :value="Number(j.id)" :key="j.id" />
          </el-select>
          <el-button type="primary" @click="addBoundary()">添加</el-button>
        </div>
        <div class="tip-str" v-if="tipStr">* {{ tipStr }}</div>
        <h1 class="title"><span></span>直接排放</h1>
        <div class="zhijie-box" v-for="v in zhijieList" :key="v.id">
          <span>{{ v.industry_varieties.variety.name }}</span>
          <div>
            <span class="source-type">{{ v.industry_varieties.factor_source.name }}</span>
            <span class="name-type">{{ emission_process_obj[v.industry_varieties.variety.emission_process_type] }}</span>
            <el-icon @click="deleteProcess(v.id)" style="margin-left: 10px; font-size: 18px; color: #0ec69a; cursor: pointer">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
        <h1 class="title"><span></span>间接排放</h1>
        <div class="zhijie-box" v-for="v in jianjieList" :key="v.id">
          <span>{{ v.industry_varieties.variety.name }}</span>
          <div>
            <span class="source-type">{{ v.industry_varieties.factor_source.name }}</span>
            <span class="name-type">{{ emission_process_obj[v.industry_varieties.variety.emission_process_type] }}</span>
            <el-icon @click="deleteProcess(v.id)" style="margin-left: 10px; font-size: 18px; color: #0ec69a; cursor: pointer">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
        <div style="padding: 20px; text-align: center">
          <el-button @click="cancelAdd('close')">关闭</el-button>
          <el-button type="primary" @click="next(-1)">上一步</el-button>
          <el-button type="primary" @click="next(1)">下一步</el-button>
        </div>
      </div>
      <!-- 输出产品/物料 -->
      <div style="width: 60%; margin: 50px auto 0" v-if="active == 2">
        <h1 class="title"><span></span>待选择输出产物</h1>
        <el-checkbox-group v-model="bindProductList" @change="saveProduct">
          <div class="product-box" v-for="v in productList" :key="v.id" v-show="outputList.indexOf(v.id) == -1">
            <el-checkbox :label="v.name" :value="v.id" border />
          </div>
        </el-checkbox-group>
        <h1 class="title"><span></span>输出产物</h1>
        <div class="bind-box">
          <div v-for="v in bindedList" :key="v.id">
            <span>{{ v.name }}</span>
            <div>
              <span class="source-type">单位：{{ v.unit }}</span>
              <span class="name-type">{{ v.product_type == 1 ? "中间产物" : "最终产物" }}</span>
              <el-icon @click="deleteBind(v.id)" style="margin-left: 10px; font-size: 18px; color: #0ec69a; cursor: pointer">
                <CircleCloseFilled />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="footer-box" style="padding: 20px; text-align: center">
          <el-button @click="cancelAdd('close')">关闭</el-button>
          <el-button type="primary" @click="next(-1)">上一步</el-button>
          <el-button type="primary" @click="saveProduct('add')">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  production_process_add,
  production_process_update,
  product_list_page,
  process_boundary_add,
  process_boundary_list,
  process_boundary_delete,
  bind_product,
  del_product
} from "@/api/modules/enterpriseSetup.js";
import { industry_varieties_list } from "@/api/modules/basicLibrary.js";
import { factor_varieties_list } from "@/api/modules/enterpriseSetup.js";
import { ElMessageBox } from "element-plus";
export default {
  name: "AddProcesses",
  props: {
    treeNode: {
      type: Object,
      default: () => ({})
    },
    editFlag: {
      type: String,
      default: ""
    }
  },
  emits: ["cancelAdd"],
  data() {
    return {
      active: 0,
      //添加工序
      ruleForm: {
        name: "",
        description: ""
      },
      rules: {
        name: {
          required: true,
          message: "请输入工序名称"
        }
      },
      //碳排放源
      emission_process_obj: {
        1: "化石燃料燃烧排放",
        2: "净购入的电力排放",
        3: "净购入的热力排放(热水)",
        4: "净购入的热力排放(蒸汽)",
        5: "熟料生产过程产生的碳排放（熟料）",
        6: "熟料生产过程产生的碳排放（非碳酸盐替代原料）",
        7: "光伏发电"
      },
      emission_process_type_list: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      boundary_type_list: [
        { name: "直接排放", id: 1 },
        { name: "间接排放", id: 2 }
      ],
      bindObj: {
        1: "水泥行业",
        2: "电解铝行业",
        3: "发电行业",
        4: "工业其他行业"
      },
      bindList: [
        { name: "水泥行业", id: 1 },
        { name: "电解铝行业", id: 2 },
        { name: "发电行业", id: 3 },
        { name: "工业其他行业", id: 4 }
      ],
      varietiesList: [],
      factor_list: [],
      name_list: [],
      first_list: [],
      second_list: [],
      placeholder: "",
      linkRuleForm: {
        emission_process_type: "",
        factor_id: "",
        name: "",
        first: "",
        second: "",
        boundary_type: ""
      },
      tipStr: "",
      zhijieList: [],
      jianjieList: [],

      checkAll: false,
      checkAll1: false,
      isIndeterminate: true,
      isIndeterminate1: true,
      cities: ["化石燃料燃烧CO2排放", "工业过程CO2排放", "企业回收且外供的CO2量"],
      checkedCities: ["化石燃料燃烧CO2排放"],
      cities1: ["电力和热力隐含的CO2排放"],
      checkedCities1: ["电力和热力隐含的CO2排放"],
      radio2: "1",
      checkList: [],
      tableData: [
        { type: "电力", value: false },
        { type: "热力", name: "饱和蒸汽", value: false },
        { type: "热力", name: "过热蒸汽", value: false }
      ],
      tableData1: [{}],
      checklist: [],
      cities3: ["碳酸盐使用过程CO2排放", "CH4回收与销毁量", "CO2回收利用量"],
      //物料
      productList: [],
      bindProductList: [],
      bindedList: [],
      processForm: {
        process_id: "",
        material_name: "",
        product_type: 1
      },
      processRules: {
        material_name: {
          required: true,
          message: "必填项"
        },
        product_type: {
          required: true,
          message: "必选项"
        }
      }
    };
  },
  computed: {
    outputList() {
      let ary = [];
      this.bindedList.map(v => {
        ary.push(v.id);
      });
      return ary;
    }
  },
  watch: {
    active(val) {
      if (val == 1) {
        this.tipStr = "";
        this.process_boundary_list();
      }
      if (val == 2) {
        this.featchBindProductList();
      }
    }
  },
  methods: {
    //编辑
    edit(processInfo) {
      this.active = 0;
      this.ruleForm.name = processInfo.name;
      this.ruleForm.description = processInfo.description;
      this.ruleForm.id = processInfo.id;
      this.processForm.process_id = processInfo.id;
    },
    //新增
    initAdd() {
      this.active = 0;
      this.ruleForm = {
        name: "",
        description: "",
        id: ""
      };
      this.processForm = {
        process_id: ""
      };
    },
    //下一步
    next(val) {
      if (val == 1) {
        this.active++;
      } else {
        this.active--;
      }
    },
    handleCheckAllChange(val) {
      console.log(val);
    },
    handleCheckedCitiesChange(value) {
      console.log(value);
    },
    //添加生产工序
    addProcesses(next) {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          if (this.editFlag == "edit" || this.processForm.process_id) {
            production_process_update(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success("修改成功");
                if (next == "next") {
                  this.cancelAdd("addAndNext");
                  this.next(1);
                  return;
                }
                this.cancelAdd("addSuccess");
              }
            });
            return;
          }
          let params = {
            name: this.ruleForm.name,
            description: this.ruleForm.description
          };
          production_process_add(params).then(res => {
            if (res.code == 0) {
              this.$message.success("添加成功");
              if (next == "next") {
                this.processForm.process_id = res.data.id;
                this.ruleForm.id = res.data.id;
                this.cancelAdd("addAndNext");
                this.next(1);
                return;
              }
              this.cancelAdd("addSuccess");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelAdd(val) {
      this.$emit("cancelAdd", val);
    },
    //核算边界
    select_emission_process_type() {
      this.linkRuleForm.variety_id = "";
      this.varietiesList = [];
      this.linkRuleForm.factor_id = "";
      this.factor_list = [];
      if (this.linkRuleForm.emission_process_type == 5 || this.linkRuleForm.emission_process_type == 6) {
        this.placeholder = "非能源";
      } else {
        this.placeholder = "能源";
      }
    },
    select_variety_id() {
      this.linkRuleForm.factor_id = "";
      this.factor_list = [];
    },
    //能源品种列表
    varieties_list() {
      if (!this.linkRuleForm.emission_process_type) {
        this.varietiesList = [];
        return;
      }
      let str = `model_type=1&emission_process_type=${this.linkRuleForm.emission_process_type}`;
      factor_varieties_list(str).then(res => {
        if (res.code == 0) {
          this.varietiesList = res.data.list;
        } else {
          this.varietiesList = [];
        }
      });
    },
    //行业品种列表
    industry_varieties_list() {
      if (!this.linkRuleForm.variety_id) {
        this.$message.warning("请先选择能源品种");
        return;
      }
      let str = `model_type=1&variety_id=${this.linkRuleForm.variety_id}`;
      industry_varieties_list(str).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.factor_list = res.data.list;
          if (this.linkRuleForm.emission_process_type == 2) {
            this.name_list = [];
            res.data.list.map(v => {
              if (this.name_list.indexOf(v.factor_source.name) == -1) {
                this.name_list.push(v.factor_source.name);
              }
            });
          }
        } else {
          this.factor_list = [];
          this.name_list = [];
        }
      });
    },
    getFirstList() {
      let ary = this.factor_list.filter(v => v.factor_source.name == this.linkRuleForm.name);
      this.first_list = [];
      ary.map(v => {
        if (this.first_list.indexOf(v.factor_source.first_category) == -1) {
          this.first_list.push(v.factor_source.first_category);
        }
      });
    },
    getSecondList() {
      let ary = this.factor_list.filter(
        v => v.factor_source.name == this.linkRuleForm.name && v.factor_source.first_category == this.linkRuleForm.first
      );
      this.second_list = [];
      ary.map(v => {
        if (this.second_list.indexOf(v.factor_source.second_category) == -1) {
          this.second_list.push(v.factor_source.second_category);
        }
      });
    },
    addBoundary() {
      this.tipStr = "";
      if (this.linkRuleForm.emission_process_type == 2) {
        let ary = this.factor_list.filter(
          v =>
            v.factor_source.name == this.linkRuleForm.name &&
            v.factor_source.first_category == this.linkRuleForm.first &&
            v.factor_source.second_category == this.linkRuleForm.second
        );
        if (ary.length == 0) {
          this.tipStr = "请选择核算指南";
          return;
        }
        this.linkRuleForm.factor_id = ary[0].id;
      }
      if (
        this.linkRuleForm["boundary_type"] == "" ||
        this.linkRuleForm["emission_process_type"] == "" ||
        this.linkRuleForm["factor_id"] == ""
      ) {
        this.tipStr = "请选择完整信息";
        return;
      }

      let params = {
        production_process_id: this.processForm.process_id,
        cal_boundary_list: [
          {
            boundary_type: this.linkRuleForm.boundary_type,
            emission_process_type: this.linkRuleForm.emission_process_type,
            factor_id: this.linkRuleForm.factor_id
          }
        ]
      };
      process_boundary_add(params).then(res => {
        if (res.code == 0) {
          this.$message.success("添加成功");
          for (let key in this.linkRuleForm) {
            this.linkRuleForm[key] = "";
          }
          this.process_boundary_list();
        }
      });
    },
    process_boundary_list() {
      process_boundary_list(`production_process_id=${this.processForm.process_id}`).then(res => {
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
    },
    //删除
    deleteProcess(id) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          process_boundary_delete({ id: id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.process_boundary_list();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //物料列表
    featchBindProductList() {
      this.product_list_page_all();
      this.product_list_page();
    },
    product_list_page_all() {
      let params = `page=1&page_size=100`;
      product_list_page(params).then(res => {
        this.bindProductList = [];
        if (res.code == 0 && res.data && res.data.list) {
          this.productList = res.data.list;
        } else {
          this.productList = [];
        }
      });
    },
    product_list_page() {
      let params = `page=1&page_size=100&process_id=${this.processForm.process_id}`;
      product_list_page(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.bindedList = res.data.list;
        } else {
          this.bindedList = [];
        }
      });
    },
    //新增物料
    saveProduct(val) {
      if (val == "add") {
        this.cancelAdd("addSuccess");
        return;
      }
      let params = {
        process_id: this.processForm.process_id,
        product_ids: this.bindProductList
      };
      bind_product(params).then(res => {
        if (res.code == 0) {
          this.$message.success("绑定成功");
          this.featchBindProductList();
        }
      });
    },
    deleteBind(id) {
      let params = {
        process_id: this.processForm.process_id,
        product_ids: [id]
      };
      del_product(params).then(res => {
        if (res.code == 0) {
          this.$message.success("删除成功");
          this.featchBindProductList();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.add-dialog {
  display: flex;
  justify-content: center;
  width: 100%;
}
.top-title {
  margin-bottom: 10px;
  font-size: 16px;
  color: #4a5975;
}
.zhijie-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  > span {
    font-size: 14px;
  }
  > div {
    display: flex;
    align-items: center;
    .source-type {
      padding: 3px 10px;
      margin-left: 20px;
      font-size: 12px;
      color: #06a845;
      background: #dbfbe7;
      border: 1px solid rgb(191 241 211 / 100%);
      border-radius: 4px;
    }
    .name-type {
      padding: 3px 10px;
      margin-left: 20px;
      font-size: 12px;
      color: #158ad3;
      background: #dcf1fd;
      border: 1px solid rgb(160 214 247 / 100%);
      border-radius: 4px;
    }
  }
}
.title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 20px 0;
  font-size: 16px;
  font-weight: normal;
  color: #4a5975;
  > span {
    display: inline-block;
    width: 6px;
    height: 16px;
    margin-top: 1px;
    margin-right: 6px;
    background: #0ec69a;
  }
}
.header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  background: #f9fafb;
  > span {
    color: #8894b3;
  }
  > div {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
.add-source-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tip-str {
  margin-top: 8px;
  font-size: 12px;
  color: red;
}
.tip-box {
  margin: 20px 0;
  font-size: 13px;
  color: #a8abb2;
  > span {
    color: red;
  }
}
.product-box {
  display: inline-block;
  width: 33%;
  margin-bottom: 10px;
}
.bind-box {
  width: 90%;
  > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    > span {
      font-size: 14px;
    }
    > div {
      display: flex;
      align-items: center;
      .source-type {
        min-width: 60px;
        padding: 3px 10px;
        margin-left: 20px;
        font-size: 12px;
        color: #06a845;
        background: #dbfbe7;
        border: 1px solid rgb(191 241 211 / 100%);
        border-radius: 4px;
      }
      .name-type {
        padding: 3px 10px;
        margin-left: 20px;
        font-size: 12px;
        color: #158ad3;
        background: #dcf1fd;
        border: 1px solid rgb(160 214 247 / 100%);
        border-radius: 4px;
      }
    }
  }
}
.footer-box {
  position: fixed;
  right: 0;
  bottom: 10px;
  display: flex;
  justify-content: flex-end;
  width: 75%;
  padding: 20px;
  border-top: 1px solid #f4f6fa;
}
.table-btn {
  color: #0ec69a;
  cursor: pointer;
}
:deep(.el-step__icon) {
  width: 30px;
  height: 30px;
}
:deep(.el-step.is-horizontal .el-step__line) {
  top: 15px;
  height: 1px;
}
:deep(.el-step__line) {
  color: #dee2eb;
  background-color: #dee2eb;
  border-color: none;
}
:deep(.el-step.is-center .el-step__line) {
  right: -42%;
  left: 57%;
}
:deep(.el-step__head.is-finish) {
  border-color: #dee2eb;
}
:deep(.is-finish .el-step__icon.is-text) {
  color: #ffffff;
  background: #b6bfd2;
  border: none;
}
:deep(.el-step__title.is-finish) {
  color: #8894b3;
}
:deep(.el-step__title.is-process) {
  font-weight: normal;
  color: #0ec69a;
}
:deep(.is-process .el-step__icon.is-text) {
  color: #ffffff;
  background: #0ec69a;
  border: none;
}
</style>
