<template>
  <div class="nav-box">
    <div class="nav-list">
      <span @click="selectStatus(v.id)" v-for="v in processList" :key="v.id" :class="{ active: v.id == status }">{{
        v.name
      }}</span>
      <el-button
        :disabled="!isEdit"
        @click="addProductLine"
        type="primary"
        style="float: right; width: 90px; margin: 8px 20px 0 0"
      >
        新 增
      </el-button>
    </div>
    <div class="content-box" v-if="productLineList.length > 0">
      <div v-for="v in productLineList" :key="v.id" class="inner-box" @click="startMath(v)">
        <div>
          <span>
            <img src="@/assets/images/carbonFootprint/baogao-2.svg" alt="" srcset="" />
          </span>
        </div>
        <div>
          <h1>
            产品碳足迹
            <span :class="{ waitDoing: v.status == 1, finished: v.status == 7 }">
              {{ v.status == 1 ? "待填写" : v.status == 7 ? "已填写" : "填写中" }}
            </span>
            <img
              v-if="isEdit"
              @click.stop="deleteProcess(v)"
              style="width: 20px; height: 20px"
              src="@/assets/images/enterpriseSetup/delete-circle-2.svg"
              alt=""
            />
            <img
              v-if="v.status == 7"
              @click.stop="viewResult(v)"
              style="width: 20px; height: 20px"
              class="viewSvg"
              src="@/assets/images/common/view-circle-2.svg"
              alt=""
            />
          </h1>
          <h2 style="margin-bottom: 10px">
            <span>产品名称</span>
            <span>碳足迹结果</span>
            <span>年份</span>
            <span>核算边界</span>
          </h2>
          <h2>
            <span class="name">{{ v.product.name }}</span>
            <span>{{ (v.footprint_value * 1000).toFixed(2) }} kgCO₂/{{ v.product.unit }}</span>
            <span>{{ v.year }}</span>
            <span>{{ v.boundary_type == 1 ? "摇篮到大门" : "大门到大门" }}</span>
          </h2>
        </div>
      </div>
    </div>
    <div v-else style="margin-top: 20%; color: #999999; text-align: center">
      <img src="@/assets/images/notData.png" alt="" srcset="" />
      <p>暂无数据</p>
    </div>
    <!-- 新增 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="新增产品碳足迹" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-form-item label="产品名称" prop="product_id">
            <el-select v-model="linkRuleForm.product_id">
              <el-option v-for="v in productList" :label="v.name" :value="v.id" :key="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="年份" prop="year">
            <el-date-picker style="width: 100%" v-model="linkRuleForm.year" type="year" value-format="YYYY" />
          </el-form-item>
          <el-form-item label="核算边界" prop="boundary_type">
            <el-select disabled v-model="linkRuleForm.boundary_type">
              <el-option v-for="v in bourdaryList" :label="v.name" :value="v.id" :key="v.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button @click="LinkDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm()">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { carbonStore } from "@/stores/modules/carbonFootprint";
