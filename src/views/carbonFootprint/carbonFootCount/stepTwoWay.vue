<template>
  <div class="step-two-value">
    <div class="set-box">
      <h1>
        采用LCA核算范围
        <span>生产一{{ productunit }}产品对应产生的碳排放量</span>
      </h1>
      <div class="check-box">
        <el-checkbox-group :disabled="true" v-model="checkList" @change="changeBox">
          <el-checkbox label="原辅料生产" value="2" />
          <el-checkbox label="原辅料运输" value="3" />
          <el-checkbox label="产品运输" value="4" />
          <el-checkbox label="使用阶段" value="5" />
          <el-checkbox label="处置回收" value="6" />
        </el-checkbox-group>
      </div>
    </div>
    <stepThreeEchart v-if="flag == 3" :flag="2" />
    <div v-for="v in lcalist" :key="v.value" class="set-box" v-show="checkList.indexOf(v.value) != -1">
      <h1>{{ v.name }}</h1>
      <div :class="['persent-box', { 'persent-box-view': flag == 3 }]">
        <div class="name-box">参数</div>
        <div class="input-box">碳足迹数据(tCO₂/{{ productunit }})</div>
        <div class="control-box" v-if="flag == 2">操作</div>
      </div>
      <div :class="['persent-box', { 'persent-box-view': flag == 3 }]">
        <div class="name-box">数值</div>
        <div class="input-box">
          <el-input-number
            controls-position="right"
            :precision="4"
            v-if="avtiveValue == v.value + 'first'"
            v-model="v.unit_carbon_emission"
            placeholder="请输入"
            style="width: 100%; margin-right: 10px"
          />
          <span v-else>{{ formatNumber(v.unit_carbon_emission) }}</span>
        </div>
        <div class="control-box" v-if="flag == 2">
          <div class="table-btn">
            <div @click="saveRow(row)" v-if="avtiveValue == v.value + 'first'">保存</div>
            <img
              v-else
              @click="edit(v, 'first')"
              src="@/assets/images/common/edit-circle-2.svg"
              alt=""
              style="width: 16px; height: 16px; cursor: pointer"
            />
          </div>
        </div>
      </div>
      <div :class="['persent-box', { 'persent-box-view': flag == 3 }]">
        <div class="name-box">数据源</div>
        <div class="input-box">
          <el-input
            v-if="avtiveValue == v.value + 'second'"
            v-model="v.data_source"
            :rows="3"
            type="textarea"
            placeholder="请输入"
            style="margin: 10px 10px 10px 0"
          ></el-input>
          <span v-else>{{ v.data_source }}</span>
        </div>
        <div class="control-box" v-if="flag == 2">
          <div class="table-btn">
            <div @click="saveRow(row)" v-if="avtiveValue == v.value + 'second'">保存</div>
            <img
              v-else
              @click="edit(v, 'second')"
              src="@/assets/images/common/edit-circle-2.svg"
              alt=""
              style="width: 16px; height: 16px; cursor: pointer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { NumberFormat } from "vue-i18n";
import stepThreeEchart from "./stepThreeEchart.vue";
export default {
  components: {
    stepThreeEchart
  },
  props: {
    lcalist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    flag: {
      type: Number,
      default: 2
    },
    productunit: {
      type: String,
      default: ""
    }
  },
  emits: ["changeBox"],
  data() {
    return {
      avtiveValue: "",
      checkList: []
    };
  },

  methods: {
    initPage(list) {
      this.checkList = list;
    },
    edit(v, val) {
      this.avtiveValue = v.value + val;
    },
    saveRow() {
      this.avtiveValue = "";
    },
    changeBox() {
      this.$emit("changeBox", this.checkList);
    },
    formatNumber(value) {
      if (!value) return "0.0000";
      return parseFloat(value).toFixed(4);
    }
  }
};
</script>
<style lang="scss" scoped>
.step-two-value {
  .set-box {
    margin-bottom: 10px;
    overflow: hidden;
    background: #ffffff;
    border-radius: 10px;
    h1 {
      height: 50px;
      padding-left: 20px;
      margin: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 50px;
      color: #1f304c;
      border-bottom: 1px solid #f4f6fa;
      > span {
        font-size: 12px;
        color: #8393a7;
      }
    }
    .check-box {
      padding: 10px 20px;
    }
    .persent-box {
      display: grid;
      grid-template-columns: 180px 1fr 100px;
      min-height: 50px;
      border-bottom: 1px solid #dee2eb;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .name-box {
        padding-left: 20px;
        font-size: 14px;
        background: #f9fafb;
      }
      .input-box {
        padding-left: 10px;
        font-size: 14px;
      }
      .control-box {
        padding-left: 40px;
        font-size: 14px;
        color: #8894b3;
        text-align: center;
        border-left: 1px solid #dee2eb;
      }
    }
    .persent-box-view {
      grid-template-columns: 180px 1fr;
    }
    .btn-box {
      padding: 15px;
      text-align: right;
    }
  }
}
</style>
