<template>
  <div class="carbon-analysis">
    <div class="form-box">
      <div class="grid-content bg-purple-dark">
        <el-form-item label="工序名称">
          <el-select v-model="form.process_id">
            <el-option label="全部" :value="Number(0)" key="0" />
            <el-option v-for="v in processList" :label="v.name" :value="Number(v.id)" :key="v.id" />
          </el-select>
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="查询类型" @change="selectType">
          <el-radio-group v-model="form.time_type">
            <el-radio-button label="年" value="1" />
            <el-radio-button label="月" value="2" />
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="开始时间">
          <el-date-picker style="width: 100%" v-model="form.start_time" value-format="x" :type="dateType" />
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-form-item label="结束时间">
          <el-date-picker style="width: 100%" v-model="form.end_time" value-format="x" :type="dateType" />
        </el-form-item>
      </div>
      <div class="grid-content bg-purple-dark">
        <el-button type="primary" class="search-btn" @click="search"> 查询 </el-button>
      </div>
    </div>
    <div>
      <centerChart ref="centerChart" />
    </div>
    <div>
      <bottomChart ref="bottomChart" :date-type="dateType" />
    </div>
  </div>
</template>
<script>
import centerChart from "./centerChart.vue";
import bottomChart from "./bottomChart.vue";
import { production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import { calculate } from "@/api/modules/carbonAnalysis.js";
export default {
  components: {
    centerChart,
    bottomChart
  },
  data() {
    return {
      processList: [],
      form: {
        process_id: 0,
        time_type: 1,
        start_time: "",
        end_time: ""
      }
    };
  },
  computed: {
    dateType() {
      return this.form.time_type == 1 ? "year" : "month";
    }
  },
  mounted() {
    this.calculate();
    this.getNormalDate();
  },
  methods: {
    //触发计算接口
    calculate() {
      calculate().then(res => {
        console.log(res);
      });
    },
    //获取当前年时间戳
    getNormalDate() {
      this.form.start_time = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
      this.form.end_time = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
      this.production_process_diagram();
    },
    //查询工序
    production_process_diagram() {
      production_process_diagram().then(res => {
        if (res.code == 0 && res.data && res.data.nodes) {
          this.processList = res.data.nodes;
          this.search();
        } else {
          this.processList = [];
        }
      });
    },
    selectType() {
      if (this.form.time_type == 1) {
        this.form.start_time = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
        this.form.end_time = new Date().getTime() - 365 * 24 * 60 * 60 * 1000;
      } else if (this.form.time_type == 2) {
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        this.form.start_time = now.getTime();
        this.form.end_time = now.getTime();
      }
    },
    search() {
      if (this.form.start_time > this.form.end_time) {
        this.$message.warning("开始时间不能大于结束时间");
        return;
      }
      if (!this.form.start_time || !this.form.end_time) {
        this.$message.warning("请选择开始时间或结束时间");
        return;
      }
      let sYear = new Date(this.form.start_time).getFullYear();
      let eYear = new Date(this.form.end_time).getFullYear();
      if (this.form.time_type == 2 && sYear != eYear) {
        this.$message.warning("请选择同一年份");
        return;
      }
      let str = "";
      for (let key in this.form) {
        if (key == "start_time" || key == "end_time") {
          str += `${key}=${(this.form[key] / 1000).toFixed(0)}&`;
        } else {
          str += `${key}=${this.form[key]}&`;
        }
      }
      this.$refs.centerChart.initPage(str);
      this.$refs.bottomChart.initPage(str);
    }
  }
};
</script>

<style lang="scss" scoped>
.carbon-analysis {
  .form-box {
    display: grid;
    grid-template-columns: 1fr auto 1fr 1fr 1fr;
    padding-top: 20px;
    background: #ffffff;
    border-radius: 10px;
    .grid-content {
      padding-left: 20px;
    }
  }
}
</style>