import { ElMessageBox } from "element-plus";
import { product_list } from "@/api/modules/enterpriseSetup.js";
import {
  product_carbon_footprint_add,
  product_carbon_footprint_list,
  product_carbon_footprint_delete
} from "@/api/modules/carbonFootprint.js";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  emits: ["nextStep"],
  data() {
    return {
      carbonStore: {},
      filteform: {},
      processList: [
        { name: "全部", id: 0 },
        { name: "待填写", id: "1" },
        { name: "填写中", id: "2,3,4,5,6" },
        { name: "已填写", id: "7" }
      ],
      status: 0,
      productLineList: [],
      // 新增
      bourdaryList: [
        { name: "摇篮到大门", id: 1 },
        { name: "大门到大门", id: 2 }
      ],
      productList: [],
      LinkDialog: false,
      linkRuleForm: {
        product_id: "",
        year: "",
        boundary_type: 2
      },
      linkRules: {
        product_id: [{ required: true, message: "请选择" }],
        year: [{ required: true, message: "请选择" }],
        boundary_type: [{ required: true, message: "请选择" }]
      }
    };
  },
  mounted() {
    this.carbonStore = carbonStore();
    this.featchList();
  },
  methods: {
    initPage(form) {
      this.filteform = form;
      this.featchList();
    },
    selectStatus(id) {
      this.status = id;
      this.featchList();
    },
    featchList() {
      if (this.filteform.begin_year > this.filteform.end_year) {
        this.$message.error("开始年份不能大于结束年份");
        return;
      }
      let params = `status_list=${this.status}`;
      for (let key in this.filteform) {
        if (this.filteform[key]) {
          params += `&${key}=${this.filteform[key]}`;
        }
      }
      product_carbon_footprint_list(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.productLineList = res.data.list;
        } else {
          this.productLineList = [];
        }
      });
    },
    //新增
    addProductLine() {
      this.LinkDialog = true;
      this.featchData();
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    featchData() {
      product_list({}).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.productList = res.data.list.filter(v => v.product_type == 2);
        } else {
          this.productList = [];
        }
      });
    },
    submitForm() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          this.linkRuleForm.year = Number(this.linkRuleForm.year);
          product_carbon_footprint_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.$message.success("新增成功");
              this.featchList();
              this.LinkDialog = false;
            }
          });
        } else {
          return false;
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
          product_carbon_footprint_delete({ id: row.id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.featchList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    //下一步
    startMath(v) {
      if (!this.isEdit) {
        return;
      }
      this.carbonStore.setCarbonRow(v);
      this.$emit("nextStep", 1);
    },
    viewResult(v) {
      this.carbonStore.setCarbonRow(v);
      this.$emit("nextStep", 3);
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-box {
  height: 100%;
  .nav-list {
    padding-left: 20px;
    background: #ffffff;
    border-radius: 10px;
    > span {
      display: inline-block;
      margin-right: 40px;
      font-size: 15px;
      line-height: 45px;
      color: #1f304c;
      cursor: pointer;
    }
    .active {
      color: #0ec69a;
      border-bottom: 3px solid #0ec69a;
    }
  }
  .content-box {
    height: calc(100% - 48px);
    overflow: auto;
    .inner-box {
      display: grid;
      grid-template-columns: 90px 1fr;
      width: 100%;
      padding-bottom: 10px;
      margin-top: 15px;
      cursor: pointer;
      background: #ffffff;
      border-radius: 10px;
      > div {
        > span {
          display: inline-block;
          width: 56px;
          height: 56px;
          margin: 25px 0 0 20px;
          text-align: center;
          background: #dbfbe7;
          border-radius: 20px;
        }
        img {
          width: 32px;
          height: 32px;
          margin-top: 10px;
        }
        h1 {
          margin: 0;
          margin: 15px 0 10px;
          font-size: 18px;
          font-weight: normal;
          color: #1f304c;
          > span {
            display: inline-block;
            padding: 1px 6px;
            margin-left: 7px;
            font-size: 14px;
            color: #02c0e9;
            background: #c9f5ff;
            border: 1px solid #93e6f8;
            border-radius: 4px;
          }
          .waitDoing {
            color: #fa9e0d;
            background: #fff4e2;
            border: 1px solid #fed698;
          }
          .finished {
            color: #0dcd58;
            background: #dbfbe7;
            border: 1px solid #bff1d3;
          }
          > img {
            float: right;
            margin: 0 15px 0 0;
            cursor: pointer;
          }
          .viewSvg {
            fill: red;
          }
        }
        h2 {
          display: flex;
          justify-content: flex-start;
          margin: 0;
          font-size: 14px;
          font-weight: normal;
          color: #8894b3;
          > span {
            display: inline-block;
            width: 30%;
          }
          .name {
            font-size: 14px;
            color: #4a5975;
          }
        }
      }
    }
  }
}
</style>
