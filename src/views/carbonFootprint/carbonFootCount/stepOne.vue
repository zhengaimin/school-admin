<template>
  <div class="step-one">
    <div class="step-box">
      <div>
        <span>1</span>
        第一步
      </div>

      <div style="color: #8894b3">
        <span class="next-step">2</span>
        第二步
      </div>
      <div class="line"></div>
    </div>
    <div class="process-box">
      <stepOneProcess @send-node="sendNode" />
    </div>
    <div class="set-box">
      <h1>产品涉及工序排放源百分比设置({{ node.text }})</h1>
      <div class="persent-box" v-for="v in boundaryList" :key="v.id">
        <div class="name-box">
          {{ v.industry_varieties.variety.name }}
          <span>{{ v.boundary_type == 1 ? "直接排放" : "间接排放" }}</span>
        </div>
        <div class="input-box">
          <el-input-number
            :min="0"
            :max="100"
            controls-position="right"
            v-model="v.proportion"
            placeholder="请输入"
            style="width: 100%; margin-right: 10px; text-align: left"
          />%
        </div>
        <div class="used-box">该工序的{{ v.industry_varieties.variety.name }}已分配{{ v.used_proportion }}%</div>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
      <div class="btn-box" style="margin-top: 1px; text-align: center; border-top: 1px solid #e5e5e5">
        <el-button @click="back(0)">返回</el-button>
        <el-button
          :disabled="!(carbonRow.status == 2 || carbonRow.status == 3 || carbonRow.status == 7)"
          type="primary"
          @click="startMath(2)"
        >
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { carbonStore } from "@/stores/modules/carbonFootprint";
import { process_boundary_list } from "@/api/modules/enterpriseSetup.js";
import {
  get_process_energy_proportion,
  set_process_energy_proportion,
  product_carbon_footprint_status,
  product_carbon_footprint_calculate,
  energy_used_proportion
} from "@/api/modules/carbonFootprint.js";
import stepOneProcess from "./stepOneProcess.vue";
import { ElLoading } from "element-plus";
export default {
  components: {
    stepOneProcess
  },
  emits: ["nextStep"],
  data() {
    return {
      carbonStore: {},
      boundaryList: [],
      node: {}
    };
  },
  computed: {
    carbonRow() {
      return this.carbonStore.carbonRow;
    }
  },
  created() {
    this.carbonStore = carbonStore();
  },
  methods: {
    //返回
    back() {
      this.$emit("nextStep", 0);
    },
    //下一步
    startMath(val) {
      product_carbon_footprint_status(`id=${this.carbonRow.id}`).then(res => {
        if (res.code == 0) {
          if (res.data.status == 1) {
            this.$message.warning("请先填写工序能源比例");
          } else if (res.data.status == 2 || res.data.status == 3 || res.data.status == 7) {
            let loading = ElLoading.service({
              lock: true,
              text: "产品能源消耗正在计算中...",
              background: "rgba(0, 0, 0, 0.7)"
            });
            product_carbon_footprint_calculate(`id=${this.carbonRow.id}`).then(res => {
              if (res.code == 0) {
                loading.close();
                this.$emit("nextStep", val);
              }
            });
          } else {
            this.$emit("nextStep", val);
          }
        }
      });
    },
    //保存
    save() {
      let list = [];
      this.boundaryList.map(v => {
        list.push({
          id: v.persentId ? v.persentId : undefined,
          boundary_id: v.id,
          proportion: v.proportion ? Number(v.proportion) : undefined
        });
      });
      let params = {
        id: this.carbonRow.id,
        process_id: Number(this.node.id),
        proportion_list: list
      };
      set_process_energy_proportion(params).then(res => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          product_carbon_footprint_status(`id=${this.carbonRow.id}`).then(res => {
            if (res.code == 0) {
              this.carbonRow.status = res.data.status;
            }
          });
          this.sendNode(this.node);
        }
      });
    },
    sendNode(node) {
      this.node = node;
      console.log(node);
      process_boundary_list(`production_process_id=${node.id}`).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          let boundary_ids = [];
          this.boundaryList = res.data.list;
          this.boundaryList.map(v => {
            boundary_ids.push(v.id);
          });
          this.energy_used_proportion(node, boundary_ids);
          get_process_energy_proportion(`id=${this.carbonRow.id}&process_id=${node.id}`).then(res => {
            if (res.code == 0 && res.data && res.data.length > 0) {
              this.boundaryList.map(v => {
                res.data.map(k => {
                  if (v.id == k.boundary_id) {
                    v.proportion = k.proportion;
                    v.persentId = k.id;
                  }
                });
              });
            } else {
              this.boundaryList.map(v => {
                v.proportion = "";
              });
            }
          });
        } else {
          this.boundaryList = [];
        }
      });
    },
    energy_used_proportion(node, boundary_ids) {
      if (boundary_ids.length == 0) return;
      energy_used_proportion(`year=${this.carbonRow.year}&process_id=${node.id}&boundary_ids=${boundary_ids.join(",")}`).then(
        res => {
          if (res.code == 0 && res.data && res.data.length > 0) {
            this.boundaryList.map(v => {
              res.data.map(k => {
                if (v.id == k.boundary_id) {
                  v.used_proportion = k.used_proportion;
                }
              });
            });
          } else {
            this.boundaryList.map(v => {
              v.used_proportion = 0;
            });
          }
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.step-one {
  height: 100%;
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
  .process-box {
    height: 500px;
    margin-bottom: 10px;
  }
  .set-box {
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
    .persent-box {
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid #dee2eb;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .name-box {
        height: 50px;
        padding: 0 10px 0 20px;
        background: #f9fafb;
        > span {
          padding: 3px 10px;
          margin-left: 20px;
          font-size: 12px;
          color: #158ad3;
          background: #dcf1fd;
          border: 1px solid rgb(160 214 247);
          border-radius: 4px;
        }
      }
      .used-box {
        height: 31px;
        padding-left: 10px;
        margin-right: 15px;
        font-size: 14px;
        color: #37affa;
        background: #dcf1fd;
        border: 1px solid #a0d6f7;
        border-radius: 5px;
      }
      .input-box {
        padding: 0 10px;
        ::v-deep(.el-input-number .el-input__inner) {
          text-align: left;
        }
      }
    }
    .btn-box {
      padding: 15px;
      text-align: right;
    }
  }
}
</style>
