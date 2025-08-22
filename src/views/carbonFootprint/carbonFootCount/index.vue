<template>
  <div class="carbon-analysis">
    <div class="form-box" v-if="flag === 0">
      <div class="grid-content bg-purple-dark">
        <el-form-item label="产品名称">
          <el-select v-model="form.product_id">
            <el-option v-for="v in productList" :label="v.name" :value="v.id" :key="v.id" />
          </el-select>
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="开始年份">
          <el-date-picker style="width: 100%" v-model="form.begin_year" type="year" value-format="YYYY" />
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="结束年份">
          <el-date-picker style="width: 100%" v-model="form.end_year" type="year" value-format="YYYY" />
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-button class="search-btn" @click="reset"> 重置 </el-button>
        <el-button type="primary" class="search-btn" @click="search"> 查询 </el-button>
      </div>
    </div>
    <div :class="['content', { allHeight: flag !== 0 }]">
      <carbonList :is-edit="isEdit" ref="carbonList" v-if="flag === 0" @next-step="nextStep" />
      <stepOne :is-edit="isEdit" v-else-if="flag === 1" @next-step="nextStep" />
      <stepTwo :is-edit="isEdit" v-else-if="flag === 2" @next-step="nextStep" />
      <stepThree :is-edit="isEdit" v-else-if="flag === 3" @next-step="nextStep" />
    </div>
  </div>
</template>
<script>
import { api_list } from "@/api/modules/menu.js";
import { product_list } from "@/api/modules/enterpriseSetup.js";
import carbonList from "./carbonList.vue";
import stepOne from "./stepOne.vue";
import stepTwo from "./stepTwo.vue";
import stepThree from "./stepThree.vue";
export default {
  components: {
    carbonList,
    stepOne,
    stepTwo,
    stepThree
  },
  data() {
    return {
      buttonList: [],
      flag: 0,
      productList: [],
      form: {
        product_id: "",
        begin_year: "",
        end_year: ""
      },
      row: {}
    };
  },
  computed: {
    isEdit() {
      return this.buttonList.includes("system") || this.buttonList.includes("edit");
    }
  },

  mounted() {
    this.featchData();
    this.api_list();
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
    nextStep(val) {
      this.flag = val;
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
    search() {
      this.$refs.carbonList.initPage(this.form);
    },
    reset() {
      this.form = {
        product_id: "",
        begin_year: "",
        end_year: ""
      };
      this.$refs.carbonList.initPage(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.carbon-analysis {
  height: 100%;
  .form-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding-top: 20px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 10px;
    .grid-content {
      padding-left: 20px;
    }
  }
  .content {
    height: calc(100% - 82px);
    overflow: auto;
  }
  .allHeight {
    height: 100%;
  }
}
</style>
