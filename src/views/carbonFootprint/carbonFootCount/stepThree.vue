<template>
  <div class="step-one">
    <div class="inner-box">
      <div>
        <span>
          <img src="@/assets/images/carbonFootprint/baogao-2.svg" alt="" srcset="" />
        </span>
      </div>
      <div>
        <h1>产品碳足迹</h1>
        <h2 style="margin-bottom: 10px">
          <span>产品名称</span>
          <span>碳足迹结果</span>
          <span>年份</span>
          <span>核算边界</span>
        </h2>
        <h2>
          <span class="name">{{ carbonRow.product["name"] }}</span>
          <span>{{ carbonRow.footprint_value }} /tCO₂/每{{ product_unit }} </span>
          <span>{{ carbonRow.year }} </span>
          <span>{{ carbonRow.boundary_type == 1 ? "摇篮到大门" : "大门到大门" }} </span>
        </h2>
      </div>
    </div>
    <stepThreeEchart :flag="1" />
    <div class="set-box table-box table-list" style="height: auto">
      <h1>产品生产阶段的化石燃料燃烧产生的碳排放</h1>
      <el-table :data="HList">
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="低位发热值(GJ/t或GJ／万Nm³)" align="center">
          <el-table-column label="A" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio0 == 2">
                  <el-input v-model="row.emission_factor_json.ff_low_heat_output"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_low_heat_output_default"></el-input>
                </div>
                <el-select v-model="row.radio0" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_low_heat_output !== '0'">{{
                  row.emission_factor_json.ff_low_heat_output
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_low_heat_output_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="单位热值含碳量(tC/TJ)" align="center">
          <el-table-column label="B" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio1 == 2">
                  <el-input v-model="row.emission_factor_json.ff_carbon_content_per_calorific_value"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_carbon_content_per_calorific_value_default"></el-input>
                </div>
                <el-select v-model="row.radio1" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_carbon_content_per_calorific_value !== '0'">{{
                  row.emission_factor_json.ff_carbon_content_per_calorific_value
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_carbon_content_per_calorific_value_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳氧化率(%)" align="center">
          <el-table-column label="C" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio2 == 2">
                  <el-input v-model="row.emission_factor_json.ff_fuel_carbon_oxidation_rate"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.ff_fuel_carbon_oxidation_rate_default"></el-input>
                </div>
                <el-select v-model="row.radio2" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.ff_fuel_carbon_oxidation_rate !== '0'">{{
                  row.emission_factor_json.ff_fuel_carbon_oxidation_rate
                }}</span>
                <span v-else>{{ row.emission_factor_json.ff_fuel_carbon_oxidation_rate_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="折算因子" align="center">
          <el-table-column label="D" align="center" width="110">
            <template #default="{}">
              <span>44/12</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="消耗量(t或万Nm³)" align="center">
          <el-table-column label="E" prop="energy_consumption" align="center" width="150"> </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(tCO₂)" align="center">
          <el-table-column label="F=A*B*C*D*E/100000" prop="carbon_emission" align="center"> </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="set-box table-box table-list" style="height: auto">
      <h1>产品生产阶段的电力、热力的碳排放</h1>
      <el-table :data="DList">
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动数据(A)" align="center">
          <el-table-column label="数值" align="center" prop="energy_consumption"> </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{ row }">
              <span v-if="row.emission_process_type == 2">MWh</span>
              <span v-else>GJ</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CO₂当量排放因子(B)" align="center">
          <el-table-column label="数值" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio3 == 2">
                  <el-input v-model="row.emission_factor_json.other_carbon_emission_factor"></el-input>
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.other_carbon_emission_factor_default"></el-input>
                </div>
                <el-select v-model="row.radio3" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.other_carbon_emission_factor !== '0'">{{
                  row.emission_factor_json.other_carbon_emission_factor
                }}</span>
                <span v-else>{{ row.emission_factor_json.other_carbon_emission_factor_default }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{ row }">
              <div>{{ row.emission_factor_json.other_carbon_emission_factor_unit }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(C=A*B)" align="center">
          <el-table-column label="数值" align="center">
            <template #default="{ row }">
              <div>{{ row.carbon_emission }}</div>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center">
            <template #default="{}">
              <div>tCO₂</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!-- 熟料 -->
    <div class="set-box table-box table-list" style="height: auto">
      <h1>生产过程产生的碳排放</h1>
      <el-table :data="SNList" :span-method="mergeSameRows">
        <el-table-column label="类型" align="left">
          <template #default="{ row }">
            <div>{{ { 5: "熟料", 6: "非碳酸盐替代原料" }[row.emission_process_type] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="left">
          <template #default="{ row }">
            <div>{{ row.variety_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消耗量(t)" align="center">
          <el-table-column label="A" align="center" prop="energy_consumption"> </el-table-column>
        </el-table-column>
        <el-table-column label="排放因子/扣减系数(tCO₂/t)" align="center">
          <el-table-column label="B" align="center">
            <template #default="{ row }">
              <div v-if="activeId == row.id" class="update-input">
                <div v-if="row.radio4 == 2">
                  <el-input-number
                    controls-position="right"
                    :precision="4"
                    v-model="row.emission_factor_json.other_carbon_emission_factor"
                  />
                </div>
                <div v-else>
                  <el-input disabled v-model="row.emission_factor_json.other_carbon_emission_factor_default"></el-input>
                </div>
                <el-select v-model="row.radio4" placeholder="Select" style="width: 90px">
                  <el-option label="缺省值" value="1" />
                  <el-option label="自定义" value="2" />
                </el-select>
              </div>
              <div v-else>
                <span v-if="row.emission_factor_json.other_carbon_emission_factor !== '0'">{{
                  row.emission_factor_json.other_carbon_emission_factor
                }}</span>
                <span v-else>{{ row.emission_factor_json.other_carbon_emission_factor_default }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="碳排放量(tCO₂)" align="center">
          <el-table-column label="C=A*B" align="center">
            <template #default="{ row }">
              <div>{{ row.carbon_emission }}</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <stepTwoValue :hlist="HList" :dlist="DList" :slist="SList" :nlist="NList" :flag="3" />
    <stepTwoWay
      v-if="carbonRow.boundary_type == 1"
      ref="stepTwoWay"
      :lcalist="lca_list"
      @change-box="changeBox"
      :flag="3"
      :productunit="product_unit"
    />
    <div class="btn-box" style="text-align: center">
      <el-button type="primary" @click="startMath">返回列表页</el-button>
    </div>
  </div>
</template>
<script>
import { getMergeCells } from "@/utils/table.js";
import stepThreeEchart from "./stepThreeEchart.vue";
import stepTwoValue from "./stepTwoValue.vue";
import stepTwoWay from "./stepTwoWay.vue";
import { carbonStore } from "@/stores/modules/carbonFootprint";
import { product_carbon_footprint_data_list } from "@/api/modules/carbonFootprint.js";
export default {
  components: {
    stepTwoValue,
    stepTwoWay,
    stepThreeEchart
  },
  emits: ["nextStep"],
  data() {
    return {
      product_unit: "",
      activeId: "",
      HList: [],
      DList: [],
      SList: [],
      NList: [],
      tableColumn: [
        { prop: "emission_process_type", label: "" },
        { prop: "variety_name", label: "" },
        { prop: "energy_consumption", label: "" },
        { prop: "other_carbon_emission_factor", label: "" }
      ],
      checkList: [],
      lca_list: [
        {
          name: "原辅料生产",
          value: "2",
          unit_carbon_emission: "",
          data_source: ""
        },
        {
          name: "原辅料运输",
          value: "3",
          unit_carbon_emission: "",
          data_source: ""
        },
        {
          name: "产品运输",
          value: "4",
          unit_carbon_emission: "",
          data_source: ""
        },
        {
          name: "使用阶段",
          value: "5",
          unit_carbon_emission: "",
          data_source: ""
        },
        {
          name: "处置回收",
          value: "6",
          unit_carbon_emission: "",
          data_source: ""
        }
      ]
    };
  },
  computed: {
    carbonRow() {
      return this.carbonStore.carbonRow;
    },
    SNList() {
      return this.SList.concat(this.NList);
    },
    spanArr() {
      if (!this.tableColumn.length) return [];
      const mergeCols = ["emission_process_type"]; // 需要合并的列（字段）
      return getMergeCells(this.SNList, this.tableColumn, mergeCols);
    }
  },
  created() {
    this.carbonStore = carbonStore();
  },
  mounted() {
    this.featchList();
  },
  methods: {
    mergeSameRows({ row, column, rowIndex, columnIndex }) {
      if (row && column) {
      }
      return this.spanArr[rowIndex][columnIndex];
    },
    featchList() {
      product_carbon_footprint_data_list(`id=${this.carbonRow.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.emission_type_list && res.data.emission_type_list.length > 0) {
          this.product_unit = res.data.product_unit;
          this.HList = res.data.emission_type_list.filter(v => v.emission_process_type == 1);
          this.DList = res.data.emission_type_list.filter(
            v => v.emission_process_type == 2 || v.emission_process_type == 3 || v.emission_process_type == 4
          );
          this.SList = res.data.emission_type_list.filter(v => v.emission_process_type == 5);
          this.NList = res.data.emission_type_list.filter(v => v.emission_process_type == 6);
          this.HList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio0 = "1";
            v.radio1 = "1";
            v.radio2 = "1";
          });
          this.DList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio3 = "1";
          });
          this.SList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio4 = "1";
          });
          this.NList.map(v => {
            v.emission_factor_json = v.emission_factor_json ? JSON.parse(v.emission_factor_json) : {};
            v.radio5 = "1";
          });
        } else {
          this.HList = [];
          this.DList = [];
          this.SList = [];
          this.NList = [];
        }
        if (res.code == 0 && res.data && res.data.lca_list && res.data.lca_list.length > 0) {
          // this.checkList = [];
          res.data.lca_list.map(v => {
            // if (v.lca_type != 1) {
            //   this.checkList.push(String(v.lca_type));
            // }
            this.lca_list.map(k => {
              if (v.lca_type == k.value) {
                k.unit_carbon_emission = v.unit_carbon_emission;
                k.data_source = v.data_source;
                k.id = v.id;
              }
            });
          });
        }
        this.checkList = this.carbonRow.boundary_type == 1 ? ["2", "3"] : [];
        this.$refs.stepTwoWay.initPage(this.checkList);
      });
    },
    editRow(row) {
      this.activeId = row.id;
    },
    saveRow() {
      this.activeId = "";
    },
    changeBox(val) {
      this.checkList = val;
    },
    startMath() {
      this.$emit("nextStep", 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.step-one {
  .step-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    > div {
      font-size: 16px;
      color: #1f304c;
      > span {
        display: inline-block;
        width: 28px;
        height: 28px;
        margin-right: 5px;
        line-height: 28px;
        color: #ffffff;
        text-align: center;
        background: #0ec69a;
        border-radius: 50%;
      }
      .next-step {
        background: #b6bfd2;
      }
    }
    .line {
      position: absolute;
      top: 50%;
      right: 100px;
      left: 100px;
      height: 1px;
      border-bottom: 1px solid #dee2eb;
    }
  }
  .inner-box {
    display: grid;
    grid-template-columns: 90px 1fr;
    width: 100%;
    height: 126px;
    margin: 10px 0;
    background: #ffffff;
    border-radius: 10px;
    > div {
      > span {
        display: inline-block;
        width: 56px;
        height: 56px;
        margin: 30px 0 0 20px;
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
        margin: 25px 0 10px;
        font-size: 18px;
        font-weight: normal;
        color: #1f304c;
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
    }
    .update-input {
      display: grid;
      grid-template-columns: 1fr 90px;
    }
  }
  .btn-box {
    padding: 15px;
    margin-top: -10px;
    text-align: right;
    background: #ffffff;
    border-radius: 0 0 10px 10px;
  }
}
</style>
