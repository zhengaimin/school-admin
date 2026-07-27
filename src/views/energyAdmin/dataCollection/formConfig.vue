<template>
  <div class="form-config">
    <div class="radio-box" v-if="false">
      <el-radio-group v-model="radio2">
        <el-radio-button label="手动采集" value="1" />
        <el-radio-button label="自动采集" value="2" />
      </el-radio-group>
    </div>
    <div class="table-box">
      <div class="btn-box back-box">
        <span>{{ strdate }}企业数据</span>
        <!-- <el-button type="primary" style="width: 80px" @click="back">返回</el-button> -->
      </div>
      <div class="nav-list">
        <span @click="selectProcess(v.id)" v-for="v in processList" :key="v.id" :class="{ active: v.id == activeId }">{{
          v.name
        }}</span>
      </div>
    </div>
    <div class="form-config-box">
      <h1 v-show="fuleObj['key1'] > 0">
        <span> 化石燃料燃烧 </span>
      </h1>
      <fuelForm ref="fuelForm" @fuel-list="fuelList" />
      <h1 v-show="fuleObj['key2'] > 0">
        <span> 企业净购入的电力隐含的CO2排放 </span>
      </h1>
      <powerForm ref="powerForm" @fuel-list="fuelList" />
      <h1 v-show="fuleObj['key3'] > 0">
        <span> 企业净购入的热力(热水)隐含的CO2排放</span>
      </h1>
      <waterForm ref="waterForm" @fuel-list="fuelList" />
      <h1 v-show="fuleObj['key4'] > 0">
        <span> 企业净购入的热力(蒸汽)隐含的CO2排放 </span>
      </h1>
      <steamForm ref="steamForm" @fuel-list="fuelList" />
      <h1 v-show="fuleObj['key5'] > 0">
        <span> 生产过程的CO2排放（熟料） </span>
      </h1>
      <cementForm ref="cementForm" @fuel-list="fuelList" />
      <h1 v-show="fuleObj['key6'] > 0">
        <span> 熟料生产过程产生的碳排放（非碳酸盐替代原料） </span>
      </h1>
      <rawForm ref="rawForm" @fuel-list="fuelList" />
    </div>
    <div class="back-btn">
      <el-button type="primary" style="width: 100px" @click="back">返 回</el-button>
    </div>
  </div>
</template>
<script>
import { production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import fuelForm from "./components/fuelForm.vue";
import powerForm from "./components/powerForm.vue";
import waterForm from "./components/waterForm.vue";
import steamForm from "./components/steamForm.vue";
import cementForm from "./components/cementForm.vue";
import rawForm from "./components/rawForm.vue";
export default {
  components: { fuelForm, powerForm, waterForm, steamForm, cementForm, rawForm },
  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    strdate: {
      type: String,
      default: ""
    }
  },
  emits: ["goBack"],
  data() {
    return {
      radio2: "1",
      processList: [],
      activeId: "", //工序ID
      fuleObj: {}
    };
  },
  mounted() {
    //获取工序
    this.production_process_diagram();
  },
  methods: {
    //查询工序
    production_process_diagram() {
      production_process_diagram().then(res => {
        if (res.code == 0 && res.data && res.data.nodes) {
          this.processList = res.data.nodes;
          this.activeId = res.data.nodes[0].id;
          this.$refs.fuelForm.initPage(this.activeId, this.timestamp);
          this.$refs.powerForm.initPage(this.activeId, this.timestamp);
          this.$refs.waterForm.initPage(this.activeId, this.timestamp);
          this.$refs.steamForm.initPage(this.activeId, this.timestamp);
          this.$refs.cementForm.initPage(this.activeId, this.timestamp);
          this.$refs.rawForm.initPage(this.activeId, this.timestamp);
        } else {
          this.processList = [];
        }
      });
    },
    //选择工序
    selectProcess(id) {
      this.activeId = id;
      this.$refs.fuelForm.initPage(this.activeId, this.timestamp);
      this.$refs.powerForm.initPage(this.activeId, this.timestamp);
      this.$refs.waterForm.initPage(this.activeId, this.timestamp);
      this.$refs.steamForm.initPage(this.activeId, this.timestamp);
      this.$refs.cementForm.initPage(this.activeId, this.timestamp);
      this.$refs.rawForm.initPage(this.activeId, this.timestamp);
    },
    fuelList(val, length) {
      this.fuleObj["key" + val] = length;
    },
    //返回
    back() {
      this.$emit("goBack");
    }
  }
};
</script>
<style lang="scss" scoped>
.form-config {
  position: relative;
  .radio-box {
    height: 50px;
  }
  .table-box {
    background: #ffffff;
    border-radius: 10px;
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 56px;
      padding: 0 20px;
      border-bottom: 1px solid #e6e6e6;
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
    .back-box {
      display: flex;
      justify-content: space-between;
    }
    .nav-list {
      padding-left: 20px;
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
    .form-box {
      display: grid;
      grid-template-columns: 120px auto;
      grid-gap: 10px;
      border-bottom: 1px solid #f4f6fa;
      > span {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 10px;
        font-size: 14px;
        color: #4a5975;
        background-image: linear-gradient(91deg, #fdfdfd 0%, #f9fafb 100%);
      }
      > div {
        display: grid;
        grid-template-columns: 1fr 1fr 1.5fr 1fr 1fr;
        grid-gap: 0 10px;
        > div {
          padding: 20px 10px;
          .name {
            padding-bottom: 5px;
            font-size: 14px;
            color: #8894b3;
          }
          .name-file {
            height: 30px;
            padding: 0 10px;
            overflow: hidden;
            font-size: 14px;
            line-height: 30px;
            color: #4a5975;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: #dee2eb;
            border-radius: 6px;
          }
        }
      }
    }
  }
  .form-config-box {
    margin-top: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
      line-height: 50px;
      background: #ffffff;
      border-bottom: 1px solid #e6e6e6;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      > span {
        display: flex;
        align-items: center;
        height: 35px;
        padding: 0;
        color: #000000;
      }
    }
  }
  .back-btn {
    position: fixed;
    right: 0;
    bottom: 35px;
    left: 180px;
    text-align: center;
  }
}
</style>
