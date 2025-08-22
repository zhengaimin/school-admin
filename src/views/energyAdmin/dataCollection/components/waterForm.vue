<template>
  <div style="margin-bottom: 20px">
    <div v-for="(item, itemIndex) in formList" :key="item.id" class="table-box">
      <div class="btn-box">
        <div>
          <span class="name">
            {{ item.industry_varieties.variety.name }}
          </span>
          <span class="source-type">企业净购入的热力(热水)隐含的CO2排放</span>
          <span class="name-type">{{ item.boundary_type == 1 ? "直接排放" : "间接排放" }}</span>
          <span style="font-size: 12px; color: #8894b3"> 《{{ item.industry_varieties.factor_source.name }}》 </span>
        </div>
        <span v-if="item.cal_list.length > 0" @click="editFactor(item)" class="edit-yz">
          <img style="width: 16px; height: 16px" src="@/assets/images/common/set-circle-2.svg" alt="" srcset="" /> 编辑因子
        </span>
      </div>
      <div v-for="itemCal in item.cal_list" :key="itemCal.id" class="form-box">
        <div class="name-box">
          <div>
            {{ itemCal.energy_equipment_name }}({{ itemCal.io == 1 ? "输入" : "输出" }})
            <div v-if="itemCal.id" class="added">(已填写)</div>
            <div v-else class="no-add">(待填写)</div>
          </div>
        </div>
        <!-- 1:固定字段 2:用户输入的字段 3:默认值但是可编辑的字段 4:特殊处理字段 -->
        <div>
          <div v-for="subItem in header" :key="subItem.sort">
            <div style="width: 250px; margin-right: 20px" v-if="subItem.sort == 1 || subItem.sort == 2">
              <div class="name">
                {{ subItem.name }}
                <span v-if="subItem.key_unit">({{ itemCal.formJson[subItem.key_unit] }})</span>
              </div>
              <el-input-number style="width: 100%" v-model.number="itemCal.formJson[subItem.key]" />
            </div>
            <div style="width: 250px; margin-right: 20px" v-if="subItem.field_type == 3">
              <div class="name">
                {{ subItem.name }}<span v-if="subItem.key_unit">({{ itemCal.formJson[subItem.key_unit] }})</span>
              </div>
              <div style="display: flex; align-items: center">
                <el-input-number
                  style="width: 100%"
                  v-model.number="itemCal.formJson[subItem.key]"
                  :disabled="itemCal.defaultAry[subItem.sort] == 1"
                >
                </el-input-number>
                <el-select
                  v-if="false"
                  @change="selectDefault(itemIndex, itemCal, subItem.key, itemCal.defaultAry[subItem.sort])"
                  style="width: 140px"
                  v-model="itemCal.defaultAry[subItem.sort]"
                >
                  <el-option value="1" label="缺省值"></el-option>
                  <el-option value="2" label="实测值"></el-option>
                </el-select>
              </div>
            </div>
            <div style="width: 250px; margin-right: 20px" v-if="subItem.field_type == 4">
              <div class="name">
                {{ subItem.name }}<span v-if="subItem.key_unit">({{ itemCal.formJson[subItem.key_unit] }})</span>
              </div>
              <div style="display: flex; align-items: center">
                <el-input-number style="width: 100%" v-model.number="itemCal.formJson[subItem.key]" :disabled="true">
                </el-input-number>
                <el-select v-if="false" style="width: 140px" v-model="itemCal.defaultAry[subItem.sort]">
                  <el-option value="1" label="缺省值"></el-option>
                  <el-option value="2" label="实测值"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div v-if="calData">
            <div style="width: 250px; margin-right: 20px">
              <div class="name">碳排放量(tCO₂eq)</div>
              <span style="font-size: 23px; color: #0ec69a">
                {{ calData[itemCal.instruments_id].carbon_budget }}
              </span>
            </div>
          </div>
          <div v-if="calData">
            <div style="width: 250px; margin-right: 20px">
              <div class="name">综合能源(tce)</div>
              <span style="font-size: 23px; color: #37affa">
                {{ calData[itemCal.instruments_id].energy_budget }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="formList.length > 0 && btnFlag">
      <el-button @click.stop="confirmMath">计算</el-button>
      <el-button type="primary" @click.stop="confirmSubmit">提交</el-button>
    </div>
    <!-- 编辑因子 -->
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" title="编辑" :width="800">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <div class="form-box-edit" v-if="factorList.length > 0">
            <div v-for="v in factorList" :key="v.sort">
              <el-form-item :label="v.name">
                <el-input
                  :disabled="v.field_type == 1"
                  :placeholder="v.placeholder"
                  v-model="linkRuleForm.fieldObj[v.key]"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="LinkDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { report_list, report_upsert, process_boundary_list, cal_data } from "@/api/modules/dataCollection.js";
import { emission_process_field_list, factor_history_add } from "@/api/modules/basicLibrary.js";
import { calculate } from "@/api/modules/carbonAnalysis.js";
export default {
  emits: ["fuelList"],
  data() {
    return {
      activeId: "",
      timestamp: "",
      year: "",
      reportList: [], //排放边界因子
      defaultList: [],
      calList: [], //计量器具
      header: [],
      ary: [],
      calData: null,
      // 编辑
      LinkDialog: false,
      factorList: [],
      linkRuleForm: {
        industry_varieties_id: "",
        fieldObj: {}
      }
    };
  },
  computed: {
    formList() {
      this.header.map((v, i) => {
        if (i == 2) {
          v.key_unit = this.header[i + 1].key;
        }
        if (i == 4) {
          v.key_unit = this.header[i + 1].key;
        }
      });
      let keys = [
        "ff_unit_of_measurement",
        "ff_low_heat_output_unit",
        "ff_standard_coal_factor_unit",
        "npe_electric_power_unit",
        "npe_carbon_emission_factor_unit",
        "npe_standard_coal_factor_unit",
        "nphw_carbon_emission_factor_unit",
        "nphw_standard_coal_factor_unit",
        "nps_carbon_emission_factor_unit",
        "nps_standard_coal_factor_unit"
      ];
      for (const item of this.reportList) {
        item.cal_list = [];
        this.calList.map(item1 => {
          let obj = {};
          item.industry_varieties.factors.map(subItem => {
            obj[subItem.key] = keys.indexOf(subItem.key) == -1 ? Number(subItem.value) : subItem.value;
          });
          if (item.industry_varieties.variety_id == item1.industry_varieties_id && item.id == item1.boundary_id) {
            if (item1.data_json) {
              obj["nphw_hot_water_quality"] = JSON.parse(item1.data_json)["nphw_hot_water_quality"];
              obj["nphw_hot_water_temperature"] = JSON.parse(item1.data_json)["nphw_hot_water_temperature"];
            }
            if (item.industry_varieties.factor_now.data_json) {
              for (let key in JSON.parse(item.industry_varieties.factor_now.data_json)) {
                obj[key] = JSON.parse(item.industry_varieties.factor_now.data_json)[key];
              }
            }
            // item1.formJson = item1.data_json ? JSON.parse(item1.data_json) : obj;
            item1.formJson = obj;
            item.cal_list.push(item1);
          }
          //设置默认下拉为缺省值
          item1.defaultAry = [];
          if (!item1.default_value) {
            item1.defaultAry = ["", "", "", "1", "", "1", ""];
          } else if (item1.default_value && typeof item1.default_value === "string") {
            item1.defaultAry = item1.default_value.split(",");
          }
        });
      }
      return this.reportList;
    },
    btnFlag() {
      let bool = false;
      this.reportList.map(item => {
        if (item.cal_list.length > 0) {
          bool = true;
        }
      });
      return bool;
    }
  },
  methods: {
    initPage(activeId, timestamp) {
      this.calData = null;
      this.activeId = activeId;
      this.timestamp = timestamp;
      this.year = new Date(timestamp * 1000).getFullYear();
      this.process_boundary_list();
      this.report_list();
    },
    calculate() {
      calculate();
    },
    //查核算边界  industry_varieties_id 关联关系ID
    process_boundary_list() {
      process_boundary_list({ id: this.activeId, emission_process_type: 3 }).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.reportList = res.data.list;
          this.defaultList = JSON.parse(JSON.stringify(res.data.list));
        } else {
          this.reportList = [];
        }
        this.$emit("fuelList", 3, this.reportList.length);
      });
    },
    //查核算表单
    report_list() {
      let params = {
        process_id: this.activeId,
        emission_process_type: 3,
        commit_date: this.timestamp,
        year: this.year
      };
      report_list(params).then(res => {
        if (res.code == 0 && res.data && res.data.list_report) {
          this.header = res.data.header;
          this.calList = res.data.list_report;
        } else {
          this.calList = [];
        }
      });
    },
    selectDefault(index, itemCal, key, radio) {
      if (radio == 2) {
        return;
      }
      let ary = this.defaultList[index].industry_varieties.factors.filter(v => v.key == key);
      if (ary.length > 0) {
        itemCal.formJson[key] = Number(ary[0].value);
      }
    },
    confirmSubmit() {
      let ary = [];
      this.formList.map(v => {
        v.cal_list.map(k => {
          k.boundary_id = v.id;
          ary.push(k);
        });
      });
      let ary1 = [];
      ary.map(item => {
        ary1.push({
          boundary_id: item.boundary_id,
          date: this.timestamp,
          instrument_id: item.instruments_id,
          data_json: JSON.stringify(item.formJson),
          is_commit: 2,
          id: item.id,
          default_value: item.defaultAry.join(","),
          year: this.year
        });
      });
      report_upsert(ary1).then(res => {
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.process_boundary_list();
          this.report_list();
          this.calculate();
        }
      });
    },
    confirmMath() {
      let ary = [];
      this.formList.map(v => {
        v.cal_list.map(k => {
          k.boundary_id = v.id;
          ary.push(k);
        });
      });
      let ary1 = [];
      ary.map(item => {
        ary1.push({
          instrument_id: item.instruments_id,
          data_json: JSON.stringify(item.formJson)
        });
      });
      let params = {
        emission_process_type: 3,
        cal_eb_and_cb: ary1
      };
      cal_data(params).then(res => {
        if (res.code == 0) {
          this.$message.success("计算成功");
          let obj = {};
          res.data.map(v => {
            obj[v.instrument_id] = v;
          });
          this.calData = obj;
        } else {
          this.calData = null;
        }
      });
    },
    //编辑因子
    editFactor(item) {
      this.LinkDialog = true;
      this.linkRuleForm.industry_varieties_id = item.industry_varieties.id;
      this.linkRuleForm.fieldObj = item.cal_list[0].formJson;
      this.get_emission_process_field_list();
    },
    get_emission_process_field_list() {
      emission_process_field_list(`emission_process_type=3`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.factorList = res.data.list.filter(v => v.field_type != 2);
        } else {
          this.factorList = [];
        }
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          for (let key in this.linkRuleForm.fieldObj) {
            // 判断是否能够转成数字
            if (!isNaN(this.linkRuleForm.fieldObj[key])) {
              this.linkRuleForm.fieldObj[key] = Number(this.linkRuleForm.fieldObj[key]);
            }
          }
          if (this.linkRuleForm.industry_varieties_id) {
            let params = {
              industry_varieties_id: this.linkRuleForm.industry_varieties_id,
              data_json: JSON.stringify(this.linkRuleForm.fieldObj)
            };
            factor_history_add(params).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.initPage(this.activeId, this.timestamp);
              }
            });
            return;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.table-box {
  background: #ffffff;
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #e6e6e6;
    > div {
      .source-type {
        display: none;
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
        margin-left: 10px;
        font-size: 12px;
        color: #158ad3;
        background: #dcf1fd;
        border: 1px solid rgb(160 214 247 / 100%);
        border-radius: 4px;
      }
    }
    .edit-yz {
      display: flex;
      align-items: center;
      padding: 3px 7px;
      font-size: 14px;
      color: #1f304c;
      cursor: pointer;
      background: #f9fafb;
      border: 1px solid rgb(222 226 235 / 100%);
      border-radius: 6px;
      > img {
        margin-right: 3px;
      }
    }
  }
  .form-box {
    display: grid;
    grid-template-columns: 120px auto;
    grid-gap: 10px;
    border-bottom: 1px solid #f4f6fa;
    .name-box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 10px;
      font-size: 14px;
      color: #4a5975;
      background-image: linear-gradient(91deg, #fdfdfd 0%, #f9fafb 100%);
      .added {
        color: #0ec69a;
      }
      .no-add {
        color: #fa9e0d;
      }
    }
    > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding-top: 20px;
      > div {
        float: left;
        padding-bottom: 20px;
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
.footer-btn {
  padding: 15px 20px;
  text-align: right;
  background: #ffffff;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.form-box-edit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 10px;
  padding: 20px;
  margin-right: 4%;
  background: #f9fafb;
  border-radius: 10px;
}
</style>
