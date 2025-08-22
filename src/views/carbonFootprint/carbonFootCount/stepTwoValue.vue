<template>
  <div class="step-two-value">
    <div :class="{ 'hidden-table': hiddenVal }">
      <div v-for="v in hlist" :key="v.id">
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的低位发热值</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的低位发热值(GJ/t)</div>
              <div v-if="activeStr == v.id + 'ff_low_heat_output'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.ff_low_heat_output"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.ff_low_heat_output !== '0'">
                {{ v.emission_factor_json.ff_low_heat_output }}
              </div>
              <div v-else>{{ v.emission_factor_json.ff_low_heat_output_default }}</div>
              <div v-if="activeStr == v.id + 'ff_low_heat_output_source'">
                <el-input v-model="v.emission_factor_json.ff_low_heat_output_source" style="height: 32px"></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.ff_low_heat_output_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_low_heat_output'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_low_heat_output')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_low_heat_output_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_low_heat_output_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的单位热值含碳量</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的低位发热值(GJ/t)</div>
              <div v-if="activeStr == v.id + 'ff_carbon_content_per_calorific_value'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.ff_carbon_content_per_calorific_value"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.ff_carbon_content_per_calorific_value !== '0'">
                {{ v.emission_factor_json.ff_carbon_content_per_calorific_value }}
              </div>
              <div v-else>{{ v.emission_factor_json.ff_carbon_content_per_calorific_value_default }}</div>
              <div v-if="activeStr == v.id + 'ff_carbon_content_per_calorific_value_source'">
                <el-input
                  v-model="v.emission_factor_json.ff_carbon_content_per_calorific_value_source"
                  style="height: 32px"
                ></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.ff_carbon_content_per_calorific_value_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_carbon_content_per_calorific_value'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_carbon_content_per_calorific_value')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_carbon_content_per_calorific_value_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_carbon_content_per_calorific_value_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的碳氧化率</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的低位发热值(GJ/t)</div>
              <div v-if="activeStr == v.id + 'ff_fuel_carbon_oxidation_rate'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.ff_fuel_carbon_oxidation_rate"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.ff_fuel_carbon_oxidation_rate !== '0'">
                {{ v.emission_factor_json.ff_fuel_carbon_oxidation_rate }}
              </div>
              <div v-else>{{ v.emission_factor_json.ff_fuel_carbon_oxidation_rate_default }}</div>
              <div v-if="activeStr == v.id + 'ff_fuel_carbon_oxidation_rate_source'">
                <el-input v-model="v.emission_factor_json.ff_fuel_carbon_oxidation_rate_source" style="height: 32px"></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.ff_fuel_carbon_oxidation_rate_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_fuel_carbon_oxidation_rate'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_fuel_carbon_oxidation_rate')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'ff_fuel_carbon_oxidation_rate_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'ff_fuel_carbon_oxidation_rate_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="v in dlist" :key="v.id">
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的CO₂当量排放因子{{ v.emission_process_type == 2 ? "(tCOz/MWh)" : "(tCO₂/GJ)" }}</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的CO₂当量排放因子{{ v.emission_process_type == 2 ? "(tCOz/MWh)" : "(tCO₂/GJ)" }}</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.other_carbon_emission_factor"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.other_carbon_emission_factor !== '0'">
                {{ v.emission_factor_json.other_carbon_emission_factor }}
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_default }}</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">
                <el-input v-model="v.emission_factor_json.other_carbon_emission_factor_source" style="height: 32px"></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="v in slist" :key="v.id">
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的CO₂过程排放因子</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的CO₂当量排放因子(tCO₂/t)</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.other_carbon_emission_factor"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.other_carbon_emission_factor !== '0'">
                {{ v.emission_factor_json.other_carbon_emission_factor }}
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_default }}</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">
                <el-input v-model="v.emission_factor_json.other_carbon_emission_factor_source" style="height: 32px"></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="v in nlist" :key="v.id">
        <div class="set-box" style="height: auto">
          <h1>{{ v.variety_name }}的CO₂排放扣减系数</h1>
          <div :class="['table-display', { 'table-display_view': flag == 3 }]">
            <div class="left">
              <div>参数</div>
              <div>数值</div>
              <div>数据源</div>
            </div>
            <div class="right">
              <div>{{ v.variety_name }}的CO₂当量排放因子(tCO₂/t)</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor'">
                <el-input-number
                  controls-position="right"
                  :precision="4"
                  v-model="v.emission_factor_json.other_carbon_emission_factor"
                  style="width: 100%; height: 32px"
                />
              </div>
              <div v-else-if="v.emission_factor_json.other_carbon_emission_factor !== '0'">
                {{ v.emission_factor_json.other_carbon_emission_factor }}
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_default }}</div>
              <div v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">
                <el-input v-model="v.emission_factor_json.other_carbon_emission_factor_source" style="height: 32px"></el-input>
              </div>
              <div v-else>{{ v.emission_factor_json.other_carbon_emission_factor_source }}</div>
            </div>
            <div class="control-box" v-if="flag == 2">
              <div>操作</div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
              <div class="table-btn" style="align-items: center">
                <div @click="saveRow(row)" v-if="activeStr == v.id + 'other_carbon_emission_factor_source'">保存</div>
                <img
                  v-else
                  @click="edit(v, 'other_carbon_emission_factor_source')"
                  src="@/assets/images/common/edit-circle-2.svg"
                  alt=""
                  style="width: 16px; height: 16px; cursor: pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden-box" @click="taggle">
      {{ hiddenVal ? "展开" : "收起" }}
      <el-icon v-if="!hiddenVal"><ArrowUp /></el-icon>
      <el-icon v-else><ArrowDown /></el-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hlist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dlist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    slist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    nlist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    flag: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      hiddenVal: true,
      activeStr: ""
    };
  },
  methods: {
    taggle() {
      this.hiddenVal = !this.hiddenVal;
    },
    edit(v, value) {
      this.activeStr = v.id + value;
    },
    saveRow() {
      this.activeStr = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.step-two-value {
  > div {
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
        border-bottom: 1px solid #dee2eb;
      }
      .table-display {
        display: grid;
        grid-template-columns: 200px 1fr 100px;
        .left {
          background: #f9fafb;
          > div {
            height: 45px;
            font-size: 14px;
            line-height: 45px;
            color: #4a5975;
            text-align: center;
            border-bottom: 1px solid #dee2eb;
          }
        }
        .right {
          > div {
            height: 45px;
            padding-left: 10px;
            font-size: 14px;
            line-height: 45px;
            color: #4a5975;
            text-align: left;
            border-bottom: 1px solid #dee2eb;
          }
        }
        .control-box {
          border-left: 1px solid #dee2eb;
          > div {
            height: 45px;
            padding-left: 10px;
            font-size: 14px;
            line-height: 45px;
            color: #4a5975;
            text-align: center;
            border-bottom: 1px solid #dee2eb;
          }
        }
      }
      .table-display_view {
        grid-template-columns: 200px 1fr;
      }
    }
  }
  .hidden-table {
    height: 198px;
    overflow: hidden;
  }
  .hidden-box {
    padding: 15px;
    margin-top: -10px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #0ec69a;
    text-align: center;
    cursor: pointer;
    background: #ffffff;
    border-radius: 0 0 10px 10px;
  }
}
</style>
